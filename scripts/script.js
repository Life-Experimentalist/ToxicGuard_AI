// Comprehensive toxic word dictionary
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
    "discriminatory",
    "prejudiced",
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
    "nigger",
    "prick",
    "pussy",
    "cock",
    "dickhead",
    "motherfucker",
  ],
  moderate: [
    "suck",
    "wtf",
    "crap",
    "stupid",
    "piss",
    "dick",
    "ass",
    "bastard",
    "wanker",
    "twat",
    "jerk",
    "douche",
  ],
  mild: [
    "darn",
    "heck",
    "jerk",
    "dummy",
    "stupid",
    "idiot",
    "sucks",
    "loser",
    "weirdo",
    "creep",
    "lame",
    "dork",
  ],
  slurs: [
    "chink",
    "spic",
    "kike",
    "wetback",
    "towelhead",
    "raghead",
    "negro",
    "redskin",
    "gypsy",
    "tranny",
    "dyke",
  ],
  harassment: [
    "stalker",
    "creep",
    "pervert",
    "molest",
    "harass",
    "rape",
    "abuse",
    "assault",
    "violate",
    "grooming",
  ],
  bullying: [
    "fatty",
    "fatso",
    "piggy",
    "ugly",
    "freak",
    "loser",
    "weirdo",
    "loner",
    "nerd",
    "geek",
    "reject",
  ],
};

const toxicityLevels = {
  severe: 3,
  hate: 3,
  threats: 3,
  discrimination: 3,
  profanity: 2,
  insults: 2,
  moderate: 2,
  mild: 1,
};

let currentText = "";
let detectedToxicWords = [];
let lastAnalyzedText = "";
let model;
let isTyping = false;
let typingTimer;

// Get control elements
const enableDetectionToggle = document.getElementById("enableDetection");
const autoCensorToggle = document.getElementById("autoCensor");
const userInput = document.getElementById("userInput");
const checkButton = document.getElementById("checkText");

// Add event listener for real-time detection
userInput.addEventListener("input", () => {
  if (enableDetectionToggle.checked) {
    clearTimeout(typingTimer);
    isTyping = true;

    // Wait for user to stop typing for 500ms before analyzing
    typingTimer = setTimeout(() => {
      isTyping = false;
      if (userInput.value !== lastAnalyzedText) {
        analyzeText(true);
      }
    }, 500);
  }
});

checkButton.addEventListener("click", () => analyzeText(false));

// Load the toxicity model when the page loads
window.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("result").innerHTML =
    "Loading toxicity detection model...";
  document.getElementById("checkText").disabled = true;

  try {
    model = await toxicity.load(0.7, [
      "toxicity",
      "severe_toxicity",
      "identity_attack",
      "insult",
      "threat",
      "sexual_explicit",
      "obscene",
    ]);
    document.getElementById("result").innerHTML =
      "Model loaded! Ready to analyze text.";
    document.getElementById("checkText").disabled = false;
  } catch (error) {
    console.error("Error loading model:", error);
    document.getElementById("result").innerHTML =
      "Error loading model. Please refresh the page.";
  }
});

async function analyzeText(isAutomatic = false) {
  if (!enableDetectionToggle.checked) {
    document.getElementById("result").innerHTML =
      '<p style="color: orange;">Detection is disabled</p>';
    return;
  }

  const text = userInput.value;
  currentText = text;
  lastAnalyzedText = text;
  detectedToxicWords = [];
  let maxToxicityLevel = 0;

  // Local dictionary check
  const words = text.split(/\b/);
  words.forEach((word) => {
    const wordLower = word.toLowerCase().trim();
    if (wordLower) {
      for (const category in toxicWords) {
        if (toxicWords[category].includes(wordLower)) {
          detectedToxicWords.push({
            word: word,
            category: category,
            level: toxicityLevels[category] || 1,
          });
          maxToxicityLevel = Math.max(
            maxToxicityLevel,
            toxicityLevels[category] || 1
          );
        }
      }
    }
  });

  // ML-based toxicity detection
  if (text.trim()) {
    try {
      const predictions = await model.classify(text);
      predictions.forEach((prediction) => {
        if (prediction.results[0].match) {
          const toxicWords = findToxicWordsInText(text, prediction.label);
          toxicWords.forEach((word) => {
            detectedToxicWords.push({
              word: word,
              category: prediction.label,
              level: 3,
              confidence:
                Math.round(prediction.results[0].probabilities[1] * 100) + "%",
            });
          });
          maxToxicityLevel = 3;
        }
      });
    } catch (error) {
      console.error("Toxicity model error:", error);
    }
  }

  if (detectedToxicWords.length > 0) {
    if (autoCensorToggle.checked && enableDetectionToggle.checked) {
      censorText();
      if (!isAutomatic) {
        document.getElementById("result").innerHTML =
          '<p style="color: blue;">Toxic words have been automatically censored</p>';
      }
    } else if (enableDetectionToggle.checked) {
      showToxicityPopup(maxToxicityLevel);
    }
  } else if (!isAutomatic && enableDetectionToggle.checked) {
    document.getElementById("result").innerHTML =
      '<p style="color: green;">No toxic content detected!</p>';
  }
}

function findToxicWordsInText(text, category) {
  const words = text.split(/\b/);
  const toxicWords = [];

  words.forEach((word) => {
    if (word.trim() && word.length > 3) {
      // Check if the word contributes to the toxicity
      for (const dictCategory in toxicWords) {
        if (
          toxicWords[dictCategory].some((toxic) =>
            word.toLowerCase().includes(toxic.toLowerCase())
          )
        ) {
          toxicWords.push(word);
          break;
        }
      }
    }
  });

  return toxicWords;
}

function showToxicityPopup(toxicityLevel) {
  const popup = document.getElementById("popup");
  const message = document.getElementById("toxicMessage");

  let levelText = "";
  switch (toxicityLevel) {
    case 3:
      levelText = "Severe";
      break;
    case 2:
      levelText = "Moderate";
      break;
    case 1:
      levelText = "Mild";
      break;
  }

  message.innerHTML = `
        <p>Toxicity Level: <strong>${levelText}</strong></p>
        <p>Detected toxic words:</p>
        <ul>${detectedToxicWords
          .map(
            (item) =>
              `<li><strong>${item.word}</strong> (${item.category}${
                item.confidence ? ` - Confidence: ${item.confidence}` : ""
              })</li>`
          )
          .join("")}
        </ul>
    `;

  popup.style.display = "block";

  document.getElementById("censorBtn").onclick = () => {
    censorText();
    popup.style.display = "none";
  };

  document.getElementById("keepBtn").onclick = () => {
    popup.style.display = "none";
    document.getElementById("result").innerHTML =
      '<p style="color: orange;">Content kept as is. Please be mindful of your language.</p>';
  };
}

function censorText() {
  const words = currentText.split(/\b/);

  words.forEach((word, index) => {
    const lowerWord = word.toLowerCase().trim();
    if (lowerWord) {
      const isToxic = detectedToxicWords.some(
        (toxic) => toxic.word.toLowerCase() === lowerWord
      );

      if (isToxic) {
        words[index] = "*".repeat(word.length);
      }
    }
  });

  userInput.value = words.join("");
  document.getElementById("result").innerHTML =
    '<p style="color: blue;">Toxic words have been censored.</p>';
}
