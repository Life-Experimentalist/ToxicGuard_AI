# ToxicGuard AI - Troubleshooting Guide

## 🚨 Common Errors & Solutions

### Error 1: Content Security Policy (CSP)
```
Refused to evaluate a string as JavaScript because 'unsafe-eval'
is not an allowed source of script
```

**Solution**: ✅ Fixed in v2.0
- Updated `manifest.json` with proper CSP
- Added `'wasm-unsafe-eval'` for TensorFlow.js
- Reload extension after update

---

### Error 2: Duplicate Variable Declaration
```
Uncaught SyntaxError: Identifier 'model' has already been declared
```

**Solution**: ✅ Fixed in v2.0
- Added injection guard in `content.js`
- Prevents script from loading twice
- Remove old version and reload

---

### Error 3: TensorFlow.js Not Loading
```
TypeError: e.loadGraphModel is not a function
Toxic Shield: Error loading ML model
```

**Solution**: ✅ Fixed in v2.0
- CSP policy now allows TensorFlow.js
- Falls back to dictionary mode if needed
- Check console for "ML Model loaded successfully"

---

## 🔧 Quick Fixes

### If Extension Doesn't Load:
1. **Remove completely** from chrome://extensions
2. **Clear browser cache** (Ctrl+Shift+Del)
3. **Reload** the extension folder
4. **Check** manifest.json is valid JSON

### If Detection Doesn't Work:
1. **Check console** for errors (F12)
2. **Enable dev mode** in popup
3. **Verify** extension icon is colored (not gray)
4. **Test** on test.html page first

### If Popup Doesn't Open:
1. **Right-click** extension icon
2. **Inspect popup** to see errors
3. **Check** popup.html and popup.js exist
4. **Verify** permissions in manifest.json

---

## 🔍 Diagnostic Commands

### Check Extension Status
```javascript
// In console (F12)
console.log('Extension loaded:', document.body.getAttribute('data-toxiguard-loaded'));
console.log('Window flag:', window.toxicGuardLoaded);
```

### Check Model Status
```javascript
// In console (F12)
console.log('TensorFlow:', typeof tf);
console.log('Toxicity model:', typeof toxicity);
```

### Enable Developer Mode
1. Click extension icon
2. Toggle "Developer Mode" ON
3. Open DevTools (F12)
4. Type in any input field
5. Watch console for detailed logs

---

## 📋 Pre-Flight Checklist

Before reporting an issue:
- [ ] Extension version is 2.0 or higher
- [ ] Removed old version completely
- [ ] Cleared browser cache
- [ ] Checked console for errors
- [ ] Tested on test.html page
- [ ] Verified manifest.json is valid
- [ ] Files exist in lib/tensorflow/

---

## 🌐 Browser-Specific Issues

### Chrome/Edge
- **CSP**: Fixed with 'wasm-unsafe-eval'
- **Service Worker**: Background.js runs automatically
- **Extension ID**: Changes when reloaded (normal)

### Firefox
- **CSP**: May need different policy
- **Background**: Uses background scripts instead of service worker
- **Extension ID**: Fixed in manifest (browser_specific_settings)

### Brave
- **Shields**: May block TensorFlow.js
- **Solution**: Disable shields for extension pages
- **Otherwise**: Same as Chrome

---

## 🐛 Known Limitations

### Sites That May Block Extension:
- GitHub (some pages)
- Google Docs
- Banking sites
- Sites with strict CSP

### Large Model Files:
- Takes 2-5 seconds to load
- May fail on slow connections
- Falls back to dictionary mode

### Memory Usage:
- TensorFlow.js uses ~150 MB RAM
- Normal for ML models
- Cleared when tab closes

---

## 📊 Performance Tips

### Reduce Resource Usage:
1. Close unused tabs
2. Clear browser cache regularly
3. Disable on sites you trust
4. Use dictionary mode for faster performance

### Speed Up Loading:
1. Pre-load extension before browsing
2. Keep extension enabled
3. Don't reload unnecessarily
4. Use SSD for faster file access

---

## 🆘 Still Having Issues?

### Collect Debug Info:
```powershell
# Get extension info
Get-ChildItem -Path .\lib\tensorflow\ | Select Name, Length
Get-Content .\manifest.json | ConvertFrom-Json | Select version, name
```

### Create Issue Report:
1. **Browser**: Chrome/Firefox/Edge + version
2. **Extension Version**: Check manifest.json
3. **Error Message**: Full console output
4. **Steps to Reproduce**: What were you doing?
5. **Screenshots**: If applicable

### Contact:
- **GitHub Issues**: https://github.com/Life-Experimentalist/ToxicGuard_AI/issues
- **Include**: Browser, OS, extension version, error messages

---

## ✅ Verification Steps

After fixing issues:

1. **Reload Extension**
   - Go to chrome://extensions
   - Click reload button
   - Wait for green checkmark

2. **Check Console**
   - Open DevTools (F12)
   - Look for: "Toxic Shield: ML Model loaded successfully"
   - No red error messages

3. **Test Detection**
   - Open test.html
   - Type toxic content
   - Should see red borders or notifications

4. **Enable Dev Mode**
   - Click extension icon
   - Toggle Developer Mode
   - Test and watch console logs

5. **Verify Settings**
   - All toggles work
   - Settings persist after reload
   - Status message updates

---

## 📚 Additional Resources

- **Main Docs**: README.md
- **Dev Guide**: docs/DEV_GUIDE.md
- **Bug Fixes**: docs/BUGFIXES.md
- **Structure**: PROJECT_STRUCTURE.md
- **Quick Start**: docs/QUICKSTART.md

---

## 🔄 Update Process

When new version is released:

1. **Backup Settings** (optional)
   ```javascript
   chrome.storage.local.get(null, (data) => console.log(JSON.stringify(data)));
   ```

2. **Remove Old Version**
   - Go to chrome://extensions
   - Click "Remove"
   - Confirm deletion

3. **Install New Version**
   - Download new ZIP or pull from Git
   - Extract if needed
   - Load unpacked extension

4. **Verify Update**
   - Check version in manifest.json
   - Test functionality
   - Re-enable settings if needed

---

**Last Updated**: October 17, 2025
**Version**: 2.0
**Status**: All known issues fixed ✅
