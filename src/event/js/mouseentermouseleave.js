var fireMouseEventForNode = function (node, relatedTarget, eventName, e, spec) {

	var bReturnVal = false;

	if (!node.compareTo(relatedTarget) && !node.contains(relatedTarget)) {

		if (spec && !node.compareTo(e.currentTarget)) {
			e.target = node;
		}

		Y.fire(eventName, e);
			
		bReturnVal = true;
			
	}
	
	return bReturnVal;

};


var handleMouseEvent = function(e, eventName, spec) {

	var relatedTarget = e.relatedTarget,
		target = e.target,
		bStop = false;

	if (spec) {

		this.queryAll(spec).each(function (v) {

			if ((!bStop) && (v.compareTo(target) || v.contains(target))) {
				bStop = fireMouseEventForNode(v, relatedTarget, eventName, e, spec);
			}
			
		});
		
	}
	else {
		fireMouseEventForNode(this, relatedTarget, eventName, e);
	}

};

var eventConfig = {

    on: function(type, fn, el, spec) {

        var sDOMEvent = (type === 'mouseenter') ? 'mouseover' : 'mouseout',
			ename = type + ':' + (Y.Lang.isString(el) ? el : Y.stamp(el)) + sDOMEvent + spec,
            a     = Y.Array(arguments, 0, true),
			selector = Y.Lang.isString(spec) ? spec : null;

        if (!Y.getEvent(ename)) {

            // Set up the listener on the container
            Y.on(sDOMEvent, Y.rbind(handleMouseEvent, Y.Node.get(el), ename, selector), el);
        }

        a[0] = ename;


        // Remove the element (and the spec--if defined) from the args
		
		if (selector) {
        	a.splice(2, 2);
		}
		else {
			a.splice(2, 1);
		}
            

        // Subscribe to the custom event for the delegation spec
        return Y.on.apply(Y, a);

    }

};

/**
 * Sets up a "mouseenter" listener--a listener that is called the first time 
 * the user's mouse enters the specified element(s).  Can be used to listen for 
 * the "mouseenter" event on a single element, or a collection of elements as
 * specified via a CSS selector passed as the fourth argument when subscribing 
 * to the event. 
 * @event mouseenter
 * @param type {string} 'mouseenter'
 * @param fn {string} The method the event invokes.
 * @param el {string|node} The element to assign the listener to.
 * @return {Event.Handle} the detach handle
 * @for YUI
 */
Y.Env.evt.plugins.mouseenter = eventConfig;

/**
* Sets up a "mouseleave" listener--a listener that is called the first time 
* the user's mouse enters the specified element(s).  Can be used to listen for 
* the "mouseleave" event on a single element, or a collection of elements as
* specified via a CSS selector passed as the fourth argument when subscribing 
* to the event.
* @event mouseleave
* @param type {string} 'mouseleave'
* @param fn {string} The method the event invokes.
* @param el {string|node} The element to assign the listener to.
* @return {Event.Handle} the detach handle
* @for YUI
 */
Y.Env.evt.plugins.mouseleave = eventConfig;