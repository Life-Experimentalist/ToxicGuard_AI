# ToxicGuard AI - Quick Start for New Features

## 🚀 Automated Packaging

Build extension packages with one command:

```powershell
npm run build
```

**Output:** Two ZIP files in `dist/` directory:
- `toxicguard-ai-v2.0-chromium.zip` - Chrome, Edge, Brave, Opera
- `toxicguard-ai-v2.0-firefox.zip` - Firefox

**Version** is automatically read from `manifest.json`.

---

## 🔧 Developer Mode

### Enable:
1. Click ToxicGuard AI icon
2. Toggle **"Developer Mode"** ON
3. Open DevTools (F12)

### What You Get:
```
[ToxicGuard DEV 14:30:15] Toxic content detected
  Detection Data: {
    text: "You are stupid",
    toxicWords: [{ word: "stupid", category: "insult", level: 2 }],
    toxicityLevel: 2,
    categories: ["insult"]
  }
  DOM Location: body > div.container > textarea:nth-of-type(1)
  Element: <textarea>...</textarea>
  👆 Click to inspect
```

**Features:**
- ✅ Console logs for every detection
- ✅ Shows exact DOM location (CSS selector)
- ✅ Clickable element reference
- ✅ Visual highlighting (red dashed border, 3 seconds)
- ✅ Toxicity scores and categories

---

## 🧪 Testing with Playwright

### Run All Tests:
```powershell
npm test
```

### Browser-Specific:
```powershell
npm run test:chromium    # Chrome/Edge only
npm run test:firefox     # Firefox only
npm run test:all         # Both browsers
```

### View Results:
```powershell
npx playwright show-report
```

**7 Test Cases:**
1. Extension loads correctly
2. Detects toxic content
3. Enable/disable toggle works
4. Auto-censoring functions
5. Multiple inputs monitored
6. TensorFlow model loads
7. Settings persist

---

## 🎨 Generate Images

All prompts in **`IMAGE_PROMPTS.md`**:

### Icons (Required):
- 16x16, 32x32, 48x48, 128x128 pixels
- PNG with transparency
- Purple/indigo shield design

### Screenshots (Required):
- 1280x800 or 1920x1080 pixels
- PNG or JPG format
- Show extension in action

### Use AI Generators:
- DALL-E 3
- Midjourney
- Stable Diffusion XL
- Adobe Firefly

**Example Prompt:**
```
Create a modern browser extension icon with a shield design.
The shield should be purple/indigo (#6366f1) with a gradient effect.
Inside the shield, include an AI neural network pattern.
Style: flat design, modern, tech-focused, minimalist.
```

---

## 📄 Apache License 2.0

**Changed from MIT to Apache 2.0**

### Benefits:
- ✅ Patent protection
- ✅ Clear contribution terms
- ✅ Corporate-friendly
- ✅ Explicit patent grant

### Copyright:
```
Copyright 2025 VKrishna04 & Contributors (Life-Experimentalist)
Licensed under Apache License 2.0
```

---

## 📦 Package Contents

Each ZIP includes:
```
toxicguard-ai/
├── manifest.json
├── background.js
├── content.js
├── popup.html
├── popup.js
├── styles.css
├── icons/
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── lib/
    └── tensorflow/
        ├── tf.min.js
        └── toxicity.min.js
```

**Size:** ~7.4 MB each

---

## 🔍 Using Developer Mode

### Scenario 1: Testing Detection
1. Enable dev mode
2. Open test.html
3. Type toxic content
4. Check console for logs

### Scenario 2: Finding False Positives
1. Enable dev mode
2. Browse normally
3. Watch console for unexpected detections
4. Note the DOM location

### Scenario 3: Debugging Page Issues
1. Enable dev mode
2. Visit problematic page
3. Check console for errors
4. Inspect highlighted elements

---

## 🚀 Quick Deploy Workflow

### 1. Build
```powershell
npm run build
```

### 2. Test
```powershell
npm test
```

