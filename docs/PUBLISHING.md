# 📦 ToxicGuard AI Publishing Guide

Complete guide for publishing ToxicGuard AI to browser extension stores.

## 📋 Pre-Publishing Checklist

### ✅ Code Quality
- [ ] All features tested on Chrome, Firefox, and Edge
- [ ] No console errors or warnings
- [ ] Code is well-documented and follows style guidelines
- [ ] Performance is optimized (no lag during detection)
- [ ] Extension loads correctly in all browsers

### ✅ Documentation
- [ ] README.md is up-to-date
- [ ] CONTRIBUTING.md exists and is clear
- [ ] LICENSE file is present
- [ ] All installation instructions are accurate
- [ ] Screenshots and demo videos are current

### ✅ Extension Files
- [ ] manifest.json is properly configured for all browsers
- [ ] All permissions are necessary and documented
- [ ] Icons are present in all required sizes (16, 32, 48, 128)
- [ ] Content scripts load correctly
- [ ] Background service worker functions properly

### ✅ Privacy & Security
- [ ] Privacy policy is clear (all processing is local)
- [ ] No external data collection
- [ ] No unnecessary permissions requested
- [ ] Security best practices followed

---

## 🌐 Chrome Web Store Publishing

### Step 1: Prepare Extension Package

```powershell
# Create a production-ready version
# Ensure all files are present
$files = @(
    "manifest.json",
    "background.js",
    "content.js",
    "popup.html",
    "popup.js",
    "icons/*"
)

# Create a ZIP file
Compress-Archive -Path $files -DestinationPath "ToxicGuard_AI_Chrome.zip" -Force
```

### Step 2: Developer Account Setup

1. **Create Developer Account**
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - Pay one-time $5 registration fee
   - Fill in account information

2. **Prepare Store Listing**
   - **Extension Name:** ToxicGuard AI
   - **Short Description:** Real-time toxicity detection using AI
   - **Detailed Description:** (See template below)
   - **Category:** Productivity or Social & Communication
   - **Language:** English (add more as needed)

### Step 3: Upload Extension

1. Click "New Item" in the dashboard
2. Upload `ToxicGuard_AI_Chrome.zip`
3. Fill in all required fields
4. Add screenshots (at least 1280x800 or 640x400)
5. Add promotional images (optional but recommended)

### Step 4: Privacy Practices

- **Data Collection:** None (all processing is local)
- **Permissions Justification:**
  - `activeTab`: To analyze content on current tab
  - `storage`: To save user preferences
  - `scripting`: To inject content scripts
  - `<all_urls>`: To work on all websites

### Step 5: Submit for Review

- Review all information
- Click "Submit for Review"
- Wait 1-7 days for approval

---

## 🦊 Firefox Add-ons Publishing

### Step 1: Prepare Extension Package

```powershell
# Firefox uses the same files as Chrome
# Ensure manifest.json has Firefox-specific fields
Compress-Archive -Path * -DestinationPath "ToxicGuard_AI_Firefox.zip" -Force
```

### Step 2: Developer Account Setup

