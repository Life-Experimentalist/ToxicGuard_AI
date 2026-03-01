# ToxicGuard AI - Project Structure

```
ToxicGuard_AI/
├── 📁 .github/                 # GitHub configuration
├── 📁 .vscode/                 # VS Code settings
├── 📁 dist/                    # Build output (generated)
│   ├── toxicguard-ai-v2.0-chromium.zip
│   └── toxicguard-ai-v2.0-firefox.zip
│
├── 📁 docs/                    # Documentation
│   ├── CONTRIBUTING.md         # Contribution guidelines
│   ├── DEPLOYMENT.md           # GitHub Pages deployment
│   ├── DEV_GUIDE.md           # Developer guide
│   ├── FEATURE_SUMMARY.md     # New features overview
│   ├── IMAGE_PROMPTS.md       # Image generation prompts
│   ├── PUBLISHING.md          # Store submission guide
│   ├── QUICKREF.md            # Quick reference card
│   ├── QUICKSTART.md          # 5-minute setup guide
│   └── REFERENCE.md           # Command reference
│
├── 📁 icons/                   # Extension icons (required)
│   ├── icon16.png             # 16x16 icon
│   ├── icon32.png             # 32x32 icon
│   ├── icon48.png             # 48x48 icon
│   └── icon128.png            # 128x128 icon
│
├── 📁 lib/                     # External libraries
│   └── tensorflow/            # TensorFlow.js files
│       ├── tf.min.js
│       └── toxicity.min.js
│
├── 📁 node_modules/            # npm dependencies (generated)
│
├── 📁 screenshots/             # Marketing images
│   ├── browser-screenshot.png
│   ├── extension-popup-settings.png
│   ├── realtime-detection-demo.png
│   └── icon-original.png
│
├── 📁 scripts/                 # Build & utility scripts
│   ├── build-package.js       # Automated packaging
│   ├── script.js              # Utility scripts
│   └── setup.js               # Setup script
│
├── 📁 tests/                   # Playwright tests
│   └── extension.spec.js      # Test suite (7 tests)
│
├── 📄 .babelrc                 # Babel configuration
├── 📄 .eslintrc.json           # ESLint configuration
├── 📄 .gitignore               # Git ignore rules
├── 📄 background.js            # Extension service worker
├── 📄 content.js               # Detection engine (main logic)
├── 📄 index.html               # GitHub Pages landing page
├── 📄 LICENSE                  # Apache 2.0 License
├── 📄 manifest.json            # Extension manifest (Manifest V3)
├── 📄 package.json             # npm configuration
├── 📄 package-lock.json        # npm lock file
├── 📄 playwright.config.js    # Test configuration
├── 📄 popup.html               # Extension popup UI
├── 📄 popup.js                 # Popup logic
├── 📄 README.md                # Main project documentation
├── 📄 PROJECT_STRUCTURE.md     # This file
├── 📄 styles.css               # Extension styles
└── 📄 test.html                # Extension test page
```

## 📂 Directory Descriptions

### Core Extension Files (Root)
These files must remain in the root directory:
- **manifest.json** - Extension configuration (Chrome/Firefox compatible)
- **background.js** - Service worker for extension initialization
- **content.js** - Main toxicity detection engine
- **popup.html/popup.js** - Settings popup interface
- **styles.css** - UI styling
- **index.html** - GitHub Pages landing page
- **test.html** - Testing interface

### `/docs/` - Documentation
All project documentation organized by purpose:
- **Guides**: QUICKSTART, DEV_GUIDE, REFERENCE
- **Processes**: CONTRIBUTING, PUBLISHING, DEPLOYMENT
- **Resources**: IMAGE_PROMPTS, FEATURE_SUMMARY

### `/icons/` - Extension Icons
Only required extension icons (no marketing materials):
- **icon16.png** - Toolbar icon (small)
- **icon32.png** - Toolbar icon (medium)
- **icon48.png** - Extensions page icon
- **icon128.png** - Chrome Web Store icon

### `/screenshots/` - Marketing Materials
Screenshots and promotional images for store listings:
- Browser screenshots
- Extension UI screenshots
- Demo images
- Original design files

### `/scripts/` - Build & Utility Scripts
Automation scripts for development:
- **build-package.js** - Creates distribution ZIPs
- **setup.js** - Initial project setup
- **script.js** - Utility functions

