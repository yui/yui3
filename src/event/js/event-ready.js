(function() {
/**
 * DOM event listener abstraction layer
 * @module event
 */

var GLOBAL_ENV = YUI.Env,
    
    adapt = Y.Env.evt.plugins,

    yready = function() {
        Y.fire('domready');
    };

Y.mix(adapt, {

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
     * @optional args 0..n arguments to send to the listener
     *
     */
    domready: {},

    /**
     * Use domready event instead. @see domready
     * @event event:ready
     * @for YUI
     * @deprecated use 'domready' instead
     */
    'event:ready': {

        on: function() {
            var a = Y.Array(arguments, 0, true);
            a[0] = 'domready';
            return Y.subscribe.apply(Y, a);
        },

        detach: function() {
            var a = Y.Array(arguments, 0, true);
            a[0] = 'domready';
            return Y.unsubscribe.apply(Y, a);
        }
    }

});


Y.publish('domready', {
    fireOnce: true
});

if (GLOBAL_ENV.DOMReady) {
    // Y.log('DOMReady already fired', 'info', 'event');
    yready();
} else {
    // Y.log('setting up before listener', 'info', 'event');
    Y.before(yready, GLOBAL_ENV, "_ready");
}

})();
