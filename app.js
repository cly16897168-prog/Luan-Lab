const EXPIRING_DAYS = 30;
const LANGUAGE_KEY = "lab-reagent-language";

const translations = {
  zh: {
    appTitle: "实验室试剂监控系统",
    languageToggle: "English",
    loadDemo: "载入示例",
    clearData: "清空数据",
    logout: "退出登录",
    authHeadline: "登录后访问实验室试剂库存",
    authSubhead: "新账号注册后会进入待审批状态，管理员批准后才能登录和修改试剂数据。",
    login: "登录",
    registerRequest: "注册申请",
    email: "邮箱",
    password: "密码",
    name: "姓名",
    namePlaceholder: "例如 王同学",
    submitRegister: "提交注册申请",
    registrationApproval: "注册审批",
    adminOnly: "只有管理员可见",
    totalReagents: "试剂总数",
    lowStock: "低库存",
    expiringSoon: "30天内到期",
    expired: "已过期",
    hazardous: "危险品",
    storageLocations: "存放点",
    addReagent: "录入试剂",
    reagentName: "试剂名称",
    reagentNamePlaceholder: "例如 无水乙醇",
    cas: "CAS号",
    casPlaceholder: "例如 64-17-5",
    catalogNumber: "Catalog Number",
    batch: "批号",
    batchPlaceholder: "例如 LOT-2026-0318",
    totalAmount: "存入总量",
    currentQuantity: "当前余量",
    unit: "单位",
    unitBottle: "瓶",
    unitBox: "盒",
    reagentType: "试剂类型",
    typeSolution: "溶液",
    typePowder: "粉末",
    typeSolid: "固体",
    typeConsumable: "耗材",
    typeOther: "其他",
    threshold: "预警线",
    receivedDate: "入库日期",
    expiryDate: "有效期",
    storageLocation: "存储位置",
    riskLevel: "风险等级",
    riskLow: "普通",
    riskIrritant: "刺激性",
    riskFlammable: "易燃",
    riskCorrosive: "腐蚀性",
    riskToxic: "有毒",
    owner: "负责人",
    ownerPlaceholder: "例如 陈老师",
    note: "备注",
    notePlaceholder: "开封日期、供应商、特殊要求等",
    submitReagent: "添加试剂",
    inventoryBoard: "库存看板",
    searchPlaceholder: "搜索名称、CAS号、Catalog Number、批号或负责人",
    allLocations: "全部位置",
    allTypes: "全部类型",
    allRisks: "全部风险",
    allStatuses: "全部状态",
    expiringStatus: "即将到期",
    statusOk: "状态正常",
    riskAlerts: "风险告警",
    history: "流转记录",
    locationPlaceholder: "例如 有机试剂柜 / 4摄氏度冰箱 / 危化品柜",
    addLocation: "添加位置",
    admin: "管理员",
    member: "成员",
    updated: "更新",
    noMatchingReagents: "没有符合条件的试剂。",
    unassigned: "未分配",
    expiryPrefix: "有效期",
    receivedPrefix: "入库",
    totalStoredPrefix: "存入总量",
    batchPrefix: "批号",
    notFilled: "未填",
    daysExpired: "已过期 {days}天",
    daysToExpire: "{days}天后到期",
    lowStockAlert: "库存低于阈值",
    toxicReview: "有毒试剂需双人复核",
    normalStatus: "状态正常",
    consume: "领用",
    restock: "入库",
    adjustQuantity: "调整数量",
    quantityLine: "余量 {quantity} {unit} / 预警线 {threshold} {unit}",
    noAlerts: "当前没有试剂告警。",
    noHistory: "还没有领用或入库记录。",
    remaining: "剩余",
    unknownUser: "未知用户",
    noPendingUsers: "当前没有待审批用户。",
    approve: "批准",
    speciesCount: "{count}种",
    pleaseAddLocation: "请先添加存放位置。",
    registerSubmitted: "注册申请已提交，请等待管理员批准。",
    confirmReset: "确定清空所有试剂、位置和流转记录吗？",
    requestFailed: "请求失败",
    navDashboard: "看板",
    navReagents: "试剂查看",
    navReports: "报表",
    navEntry: "试剂录入",
    navRecords: "使用记录",
    navSettings: "设置",
    reagentCategories: "试剂分类",
    weeklyReport: "每周使用情况",
    monthlyReport: "每月使用情况",
    settingsLanguage: "语言设置",
    dataRecovery: "数据恢复",
    createBackup: "创建备份",
    restoreBackup: "恢复",
    noBackups: "还没有备份。",
    backupCreated: "备份已创建。",
    confirmRestore: "确定恢复到这个备份吗？当前数据会先自动备份。",
    reportEmpty: "还没有使用记录。",
    reportTotal: "总用量",
    loc4cShelf: "4度冰箱 {n}层",
    loc4cDoor: "4度冰箱门 {n}层",
    loc20Shelf: "-20度冰箱 {n}层",
    loc80Shelf: "-80度冰箱 {n}层",
    locCabinet1: "存储柜1 {n}层",
    locCabinet2: "存储柜2 {n}层",
  },
  en: {
    appTitle: "Lab Reagent Monitoring System",
    languageToggle: "中文",
    loadDemo: "Load Demo",
    clearData: "Clear Data",
    logout: "Log Out",
    authHeadline: "Sign in to access lab reagent inventory",
    authSubhead: "New accounts stay pending until an administrator approves them.",
    login: "Sign In",
    registerRequest: "Registration Request",
    email: "Email",
    password: "Password",
    name: "Name",
    namePlaceholder: "e.g. Alex Wang",
    submitRegister: "Submit Request",
    registrationApproval: "Registration Approval",
    adminOnly: "Visible to administrators only",
    totalReagents: "Total Reagents",
    lowStock: "Low Stock",
    expiringSoon: "Expiring in 30 Days",
    expired: "Expired",
    hazardous: "Hazardous",
    storageLocations: "Storage Locations",
    addReagent: "Add Reagent",
    reagentName: "Reagent Name",
    reagentNamePlaceholder: "e.g. Absolute Ethanol",
    cas: "CAS Number",
    casPlaceholder: "e.g. 64-17-5",
    catalogNumber: "Catalog Number",
    batch: "Batch / Lot",
    batchPlaceholder: "e.g. LOT-2026-0318",
    totalAmount: "Initial Amount",
    currentQuantity: "Current Quantity",
    unit: "Unit",
    unitBottle: "bottle",
    unitBox: "box",
    reagentType: "Reagent Type",
    typeSolution: "Solution",
    typePowder: "Powder",
    typeSolid: "Solid",
    typeConsumable: "Consumable",
    typeOther: "Other",
    threshold: "Alert Threshold",
    receivedDate: "Received Date",
    expiryDate: "Expiration Date",
    storageLocation: "Storage Location",
    riskLevel: "Risk Level",
    riskLow: "General",
    riskIrritant: "Irritant",
    riskFlammable: "Flammable",
    riskCorrosive: "Corrosive",
    riskToxic: "Toxic",
    owner: "Owner",
    ownerPlaceholder: "e.g. Dr. Chen",
    note: "Notes",
    notePlaceholder: "Opened date, supplier, special requirements, etc.",
    submitReagent: "Add Reagent",
    inventoryBoard: "Inventory Board",
    searchPlaceholder: "Search name, CAS, Catalog Number, batch, or owner",
    allLocations: "All Locations",
    allTypes: "All Types",
    allRisks: "All Risks",
    allStatuses: "All Statuses",
    expiringStatus: "Expiring Soon",
    statusOk: "Normal",
    riskAlerts: "Risk Alerts",
    history: "Activity History",
    locationPlaceholder: "e.g. Organic cabinet / 4°C fridge / Hazard cabinet",
    addLocation: "Add Location",
    admin: "Admin",
    member: "Member",
    updated: "Updated",
    noMatchingReagents: "No matching reagents.",
    unassigned: "Unassigned",
    expiryPrefix: "Expires",
    receivedPrefix: "Received",
    totalStoredPrefix: "Initial amount",
    batchPrefix: "Batch",
    notFilled: "Not provided",
    daysExpired: "Expired {days} days",
    daysToExpire: "Expires in {days} days",
    lowStockAlert: "Below alert threshold",
    toxicReview: "Toxic reagent requires dual review",
    normalStatus: "Normal",
    consume: "Use",
    restock: "Restock",
    adjustQuantity: "Adjust quantity",
    quantityLine: "Remaining {quantity} {unit} / Alert {threshold} {unit}",
    noAlerts: "No reagent alerts.",
    noHistory: "No use or restock records yet.",
    remaining: "Remaining",
    unknownUser: "Unknown user",
    noPendingUsers: "No pending users.",
    approve: "Approve",
    speciesCount: "{count} items",
    pleaseAddLocation: "Please add a storage location first.",
    registerSubmitted: "Registration request submitted. Please wait for administrator approval.",
    confirmReset: "Clear all reagents, locations, and activity records?",
    requestFailed: "Request failed",
    navDashboard: "Dashboard",
    navReagents: "Reagents",
    navReports: "Reports",
    navEntry: "Reagent Entry",
    navRecords: "Usage Records",
    navSettings: "Settings",
    reagentCategories: "Reagent Categories",
    weeklyReport: "Weekly Usage",
    monthlyReport: "Monthly Usage",
    settingsLanguage: "Language",
    dataRecovery: "Data Recovery",
    createBackup: "Create Backup",
    restoreBackup: "Restore",
    noBackups: "No backups yet.",
    backupCreated: "Backup created.",
    confirmRestore: "Restore this backup? Current data will be backed up first.",
    reportEmpty: "No usage records yet.",
    reportTotal: "Total used",
    loc4cShelf: "4C fridge shelf {n}",
    loc4cDoor: "4C fridge door shelf {n}",
    loc20Shelf: "-20C freezer shelf {n}",
    loc80Shelf: "-80C freezer shelf {n}",
    locCabinet1: "Storage cabinet 1 shelf {n}",
    locCabinet2: "Storage cabinet 2 shelf {n}",
  },
};

