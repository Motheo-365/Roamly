import { EventEmitter } from "events";

/**
 * Trip Event System
 *
 * Implements the Observer Pattern.
 *
 * TripService emits events when something happens to a trip.
 * Other parts of the application can listen for these events
 * without TripService needing to know about them.
 */
class TripEventEmitter extends EventEmitter {}

const tripEvents = new TripEventEmitter();

export default tripEvents;