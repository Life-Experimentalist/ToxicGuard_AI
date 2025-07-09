// ToxiGuard AI Popup Script - Cross-browser compatible
document.addEventListener("DOMContentLoaded", () => {
  // Firefox compatibility - use browser API if available, otherwise chrome
  const extensionAPI = typeof browser !== "undefined" ? browser : chrome;
  // Elements
  const toggleDetection = document.getElementById("toggle-detection");
  const detectionToggle = document.getElementById("detection-toggle");
  const censorToggle = document.getElementById("censor-toggle");
  const autoCensor = document.getElementById("auto-censor");
  const thresholdSlider = document.getElementById("threshold-slider");
  const thresholdDisplay = document.getElementById("threshold-display");
  const statusBar = document.getElementById("status-bar");
  const sensitivitySection = document.getElementById("sensitivity-section");
  const categoriesSection = document.getElementById("categories-section");

  // Category toggles
  const categoryToggles = document.querySelectorAll("[data-category]");

  // Default settings
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

  // Load settings from storage
  const loadSettings = () => {
    extensionAPI.storage.local.get(
      ["detectionEnabled", "autoCensor", "threshold", "categories"],
      (data) => {
        const settings = {
          ...defaultSettings,
          ...data,
          categories: {
            ...defaultSettings.categories,
            ...(data.categories || {}),
          },
        };

        // Update UI
        toggleDetection.checked = settings.detectionEnabled;
        autoCensor.checked = settings.autoCensor;
        thresholdSlider.value = settings.threshold;
        thresholdDisplay.textContent = settings.threshold;

        // Update toggle switch styles
        updateToggleStyle(detectionToggle, settings.detectionEnabled);
        updateToggleStyle(censorToggle, settings.autoCensor);

        // Update category toggles
        categoryToggles.forEach((toggle) => {
          const category = toggle.dataset.category;
          const checkbox = toggle.querySelector("input");
          const isEnabled = settings.categories[category] !== false;
          checkbox.checked = isEnabled;
          updateToggleStyle(toggle, isEnabled);
        });

        // Update sections visibility
        updateSectionsVisibility(settings.detectionEnabled);
        updateStatusBar(settings);
      }
    );
  };

  // Update toggle switch visual style
  const updateToggleStyle = (toggleElement, isActive) => {
    if (isActive) {
      toggleElement.classList.add("active");
    } else {
      toggleElement.classList.remove("active");
    }
  };

  // Update sections visibility based on detection state
  const updateSectionsVisibility = (enabled) => {
    if (enabled) {
      sensitivitySection.classList.remove("disabled");
      categoriesSection.classList.remove("disabled");
    } else {
      sensitivitySection.classList.add("disabled");
      categoriesSection.classList.add("disabled");
    }
  };

  // Update status bar
  const updateStatusBar = (settings) => {
    if (!settings.detectionEnabled) {
      statusBar.textContent = "🔴 Detection Disabled";
      statusBar.style.background = "#f44336";
    } else {
      const enabledCategories = Object.values(settings.categories).filter(
        Boolean
      ).length;
      statusBar.textContent = `🟢 Monitoring ${enabledCategories} categories`;
      statusBar.style.background = "#4CAF50";
    }
  };

  // Save settings to storage
  const saveSettings = (newSettings) => {
    extensionAPI.storage.local.set(newSettings, () => {
      console.log("ToxiGuard AI settings saved:", newSettings);
    });
  };

  // Event listeners

  // Main detection toggle
  toggleDetection.addEventListener("change", () => {
    const enabled = toggleDetection.checked;
    updateToggleStyle(detectionToggle, enabled);
    updateSectionsVisibility(enabled);

    saveSettings({ detectionEnabled: enabled });

    // Update status
    extensionAPI.storage.local.get(["categories"], (data) => {
      updateStatusBar({
        detectionEnabled: enabled,
        categories: data.categories || defaultSettings.categories,
      });
    });
  });

  // Auto censor toggle
  autoCensor.addEventListener("change", () => {
    const enabled = autoCensor.checked;
    updateToggleStyle(censorToggle, enabled);
    saveSettings({ autoCensor: enabled });
  });

  // Threshold slider
  thresholdSlider.addEventListener("input", () => {
    const value = parseFloat(thresholdSlider.value);
    thresholdDisplay.textContent = value;
    saveSettings({ threshold: value });
  });

  // Category toggles
  categoryToggles.forEach((toggle) => {
    const checkbox = toggle.querySelector("input");

    checkbox.addEventListener("change", () => {
      const category = toggle.dataset.category;
      const enabled = checkbox.checked;

      updateToggleStyle(toggle, enabled);

      // Get current categories and update
      extensionAPI.storage.local.get(["categories"], (data) => {
        const categories = {
          ...defaultSettings.categories,
          ...(data.categories || {}),
        };
        categories[category] = enabled;

        saveSettings({ categories });

        // Update status
        extensionAPI.storage.local.get(["detectionEnabled"], (data) => {
          updateStatusBar({
            detectionEnabled: data.detectionEnabled !== false,
            categories,
          });
        });
      });
    });
  });

  // Add click handlers for toggle switches (to work with labels)
  document.querySelectorAll(".toggle-switch").forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      const checkbox = toggle.querySelector("input");
      checkbox.checked = !checkbox.checked;
      checkbox.dispatchEvent(new Event("change"));
    });
  });

  // Initialize
  loadSettings();

  // Handle keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      window.close();
    }
  });
});
