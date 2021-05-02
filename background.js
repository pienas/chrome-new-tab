(function () {
  "use strict";
  chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
      id: "AddpagetoBookmarks",
      title: "Pridėti puslapį pradžioje",
      contexts: ["page"],
    });
    chrome.contextMenus.create({
      id: "AddLinktoBookmarks",
      title: "Pridėti nuorodą pradžioje",
      contexts: ["link"],
    });
  });
  chrome.action.onClicked.addListener(handleBrowserActionClicked);
  function handleBrowserActionClicked(tab) {
    const opts = {
      url: chrome.runtime.getURL("index.html"),
    };
    chrome.tabs.create(opts, handleCallback);
  }
  chrome.alarms.create({ delayInMinutes: 0.1 });
})();
