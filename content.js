// Initialize state
let model = null;
let isEnabled = true;
let autoCensor = false;
let modelConfidenceThreshold = 0.6; // default, can be overridden from storage

// Normalization helper to remove obfuscation characters and collapse whitespace
function normalizeTextForMatch(text) {
  if (!text) return "";
  // Normalize to decompose diacritics then strip them, then recompose
  let t = text.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  t = t.normalize("NFKC");
  // Lowercase for matching
  t = t.toLowerCase();
  // Remove zero-width and BOM chars
  t = t.replace(/[\u200B-\u200D\uFEFF]/g, "");
  // Basic leet / obfuscation substitutions (reduce false negatives)
  t = t
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/7/g, "t")
    .replace(/\$/g, "s");
  // Collapse whitespace
  t = t.replace(/\s+/g, " ");
  return t;
}

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
    /racial\s*slurs\s*and\s*variations/i,
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
    /nobody\s*likes?\s*you/i,
    /\\should\s*(die|leave|quit)/i,
    /worthless|useless|pathetic/i,
  ],
  threats: [
    /i\s*(will|gonna|going\s*to)\s*(kill|hurt|beat|find|make)/i,
    /(?:make|gonna\s*make|will\s*make|i'?ll\s*make)\s+you\s+(wish|regret|pay|beg|feel|suffer)\b/i,
    /make\s+you\s+(wish|regret)\s+(you\s*)?(were|are)?\s*dead/i,
    /i\s*(will|gonna)\s*make\s+you\s+(wish|regret|pay)/i,
    /i\s*will\s*make\s*you\s*pay/i,
    /watch\s*your\s*back/i,
    /you\s*(better|should)\s*be\s*afraid/i,
  ],
};

// Explicit self-harm / encourage self-harm patterns (robust to obfuscation and spacing)
const selfHarmPatterns = [
  // Matches: kill yourself, kill your self, k i l l  y o u r s e l f, k.y.s, etc.
  /k[\W_]*i[\W_]*l[\W_]*l[\W_]*[\W_]*y[\W_]*o[\W_]*u[\W_]*r[\W_]*s[\W_]*e[\W_]*l[\W_]*f/i,
  /k[\W_]*y[\W_]*s/i,
  /k[\W_]*m[\W_]*s/i,
  /\bkys\b/i,
  /\bkms\b/i,
  /kill\s*urself/i,
  /go\s*die\s*(please|now)?/i,
  /you\s*should\s*(go\s*die|die\s*now|kill\s*yourself)/i,
  /i\s*hope\s*you\s*die/i,
  /matate/i,
  /m[\W_]*a[\W_]*t[\W_]*a[\W_]*t[\W_]*e/i,
  /matarte/i,
  /va[\W_]*te[\W_]*tuer/i,
  /bring[\W_]*dich[\W_]*um/i,
  /se[\W_]*mate/i,
  /\bsuicide\b/i,
];

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
    // Add self-harm shorthand and suicide terms
    "kys",
    "kms",
    "kill yourself",
    "suicide",
    "matate",
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

// Helper: mask matched phrase preserving spaces and punctuation
function maskMatchPreserve(match) {
  return match
    .replace(/[^\s\W_]/g, "*")
    .replace(/\S/g, (ch) => (/[\w\d]/.test(ch) ? "*" : ch));
}

