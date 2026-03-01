// TensorFlow.js ML Model (loaded in background to avoid CSP issues)
let model = null;
let modelLoading = false;
let modelLoaded = false;

// Load TensorFlow.js dynamically in background script
async function loadTensorFlow() {
  if (modelLoaded || modelLoading) return modelLoaded;

  modelLoading = true;
  try {
    // Import TensorFlow.js using importScripts for service workers
    // Use chrome.runtime.getURL to get proper extension URLs
    const tfUrl = chrome.runtime.getURL("lib/tensorflow/tf.min.js");
    const toxicityUrl = chrome.runtime.getURL("lib/tensorflow/toxicity.min.js");

    console.log("Loading TensorFlow from:", tfUrl);
    self.importScripts(tfUrl);
    console.log("Loading Toxicity model from:", toxicityUrl);
    self.importScripts(toxicityUrl);

    console.log("TensorFlow loaded, initializing model...");
    // Load toxicity model with threshold 0.7
    model = await toxicity.load(0.7, [
      "toxicity",
      "severe_toxicity",
      "identity_attack",
      "insult",
      "threat",
      "sexual_explicit",
      "obscene",
      "flirtation",
    ]);

    modelLoaded = true;
    console.log("✅ ToxicGuard ML Model loaded in background script");
    return true;
  } catch (error) {
    console.error("❌ Failed to load ML model in background:", error);
    console.error("Error details:", error.message, error.stack);
    modelLoaded = false;
    return false;
  } finally {
    modelLoading = false;
  }
}

// Analyze text using ML model
async function analyzeWithML(text) {
  if (!modelLoaded) {
    await loadTensorFlow();
  }

  if (!modelLoaded || !model) {
    return null; // Fall back to dictionary mode
  }

  try {
    const predictions = await model.classify([text]);
    const results = {};

    predictions.forEach((prediction) => {
      results[prediction.label] = prediction.results[0].match;
    });

    return results;
  } catch (error) {
    console.error("ML analysis error:", error);
    return null;
  }
}

// Initialize extension settings
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    enableDetection: true,
    autoCensor: false,
    devMode: false, // Developer mode off by default
  });

  // Pre-load ML model on install
  loadTensorFlow();
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
    chrome.storage.local.get(
      ["enableDetection", "autoCensor", "devMode"],
      (data) => {
        sendResponse(data);
      }
    );
    return true; // Required for async response
  }

  // Handle ML analysis requests
  if (request.action === "analyzeText") {
    analyzeWithML(request.text)
      .then((results) => {
        sendResponse({
          success: true,
          mlResults: results,
          modelLoaded: modelLoaded,
        });
      })
      .catch((error) => {
        sendResponse({
          success: false,
          error: error.message,
          modelLoaded: false,
        });
      });
    return true; // Required for async response
  }

  // Handle model status check
  if (request.action === "checkModel") {
    sendResponse({
      modelLoaded: modelLoaded,
      modelLoading: modelLoading,
    });
    return false;
  }
});
