(function() {

var delegates = {},

    worker = function(delegateKey, e) {

        var target = e.target, 
            tests  = delegates[delegateKey], 
            passed, spec, ename;

        for (spec in tests) {

            if (tests.hasOwnProperty(spec)) {
            
                passed = false;
                ename  = tests[spec];

                // @TODO we need Node.some 
                e.currentTarget.queryAll(spec).each(function (v, k) {

                    if ((!passed) && (v.compareTo(target) || v.contains(target))) {
                        e.target = v;
                        Y.fire(ename, e);

                    }
                });
            }
        }

    };

/**
 * Sets up a delegated listener container.
 * @event delegate
 * @param type {string} 'delegate'
 * @param fn {string} the function to execute
 * @param el {string|node} the element that is the delegation container
 * @param delegateType {string} the event type to delegate
 * @param spec {string} a selector that must match the target of the
 * event.
 * @param o optional context object
 * @param args 0..n additional arguments that should be provided 
 * to the listener.
 * @return {Event.Handle} the detach handle
 * @for YUI
 */
Y.Env.evt.plugins.delegate = {

    on: function(type, fn, el, delegateType, spec, o) {

        // identifier to target the container
        var guid = (Y.Lang.isString(el) ? el : Y.stamp(el)), 
                
            // the custom event for the delegation spec
            ename = 'delegate:' + guid + delegateType + spec,

            // the key to the listener for the event type and container
            delegateKey = delegateType + guid,

            a = Y.Array(arguments, 0, true);

        if (!(delegateKey in delegates)) {

            delegates[delegateKey] = {};

            // set up the listener on the container
            Y.on(delegateType, function(e) {
                worker(delegateKey, e);
            }, el);

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
