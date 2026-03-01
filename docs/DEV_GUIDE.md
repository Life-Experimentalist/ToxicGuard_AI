# ToxicGuard AI - Development Guide

## 🚀 New Features

### 1. Automated Packaging System

Build extension packages automatically for both Chromium and Firefox:

```powershell
npm run build
```

This creates version-specific ZIP files in the `./dist/` directory:
- `toxicguard-ai-v1.0-chromium.zip` - For Chrome, Edge, Brave, Opera
- `toxicguard-ai-v1.0-firefox.zip` - For Firefox

The version number is automatically extracted from `manifest.json`.

### 2. Developer Mode

Enable detailed debugging information in the browser console:

**How to Enable:**
1. Click the ToxicGuard AI extension icon
2. Toggle "Developer Mode" to ON
3. Open browser DevTools (F12)

**What You Get:**
- 🔍 **Console Logging**: Every toxic detection is logged with:
  - Detected words and phrases
  - Toxicity level and categories
  - Confidence scores
  - Text context

- 📍 **DOM Location Tracking**: Each log shows:
  - Full CSS selector path to the element
  - Clickable element reference for inspection
  - Visual highlighting (red dashed border for 3 seconds)

**Example Console Output:**
```
[ToxicGuard DEV 14:30:15] Toxic content detected
  Detection Data: {
    text: "You are stupid and worthless",
    toxicWords: [
      { word: "stupid", category: "insult", level: 2 },
      { word: "worthless", category: "insult", level: 2 }
    ],
    toxicityLevel: 2,
    categories: ["insult"]
  }
  DOM Location: body > div.container > textarea:nth-of-type(1)
  Element: <textarea>...</textarea>
  Click to inspect: [textarea element]
```

**Use Cases:**
- Testing extension functionality
- Debugging false positives/negatives
- Understanding model behavior
- Identifying specific problematic elements on a page

### 3. Playwright Testing

Automated end-to-end testing for both browsers:

```powershell
# Run all tests
npm test

# Test specific browser
npm run test:chromium
npm run test:firefox

# Run both browsers
npm run test:all
```

**Test Coverage:**
- ✅ Extension loading verification
- ✅ Toxic content detection
- ✅ Enable/disable toggle functionality
- ✅ Auto-censoring feature
- ✅ Multiple input field monitoring
- ✅ TensorFlow model loading

**Test Results:**
Tests create an HTML report in `playwright-report/` directory.

### 4. Apache 2.0 License

The project now uses Apache License 2.0 instead of MIT, providing:
- Patent protection
- Clear contribution terms
- Better compatibility with corporate use
- Explicit grant of patent rights

See [LICENSE](../LICENSE.md) for full terms.

## 📦 Package Structure

```
dist/
├── toxicguard-ai-v1.0-chromium.zip    # Chromium package
└── toxicguard-ai-v1.0-firefox.zip     # Firefox package
```

Each package contains:
- `manifest.json` - Extension configuration
- `background.js` - Service worker
- `content.js` - Detection engine
- `popup.html/js` - Settings interface
- `styles.css` - UI styling
- `icons/` - Extension icons (16, 32, 48, 128px)
- `lib/` - TensorFlow.js libraries

## 🛠️ Build Process

The `build-package.js` script:
1. Reads version from `manifest.json`
2. Creates `dist/` directory if needed
3. Archives all necessary files
4. Generates two platform-specific ZIP files
5. Reports package sizes

**Included Files:**
- Extension core files (manifest, background, content, popup)
- Icons directory
- TensorFlow.js libraries
- Styles

**Excluded Files:**
- Documentation (README, guides)
- Development files (tests, node_modules)
- Build scripts
- Git files

## 🧪 Testing Guide

### Setup
```powershell
npm install  # Installs Playwright and dependencies
```

### Running Tests

**All Tests:**
```powershell
npm test
```

**Browser-Specific:**
```powershell
npm run test:chromium  # Test only Chrome/Edge
npm run test:firefox   # Test only Firefox
```

**View Results:**
After tests complete:
```powershell
npx playwright show-report
```

### Writing Tests

Tests are in `tests/extension.spec.js`. Example:

