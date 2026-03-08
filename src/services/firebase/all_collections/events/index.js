/**
 * Subcolección: events
 * Ref: arquitectura/firebase/events.md
 */

export * from "./eventsConfig.js";
export {
  eventRef,
  eventsRef,
  getEvent,
  addEvent,
  listEvents,
} from "./eventsService.js";