let currentLanguage = localStorage.getItem(LANGUAGE_KEY) || "zh";

let currentUser = null;
let state = { locations: [], reagents: [], history: [] };

const els = {
  authView: document.querySelector("#authView"),
  appView: document.querySelector("#appView"),
  adminPanel: document.querySelector("#adminPanel"),
  pendingUsers: document.querySelector("#pendingUsers"),
  currentUser: document.querySelector("#currentUser"),
  authMessage: document.querySelector("#authMessage"),
  loginForm: document.querySelector("#loginForm"),
  loginEmail: document.querySelector("#loginEmail"),
  loginPassword: document.querySelector("#loginPassword"),
  registerForm: document.querySelector("#registerForm"),
  registerName: document.querySelector("#registerName"),
  registerEmail: document.querySelector("#registerEmail"),
  registerPassword: document.querySelector("#registerPassword"),
  logoutBtn: document.querySelector("#logoutBtn"),
  languageToggle: document.querySelector("#languageToggle"),
  reagentForm: document.querySelector("#reagentForm"),
  reagentName: document.querySelector("#reagentName"),
  reagentCas: document.querySelector("#reagentCas"),
  reagentCatalog: document.querySelector("#reagentCatalog"),
  reagentBatch: document.querySelector("#reagentBatch"),
  reagentTotalAmount: document.querySelector("#reagentTotalAmount"),
  reagentQuantity: document.querySelector("#reagentQuantity"),
  reagentUnit: document.querySelector("#reagentUnit"),
  reagentType: document.querySelector("#reagentType"),
  reagentThreshold: document.querySelector("#reagentThreshold"),
  reagentReceivedDate: document.querySelector("#reagentReceivedDate"),
  reagentExpiry: document.querySelector("#reagentExpiry"),
  reagentLocation: document.querySelector("#reagentLocation"),
  reagentRisk: document.querySelector("#reagentRisk"),
  reagentOwner: document.querySelector("#reagentOwner"),
  reagentNote: document.querySelector("#reagentNote"),
  reagentBoard: document.querySelector("#reagentBoard"),
  searchInput: document.querySelector("#searchInput"),
  locationFilter: document.querySelector("#locationFilter"),
  typeFilter: document.querySelector("#typeFilter"),
  riskFilter: document.querySelector("#riskFilter"),
  statusFilter: document.querySelector("#statusFilter"),
  locationForm: document.querySelector("#locationForm"),
  locationName: document.querySelector("#locationName"),
  locationList: document.querySelector("#locationList"),
  alertList: document.querySelector("#alertList"),
  historyList: document.querySelector("#historyList"),
  lastUpdated: document.querySelector("#lastUpdated"),
  seedDemoBtn: document.querySelector("#seedDemoBtn"),
  resetBtn: document.querySelector("#resetBtn"),
  navTabs: document.querySelectorAll("[data-view-target]"),
  appViews: document.querySelectorAll("[data-view]"),
  typeSummary: document.querySelector("#typeSummary"),
  weeklyReport: document.querySelector("#weeklyReport"),
  monthlyReport: document.querySelector("#monthlyReport"),
  settingsLanguageToggle: document.querySelector("#settingsLanguageToggle"),
  backupTools: document.querySelector("#backupTools"),
  createBackupBtn: document.querySelector("#createBackupBtn"),
  backupList: document.querySelector("#backupList"),
  totalReagents: document.querySelector("#totalReagents"),
  lowStockCount: document.querySelector("#lowStockCount"),
  expiringCount: document.querySelector("#expiringCount"),
  expiredCount: document.querySelector("#expiredCount"),
  hazardCount: document.querySelector("#hazardCount"),
  locationCount: document.querySelector("#locationCount"),
};

