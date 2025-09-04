# ToxicGuard AI - Copilot Instructions

## Command Line Requirements

**IMPORTANT**: When providing Windows command-line examples or instructions, **ALWAYS use PowerShell syntax and commands, NOT CMD**. This project is developed on Windows with PowerShell as the default shell.

Examples:

- ✅ Use: `Get-Location` or `pwd` (PowerShell)
- ❌ Avoid: `cd` without context (CMD-specific behavior)
- ✅ Use: `Remove-Item file.txt` or `rm file.txt` (PowerShell)
- ❌ Avoid: `del file.txt` (CMD)
- ✅ Use: `New-Item -ItemType Directory folder` or `mkdir folder` (PowerShell)
- ❌ Avoid: `md folder` (CMD)

When joining commands on a single line, use the `;` character as appropriate for PowerShell.

## Project Overview

ToxicGuard AI is a **cross-browser extension** (Manifest V3) that provides real-time toxicity detection using TensorFlow.js and the `@tensorflow-models/toxicity` model. The extension injects content scripts into web pages to monitor text inputs and provide visual feedback.

## Architecture

### Core Components

- **`manifest.json`** - Extension configuration with cross-browser compatibility (Chrome, Firefox, Edge)
- **`background.js`** - Service worker handling settings initialization and cross-browser API abstraction
- **`content.js`** - Main detection engine that loads TensorFlow.js models and monitors DOM inputs
- **`popup.js/popup.html`** - Settings UI with real-time controls and category toggles
- **`test.html`** - Comprehensive test page with pre-built examples

### Cross-Browser Compatibility Strategy

**Single Manifest V3 Codebase**: This project uses ONE manifest.json that works across Chromium (Chrome/Edge) and Firefox browsers without separate builds.

**API Compatibility Approach**:

- Uses `webextension-polyfill` for standardized `browser.*` API across all browsers
- Single codebase with conditional manifest fields for browser-specific features
- Background script handles both service worker (Chromium) and background page (Firefox) patterns

**Polyfill Integration**:

```javascript
// Load browser-polyfill.js first in manifest content_scripts and background
// Then use browser.* API everywhere instead of chrome.*
const result = await browser.storage.local.get(keys);
```

**Manifest V3 Cross-Browser Configuration**:

```json
{
  "background": {
    "service_worker": "background.js", // Chromium
    "scripts": ["browser-polyfill.js", "background.js"] // Firefox fallback
  },
  "content_scripts": [
    {
      "js": ["browser-polyfill.js", "content.js"] // Polyfill loads first
    }
  ],
  "browser_specific_settings": {
    "gecko": { "id": "extension@domain.local" } // Required for Firefox
  }
}
```

### Development Commands

```powershell
npm run build      # Copy browser polyfill
npm run dev        # Build and show loading instructions
npm run validate   # Lint extension for compatibility issues
npm run firefox    # Test in Firefox (auto-launches)
npm run build-zip  # Create distributable .zip file
```

## Key Patterns & Conventions

### 1. Settings Management

- Settings are stored in `extensionAPI.storage.local` with a specific schema
- Default settings are defined in `background.js` and propagated on install
- Real-time updates use `storage.onChanged` listeners across all components
- Settings structure:
  ```javascript
  {
    detectionEnabled: boolean,
    autoCensor: boolean,
    threshold: number (0.1-1.0),
    categories: { insult: boolean, obscene: boolean, threat: boolean, ... }
  }
  ```

### 2. TensorFlow.js Integration

- Model loading uses dynamic imports from CDN: `@tensorflow/tfjs` and `@tensorflow-models/toxicity`
- Model initialization filters categories based on user settings
- Detection threshold is configurable (0.1 = very sensitive, 1.0 = less sensitive)
- Uses debounced input events (500ms) for performance

### 3. DOM Monitoring Strategy

- Targets: `textarea`, `input[type='text']`, `[contenteditable='true']`
- Uses `MutationObserver` to detect dynamically added inputs
- Prevents duplicate event handlers with `dataset.toxChecked` markers
- Visual feedback: red borders + tooltips for toxic content

### 4. Performance Considerations

- Model loads asynchronously on page load
- Input detection is debounced to prevent excessive API calls
- Only enabled toxicity categories are loaded into the model
- Content script excludes extension pages and browser internal pages

## Development Workflows

### Setup for Cross-Browser Development

1. **Install dependencies**: `npm install` (installs webextension-polyfill and web-ext)
2. **Build extension**: `npm run build` (copies polyfill to root directory)
3. **Validate extension**: `npm run validate` (runs web-ext lint for Firefox compatibility)
4. **Test in Firefox**: `npm run firefox` (automatically opens extension in Firefox)

### Testing

1. Load `test.html` in browser with extension enabled
2. Test examples range from safe ("Hello, how are you?") to toxic content
3. Verify visual indicators: 😊/😠 emoji, red borders, tooltips
4. Test auto-censoring functionality with asterisk replacement

### Installing for Development

```powershell
# Chrome/Edge: chrome://extensions → Developer Mode → Load unpacked
# Firefox: about:debugging → This Firefox → Load Temporary Add-on
# Same folder works for both browsers - no separate builds needed
```

### Cross-Browser Testing Pattern

- **Single Extension Folder**: Load the same unpacked extension in both Firefox and Chrome/Edge
- **API Verification**: Ensure `browser-polyfill.js` loads correctly in both environments
- **Feature Parity**: Test all functionality works identically across browsers
- **Manifest Validation**: Verify no browser-specific warnings in console

## Critical Implementation Details

### Content Script Injection

- Runs at `document_idle` for optimal performance
- Sets `data-toxiguard-loaded="true"` attribute for test verification
- Gracefully handles model loading failures with error indicators

### Settings Synchronization

- Settings changes in popup immediately propagate to all content scripts
- No manual refresh required - uses storage change listeners
- Fallback to defaults if storage access fails

### Auto-Censoring Logic

- Simple word replacement with asterisks matching original word length
- Triggered only when `autoCensor: true` and toxic content detected
- Dispatches synthetic `input` events to maintain form compatibility

When modifying this codebase, always test across multiple input types (textarea, contenteditable, text inputs) and verify that the extension gracefully handles model loading failures or network issues.

## Cross-Browser Implementation Notes

### Key Differences Handled

- **API Namespace**: Uses `webextension-polyfill` to standardize `browser.*` API across Chromium and Firefox
- **Background Scripts**: Manifest supports both service worker (Chromium) and background scripts (Firefox)
- **Promise vs Callback**: All async operations use Promises via polyfill for consistency
- **Extension ID**: Firefox requires explicit `browser_specific_settings.gecko.id` in manifest

### Testing Strategy

- **Single Codebase**: Same folder loads in both Firefox and Chrome/Edge without modification
- **Validation**: Use `npm run validate` to catch Firefox-specific manifest issues
- **Live Testing**: `npm run firefox` launches temporary Firefox instance with extension loaded
- **Build Distribution**: `npm run build-zip` creates universal .zip for store submission
