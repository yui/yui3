/*
 * DOM event listener abstraction layer
 * @module event
 * @submodule event-base
 */

/**
 * The domready event fires at the moment the browser's DOM is
 * usable. In most cases, this is before images are fully
 * downloaded, allowing you to provide a more responsive user
 * interface.
 *
 * In YUI 3, domready subscribers will be notified immediately if
 * that moment has already passed when the subscription is created.
 *
 * One exception is if the yui.js file is dynamically injected into
 * the page.  If this is done, you must tell the YUI instance that
 * you did this in order for DOMReady (and window load events) to
 * fire normally.  That configuration option is 'injected' -- set
 * it to true if the yui.js script is not included inline.
 *
 * This method is part of the 'event-ready' module, which is a
 * submodule of 'event'.
 *
 * @event domready
 * @for YUI
 */
Y.publish('domready', {
    fireOnce: true,
    async: true
});

if (YUI.Env.DOMReady) {
    Y.fire('domready');
} else {
    Y.Do.before(function() { Y.fire('domready'); }, YUI.Env, '_ready');
}

