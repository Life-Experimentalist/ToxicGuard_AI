document.addEventListener("DOMContentLoaded", () => {
  const enableDetection = document.getElementById("enableDetection");
  const autoCensor = document.getElementById("autoCensor");
  const status = document.getElementById("status");

  // Load saved settings
  chrome.storage.local.get(["enableDetection", "autoCensor"], (result) => {
    enableDetection.checked = result.enableDetection !== false;
    autoCensor.checked = result.autoCensor === true;
    updateStatus();
  });

  // Update settings when changed
  enableDetection.addEventListener("change", updateSettings);
  autoCensor.addEventListener("change", updateSettings);

  function updateSettings() {
    const settings = {
      enableDetection: enableDetection.checked,
      autoCensor: autoCensor.checked,
    };

    // Save settings
    chrome.storage.local.set(settings);

    // Send settings to content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "updateSettings",
          ...settings,
        });
      }
    });

    updateStatus();
  }

  function updateStatus() {
    if (enableDetection.checked) {
      status.textContent = autoCensor.checked
        ? "Detection and auto-censoring enabled"
        : "Detection enabled";
      status.style.color = "#4CAF50";
    } else {
      status.textContent = "Protection disabled";
      status.style.color = "#f44336";
    }
  }
});
