# Installation Guide

## Quick Install (5 minutes)

### Step 1: Download the Extension

**Option A: Clone with Git**
```bash
git clone https://github.com/raxzy0/bicycle-transit.git
cd bicycle-transit
```

**Option B: Download ZIP**
1. Go to https://github.com/raxzy0/bicycle-transit
2. Click the green "Code" button
3. Select "Download ZIP"
4. Extract the ZIP file to a folder

### Step 2: Open Chrome Extensions Page

Choose one of these methods:

- Type `chrome://extensions/` in the address bar, or
- Menu → More Tools → Extensions, or
- Right-click extension icon → Manage Extensions

### Step 3: Enable Developer Mode

In the top-right corner of the Extensions page, toggle **Developer mode** ON.

### Step 4: Load the Extension

1. Click the **"Load unpacked"** button (appears after enabling Developer mode)
2. Navigate to and select the `bicycle-transit` folder
3. Click **"Select Folder"** or **"Open"**

### Step 5: Verify Installation

✓ You should see "Bicycle Transit" in your extensions list  
✓ The bicycle icon should appear in your Chrome toolbar  
✓ No error messages should be displayed

### Step 6: Pin the Extension (Optional)

1. Click the Extensions icon (puzzle piece) in Chrome toolbar
2. Find "Bicycle Transit" in the list
3. Click the pin icon to keep it visible

## 🎉 You're Done!

Now navigate to [Google Maps](https://maps.google.com) and search for transit directions to see the extension in action!

---

## Troubleshooting

### Extension doesn't load?

**Problem:** Error message when loading extension

**Solutions:**
1. Make sure you selected the correct folder (should contain `manifest.json`)
2. Check that all files are present (not a partial download)
3. Verify Chrome is up to date (requires Chrome 88+)
4. Try restarting Chrome

### Icon doesn't appear?

**Problem:** Can't find the extension icon

**Solutions:**
1. Click the Extensions icon (puzzle piece) in toolbar
2. Find "Bicycle Transit" and click the pin icon
3. Refresh the Extensions page (`chrome://extensions/`)
4. Reload the extension (click reload icon on the extension card)

### Not working on Google Maps?

**Problem:** Badges don't appear on walking segments

**Solutions:**
1. Click the Bicycle Transit icon and ensure it's **enabled** (toggle ON)
2. Hard refresh Google Maps (Ctrl+Shift+R or Cmd+Shift+R)
3. Try a different route with walking segments
4. Check browser console for errors (F12 → Console tab)
5. Reload the extension from `chrome://extensions/`

### Permission errors?

**Problem:** Extension can't access Google Maps

**Solutions:**
1. Go to `chrome://extensions/`
2. Find "Bicycle Transit"
3. Click "Details"
4. Scroll to "Site access"
5. Ensure it's set to "On specific sites" or "On all sites"
6. Add `https://maps.google.com` if needed

---

## Updating the Extension

### Manual Update

1. Download the latest version (git pull or re-download ZIP)
2. Go to `chrome://extensions/`
3. Find "Bicycle Transit"
4. Click the reload icon (↻)
5. Your settings will be preserved

### Check Version

1. Go to `chrome://extensions/`
2. Find "Bicycle Transit"
3. Version number is displayed below the extension name

---

## Uninstalling

### Complete Removal

1. Go to `chrome://extensions/`
2. Find "Bicycle Transit"
3. Click **"Remove"**
4. Confirm removal
5. (Optional) Delete the extension folder from your computer

### Temporary Disable

1. Go to `chrome://extensions/`
2. Find "Bicycle Transit"
3. Toggle the switch to **OFF**
4. Extension stops working but keeps your settings
5. Toggle back ON to re-enable

---

## Advanced Installation

### For Developers

If you want to modify the extension:

```bash
# Clone repository
git clone https://github.com/raxzy0/bicycle-transit.git
cd bicycle-transit

# Create a development branch
git checkout -b my-feature

# Make changes to files
# ... edit code ...

# Regenerate icons if modified
pip install Pillow cairosvg
python3 generate_icons.py

# Reload extension in Chrome to test
# Go to chrome://extensions/ and click reload

# Test on Google Maps
# ... verify changes ...
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed development guide.

---

## System Requirements

### Minimum Requirements

- **Browser:** Google Chrome 88 or newer
- **Operating System:** Windows, macOS, Linux, or Chrome OS
- **Disk Space:** < 1 MB
- **Internet:** Required for Google Maps

### Recommended

- **Browser:** Latest stable Chrome version
- **RAM:** No special requirements
- **Screen:** Any resolution (responsive design)

---

## Privacy & Permissions

### What the Extension Accesses

- **Chrome Storage:** Saves your settings locally
- **Google Maps pages:** Reads and modifies transit directions
- **Active Tab:** Required to interact with current page

### What the Extension DOES NOT Access

- ❌ Your location
- ❌ Your browsing history
- ❌ Your personal data
- ❌ Other websites (only Google Maps)
- ❌ Your passwords or payment info

### Data Storage

All settings are stored locally on your device using Chrome's Storage API. If Chrome sync is enabled, settings sync across your devices.

**No data is sent to external servers.**

---

## Getting Help

### Still Having Issues?

1. **Check the FAQ** in README.md
2. **Review TESTING.md** for common problems
3. **Open an issue** on GitHub with:
   - Chrome version
   - Operating system
   - Detailed description of the problem
   - Screenshots if relevant
   - Browser console errors (if any)

### Community Support

- **GitHub Issues:** https://github.com/raxzy0/bicycle-transit/issues
- **GitHub Discussions:** https://github.com/raxzy0/bicycle-transit/discussions

---

## Next Steps

After installation:

1. **Configure Settings** - Click the extension icon and adjust:
   - Cycling speed (10-30 km/h)
   - Time savings display
   
2. **Test It Out** - Go to Google Maps and search for:
   - Transit directions in your city
   - Routes with walking segments
   - Compare walking vs cycling times

3. **Provide Feedback** - Let us know:
   - What works well
   - What could be improved
   - Ideas for new features

---

**Happy Cycling! 🚴**
