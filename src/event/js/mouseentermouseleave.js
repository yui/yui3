/**
 * Adds support for mouseenter/mouseleave events
 * @module event
 * @submodule event-mouseenter
 */

Y.Event._fireMouseEnter = function (e, eventName) {

	var relatedTarget = e.relatedTarget,
		currentTarget = e.currentTarget;

	if (!currentTarget.compareTo(relatedTarget) && 
		!currentTarget.contains(relatedTarget)) {

		Y.fire(eventName, e);

	}

};

var plugins = Y.Env.evt.plugins,
	isString = Y.Lang.isString,

	eventConfig = {

    	on: function(type, fn, el) {

	        var sDOMEvent = (type === "mouseenter") ? "mouseover" : "mouseout",

				//	The name of the custom event
				sEventName = type + ":" + (isString(el) ? el : Y.stamp(el)) + sDOMEvent,

	            args = Y.Array(arguments, 0, true);

			//	Bind an actual DOM event listener that will call the 
			//	the custom event
	        if (!Y.getEvent(sEventName)) {
				Y.on(sDOMEvent, Y.rbind(Y.Event._fireMouseEnter, Y, sEventName), el);
	        }

	        args[0] = sEventName;

	        // Remove the element from the args
			args.splice(2, 1);

	        // Subscribe to the custom event
	        return Y.on.apply(Y, args);

	    }

	};


/**
 * Sets up a "mouseenter" listener&#151;a listener that is called the first time 
 * the user's mouse enters the specified element(s).  By passing a CSS selector 
 * as the fourth argument, can also be used to delegate a "mouseenter" 
 * event listener.
 * 
 * @event mouseenter
 * @param type {string} "mouseenter"
 * @param fn {function} The method the event invokes.
 * @param el {string|node} The element(s) to assign the listener to.
 * @param spec {string} Optional.  String representing a selector that must 
 * match the target of the event in order for the listener to be called.
 * @return {EventHandle} the detach handle
 * @for YUI
 */
plugins.mouseenter = eventConfig;

/**
* Sets up a "mouseleave" listener&#151;a listener that is called the first time 
* the user's mouse leaves the specified element(s).  By passing a CSS selector 
* as the fourth argument, can also be used to delegate a "mouseleave" 
* event listener.
* 
* @event mouseleave
* @param type {string} "mouseleave"
* @param fn {function} The method the event invokes.
* @param el {string|node} The element(s) to assign the listener to.
* @param spec {string} Optional.  String representing a selector that must 
* match the target of the event in order for the listener to be called.
* @return {EventHandle} the detach handle
* @for YUI
 */
plugins.mouseleave = eventConfig;
