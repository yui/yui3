YUI.add("event-ready", function(Y) {

    var E = Y.Event;

    E.Custom = Y.CustomEvent;
    E.Subscriber = Y.Subscriber;

    /**
     * Y.Event.on is an alias for addListener
     * @method on
     * @see addListener
     * @static
     */
    E.attach = function(type, fn, el, data, context) {
        return E.addListener(el, type, fn, data, context);
    };

    E.detach = function(type, fn, el, data, context) {
        return E.removeListener(el, type, fn, data, context);
    };

    // only execute DOMReady once
    if (Y !== YUI) {
        YUI.Event.onDOMReady(E._ready);
    } else {


        /////////////////////////////////////////////////////////////
        // DOMReady
        // based on work by: Dean Edwards/John Resig/Matthias Miller 

        // Internet Explorer: use the readyState of a defered script.
        // This isolates what appears to be a safe moment to manipulate
        // the DOM prior to when the document's readyState suggests
        // it is safe to do so.
        if (Y.ua.ie) {

            // Process onAvailable/onContentReady items when when the 
            // DOM is ready.
            Y.Event.onDOMReady(
                    Y.Event._tryPreloadAttach,
                    Y.Event, true);

            E._dri = setInterval(function() {
                var n = document.createElement('p');  
                try {
                    // throws an error if doc is not ready
                    n.doScroll('left');
                    clearInterval(E._dri);
                    E._dri = null;
                    E._ready();
                    n = null;
                } catch (ex) { 
                    n = null;
                }
            }, E.POLL_INTERVAL); 

        
        // The document's readyState in Safari currently will
        // change to loaded/complete before images are loaded.
        } else if (Y.ua.webkit && Y.ua.webkit < 525) {

            E._dri = setInterval(function() {
                var rs=document.readyState;
                if ("loaded" == rs || "complete" == rs) {
                    clearInterval(E._dri);
                    E._dri = null;
                    E._ready();
                }
            }, E.POLL_INTERVAL); 

        // FireFox and Opera: These browsers provide a event for this
        // moment.  The latest WebKit releases now support this event.
        } else {

            E._simpleAdd(document, "DOMContentLoaded", E._ready);

        }
        /////////////////////////////////////////////////////////////

        E._tryPreloadAttach();
    }

    // for the moment each instance will get its own load/unload listeners
    E._simpleAdd(window, "load", E._load);
    E._simpleAdd(window, "unload", E._unload);

}, "3.0.0");
