document.addEventListener("DOMContentLoaded", () => {
  const enableDetection = document.getElementById("enableDetection");
  const autoCensor = document.getElementById("autoCensor");
  const devMode = document.getElementById("devMode");
  const status = document.getElementById("status");

  // Load saved settings
  chrome.storage.local.get(
    ["enableDetection", "autoCensor", "devMode"],
    (result) => {
      enableDetection.checked = result.enableDetection !== false;
      autoCensor.checked = result.autoCensor === true;
      devMode.checked = result.devMode === true;
      updateStatus();
    }
  );

  // Update settings when changed
  enableDetection.addEventListener("change", updateSettings);
  autoCensor.addEventListener("change", updateSettings);
  devMode.addEventListener("change", updateSettings);

  function updateSettings() {
    const settings = {
      enableDetection: enableDetection.checked,
      autoCensor: autoCensor.checked,
      devMode: devMode.checked,
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
      const modes = [];
      if (autoCensor.checked) modes.push("auto-censoring");
      if (devMode.checked) modes.push("dev mode");

      status.textContent =
        modes.length > 0
          ? `Detection enabled (${modes.join(", ")})`
          : "Detection enabled";
      status.style.color = "#4CAF50";
    } else {
      status.textContent = "Protection disabled";
      status.style.color = "#f44336";
    }
  }
});
