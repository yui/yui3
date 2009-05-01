/*
 * Functionality to make the node a delegated event container
 * @module node
 * @for Node
 * @submodule node-event-delegate
 */

/**
 * Functionality to make the node a delegated event container
 * @event delegate
 * @param type {string} 'delegate'
 * @param fn {string} the function to execute
 * @param delegateType {string} the event type to delegate
 * @param spec {string} a selector that must match the target of the event.
 * @return {Event.Handle} the detach handle
 * @for YUI
 */
Y.Node.prototype.delegate = function(type, fn, delegateType, spec) {
    var a = Y.Array(arguments, 0, true);
    a.splice(2, 0, Y.Node.getDOMNode(this));
    return Y.on.apply(Y, a);
};