let activeView = "dashboard";

function t(key, params = {}) {
  const template = translations[currentLanguage][key] || translations.zh[key] || key;
  return Object.entries(params).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, value), template);
}

function riskLabel(value) {
  return (
    {
      low: t("riskLow"),
      irritant: t("riskIrritant"),
      flammable: t("riskFlammable"),
      corrosive: t("riskCorrosive"),
      toxic: t("riskToxic"),
    }[value] || t("riskLow")
  );
}

function typeLabel(value) {
  return (
    {
      solution: t("typeSolution"),
      powder: t("typePowder"),
      solid: t("typeSolid"),
      consumable: t("typeConsumable"),
      other: t("typeOther"),
    }[value] || t("typeOther")
  );
}

function locationLabel(location) {
  const id = typeof location === "string" ? location : location?.id;
  const fallback = typeof location === "string" ? location : location?.name;
  const patterns = [
    [/^loc-fridge-4c-shelf-(\d+)$/, "loc4cShelf"],
    [/^loc-fridge-4c-door-(\d+)$/, "loc4cDoor"],
    [/^loc-freezer-20-shelf-(\d+)$/, "loc20Shelf"],
    [/^loc-freezer-80-shelf-(\d+)$/, "loc80Shelf"],
    [/^loc-cabinet-1-shelf-(\d+)$/, "locCabinet1"],
    [/^loc-cabinet-2-shelf-(\d+)$/, "locCabinet2"],
  ];
  for (const [pattern, key] of patterns) {
    const match = id?.match(pattern);
    if (match) return t(key, { n: match[1] });
  }
  return fallback || t("unassigned");
}

