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
 *
 * On the first call to the throttled function the time is recorded,
 * and the wrapped function is then executed.
 * Subsequent calls to the throttled function will be ignored until
 * the throttle time has expired.
 *
 * The following example will result in precisely one call to the `doSomething` function:
 *
 *     var throttledFn = Y.throttle(doSomething);
 *     throttledFn(); // This call with result in doSomething being executed.
 *     throttledFn(); // This call will be ignored.
 *
 *
 * @method throttle
 * @for YUI
 * @param fn {function} The function call to throttle.
 * @param [ms=150] {Number} The number of milliseconds to throttle the method call.
 * Passing a value of `-1` will disable the throttle.
 * A default value can be set globally in `Y.config.throttleTime`.
 * If no value is passed, and no global setting was specified in
 * `Y.config.throttleTime`, then a default value of 150 milliseconds
 * is used.
 *
 * @return {function} Returns a wrapped function that calls the
 * function specified in `fn` with throttling applied.
 * @since 3.1.0
 */
Y.throttle = function(fn, ms) {
    ms = (ms) ? ms : (Y.config.throttleTime || 150);

    if (ms === -1) {
        return function() {
            fn.apply(this, arguments);
        };
    }

    var last = 0;

    return function() {
        var now = Y.Lang.now();
        if (now - last > ms) {
            last = now;
            fn.apply(this, arguments);
        }
    };
};
