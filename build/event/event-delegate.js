YUI.add('event-delegate', function(Y) {

/**
 * Adds event delegation support to the library.
 * 
 * @module event
 * @submodule event-delegate
 */

var toArray      = Y.Array,
    YLang        = Y.Lang,
    isString     = YLang.isString,
    selectorTest = Y.Selector.test;

function delegate(type, fn, el, filter) {
    if (!type || !fn || !el || !filter) {
        return;
    }

    var args  = toArray(arguments, 0, true),
        synth = Y.Node.DOM_EVENTS[type],
        query = isString(el) ? el : null,
        container, handle;

    if (YLang.isObject(synth) && synth.delegate) {
        return synth.delegate.apply(synth, arguments);
    }

    container = (query) ? Y.Selector.query(query, null, true) : el;

    if (!container && isString(el)) {
        handle = Y.on('available', function () {
            Y.mix(handle, Y.delegate.apply(Y, args), true);
        }, el);

        return handle;
    }

    if (container) {
        args.splice(2, 2, container); // remove the filter

        if (isString(filter)) {
            filter = Y.delegate.compileFilter(filter);
        }

        handle = Y.on.apply(Y, args);
        handle.sub.getCurrentTarget = filter;
        handle.sub._notify = Y.delegate.notifySub;

        return handle;
    }
}

delegate.notifySub = function (thisObj, args, ce) {
    // Preserve args for other subscribers
    args = args.slice();
    if (this.args) {
        args = args.push.apply(args, this.args);
    }

    // Only notify subs if the event occurred on a targeted element
    var currentTarget = this.getCurrentTarget.apply(this, args),
        originalEvent = args[0],
        container     = originalEvent.currentTarget,
        i, ret, target;

    if (currentTarget) {
        // Support multiple matches up the the container subtree
        currentTarget = toArray(currentTarget);

        for (i = currentTarget.length - 1; i >= 0; --i) {
            target = currentTarget[i];

            // New facade to avoid corrupting facade sent to direct subs
            args[0] = new Y.DOMEventFacade(originalEvent, target, ce);

            args[0].container = container;
        
            thisObj = this.context || target;

            ret = this.fn.apply(thisObj, args);

            if (ret === false) {
                break; // once() callback should only be called once, duh
            }
        }

        return ret;
    }
};

delegate.compileFilter = Y.cached(function (selector) {
    var descendantOfSelector = selector.replace(/,/g, ' *,') + ' *';
    return function (e) {
        var container = e.currentTarget._node,
            matches = [],
            currentTarget;

        if (selectorTest(e.target._node, selector, container)) {
            matches.push(e.target);
        }

        currentTarget = e.target._node;
        if (selectorTest(currentTarget, descendantOfSelector)) {
            while (currentTarget !== container) {
                if (selectorTest(currentTarget, selector, container)) {
                    matches.push(Y.one(currentTarget));
                }
                currentTarget = currentTarget.parentNode;
            }
        }

        if (matches.length <= 1) {
            matches = matches[0]; // single match or undefined
        }

        return matches;
    };
});

/**
 * Sets up event delegation on a container element.  The delegated event
 * will use a supplied filter to test if the callback should be executed.
 * This filter can be either a selector string or a function that returns
 * a Node to use as the currentTarget for the event.
 *
 * The event object for the delegated event is supplied to the callback
 * function.  It is modified slightly in order to support all properties
 * that may be needed for event delegation.  'currentTarget' is set to
 * the element that matched the selector string filter or the Node returned
 * from the filter function.  'container' is set to the element that the
 * listener is delegated from (this normally would be the 'currentTarget').
 *
 * Filter functions will be called with the arguments that would be passed to
 * the callback function, including the event object as the first parameter.
 * The function should return false (or a falsey value) if the success criteria
 * aren't met, and the Node to use as the event's currentTarget and 'this'
 * object if they are.
 *
 * @method delegate
 * @param type {string} the event type to delegate
 * @param fn {function} the callback function to execute.  This function
 * will be provided the event object for the delegated event.
 * @param el {string|node} the element that is the delegation container
 * @param filter {string|function} a selector that must match the target of the
 * event or a function that returns a Node or false.
 * @param context optional argument that specifies what 'this' refers to.
 * @param args* 0..n additional arguments to pass on to the callback function.
 * These arguments will be added after the event object.
 * @return {EventHandle} the detach handle
 * @for YUI
 */
Y.delegate = Y.Event.delegate = delegate;


}, '@VERSION@' ,{requires:['node-base']});