function applyTranslations() {
  document.documentElement.lang = currentLanguage === "zh" ? "zh-CN" : "en";
  document.title = t("appTitle");
  els.languageToggle.textContent = t("languageToggle");
  if (els.settingsLanguageToggle) els.settingsLanguageToggle.textContent = t("languageToggle");

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.setAttribute("placeholder", t(node.dataset.i18nPlaceholder));
  });
  if (currentUser) showApp();
  if (state.locations) render();
}

function switchView(view) {
  activeView = view;
  els.navTabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.viewTarget === view));
  els.appViews.forEach((panel) => panel.classList.toggle("is-hidden", panel.dataset.view !== view));
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || t("requestFailed"));
  }
  return data;
}

function setAuthMessage(message, isError = false) {
  els.authMessage.textContent = message;
  els.authMessage.classList.toggle("error", isError);
}

function showApp() {
  els.authView.classList.add("is-hidden");
  els.appView.classList.remove("is-hidden");
  document.querySelectorAll(".app-only").forEach((item) => item.classList.remove("is-hidden"));
  els.currentUser.textContent = `${currentUser.name} · ${currentUser.role === "admin" ? t("admin") : t("member")}`;
  els.adminPanel.classList.toggle("is-hidden", currentUser.role !== "admin");
  if (els.backupTools) els.backupTools.classList.toggle("is-hidden", currentUser.role !== "admin");
}

function showAuth() {
  els.authView.classList.remove("is-hidden");
  els.appView.classList.add("is-hidden");
  document.querySelectorAll(".app-only").forEach((item) => item.classList.add("is-hidden"));
  els.currentUser.textContent = "";
}

async function loadSession() {
  try {
    const data = await api("/api/session");
    currentUser = data.user;
    showApp();
    await refreshData();
    if (currentUser.role === "admin") await loadPendingUsers();
    if (currentUser.role === "admin") await loadBackups();
  } catch {
    currentUser = null;
    showAuth();
  }
}

