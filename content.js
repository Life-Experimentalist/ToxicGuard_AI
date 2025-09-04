// Initialize state
let model = null;
let isEnabled = true;
let autoCensor = false;

// Enhanced toxic patterns for context awareness
const toxicPatterns = {
  bodyShaming: [
    /fat\s*(ass|pig|cow|slob)/i,
    /ugly\s*(face|body|person)/i,
    /(too|so)\s*(fat|skinny|ugly)/i,
    /look\s*(horrible|disgusting)/i,
    /whale|hambeast|fatty/i,
  ],
  racism: [
    /black\s*(people|person|guy|girl)\s*(are|is)\s*(all|always|so)/i,
    /white\s*power|white\s*supremacy/i,
    /go\s*back\s*to\s*your\s*country/i,
    /racial slurs and variations/i,
  ],
  sexism: [
    /women\s*(are|belong|should)\s*/i,
    /like\s*a\s*girl/i,
    /make\s*me\s*a\s*sandwich/i,
    /belong\s*in\s*the\s*kitchen/i,
  ],
  sexualHarassment: [
    /send\s*(nudes|pics)/i,
    /what\s*are\s*you\s*wearing/i,
    /show\s*me\s*your/i,
    /want\s*to\s*see\s*you/i,
  ],
  bullying: [
    /kill\s*yourself/i,
    /nobody\s*likes?\s*you/i,
    /\\should\s*(die|leave|quit)/i,
    /worthless|useless|pathetic/i,
  ],
  threats: [
    /i\s*(will|gonna|going\s*to)\s*(kill|hurt|beat|find)/i,
    /watch\s*your\s*back/i,
    /you\s*(better|should)\s*be\s*afraid/i,
  ],
};

// Dictionary as fallback
const toxicWords = {
  hate: ["hate", "hatred", "hateful", "despise", "loathe", "detest"],
  profanity: ["damn", "hell", "ass", "bastard", "goddamn", "bloody"],
  discrimination: [
    "racist",
    "sexist",
    "homophobic",
    "bigot",
    "supremacist",
    "nazi",
    "xenophobic",
    "antisemitic",
    "misogynist",
    "chauvinist",
  ],
  threats: [
    "kill",
    "murder",
    "hurt",
    "destroy",
    "eliminate",
    "slaughter",
    "attack",
    "beat",
    "punch",
    "strangle",
    "threaten",
    "torture",
  ],
  insults: [
    "stupid",
    "idiot",
    "dumb",
    "moron",
    "imbecile",
    "retard",
    "loser",
    "worthless",
    "useless",
    "pathetic",
    "incompetent",
    "fool",
    "dumbass",
    "dimwit",
    "numbskull",
    "halfwit",
  ],
  severe: [
    "fuck",
    "shit",
    "bitch",
    "cunt",
    "whore",
    "slut",
    "faggot",
    "prick",
    "pussy",
    "cock",
    "dickhead",
    "motherfucker",
  ],
};

const toxicityLevels = {
  severe: 3,
  hate: 3,
  threats: 3,
  discrimination: 3,
  profanity: 2,
  insults: 2,
};

// Load TensorFlow model
async function loadModel() {
  try {
    // Model will be loaded from local files as specified in manifest.json
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
    console.log("Toxic Shield: ML Model loaded successfully");
    return true;
  } catch (error) {
    console.error("Toxic Shield: Error loading ML model:", error);
    return false;
  }
}

// Analyze text using ML model first, then fallback to dictionary
async function analyzeText(text) {
  if (!text || !text.trim()) {
    return { isToxic: false, toxicWords: [], toxicityLevel: 0, categories: [] };
  }

  const toxicWordsFound = [];
  const detectedCategories = new Set();
  let maxToxicityLevel = 0;
  let isToxic = false;

  // Check context patterns first
  for (const [category, patterns] of Object.entries(toxicPatterns)) {
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        isToxic = true;
        detectedCategories.add(category);
        const matches = text.match(pattern);
        if (matches) {
          toxicWordsFound.push({
            word: matches[0],
            category: category,
            level: 3,
            context: true,
          });
          maxToxicityLevel = Math.max(maxToxicityLevel, 3);
        }
      }
    }
  }

  // ML model analysis
  if (model) {
    try {
      const predictions = await model.classify(text);
      for (const prediction of predictions) {
        if (prediction.results[0].match) {
          isToxic = true;
          const confidence = prediction.results[0].probabilities[1];
          detectedCategories.add(prediction.label);

          // Extract potential toxic phrases based on model prediction
          const phrases = extractToxicPhrases(text, prediction.label);
          phrases.forEach((phrase) => {
            toxicWordsFound.push({
              word: phrase,
              category: prediction.label,
              level: confidence > 0.8 ? 3 : confidence > 0.6 ? 2 : 1,
              confidence: Math.round(confidence * 100) + "%",
            });
            maxToxicityLevel = Math.max(
              maxToxicityLevel,
              confidence > 0.8 ? 3 : confidence > 0.6 ? 2 : 1
            );
          });
        }
      }
    } catch (error) {
      console.error("ML analysis error:", error);
    }
  }

  // Dictionary check as fallback
  if (!isToxic) {
    const words = text.toLowerCase().split(/\b/);
    words.forEach((word) => {
      const cleanWord = word.trim();
      if (cleanWord) {
        for (const category in toxicWords) {
          if (toxicWords[category].includes(cleanWord)) {
            toxicWordsFound.push({
              word: word,
              category: category,
              level: toxicityLevels[category] || 1,
            });
            detectedCategories.add(category);
            maxToxicityLevel = Math.max(
              maxToxicityLevel,
              toxicityLevels[category] || 1
            );
            isToxic = true;
          }
        }
      }
    });
  }

  return {
    isToxic,
    toxicWords: toxicWordsFound,
    toxicityLevel: maxToxicityLevel,
    categories: Array.from(detectedCategories),
  };
}