1. **Create Account**
   - Go to [Firefox Add-ons Developer Hub](https://addons.mozilla.org/developers/)
   - Sign in with Firefox Account (free)
   - Accept developer agreement

### Step 3: Submit Extension

1. Click "Submit a New Add-on"
2. Choose "On this site" distribution
3. Upload `ToxicGuard_AI_Firefox.zip`
4. Select platforms: Firefox
5. Fill in listing information

### Step 4: Technical Details

- **Categories:** Privacy & Security, Productivity
- **Support Email:** Your email
- **Support Website:** GitHub repo URL
- **Homepage:** GitHub Pages URL
- **License:** Apache 2.0 License

### Step 5: Listing Information

- Use same descriptions as Chrome
- Add screenshots
- Specify target Firefox version (e.g., 109 and above)

### Step 6: Submit for Review

- Firefox review is typically faster (1-3 days)
- Automated tests run first
- Manual review follows

---

## 🔷 Microsoft Edge Add-ons Publishing

### Step 1: Prepare Extension

```powershell
# Edge uses Chrome extension format
# Can reuse Chrome ZIP file
Copy-Item "ToxicGuard_AI_Chrome.zip" "ToxicGuard_AI_Edge.zip"
```

### Step 2: Developer Account

1. **Register**
   - Go to [Microsoft Partner Center](https://partner.microsoft.com/dashboard/microsoftedge/)
   - Sign in with Microsoft account (free)
   - Enroll in Microsoft Edge program (no fee)

### Step 3: Submit Extension

1. Click "Create new extension"
2. Upload ZIP file
3. Fill in product declarations
4. Add listing information

### Step 4: Complete Listing

- Same descriptions as Chrome/Firefox
- Add screenshots (1366x768 recommended)
- Specify age rating
- Add privacy policy URL

---

## 📝 Store Listing Template

### Short Description (132 characters max)
```
Real-time AI-powered toxicity detection. Protect your browsing with privacy-focused, local content moderation. Free & open source.
```

### Detailed Description

```markdown
🛡️ ToxicGuard AI - Real-Time Toxicity Detection

Make the web a safer place with AI-powered content moderation that works entirely in your browser.

KEY FEATURES

🧠 AI-Powered Detection
• Uses TensorFlow.js and state-of-the-art toxicity models
• Detects threats, insults, hate speech, and more
• High accuracy with configurable sensitivity

⚡ Real-Time Processing
• Instant feedback as you type
• No lag or performance impact
• Works on all input types

🔒 Privacy First
• 100% local processing
• No data sent to external servers
• No tracking or data collection
• Open source and transparent

🎛️ Fully Customizable
• Adjust detection thresholds
• Enable/disable auto-censoring
• Configure toxicity categories
• Personalize to your needs

🌐 Cross-Browser Support
• Works on Chrome, Firefox, and Edge
• Manifest V3 compliant
• Regular updates and improvements

PERFECT FOR

• Online safety and digital wellbeing
• Parents monitoring children's online activity
• Content moderators and community managers
• Anyone seeking a more positive web experience

WHY CHOOSE TOXICGUARD AI?

✅ Free and open source
✅ Privacy-focused (no cloud, no tracking)
✅ Actively maintained and updated
✅ Community-driven development
✅ Comprehensive test suite included

GETTING STARTED

1. Install the extension
2. Open the popup to configure settings
3. Browse normally - protection is automatic
4. Visit the test page to see it in action

SUPPORT & FEEDBACK

• GitHub: github.com/Life-Experimentalist/ToxicGuard_AI
• Issues: Report bugs or request features
• Contributing: We welcome community contributions

PRIVACY POLICY

ToxicGuard AI processes all content locally in your browser. We do not collect, store, or transmit any personal data. Your browsing activity remains completely private.

Made with ❤️ by VKrishna04 and contributors.
```

### Screenshots to Include

1. **Extension popup** showing settings
2. **Detection in action** on test page
3. **Visual feedback** on input fields
4. **Settings panel** with customization options
5. **Test page** with various examples

---

## 🎨 Marketing Assets

### Required Sizes

- **Icon:** 128x128 (SVG or PNG)
- **Small Promo:** 440x280
- **Marquee:** 1400x560 (Chrome Web Store)
- **Screenshots:** 1280x800 or 640x400 (minimum)

### Branding Guidelines

- **Primary Color:** #6366f1 (Indigo)
- **Secondary Color:** #10b981 (Green)
- **Accent Color:** #ef4444 (Red for warnings)
- **Logo:** Shield emoji 🛡️ with "ToxicGuard AI" text

---

## 🔄 Version Management

### Semantic Versioning

- **Major (1.0.0):** Breaking changes
- **Minor (1.1.0):** New features
- **Patch (1.0.1):** Bug fixes

### Release Process

```powershell
# 1. Update version in manifest.json
# 2. Tag release in Git
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# 3. Create release notes
# 4. Build extension packages
# 5. Upload to all stores
# 6. Monitor for issues
```

---

## 📊 Post-Launch

### Monitor Metrics

- Installation counts
- User reviews and ratings
- Bug reports and feature requests
- Performance metrics

### Update Strategy

- **Bug fixes:** Within 1-2 days
- **Minor updates:** Monthly
- **Major updates:** Quarterly

### User Support

- Respond to reviews within 48 hours
- Fix critical bugs immediately
- Engage with community on GitHub
- Regular blog posts about updates

---

## 🚨 Common Rejection Reasons

### Chrome Web Store

- Missing privacy policy
- Excessive permissions
- Unclear permission justifications
- Broken functionality
- Poor quality screenshots

### Firefox Add-ons

- Security vulnerabilities
- Remote code execution
- Unnecessary permissions
- Incomplete manifest
- Broken links in listing

### Solutions

- Test thoroughly before submission
- Provide clear, detailed descriptions
- Use minimal necessary permissions
- Include comprehensive documentation
- Respond quickly to reviewer feedback

---

## 📞 Support Resources

### Chrome Web Store
- [Developer Documentation](https://developer.chrome.com/docs/webstore/)
- [Support Forum](https://groups.google.com/a/chromium.org/g/chromium-extensions)

### Firefox Add-ons
- [Extension Workshop](https://extensionworkshop.com/)
- [Community Forum](https://discourse.mozilla.org/c/add-ons/35)

### Microsoft Edge
- [Edge Add-ons Documentation](https://docs.microsoft.com/microsoft-edge/extensions-chromium/)
- [Developer Support](https://developer.microsoft.com/microsoft-edge/support/)

---

## ✅ Final Checklist Before Submission

- [ ] Extension works on all target browsers
- [ ] All store assets prepared (icons, screenshots, descriptions)
- [ ] Privacy policy clearly stated
- [ ] Source code is clean and documented
- [ ] Version number updated in manifest
- [ ] README and documentation updated
- [ ] GitHub repository is public and accessible
- [ ] Contributors properly credited
- [ ] License file included
- [ ] Test page accessible online (GitHub Pages)

---

**Good luck with your publication! 🚀**

For questions or help, open an issue on GitHub or contact the maintainers.