### 3. Commit
```powershell
git add .
git commit -m "feat: Ready for v2.0 release"
git push origin main
```

### 4. GitHub Pages
- Go to Settings > Pages
- Source: Deploy from branch
- Branch: main, folder: / (root)
- Save

### 5. Submit to Stores
- Use ZIPs from `dist/`
- Follow `PUBLISHING.md` guide
- Upload screenshots
- Submit for review

---

## 📊 Version Management

**Current Version:** 2.0 (from manifest.json)

### Update Version:
1. Edit `manifest.json`:
   ```json
   {
     "version": "2.1"
   }
   ```

2. Rebuild:
   ```powershell
   npm run build
   ```

3. New ZIPs created:
   - `toxicguard-ai-v2.1-chromium.zip`
   - `toxicguard-ai-v2.1-firefox.zip`

---

## 🛠️ Troubleshooting

### Build Fails
```powershell
# Reinstall dependencies
npm install

# Check Node version (need 16+)
node --version

# Verify manifest is valid JSON
Get-Content manifest.json | ConvertFrom-Json
```

### Tests Fail
```powershell
# Update Playwright
npx playwright install

# Run with UI for debugging
npx playwright test --ui
```

### Dev Mode Not Working
1. Check toggle is ON in popup
2. Refresh the page
3. Check DevTools console is open
4. Verify extension is active (icon colored, not grayed)

---

## 📚 Documentation

| Guide                  | Purpose                  |
| ---------------------- | ------------------------ |
| **README.md**          | User documentation       |
| **DEV_GUIDE.md**       | Complete developer guide |
| **IMAGE_PROMPTS.md**   | Image generation prompts |
| **QUICKSTART.md**      | 5-minute setup           |
| **CONTRIBUTING.md**    | How to contribute        |
| **PUBLISHING.md**      | Store submission         |
| **DEPLOYMENT.md**      | GitHub Pages             |
| **REFERENCE.md**       | Quick reference          |
| **FEATURE_SUMMARY.md** | New features overview    |

---

## 🎯 Key Files

| File                      | Purpose            |
| ------------------------- | ------------------ |
| `package.json`            | npm configuration  |
| `build-package.js`        | Build automation   |
| `playwright.config.js`    | Test configuration |
| `tests/extension.spec.js` | Test suite         |
| `manifest.json`           | Extension config   |
| `popup.html`              | Settings UI        |
| `content.js`              | Detection engine   |
| `background.js`           | Service worker     |

---

## ⚡ Common Commands

```powershell
# Install dependencies
npm install

# Build packages
npm run build

# Run tests
npm test

# View test report
npx playwright show-report

# Check package contents
Expand-Archive -Path .\dist\toxicguard-ai-v2.0-chromium.zip -DestinationPath .\temp

# Clean dist folder
Remove-Item -Path .\dist\* -Recurse -Force

# Rebuild from scratch
npm install; npm run build; npm test
```

---

## 🔗 Important Links

- **Repository:** https://github.com/Life-Experimentalist/ToxicGuard_AI
- **Issues:** https://github.com/Life-Experimentalist/ToxicGuard_AI/issues
- **Pages:** https://life-experimentalist.github.io/ToxicGuard_AI/
- **License:** Apache-2.0

---

## 💡 Tips

1. **Always test locally** before building packages
2. **Enable dev mode** when debugging
3. **Run tests** before each release
4. **Generate images** using provided prompts
5. **Version bump** in manifest before building
6. **Test ZIPs** in clean browser profiles

---

## 🎉 Ready to Go!

All features are implemented and tested. Follow the workflow:

1. ✅ Build packages: `npm run build`
2. ✅ Run tests: `npm test`
3. ✅ Generate images: Use `IMAGE_PROMPTS.md`
4. ✅ Deploy: Push to GitHub
5. ✅ Submit: Upload to stores

**Good luck with the launch! 🚀**

---

**Document Version:** 1.0
**Last Updated:** October 17, 2025
**Extension Version:** 2.0