// Improved censoring: replace multi-word phrases and single words (case-insensitive)
function censorText(text, toxicWordsFound) {
  if (!toxicWordsFound || toxicWordsFound.length === 0) return text;
  let censored = text;

  // Sort by length desc so longer phrases are censored first
  const phrases = Array.from(
    new Set(
      toxicWordsFound
        .map((t) => (typeof t === "string" ? t : t.word))
        .filter(Boolean)
    )
  ).sort((a, b) => b.length - a.length);

  phrases.forEach((p) => {
    try {
      // Build escaped regex for phrase and a normalized fallback
      const esc = p.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
      const re = new RegExp(esc, "ig");
      if (re.test(censored)) {
        censored = censored.replace(re, (m) => m.replace(/\w|\d/g, "*"));
      } else {
        // Fallback: try matching on a normalized version (remove diacritics/leet) and replace by mapping positions
        const normalizedOriginal = normalizeTextForMatch(censored);
        const normalizedPattern = normalizeTextForMatch(p);
        const idx = normalizedOriginal.indexOf(normalizedPattern);
        if (idx !== -1) {
          // Replace the corresponding substring in the original censored string
          const before = censored.slice(0, idx);
          const matchOriginal = censored.slice(
            idx,
            idx + normalizedPattern.length
          );
          const masked = matchOriginal.replace(/\w|\d/g, "*");
          censored =
            before + masked + censored.slice(idx + normalizedPattern.length);
        }
      }
    } catch (e) {
      // skip if regex fails
    }
  });

  return censored;
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

// Analyze text using ML model first, then fallback to dictionary and explicit severe patterns
async function analyzeText(text) {
  if (!text || !text.trim()) {
    return { isToxic: false, toxicWords: [], toxicityLevel: 0, categories: [] };
  }

  const originalText = text;
  const normalized = normalizeTextForMatch(text);
  const toxicWordsFound = [];
  const detectedCategories = new Set();
  let maxToxicityLevel = 0;
  let isToxic = false;

  // Check context patterns first (quick heuristics)
  for (const [category, patterns] of Object.entries(toxicPatterns)) {
    for (const pattern of patterns) {
      if (pattern.test(originalText)) {
        isToxic = true;
        detectedCategories.add(category);
        const matches = originalText.match(pattern);
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
      // Full-text predictions
      const predictions = await model.classify(originalText);
      let anyModelPositive = false;

      for (const prediction of predictions) {
        const confidence =
          (prediction.results &&
            prediction.results[0] &&
            prediction.results[0].probabilities &&
            prediction.results[0].probabilities[1]) ||
          0;
        // Prefer model using confidence, not only 'match' flag
        if (confidence >= modelConfidenceThreshold) {
          anyModelPositive = true;
          isToxic = true;
          detectedCategories.add(prediction.label);

          // Try to localize toxic phrases: extract phrases and also run sentence-level checks
          const phrases = extractToxicPhrases(originalText, prediction.label);
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

      // If model did not flag full text, still perform a lightweight sentence-level scan to find localized toxicity
      if (!anyModelPositive) {
        const sentenceHits = await findToxicSentences(
          originalText,
          modelConfidenceThreshold,
          6
        );
        if (sentenceHits.length > 0) {
          isToxic = true;
          sentenceHits.forEach((hit) => {
            detectedCategories.add(hit.label);
            toxicWordsFound.push({
              word: hit.phrase,
              category: hit.label,
              level: hit.confidence > 0.8 ? 3 : hit.confidence > 0.6 ? 2 : 1,
              confidence: Math.round(hit.confidence * 100) + "%",
            });
            maxToxicityLevel = Math.max(
              maxToxicityLevel,
              hit.confidence > 0.8 ? 3 : hit.confidence > 0.6 ? 2 : 1
            );
          });
        }
      }
    } catch (error) {
      console.error("ML analysis error:", error);
    }
  }

  // Explicit self-harm / encourage-self-harm detection (fallback)
  for (const p of selfHarmPatterns) {
    // Test against both normalized and original forms
    const normMatch = normalized.match(p);
    const origMatch = originalText.match(p);
    const matched = (origMatch && origMatch[0]) || (normMatch && normMatch[0]);
    if (matched) {
      isToxic = true;
      detectedCategories.add("self_harm");
      // Only push the actual matched substring (prefer the original text match for accurate censoring)
      const found =
        origMatch && origMatch[0]
          ? origMatch[0]
          : normMatch && normMatch[0]
          ? normMatch[0]
          : null;
      if (found) {
        toxicWordsFound.push({
          word: found,
          category: "self_harm",
          level: 3,
          context: true,
        });
      }
      maxToxicityLevel = Math.max(maxToxicityLevel, 3);
    }
  }

  // Dictionary check as fallback
  if (!isToxic) {
    const words = originalText.toLowerCase().split(/\b/);
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
        // Check different phrase lengths (2-8 words) — increase window to capture longer threat phrases
        for (let len = 2; len <= 8 && i + len <= words.length; len++) {
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
    threat:
      /(will|gonna|going)\s*(to\s*)?(kill|hurt|beat|find|make)|make\s+you\s+(wish|regret|pay|suffer)/i,
    toxicity: /(hate|stupid|dumb|bad|terrible)/i,
    self_harm: /kill\s*yourself|kys|go\s*die|you\s*should\s*die/i,
  };

  return patterns[category] ? patterns[category].test(phrase) : false;
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
    const text = input.isContentEditable ? input.textContent : input.value;
    if (text) {
      const result = await analyzeText(text);
      if (result.isToxic) {
        showNotification(result);
        if (autoCensor) {
          const censored = censorText(text, result.toxicWords);
          if (input.isContentEditable) {
            input.textContent = censored;
          } else {
            input.value = censored;
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

// Helper: find toxic sentences/phrases by running the model on sentence windows
async function findToxicSentences(
  text,
  threshold = modelConfidenceThreshold,
  maxSentences = 6
) {
  if (!model) return [];
  const found = [];
  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, maxSentences);
  for (const sentence of sentences) {
    if (sentence.length < 3) continue;
    try {
      const predictions = await model.classify(sentence);
      for (const p of predictions) {
        const conf =
          (p.results &&
            p.results[0] &&
            p.results[0].probabilities &&
            p.results[0].probabilities[1]) ||
          0;
        if (conf >= threshold) {
          found.push({ phrase: sentence, label: p.label, confidence: conf });
        }
      }
    } catch (e) {
      // ignore per-sentence classification errors
    }
  }
  return found;
}

// Start the extension
async function init() {
  try {
    // Mark page as having ToxicGuard extension loaded
    document.body.setAttribute("data-toxiguard-loaded", "true");
    document.documentElement.setAttribute("data-toxiguard-loaded", "true");

    const modelLoaded = await loadModel();
    if (!modelLoaded) {
      console.warn("Toxic Shield: Running in dictionary-only mode");
    }

    // Load settings
    chrome.storage.local.get(
      ["enableDetection", "autoCensor", "modelThreshold"],
      (result) => {
        isEnabled = result.enableDetection !== false;
        autoCensor = result.autoCensor === true;
        if (typeof result.modelThreshold === "number") {
          modelConfidenceThreshold = result.modelThreshold;
        }
        if (isEnabled) {
          setupPageMonitoring();
          // Initial page scan
          scanPage();
        }
      }
    );
  } catch (error) {
    console.error("Toxic Shield: Initialization error:", error);
  }
}

init();

// Listen for setting changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.enableDetection) {
    isEnabled = changes.enableDetection.newValue;
  }
  if (changes.autoCensor) {
    autoCensor = changes.autoCensor.newValue;
  }
  if (changes.modelThreshold) {
    modelConfidenceThreshold = changes.modelThreshold.newValue;
  }
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzePage") {
    scanPage();
  }
});
