type EventCallback = (...args: any[]) => void;

class EventBus {
  private events: {[key: string]: EventCallback[]} = {};

  on(event: string, callback: EventCallback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event: string, callback: EventCallback) {
    if (!this.events[event]) {
      return;
    }
    this.events[event] = this.events[event].filter((cb) => cb !== callback);
  }

  emit(event: string, ...args: any[]) {
    if (!this.events[event]) {
      return;
    }

    // Push event handling to next tick
    requestAnimationFrame(() => {
      this.events[event].forEach((callback) => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    });
  }
}

export default new EventBus();
