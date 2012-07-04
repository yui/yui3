/**
 * Adds functionality to simulate events.
 * @module node
 * @submodule node-event-simulate
 */

/**
 * Simulates an event or gesture on the node. On desktop, single touch gestures
 * such as tap, flick are simulated by using mouse events.
 * @param {String} type The type of event or name of the supported gesture to simulate 
 *      (i.e., "click", "doubletap", "flick").
 * @param {Object} options (Optional) Extra options to copy onto the event object.
 *      For gestures, options are used to refine the gesture behavior.
 * @return {void}
 * @for Node
 * @method simulate
 */
Y.Node.prototype.simulate = function (type, options) {

    if (Y.Event.GESTURES[type]) {
        Y.Event.simulateGesture(this, type, options);
    } else {
        Y.Event.simulate(Y.Node.getDOMNode(this), type, options);
    }
};