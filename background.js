// ToxiGuard AI Background Script - Cross-browser compatible
// Compatible with both Manifest V2 and V3, Chrome and Firefox

// Firefox compatibility - use browser API if available, otherwise chrome
const extensionAPI = typeof browser !== "undefined" ? browser : chrome;

// Initialize extension
const initializeExtension = () => {
  console.log("🛡️ ToxiGuard AI initialized");

  // Set default settings on install
  const defaultSettings = {
    detectionEnabled: true,
    autoCensor: false,
    threshold: 0.9,
    categories: {
      insult: true,
      obscene: true,
      threat: true,
      identity_attack: true,
      sexually_explicit: true,
      severe_toxicity: true,
    },
  };

  extensionAPI.storage.local.get(Object.keys(defaultSettings), (data) => {
    const settingsToSet = {};

    // Only set defaults for missing settings
    Object.keys(defaultSettings).forEach((key) => {
      if (!(key in data)) {
        settingsToSet[key] = defaultSettings[key];
      }
    });

    if (Object.keys(settingsToSet).length > 0) {
      extensionAPI.storage.local.set(settingsToSet, () => {
        console.log("Default settings initialized:", settingsToSet);
      });
    }
  });
};

// Handle extension installation
if (extensionAPI.runtime.onInstalled) {
  extensionAPI.runtime.onInstalled.addListener(initializeExtension);
} else {
  // Fallback for older versions
  initializeExtension();
}

// Handle keyboard shortcuts
if (extensionAPI.commands && extensionAPI.commands.onCommand) {
  extensionAPI.commands.onCommand.addListener((command) => {
    if (command === "toggle-detection") {
      // Toggle detection on/off
      extensionAPI.storage.local.get(["detectionEnabled"], (data) => {
        const newState = !data.detectionEnabled;
        extensionAPI.storage.local.set({ detectionEnabled: newState }, () => {
          console.log(
            `ToxiGuard AI detection ${newState ? "enabled" : "disabled"}`
          );

          // Show notification if supported
          if (extensionAPI.notifications && extensionAPI.notifications.create) {
            try {
              extensionAPI.notifications.create({
                type: "basic",
                iconUrl: "icons/icon48.png",
                title: "ToxiGuard AI",
                message: `Detection ${newState ? "enabled" : "disabled"}`,
              });
            } catch (error) {
              console.log("Notification not supported:", error);
            }
          }
        });
      });
    }
  });
}

// Handle storage changes for debugging
if (extensionAPI.storage && extensionAPI.storage.onChanged) {
  extensionAPI.storage.onChanged.addListener((changes, namespace) => {
    console.log("ToxiGuard AI settings changed:", changes);
  });
}
