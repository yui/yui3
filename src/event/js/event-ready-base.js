/*
 * DOM event listener abstraction layer
 * @module event
 * @submodule event-base
 */

(function() {


// Unlike most of the library, this code has to be executed as soon as it is
// introduced into the page -- and it should only be executed one time
// regardless of the number of instances that use it.

var GLOBAL_ENV = YUI.Env, 

    C = YUI.config, 

    D = C.doc, 

    POLL_INTERVAL = C.pollInterval || 40,

    _ready = function(e) {
        GLOBAL_ENV._ready();
    };

    if (!GLOBAL_ENV._ready) {

        GLOBAL_ENV._ready = function() {
            if (!GLOBAL_ENV.DOMReady) {
                GLOBAL_ENV.DOMReady=true;

                // Remove the DOMContentLoaded (FF/Opera/Safari)
                if (D.removeEventListener) {
                    D.removeEventListener("DOMContentLoaded", _ready, false);
                }
            }
        };

        // create custom event

/*! DOMReady: based on work by: Dean Edwards/John Resig/Matthias Miller/Diego Perini */

        // Internet Explorer: use the readyState of a defered script.
        // This isolates what appears to be a safe moment to manipulate
        // the DOM prior to when the document's readyState suggests
        // it is safe to do so.
        if (navigator.userAgent.match(/MSIE/)) {

            if (self !== self.top) {
                document.onreadystatechange = function() {
                    if (document.readyState == 'complete') {
                        document.onreadystatechange = null;
                        _ready();
                    }
                };
            } else {

                GLOBAL_ENV._dri = setInterval(function() {
                    try {
                        // throws an error if doc is not ready
                        document.documentElement.doScroll('left');
                        clearInterval(GLOBAL_ENV._dri);
                        GLOBAL_ENV._dri = null;
                        _ready();
                    } catch (ex) { 
                    }
                }, POLL_INTERVAL); 
            }

        // FireFox, Opera, Safari 3+: These browsers provide a event for this
        // moment.
        } else {
            D.addEventListener("DOMContentLoaded", _ready, false);
        }

        /////////////////////////////////////////////////////////////
    }

})();