async function refreshData() {
  state = await api("/api/data");
  render();
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatTime(value) {
  return new Intl.DateTimeFormat(currentLanguage === "zh" ? "zh-CN" : "en-US", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatDate(value) {
  return new Intl.DateTimeFormat(currentLanguage === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(`${value}T00:00:00`));
}

function daysUntil(dateValue) {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const target = new Date(`${dateValue}T00:00:00`);
  return Math.ceil((target - start) / 86400000);
}

function getLocationName(locationId) {
  const location = state.locations.find((item) => item.id === locationId);
  return location ? locationLabel(location) : t("unassigned");
}

function reagentStatus(reagent) {
  const days = daysUntil(reagent.expiryDate);
  return {
    isLow: Number(reagent.quantity) <= Number(reagent.threshold),
    isExpired: days < 0,
    isExpiring: days >= 0 && days <= EXPIRING_DAYS,
    days,
  };
}

function isHazardous(reagent) {
  return reagent.risk !== "low";
}

function renderLocationOptions() {
  const options = state.locations
    .map((location) => `<option value="${location.id}">${escapeHtml(locationLabel(location))}</option>`)
    .join("");

  els.reagentLocation.innerHTML = options;
  els.locationFilter.innerHTML = `<option value="all">${t("allLocations")}</option>${options}`;
}

function renderLocations() {
  els.locationList.innerHTML = state.locations
    .map((location) => {
      const count = state.reagents.filter((reagent) => reagent.locationId === location.id).length;
      return `<span class="location-chip">${escapeHtml(locationLabel(location))} · ${t("speciesCount", { count })}</span>`;
    })
    .join("");
}

function renderSummary() {
  const stats = state.reagents.reduce(
    (acc, reagent) => {
      const status = reagentStatus(reagent);
      acc.low += status.isLow ? 1 : 0;
      acc.expired += status.isExpired ? 1 : 0;
      acc.expiring += !status.isExpired && status.isExpiring ? 1 : 0;
      acc.hazard += isHazardous(reagent) ? 1 : 0;
      return acc;
    },
    { low: 0, expired: 0, expiring: 0, hazard: 0 },
  );

  els.totalReagents.textContent = state.reagents.length;
  els.lowStockCount.textContent = stats.low;
  els.expiringCount.textContent = stats.expiring;
  els.expiredCount.textContent = stats.expired;
  els.hazardCount.textContent = stats.hazard;
  els.locationCount.textContent = state.locations.length;
  els.lastUpdated.textContent = `${t("updated")} ${formatTime(Date.now())}`;
}

function renderTypeSummary() {
  const types = ["solution", "powder", "solid", "consumable", "other"];
  els.typeSummary.innerHTML = types
    .map((type) => {
      const count = state.reagents.filter((reagent) => reagent.type === type).length;
      return `
        <button class="category-card" type="button" data-type-jump="${type}">
          <span>${typeLabel(type)}</span>
          <strong>${count}</strong>
        </button>
      `;
    })
    .join("");
}

function periodStart(value, mode) {
  const date = new Date(value);
  if (mode === "week") {
    const day = date.getDay() || 7;
    date.setDate(date.getDate() - day + 1);
  } else {
    date.setDate(1);
  }
  date.setHours(0, 0, 0, 0);
  return date;
}

function periodLabel(value, mode) {
  const date = periodStart(value, mode);
  if (mode === "week") {
    const end = new Date(date);
    end.setDate(end.getDate() + 6);
    return `${formatDate(date.toISOString().slice(0, 10))} - ${formatDate(end.toISOString().slice(0, 10))}`;
  }
  return new Intl.DateTimeFormat(currentLanguage === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "long",
  }).format(date);
}

function renderReport(container, mode) {
  const usage = state.history.filter((item) => item.action === "领用");
  if (!usage.length) {
    container.innerHTML = `<p class="empty-state">${t("reportEmpty")}</p>`;
    return;
  }

  const groups = usage.reduce((acc, item) => {
    const key = periodStart(item.createdAt, mode).toISOString();
    if (!acc[key]) acc[key] = {};
    const reagentKey = `${item.reagentName}__${item.unit}`;
    acc[key][reagentKey] = acc[key][reagentKey] || { reagentName: item.reagentName, unit: item.unit, amount: 0 };
    acc[key][reagentKey].amount += Number(item.amount);
    return acc;
  }, {});

  els[mode === "week" ? "weeklyReport" : "monthlyReport"].innerHTML = Object.entries(groups)
    .sort(([a], [b]) => new Date(b) - new Date(a))
    .slice(0, 12)
    .map(([period, items]) => {
      const rows = Object.values(items)
        .sort((a, b) => b.amount - a.amount)
        .map(
          (item) => `
            <div class="report-row">
              <span>${escapeHtml(item.reagentName)}</span>
              <strong>${t("reportTotal")} ${formatNumber(item.amount)} ${escapeHtml(item.unit)}</strong>
            </div>
          `,
        )
        .join("");
      return `
        <article class="report-card">
          <h3>${periodLabel(period, mode)}</h3>
          ${rows}
        </article>
      `;
    })
    .join("");
}

function renderReports() {
  renderReport(els.weeklyReport, "week");
  renderReport(els.monthlyReport, "month");
}

function getFilteredReagents() {
  const keyword = els.searchInput.value.trim().toLowerCase();
  const location = els.locationFilter.value;
  const type = els.typeFilter.value;
  const risk = els.riskFilter.value;
  const statusFilter = els.statusFilter.value;

  return state.reagents
    .filter((reagent) => {
      const haystack = [
        reagent.name,
        reagent.cas,
        reagent.catalogNumber,
        reagent.batch,
        reagent.owner,
        reagent.type ? typeLabel(reagent.type) : "",
        getLocationName(reagent.locationId),
      ]
        .join(" ")
        .toLowerCase();
      const status = reagentStatus(reagent);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "low" && status.isLow) ||
        (statusFilter === "expired" && status.isExpired) ||
        (statusFilter === "expiring" && !status.isExpired && status.isExpiring) ||
        (statusFilter === "ok" && !status.isLow && !status.isExpired && !status.isExpiring);

      return (
        (!keyword || haystack.includes(keyword)) &&
        (location === "all" || reagent.locationId === location) &&
        (type === "all" || reagent.type === type) &&
        (risk === "all" || reagent.risk === risk) &&
        matchesStatus
      );
    })
    .sort((a, b) => {
      const aStatus = reagentStatus(a);
      const bStatus = reagentStatus(b);
      const aScore = (aStatus.isExpired ? 100 : 0) + (aStatus.isLow ? 20 : 0) + (aStatus.isExpiring ? 10 : 0);
      const bScore = (bStatus.isExpired ? 100 : 0) + (bStatus.isLow ? 20 : 0) + (bStatus.isExpiring ? 10 : 0);
      return bScore - aScore || a.expiryDate.localeCompare(b.expiryDate);
    });
}

function renderBoard() {
  const reagents = getFilteredReagents();
  if (!reagents.length) {
    els.reagentBoard.innerHTML = `<p class="empty-state">${t("noMatchingReagents")}</p>`;
    return;
  }

  els.reagentBoard.innerHTML = reagents.map(renderReagentCard).join("");
}

function renderReagentCard(reagent) {
  const status = reagentStatus(reagent);
  const tags = [];
  if (status.isExpired) tags.push(`<span class="tag tag-expired">${t("daysExpired", { days: Math.abs(status.days) })}</span>`);
  if (!status.isExpired && status.isExpiring) tags.push(`<span class="tag tag-expiring">${t("daysToExpire", { days: status.days })}</span>`);
  if (status.isLow) tags.push(`<span class="tag tag-low">${t("lowStock")}</span>`);
  if (isHazardous(reagent)) tags.push(`<span class="tag tag-hazard">${riskLabel(reagent.risk)}</span>`);
  if (!tags.length) tags.push(`<span class="tag tag-ok">${t("normalStatus")}</span>`);

  return `
    <article class="reagent-card">
      <div class="reagent-head">
        <div>
          <div class="reagent-name">${escapeHtml(reagent.name)}</div>
          <div class="reagent-meta">
            ${escapeHtml(getLocationName(reagent.locationId))} · ${escapeHtml(reagent.owner)} · ${t("expiryPrefix")} ${formatDate(reagent.expiryDate)}
          </div>
          <div class="reagent-meta">
            ${typeLabel(reagent.type)} · ${t("receivedPrefix")} ${formatDate(reagent.receivedDate)} · ${t("totalStoredPrefix")} ${formatNumber(reagent.totalAmount)} ${escapeHtml(reagent.unit)}
          </div>
          <div class="reagent-meta">
            Catalog ${escapeHtml(reagent.catalogNumber || t("notFilled"))} · CAS ${escapeHtml(reagent.cas || t("notFilled"))} · ${t("batchPrefix")} ${escapeHtml(reagent.batch || t("notFilled"))}
          </div>
          ${reagent.note ? `<div class="reagent-note">${escapeHtml(reagent.note)}</div>` : ""}
        </div>
        <div class="tag-row">${tags.join("")}</div>
      </div>
      <div class="reagent-actions">
        <div class="quantity-control">
          <input data-quantity-input="${reagent.id}" min="0" step="0.01" type="number" value="1" aria-label="${t("adjustQuantity")}" />
          <button class="small-button outline-button" type="button" data-consume="${reagent.id}">${t("consume")}</button>
          <button class="small-button" type="button" data-restock="${reagent.id}">${t("restock")}</button>
        </div>
        <span class="tag">${t("quantityLine", { quantity: formatNumber(reagent.quantity), threshold: formatNumber(reagent.threshold), unit: escapeHtml(reagent.unit) })}</span>
      </div>
    </article>
  `;
}

function formatNumber(value) {
  return Number(value).toLocaleString(currentLanguage === "zh" ? "zh-CN" : "en-US", { maximumFractionDigits: 2 });
}

function renderAlerts() {
  const alerts = state.reagents
    .flatMap((reagent) => {
      const status = reagentStatus(reagent);
      const items = [];
      if (status.isExpired) items.push({ reagent, label: t("daysExpired", { days: Math.abs(status.days) }), level: 3 });
      if (!status.isExpired && status.isExpiring) items.push({ reagent, label: t("daysToExpire", { days: status.days }), level: 2 });
      if (status.isLow) items.push({ reagent, label: t("lowStockAlert"), level: 2 });
      if (reagent.risk === "toxic") items.push({ reagent, label: t("toxicReview"), level: 1 });
      return items;
    })
    .sort((a, b) => b.level - a.level || daysUntil(a.reagent.expiryDate) - daysUntil(b.reagent.expiryDate));

  els.alertList.innerHTML = alerts.length
    ? alerts
        .slice(0, 50)
        .map(
          (item) => `
            <div class="list-item">
              <strong>${escapeHtml(item.reagent.name)}</strong>
              <span class="muted">${item.label} · ${escapeHtml(getLocationName(item.reagent.locationId))}</span>
            </div>
          `,
        )
        .join("")
    : `<p class="empty-state">${t("noAlerts")}</p>`;
}

function renderHistory() {
  const recent = [...state.history].sort((a, b) => b.createdAt - a.createdAt).slice(0, 60);
  els.historyList.innerHTML = recent.length
    ? recent
        .map(
          (item) => `
            <div class="list-item">
              <strong>${escapeHtml(item.reagentName)}</strong>
              <span class="muted">${escapeHtml(item.action === "入库" ? t("restock") : t("consume"))} ${formatNumber(item.amount)} ${escapeHtml(item.unit)} · ${t("remaining")} ${formatNumber(item.remaining ?? 0)} ${escapeHtml(item.unit)} · ${escapeHtml(item.actorName || t("unknownUser"))} · ${formatTime(item.createdAt)}</span>
            </div>
          `,
        )
        .join("")
    : `<p class="empty-state">${t("noHistory")}</p>`;
}

function render() {
  renderLocationOptions();
  renderLocations();
  renderSummary();
  renderTypeSummary();
  renderBoard();
  renderAlerts();
  renderHistory();
  renderReports();
}

async function loadBackups() {
  if (currentUser?.role !== "admin" || !els.backupList) return;
  const { backups } = await api("/api/admin/backups");
  els.backupList.innerHTML = backups.length
    ? backups
        .map(
          (backup) => `
            <div class="list-item approval-item">
              <div>
                <strong>${escapeHtml(backup.label)}</strong>
                <span class="muted">${formatTime(backup.createdAt)} · ${escapeHtml(backup.createdByName || "System")}</span>
              </div>
              <button class="small-button" type="button" data-restore-backup="${backup.id}">${t("restoreBackup")}</button>
            </div>
          `,
        )
        .join("")
    : `<p class="empty-state">${t("noBackups")}</p>`;
}

async function loadPendingUsers() {
  const { users } = await api("/api/admin/users");
  const pending = users.filter((user) => user.status === "pending");
  els.pendingUsers.innerHTML = pending.length
    ? pending
        .map(
          (user) => `
            <div class="list-item approval-item">
              <div>
                <strong>${escapeHtml(user.name)}</strong>
                <span class="muted">${escapeHtml(user.email)} · ${formatTime(user.createdAt)}</span>
              </div>
              <button class="small-button" type="button" data-approve-user="${user.id}">${t("approve")}</button>
            </div>
          `,
        )
        .join("")
    : `<p class="empty-state">${t("noPendingUsers")}</p>`;
}

async function addReagent(reagent) {
  await api("/api/reagents", {
    method: "POST",
    body: JSON.stringify(reagent),
  });
  await refreshData();
}

async function adjustQuantity(reagentId, amount, action) {
  if (!Number.isFinite(amount) || amount <= 0) return;
  await api(`/api/reagents/${reagentId}/adjust`, {
    method: "POST",
    body: JSON.stringify({ amount, action }),
  });
  await refreshData();
}

function getDateOffset(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

els.loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const data = await api("/api/login", {
      method: "POST",
      body: JSON.stringify({ email: els.loginEmail.value, password: els.loginPassword.value }),
    });
    currentUser = data.user;
    setAuthMessage("");
    els.loginForm.reset();
    showApp();
    await refreshData();
    if (currentUser.role === "admin") await loadPendingUsers();
    if (currentUser.role === "admin") await loadBackups();
  } catch (error) {
    setAuthMessage(error.message, true);
  }
});

