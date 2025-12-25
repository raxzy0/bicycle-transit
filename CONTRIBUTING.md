# Contributing to Bicycle Transit

First off, thank you for considering contributing to Bicycle Transit! It's people like you that make this extension better for everyone.

## Code of Conduct

This project and everyone participating in it is governed by basic principles of respect and collaboration. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (URLs, settings used, etc.)
- **Describe the behavior you observed** and what you expected
- **Include screenshots** if relevant
- **Specify your Chrome version** and operating system

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List any alternative solutions** you've considered

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following the code style guidelines
3. **Test your changes** thoroughly (see TESTING.md)
4. **Update documentation** if needed (README.md, ARCHITECTURE.md)
5. **Commit with clear messages** describing what and why
6. **Push to your fork** and submit a pull request

## Development Setup

### Prerequisites

- Chrome browser (latest version recommended)
- Git
- Python 3 (for icon generation)
- Basic knowledge of JavaScript and Chrome Extensions

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/bicycle-transit.git
cd bicycle-transit

# Install dependencies for icon generation (optional)
pip install Pillow cairosvg

# Generate icons if you modify icon.svg
python3 generate_icons.py
```

### Loading the Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select the `bicycle-transit` directory
5. The extension should now appear in your toolbar

### Making Changes

1. **Create a branch** for your feature/fix:
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes** in the appropriate files:
   - `manifest.json` - Extension configuration
   - `popup.*` - Settings UI
   - `content.js` - Google Maps interaction
   - `background.js` - Background tasks
   - `styles.css` - Visual styling

3. **Test your changes**:
   - Reload extension in `chrome://extensions/`
   - Test on Google Maps with various routes
   - Check browser console for errors
   - Follow checklist in TESTING.md

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Add amazing feature"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request** on GitHub

## Code Style Guidelines

### JavaScript

- Use modern ES6+ syntax (const, let, arrow functions, async/await)
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Handle errors gracefully

Example:
```javascript
// Good
async function loadSettings() {
  try {
    const result = await chrome.storage.sync.get(DEFAULT_SETTINGS);
    return result;
  } catch (error) {
    console.error('Error loading settings:', error);
    return DEFAULT_SETTINGS;
  }
}

// Avoid
function load() {
  chrome.storage.sync.get(d, function(r) {
    // nested callbacks, unclear names
  });
}
```

### CSS

- Use modern CSS features (flexbox, grid, CSS variables)
- Follow mobile-first approach
- Use semantic class names
- Keep specificity low
- Add comments for non-obvious styles

Example:
```css
/* Good */
.bicycle-transit-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
}

/* Avoid */
div.badge {
  display: block;
  padding-top: 10px;
  padding-left: 12px;
}
```

### HTML

- Use semantic HTML5 elements
- Include proper ARIA labels for accessibility
- Keep structure clean and readable
- Avoid inline styles and scripts

## Testing Guidelines

### Manual Testing

Before submitting a PR, test:

1. **Extension Installation** - Loads without errors
2. **Popup Functionality** - All controls work
3. **Content Script** - Detects and enhances walking segments
4. **Settings Persistence** - Settings save and load correctly
5. **Edge Cases** - Works with various route types

See [TESTING.md](TESTING.md) for detailed testing checklist.

### Browser Testing

Test on:
- Latest stable Chrome
- Chrome Beta (if possible)
- Both light and dark mode

## Documentation

Update documentation when:

- Adding new features
- Changing existing behavior
- Fixing significant bugs
- Modifying configuration options

Files to update:
- `README.md` - User-facing documentation
- `ARCHITECTURE.md` - Technical details
- `TESTING.md` - Testing procedures
- Code comments - Inline documentation

## Git Commit Messages

### Format

```
<type>: <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Formatting, missing semicolons, etc.
- **refactor**: Code restructuring without behavior change
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```
feat: Add elevation profile to time calculations

Calculate cycling time adjustments based on route elevation
to provide more accurate estimates for hilly routes.

Closes #123
```

```
fix: Badge not appearing on some walking segments

Improved walking segment detection to handle additional
DOM structures used by Google Maps.
```

## Project Structure

```
bicycle-transit/
├── manifest.json          # Extension configuration
├── popup.html            # Settings UI
├── popup.css             # Popup styling
├── popup.js              # Popup functionality
├── content.js            # Google Maps integration
├── background.js         # Service worker
├── styles.css            # Injected styles
├── icons/                # Extension icons
├── README.md             # User documentation
├── ARCHITECTURE.md       # Technical documentation
├── TESTING.md            # Testing guide
├── CONTRIBUTING.md       # This file
├── LICENSE               # MIT License
└── generate_icons.py     # Icon generation script
```

## Review Process

### What Happens After Submission

1. **Automated Checks** - Basic validation runs automatically
2. **Code Review** - Maintainer reviews your changes
3. **Feedback** - You may be asked to make changes
4. **Approval** - Once approved, PR is merged
5. **Release** - Changes included in next release

### Review Criteria

- **Functionality** - Does it work as intended?
- **Code Quality** - Is it well-written and maintainable?
- **Testing** - Has it been adequately tested?
- **Documentation** - Is it properly documented?
- **Impact** - Does it break existing functionality?

## Getting Help

### Questions?

- **GitHub Discussions** - For general questions and discussions
- **GitHub Issues** - For specific problems or bugs
- **Code Comments** - Check inline documentation

### Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [JavaScript MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## Recognition

Contributors will be:
- Listed in GitHub's contributors page
- Mentioned in release notes (for significant contributions)
- Appreciated in the community!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Bicycle Transit! 🚴✨
