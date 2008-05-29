YUI.add("event-ready", function(Y) {

    if (Y === YUI) {
        return;
    }

    var env = YUI.Env, C = Y.config, D = C.doc, POLL_INTERVAL = C.pollInterval || 20;

    if (!env._ready) {

        env._ready = function() {
            if (!env.DOMReady) {
                env.DOMReady=true;

                // Fire the content ready custom event
                // E.DOMReadyEvent.fire();

                // Remove the DOMContentLoaded (FF/Opera)

                if (D.removeEventListener) {
                    D.removeEventListener("DOMContentLoaded", env._ready, false);
                }
            }
        };

        // create custom event

        /////////////////////////////////////////////////////////////
        // DOMReady
        // based on work by: Dean Edwards/John Resig/Matthias Miller 

        // Internet Explorer: use the readyState of a defered script.
        // This isolates what appears to be a safe moment to manipulate
        // the DOM prior to when the document's readyState suggests
        // it is safe to do so.
        if (Y.UA.ie) {

            env._dri = setInterval(function() {
                var n = D.createElement('p');  
                try {
                    // throws an error if doc is not ready
                    n.doScroll('left');
                    clearInterval(env._dri);
                    env._dri = null;
                    env._ready();
                    n = null;
                } catch (ex) { 
                    n = null;
                }
            }, POLL_INTERVAL); 

        
        // The document's readyState in Safari currently will
        // change to loaded/complete before images are loaded.
        } else if (Y.UA.webkit && Y.UA.webkit < 525) {

            env._dri = setInterval(function() {
                var rs=D.readyState;
                if ("loaded" == rs || "complete" == rs) {
                    clearInterval(env._dri);
                    env._dri = null;
                    env._ready();
                }
            }, POLL_INTERVAL); 

        // FireFox and Opera: These browsers provide a event for this
        // moment.  The latest WebKit releases now support this event.
        } else {
            D.addEventListener("DOMContentLoaded", env._ready, false);
        }

        /////////////////////////////////////////////////////////////

    }

    Y.publish('event:ready', {
        fireOnce: true
    });

    var yready = function() {
        Y.fire('event:ready');
    };

    if (env.DOMReady) {
        yready();
    } else {
        Y.before(yready, env, "_ready");
    }


}, "3.0.0");
