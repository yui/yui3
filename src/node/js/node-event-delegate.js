/*
 * Functionality to make the node a delegated event container
 * @module node
 * @submodule node-event-delegate
 */

/**
 * Functionality to make the node a delegated event container
 * @method delegate
 * @param fn {Function} the function to execute
 * @param delegateType {String} the event type to delegate
 * @param selector {String} a selector that must match the target of the event.
 * @return {Event.Handle} the detach handle
 * @for Node
 */
Y.Node.prototype.delegate = function(fn, delegateType, selector) {
    var a = Y.Array(arguments, 0, true);
    a.push('delegate');
    a.splice(2, 0, Y.Node.getDOMNode(this));
    return Y.on.apply(Y, a);
};

