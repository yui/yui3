/**
Adds Y.Do for AOP wrapping object methods.

@module eventx
@submodule eventx-do
@for YUI
**/
var isObject = Y.Lang.isObject,
    toArray  = Y.Array,
    CustomEvent = Y.CustomEvent.prototype,
    Do, AOP;

// Use a CustomEvent for subscription management mechanism
AOP = new Y.CustomEvent({
    // Default event replaces host object function with an event firing method
    subscribe: function (target, args, details) {
        var aop      = Do._yuievt.aop,
            callback = args[0],
            host     = args[1],
            name     = args[2],
            thisObj  = args[3] || host,
            method   = host[name],
            key      = Y.stamp(host) + ':' + name,
            sub;

        if (!aop[key]) {
            aop[key] = {
                method: method,
                host  : host
            };

            host[name] = function () {
                // have to convert arguments to array to support bound
                // subscription args use case. Otherwise I'd have to modify
                // Subscriber, which could result in duplicate toArray() calls
                // from elsewhere in CustomEvent code, so blah. It's fine.
                AOP.fire(Do, [key, toArray(arguments, 0, true)]);
                return Do.currentRetVal;
            };
        }

        // Realign the args for Subscription's signature assumption
        args = toArray(args, 4, true);
        args.unshift(key, callback, thisObj);

        sub = new this.Subscription(Do, args, details);

        this.registerSub(Do, sub);

        return sub;
    },

    fire: function (target, args) {
        var config     = Do._yuievt,
            wrapped    = config.aop[args[0]],
            subs       = config.subs[args[0]],
            methodArgs = args[1],
            ret, i, len, prevented;

        if (!wrapped) {
            return;
        }

        if (subs && subs.before) {
            for (i = 0, len = subs.before.length; i < len; ++i) {
                ret = subs.before[i].notify(methodArgs);

                if (ret && isObject(ret)) {
                    if (ret instanceof Do.Halt) {
                        Do.currentRetVal = ret.retVal;
                        return;
                    } else if (ret instanceof Do.AlterArgs) {
                        methodArgs = ret.newArgs;
                    } else if (ret instanceof Do.Prevent) {
                        prevented = true;
                        break;
                    }
                }
            }
        }

        // Execute the original method unless prevented
        Do.currentRetVal = Do.originalRetVal = prevented ? undefined :
            wrapped.method.apply(wrapped.host, methodArgs);

        if (subs && subs.after) {
            for (i = 0, len = subs.after.length; i < len; ++i) {
                ret = subs.after[i].notify(methodArgs);

                if (ret && isObject(ret)) {
                    if (ret instanceof Do.Halt) {
                        Do.currentRetVal = ret.retVal;
                        return;
                    } else if (ret instanceof Do.AlterReturn) {
                        Do.currentRetVal = ret.newRetVal;
                    }
                }
            }
        }
    },

    unsubscribe: function (target, args) {
        var callback = args[0],
            host     = args[1],
            name     = args[2],
            key, aop, wrapped;
            // phase = args[3]; // comment left in for documentation

        if (callback.detach || (host && name)) {
            if (callback.detach) {
                key  = callback.type;
                name = key.slice(key.lastIndexOf(':') + 1);
            } else {
                key  = Y.stamp(host) + ':' + name;
                args = [key, callback, args[3]];
            }

            CustomEvent.unsubscribe.call(this, Do, args);

            if (!this.hasSubs([Do], key)) {
                aop     = Do._yuievt.aop;
                wrapped = aop[key];

                // Ressign the original method. If the method that was wrapped
                // came from the prototype, this shadows the method on the
                // instance, thus preventing prototype updates to change the
                // behavior for this method for this instance. However, if the
                // prototype is being updated, any updates that occurred while
                // the method was wrapped wouldn't have been preserved anyway,
                // so AOP in that usecase is incomplete/flawed. I'm leaving it
                // alone with the overwrite solution because in an imperfect
                // scenario, less code is less code.
                wrapped.host[name] = wrapped.method;
                aop[key] = null;
            }
        }
    }
});

