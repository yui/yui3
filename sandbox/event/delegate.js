(function() {

var Event = Y.Event,
	
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
				elements = Y.Selector.query(("#" + el.id + " ") + spec);
				nElements = elements.length;

				if (nElements > 0) {

					i = elements.length - 1;

					do {

						element = elements[i];

	                    if (element === target || Y.DOM.contains(element, target)) {

							ce = Event._createWrapper(element, e.type, false, false);

							ev = new Y.DOMEventFacade(e, element, ce);

	                        ev.target = Y.Node.get(element);
	
	                        Y.fire(ename, ev);

	  						break;

	                    }

					}
					while (i--);
					
				}

                // el.queryAll(spec).some(function (v, k) {
                // 
                //     if (v.compareTo(target) || v.contains(target)) {
                //         e.target = v;
                //         Y.fire(ename, e);
                //         return true;
                //     }
                // });

            }

        }

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
        var guid = (Y.Lang.isString(el) ? el : Y.stamp(el)), 
                
            // the custom event for the delegation spec
            ename = 'delegate:' + guid + delegateType + _sanitize(spec),

            // the key to the listener for the event type and container
            delegateKey = delegateType + guid,

            a = Y.Array(arguments, 0, true),

			element = Y.Node.getDOMNode(Y.Node.get(el));

		//	Need to make sure that the element has an id so that we 
		//	can create a selector whose scope is limited to the element

		if (!element.id) {
			element.id = Y.guid();
		}
		

        if (!(delegateKey in delegates)) {

            delegates[delegateKey] = {};

            // set up the listener on the container
            // Y.on(delegateType, function(e) {
            //     _worker(delegateKey, e);
            // }, el);


			Event.nativeAdd(element, delegateType, function (e) {
                _worker(delegateKey, (e || window.event), element);
			});

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