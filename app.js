const EXPIRING_DAYS = 30;

const riskLabels = {
  low: "普通",
  irritant: "刺激性",
  flammable: "易燃",
  corrosive: "腐蚀性",
  toxic: "有毒",
};

const typeLabels = {
  solution: "溶液",
  powder: "粉末",
  solid: "固体",
  consumable: "耗材",
  other: "其他",
};

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
  totalReagents: document.querySelector("#totalReagents"),
  lowStockCount: document.querySelector("#lowStockCount"),
  expiringCount: document.querySelector("#expiringCount"),
  expiredCount: document.querySelector("#expiredCount"),
  hazardCount: document.querySelector("#hazardCount"),
  locationCount: document.querySelector("#locationCount"),
};

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "请求失败");
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
  els.currentUser.textContent = `${currentUser.name} · ${currentUser.role === "admin" ? "管理员" : "成员"}`;
  els.adminPanel.classList.toggle("is-hidden", currentUser.role !== "admin");
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
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatDate(value) {
  return new Intl.DateTimeFormat("zh-CN", {
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
  return state.locations.find((location) => location.id === locationId)?.name || "未分配";
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
    .map((location) => `<option value="${location.id}">${escapeHtml(location.name)}</option>`)
    .join("");

  els.reagentLocation.innerHTML = options;
  els.locationFilter.innerHTML = `<option value="all">全部位置</option>${options}`;
}

function renderLocations() {
  els.locationList.innerHTML = state.locations
    .map((location) => {
      const count = state.reagents.filter((reagent) => reagent.locationId === location.id).length;
      return `<span class="location-chip">${escapeHtml(location.name)} · ${count}种</span>`;
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
  els.lastUpdated.textContent = `更新 ${formatTime(Date.now())}`;
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
        reagent.type ? typeLabels[reagent.type] : "",
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
    els.reagentBoard.innerHTML = `<p class="empty-state">没有符合条件的试剂。</p>`;
    return;
  }

  els.reagentBoard.innerHTML = reagents.map(renderReagentCard).join("");
}

function renderReagentCard(reagent) {
  const status = reagentStatus(reagent);
  const tags = [];
  if (status.isExpired) tags.push(`<span class="tag tag-expired">已过期 ${Math.abs(status.days)}天</span>`);
  if (!status.isExpired && status.isExpiring) tags.push(`<span class="tag tag-expiring">${status.days}天后到期</span>`);
  if (status.isLow) tags.push(`<span class="tag tag-low">低库存</span>`);
  if (isHazardous(reagent)) tags.push(`<span class="tag tag-hazard">${riskLabels[reagent.risk]}</span>`);
  if (!tags.length) tags.push(`<span class="tag tag-ok">状态正常</span>`);

  return `
    <article class="reagent-card">
      <div class="reagent-head">
        <div>
          <div class="reagent-name">${escapeHtml(reagent.name)}</div>
          <div class="reagent-meta">
            ${escapeHtml(getLocationName(reagent.locationId))} · ${escapeHtml(reagent.owner)} · 有效期 ${formatDate(reagent.expiryDate)}
          </div>
          <div class="reagent-meta">
            ${typeLabels[reagent.type] || "其他"} · 入库 ${formatDate(reagent.receivedDate)} · 存入总量 ${formatNumber(reagent.totalAmount)} ${escapeHtml(reagent.unit)}
          </div>
          <div class="reagent-meta">
            Catalog ${escapeHtml(reagent.catalogNumber || "未填")} · CAS ${escapeHtml(reagent.cas || "未填")} · 批号 ${escapeHtml(reagent.batch || "未填")}
          </div>
          ${reagent.note ? `<div class="reagent-note">${escapeHtml(reagent.note)}</div>` : ""}
        </div>
        <div class="tag-row">${tags.join("")}</div>
      </div>
      <div class="reagent-actions">
        <div class="quantity-control">
          <input data-quantity-input="${reagent.id}" min="0" step="0.01" type="number" value="1" aria-label="调整数量" />
          <button class="small-button outline-button" type="button" data-consume="${reagent.id}">领用</button>
          <button class="small-button" type="button" data-restock="${reagent.id}">入库</button>
        </div>
        <span class="tag">余量 ${formatNumber(reagent.quantity)} ${escapeHtml(reagent.unit)} / 预警线 ${formatNumber(reagent.threshold)} ${escapeHtml(reagent.unit)}</span>
      </div>
    </article>
  `;
}

function formatNumber(value) {
  return Number(value).toLocaleString("zh-CN", { maximumFractionDigits: 2 });
}

function renderAlerts() {
  const alerts = state.reagents
    .flatMap((reagent) => {
      const status = reagentStatus(reagent);
      const items = [];
      if (status.isExpired) items.push({ reagent, label: `已过期 ${Math.abs(status.days)}天`, level: 3 });
      if (!status.isExpired && status.isExpiring) items.push({ reagent, label: `${status.days}天后到期`, level: 2 });
      if (status.isLow) items.push({ reagent, label: "库存低于阈值", level: 2 });
      if (reagent.risk === "toxic") items.push({ reagent, label: "有毒试剂需双人复核", level: 1 });
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
    : `<p class="empty-state">当前没有试剂告警。</p>`;
}

function renderHistory() {
  const recent = [...state.history].sort((a, b) => b.createdAt - a.createdAt).slice(0, 60);
  els.historyList.innerHTML = recent.length
    ? recent
        .map(
          (item) => `
            <div class="list-item">
              <strong>${escapeHtml(item.reagentName)}</strong>
              <span class="muted">${escapeHtml(item.action)} ${formatNumber(item.amount)} ${escapeHtml(item.unit)} · 剩余 ${formatNumber(item.remaining ?? 0)} ${escapeHtml(item.unit)} · ${escapeHtml(item.actorName || "未知用户")} · ${formatTime(item.createdAt)}</span>
            </div>
          `,
        )
        .join("")
    : `<p class="empty-state">还没有领用或入库记录。</p>`;
}

function render() {
  renderLocationOptions();
  renderLocations();
  renderSummary();
  renderBoard();
  renderAlerts();
  renderHistory();
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
              <button class="small-button" type="button" data-approve-user="${user.id}">批准</button>
            </div>
          `,
        )
        .join("")
    : `<p class="empty-state">当前没有待审批用户。</p>`;
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
    setAuthMessage("注册申请已提交，请等待管理员批准。");
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
    alert("请先添加存放位置。");
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
  const confirmed = confirm("确定清空所有试剂、位置和流转记录吗？");
  if (!confirmed) return;
  await api("/api/reset", { method: "POST", body: "{}" });
  await refreshData();
});

showAuth();
loadSession();
