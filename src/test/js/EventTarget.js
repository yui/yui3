
/**
 * Simple custom event implementation.
 * @namespace Test
 * @module test
 * @class EventTarget
 * @constructor
 */
YUITest.EventTarget = function(){

    /**
     * Event handlers for the various events.
     * @type Object
     * @private
     * @property _handlers
     * @static
     */
    this._handlers = {};

};

YUITest.EventTarget.prototype = {

    //restore prototype
    constructor: YUITest.EventTarget,

    //-------------------------------------------------------------------------
    // Event Handling
    //-------------------------------------------------------------------------

    /**
     * Adds a listener for a given event type.
     * @param {String} type The type of event to add a listener for.
     * @param {Function} listener The function to call when the event occurs.
     * @method attach
     */
    attach: function(type, listener){
        if (typeof this._handlers[type] == "undefined"){
            this._handlers[type] = [];
        }

        this._handlers[type].push(listener);
    },

    /**
     * Adds a listener for a given event type.
     * @param {String} type The type of event to add a listener for.
     * @param {Function} listener The function to call when the event occurs.
     * @method subscribe
     * @deprecated
     */
    subscribe: function(type, listener){
        this.attach.apply(this, arguments);
    },

    /**
     * Fires an event based on the passed-in object.
     * @param {Object|String} event An object with at least a 'type' attribute
     *      or a string indicating the event name.
     * @method fire
     */
    fire: function(event){
        if (typeof event == "string"){
            event = { type: event };
        }
        if (!event.target){
            event.target = this;
        }

        if (!event.type){
            throw new Error("Event object missing 'type' property.");
        }

        if (this._handlers[event.type] instanceof Array){
            var handlers = this._handlers[event.type];
            for (var i=0, len=handlers.length; i < len; i++){
                handlers[i].call(this, event);
            }
        }
    },

    /**
     * Removes a listener for a given event type.
     * @param {String} type The type of event to remove a listener from.
     * @param {Function} listener The function to remove from the event.
     * @method detach
     */
    detach: function(type, listener){
        if (this._handlers[type] instanceof Array){
            var handlers = this._handlers[type];
            for (var i=0, len=handlers.length; i < len; i++){
                if (handlers[i] === listener){
                    handlers.splice(i, 1);
                    break;
                }
            }
        }
    },

    /**
     * Removes a listener for a given event type.
     * @param {String} type The type of event to remove a listener from.
     * @param {Function} listener The function to remove from the event.
     * @method unsubscribe
     * @deprecated
     */
    unsubscribe: function(type, listener){
        this.detach.apply(this, arguments);
    }

};
