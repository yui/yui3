YUI.add('yui-throttle', function(Y) {

/**
 * Provides a throttle/limiter for function calls
 * @module yui
 * @submodule yui-throttle
 */

/**
 * Throttles a call to a method based on the time between calls.
 * @method throttle
 * @for YUI
 * @param fn {function} The function call to throttle.
 * @param ms {int} The number of milliseconds to throttle the method call. Can set
 * globally with Y.config.throttleTime or by call. Passing a -1 will disable the throttle. Defaults to 150
 * @return {function} Returns a wrapped function that calls fn throttled.
 */

var throttle = function(fn, ms) {
    if (ms === -1) {
        return (function() {
            fn.apply(null, arguments);
        });
    }
    ms = (ms) ? ms : (Y.config.throttleTime || 150);
    var last = (new Date()).getTime();

    return (function() {
        var now = (new Date()).getTime();
        if (now - last > ms) {
            last = now;
            fn.apply(null, arguments);
        }
    });
};

Y.throttle = throttle;
Y.Lang.throttle = throttle;



}, '@VERSION@' ,{requires:['yui-base']});
