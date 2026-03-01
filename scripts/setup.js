const fs = require("fs");
const https = require("https");
const path = require("path");

const TENSORFLOW_FILES = {
  "tf.min.js": "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs/dist/tf.min.js",
  "toxicity.min.js":
    "https://cdn.jsdelivr.net/npm/@tensorflow-models/toxicity/dist/toxicity.min.js",
};

// Create directories if they don't exist
const LIB_DIR = path.join(__dirname, "lib", "tensorflow");
if (!fs.existsSync(LIB_DIR)) {
  fs.mkdirSync(LIB_DIR, { recursive: true });
}

// Download files
Object.entries(TENSORFLOW_FILES).forEach(([filename, url]) => {
  const filePath = path.join(LIB_DIR, filename);
  const file = fs.createWriteStream(filePath);

  console.log(`Downloading ${filename}...`);
  https
    .get(url, (response) => {
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        console.log(`Downloaded ${filename} successfully`);
      });
    })
    .on("error", (err) => {
      fs.unlink(filePath);
      console.error(`Error downloading ${filename}:`, err.message);
    });
});