els.registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await api("/api/register", {
      method: "POST",
      body: JSON.stringify({
        name: els.registerName.value,
        email: els.registerEmail.value,
        password: els.registerPassword.value,
      }),
    });
    els.registerForm.reset();
    setAuthMessage(t("registerSubmitted"));
  } catch (error) {
    setAuthMessage(error.message, true);
  }
});

els.logoutBtn.addEventListener("click", async () => {
  await api("/api/logout", { method: "POST", body: "{}" }).catch(() => {});
  currentUser = null;
  showAuth();
});

els.pendingUsers.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-approve-user]");
  if (!button) return;
  await api(`/api/admin/users/${button.dataset.approveUser}/approve`, { method: "POST", body: "{}" });
  await loadPendingUsers();
});

els.navTabs.forEach((tab) => {
  tab.addEventListener("click", () => switchView(tab.dataset.viewTarget));
});

els.typeSummary.addEventListener("click", (event) => {
  const button = event.target.closest("[data-type-jump]");
  if (!button) return;
  els.typeFilter.value = button.dataset.typeJump;
  switchView("reagents");
  renderBoard();
});

els.locationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = els.locationName.value.trim();
  if (!name) return;
  await api("/api/locations", { method: "POST", body: JSON.stringify({ name }) });
  els.locationForm.reset();
  await refreshData();
});

