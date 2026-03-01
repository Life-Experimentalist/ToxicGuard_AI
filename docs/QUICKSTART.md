# 🚀 ToxicGuard AI - Quick Start Guide

Get up and running with ToxicGuard AI in 5 minutes!

## 📥 Installation (Choose One Method)

### Method 1: Quick Install (Recommended for Users)

1. **Download the Extension**
   ```powershell
   git clone https://github.com/Life-Experimentalist/ToxicGuard_AI.git
   cd ToxicGuard_AI
   ```

2. **Load in Your Browser**

   **Chrome/Edge:**
   - Open `chrome://extensions` (or `edge://extensions`)
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the `ToxicGuard_AI` folder

   **Firefox:**
   - Open `about:debugging`
   - Click "This Firefox"
   - Click "Load Temporary Add-on"
   - Select any file in the `ToxicGuard_AI` folder

3. **You're Done! 🎉**
   - Extension icon appears in toolbar
   - Click it to configure settings
   - Start browsing with protection enabled

### Method 2: Developer Setup (With Local TensorFlow.js)

```powershell
# Clone the repository
git clone https://github.com/Life-Experimentalist/ToxicGuard_AI.git
cd ToxicGuard_AI

# Download TensorFlow.js libraries locally (optional)
node setup.js

# Load extension as shown in Method 1
```

---

## ⚙️ Configuration

### First-Time Setup

1. **Click the extension icon** in your toolbar
2. **Configure Settings:**
   - ✅ **Enable Detection** - Turn protection on/off
   - 🔒 **Auto Censor** - Automatically replace toxic words
3. **Settings save automatically**

### Advanced Settings (Coming Soon)

- Detection sensitivity slider
- Custom toxicity categories
- Whitelist/blacklist functionality
- Export/import settings

---

## 🧪 Test the Extension

### Option 1: Use the Built-in Test Page

```powershell
# Open test.html in your browser
Start-Process "test.html"
```

The test page includes:
- ✅ Pre-written toxic examples
- ✅ Dynamic content testing
- ✅ Shadow DOM testing
- ✅ Paste simulation
- ✅ Typing simulation

### Option 2: Test on Real Websites

1. Visit any website with text inputs
2. Try typing these test phrases:
   - ✅ Safe: "Hello, how are you today?"
   - ⚠️ Mild: "You're so stupid"
   - 🚫 Severe: "I hate you, go die"

3. Watch for visual feedback:
   - Red borders on inputs
   - Warning notifications
   - Auto-censoring (if enabled)

---

## 💡 Usage Tips

### For Personal Use

- **Enable detection** for safer browsing
- **Use auto-censor** to reduce exposure
- **Test on social media** comment boxes
- **Check emails** before sending

### For Parents

- **Monitor children's online activity**
- **Enable on shared computers**
- **Review detection logs** (feature coming)
- **Customize sensitivity** for age-appropriate filtering

### For Content Moderators

- **Test user-submitted content**
- **Identify problematic patterns**
- **Train moderation teams**
- **Integrate with workflows**

---

## 🔧 Troubleshooting

### Extension Not Working?

**Problem:** Extension icon doesn't appear
- **Solution:** Reload extension in browser settings
- **Chrome:** chrome://extensions → Reload button
- **Firefox:** about:debugging → Reload button

**Problem:** No detection happening
- **Solution:**
  1. Check if "Enable Detection" is ON
  2. Refresh the webpage
  3. Clear browser cache
  4. Reload extension

**Problem:** False positives detected
- **Solution:**
  1. Adjust sensitivity (coming soon)
  2. Report issue on GitHub
  3. Add words to whitelist (coming soon)

### Performance Issues?

**Problem:** Browser feels slow
- **Solution:**
  1. Extension processes locally - minimal impact
  2. Check other extensions
  3. Clear browser cache
  4. Update to latest version

**Problem:** High memory usage
- **Solution:**
  1. TensorFlow.js model loads once per page
  2. Close unused tabs
  3. Restart browser
  4. Report persistent issues on GitHub

---

## 📊 Understanding Results

### Detection Indicators

