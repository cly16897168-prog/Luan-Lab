const crypto = require("node:crypto");
const fs = require("node:fs/promises");
const http = require("node:http");
const path = require("node:path");
const { URL } = require("node:url");

const PORT = Number(process.env.PORT || 4173);
const DATA_DIR = path.join(__dirname, "data");
const DB_PATH = path.join(DATA_DIR, "db.json");
const DATABASE_URL = process.env.DATABASE_URL;
const PUBLIC_FILES = new Set(["/", "/index.html", "/styles.css", "/app.js"]);
const sessions = new Map();
let pgPool = null;

const defaultAdmin = {
  name: process.env.ADMIN_NAME || "实验室管理员",
  email: (process.env.ADMIN_EMAIL || "admin@lab.local").toLowerCase(),
  password: process.env.ADMIN_PASSWORD || "admin123",
};

function defaultLocations() {
  return [
    { id: "loc-organic", name: "有机试剂柜" },
    { id: "loc-cold", name: "4摄氏度冰箱" },
    { id: "loc-hazard", name: "危化品柜" },
  ];
}

function emptyDb() {
  return {
    users: [],
    locations: defaultLocations(),
    reagents: [],
    history: [],
  };
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${crypto.randomBytes(8).toString("hex")}`;
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 32, "sha256").toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  return hashPassword(password, salt) === `${salt}:${hash}`;
}

async function initStorage() {
  if (!DATABASE_URL) return;
  const { Pool } = require("pg");
  pgPool = new Pool({
    connectionString: DATABASE_URL,
    ssl: process.env.PGSSL === "disable" ? false : { rejectUnauthorized: false },
  });
  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'member',
      status TEXT NOT NULL DEFAULT 'pending',
      created_at BIGINT NOT NULL,
      approved_at BIGINT,
      approved_by TEXT
    );

    CREATE TABLE IF NOT EXISTS locations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reagents (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      cas TEXT,
      catalog_number TEXT,
      batch TEXT,
      total_amount DOUBLE PRECISION NOT NULL,
      quantity DOUBLE PRECISION NOT NULL,
      unit TEXT NOT NULL,
      type TEXT NOT NULL,
      threshold DOUBLE PRECISION NOT NULL,
      received_date TEXT NOT NULL,
      expiry_date TEXT NOT NULL,
      location_id TEXT NOT NULL,
      risk TEXT NOT NULL,
      owner TEXT,
      note TEXT,
      created_at BIGINT NOT NULL,
      created_by TEXT
    );

    CREATE TABLE IF NOT EXISTS history (
      id TEXT PRIMARY KEY,
      reagent_id TEXT NOT NULL,
      reagent_name TEXT NOT NULL,
      action TEXT NOT NULL,
      amount DOUBLE PRECISION NOT NULL,
      unit TEXT NOT NULL,
      remaining DOUBLE PRECISION NOT NULL,
      actor_id TEXT,
      actor_name TEXT,
      created_at BIGINT NOT NULL
    );
  `);
}

async function readDb() {
  if (pgPool) return readPgDb();

  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    const db = JSON.parse(raw);
    return {
      ...emptyDb(),
      ...db,
      locations: db.locations?.length ? db.locations : defaultLocations(),
      users: db.users || [],
      reagents: db.reagents || [],
      history: db.history || [],
    };
  } catch {
    return emptyDb();
  }
}

async function writeDb(db) {
  if (pgPool) return writePgDb(db);

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}

async function readPgDb() {
  const [usersResult, locationsResult, reagentsResult, historyResult] = await Promise.all([
    pgPool.query("SELECT * FROM users ORDER BY created_at ASC"),
    pgPool.query("SELECT * FROM locations ORDER BY name ASC"),
    pgPool.query("SELECT * FROM reagents ORDER BY created_at DESC"),
    pgPool.query("SELECT * FROM history ORDER BY created_at DESC"),
  ]);

  return {
    users: usersResult.rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      passwordHash: row.password_hash,
      role: row.role,
      status: row.status,
      createdAt: Number(row.created_at),
      approvedAt: row.approved_at == null ? undefined : Number(row.approved_at),
      approvedBy: row.approved_by || undefined,
    })),
    locations: locationsResult.rows.length ? locationsResult.rows.map((row) => ({ id: row.id, name: row.name })) : defaultLocations(),
    reagents: reagentsResult.rows.map((row) => ({
      id: row.id,
      name: row.name,
      cas: row.cas || "",
      catalogNumber: row.catalog_number || "",
      batch: row.batch || "",
      totalAmount: Number(row.total_amount),
      quantity: Number(row.quantity),
      unit: row.unit,
      type: row.type,
      threshold: Number(row.threshold),
      receivedDate: row.received_date,
      expiryDate: row.expiry_date,
      locationId: row.location_id,
      risk: row.risk,
      owner: row.owner || "",
      note: row.note || "",
      createdAt: Number(row.created_at),
      createdBy: row.created_by || undefined,
    })),
    history: historyResult.rows.map((row) => ({
      id: row.id,
      reagentId: row.reagent_id,
      reagentName: row.reagent_name,
      action: row.action,
      amount: Number(row.amount),
      unit: row.unit,
      remaining: Number(row.remaining),
      actorId: row.actor_id || undefined,
      actorName: row.actor_name || "",
      createdAt: Number(row.created_at),
    })),
  };
}