### `/tests/` - Automated Tests
Playwright test suite:
- **extension.spec.js** - 7 comprehensive tests
- Test both Chromium and Firefox

### `/lib/` - External Libraries
Third-party dependencies:
- **TensorFlow.js** - ML framework
- **Toxicity model** - Pre-trained model

### `/dist/` - Build Output (Generated)
Contains packaged extensions:
- **toxicguard-ai-v{version}-chromium.zip**
- **toxicguard-ai-v{version}-firefox.zip**

## 🚀 Quick Commands

```powershell
# Build extension packages
npm run build

# Run tests
npm test

# Test specific browser
npm run test:chromium
npm run test:firefox

# View test results
npx playwright show-report
```

## 📝 Key Files

### Extension Core
- `manifest.json` - Version, permissions, icons
- `content.js` - ML model, detection logic (681 lines)
- `background.js` - Settings initialization
- `popup.js` - Settings UI logic

### Configuration
- `package.json` - npm scripts, dependencies
- `playwright.config.js` - Test configuration
- `.eslintrc.json` - Code style rules
- `.babelrc` - Babel transpilation

### Documentation
- `README.md` - Main project docs
- `docs/DEV_GUIDE.md` - Developer documentation
- `docs/QUICKSTART.md` - User onboarding
- `docs/REFERENCE.md` - Command reference

## 🔧 Development Workflow

1. **Edit Core Files**: Modify `content.js`, `popup.js`, etc.
2. **Test Locally**: Load unpacked extension in browser
3. **Run Tests**: `npm test` to verify functionality
4. **Build Packages**: `npm run build` to create ZIPs
5. **Test Packages**: Install ZIPs in clean browser profiles
6. **Update Docs**: Modify files in `docs/` folder
7. **Commit & Push**: Standard Git workflow

## 📦 What Gets Packaged

The `scripts/build-package.js` script includes:
- ✅ All core extension files (root)
- ✅ Icons directory
- ✅ TensorFlow.js libraries
- ❌ Documentation (docs/)
- ❌ Tests (tests/)
- ❌ Screenshots (screenshots/)
- ❌ Scripts (scripts/)
- ❌ Node modules

## 🔒 Git Ignore

The following are ignored by Git:
- `node_modules/` - npm dependencies
- `dist/` - Build output
- `.DS_Store` - macOS files
- `*.log` - Log files
- Editor-specific files

## 📊 File Count by Category

| Category           | Count   | Purpose               |
| ------------------ | ------- | --------------------- |
| **Core Extension** | 8 files | Runtime files         |
| **Documentation**  | 9 files | Guides and references |
| **Icons**          | 4 files | Extension icons       |
| **Screenshots**    | 4 files | Marketing materials   |
| **Scripts**        | 3 files | Build automation      |
| **Tests**          | 1 file  | Test suite            |
| **Config**         | 7 files | Project configuration |

## 🎯 Extension Size

- **Uncompressed**: ~8-10 MB (mostly TensorFlow.js)
- **Compressed (ZIP)**: ~7.4 MB
- **Without TensorFlow**: <100 KB

## 📱 Cross-Browser Support

- ✅ **Chrome** - Full support
- ✅ **Edge** - Full support
- ✅ **Firefox** - Full support
- ✅ **Brave** - Full support
- ✅ **Opera** - Full support

## 🆕 Recent Changes

- Organized documentation into `docs/`
- Moved scripts to `scripts/`
- Separated marketing screenshots
- Created `icon128.png` (was missing)
- Updated build script paths
- Cleaned up root directory

## 📚 Documentation Map

| Need         | Read This                 |
| ------------ | ------------------------- |
| Quick setup  | `docs/QUICKSTART.md`      |
| Development  | `docs/DEV_GUIDE.md`       |
| Contributing | `docs/CONTRIBUTING.md`    |
| Publishing   | `docs/PUBLISHING.md`      |
| Deployment   | `docs/DEPLOYMENT.md`      |
| Commands     | `docs/QUICKREF.md`        |
| Features     | `docs/FEATURE_SUMMARY.md` |
| Images       | `docs/IMAGE_PROMPTS.md`   |

---

**Note**: This structure follows best practices for browser extension development while maintaining simplicity and clarity.

**Last Updated**: October 17, 2025
**Version**: 2.0
**License**: Apache-2.0
