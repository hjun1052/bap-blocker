// 표준 배너 사이즈
const SIZES = [
  [320, 100], [320, 50], [300, 250], [728, 90], [970, 90],
  [970, 250], [250, 250], [336, 280], [160, 600], [300, 600],
];

let on = true;

function isBanner(el) {
  const r = el.getBoundingClientRect();
  return SIZES.some(([w, h]) => Math.abs(r.width - w) <= 4 && Math.abs(r.height - h) <= 4);
}

function scan() {
  if (!on) return;
  for (const el of document.querySelectorAll("iframe, ins, img, a[target=_blank]")) {
    if (el.closest("[data-bap-hidden]")) continue;

    let box = null;
    if (isBanner(el)) box = el;
    else if (el.parentElement && isBanner(el.parentElement)) box = el.parentElement;
    if (!box) continue;

    const slot = box.closest("aside") || box;
    slot.dataset.bapHidden = "1";
    slot.style.setProperty("display", "none", "important");
  }
}

function count() {
  return document.querySelectorAll("aside, [data-bap-hidden]:not(aside)").length;
}

let pending = false;
function queueScan() {
  if (pending) return;
  pending = true;
  setTimeout(() => {
    pending = false;
    scan();
  }, 100);
}

chrome.storage.local.get({ enabled: true }, ({ enabled }) => {
  on = enabled;
  document.documentElement.classList.toggle("bap-off", !on);
  if (!on) return;

  new MutationObserver(queueScan).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["src", "style", "class"],
  });
  window.addEventListener("resize", queueScan);
  queueScan();

  if (window !== top) return;
  window.addEventListener("load", () => {
    setTimeout(() => {
      // 확장 새로고침/업데이트 후 남은 옛 스크립트면 중단
      if (!chrome.runtime.id) return;
      const n = count();
      if (!n) return;
      chrome.storage.local.get({ total: 0 }, ({ total }) => {
        chrome.storage.local.set({ total: total + n });
      });
    }, 2000);
  });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg === "count" && window === top) sendResponse(count());
});