Do = Y.Do = {
    // Use the EventTarget subscription infrastructure for convenience
    _yuievt: {
        // map of objYuid:methodName => { host: obj, method: originalFn }
        aop : {},
        subs: {}
    },
    
    /**
    Execute the supplied method before the specified function.  Wrapping
    function may optionally return an instance of the following classes to
    further alter runtime behavior:

    <dl>
        <dt></code>Y.Do.Halt(message, returnValue)</code></dt>
            <dd>Immediatly stop execution and return
            <code>returnValue</code>.  No other wrapping functions will be
            executed.</dd>
        <dt></code>Y.Do.AlterArgs(message, newArgArray)</code></dt>
            <dd>Replace the arguments that the original function will be
            called with.</dd>
        <dt></code>Y.Do.Prevent(message)</code></dt>
            <dd>Don't execute the wrapped function.  Other before phase
            wrappers will be executed.</dd>
    </dl>
    
    @method before
    @param {Function} callback Advice function to execute
    @param {Object} host Object hosting the method to displace
    @param {String} name Name of the method to displace
    @param {Object} [thisObj] Override `this` for the _callback_
    @param {Any} arg* 0..n additional arguments to pass to _callback_ after its
                        original calling arguments
    @return {Subscription} handle for the subscription
    @static
    **/
    before: function () {
        // Reuse the subscription mechanism from custom events
        return AOP.subscribe(Do, arguments, { phase: 'before' });
    },

    /**
    Execute the supplied method after the specified function.  Wrapping
    function may optionally return an instance of the following classes to
    further alter runtime behavior:

    <dl>
        <dt></code>Y.Do.Halt(message, returnValue)</code></dt>
            <dd>Immediatly stop execution and return
            <code>returnValue</code>.  No other wrapping functions will be
            executed.</dd>
        <dt></code>Y.Do.AlterReturn(message, returnValue)</code></dt>
            <dd>Return <code>returnValue</code> instead of the wrapped
            method's original return value.  This can be further altered by
            other after phase wrappers.</dd>
    </dl>
    
    The static properties `Y.Do.originalRetVal` and `Y.Do.currentRetVal` will
    be populated for reference.
    
    @method after
    @param {Function} callback Advice function to execute
    @param {Object} host Object hosting the method to displace
    @param {String} name Name of the method to displace
    @param {Object} [thisObj] Override `this` for the _callback_
    @param {Any} arg* 0..n additional arguments to pass to _callback_ after its
                        original calling arguments
    @return {Subscription} handle for the subscription
    @static
    **/
    after: function () {
        // Reuse the subscription mechanism from custom events
        return AOP.subscribe(Do, arguments, { phase: 'after' });
    },

    /**
    Detach AOP subscription. You can pass either a Subscription or the callback,
    host object, and name (and optionally "before" or "after") of the original
    advise subscription.

    _host_, _name_, and _phase_ are unnecessary if the first param is a
    Subscription.  _phase_ is optional if the _host_ and _name_ form of the
    method are used. When omitted, both "before" and "after" phases are
    searched for matching aop subscriptions.

    @method detach
    @param {Subscription|Function} callback Advice function or Subscription
    @param {Object} [host] Object hosting the method to displace
    @param {String} [name] Name of the method to displace
    **/
    detach: function () {
        // Reuse the detach mechanism from custom events
        return AOP.unsubscribe(Do, arguments);
    },

    /**
    Return an AlterArgs object when you want to change the arguments that
    were passed into the function.  Useful for Do.before subscribers.  An
    example would be a service that scrubs out illegal characters prior to
    executing the core business logic.
    @class Do.AlterArgs
    @constructor
    @param msg {String} (optional) Explanation of the altered return value
    @param newArgs {Array} Call parameters to be used for the original method
                           instead of the arguments originally passed in.
    **/
    AlterArgs: function(msg, newArgs) {
        this.msg = msg;
        this.newArgs = newArgs;
    },

    /**
    Return an AlterReturn object when you want to change the result returned
    from the core method to the caller.  Useful for Do.after subscribers.
    @class Do.AlterReturn
    @constructor
    @param msg {String} (optional) Explanation of the altered return value
    @param newRetVal {any} Return value passed to code that invoked the wrapped
                         function.
    **/
    AlterReturn: function(msg, newRetVal) {
        this.msg = msg;
        this.newRetVal = newRetVal;
    },

    /**
    Return a Halt object when you want to terminate the execution
    of all subsequent subscribers as well as the wrapped method
    if it has not exectued yet.  Useful for Do.before subscribers.
    @class Do.Halt
    @constructor
    @param msg {String} (optional) Explanation of why the termination was done
    @param retVal {any} Return value passed to code that invoked the wrapped
                         function.
    **/
    Halt: function(msg, retVal) {
        this.msg = msg;
        this.retVal = retVal;
    },

    /**
    Return a Prevent object when you want to prevent the wrapped function
    from executing, but want the remaining listeners to execute.  Useful
    for Do.before subscribers.
    @class Do.Prevent
    @constructor
    @param msg {String} (optional) Explanation of why the termination was done
    **/
    Prevent: function(msg) {
        this.msg = msg;
    }
};
