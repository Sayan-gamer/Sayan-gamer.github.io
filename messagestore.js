class MessageStore {
  constructor(initialMessage = "") {
    // The internal private variable storing the actual text
    this._message = initialMessage;
    
    // Array to hold all the "watcher" functions
    this.watchers = [];
  }

  // GETTER: What happens when you read 'store.message'
  get message() {
    return this._message;
  }

  // SETTER: What happens when you assign a new value to 'store.message'
  set message(newMessage) {
    if (this._message !== newMessage) {
      const oldMessage = this._message;
      this._message = newMessage;
      
      // Notify all registered watchers about the change
      this.notifyWatchers(newMessage, oldMessage);
    }
  }

  // Method to add a new watcher function
  watch(callback) {
    this.watchers.push(callback);
    
    // Return a function to easily "unwatch" later if needed
    return () => {
      this.watchers = this.watchers.filter(cb => cb !== callback);
    };
  }

  // Internal method to trigger the callbacks
  notifyWatchers(newVal, oldVal) {
    this.watchers.forEach(callback => callback(newVal, oldVal));
  }
}

// Export a single instance to share across your app
export const store = new MessageStore("Initial starting message");
