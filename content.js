// Prevent multiple injections
if (typeof window.toxicGuardLoaded !== "undefined") {
  console.log("Toxic Shield: Already loaded, skipping re-initialization");
} else {
  window.toxicGuardLoaded = true;

  // Initialize state
  let mlModelAvailable = false; // Track if background has ML loaded
  let isEnabled = true;
  let autoCensor = false;
  let devMode = false; // Developer mode for debugging
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

  // Check ML model availability from background script
  async function checkModelStatus() {
    try {
      const response = await chrome.runtime.sendMessage({
        action: "checkModel",
      });
      mlModelAvailable = response.modelLoaded;

      if (devMode) {
        console.log(
          `%c[ToxicGuard DEV] ML Model Status: ${
            mlModelAvailable ? "Available" : "Not Available"
          }`,
          "color: #2196F3; font-weight: bold"
        );
      }
      return mlModelAvailable;
    } catch (error) {
      console.error("Toxic Shield: Error checking model status:", error);
      mlModelAvailable = false;
      return false;
    }
  }

  // Analyze text using background script's ML model
  async function analyzeWithML(text) {
    try {
      const response = await chrome.runtime.sendMessage({
        action: "analyzeText",
        text: text,
      });

      if (response.success && response.mlResults) {
        mlModelAvailable = response.modelLoaded;
        return response.mlResults;
      }

      return null; // Fall back to dictionary
    } catch (error) {
      if (devMode) {
        console.error("[ToxicGuard DEV] ML analysis failed:", error);
      }
      return null;
    }
  }

  // Helper function to create clickable DOM path in console
  function getElementPath(element) {
    if (!element) return "";
    const path = [];
    let current = element;

    while (current && current !== document.body) {
      let selector = current.tagName.toLowerCase();

      if (current.id) {
        selector += `#${current.id}`;
        path.unshift(selector);
        break;
      } else if (current.className) {
        const classes = Array.from(current.classList).join(".");
        if (classes) selector += `.${classes}`;
      }

      const siblings = current.parentElement
        ? Array.from(current.parentElement.children)
        : [];
      const sameTag = siblings.filter((s) => s.tagName === current.tagName);
      if (sameTag.length > 1) {
        const index = sameTag.indexOf(current) + 1;
        selector += `:nth-of-type(${index})`;
      }

      path.unshift(selector);
      current = current.parentElement;
    }

    return "body > " + path.join(" > ");
  }

  // Helper function to highlight element in page
  function highlightElement(element) {
    if (!element || !devMode) return;

    const originalOutline = element.style.outline;
    const originalOutlineOffset = element.style.outlineOffset;

    element.style.outline = "3px dashed #ff4444";
    element.style.outlineOffset = "2px";

    setTimeout(() => {
      element.style.outline = originalOutline;
      element.style.outlineOffset = originalOutlineOffset;
    }, 3000);
  }

  // Dev mode logging function
  function devLog(message, data, element = null) {
    if (!devMode) return;

    const timestamp = new Date().toLocaleTimeString();
    console.group(
      `%c[ToxicGuard DEV ${timestamp}] ${message}`,
      "color: #6366f1; font-weight: bold"
    );

    if (data) {
      console.log(
        "%cDetection Data:",
        "color: #10b981; font-weight: bold",
        data
      );
    }

    if (element) {
      const path = getElementPath(element);
      console.log("%cDOM Location:", "color: #f59e0b; font-weight: bold", path);
      console.log("%cElement:", "color: #f59e0b", element);
      console.log(
        "%cClick to inspect:",
        "color: #3b82f6; text-decoration: underline; cursor: pointer",
        element
      );

      // Highlight the element
      highlightElement(element);
    }

    console.groupEnd();
  }
  function maskMatchPreserve(match) {
    return match
      .replace(/[^\s\W_]/g, "*")
      .replace(/\S/g, (ch) => (/[\w\d]/.test(ch) ? "*" : ch));
  }

  // Helper: mask matched phrase preserving spaces and punctuation
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

  async function analyzeText(text) {
    if (!text || !text.trim()) {
      return {
        isToxic: false,
        toxicWords: [],
        toxicityLevel: 0,
        categories: [],
      };
    }

    const originalText = text;
    const toxicWordsFound = [];
    const detectedCategories = new Set();
    let maxToxicityLevel = 0;
    let isToxic = false;

    // ML model analysis (via background script) - ONLY SOURCE OF DETECTION
    if (!mlModelAvailable) {
      if (devMode) {
        console.warn(
          "%c[ToxicGuard DEV] ML model not available - cannot analyze text",
          "color: #ef4444; font-weight: bold"
        );
      }
      return {
        isToxic: false,
        toxicWords: [],
        toxicityLevel: 0,
        categories: [],
        mlUnavailable: true,
      };
    }

    try {
      const mlResults = await analyzeWithML(originalText);
      if (mlResults) {
        for (const [label, isMatch] of Object.entries(mlResults)) {
          if (isMatch) {
            isToxic = true;
            detectedCategories.add(label);
            const phrases = extractToxicPhrases(originalText, label);
            phrases.forEach((phrase) => {
              toxicWordsFound.push({
                word: phrase,
                category: label,
                level: 3,
                confidence: "ML Detection",
              });
              maxToxicityLevel = Math.max(maxToxicityLevel, 3);
            });
          }
        }
      }
    } catch (error) {
      if (devMode) {
        console.error("[ToxicGuard DEV] ML analysis error:", error);
      }
    }

    return {
      isToxic,
      toxicWords: toxicWordsFound,
      toxicityLevel: maxToxicityLevel,
      categories: Array.from(detectedCategories),
    };
  }

  // Wrapper for analyzeText with dev mode logging
  async function analyzeTextWithLogging(text, element = null) {
    const result = await analyzeText(text);

    if (result.isToxic && devMode) {
      devLog(
        "Toxic content detected",
        {
          text: text.substring(0, 100) + (text.length > 100 ? "..." : ""),
          toxicWords: result.toxicWords,
          toxicityLevel: result.toxicityLevel,
          categories: result.categories,
          textLength: text.length,
        },
        element
      );
    }

    return result;
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
        const text = target.isContentEditable
          ? target.textContent
          : target.value;
        const result = await analyzeTextWithLogging(text, target);

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

      // Check ML model status from background script
      await checkModelStatus();

      if (!mlModelAvailable) {
        console.warn(
          "Toxic Shield: Running in dictionary-only mode (ML not available)"
        );
      } else {
        console.log("Toxic Shield: ML Model available via background script");
      }

      // Load settings
      chrome.storage.local.get(
        ["enableDetection", "autoCensor", "devMode", "modelThreshold"],
        (result) => {
          isEnabled = result.enableDetection !== false;
          autoCensor = result.autoCensor === true;
          devMode = result.devMode === true;
          if (typeof result.modelThreshold === "number") {
            modelConfidenceThreshold = result.modelThreshold;
          }

          if (devMode) {
            console.log(
              "%c[ToxicGuard DEV] Extension initialized",
              "color: #6366f1; font-weight: bold",
              {
                enabled: isEnabled,
                autoCensor: autoCensor,
                threshold: modelConfidenceThreshold,
                mlModelAvailable: mlModelAvailable,
              }
            );
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
    if (changes.devMode) {
      devMode = changes.devMode.newValue;
      if (devMode) {
        console.log(
          "%c[ToxicGuard DEV] Developer mode activated",
          "color: #10b981; font-weight: bold; font-size: 14px"
        );
        console.log(
          "%cToxic words will be logged with their DOM locations",
          "color: #6366f1"
        );
        console.log(
          "%cDetected elements will be highlighted with red dashed borders",
          "color: #6366f1"
        );
      } else {
        console.log(
          "%c[ToxicGuard DEV] Developer mode deactivated",
          "color: #ef4444; font-weight: bold"
        );
      }
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
} // End of toxicGuardLoaded check