| Indicator | Meaning                 | Action           |
| --------- | ----------------------- | ---------------- |
| 😊 Green   | Content is safe         | No action needed |
| ⚠️ Yellow  | Potentially problematic | Review content   |
| 🚫 Red     | Toxic content detected  | Edit or remove   |

### Toxicity Categories

The AI detects 7+ categories:
- **Threats** - "I will hurt you"
- **Insults** - "You're stupid"
- **Hate Speech** - Discriminatory language
- **Profanity** - Strong language
- **Sexual Content** - Inappropriate content
- **Identity Attacks** - Targeting protected groups
- **Self-Harm** - Encouraging harm

---

## 🎯 Best Practices

### Do's ✅

- Keep extension updated
- Report bugs on GitHub
- Contribute to the project
- Share with friends
- Provide feedback
- Test regularly

### Don'ts ❌

- Don't rely solely on AI (use human judgment)
- Don't bypass for malicious purposes
- Don't share false positive patterns without reporting
- Don't expect 100% accuracy (AI has limitations)

---

## 🌟 Features Roadmap

### Coming Soon

- [ ] Adjustable sensitivity slider
- [ ] Custom word lists (whitelist/blacklist)
- [ ] Detection history and logs
- [ ] Multi-language support
- [ ] Export/import settings
- [ ] Cloud sync (optional)
- [ ] Advanced analytics
- [ ] Custom notification styles

### Future Possibilities

- [ ] Machine learning training on user feedback
- [ ] Integration with third-party services
- [ ] API for developers
- [ ] Enterprise features
- [ ] Mobile browser support

---

## 🆘 Getting Help

### Documentation

- 📖 [README.md](README.md) - Full project documentation
- 🤝 [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- 📦 [PUBLISHING.md](PUBLISHING.md) - Publishing guide
- 🌐 [Website](https://Life-Experimentalist.github.io/ToxicGuard_AI/) - Landing page

### Support Channels

- 💬 **GitHub Issues** - Bug reports and feature requests
- 📧 **Discussions** - General questions and feedback
- 🔍 **Search Issues** - Check existing solutions first
- 👥 **Community** - Connect with other users

### Quick Links

- 🐛 [Report a Bug](https://github.com/Life-Experimentalist/ToxicGuard_AI/issues/new?template=bug_report.md)
- ✨ [Request a Feature](https://github.com/Life-Experimentalist/ToxicGuard_AI/issues/new?template=feature_request.md)
- 🗣️ [Start a Discussion](https://github.com/Life-Experimentalist/ToxicGuard_AI/discussions)

---

## 📈 Stay Updated

### Follow Development

- ⭐ **Star the repository** on GitHub
- 👁️ **Watch releases** for updates
- 📧 **Subscribe** to newsletter (coming soon)
- 🐦 **Follow contributors** on social media

### Version History

Check [Releases](https://github.com/Life-Experimentalist/ToxicGuard_AI/releases) for:
- New features
- Bug fixes
- Performance improvements
- Breaking changes

---

## 🎓 Learn More

### Understanding Toxicity Detection

- [TensorFlow.js Documentation](https://www.tensorflow.org/js)
- [Toxicity Model Overview](https://github.com/tensorflow/tfjs-models/tree/master/toxicity)
- [How AI Detects Toxic Content](https://developers.google.com/machine-learning/guides/text-classification)

### Browser Extension Development

- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Firefox Extension Workshop](https://extensionworkshop.com/)
- [Manifest V3 Migration](https://developer.chrome.com/docs/extensions/mv3/intro/)

---

## 🎉 Success!

You're now ready to browse with ToxicGuard AI protection!

**What's Next?**

1. ✅ Test the extension on different websites
2. ✅ Explore the test page thoroughly
3. ✅ Configure settings to your preference
4. ✅ Star the GitHub repository
5. ✅ Share with friends who might benefit
6. ✅ Consider contributing to the project

---

**Need help?** Open an issue on [GitHub](https://github.com/Life-Experimentalist/ToxicGuard_AI/issues)

**Enjoying ToxicGuard AI?** Give us a ⭐ on [GitHub](https://github.com/Life-Experimentalist/ToxicGuard_AI)!

Made with ❤️ by [VKrishna04](https://github.com/VKrishna04) and [contributors](https://github.com/Life-Experimentalist/ToxicGuard_AI/graphs/contributors)
