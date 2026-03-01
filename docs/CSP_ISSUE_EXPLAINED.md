# CSP Issue with TensorFlow.js - Complete Explanation

## 🔴 The Problem

You're seeing this error:
```
Uncaught EvalError: Refused to evaluate a string as JavaScript because
'unsafe-eval' is not an allowed source of script
```

## 🧐 Why This Happens

### Manifest V3 Restriction
**Content scripts in Manifest V3 CANNOT use `eval()` or `new Function()` at all.**

This is a hard restriction that **cannot be bypassed** with CSP settings. The CSP in manifest.json only applies to:
- Extension pages (popup.html, options.html, etc.)
- Background service workers

But **NOT** to content scripts injected into web pages.

### TensorFlow.js Requirement
The minified TensorFlow.js library (`tf.min.js`) uses:
- `new Function()` for dynamic code generation
- `eval()` in some operations
- WebAssembly with dynamic compilation

All of these require 'unsafe-eval' permission, which content scripts **cannot have**.

## ✅ Solutions

### Option 1: Offload ML to Background Script (RECOMMENDED)
Move TensorFlow.js processing to the background service worker and use message passing.

**Pros:**
- ML model works on all websites
- No CSP restrictions
- More efficient (model loads once)

**Cons:**
- Requires code refactoring
- Message passing overhead
- More complex architecture

### Option 2: Use Only Dictionary Mode
Accept that ML won't work and rely on pattern matching.

**Pros:**
- Simple, works everywhere
- No CSP issues
- Fast and lightweight

**Cons:**
- Less accurate detection
- No ML benefits

### Option 3: Inject via Extension Page (HYBRID)
Create an invisible iframe from extension pages to run TensorFlow.js.

**Pros:**
- ML works with extension CSP
- Content script can communicate with iframe

**Cons:**
- Complex implementation
- Still blocked on strict CSP sites
- May have performance issues

## 🚀 Recommended Fix: Background Script Architecture

I'll implement this approach which:
1. Loads TensorFlow.js in `background.js` (allowed to use eval)
2. Content scripts send text to background for analysis
3. Background returns toxicity results
4. Content scripts handle UI updates

## 📊 Current Status

Your extension is **working correctly** - it's falling back to dictionary mode:
```
Toxic Shield: Error loading ML model
Toxic Shield: Running in dictionary-only mode
```

The error you see is **expected behavior** in Manifest V3 when trying to load TensorFlow in content scripts.

## 🎯 Next Steps

Would you like me to:

1. **Implement background script ML** (full refactor, ~30 min)
2. **Keep dictionary mode only** (document as limitation)
3. **Create hybrid iframe approach** (experimental)

**My recommendation: Option 1** - It's the proper way to use ML in Manifest V3 extensions.
