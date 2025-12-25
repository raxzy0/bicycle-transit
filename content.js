// Bicycle Transit - Content Script
// This script runs on Google Maps pages and modifies transit routes

const WALKING_SPEED_KMH = 5; // Average walking speed
let settings = {
  enabled: true,
  cyclingSpeed: 15,
  showTimeSavings: true
};

// Initialize
(async function init() {
  console.log('Bicycle Transit: Initializing...');
  
  // Load settings
  await loadSettings();
  
  // Start observing Google Maps for route changes
  if (settings.enabled) {
    startObserving();
  }
  
  // Listen for settings updates
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'settingsUpdated') {
      settings = { ...settings, ...message.settings };
      console.log('Bicycle Transit: Settings updated', settings);
      
      if (settings.enabled) {
        startObserving();
        processExistingRoutes();
      } else {
        stopObserving();
        removeModifications();
      }
    }
  });
})();

// Load settings from Chrome storage
async function loadSettings() {
  try {
    const result = await chrome.storage.sync.get({
      enabled: true,
      cyclingSpeed: 15,
      showTimeSavings: true
    });
    settings = result;
    console.log('Bicycle Transit: Settings loaded', settings);
  } catch (error) {
    console.error('Bicycle Transit: Error loading settings', error);
  }
}

// MutationObserver instance
let observer = null;

// Start observing DOM changes
function startObserving() {
  if (observer) return;
  
  observer = new MutationObserver((mutations) => {
    // Debounce processing
    clearTimeout(startObserving.timeout);
    startObserving.timeout = setTimeout(() => {
      processExistingRoutes();
    }, 500);
  });
  
  // Observe the main content area where routes appear
  const targetNode = document.querySelector('#section-directions-trip-0') || document.body;
  observer.observe(targetNode, {
    childList: true,
    subtree: true
  });
  
  console.log('Bicycle Transit: Started observing');
}

// Stop observing
function stopObserving() {
  if (observer) {
    observer.disconnect();
    observer = null;
    console.log('Bicycle Transit: Stopped observing');
  }
}

// Process existing routes on the page
function processExistingRoutes() {
  if (!settings.enabled) return;
  
  console.log('Bicycle Transit: Processing routes...');
  
  // Find all walking segments in transit directions
  const walkingSegments = findWalkingSegments();
  
  if (walkingSegments.length > 0) {
    console.log(`Bicycle Transit: Found ${walkingSegments.length} walking segments`);
    walkingSegments.forEach(segment => enhanceWalkingSegment(segment));
  }
}

// Find walking segments in the directions
function findWalkingSegments() {
  const segments = [];
  
  // Look for elements that contain walking instructions
  // Google Maps uses various selectors, we'll try common patterns
  const selectors = [
    '[class*="transit-"] div[class*="walk"]',
    'div[jsaction*="directions"]',
    '.directions-mode-walk',
    '[aria-label*="Walk"]',
    '[aria-label*="walk"]'
  ];
  
  selectors.forEach(selector => {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        // Check if it's a walking segment and not already processed
        if (isWalkingSegment(el) && !el.hasAttribute('data-bicycle-transit-processed')) {
          segments.push(el);
        }
      });
    } catch (e) {
      // Selector might not be valid, skip
    }
  });
  
  // Also look for sections with specific text patterns
  const allDivs = document.querySelectorAll('div');
  allDivs.forEach(div => {
    const text = div.textContent || '';
    if ((text.includes('Walk') || text.includes('walk')) && 
        text.match(/\d+\s*(min|mins|minute|minutes)/) &&
        !div.hasAttribute('data-bicycle-transit-processed') &&
        div.clientHeight > 0) {
      
      // Check if it's not already in our segments
      const isNew = !segments.some(seg => seg.contains(div) || div.contains(seg));
      if (isNew && isWalkingSegment(div)) {
        segments.push(div);
      }
    }
  });
  
  return segments;
}

// Check if an element represents a walking segment
function isWalkingSegment(element) {
  const text = element.textContent || '';
  const ariaLabel = element.getAttribute('aria-label') || '';
  const className = element.className || '';
  
  // Look for walking indicators
  const hasWalkKeyword = /\b(walk|walking)\b/i.test(text + ariaLabel + className);
  const hasDistance = /\d+\s*(m|km|ft|mi)/i.test(text);
  const hasTime = /\d+\s*(min|mins|minute|minutes)/i.test(text);
  
  return hasWalkKeyword && (hasDistance || hasTime);
}

// Enhance a walking segment with bicycle information
function enhanceWalkingSegment(element) {
  // Mark as processed
  element.setAttribute('data-bicycle-transit-processed', 'true');
  
  // Extract walking information
  const walkInfo = extractWalkingInfo(element);
  if (!walkInfo) return;
  
  // Calculate cycling time
  const cycleInfo = calculateCyclingInfo(walkInfo);
  
  // Add bicycle transit badge
  addBicycleBadge(element, walkInfo, cycleInfo);
}

