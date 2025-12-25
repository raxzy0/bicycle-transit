# Bicycle Transit - Architecture & Implementation Details

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Chrome Extension                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │   Popup UI   │         │  Background  │                  │
│  │              │◄───────►│   Service    │                  │
│  │  - Settings  │  Events │   Worker     │                  │
│  │  - Toggles   │         │              │                  │
│  └──────────────┘         └──────────────┘                  │
│         │                        │                            │
│         │ Settings               │ Messages                  │
│         ▼                        ▼                            │
│  ┌─────────────────────────────────────────┐                │
│  │       Chrome Storage API                 │                │
│  └─────────────────────────────────────────┘                │
│                                  │                            │
└──────────────────────────────────┼────────────────────────────┘
                                   │ Inject
                                   ▼
                    ┌──────────────────────────┐
                    │    Google Maps Page      │
                    ├──────────────────────────┤
                    │  ┌────────────────────┐  │
                    │  │  Content Script    │  │
                    │  │  - DOM Observer    │  │
                    │  │  - Route Parser    │  │
                    │  │  - Badge Injector  │  │
                    │  └────────────────────┘  │
                    │           │               │
                    │           ▼               │
                    │  ┌────────────────────┐  │
                    │  │  Injected Styles   │  │
                    │  └────────────────────┘  │
                    └──────────────────────────┘
```

## Component Interactions

### 1. User Interaction Flow

```
User clicks extension icon
    │
    ▼
Opens popup.html
    │
    ▼
Loads popup.js & popup.css
    │
    ▼
Reads settings from Chrome Storage
    │
    ▼
Displays current configuration
    │
    ▼
User modifies settings (e.g., cycling speed)
    │
    ▼
popup.js saves to Chrome Storage
    │
    ▼
Sends message to active Google Maps tabs
    │
    ▼
content.js receives update and recalculates
```

### 2. Page Load Flow

```
User navigates to maps.google.com
    │
    ▼
Chrome injects content.js & styles.css
    │
    ▼
content.js initializes
    │
    ▼
Loads settings from Chrome Storage
    │
    ▼
Sets up MutationObserver on DOM
    │
    ▼
Waits for route results to appear
    │
    ▼
User searches for transit directions
    │
    ▼
MutationObserver detects DOM changes
    │
    ▼
content.js processes route elements
    │
    ▼
Identifies walking segments
    │
    ▼
Extracts time/distance information
    │
    ▼
Calculates cycling alternatives
    │
    ▼
Injects bicycle badges into DOM
```

## Key Algorithms

### Walking Segment Detection

```javascript
function findWalkingSegments() {
  // 1. Query DOM for elements with walking indicators
  // 2. Check text content for "walk", "walking" keywords
  // 3. Verify presence of time (e.g., "5 min") or distance (e.g., "400 m")
  // 4. Filter out already-processed elements
  // 5. Return array of walking segment elements
}
```

### Time Calculation

```javascript
// Constants
WALKING_SPEED = 5 km/h (Google Maps standard)
CYCLING_SPEED = user setting (default 15 km/h)

// If distance is known:
walkingTime = (distance / WALKING_SPEED) * 60  // in minutes
cyclingTime = (distance / CYCLING_SPEED) * 60  // in minutes

// If only time is known:
distance = (walkingTime / 60) * WALKING_SPEED  // in km
cyclingTime = (distance / CYCLING_SPEED) * 60  // in minutes

timeSaved = walkingTime - cyclingTime
```

### Badge Injection

```javascript
function addBicycleBadge(element, walkInfo, cycleInfo) {
  // 1. Create badge container with class 'bicycle-transit-badge'
  // 2. Add bicycle icon (🚴)
  // 3. Add cycling time information
  // 4. If enabled, add time savings display
  // 5. Add tooltip with details
  // 6. Find appropriate insertion point in DOM
  // 7. Insert badge element
  // 8. Mark element as processed to avoid duplicates
}
```

## Data Flow

### Settings Storage

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│  Popup JS   │ save()  │    Chrome    │ read()  │ Content JS  │
│             ├────────►│   Storage    │◄────────┤             │
│  (Editor)   │         │     API      │         │  (Consumer) │
└─────────────┘         └──────────────┘         └─────────────┘
                              │
                              │ sync
                              ▼
                        ┌──────────────┐
                        │ Google Cloud │
                        │   (if sync   │
                        │   enabled)   │
                        └──────────────┘
```

### Message Passing

