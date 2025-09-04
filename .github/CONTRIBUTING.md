# Contributing to ToxicGuard AI

Thank you for your interest in contributing to ToxicGuard AI! 🎉

This document provides guidelines for contributing to this project. Please read it carefully before submitting contributions.

## 🚨 Important Notice

**ToxicGuard AI is a small hobby project with limited maintenance.** While contributions are welcome, please note that:

- Response times may be slow
- Not all contributions may be accepted
- The project may have periods of inactivity
- Focus is on stability over rapid feature development

## 🤝 How to Contribute

### 1. 🐛 Report Issues
- Use the provided issue templates
- Search existing issues first
- Provide detailed reproduction steps
- Include browser and OS information

### 2. 💡 Suggest Features
- Use the feature request template
- Explain the use case clearly
- Consider the project's scope and goals
- Be patient with responses

### 3. 📝 Improve Documentation
- Fix typos and clarify instructions
- Add examples and use cases
- Update outdated information
- Improve wiki content

### 4. 🔧 Code Contributions
- Fork the repository
- Create a feature branch
- Follow coding standards
- Test thoroughly
- Submit a pull request

## 📋 Development Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, or Edge)
- Basic knowledge of JavaScript and browser extensions
- Text editor or IDE

### Local Development
```powershell
# Clone the repository
git clone https://github.com/Life-Experimentalists/ToxicGuard_AI.git
cd ToxicGuard_AI

# Load extension in browser
# 1. Open browser extensions page
# 2. Enable Developer mode
# 3. Click "Load unpacked"
# 4. Select the project folder
```

### Testing
```powershell
# Open test.html in browser
# Try the extension on various websites
# Test all features and settings
```

## 🎨 Code Style

### JavaScript
- Use ES6+ features
- Follow consistent indentation (2 spaces)
- Use meaningful variable names
- Add comments for complex logic
- Handle errors gracefully

### HTML/CSS
- Use semantic HTML
- Follow responsive design principles
- Maintain consistent styling
- Optimize for performance

### Files Structure
```
├── manifest.json          # Extension manifest
├── background.js          # Service worker
├── content.js            # Content script
├── popup.html/js         # Extension popup
├── icons/                # Extension icons
├── .github/              # GitHub templates
├── wiki/                 # Wiki documentation
└── .vscode/              # VSCode configuration
```

## 🔄 Pull Request Process

### Before Submitting
1. **Test thoroughly** on multiple browsers
2. **Update documentation** if needed
3. **Follow code style** guidelines
4. **Write clear commit messages**
5. **Keep changes focused** and atomic

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring

## Testing
- [ ] Tested on Chrome
- [ ] Tested on Firefox
- [ ] Tested on Edge
- [ ] All existing functionality works

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

## 🏷️ Issue Labels

### Type
- `bug` - Something isn't working
- `enhancement` - New feature or improvement
- `documentation` - Documentation related
- `question` - Question about the project

### Priority
- `low` - Low priority
- `medium` - Medium priority
- `high` - High priority
- `critical` - Critical issue

### Status
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `wontfix` - This will not be worked on
- `duplicate` - This issue already exists

## 📚 Resources

### Documentation
- [Browser Extension APIs](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [TensorFlow.js Documentation](https://www.tensorflow.org/js)
- [Manifest V3 Guide](https://developer.chrome.com/docs/extensions/mv3/)

### Tools
- [Chrome Extension Developer Tools](https://developer.chrome.com/docs/extensions/mv3/devtools/)
- [Firefox Extension Workshop](https://extensionworkshop.com/)

## 🤔 Questions?

If you have questions about contributing:

1. **Check existing issues** and discussions
2. **Read the documentation** in the wiki
3. **Ask in discussions** for general questions
4. **Create an issue** for specific problems

## 🙏 Recognition

Contributors will be recognized in:
- README.md acknowledgments
- Release notes
- Project documentation

## 📜 License

By contributing to ToxicGuard AI, you agree that your contributions will be licensed under the Apache 2.0 License.

---

**Thank you for contributing to ToxicGuard AI!** 🛡️✨
