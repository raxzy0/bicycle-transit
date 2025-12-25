# Bicycle Transit 🚴

A Chrome extension that enhances Google Maps transit directions by showing you how much time you can save by cycling instead of walking between transit stops.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Chrome Extension](https://img.shields.io/badge/chrome-extension-green.svg)
![License](https://img.shields.io/badge/license-MIT-orange.svg)

## 📋 Overview

Bicycle Transit automatically detects walking segments in your Google Maps transit routes and calculates how much faster you could complete them by bicycle. Perfect for commuters who want to optimize their journey time!

## ✨ Features

- 🔍 **Automatic Detection** - Identifies walking segments in transit directions
- ⚡ **Time Savings Display** - Shows estimated time saved by cycling vs walking
- ⚙️ **Customizable Speed** - Adjust cycling speed (10-30 km/h) to match your ability
- 🎨 **Clean UI** - Non-intrusive badges that blend with Google Maps design
- 💾 **Settings Persistence** - Your preferences are saved automatically
- 🌓 **Dark Mode Support** - Adapts to your system theme
- 🔄 **Real-time Updates** - Instantly reflects settings changes

## 🚀 Installation

### From Source (Developer Mode)

1. **Download or Clone this repository:**
   ```bash
   git clone https://github.com/raxzy0/bicycle-transit.git
   cd bicycle-transit
   ```

2. **Open Chrome Extensions page:**
   - Navigate to `chrome://extensions/`
   - Or click the Extensions icon → "Manage Extensions"

3. **Enable Developer Mode:**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the Extension:**
   - Click "Load unpacked"
   - Select the `bicycle-transit` folder
   - The extension icon should appear in your toolbar

5. **Pin the Extension (Optional):**
   - Click the Extensions icon (puzzle piece)
   - Find "Bicycle Transit" and click the pin icon

## 📖 Usage

### Basic Usage

1. **Open Google Maps** (https://maps.google.com)
2. **Search for transit directions** between two locations
3. **Look for the purple bicycle badges** on walking segments
4. **See the time savings** for each segment where cycling is faster

### Configuration

Click the Bicycle Transit icon in your toolbar to access settings:

#### Enable/Disable Extension
Toggle the extension on/off without uninstalling

#### Cycling Speed
- **Range:** 10-30 km/h
- **Default:** 15 km/h (moderate cycling pace)
- **Guidelines:**
  - 10-12 km/h: Leisurely pace
  - 15-18 km/h: Average commuter
  - 20-25 km/h: Experienced cyclist
  - 25-30 km/h: Fast cycling

#### Show Time Savings
Toggle whether to display the time saved in the badges

## 🎯 How It Works

1. **Detection:** The extension monitors Google Maps for transit direction results
2. **Analysis:** Identifies walking segments and extracts distance/time information
3. **Calculation:** Computes cycling time based on your configured speed
4. **Display:** Adds attractive badges showing cycling alternatives

### Calculation Method

```
Walking Speed: 5 km/h (Google Maps standard)
Cycling Speed: User-configurable (default 15 km/h)
Time Saved = (Distance / Walking Speed) - (Distance / Cycling Speed)
```

## 📸 Screenshots

> Note: Add screenshots here showing:
> - Extension popup with settings
> - Google Maps with bicycle badges
> - Before/after comparison

## 🔧 Technical Details

### Built With

- **Manifest V3** - Latest Chrome extension standard
- **Vanilla JavaScript** - No external dependencies
- **CSS3** - Modern styling with animations
- **Chrome Storage API** - Persistent settings

### File Structure

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
│   ├── icon16.png
│   ├── icon48.png
│   ├── icon128.png
│   └── icon.svg
└── README.md             # Documentation
```

### Permissions

- **storage** - Save user preferences
- **activeTab** - Interact with Google Maps pages
- **host_permissions** - Access maps.google.com and www.google.com/maps

## ⚠️ Known Limitations

- **DOM Dependency:** Relies on Google Maps DOM structure, which may change
- **Distance Estimation:** When only time is shown, distance is estimated
- **Very Long Distances:** May not be practical for distances >10km
- **Real-time Data:** Does not account for traffic, road conditions, or elevation
- **Route Quality:** Cannot verify if cycling routes are safe or bike-friendly

## 🐛 Troubleshooting

### Extension not working?

1. **Refresh Google Maps** - Press F5 or Ctrl+R
2. **Check if enabled** - Click extension icon and verify toggle is ON
3. **Reload extension:**
   - Go to `chrome://extensions/`
   - Click the refresh icon on the Bicycle Transit card
4. **Check permissions** - Ensure extension has access to Google Maps

### Badges not appearing?

1. **Ensure you're viewing transit directions** (not driving/walking only)
2. **Look for walking segments** - The extension only enhances transit routes with walking portions
3. **Try a different route** - Some routes may not have detectable walking segments
4. **Check browser console** - Press F12 and look for errors

### Settings not saving?

1. **Check Chrome sync** - Ensure you're signed into Chrome
2. **Check storage permissions** - Verify in `chrome://extensions/`
3. **Try clearing extension storage:**
   ```javascript
   // In browser console on any page:
   chrome.storage.sync.clear()
   ```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Setup

```bash
# Clone the repository
git clone https://github.com/raxzy0/bicycle-transit.git
cd bicycle-transit

# Make your changes
# Test by loading as unpacked extension in Chrome

# Generate icons (if modified)
python3 generate_icons.py
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google Maps for the excellent transit directions
- The cycling community for inspiration
- All contributors and users

## 📧 Contact

- **Issues:** [GitHub Issues](https://github.com/raxzy0/bicycle-transit/issues)
- **Discussions:** [GitHub Discussions](https://github.com/raxzy0/bicycle-transit/discussions)

## 🗺️ Roadmap

- [ ] Add support for different units (miles, feet)
- [ ] Integration with cycling route APIs
- [ ] Elevation profile consideration
- [ ] Weather-aware suggestions
- [ ] Multi-language support
- [ ] Statistics dashboard
- [ ] Export routes to cycling apps

## ⭐ Show Your Support

Give a ⭐️ if this project helped you plan better commutes!

---

**Made with ❤️ by cyclists, for cyclists**
