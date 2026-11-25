// 업데이트하면 규칙이 다시 켜져서 저장된 값으로 맞춰줌
chrome.runtime.onInstalled.addListener(async () => {
  const { enabled } = await chrome.storage.local.get({ enabled: true });
  await setRules(enabled);
});

function setRules(enabled) {
  return chrome.declarativeNetRequest.updateEnabledRulesets(
    enabled ? { enableRulesetIds: ["bap_rules"] } : { disableRulesetIds: ["bap_rules"] }
  );
}
