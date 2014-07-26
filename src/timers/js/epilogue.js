/**
@module timers
**/

/**
Y.soon accepts a callback function.  The callback function will be called
once in a future turn of the JavaScript event loop.  If the function
requires a specific execution context or arguments, wrap it with Y.bind.
Y.soon returns an object with a cancel method.  If the cancel method is
called before the callback function, the callback function won't be
called.

@method soon
@for YUI
@param {Function} callbackFunction
@return {Object} An object with a cancel method.  If the cancel method is
    called before the callback function, the callback function won't be
    called.
**/
function soon(callbackFunction) {
    var canceled;

    soon._asynchronizer(function () {
        // Some asynchronizers may provide their own cancellation
        // methods such as clearImmediate or clearTimeout but some
        // asynchronizers do not.  For simplicity, cancellation is
        // entirely handled here rather than wrapping the other methods.
        // All asynchronizers are expected to always call this anonymous
        // function.
        if (!canceled) {
            callbackFunction();
        }
    });

    return {
        cancel: function () {
            canceled = 1;
        }
    };
}

soon._asynchronizer = asap;
soon._impl = 'asap';

Y.soon = soon;