```
┌─────────────┐                       ┌─────────────┐
│  Popup JS   │ settingsUpdated msg   │ Content JS  │
│             ├──────────────────────►│             │
│             │                       │ Tab 1       │
└─────────────┘                       └─────────────┘
      │                               ┌─────────────┐
      │        settingsUpdated msg    │ Content JS  │
      └──────────────────────────────►│             │
                                      │ Tab 2       │
                                      └─────────────┘
```

## DOM Integration Points

### Google Maps DOM Structure (Simplified)

```
<body>
  <div id="map">
    <div id="panel">
      <div id="section-directions-trip-0">
        <div class="transit-step">
          <div class="walk-segment">        ← Target for detection
            <span>Walk 5 min (400 m)</span> ← Text parsing
            [BICYCLE BADGE INSERTED HERE]   ← Injection point
          </div>
        </div>
        <div class="transit-step">
          <div class="transit-vehicle">
            <span>Take Bus 42</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
```

## Performance Considerations

### Optimization Strategies

1. **Debouncing**: MutationObserver callbacks are debounced (500ms) to avoid excessive processing
2. **Element Marking**: Processed elements are marked with `data-bicycle-transit-processed` to prevent reprocessing
3. **Selective DOM Queries**: Only query relevant sections, not entire document
4. **Efficient Selectors**: Use specific CSS selectors to minimize search space
5. **Periodic Fallback**: 3-second interval check as fallback (in case observer misses changes)

### Memory Management

- Observer is disconnected when extension is disabled
- Event listeners are properly cleaned up
- No long-term data caching (settings only)
- Badge elements are removed when extension is disabled

## Security Considerations

### Content Security Policy

- No inline scripts in HTML
- All JavaScript in separate files
- No eval() or similar dangerous functions
- No external resource loading

### Data Privacy

- No data sent to external servers
- Settings stored locally via Chrome Storage API
- No tracking or analytics
- No access to user's location or personal data

### Permissions Justification

- **storage**: Required to save user preferences across sessions
- **activeTab**: Needed to interact with Google Maps page content
- **host_permissions**: Limited to maps.google.com domains only

## Browser Compatibility

### Chrome Version Support

- **Minimum**: Chrome 88 (Manifest V3 support)
- **Recommended**: Chrome 100+
- **Tested**: Latest stable Chrome version

### Manifest V3 Features Used

- Service Worker (background.js) instead of persistent background page
- chrome.action instead of chrome.browserAction
- Promise-based APIs (async/await)
- Declarative content scripts

## Error Handling

### Graceful Degradation

```javascript
try {
  // Attempt operation
  processRoute();
} catch (error) {
  // Log error but don't break functionality
  console.error('Bicycle Transit:', error);
  // Extension continues to work for other routes
}
```

### User-Facing Errors

- Settings save failures show error status in popup
- Missing permissions are handled silently
- DOM parsing errors don't affect other segments
- Extension can be toggled off if issues occur

## Future Enhancement Ideas

1. **API Integration**: Connect to cycling route APIs (Strava, Komoot)
2. **Elevation Data**: Account for hills in time calculations
3. **Weather Integration**: Adjust suggestions based on weather
4. **Statistics**: Track time saved over multiple trips
5. **Multi-Language**: Support for non-English Google Maps
6. **Custom Routes**: Allow users to define preferred cycling routes
7. **Bike Sharing**: Integration with bike-sharing services
8. **Export**: Export routes to GPX or other formats

## Development Workflow

```
1. Edit source files
   ├── manifest.json
   ├── popup.html/css/js
   ├── content.js
   ├── background.js
   └── styles.css

2. Go to chrome://extensions/

3. Click "Reload" on extension card

4. Test changes on Google Maps

5. Check browser console for errors

6. Iterate until working

7. Commit changes to git
```

## Debugging Guide

### Console Logging

All logs are prefixed with "Bicycle Transit:" for easy filtering:

```javascript
// In Chrome DevTools console:
// Filter by "Bicycle Transit" to see only extension logs
```

### Breakpoint Locations

**popup.js:**
- Line with `chrome.storage.sync.set()` - Settings save
- Line with `chrome.tabs.sendMessage()` - Message sending

**content.js:**
- Function `processExistingRoutes()` - Route processing trigger
- Function `enhanceWalkingSegment()` - Badge creation
- Function `extractWalkingInfo()` - Data parsing

**background.js:**
- Event `chrome.runtime.onInstalled` - Installation
- Event `chrome.storage.onChanged` - Settings changes

### Testing Checklist

See [TESTING.md](TESTING.md) for comprehensive testing guide.

## License

MIT License - See LICENSE file for details.
