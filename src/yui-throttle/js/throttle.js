/**
Throttles a call to a method based on the time between calls. This method is attached
to the `Y` object and is <a href="../classes/YUI.html#method_throttle">documented there</a>.

    var fn = Y.throttle(function() {
        counter++;
    });

    for (i; i< 35000; i++) {
        out++;
        fn();
    }


@module yui
@submodule yui-throttle
*/

/*! Based on work by Simon Willison: http://gist.github.com/292562 */
/**
 * Throttles a call to a method based on the time between calls.
 * @method throttle
 * @for YUI
 * @param fn {function} The function call to throttle.
 * @param ms {Number} The number of milliseconds to throttle the method call.
 * Can set globally with Y.config.throttleTime or by call. Passing a -1 will
 * disable the throttle. Defaults to 150.
 * @return {function} Returns a wrapped function that calls fn throttled.
 * @since 3.1.0
 */
Y.throttle = function(fn, ms) {
    ms = (ms) ? ms : (Y.config.throttleTime || 150);

    if (ms === -1) {
        return function() {
            fn.apply(this, arguments);
        };
    }

    var last = Y.Lang.now();

    return function() {
        var now = Y.Lang.now();
        if (now - last > ms) {
            last = now;
            fn.apply(this, arguments);
        }
    };
};

/**
 * Throttles a call to a method based on the time between calls.
 *
 * The method is called at the end of the delay period rather than the
 * beginning.
 *
 * @for YUI
 * @method lateThrottle
 * @param {function} fn The function call to throttle.
 * @param {Number} ms The number of milliseconds to throttle the method call.
 * Can set globally with Y.config.throttleTime or by call. Passing a -1 will
 * disable the throttle. Defaults to 150.
 * @param {Boolean} [useFinalArgument=false] If true, use the arguments from the final
 * call to the function, otherwise use the arguments from the initial call.
 * @return {function} Retuns a wrapped function that calls fn throttled.
 */
Y.lateThrottle = function(fn, ms, useFinalArgument) {
    ms = (ms) ? ms : (Y.config.throttleTime || 150);

    if (ms === -1) {
        return function() {
            fn.apply(this, arguments);
        };
    }

    var first = 0,
        timer;
    return function () {
        var last = Y.Lang.now();
        if (last - first > ms) {
            // The first call was more than delay ms ago.
            // Reset the first time and trigger a new timer.
            first = last;
            timer = Y.later(ms, this, fn, arguments);
        } else if (useFinalArgument === true) {
            timer.cancel();
            timer = Y.later(last - first, this, fn, arguments);
        }
    };
};