// Extract walking information from element
function extractWalkingInfo(element) {
  const text = element.textContent || '';
  
  // Extract time (in minutes)
  const timeMatch = text.match(/(\d+)\s*(min|mins|minute|minutes)/i);
  const walkingMinutes = timeMatch ? parseInt(timeMatch[1]) : null;
  
  // Extract distance
  let distanceKm = null;
  const distanceMatchKm = text.match(/(\d+\.?\d*)\s*km/i);
  const distanceMatchM = text.match(/(\d+)\s*m\b/i);
  const distanceMatchMi = text.match(/(\d+\.?\d*)\s*mi/i);
  const distanceMatchFt = text.match(/(\d+)\s*ft/i);
  
  if (distanceMatchKm) {
    distanceKm = parseFloat(distanceMatchKm[1]);
  } else if (distanceMatchM) {
    distanceKm = parseInt(distanceMatchM[1]) / 1000;
  } else if (distanceMatchMi) {
    distanceKm = parseFloat(distanceMatchMi[1]) * 1.60934;
  } else if (distanceMatchFt) {
    distanceKm = parseInt(distanceMatchFt[1]) * 0.0003048;
  } else if (walkingMinutes) {
    // Estimate distance from time using average walking speed
    distanceKm = (walkingMinutes / 60) * WALKING_SPEED_KMH;
  }
  
  if (!walkingMinutes && !distanceKm) return null;
  
  return {
    walkingMinutes: walkingMinutes || Math.round((distanceKm / WALKING_SPEED_KMH) * 60),
    distanceKm: distanceKm || (walkingMinutes / 60) * WALKING_SPEED_KMH
  };
}

// Calculate cycling information
function calculateCyclingInfo(walkInfo) {
  const cyclingMinutes = Math.round((walkInfo.distanceKm / settings.cyclingSpeed) * 60);
  const timeSavedMinutes = walkInfo.walkingMinutes - cyclingMinutes;
  
  return {
    cyclingMinutes,
    timeSavedMinutes,
    speedRatio: settings.cyclingSpeed / WALKING_SPEED_KMH
  };
}

// Add bicycle badge to the element
function addBicycleBadge(element, walkInfo, cycleInfo) {
  // Check if badge already exists
  if (element.querySelector('.bicycle-transit-badge')) return;
  
  // Create badge container
  const badge = document.createElement('div');
  badge.className = 'bicycle-transit-badge';
  
  // Create badge content
  const icon = document.createElement('span');
  icon.className = 'bicycle-transit-icon';
  icon.innerHTML = '🚴';
  
  const info = document.createElement('span');
  info.className = 'bicycle-transit-info';
  
  if (settings.showTimeSavings && cycleInfo.timeSavedMinutes > 0) {
    info.innerHTML = `
      <strong>Cycle instead:</strong> ${cycleInfo.cyclingMinutes} min
      <span class="time-saved">(Save ${cycleInfo.timeSavedMinutes} min)</span>
    `;
  } else {
    info.innerHTML = `<strong>Cycle instead:</strong> ${cycleInfo.cyclingMinutes} min`;
  }
  
  badge.appendChild(icon);
  badge.appendChild(info);
  
  // Add tooltip
  badge.title = `Cycling at ${settings.cyclingSpeed} km/h for ${walkInfo.distanceKm.toFixed(2)} km`;
  
  // Insert badge
  // Try to find a good position in the element
  const insertPosition = findBestInsertPosition(element);
  if (insertPosition) {
    insertPosition.appendChild(badge);
  } else {
    element.appendChild(badge);
  }
}

// Find the best position to insert the badge
function findBestInsertPosition(element) {
  // Look for a details container or instructions area
  const candidates = [
    element.querySelector('[class*="instructions"]'),
    element.querySelector('[class*="details"]'),
    element.querySelector('[class*="step"]'),
    element.querySelector('div:first-child')
  ];
  
  for (const candidate of candidates) {
    if (candidate) return candidate;
  }
  
  return element;
}

// Remove all modifications
function removeModifications() {
  const badges = document.querySelectorAll('.bicycle-transit-badge');
  badges.forEach(badge => badge.remove());
  
  const processed = document.querySelectorAll('[data-bicycle-transit-processed]');
  processed.forEach(el => el.removeAttribute('data-bicycle-transit-processed'));
  
  console.log('Bicycle Transit: Removed all modifications');
}

// Periodic check for new routes (fallback if MutationObserver misses something)
setInterval(() => {
  if (settings.enabled) {
    processExistingRoutes();
  }
}, 3000);
