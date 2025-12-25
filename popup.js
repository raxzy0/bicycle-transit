// Default settings
const DEFAULT_SETTINGS = {
  enabled: true,
  cyclingSpeed: 15,
  showTimeSavings: true
};

// DOM elements
let enabledToggle;
let cyclingSpeedSlider;
let speedDisplay;
let showTimeSavingsToggle;
let statusElement;
let statusMessage;

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  // Get DOM elements
  enabledToggle = document.getElementById('enabled-toggle');
  cyclingSpeedSlider = document.getElementById('cycling-speed');
  speedDisplay = document.getElementById('speed-display');
  showTimeSavingsToggle = document.getElementById('show-time-savings');
  statusElement = document.getElementById('status');
  statusMessage = document.getElementById('status-message');

  // Load saved settings
  await loadSettings();

  // Add event listeners
  enabledToggle.addEventListener('change', handleEnabledChange);
  cyclingSpeedSlider.addEventListener('input', handleSpeedChange);
  showTimeSavingsToggle.addEventListener('change', handleTimeSavingsChange);
});

// Load settings from Chrome storage
async function loadSettings() {
  try {
    const result = await chrome.storage.sync.get(DEFAULT_SETTINGS);
    
    // Update UI with loaded settings
    enabledToggle.checked = result.enabled;
    cyclingSpeedSlider.value = result.cyclingSpeed;
    speedDisplay.textContent = result.cyclingSpeed;
    showTimeSavingsToggle.checked = result.showTimeSavings;
    
    // Update slider gradient
    updateSliderGradient(result.cyclingSpeed);
  } catch (error) {
    console.error('Error loading settings:', error);
    showStatus('Error loading settings', false);
  }
}

// Save settings to Chrome storage
async function saveSettings(settings) {
  try {
    await chrome.storage.sync.set(settings);
    showStatus('Settings saved', true);
    
    // Notify content script of changes
    const tabs = await chrome.tabs.query({ 
      url: ['https://www.google.com/maps/*', 'https://maps.google.com/*'] 
    });
    
    for (const tab of tabs) {
      chrome.tabs.sendMessage(tab.id, { 
        action: 'settingsUpdated', 
        settings 
      }).catch(() => {
        // Ignore errors if content script isn't loaded yet
      });
    }
  } catch (error) {
    console.error('Error saving settings:', error);
    showStatus('Error saving settings', false);
  }
}

// Handle enabled toggle change
async function handleEnabledChange(event) {
  await saveSettings({ enabled: event.target.checked });
}

// Timeout for debouncing speed changes
let speedChangeTimeout = null;

// Handle cycling speed change
function handleSpeedChange(event) {
  const speed = parseInt(event.target.value);
  speedDisplay.textContent = speed;
  updateSliderGradient(speed);
  
  // Debounce saving
  if (speedChangeTimeout) {
    clearTimeout(speedChangeTimeout);
  }
  speedChangeTimeout = setTimeout(async () => {
    await saveSettings({ cyclingSpeed: speed });
  }, 500);
}

// Handle time savings toggle change
async function handleTimeSavingsChange(event) {
  await saveSettings({ showTimeSavings: event.target.checked });
}

// Update slider gradient based on value
function updateSliderGradient(value) {
  const min = parseInt(cyclingSpeedSlider.min);
  const max = parseInt(cyclingSpeedSlider.max);
  const percentage = ((value - min) / (max - min)) * 100;
  
  cyclingSpeedSlider.style.background = 
    `linear-gradient(to right, #667eea 0%, #667eea ${percentage}%, #e0e0e0 ${percentage}%, #e0e0e0 100%)`;
}

// Show status message
function showStatus(message, success) {
  statusMessage.textContent = message;
  statusElement.classList.add('visible');
  
  if (success) {
    statusElement.querySelector('.status-icon').textContent = '✓';
    statusElement.style.color = '#1e8e3e';
  } else {
    statusElement.querySelector('.status-icon').textContent = '✗';
    statusElement.style.color = '#d93025';
  }
  
  // Hide after 2 seconds
  setTimeout(() => {
    statusElement.classList.remove('visible');
  }, 2000);
}
