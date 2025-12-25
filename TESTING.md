# Testing Guide for Bicycle Transit Extension

## Manual Testing Checklist

### 1. Installation Testing

- [ ] Extension loads without errors in Chrome
- [ ] All icons display correctly (16px, 48px, 128px)
- [ ] Extension icon appears in Chrome toolbar
- [ ] No console errors on installation

### 2. Popup Testing

**Open the popup by clicking the extension icon**

- [ ] Popup opens and displays correctly
- [ ] All UI elements are visible and properly styled
- [ ] Enable/Disable toggle works
- [ ] Cycling speed slider works (10-30 km/h range)
- [ ] Speed value updates as slider moves
- [ ] Show Time Savings toggle works
- [ ] Settings save message appears
- [ ] Popup is responsive and looks good

### 3. Content Script Testing

**Navigate to Google Maps (https://maps.google.com)**

- [ ] No console errors on page load
- [ ] Extension initializes properly (check console for "Bicycle Transit: Initializing...")

**Search for transit directions:**

Example routes to test:
- New York: "Penn Station to Times Square"
- London: "King's Cross to Oxford Circus"
- San Francisco: "Ferry Building to Fisherman's Wharf"

- [ ] Walking segments are detected
- [ ] Bicycle badges appear on walking segments
- [ ] Time calculations are displayed
- [ ] Time savings are shown (if enabled)
- [ ] Badges have proper styling (purple gradient)
- [ ] Badges are clickable and show tooltip

### 4. Settings Persistence Testing

- [ ] Change cycling speed to 20 km/h and close popup
- [ ] Reopen popup - speed should still be 20 km/h
- [ ] Disable extension and close popup
- [ ] Reopen popup - extension should still be disabled
- [ ] Refresh Google Maps - settings should persist

### 5. Settings Update Testing

**With Google Maps open showing transit directions:**

- [ ] Open popup and change cycling speed
- [ ] Badges update with new time calculations
- [ ] Disable extension
- [ ] Badges disappear from the page
- [ ] Re-enable extension
- [ ] Badges reappear

### 6. Edge Cases Testing

- [ ] Test with very short walking segments (< 1 min)
- [ ] Test with long walking segments (> 20 min)
- [ ] Test with routes that have no walking segments
- [ ] Test with routes that have only walking (no transit)
- [ ] Test on different Google Maps URLs
- [ ] Test with different map views (satellite, terrain, etc.)

### 7. Performance Testing

- [ ] Extension doesn't slow down Google Maps
- [ ] No memory leaks over extended use
- [ ] CPU usage is reasonable
- [ ] Multiple route searches work correctly

### 8. Browser Compatibility

- [ ] Works on latest Chrome version
- [ ] Works on Chrome Beta (if available)
- [ ] Works with Chrome sync enabled/disabled

## Automated Checks

Run these commands in the repository root:

```bash
# Validate manifest
python3 -m json.tool manifest.json

# Check JavaScript syntax
node --check popup.js
node --check content.js
node --check background.js

# Verify all required files exist
ls -l manifest.json popup.html popup.css popup.js content.js background.js styles.css
ls -l icons/icon16.png icons/icon48.png icons/icon128.png
```

## Known Issues to Ignore

These are documented limitations, not bugs:

1. Extension relies on Google Maps DOM structure (may break if Google updates)
2. Distance estimation may not be 100% accurate when only time is shown
3. Very long distances may show unrealistic cycling times
4. Cannot verify if cycling routes are safe or bike-friendly

## Debugging Tips

### Enable Chrome Extension Debug Mode

1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Inspect views: service worker" for background debugging
4. Right-click extension icon → "Inspect popup" for popup debugging
5. Open DevTools on Google Maps page for content script debugging

### Common Console Messages

**Normal operation:**
- "Bicycle Transit: Initializing..."
- "Bicycle Transit: Settings loaded"
- "Bicycle Transit: Started observing"
- "Bicycle Transit: Processing routes..."
- "Bicycle Transit: Found X walking segments"

**Expected errors (ignore):**
- Messages about sending to closed content scripts (happens when tab closes)
- "Could not establish connection" (happens when content script not loaded yet)

### Force Refresh

If badges don't appear:
1. Hard refresh Google Maps (Ctrl+Shift+R or Cmd+Shift+R)
2. Reload extension from `chrome://extensions/`
3. Clear Chrome cache for maps.google.com

## Test Report Template

```
# Bicycle Transit Extension - Test Report

**Date:** [YYYY-MM-DD]
**Tester:** [Your Name]
**Chrome Version:** [Version Number]
**OS:** [Operating System]

## Installation
Status: [PASS/FAIL]
Notes: 

## Popup UI
Status: [PASS/FAIL]
Notes:

## Content Script
Status: [PASS/FAIL]
Notes:

## Settings Persistence
Status: [PASS/FAIL]
Notes:

## Settings Updates
Status: [PASS/FAIL]
Notes:

## Edge Cases
Status: [PASS/FAIL]
Notes:

## Performance
Status: [PASS/FAIL]
Notes:

## Overall Result
[PASS/FAIL]

## Additional Notes
[Any other observations]
```

## Reporting Issues

If you find bugs during testing:

1. Note the exact steps to reproduce
2. Check browser console for error messages
3. Include screenshots if relevant
4. Specify your Chrome version and OS
5. Report via GitHub Issues
