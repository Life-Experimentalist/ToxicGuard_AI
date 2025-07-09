// ToxiGuard AI Content Script - Cross-browser compatible
(async () => {
  // Firefox compatibility - use browser API if available, otherwise chrome
  const extensionAPI = typeof browser !== "undefined" ? browser : chrome;

  console.log("🛡️ ToxiGuard AI Content Script Loading...");

  let settings = {
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

  // Load user settings with error handling
  const loadSettings = () => {
    return new Promise((resolve) => {
      try {
        extensionAPI.storage.local.get(
          ["detectionEnabled", "autoCensor", "threshold", "categories"],
          (data) => {
            if (extensionAPI.runtime.lastError) {
              console.warn(
                "ToxiGuard AI: Storage error:",
                extensionAPI.runtime.lastError
              );
              resolve(); // Use defaults
              return;
            }

            settings = {
              ...settings,
              ...data,
              categories: {
                ...settings.categories,
                ...(data.categories || {}),
              },
            };
            console.log("🛡️ ToxiGuard AI Settings loaded:", settings);
            resolve();
          }
        );
      } catch (error) {
        console.warn("ToxiGuard AI: Failed to load settings:", error);
        resolve(); // Use defaults
      }
    });
  };

  try {
    await loadSettings();
  } catch (error) {
    console.warn("ToxiGuard AI: Using default settings due to error:", error);
  }

  // Listen for settings changes with error handling
  try {
    extensionAPI.storage.onChanged.addListener((changes) => {
      console.log("🛡️ ToxiGuard AI Settings changed:", changes);
      for (let key in changes) {
        if (key === "categories") {
          settings.categories = {
            ...settings.categories,
            ...changes[key].newValue,
          };
        } else {
          settings[key] = changes[key].newValue;
        }
      }
    });
  } catch (error) {
    console.warn("ToxiGuard AI: Could not set up settings listener:", error);
  }

  console.log("🛡️ ToxiGuard AI Detection enabled:", settings.detectionEnabled);

  // Add immediate detection marker for test page
  document.documentElement.setAttribute("data-toxiguard-loaded", "true");

  if (!settings.detectionEnabled) {
    console.log("🛡️ ToxiGuard AI Detection disabled, stopping execution");
    return;
  }

  // Create status indicator
  const emojiEl = document.createElement("div");
  emojiEl.style.cssText = `
    position: fixed;
    bottom: 10px;
    right: 10px;
    font-size: 2rem;
    z-index: 9999;
    background: rgba(255,255,255,0.9);
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
  `;
  document.body.appendChild(emojiEl);

  // Load TensorFlow.js and toxicity model
  try {
    await import("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs");
    const toxicity = await import(
      "https://cdn.jsdelivr.net/npm/@tensorflow-models/toxicity"
    );

    // Load model with enabled categories only
    const enabledCategories = Object.entries(settings.categories)
      .filter(([_, enabled]) => enabled)
      .map(([category, _]) => category);

    const model = await toxicity.load(settings.threshold, enabledCategories);
    console.log(
      "✅ ToxiGuard AI model loaded with categories:",
      enabledCategories
    );

    emojiEl.textContent = "😊";
    emojiEl.title = "ToxiGuard AI - Ready";

    const censorText = (text, toxicWords) => {
      let censored = text;
      toxicWords.forEach((word) => {
        const regex = new RegExp(word, "gi");
        censored = censored.replace(regex, "*".repeat(word.length));
      });
      return censored;
    };

    const checkToxicity = async (text, el) => {
      if (!settings.detectionEnabled || !text.trim()) {
        el.style.border = "";
        el.title = "";
        emojiEl.textContent = "😊";
        return;
      }

      try {
        const predictions = await model.classify([text]);
        const toxicCategories = [];
        const toxicWords = [];

        predictions.forEach((prediction) => {
          if (
            prediction.results[0].match &&
            settings.categories[prediction.label]
          ) {
            toxicCategories.push(prediction.label);
            // Extract potential toxic words (simplified approach)
            const words = text.split(/\s+/);
            words.forEach((word) => {
              if (word.length > 2 && !toxicWords.includes(word.toLowerCase())) {
                toxicWords.push(word.toLowerCase());
              }
            });
          }
        });

        const isToxic = toxicCategories.length > 0;

        if (isToxic) {
          el.style.border = "2px solid #ff4444";
          el.style.borderRadius = "4px";
          el.title = `⚠️ Detected: ${toxicCategories.join(", ")}`;
          emojiEl.textContent = "😠";
          emojiEl.title = `Toxic content detected: ${toxicCategories.join(
            ", "
          )}`;

          // Auto-censor if enabled
          if (settings.autoCensor && toxicWords.length > 0) {
            const originalValue = el.value;
            const censoredValue = censorText(originalValue, toxicWords);
            if (originalValue !== censoredValue) {
              el.value = censoredValue;
              el.dispatchEvent(new Event("input", { bubbles: true }));
            }
          }
        } else {
          el.style.border = "";
          el.title = "";
          emojiEl.textContent = "😊";
          emojiEl.title = "ToxiGuard AI - Content is clean";
        }
      } catch (error) {
        console.error("ToxiGuard AI error:", error);
        emojiEl.textContent = "❌";
        emojiEl.title = "ToxiGuard AI - Error";
      }
    };

    const attachToInput = (el) => {
      if (el.dataset.toxChecked) return;
      el.dataset.toxChecked = "true";

      let debounceTimer;
      el.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          checkToxicity(el.value, el);
        }, 500); // Debounce for performance
      });

      el.addEventListener("focus", () => {
        if (el.value.trim()) {
          checkToxicity(el.value, el);
        }
      });
    };

    const monitorInputs = () => {
      const inputs = document.querySelectorAll(
        "textarea, input[type='text'], [contenteditable='true']"
      );
      inputs.forEach(attachToInput);
    };

    // Initial scan
    monitorInputs();

    // Watch for new inputs
    const observer = new MutationObserver(monitorInputs);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["contenteditable"],
    });
  } catch (error) {
    console.error("Failed to load ToxiGuard AI:", error);
    emojiEl.textContent = "❌";
    emojiEl.title = "ToxiGuard AI - Failed to load";
  }
})();
