import { EventEmitter } from 'events';

// =========================
// EVENT BUS GLOBAL
// =========================

class EventBus extends EventEmitter {}

export const eventBus = new EventBus();