els.reagentForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.locations.length) {
    alert(t("pleaseAddLocation"));
    return;
  }

  await addReagent({
    name: els.reagentName.value,
    cas: els.reagentCas.value,
    catalogNumber: els.reagentCatalog.value,
    batch: els.reagentBatch.value,
    totalAmount: els.reagentTotalAmount.value,
    quantity: els.reagentQuantity.value,
    unit: els.reagentUnit.value,
    type: els.reagentType.value,
    threshold: els.reagentThreshold.value,
    receivedDate: els.reagentReceivedDate.value,
    expiryDate: els.reagentExpiry.value,
    locationId: els.reagentLocation.value,
    risk: els.reagentRisk.value,
    owner: els.reagentOwner.value,
    note: els.reagentNote.value,
  });
  els.reagentForm.reset();
});

els.reagentTotalAmount.addEventListener("input", () => {
  if (!els.reagentQuantity.value) {
    els.reagentQuantity.value = els.reagentTotalAmount.value;
  }
});

els.reagentBoard.addEventListener("click", async (event) => {
  const consumeButton = event.target.closest("[data-consume]");
  const restockButton = event.target.closest("[data-restock]");
  const button = consumeButton || restockButton;
  if (!button) return;

  const reagentId = button.dataset.consume || button.dataset.restock;
  const input = els.reagentBoard.querySelector(`[data-quantity-input="${reagentId}"]`);
  await adjustQuantity(reagentId, Number(input.value), consumeButton ? "领用" : "入库");
});

