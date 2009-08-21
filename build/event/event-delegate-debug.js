YUI.add('event-delegate', function(Y) {

/**
 * Adds event delegation support to the library.
 * 
 * @module event
 * @submodule event-delegate
 */

var Event = Y.Event,
	Lang = Y.Lang,

	delegates = {},
	
	specialTypes = {
		mouseenter: "mouseover",
		mouseleave: "mouseout"
	},

	focusMethods = {
		focus: Event._attachFocus,
		blur: Event._attachBlur
	},

	resolveTextNode = function(n) {
	    try {
	        if (n && 3 == n.nodeType) {
	            return n.parentNode;
	        }
	    } catch(e) { }
	    return n;
	},

    delegateHandler = function(delegateKey, e, el) {
        var target = resolveTextNode((e.target || e.srcElement)), 
            tests  = delegates[delegateKey],
            spec, 
			ename,
			matched,
			fn,
			ev;


		var getMatch = function(el, selector, container) {
			
			var returnVal;
			
			if (!el || el === container) {
				returnVal = false;
			}
			else {
				returnVal = Y.Selector.test(el, selector) ? el: getMatch(el.parentNode, selector, container);
			}
			
			return returnVal;
			
		};


        for (spec in tests) {

            if (tests.hasOwnProperty(spec)) {

                ename  = tests[spec];
				fn	= tests.fn;
				matched = null;


				if (Y.Selector.test(target, spec, el)) {
					matched = target;
				}
				else if (Y.Selector.test(target, ((spec.replace(/,/gi, " *,")) + " *"), el)) {
						
					//	The target is a descendant of an element matching 
					//	the selector, so crawl up to find the ancestor that 
					//	matches the selector
					
					matched = getMatch(target, spec, el);
					
				}


				if (matched) {

                    if (!ev) {
                        ev = new Y.DOMEventFacade(e, el);
                        ev.container = ev.currentTarget;
                    }

                    ev.currentTarget = Y.Node.get(matched);

					Y.publish(ename, {
			               contextFn: function() {
			                   return ev.currentTarget;
			               }
			           });

					if (fn) {
						fn(ev, ename);
					}
					else {
                    	Y.fire(ename, ev);								
					}
					
				}

            }
        }

    },

	attach = function (type, key, element) {

		var attachFn = focusMethods[type],
			args = [type, 
			function (e) {
	            delegateHandler(key, (e || window.event), element);
			}, 
			element];


		if (attachFn) {
			attachFn(args, { capture: true, facade: false });
		}
		else {
			Event._attach(args, { facade: false });
		}
		
	},

    sanitize = Y.cached(function(str) {
        return str.replace(/[|,:]/g, '~');
    });

/**
 * Sets up event delegation on a container element.  The delegated event
 * will use a supplied selector to test if the target or one of the
 * descendants of the target match it.  The supplied callback function 
 * will only be executed if a match was encountered, and, in fact, 
 * will be executed for each element that matches if you supply an 
 * ambiguous selector.
 *
 * The event object for the delegated event is supplied to the callback
 * function.  It is modified slightly in order to support all properties
 * that may be needed for event delegation.  'currentTarget' is set to
 * the element that matched the delegation specifcation.  'container' is
 * set to the element that the listener is bound to (this normally would
 * be the 'currentTarget').
 *
 * @event delegate
 * @param type {string} 'delegate'
 * @param fn {function} the callback function to execute.  This function
 * will be provided the event object for the delegated event.
 * @param el {string|node} the element that is the delegation container
 * @param delegateType {string} the event type to delegate
 * @param spec {string} a selector that must match the target of the
 * event.
 * @param context optional argument that specifies what 'this' refers to.
 * @param args* 0..n additional arguments to pass on to the callback function.
 * These arguments will be added after the event object.
 * @return {EventHandle} the detach handle
 * @for YUI
 * @deprecated use Y.delegate
 */
Y.Env.evt.plugins.delegate = {

    on: function(type, fn, el, delegateType, spec) {

		Y.log('delegate event is deprecated, use delegate()', 'warn', 'event');

		var args = Y.Array(arguments, 0, true);
		
		args.splice(3, 1);
		
		args[0] = delegateType;

		return Y.delegate.apply(Y, args);

    }

};


/**
 * Sets up event delegation on a container element.  The delegated event
 * will use a supplied selector to test if the target or one of the
 * descendants of the target match it.  The supplied callback function 
 * will only be executed if a match was encountered, and, in fact, 
 * will be executed for each element that matches if you supply an 
 * ambiguous selector.
 *
 * The event object for the delegated event is supplied to the callback
 * function.  It is modified slightly in order to support all properties
 * that may be needed for event delegation.  'currentTarget' is set to
 * the element that matched the delegation specifcation.  'container' is
 * set to the element that the listener is bound to (this normally would
 * be the 'currentTarget').
 *
 * @method delegate
 * @param type {string} the event type to delegate
 * @param fn {function} the callback function to execute.  This function
 * will be provided the event object for the delegated event.
 * @param el {string|node} the element that is the delegation container
 * @param spec {string} a selector that must match the target of the
 * event.
 * @param context optional argument that specifies what 'this' refers to.
 * @param args* 0..n additional arguments to pass on to the callback function.
 * These arguments will be added after the event object.
 * @return {EventHandle} the detach handle
 * @for YUI
 */
Y.Event.delegate = function (type, fn, el, spec) {

    if (!spec) {
        Y.log('delegate: no spec, nothing to do', 'warn', 'event');
        return false;
    }

    // identifier to target the container
    var guid = (Lang.isString(el) ? el : Y.stamp(el)), 
            
        // the custom event for the delegation spec
        ename = 'delegate:' + guid + type + sanitize(spec),

        // the key to the listener for the event type and container
        delegateKey = type + guid,

		delegate = delegates[delegateKey],

        args = Y.Array(arguments, 0, true),

		element;
	

    if (!delegate) {

		delegate = {};
		element = Lang.isString(el) ? Y.Selector.query(el) : Y.Node.getDOMNode(el);

		if (specialTypes[type]) {
			
			if (!Event._fireMouseEnter) {
				Y.log("Delegating a " + type + " event requires the event-mouseenter submodule.", "error", "Event");
				return false;				
			}
			
			type = specialTypes[type];
			delegate.fn = Event._fireMouseEnter;
		}

		//	Create the DOM Event wrapper that will fire the custom event

		if (Lang.isArray(element)) {

			Y.Array.each(element, function (v) {
				attach(type, delegateKey, v);
			});

		}
		else {
			attach(type, delegateKey, element);
		}

        delegates[delegateKey] = delegate;

    }

    delegate[spec] = ename;

    args[0] = ename;

    // remove element, delegation spec
    args.splice(2, 2);
        
    // subscribe to the custom event for the delegation spec
    return Y.on.apply(Y, args);
	
};

Y.delegate = Event.delegate;


}, '@VERSION@' ,{requires:['event-base']});