function extractToxicPhrases(text, category) {
  const phrases = [];
  const sentences = text.split(/[.!?]+/);

  sentences.forEach((sentence) => {
    sentence = sentence.trim();
    if (sentence) {
      // Break into potential phrases
      const words = sentence.split(/\s+/);
      for (let i = 0; i < words.length; i++) {
        // Check different phrase lengths (2-4 words)
        for (let len = 2; len <= 4 && i + len <= words.length; len++) {
          const phrase = words.slice(i, i + len).join(" ");
          if (isLikelyToxic(phrase, category)) {
            phrases.push(phrase);
          }
        }
      }
    }
  });

  return [...new Set(phrases)]; // Remove duplicates
}

function isLikelyToxic(phrase, category) {
  // Category-specific phrase detection
  const patterns = {
    identity_attack:
      /(you|they|those)\s*(people|guys|ones)|stereotype|typical/i,
    sexual_explicit: /want|body|looking|sexy/i,
    insult: /(you|they|he|she)\s*(are|is|look)\s*(so|very|really)/i,
    threat: /(will|gonna|going|should|must|better)/i,
    toxicity: /(hate|stupid|dumb|bad|terrible)/i,
  };

  return patterns[category] ? patterns[category].test(phrase) : false;
}

function censorText(text, toxicWords) {
  let censoredText = text;
  const words = new Set(toxicWords.map((tw) => tw.word.toLowerCase()));

  const tokens = text.split(/(\b)/);
  const censored = tokens.map((token) => {
    if (words.has(token.toLowerCase())) {
      return "*".repeat(token.length);
    }
    return token;
  });

  return censored.join("");
}

function showNotification(result) {
  const existingNotif = document.querySelector(".toxic-shield-notification");
  if (existingNotif) existingNotif.remove();

  const notification = document.createElement("div");
  notification.className = "toxic-shield-notification";

  const levelText =
    result.toxicityLevel === 3
      ? "Severe"
      : result.toxicityLevel === 2
      ? "Moderate"
      : "Mild";

  notification.innerHTML = `
        <div style="font-weight: bold;">Toxic Content Detected (${levelText})</div>
        <div>Found ${result.toxicWords.length} toxic words</div>
    `;

  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${result.toxicityLevel === 3 ? "#ff4444" : "#ff8c00"};
        color: white;
        padding: 12px 20px;
        border-radius: 5px;
        z-index: 10000;
        font-family: Arial, sans-serif;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        animation: slideIn 0.5s ease-out;
    `;

  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

// Initialize when content script loads
async function init() {
  try {
    const modelLoaded = await loadModel();
    if (!modelLoaded) {
      console.warn("Toxic Shield: Running in dictionary-only mode");
    }

    // Load settings
    chrome.storage.local.get(["enableDetection", "autoCensor"], (result) => {
      isEnabled = result.enableDetection !== false;
      autoCensor = result.autoCensor === true;
      if (isEnabled) {
        setupPageMonitoring();
        // Initial page scan
        scanPage();
      }
    });
  } catch (error) {
    console.error("Toxic Shield: Initialization error:", error);
  }
}

// Scan entire page for toxic content
async function scanPage() {
  if (!isEnabled) return;

  // Get all text nodes
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  let node;
  while ((node = walker.nextNode())) {
    if (node.textContent.trim()) {
      const result = await analyzeText(node.textContent);
      if (result.isToxic) {
        showNotification(result);
        if (autoCensor) {
          node.textContent = censorText(node.textContent, result.toxicWords);
        }
      }
    }
  }

  // Check input fields
  const inputs = document.querySelectorAll(
    'input[type="text"], textarea, [contenteditable="true"]'
  );
  inputs.forEach(async (input) => {
    const text = input.value || input.textContent;
    if (text) {
      const result = await analyzeText(text);
      if (result.isToxic) {
        showNotification(result);
        if (autoCensor) {
          if (input.isContentEditable) {
            input.textContent = censorText(text, result.toxicWords);
          } else {
            input.value = censorText(text, result.toxicWords);
          }
        }
      }
    }
  });
}

// Monitor page content
function setupPageMonitoring() {
  // Monitor text input
  document.addEventListener("input", async (e) => {
    if (!isEnabled) return;

    const target = e.target;
    if (
      target.isContentEditable ||
      target.tagName === "TEXTAREA" ||
      (target.tagName === "INPUT" && target.type === "text")
    ) {
      const text = target.isContentEditable ? target.textContent : target.value;
      const result = await analyzeText(text);

      if (result.isToxic) {
        showNotification(result);
        if (autoCensor) {
          const censored = censorText(text, result.toxicWords);
          if (target.isContentEditable) {
            target.textContent = censored;
          } else {
            target.value = censored;
          }
        }
      }
    }
  });

  // Monitor DOM changes
  const observer = new MutationObserver(async (mutations) => {
    if (!isEnabled) return;

    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          const result = await analyzeText(node.textContent);
          if (result.isToxic) {
            showNotification(result);
            if (autoCensor) {
              node.textContent = censorText(
                node.textContent,
                result.toxicWords
              );
            }
          }
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });
}

// Start the extension
init();

// Listen for setting changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.enableDetection) {
    isEnabled = changes.enableDetection.newValue;
  }
  if (changes.autoCensor) {
    autoCensor = changes.autoCensor.newValue;
  }
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzePage") {
    scanPage();
  }
});
