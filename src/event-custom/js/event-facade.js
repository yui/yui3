(function() {

/**
 * Wraps and protects a custom event for use when emitFacade is set to true.
 * @class EventFacade
 * @param e {Event} the custom event
 * @param currentTarget {HTMLElement} the element the listener was attached to
 */

/*
var PROPS = {
    details: 1,
    type: 1,
    target: 1,
    currentTarget: 1,
    stopPropagation: 2,
    stopImmediatePropagation: 2,
    preventDefault: 2,
    halt: 2
};

Y.EventFacade2 = function(e, currentTarget) {
    if (e) {
        Y.Object.each(PROPS, function(v, k) {
            //this[k] = (v == 2) ? e[k].apply(e, arguments) : e[k];
            var val = e[k];
            if (val) {
                this[k] = (v == 2) ? function() {
                    if (val) {
                        val.apply(e, arguments);
                    }
                } : val;
            } else {
                console.log('missing ' + k);
            }
        });
    }
};
*/

Y.EventFacade = function(e, currentTarget) {

    e = e || {};

    /**
     * The arguments passed to fire 
     * @property details
     * @type Array
     */
    this.details = e.details;

    /**
     * The event type
     * @property type
     * @type string
     */
    this.type = e.type;

    //////////////////////////////////////////////////////

    /**
     * Node reference for the targeted eventtarget
     * @propery target
     * @type Node
     */
    this.target = e.target;

    /**
     * Node reference for the element that the listener was attached to.
     * @propery currentTarget
     * @type Node
     */
    this.currentTarget = currentTarget;

    /**
     * Node reference to the relatedTarget
     * @propery relatedTarget
     * @type Node
     */
    this.relatedTarget = e.relatedTarget;
    
    /**
     * Stops the propagation to the next bubble target
     * @method stopPropagation
     */
    this.stopPropagation = function() {
        e.stopPropagation();
    };

    /**
     * Stops the propagation to the next bubble target and
     * prevents any additional listeners from being exectued
     * on the current target.
     * @method stopImmediatePropagation
     */
    this.stopImmediatePropagation = function() {
        e.stopImmediatePropagation();
    };

    /**
     * Prevents the event's default behavior
     * @method preventDefault
     */
    this.preventDefault = function() {
        e.preventDefault();
    };

    /**
     * Stops the event propagation and prevents the default
     * event behavior.
     * @method halt
     * @param immediate {boolean} if true additional listeners
     * on the current target will not be executed
     */
    this.halt = function(immediate) {
        e.halt(immediate);
    };

};

})();
