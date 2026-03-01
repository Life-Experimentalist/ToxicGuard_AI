# Contributing to ToxicGuard AI

Thank you for your interest in contributing to ToxicGuard AI! We welcome contributions from the community to help make the web a safer place.

## 🤝 How to Contribute

### Reporting Issues

If you find a bug or have a feature request:

1. **Search existing issues** to avoid duplicates
2. **Create a new issue** with a clear title and description
3. **Include steps to reproduce** for bugs
4. **Describe expected behavior** vs actual behavior
5. **Add screenshots** if applicable

### Pull Requests

We actively welcome pull requests:

1. **Fork the repository** and create your branch from `main`
2. **Follow the coding style** used throughout the project
3. **Write clear commit messages** describing your changes
4. **Test your changes** thoroughly
5. **Update documentation** if needed
6. **Submit your PR** with a clear description

## 🛠️ Development Setup

### Prerequisites

- Node.js (for optional TensorFlow.js local setup)
- Git
- A modern web browser (Chrome, Firefox, or Edge)

### Setup Instructions (PowerShell)

```powershell
# Clone your fork
git clone https://github.com/YOUR_USERNAME/ToxicGuard_AI.git
cd ToxicGuard_AI

# Optional: Download TensorFlow.js libraries locally
node setup.js

# Load the extension in your browser for testing
# Chrome/Edge: chrome://extensions → Load unpacked
# Firefox: about:debugging → This Firefox → Load Temporary Add-on
```

## 📝 Coding Guidelines

### JavaScript

- Use **modern ES6+ syntax**
- Follow **consistent indentation** (2 spaces)
- Add **comments** for complex logic
- Use **meaningful variable names**
- Keep functions **small and focused**

### Manifest & Configuration

- Maintain **Manifest V3 compatibility**
- Ensure **cross-browser support** (Chrome, Firefox, Edge)
- Test with the **webextension-polyfill**

### Testing

- Test on **multiple browsers**
- Verify **all input types** (textarea, contenteditable, text inputs)
- Check **dynamic content handling**
- Test with **various toxicity examples** from `test.html`

## 🎯 Areas for Contribution

### High Priority

- 🧠 **Model improvements** - Enhance detection accuracy
- 🌐 **Internationalization** - Add support for more languages
- ♿ **Accessibility** - Improve screen reader support
- 🎨 **UI/UX enhancements** - Better visual feedback
- 📱 **Performance optimization** - Reduce resource usage

### Good First Issues

- 📚 **Documentation** - Improve README and inline docs
- 🧪 **Test cases** - Add more test scenarios
- 🐛 **Bug fixes** - Fix reported issues
- 🎨 **Styling** - Improve popup design
- 🔍 **Code refactoring** - Clean up existing code

## 🏗️ Project Structure

```
ToxicGuard_AI/
├── manifest.json         # Extension configuration (Manifest V3)
├── background.js         # Service worker (settings, messaging)
├── content.js           # Content script (detection engine)
├── popup.html/js        # Extension popup UI
├── test.html            # Comprehensive test page
├── lib/                 # Optional local TensorFlow.js assets
│   └── tensorflow/
├── icons/               # Extension icons
└── README.md           # Project documentation
```

## 🧪 Testing Your Changes

1. **Load the extension** in developer mode
2. **Open test.html** in your browser
3. **Test various scenarios**:
   - Type toxic and safe content
   - Test dynamic element creation
   - Verify auto-censoring functionality
   - Check settings persistence
4. **Test on multiple browsers** (Chrome, Firefox, Edge)
5. **Check console** for errors

## 📋 Commit Message Format

Use clear, descriptive commit messages:

```
feat: Add support for contenteditable detection
fix: Resolve model loading timeout issue
docs: Update installation instructions
style: Improve popup layout
refactor: Simplify detection logic
test: Add shadow DOM test cases
```

## 🔐 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Provide constructive feedback
- Focus on the code, not the person
- Keep discussions professional

## 📄 License

By contributing, you agree that your contributions will be licensed under the same MIT License that covers the project.

## 💬 Questions?

- 📧 Open an issue for questions
- 💡 Start a discussion on GitHub
- 🔍 Check existing documentation first

## 🙏 Recognition

All contributors will be:

- Listed in the Contributors section
- Credited in release notes
- Acknowledged in the project README

Thank you for helping make ToxicGuard AI better!

---

**Contributors:**
- [Jayanth-0703](https://github.com/Jayanth-0703) - Lead Developer
- [VKrishna04](https://github.com/VKrishna04) - Core Contributor

Want to be listed here? Start contributing today!
