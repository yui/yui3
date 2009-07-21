var isString = Y.Lang.isString,

	fireMouseEventForNode = function (node, relatedTarget, eventName, e, spec) {

		if (!node.compareTo(relatedTarget) && !node.contains(relatedTarget)) {

			e.container = e.currentTarget;
			e.currentTarget = node;

			Y.fire(eventName, e);
			
		}

	},


	handleMouseEvent = function (e, eventName, spec) {

		var relatedTarget = e.relatedTarget,
			currentTarget = e.currentTarget,
			target = e.target;

		if (spec) {

			currentTarget.queryAll(spec).some(function (v) {

				var bReturnVal;

				if (v.compareTo(target) || v.contains(target)) {
					fireMouseEventForNode(v, relatedTarget, eventName, e, spec);
					bReturnVal = true;
				}
				
				return bReturnVal; 
			
			});
		
		}
		else {
			fireMouseEventForNode(currentTarget, relatedTarget, eventName, e);
		}

	},

	sanitize = Y.cached(function (str) {

    	return str.replace(/[|,:]/g, "~");

	}),

	eventConfig = {

    	on: function(type, fn, el, spec) {

	        var sDOMEvent = (type === "mouseenter") ? "mouseover" : "mouseout",
				sEventName = type + ":" + (isString(el) ? el : Y.stamp(el)) + sDOMEvent,
	            args = Y.Array(arguments, 0, true),
				sSelector;

			if (isString(spec)) {
				sSelector = spec;
				sEventName = sEventName + sanitize(sSelector);
			}

	        if (!Y.getEvent(sEventName)) {

	            // Set up the listener on the container
	            Y.on(sDOMEvent, function (e) {
	
					handleMouseEvent(e, sEventName, sSelector);

				}, el);
	        }

	        args[0] = sEventName;


	        // Remove the element (and the spec--if defined) from the args
		
			if (sSelector) {
	        	args.splice(2, 2);
			}
			else {
				args.splice(2, 1);
			}
            

	        // Subscribe to the custom event for the delegation spec
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
 * @param fn {string} The method the event invokes.
 * @param el {string|node} The element(s) to assign the listener to.
 * @param spec {string} Optional.  String representing a selector that must 
 * match the target of the event in order for the listener to be called.
 * @return {EventHandle} the detach handle
 * @for YUI
 */
Y.Env.evt.plugins.mouseenter = eventConfig;

/**
* Sets up a "mouseleave" listener&#151;a listener that is called the first time 
* the user's mouse leaves the specified element(s).  By passing a CSS selector 
* as the fourth argument, can also be used to delegate a "mouseleave" 
* event listener.
* 
* @event mouseleave
* @param type {string} "mouseleave"
* @param fn {string} The method the event invokes.
* @param el {string|node} The element(s) to assign the listener to.
* @param spec {string} Optional.  String representing a selector that must 
* match the target of the event in order for the listener to be called.
* @return {EventHandle} the detach handle
* @for YUI
 */
Y.Env.evt.plugins.mouseleave = eventConfig;
