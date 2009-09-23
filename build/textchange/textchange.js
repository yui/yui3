YUI.add('textchange', function(Y) {



/**
 * <p>Event that fires when a text or input field has changed value as a result of a keystroke.
 * Attaches a timed-out listener on the keydown event, and keeps the value to provide support
 * for multi-keystroke character sets.</p>
 * <p>This event fires when:</p>
 * <ol>
 *   <li>The user presses a key, causing the value in the field to be different than it was before.</li>
 *   <li>The user triggers an onchange event, ie by pasting a value into the field via mouse.</li>
 * </ol>
 * <p>The event signature is otherwise identical to either the keydown or onchange events,
 * whichever cause textchange to be triggered.</p>
 * <p>This does not replace the DOM onchange event, but rather augments it to do onchange-like
 * logic as a result of key presses, even in multi-stroke character sets.</p>
 * <p>Known issue: If attaching to elements that are not yet available, then only the first 
 * node will be guaranteed to have the event handler attached.</p>
 *
 * @event text-change
 * @for YUI
 * @param type {String} 'text-change'
 * @param fn {Function} the callback function
 * @param el {String|Node|etc} the element(s) to bind
 * @param o {Object} optional context object
 * @param args 0..n additional arguments that should be provided 
 * to the listener.
 * @return {Event.Handle} the detach handle
 **/

var eventName = 'textchange',
    PRIVATE = {},
    CHANGE = "change",
    KEYDOWN = "keydown",
    KEYPRESS = "keypress",
    COUNT = "count",
    DELAY = "delay",
    WAITING = "waiting",
    VALUE = "value",
    makeHandler = function (proxy) {
        var h = PRIVATE[proxy];
        // console.log("makeHandler for "+proxy);
        
        return function (e) {
            // check to see if someone's waiting.
            // if so, kill it.
            if (h[WAITING]) {
                // console.log("someone is waiting", h[WAITING]);
                h[WAITING].cancel();
            }
            // set the timeout.
            // console.log("set a timeout for "+h[DELAY]);
            h[WAITING] = Y.later(h[DELAY], this, function () {
                
                // did anything actually change?
                var oldVal = h[VALUE],
                    newVal = this.get("value");

                
                if (oldVal === newVal) {
                    return;
                }
                h[VALUE] = newVal;
                this.fire(proxy, {
                    type: eventName,
                    value: newVal,
                    oldValue : oldVal,
                    lastKeyEvent: e,
                    target: this,
                    currentTarget: this
                });
            });
            // console.log("timer is ", h[WAITING]);
        };
    },
    event = {
        on : function (type, fn, el, o, conf) {
            // console.log(arguments);
            
            var args = Y.Array(arguments, 0, true),
                target = Y.Lang.isString(el) ? Y.all(el) : Y.all([el]),
                handle = null,
                defaults = {
                    events : [CHANGE,KEYDOWN,KEYPRESS]
                };
            
            defaults[DELAY] = 50;
            conf = Y.merge(defaults, conf || {});
            
            // handle not-yet-available targets.
            if (Y.Lang.isString(el) && target.size() === 0) {
                // make a promise.
                handle = new Y.EventHandle(this, "PROMISE");
                // @TODO This only will attach to the first one found.
                // so stuff like .foo might not attach to all of them.
                // Also, removal will only work once it's actually been attached.
                Y.Event.onAvailable(el, function () {
                    // fulfill the promise.
                    var h = Y.on.apply(Y, args);
                    for (var i in h) if (h.hasOwnProperty(i)) handle[i] = h[i];
                }, Y.Event, true, false);
                // return the promise.
                return handle;
            }
            
            // handle NodeList objects.
            if (target.size() > 1) {
                handle = [];
                target.each(function (t) {
                    args[2] = t;
                    handle.push(Y.on.apply(Y,args));
                });
                return handle;
            }
            
            // empty list.
            if (target.size() === 0) return null;
            
            // 1 target left.
            target = target.item(0);
            
            var proxy = [Y.stamp(target), eventName].join("-"),
                handles = PRIVATE[proxy];
            if (!handles) {
                handles = PRIVATE[proxy] = {};
                handles[COUNT] = 0;
            }
            
            if (!target.getEvent(proxy)) {
                // attach the listeners.
                var h = makeHandler(proxy);
                Y.Array.each(conf.events, function (event) {
                    handles[event] = target.on(event, h);
                });
            } // else {
            // }
            
            handles[DELAY] = conf[DELAY];
            handles[COUNT] ++;
            
            // Remove the 5 named args, and replace with these things,
            // preserving any extra arguments, and return the handle.
            args.splice(0, 5, proxy, fn, (o || target));
            return target.on.apply(target, args);
            
        },
        detach : function (eventName, handle, target) {
            
            // @TODO @FIXME @BROKEN @WTF
            // This is a big mess right here.
            // The arguments to this function seem to be radically different
            // depending on how you call detach()
            // I suspect that I'm doing something very wrong in here.
            // For the moment, detaching the textchange event is highly unreliable.
            
            
            // if there's a handle, then remove just that one.
            // otherwise, remove everything for this target.
            
            // @FIXME - Should I really be getting a raw dom node here?
            // That seems weird and insecure.
            target = Y.one(target);
            
            var proxy = [Y.stamp(target), eventName].join("-"),
                handles = PRIVATE[proxy];
            
            // if I just got one, then delete just that one.
            // otherwise, make them all go away.
            // @FIXME - Need a way to tell if this handle has already been
            // deleted, and if so, dont' decrement the counter to delete the
            // handles.  Detaching the same handler multiple times will eventually
            // cause all the listeners to be cut off, as the proxy handler gets
            if (handle) {
                if (handle.detach) handle.detach();
            } else {
                handles[COUNT] = -1;
            }
            
            // nothing to do?
            if (!handles) return;
            
            handles[COUNT] --;
            if (handles[COUNT] <= 0) {
                Y.Array.each([CHANGE,KEYDOWN,KEYPRESS], function (event) {
                    target.detach(handles[event]);
                });
            }
        }
    };


Y.Env.evt.plugins[eventName] = event;
if (Y.Node) {
    Y.Node.DOM_EVENTS[eventName] = event;
}

// }, '@VERSION@' ,{requires:['node-base']});


}, '@VERSION@' ,{requires:['node-base']});
