/**
 * DOM event listener abstraction layer
 * @module event
 */

(function() {

var add = function(el, type, fn, capture) {
    if (el.addEventListener) {
            el.addEventListener(type, fn, !!capture);
    } else if (el.attachEvent) {
            el.attachEvent("on" + type, fn);
    } 
},

remove = function(el, type, fn, capture) {
    if (el.removeEventListener) {
            el.removeEventListener(type, fn, !!capture);
    } else if (el.detachEvent) {
            el.detachEvent("on" + type, fn);
    }
},

globalListener = function() {
    YUI.Env.windowLoaded = true;
    remove(window, 'load', globalListener);
};

// add a window load event at load time so we can capture
// the case where it fires before dynamic loading is
// complete.
add(window, 'load', globalListener);

// these are temporary references that get removed when the
// rest of the module is finished using them.
YUI.Env.add = add;
YUI.Env.remove = remove;

// Unlike most of the library, this code has to be executed as soon as it is
// introduced into the page -- and it should only be executed one time
// regardless of the number of instances that use it.

var GLOBAL_ENV = YUI.Env, 

    C = YUI.config, 

    D = C.doc, 

    POLL_INTERVAL = C.pollInterval || 20,

    _ready = function(e) {
        GLOBAL_ENV._ready();
    };

    if (!GLOBAL_ENV._ready) {

        GLOBAL_ENV.windowLoaded = false;

        GLOBAL_ENV._ready = function() {
            if (!GLOBAL_ENV.DOMReady) {
                GLOBAL_ENV.DOMReady=true;

                // Remove the DOMContentLoaded (FF/Opera)
                if (D.removeEventListener) {
                    D.removeEventListener("DOMContentLoaded", _ready, false);
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
        if (navigator.userAgent.match(/MSIE/)) {

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

        // FireFox and Opera: These browsers provide a event for this
        // moment.  The latest WebKit releases now support this event.
        } else {
            D.addEventListener("DOMContentLoaded", _ready, false);
        }

        /////////////////////////////////////////////////////////////
    }

})();
