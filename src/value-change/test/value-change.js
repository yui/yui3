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

function toNodeList (el) { return (
    
    (Lang.isString(el) || Lang.isArray(el))
        ? Y.all(el)
    : (el instanceof Y.Node)
        ? Y.all([el._node])
    : (el instanceof Y.NodeList)
        ? el
    : Y.all([el])
    
)};

function onAvail (el, args) {
    var h = Y.on("available", function () {
        h.handle = Y.on.apply(Y, args);
    }, el);
    return h;
};

function attachProxy (node, args) {
    // args = [type, fn, el, o, ...]
    args[0] = ceName(node);
    args[2] = node;
    var registry = attachTriggers(node);
    console.log("attach proxy", node, args);
    
    var proxyHandle = Y.on.apply(Y, args);
    console.log("proxyHandle", proxyHandle);
    return proxyHandle;
};

function ceName (node) {
    return Y.stamp(node) + "-" + eventName;
};

// attach the dom events that will trigger the CE
function attachTriggers (node) {
    console.log("attach triggers to ", node);
    var key = ceName(node);
    var reg = registry[ key ] = registry[ key ] || {
        count : 0,
        handles : attachDomEventHandlers(node)
    };
    reg.count++;
    return reg;
};

function handleDom (event, handler, node) {
    var handle = Y.on(event, handler, node);
    Y.after(Y.bind(afterDetach, null, node, true), handle, "detach");
    return handle;
};

// call this after detaching a CE handler
function afterDetach (node, force) {
    console.log("clean up after ", node);
    var reg = registry[ ceName(node) ];
    if (!reg) return;
    reg.count --;
    if (force) reg.count = 0;
    if (reg.count <= 0) {
        for (var i in reg.handles) reg.handles[i].detach();
    }
};

var eventName = "valueChange",
    registry = {},
    Lang = Y.Lang,
    event = {
        on : function (type, fn, el, o) {
            var args = Y.Array(arguments, 0, true),
                nodeList = toNodeList(el);
            // console.log("nodeList", nodeList);
            if (nodeList.size() === 0) return onAvail(el, args);
            
            args[3] = o = o || ((nodeList.size() === 1) ? nodeList.item(0) : nodeList);
            
            console.log(type, fn, el, o);
            
            var handles = [];
            nodeList.each(function (node) {
                var proxyHandle = attachProxy(node, args);
                handles.push(proxyHandle);
                // hook into the detach event to remove it from that node.
                Y.after(Y.bind(afterDetach, null, node), proxyHandle, "detach");
            });
            // return an appropriate handle.
            return { evt : handles, sub : nodeList, detach : function () {
                for (var i = 0, l = handles.length; i < l; i ++) handles[i].detach();
            }};
        }
    },
    
    
    // IMPLEMENTATION SPECIFIC
    attachDomEventHandlers = (function () {
        console.log("creating the attachDomeventhandlers");
        var valueHistory = {}, intervals = {}, timeouts = {};
            
        function startPolling (node, e) {
            var key = ceName(node);
            // avoid duplicates
            stopPolling(node);
            intervals[key] = setInterval(Y.bind(poller, null, node, e), 50);
            timeouts[key] = setTimeout(Y.bind(stopPolling, null, node), 10000);
        };
        function stopPolling (node) {
            var key = ceName(node);
            clearTimeout(timeouts[key]);
            clearInterval(intervals[key]);
        };
        function poller (node, e) {
            var key = ceName(node);
            var value = node.get("value");
            if (value !== valueHistory[key]) {
                var ev = {
                    type : eventName,
                    value : value,
                    oldValue : valueHistory[key],
                    lastKeyEvent : e,
                    target : node,
                    currentTarget : node
                };
                console.log("fire", eventName, key, ev);
                // node.fire(key, ev);
                Y.fire(key, ev, node);
                
                valueHistory[key] = node.get("value");
            }
        };
        
        function keyUpHandler (e) {
            // console.log("start polling if e.charcode === 229", this, e);
            console.log("keyup", e.charCode);
        };
        function blurHandler (e) {
            console.log("blur, stop polling", e);
            stopPolling(e.currentTarget);
        };
        function keyDownHandler (e) {
            console.log("keydown", e.charCode, e.currentTarget, e);
            startPolling(e.currentTarget, e);
        };

        return function (node) {
            console.log("attachDomEventHandlers", node);
            return {
            //FIXME: this impl code knows about what's outside its box.
            // that's not ideal. it should just return the hash, and then
            // the code outside will deal with it.
            keyup : handleDom("keyup", keyUpHandler, node),
            blur : handleDom("blur", blurHandler, node),
            keydown : handleDom("keydown", keyDownHandler, node)
        }};
    })();
    // IMPLEMENTATION SPECIFIC
    


Y.Env.evt.plugins[eventName] = event;
if (Y.Node) Y.Node.DOM_EVENTS[eventName] = event;

}, '@VERSION@' ,{requires:['node-base', 'event-focus']});