async function writePgDb(db) {
  const client = await pgPool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM history");
    await client.query("DELETE FROM reagents");
    await client.query("DELETE FROM locations");
    await client.query("DELETE FROM users");

    for (const user of db.users) {
      await client.query(
        `INSERT INTO users (id, name, email, password_hash, role, status, created_at, approved_at, approved_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          user.id,
          user.name,
          user.email,
          user.passwordHash,
          user.role,
          user.status,
          user.createdAt,
          user.approvedAt || null,
          user.approvedBy || null,
        ],
      );
    }

    for (const location of db.locations) {
      await client.query("INSERT INTO locations (id, name) VALUES ($1, $2)", [location.id, location.name]);
    }

    for (const reagent of db.reagents) {
      await client.query(
        `INSERT INTO reagents (
          id, name, cas, catalog_number, batch, total_amount, quantity, unit, type, threshold,
          received_date, expiry_date, location_id, risk, owner, note, created_at, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
        [
          reagent.id,
          reagent.name,
          reagent.cas || "",
          reagent.catalogNumber || "",
          reagent.batch || "",
          reagent.totalAmount,
          reagent.quantity,
          reagent.unit,
          reagent.type,
          reagent.threshold,
          reagent.receivedDate,
          reagent.expiryDate,
          reagent.locationId,
          reagent.risk,
          reagent.owner || "",
          reagent.note || "",
          reagent.createdAt,
          reagent.createdBy || null,
        ],
      );
    }

    for (const item of db.history) {
      await client.query(
        `INSERT INTO history (id, reagent_id, reagent_name, action, amount, unit, remaining, actor_id, actor_name, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          item.id,
          item.reagentId,
          item.reagentName,
          item.action,
          item.amount,
          item.unit,
          item.remaining,
          item.actorId || null,
          item.actorName || "",
          item.createdAt,
        ],
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function ensureAdmin() {
  const db = await readDb();
  const exists = db.users.some((user) => user.email === defaultAdmin.email);
  if (!exists) {
    db.users.push({
      id: createId("user"),
      name: defaultAdmin.name,
      email: defaultAdmin.email,
      passwordHash: hashPassword(defaultAdmin.password),
      role: "admin",
      status: "approved",
      createdAt: Date.now(),
      approvedAt: Date.now(),
    });
    await writeDb(db);
    console.log(`Default admin created: ${defaultAdmin.email} / ${defaultAdmin.password}`);
  }
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
  };
}

function parseCookies(header = "") {
  return Object.fromEntries(
    header
      .split(";")
      .map((item) => item.trim().split("="))
      .filter(([key, value]) => key && value)
      .map(([key, value]) => [key, decodeURIComponent(value)]),
  );
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function send(res, status, payload, headers = {}) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    ...headers,
  });
  res.end(JSON.stringify(payload));
}

function sendError(res, status, message) {
  send(res, status, { error: message });
}

function getSessionUser(req, db) {
  const { session } = parseCookies(req.headers.cookie);
  if (!session) return null;
  const sessionUser = sessions.get(session);
  if (!sessionUser) return null;
  return db.users.find((user) => user.id === sessionUser.id && user.status === "approved") || null;
}

function requireUser(req, res, db) {
  const user = getSessionUser(req, db);
  if (!user) {
    sendError(res, 401, "请先登录。");
    return null;
  }
  return user;
}

function requireAdmin(req, res, db) {
  const user = requireUser(req, res, db);
  if (!user) return null;
  if (user.role !== "admin") {
    sendError(res, 403, "需要管理员权限。");
    return null;
  }
  return user;
}

function sanitizeText(value) {
  return String(value || "").trim();
}

function getDateOffset(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function demoData() {
  return {
    locations: [
      { id: "loc-organic", name: "有机试剂柜" },
      { id: "loc-cold", name: "4摄氏度冰箱" },
      { id: "loc-hazard", name: "危化品柜" },
      { id: "loc-balance", name: "天平室干燥柜" },
    ],
    reagents: [
      {
        id: "reagent-ethanol",
        name: "无水乙醇",
        cas: "64-17-5",
        catalogNumber: "E7023-500ML",
        batch: "LOT-2026-0318",
        totalAmount: 500,
        quantity: 480,
        unit: "mL",
        type: "solution",
        threshold: 500,
        receivedDate: getDateOffset(-45),
        expiryDate: getDateOffset(180),
        locationId: "loc-hazard",
        risk: "flammable",
        owner: "陈老师",
        note: "开封后请记录领用量",
        createdAt: Date.now(),
      },
      {
        id: "reagent-hcl",
        name: "盐酸",
        cas: "7647-01-0",
        catalogNumber: "H1758-1L",
        batch: "HCL-2409",
        totalAmount: 1.5,
        quantity: 1.2,
        unit: "L",
        type: "solution",
        threshold: 0.5,
        receivedDate: getDateOffset(-80),
        expiryDate: getDateOffset(18),
        locationId: "loc-hazard",
        risk: "corrosive",
        owner: "李博士",
        note: "需佩戴护目镜和耐酸手套",
        createdAt: Date.now(),
      },
      {
        id: "reagent-buffer",
        name: "PBS缓冲液",
        cas: "",
        catalogNumber: "PBS-100",
        batch: "PBS-0526",
        totalAmount: 10,
        quantity: 6,
        unit: "瓶",
        type: "solution",
        threshold: 2,
        receivedDate: getDateOffset(-10),
        expiryDate: getDateOffset(9),
        locationId: "loc-cold",
        risk: "low",
        owner: "王同学",
        note: "细胞房专用",
        createdAt: Date.now(),
      },
    ],
  };
}

async function handleApi(req, res, pathname) {
  const db = await readDb();

  if (req.method === "POST" && pathname === "/api/register") {
    const body = await readJson(req);
    const name = sanitizeText(body.name);
    const email = sanitizeText(body.email).toLowerCase();
    const password = String(body.password || "");
    if (!name || !email || password.length < 6) return sendError(res, 400, "姓名、邮箱和至少6位密码必填。");
    if (db.users.some((user) => user.email === email)) return sendError(res, 409, "这个邮箱已经注册。");
    db.users.push({
      id: createId("user"),
      name,
      email,
      passwordHash: hashPassword(password),
      role: "member",
      status: "pending",
      createdAt: Date.now(),
    });
    await writeDb(db);
    return send(res, 201, { ok: true });
  }

  if (req.method === "POST" && pathname === "/api/login") {
    const body = await readJson(req);
    const email = sanitizeText(body.email).toLowerCase();
    const user = db.users.find((item) => item.email === email);
    if (!user || !verifyPassword(String(body.password || ""), user.passwordHash)) {
      return sendError(res, 401, "邮箱或密码不正确。");
    }
    if (user.status !== "approved") {
      return sendError(res, 403, "账号还在等待管理员批准。");
    }
    const token = crypto.randomBytes(24).toString("hex");
    sessions.set(token, { id: user.id, createdAt: Date.now() });
    return send(res, 200, { user: publicUser(user) }, { "Set-Cookie": `session=${token}; HttpOnly; SameSite=Lax; Path=/` });
  }

  if (req.method === "POST" && pathname === "/api/logout") {
    const { session } = parseCookies(req.headers.cookie);
    if (session) sessions.delete(session);
    return send(res, 200, { ok: true }, { "Set-Cookie": "session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0" });
  }

  if (req.method === "GET" && pathname === "/api/session") {
    const user = requireUser(req, res, db);
    if (!user) return;
    return send(res, 200, { user: publicUser(user) });
  }

  if (req.method === "GET" && pathname === "/api/data") {
    const user = requireUser(req, res, db);
    if (!user) return;
    return send(res, 200, { locations: db.locations, reagents: db.reagents, history: db.history });
  }

  if (req.method === "GET" && pathname === "/api/admin/users") {
    const admin = requireAdmin(req, res, db);
    if (!admin) return;
    return send(res, 200, { users: db.users.map(publicUser) });
  }

  const approveMatch = pathname.match(/^\/api\/admin\/users\/([^/]+)\/approve$/);
  if (req.method === "POST" && approveMatch) {
    const admin = requireAdmin(req, res, db);
    if (!admin) return;
    const user = db.users.find((item) => item.id === approveMatch[1]);
    if (!user) return sendError(res, 404, "用户不存在。");
    user.status = "approved";
    user.approvedAt = Date.now();
    user.approvedBy = admin.id;
    await writeDb(db);
    return send(res, 200, { user: publicUser(user) });
  }

  if (req.method === "POST" && pathname === "/api/locations") {
    const user = requireUser(req, res, db);
    if (!user) return;
    const body = await readJson(req);
    const name = sanitizeText(body.name);
    if (!name) return sendError(res, 400, "存储位置不能为空。");
    db.locations.push({ id: createId("loc"), name });
    await writeDb(db);
    return send(res, 201, { ok: true });
  }

  if (req.method === "POST" && pathname === "/api/reagents") {
    const user = requireUser(req, res, db);
    if (!user) return;
    const body = await readJson(req);
    const reagent = {
      id: createId("reagent"),
      name: sanitizeText(body.name),
      cas: sanitizeText(body.cas),
      catalogNumber: sanitizeText(body.catalogNumber),
      batch: sanitizeText(body.batch),
      totalAmount: Number(body.totalAmount),
      quantity: Number(body.quantity),
      unit: sanitizeText(body.unit),
      type: sanitizeText(body.type),
      threshold: Number(body.threshold),
      receivedDate: sanitizeText(body.receivedDate),
      expiryDate: sanitizeText(body.expiryDate),
      locationId: sanitizeText(body.locationId),
      risk: sanitizeText(body.risk),
      owner: sanitizeText(body.owner),
      note: sanitizeText(body.note),
      createdAt: Date.now(),
      createdBy: user.id,
    };
    if (!reagent.name || !reagent.unit || !reagent.receivedDate || !reagent.expiryDate || !reagent.locationId) {
      return sendError(res, 400, "试剂名称、单位、日期和存储位置必填。");
    }
    if (![reagent.totalAmount, reagent.quantity, reagent.threshold].every(Number.isFinite)) {
      return sendError(res, 400, "数量和预警线必须是数字。");
    }
    db.reagents.push(reagent);
    await writeDb(db);
    return send(res, 201, { reagent });
  }

  const adjustMatch = pathname.match(/^\/api\/reagents\/([^/]+)\/adjust$/);
  if (req.method === "POST" && adjustMatch) {
    const user = requireUser(req, res, db);
    if (!user) return;
    const body = await readJson(req);
    const amount = Number(body.amount);
    const action = body.action === "入库" ? "入库" : "领用";
    const reagent = db.reagents.find((item) => item.id === adjustMatch[1]);
    if (!reagent) return sendError(res, 404, "试剂不存在。");
    if (!Number.isFinite(amount) || amount <= 0) return sendError(res, 400, "使用量必须大于0。");
    reagent.quantity = action === "领用" ? Math.max(0, Number(reagent.quantity) - amount) : Number(reagent.quantity) + amount;
    db.history.push({
      id: createId("history"),
      reagentId: reagent.id,
      reagentName: reagent.name,
      action,
      amount,
      unit: reagent.unit,
      remaining: reagent.quantity,
      actorId: user.id,
      actorName: user.name,
      createdAt: Date.now(),
    });
    await writeDb(db);
    return send(res, 200, { reagent });
  }

  if (req.method === "POST" && pathname === "/api/seed") {
    const user = requireUser(req, res, db);
    if (!user) return;
    const demo = demoData();
    db.locations = demo.locations;
    db.reagents = demo.reagents;
    db.history = [];
    await writeDb(db);
    return send(res, 200, { ok: true });
  }

  if (req.method === "POST" && pathname === "/api/reset") {
    const admin = requireAdmin(req, res, db);
    if (!admin) return;
    db.locations = defaultLocations();
    db.reagents = [];
    db.history = [];
    await writeDb(db);
    return send(res, 200, { ok: true });
  }

  return sendError(res, 404, "接口不存在。");
}

async function serveStatic(res, pathname) {
  const filePath = pathname === "/" ? path.join(__dirname, "index.html") : path.join(__dirname, pathname.slice(1));
  const ext = path.extname(filePath);
  const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8" };
  const content = await fs.readFile(filePath);
  res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
  res.end(content);
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (req.method === "GET" && url.pathname === "/healthz") {
      send(res, 200, { ok: true, storage: DATABASE_URL ? "postgresql" : "json" });
      return;
    }
    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url.pathname);
      return;
    }
    if (!PUBLIC_FILES.has(url.pathname)) {
      sendError(res, 404, "页面不存在。");
      return;
    }
    await serveStatic(res, url.pathname);
  } catch (error) {
    console.error(error);
    sendError(res, 500, "服务器错误。");
  }
});

initStorage().then(ensureAdmin).then(() => {
  server.listen(PORT, () => {
    console.log(`Lab reagent monitor running at http://localhost:${PORT}`);
    console.log(DATABASE_URL ? "Storage: PostgreSQL" : "Storage: local JSON file");
  });
});
