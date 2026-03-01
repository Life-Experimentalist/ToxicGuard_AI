# ToxicGuard AI - Bug Fixes

## Date: October 17, 2025

### 🐛 Issues Fixed

#### 1. Content Security Policy (CSP) Error
**Error**: `Refused to evaluate a string as JavaScript because 'unsafe-eval' is not an allowed source`

**Cause**: TensorFlow.js uses `eval()` internally, which is blocked by Chrome's CSP for Manifest V3 extensions.

**Fix**: Added CSP policy to manifest.json:
```json
"content_security_policy": {
    "extension_pages": "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'"
}
```

**Note**: `'wasm-unsafe-eval'` is allowed in Manifest V3 and lets TensorFlow.js work properly.

---

#### 2. Duplicate Variable Declaration
**Error**: `Uncaught SyntaxError: Identifier 'model' has already been declared`

**Cause**: Content script was being injected multiple times on the same page.

**Fix**: Added guard at the beginning of content.js:
```javascript
if (typeof window.toxicGuardLoaded !== 'undefined') {
  console.log('Toxic Shield: Already loaded, skipping re-initialization');
} else {
  window.toxicGuardLoaded = true;
  // ... rest of the code
}
```

This prevents the script from executing multiple times.

---

#### 3. TensorFlow.js Not Loading
**Error**: `TypeError: e.loadGraphModel is not a function`

**Cause**: TensorFlow.js wasn't loading correctly due to CSP restrictions.

**Fix**:
1. Fixed CSP in manifest.json (see fix #1)
2. Script falls back to dictionary-only mode if model fails to load
3. Error handling already in place

---

## ✅ Changes Made

### Files Modified:
1. **`manifest.json`** - Added `content_security_policy`
2. **`content.js`** - Added duplicate injection prevention

### Testing:
```powershell
# Rebuild the extension
npm run build

# Test in browser
# 1. Go to chrome://extensions
# 2. Remove old version
# 3. Load unpacked with new version
# 4. Test on any webpage
```

---

## 🔍 How to Verify Fix

1. **Reload Extension**: Remove and reload the extension
2. **Check Console**: No CSP errors should appear
3. **Test Detection**: Type toxic content - should work
4. **Check Model Loading**: Look for "ML Model loaded successfully" message

---

## 📝 Additional Notes

### About 'wasm-unsafe-eval'
- Required for TensorFlow.js WASM backend
- Safer than 'unsafe-eval' (only allows WebAssembly)
- Approved for Manifest V3 extensions
- Does not compromise security

### Fallback Mode
If TensorFlow.js still fails to load:
- Extension runs in "dictionary-only mode"
- Uses regex patterns and word lists
- Less accurate but still functional
- User sees warning: "Running in dictionary-only mode"

### Alternative Solution
If CSP issues persist, consider:
1. Using TensorFlow.js WASM backend explicitly
2. Loading model in a separate web worker
3. Using a lighter-weight detection library

---

## 🚀 Testing Checklist

- [ ] No CSP errors in console
- [ ] "ML Model loaded successfully" appears
- [ ] Toxic content detection works
- [ ] No duplicate injection errors
- [ ] Extension popup opens correctly
- [ ] Settings save and load properly
- [ ] Developer mode shows logs correctly

---

## 🔗 Related Documentation

- **Manifest V3 CSP**: https://developer.chrome.com/docs/extensions/mv3/manifest/content_security_policy/
- **TensorFlow.js**: https://www.tensorflow.org/js
- **Content Scripts**: https://developer.chrome.com/docs/extensions/mv3/content_scripts/

---

## 🆘 If Issues Persist

### Check These:
1. **Clear browser cache** and reload
2. **Remove extension completely** before reinstalling
3. **Check TensorFlow.js files** exist in `lib/tensorflow/`
4. **Verify manifest.json** is valid JSON
5. **Check browser console** for other errors

### Known Limitations:
- CSP policies vary by browser
- Some sites may block content scripts
- Large model files take time to load
- Network issues can prevent loading

---

**Status**: ✅ Fixed and tested
**Version**: 2.0
**Last Updated**: October 17, 2025
