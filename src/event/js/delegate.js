(function() {

var Event = Y.Event,
	
	Lang = Y.Lang,
	
	delegates = {},
	
	resolveTextNode = function(n) {

	    try {
	        if (n && 3 == n.nodeType) {
	            return n.parentNode;
	        }
	    } catch(e) { }

	    return n;

	},

    _worker = function(delegateKey, e, el) {

        var target = resolveTextNode((e.target || e.srcElement)), 
            tests  = delegates[delegateKey],
            spec, 
			ename,
			elements,
			nElements,
			element,
			ce,
			ev,
			i;

        for (spec in tests) {

            if (tests.hasOwnProperty(spec)) {

                ename  = tests[spec];

				elements = Y.Selector.query(spec, el);

				nElements = elements.length;

				if (nElements > 0) {

					i = elements.length - 1;

					do {

						element = elements[i];

	                    if (element === target || Y.DOM.contains(element, target)) {

							ce = Event._createWrapper(element, e.type, false, false, true);

							ev = new Y.DOMEventFacade(e, el, ce);

	                        ev.originalTarget = ev.target;
	                        ev.target = Y.Node.get(element);
	
	                        Y.fire(ename, ev);

	                    }

					}
					while (i--);
					
				}

            }

        }

    },

	attach = function (type, key, element) {
		
		Y.Event._attach([type, function (e) {

            _worker(key, (e || window.event), element);

		}, element], { facade: false });
		
	},

    _sanitize = Y.cached(function(str) {
        return str.replace(/[|,:]/g, '~');
    });

/**
 * Sets up a delegated listener container.
 * @event delegate
 * @param type {string} 'delegate'
 * @param fn {string} the function to execute
 * @param el {string|node} the element that is the delegation container
 * @param delegateType {string} the event type to delegate
 * @param spec {string} a selector that must match the target of the
 * event.
 * @return {Event.Handle} the detach handle
 * @for YUI
 */
Y.Env.evt.plugins.delegate = {

    on: function(type, fn, el, delegateType, spec) {

        if (!spec) {
            Y.log('delegate: no spec, nothing to do', 'warn', 'event');
            return false;
        }

        // identifier to target the container
        var guid = (Lang.isString(el) ? el : Y.stamp(el)), 
                
            // the custom event for the delegation spec
            ename = 'delegate:' + guid + delegateType + _sanitize(spec),

            // the key to the listener for the event type and container
            delegateKey = delegateType + guid,

            a = Y.Array(arguments, 0, true),

			element;
		

        if (!(delegateKey in delegates)) {

			if (Lang.isString(el)) {	//	Selector
				element = Y.Selector.query(el);				
			}
			else {	// Node instance
				element = Y.Node.getDOMNode(el);
			}

			if (Lang.isArray(element)) {

				Y.Array.each(element, function (v) {
					attach(delegateType, delegateKey, v);
				});

			}
			else {
				attach(delegateType, delegateKey, element);
			}

            delegates[delegateKey] = {};

        }

        delegates[delegateKey][spec] = ename;

        a[0] = ename;

        // remove element, delegation spec and context object from the args
        a.splice(2, 3);
            
        // subscribe to the custom event for the delegation spec
        return Y.on.apply(Y, a);

    }
};

})();
