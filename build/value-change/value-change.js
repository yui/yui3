YUI.add('value-change', function(Y) {



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
 * whichever cause valueChange to be triggered.</p>
 * <p>This does not replace the DOM onchange event, but rather augments it to do onchange-like
 * logic as a result of key presses, even in multi-stroke character sets.</p>
 * 
 * <p>The config object can specify the delay (number of ms to wait before checking to
 * see if the value has changed), and a set of DOM events to listen to.
 * The defaults are 50 and ["keypress", "keydown", "change"], respectively.</p>
 *
 * <p>Known issue: If attaching to elements that are not yet available, then only the first 
 * node will be guaranteed to have the event handler attached.</p>
 *
 * @event valueChange
 * @for YUI
 * @param type {String} 'valueChange'
 * @param fn {Function} the callback function
 * @param el {String|Node|etc} the element(s) to bind
 * @param o {Object} optional context object
 * @param conf {Object} Config object specifying delay and events.
 * @param args 0..n additional arguments that should be provided 
 * to the listener.
 * @return {Event.Handle} the detach handle
 **/


var Event = Y.Event,
    Lang = Y.Lang,
    plugins = Y.Env.evt.plugins
    listeners = {},
    eventName = "valueChange",
    PRIVATE = {},
    CHANGE = "change",
    KEYDOWN = "keydown",
    KEYPRESS = "keypress",
    COUNT = "count",
    DELAY = "delay",
    WAITING = "waiting",
    VALUE = "value",
    
    /**
     * create a handler that listens to keydown/keypress/change, and then
     * fires the proxy event, which in turn fires the valueChange event, but
     * only if the value has changed from what it was the last time the event
     * was fired.
     *
     * @method makeHandler
     * @private
     * @param proxy {String} The proxy event name for this node
     **/
    makeHandler = function (proxy) {
        var h = PRIVATE[proxy];        
        return function (e) {
            // check to see if someone's waiting.
            // if so, kill it.
            if (h[WAITING]) {
                // console.log("someone is waiting", h[WAITING]);
                h[WAITING].cancel();
            }
            // set the timeout.
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
            
            // attach to a not-yet-available target
            // Returns a "promise" handle which is then filled in with the actual
            // remove handle as soon as the 
            if (Y.Lang.isString(el) && target.size() === 0) {
                // make a promise.
                handle = new Y.EventHandle(this, "PROMISE");
                // @FIXME This only will attach to the first one found.
                // so stuff like .foo might not attach to all of them.
                // Is there a way around this?
                
                // Set the "detach" member to the detach member of the onAvailable
                // handle.  This way, detaching prior to availability will simply
                // prevent it from ever attaching in the first place.
                handle.detach = Y.Event.onAvailable(el, function () {
                    // fulfill the promise.
                    var h = Y.on.apply(Y, args);
                    for (var i in h) if (h.hasOwnProperty(i)) handle[i] = h[i];
                }, Y.Event, true, false).detach;
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
            
            // empty list.  Nothing to do.
            if (target.size() === 0) return null;
            
            // 1 target left. Rock and roll.
            target = target.item(0);
            
            // If it hasn't been done yet, then bind the DOM event handlers
            // which will call the custom event.
            
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
            }
            
            // delay for as long as we were told to.
            handles[DELAY] = conf[DELAY];
            
            // Keep a count of the number of listeners.  If this drops to zero (ie, by
            // detaching all the valueChange listeners), then also remove the
            // DOM event listeners
            handles[COUNT] ++;
            
            // The consumer said to listen to "valueChange", but we're actually going to
            // set a listener on the private proxy event, which is what gets fired.
            // Remove the 5 named args, and replace with these things,
            // preserving any extra arguments, and return the handle.
            args.splice(0, 5, proxy, fn, (o || target));
            
            var proxyHandle = target.on.apply(target, args);
            
            // hook into the detach event of the proxy to clean up our mess.
            Y.after(function () {
                handles[COUNT] --;
                if (handles[COUNT] <= 0) {
                    // remove dom listeners.
                    Y.Array.each(conf.events, function (event) {
                        target.detach(handles[event]);
                    });
                }
            }, proxyHandle, "detach");
            
            return proxyHandle;
        }
    };

Y.Env.evt.plugins[eventName] = event;
if (Y.Node) Y.Node.DOM_EVENTS[eventName] = event;


}, '@VERSION@' ,{requires:['node-base']});
