
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

        var _ready = function(e) {
            YUI.Env._ready();
        };

        Env._ready = function() {
            if (!Env.DOMReady) {
                Env.DOMReady=true;

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

        Y.mix(Y.Env.eventAdaptors, {

            /**
             * Executes the supplied callback when the DOM is first usable.  This
             * will execute immediately if called after the DOMReady event has
             * fired.   @todo the DOMContentReady event does not fire when the
             * script is dynamically injected into the page.  This means the
             * DOMReady custom event will never fire in FireFox or Opera when the
             * library is injected.  It _will_ fire in Safari, and the IE 
             * implementation would allow for us to fire it if the defered script
             * is not available.  We want this to behave the same in all browsers.
             * Is there a way to identify when the script has been injected 
             * instead of included inline?  Is there a way to know whether the 
             * window onload event has fired without having had a listener attached 
             * to it when it did so?
             *
             * <p>The callback is a Event.Custom, so the signature is:</p>
             * <p>type &lt;string&gt;, args &lt;array&gt;, customobject &lt;object&gt;</p>
             * <p>For DOMReady events, there are no fire argments, so the
             * signature is:</p>
             * <p>"DOMReady", [], obj</p>
             *
             *
             * @event domready
             * @for YUI
             *
             * @param {function} fn what to execute when the element is found.
             * @optional context execution context
             * @optional args 1..n arguments to send to the listener
             *
             */
            domready: {

            },

            /**
             * Use domready event instead. @see domready
             * @event event:ready
             * @for YUI
             * @deprecated use 'domready' instead
             */
            'event:ready': {

                on: function() {
                    arguments[0] = 'domready';
                    return Y.subscribe.apply(Y, arguments);
                },

                detach: function() {
                    arguments[0] = 'domready';
                    return Y.unsubscribe.apply(Y, arguments);
                }
            }

        });


        Y.publish('domready', {
            fireOnce: true
        });

        var yready = function() {
            Y.fire('domready');
        };

        if (Env.DOMReady) {
            // Y.log('DOMReady already fired', 'info', 'event');
            yready();
        } else {
            // Y.log('setting up before listener', 'info', 'event');
            Y.before(yready, Env, "_ready");
        }

    }, "@VERSION@");

})();