[els.searchInput, els.locationFilter, els.typeFilter, els.riskFilter, els.statusFilter].forEach((control) => {
  control.addEventListener("input", renderBoard);
  control.addEventListener("change", renderBoard);
});

els.seedDemoBtn.addEventListener("click", async () => {
  await api("/api/seed", { method: "POST", body: "{}" });
  await refreshData();
});

els.resetBtn.addEventListener("click", async () => {
  const confirmed = confirm(t("confirmReset"));
  if (!confirmed) return;
  await api("/api/reset", { method: "POST", body: "{}" });
  await refreshData();
  await loadBackups();
});

async function changeLanguage() {
  currentLanguage = currentLanguage === "zh" ? "en" : "zh";
  localStorage.setItem(LANGUAGE_KEY, currentLanguage);
  applyTranslations();
  if (currentUser?.role === "admin") loadPendingUsers();
  if (currentUser?.role === "admin") loadBackups();
}

els.languageToggle.addEventListener("click", changeLanguage);
els.settingsLanguageToggle.addEventListener("click", changeLanguage);

els.createBackupBtn.addEventListener("click", async () => {
  await api("/api/admin/backups", {
    method: "POST",
    body: JSON.stringify({ label: t("createBackup") }),
  });
  await loadBackups();
});

els.backupList.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-restore-backup]");
  if (!button) return;
  if (!confirm(t("confirmRestore"))) return;
  await api(`/api/admin/backups/${button.dataset.restoreBackup}/restore`, { method: "POST", body: "{}" });
  await refreshData();
  await loadBackups();
});

applyTranslations();
switchView(activeView);
showAuth();
loadSession();
