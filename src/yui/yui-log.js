/*
 * YUI console logger
 * @module yui
 * @submodule log
 */
YUI.add("log", function(instance) {

    /**
     * If the 'debug' config is true, a 'yui:log' event will be
     * dispatched, which the logger widget and anything else
     * can consume.  If the 'useConsole' config is true, it will
     * write to the browser console if available.
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

        var Y = instance, c = Y.config, es = Y.Env._eventstack,
            // bail = (es && es.logging);
            bail = false; 

        // suppress log message if the config is off or the event stack
        // or the event call stack contains a consumer of the yui:log event
        if (c.debug && !bail) {

            // apply source filters
            if (src) {

                var exc = c.logExclude, inc = c.logInclude;

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

                if (c.useConsole) {
                    var m = (src) ? src + ': ' + msg : msg;
                    if (typeof console != 'undefined') {
                        var f = (cat && console[cat]) ? cat : 'log';
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

}, "@VERSION@");
