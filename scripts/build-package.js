const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

// Read manifest to get version
const manifest = JSON.parse(fs.readFileSync("./manifest.json", "utf8"));
const version = manifest.version;

// Files and directories to include in the package
const filesToInclude = [
  "manifest.json",
  "background.js",
  "content.js",
  "popup.html",
  "popup.js",
  "styles.css",
  "icons/",
  "lib/",
];

// Create output directory if it doesn't exist
const outputDir = "./dist";
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Function to create a zip archive
function createZip(outputName, manifestPath, subDir) {
  return new Promise((resolve, reject) => {
    // Create subdirectory for this build
    const buildDir = path.join(outputDir, subDir);
    if (!fs.existsSync(buildDir)) {
      fs.mkdirSync(buildDir, { recursive: true });
    }

    const output = fs.createWriteStream(path.join(buildDir, outputName));
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(2);
      console.log(`✅ Created ${path.join(subDir, outputName)} (${sizeMB} MB)`);
      resolve();
    });

    archive.on("error", (err) => reject(err));
    archive.pipe(output);

    // Add manifest (use custom one if specified)
    if (manifestPath && fs.existsSync(manifestPath)) {
      archive.file(manifestPath, { name: "manifest.json" });
      console.log(`   Using ${manifestPath}`);
    } else {
      archive.file("manifest.json", { name: "manifest.json" });
    }

    // Add all other files and directories
    filesToInclude.forEach((item) => {
      if (item === "manifest.json") return; // Already handled above

      const itemPath = path.join(".", item);
      if (fs.existsSync(itemPath)) {
        const stat = fs.statSync(itemPath);
        if (stat.isDirectory()) {
          archive.directory(itemPath, item.replace(/\/$/, ""));
          console.log(`   Added directory: ${item}`);
        } else {
          archive.file(itemPath, { name: item });
          console.log(`   Added file: ${item}`);
        }
      }
    });

    archive.finalize();
  });
}

// Main build process
async function build() {
  console.log("\n🚀 Building ToxicGuard AI Extension Packages...\n");
  console.log(`📦 Version: ${version}\n`);

  try {
    // Package 1: Chromium-based browsers (Chrome, Edge, Brave, etc.)
    console.log("📦 Building Chromium package...");
    await createZip(`toxicguard-ai-v${version}.zip`, null, "chromium");

    // Package 2: Firefox
    console.log("\n📦 Building Firefox package...");
    // Check if Firefox-specific manifest exists
    const firefoxManifest = "./manifest-firefox.json";
    if (fs.existsSync(firefoxManifest)) {
      await createZip(
        `toxicguard-ai-v${version}.zip`,
        firefoxManifest,
        "firefox"
      );
    } else {
      console.log("   ⚠️  No Firefox-specific manifest found, using default");
      await createZip(`toxicguard-ai-v${version}.zip`, null, "firefox");
    }

    console.log("\n✨ Build complete! Packages created in ./dist/");
    console.log("\n📦 Generated packages:");
    console.log(
      `   • dist/chromium/toxicguard-ai-v${version}.zip (Chrome, Edge, Brave, Opera)`
    );
    console.log(`   • dist/firefox/toxicguard-ai-v${version}.zip (Firefox)\n`);
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

build();
