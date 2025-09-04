// Initialize extension settings
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    enableDetection: true,
    autoCensor: false,
  });
});

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    // Inject content script
    chrome.scripting
      .executeScript({
        target: { tabId: tabId },
        files: ["content.js"],
      })
      .catch((err) => {
        console.error("Failed to inject content script:", err);
      });

    // Check if we should analyze the page
    chrome.storage.local.get(["enableDetection"], (result) => {
      if (result.enableDetection) {
        chrome.tabs
          .sendMessage(tabId, {
            action: "analyzePage",
            url: tab.url,
          })
          .catch(() => {
            // Content script not ready yet, this is normal
          });
      }
    });
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getSettings") {
    chrome.storage.local.get(["enableDetection", "autoCensor"], (data) => {
      sendResponse(data);
    });
    return true; // Required for async response
  }
});
