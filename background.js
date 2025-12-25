// Bicycle Transit - Background Service Worker

// Install event
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Bicycle Transit: Extension installed/updated', details.reason);
  
  // Set default settings if this is a new install
  if (details.reason === 'install') {
    chrome.storage.sync.set({
      enabled: true,
      cyclingSpeed: 15,
      showTimeSavings: true
    }, () => {
      console.log('Bicycle Transit: Default settings initialized');
    });
  }
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Bicycle Transit: Message received', message);
  
  if (message.action === 'getSettings') {
    // Return current settings
    chrome.storage.sync.get({
      enabled: true,
      cyclingSpeed: 15,
      showTimeSavings: true
    }, (settings) => {
      sendResponse(settings);
    });
    return true; // Keep channel open for async response
  }
  
  if (message.action === 'logEvent') {
    // Log events for debugging
    console.log('Bicycle Transit Event:', message.event, message.data);
  }
});

// Handle extension icon click (optional - could open options or show status)
chrome.action.onClicked.addListener((tab) => {
  console.log('Bicycle Transit: Extension icon clicked', tab.url);
});

// Monitor tab updates to inject content script if needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check if the tab is a Google Maps page using proper URL validation
  if (changeInfo.status === 'complete' && tab.url) {
    try {
      const url = new URL(tab.url);
      const isMapsPage = (url.hostname === 'maps.google.com' || 
                         url.hostname === 'www.google.com') && 
                         url.pathname.startsWith('/maps');
      
      if (isMapsPage) {
        console.log('Bicycle Transit: Google Maps page loaded', tab.url);
        
        // Send a message to content script to refresh if settings changed
        chrome.tabs.sendMessage(tabId, { 
          action: 'pageLoaded' 
        }).catch(() => {
          // Content script might not be ready yet, that's ok
        });
      }
    } catch (error) {
      // Invalid URL, ignore
    }
  }
});

// Handle storage changes
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'sync') {
    console.log('Bicycle Transit: Settings changed', changes);
    
    // Notify all Google Maps tabs about the settings change
    chrome.tabs.query({
      url: ['https://www.google.com/maps/*', 'https://maps.google.com/*']
    }, (tabs) => {
      const settings = {};
      for (const key in changes) {
        settings[key] = changes[key].newValue;
      }
      
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          action: 'settingsUpdated',
          settings
        }).catch(() => {
          // Ignore if content script isn't loaded
        });
      });
    });
  }
});

// Note: Periodic maintenance tasks can be added here if needed in the future
// For example: cleaning up old cached data, checking for updates, etc.

console.log('Bicycle Transit: Background service worker loaded');
