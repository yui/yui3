YUI.add("log", function(instance) {

    /**
     * If the 'debug' config is true, a 'yui:log' event will be
     * dispatched, which the logger widget and anything else
     * can consume.  If the 'useConsole' config is true, it will
     * write to the browser console if available.
     *
     * @method log
     * @static
     * @param  {String}  msg  The message to log.
     * @param  {String}  cat  The log category for the message.  Default
     *                        categories are "info", "warn", "error", time".
     *                        Custom categories can be used as well. (opt)
     * @param  {String}  src  The source of the the message (opt)
     * @return {YUI}      YUI instance
     */
    instance.log = function(msg, cat, src) {

        var Y = instance, c = Y.config, es = Y.Env._eventstack,
            bail = (es && es.logging);

        // suppress log message if the config is off or the event stack
        // or the event call stack contains a consumer of the yui:log event
        if (c.debug && !bail) {

            if (c.useConsole && typeof console != 'undefined') {

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

                    var f = (cat && console[cat]) ? cat : 'log',
                        m = (src) ? src + ': ' + msg : msg;
                    console[f](m);
                }
            }

            // category filters are not used to suppress the log event
            // so that the data can be stored and displayed later.
            if (Y.fire) {
                Y.fire('yui:log', msg, cat, src);
            }
        }

        return Y;
    };

}, "@VERSION@");
