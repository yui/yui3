
/*
 * DOMReady
 * @submodule event-ready
 * @module event
 */

(function() {

var Env = YUI.Env, 
    C = YUI.config, 
    D = C.doc, 
    POLL_INTERVAL = C.pollInterval || 20;

    if (!Env._ready) {

        Env.windowLoaded = false;

        Env._ready = function() {
            if (!Env.DOMReady) {
                Env.DOMReady=true;

                // Remove the DOMContentLoaded (FF/Opera)
                if (D.removeEventListener) {
                    D.removeEventListener("DOMContentLoaded", _ready, false);
                }
            }
        };

        var _ready = function(e) {
            YUI.Env._ready();
        };

        // create custom event

        /////////////////////////////////////////////////////////////
        // DOMReady
        // based on work by: Dean Edwards/John Resig/Matthias Miller 

        // Internet Explorer: use the readyState of a defered script.
        // This isolates what appears to be a safe moment to manipulate
        // the DOM prior to when the document's readyState suggests
        // it is safe to do so.
        if (navigator.userAgent.match(/MSIE/)) {

            Env._dri = setInterval(function() {
                try {
                    // throws an error if doc is not ready
                    document.documentElement.doScroll('left');
                    clearInterval(Env._dri);
                    Env._dri = null;
                    _ready();
                } catch (ex) { 
                }
            }, POLL_INTERVAL); 

        // FireFox and Opera: These browsers provide a event for this
        // moment.  The latest WebKit releases now support this event.
        } else {
            D.addEventListener("DOMContentLoaded", _ready, false);
        }

        /////////////////////////////////////////////////////////////
    }

    YUI.add("event-ready", function(Y) {

        if (Y === YUI) {
            return;
        }

        Y.publish('event:ready', {
            fireOnce: true
        });

        var yready = function() {
            Y.fire('event:ready');
        };

        if (Env.DOMReady) {
            // Y.log('DOMReady already fired', 'info', 'event');
            yready();
        } else {
            // Y.log('setting up before listener', 'info', 'event');
            Y.before(yready, Env, "_ready");
        }

    }, "3.0.0");

})();
