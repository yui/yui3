/*
 * Functionality to make the node a delegated event container
 * @module node
 * @submodule node-event-delegate
 */

/**
 * Functionality to make the node a delegated event container
 * @method delegate
 * @param type {String} the event type to delegate
 * @param fn {Function} the function to execute
 * @param selector {String} a selector that must match the target of the event.
 * @return {Event.Handle} the detach handle
 * @for Node
 */
Y.Node.prototype.delegate = function(type, fn, selector, context) {
    context = context || this;
    var args = Array.prototype.slice.call(arguments, 4),
        a = ['delegate', fn, Y.Node.getDOMNode(this), type, selector, context];
    a = a.concat(args);
    return Y.on.apply(Y, a);
};

