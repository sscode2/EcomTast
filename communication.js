// Communication module between Admin and User panels

// Event system for communication between panels
class PanelCommunication {
    constructor() {
        this.events = {};
    }
    
    // Subscribe to an event
    subscribe(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }
    
    // Publish an event
    publish(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }
}

// Create a global instance
const panelComm = new PanelCommunication();

// Make it available globally
window.panelComm = panelComm;

// Function to notify about book changes
function notifyBookChange() {
    panelComm.publish('bookChange', {});
}

// Function to notify about order changes
function notifyOrderChange() {
    panelComm.publish('orderChange', {});
}

// Make these functions available globally
window.notifyBookChange = notifyBookChange;
window.notifyOrderChange = notifyOrderChange;