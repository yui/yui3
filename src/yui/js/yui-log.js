(function() {

var instance = Y;

/**
 * If the 'debug' config is true, a 'yui:log' event will be
 * dispatched, which the Console widget and anything else
 * can consume.  If the 'useBrowserConsole' config is true, it will
 * write to the browser console if available.  YUI-specific log
 * messages will only be present in the -debug versions of the
 * JS files.  The build system is supposed to remove log statements
 * from the raw and minified versions of the files.
 *
 * @method log
 * @for YUI
 * @param  {String}  msg  The message to log.
 * @param  {String}  cat  The log category for the message.  Default
 *                        categories are "info", "warn", "error", time".
 *                        Custom categories can be used as well. (opt)
 * @param  {String}  src  The source of the the message (opt)
 * @param  {boolean} silent If true, the log event won't fire
 * @return {YUI}      YUI instance
 */
instance.log = function(msg, cat, src, silent) {

    var Y = instance, c = Y.config, bail = false, exc, inc, m, f;

    // suppress log message if the config is off or the event stack
    // or the event call stack contains a consumer of the yui:log event
    if (c.debug) {

        // apply source filters
        if (src) {

            exc = c.logExclude; 
            inc = c.logInclude;

            // console.log('checking src filter: ' + src + ', inc: ' + inc + ', exc: ' + exc);

            if (inc && !(src in inc)) {
                // console.log('bail: inc list found, but src is not in list: ' + src);
                bail = true;
            } else if (exc && (src in exc)) {
                // console.log('bail: exc list found, and src is in it: ' + src);
                bail = true;
            }
        }

        if (!bail) {

            if (c.useBrowserConsole) {
                m = (src) ? src + ': ' + msg : msg;
                if (typeof console != 'undefined') {
                    f = (cat && console[cat]) ? cat : 'log';
                    console[f](m);
                } else if (typeof opera != 'undefined') {
                    opera.postError(m);
                }
            }

            if (Y.fire && !bail && !silent) {
                Y.fire('yui:log', msg, cat, src);
            }
        }
    }

    return Y;
};

/**
 * Write a system message.  This message will be preserved in the
 * minified and raw versions of the YUI files, unlike log statements.
 * @method message
 * @for YUI
 * @param  {String}  msg  The message to log.
 * @param  {String}  cat  The log category for the message.  Default
 *                        categories are "info", "warn", "error", time".
 *                        Custom categories can be used as well. (opt)
 * @param  {String}  src  The source of the the message (opt)
 * @param  {boolean} silent If true, the log event won't fire
 * @return {YUI}      YUI instance
 */
instance.message = function() {
    return instance.log.apply(instance, arguments);
};

})();