```javascript
test('should detect toxic content', async ({ browserName }) => {
  test.skip(browserName !== 'chromium', 'Chromium only');

  const context = await chromium.launchPersistentContext('', {
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`,
    ],
  });

  const page = await context.newPage();
  await page.goto(TEST_PAGE);

  // Your test code here

  await context.close();
});
```

### Test Configuration

Edit `playwright.config.js` to customize:
- Browser selection
- Headless mode
- Screenshot/video capture
- Timeout settings
- Reporter options

## 🎨 Image Assets Guide

See [IMAGE_PROMPTS.md](./IMAGE_PROMPTS.md) for:
- Detailed AI image generation prompts
- Icon specifications (16x16, 32x32, 48x48, 128x128)
- Store listing screenshots (1280x800)
- Promotional graphics
- Social media assets
- Design guidelines and color codes

**Quick Start:**
1. Use the prompts with AI generators (DALL-E, Midjourney, Stable Diffusion)
2. Create icons at all required sizes
3. Take screenshots at specified resolutions
4. Save as PNG with transparency (icons) or JPG (screenshots)

## 🔧 Developer Workflow

### 1. Make Changes
Edit source files as needed (content.js, popup.js, etc.)

### 2. Test Locally
```powershell
# Load unpacked extension in browser
# Chrome: chrome://extensions
# Firefox: about:debugging
```

### 3. Enable Dev Mode
Turn on Developer Mode in popup to see detailed logs

### 4. Run Automated Tests
```powershell
npm test
```

### 5. Build Packages
```powershell
npm run build
```

### 6. Test Packages
Install ZIP files in clean browser profiles

### 7. Submit to Stores
Follow [PUBLISHING.md](./PUBLISHING.md) guide

## 📊 Version Management

Update version in `manifest.json`:
```json
{
  "version": "1.1.0"
}
```

The build script automatically uses this version for:
- Package filenames
- Console output
- Documentation references

**Version Format:** `MAJOR.MINOR.PATCH`
- MAJOR: Breaking changes
- MINOR: New features
- PATCH: Bug fixes

## 🐛 Debugging Tips

### Console Logs Not Showing
1. Ensure Dev Mode is enabled in popup
2. Check DevTools console is open
3. Verify extension is active on current page
4. Try refreshing the page

### Extension Not Loading
1. Check manifest.json syntax
2. Verify all file paths are correct
3. Check browser console for errors
4. Ensure TensorFlow.js files exist in lib/

### Tests Failing
1. Update Playwright: `npx playwright install`
2. Check extension path in test config
3. Verify test page exists
4. Increase timeout values if needed

### Build Errors
1. Ensure Node.js 16+ is installed
2. Run `npm install` to get dependencies
3. Check file permissions on dist/ directory
4. Verify manifest.json is valid JSON

## 📈 Performance Optimization

### Model Loading
- Model loads asynchronously on page load
- Cached after first load
- Falls back to dictionary if model fails

### Detection Performance
- Input debounced at 500ms
- Only monitors relevant elements
- Uses lightweight regex patterns first
- ML model runs only when needed

### Memory Management
- Model loaded once per page
- Event listeners cleaned up properly
- Mutation observer throttled
- Console logs only in dev mode

## 🔐 Security Considerations

### Permissions
- `activeTab`: Access current tab only
- `storage`: Save settings locally
- `scripting`: Inject content script
- `<all_urls>`: Monitor any page

### Data Privacy
- All processing happens locally
- No data sent to external servers
- No analytics or tracking
- Settings stored in browser storage only

### Content Security Policy
- Uses local TensorFlow.js copies
- No external CDN dependencies in production
- No eval() or inline scripts
- Strict CSP in manifest

## 📝 License

Copyright 2025 VKrishna04 & Contributors (Life-Experimentalist)

Licensed under the Apache License, Version 2.0. See [LICENSE](../LICENSE.md) for details.

## 🤝 Contributing

See [CONTRIBUTING.md](../.github/CONTRIBUTING.md) for:
- Development setup
- Code style guidelines
- Commit message format
- Pull request process

## 📚 Additional Resources

- [Quick Start Guide](./QUICKSTART.md) - Get started in 5 minutes
- [Publishing Guide](./PUBLISHING.md) - Submit to browser stores
- [Deployment Guide](./DEPLOYMENT.md) - Deploy to GitHub Pages
- [Reference Card](./REFERENCE.md) - Quick command reference
- [Image Prompts](./IMAGE_PROMPTS.md) - Generate marketing assets

## 🆘 Support

- 🐛 **Issues:** https://github.com/Life-Experimentalist/ToxicGuard_AI/issues
- 💬 **Discussions:** https://github.com/Life-Experimentalist/ToxicGuard_AI/discussions
- 📧 **Email:** Contact maintainers through GitHub

---

**Note:** This is a developer-focused guide. For user documentation, see [README.md](../README.md) and [QUICKSTART.md](./QUICKSTART.md).
