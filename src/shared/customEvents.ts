export class LMFeedCustomEvents {
  events: Record<string, string>;
  private eventListenerMap: Record<string, EventListener>;
  constructor() {
    this.events = {};
    this.eventListenerMap = {};
  }
  private registerEvent(eventName: string) {
    this.events[eventName] = eventName;
  }
  dispatchEvent(eventName: string, data?: Record<string, unknown>) {
    this.registerEvent(eventName);

    const customEvent = new CustomEvent(eventName, {
      detail: data,
    });
    dispatchEvent(customEvent);
    return;
  }
  listen(eventName: string, callback: EventListener) {
    this.eventListenerMap[eventName] = callback;
    addEventListener(eventName, callback);
  }
  remove(eventName: string) {
    removeEventListener(eventName, this.eventListenerMap[eventName]);
  }
}
