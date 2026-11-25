const SITE = /(^|\.)xn--rh3b\.net$/;

const statusEl = document.getElementById("status");
const siteEl = document.getElementById("site");
const toggleBtn = document.getElementById("toggle");
const pageEl = document.getElementById("page");
const totalEl = document.getElementById("total");

let tab = null;

function isSite(t) {
  return !!t && !!t.url && SITE.test(new URL(t.url).hostname);
}

function render(enabled) {
  document.body.classList.toggle("off", !enabled);
  statusEl.textContent = enabled ? "보호 기능 활성화됨" : "보호 기능 일시 중지됨";
  toggleBtn.textContent = enabled ? "보호 일시 중지" : "보호 재개";
}

async function init() {
  document.getElementById("version").textContent = "비공식 · v" + chrome.runtime.getManifest().version;

  const { enabled, total } = await chrome.storage.local.get({ enabled: true, total: 0 });
  render(enabled);
  totalEl.textContent = total.toLocaleString("ko-KR");

  [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!isSite(tab)) {
    siteEl.textContent = "지원하지 않는 페이지";
    return;
  }
  siteEl.textContent = "급식 사이트에서 동작 중";

  try {
    const n = await chrome.tabs.sendMessage(tab.id, "count");
    pageEl.textContent = n || 0;
  } catch (e) {
    // 페이지 로딩 중이면 응답 없음
  }
}

toggleBtn.addEventListener("click", async () => {
  const enabled = document.body.classList.contains("off");
  await chrome.storage.local.set({ enabled });
  await chrome.declarativeNetRequest.updateEnabledRulesets(
    enabled ? { enableRulesetIds: ["bap_rules"] } : { disableRulesetIds: ["bap_rules"] }
  );
  render(enabled);
  if (isSite(tab)) chrome.tabs.reload(tab.id);
});

init();
