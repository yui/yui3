/**
 * Provides a setImmediate/setTimeout wrapper.  This module is a `core` YUI
 * module, <a href="../classes/YUI.html#method_soon">its documentation is
 * located under the YUI class</a>.
 *
 * @module yui
 * @submodule yui-soon
 * @author Steven Olmsted
 */

/**
 * Y.soon accepts a callback function.  The callback function will be
 * called once in a future turn of the JavaScript event loop.  If the
 * function requires a specific execution context or arguments, wrap it
 * with Y.bind.  Y.soon returns an object with a cancel method.  If the
 * cancel method is called before the callback function, the callback
 * function won't be called.
 * @method soon
 * @for YUI
 * @param {Function} callbackFunction
 * @return {Object} An object with a cancel method.  If the cancel method is
 * called before the callback function, the callback function won't be called.
 */
var soon = function (callbackFunction) {
        var canceled;

        soon._asynchronizer(function () {
            // Some asynchronizers may provide their own cancellation methods
            // such as clearImmediate or clearTimeout but some asynchronizers
            // do not.  For simplicity, cancellation is entirely handled here
            // rather than wrapping the other methods.  All asynchronizers are
            // expected to always call this anonymous function.
            if (!canceled) {
                callbackFunction();
            }
        }, 0);
        // The 0 is required when setTimeout is used, but it should be ignored
        // by other asynchronizers.

        return {
            cancel: function () {
                canceled = 1;
            }
        };
    },

    subscribedToMessageEvent,

    // This is one possible asynchronizer implementation.  It makes use of the
    // postMessage API which always receives messages in a future turn of the
    // JavaScript event loop.
    // This implementation is based on setImmediate.js.
    // https://github.com/NobleJS/setImmediate
    // Copyright (c) 2011 Barnesandnoble.com, llc and Donavon West
    // https://github.com/NobleJS/setImmediate/blob/master/MIT-LICENSE.txt
    postMessageAsynchronizer = function (callbackFunction) {
        if (!subscribedToMessageEvent) {
            // Subscribe to the message event.
            YUI.Env.add(Y.config.win, 'message', function (event) {
                // Only pay attention to messages from this window.
                if (event.source === Y.config.win) {
                    // The message we've received in event.data could be
                    // anything.  If it's a Y.soon message id, there will be a
                    // callback function associated with it.
                    var id = event.data,
                        originId = id + 'origin',

                        callbackFunction = soon._asynchronizer[id];

                    // Make sure we have a callbackFunction and that the event
                    // and callbackFunction have matching origins.
                    if (callbackFunction && event.origin === soon._asynchronizer[originId]) {
                        // There is a valid callback function, so call it.
                        callbackFunction();

                        // We no longer need to keep the callback function.
                        delete soon._asynchronizer[id];
                        // We no longer need to keep the origin.
                        delete soon._asynchronizer[originId];

                        // Other listeners should't care about this message.
                        if (event.stopImmediatePropagation) {
                            event.stopImmediatePropagation();
                        } else {
                            event.stopPropagation();
                        }

                        event.preventDefault();
                    }
                }
            }, false);

            subscribedToMessageEvent = true;
        }

        // Create a unique Y.soon message id for this callback function.
        var id = Y.guid('soon'),

            // Determine the current origin.
            location = Y.getLocation(),
            origin = location.origin || (location.protocol + '//' + location.host);

        // Store the callback function to be called later by the event handler.
        soon._asynchronizer[id] = callbackFunction;
        // Store the origin to be checked later by the event handler.
        soon._asynchronizer[id + 'origin'] = origin;

        // Send the message, but make sure it does not get sent to listeners
        // from another origin.
        Y.config.win.postMessage(id, origin);
    };

/**
 * The asynchronizer is the internal mechanism which will call a function
 * asynchronously.  This property is exposed as a convenient way to define a
 * different asynchronizer implementation without having to rewrite the entire
 * Y.soon interface.
 * @method _asynchronizer
 * @for soon
 * @param {Function} callbackFunction The function to call asynchronously.
 * @protected
 */

/**
* Since Y.soon is likely to have many differing asynchronizer implementations,
* this property should be set to identify which implementation is in use.
* @property _impl
* @protected
* @type String
*/

// Check for a native or already polyfilled implementation of setImmediate.
if ('setImmediate' in Y.config.win) {
    soon._asynchronizer = Y.config.win.setImmediate;
    soon._impl = 'setImmediate';
}

// Check for postMessage but make sure we're not in a WebWorker.
else if (('postMessage' in Y.config.win) && !('importScripts' in Y.config.win)) {
    soon._asynchronizer = postMessageAsynchronizer;
    soon._impl = 'postMessage';
}

// The most widely supported asynchronizer is setTimeout so we use that as the
// fallback.
else {
    soon._asynchronizer = setTimeout;
    soon._impl = 'setTimeout';
}

Y.soon = soon;