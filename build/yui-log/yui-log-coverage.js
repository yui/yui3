if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["yui-log"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "yui-log",
    code: []
};
_yuitest_coverage["yui-log"].code=["YUI.add('yui-log', function (Y, NAME) {","","/**"," * Provides console log capability and exposes a custom event for"," * console implementations. This module is a `core` YUI module, <a href=\"../classes/YUI.html#method_log\">it's documentation is located under the YUI class</a>."," *"," * @module yui"," * @submodule yui-log"," */","","var INSTANCE = Y,","    LOGEVENT = 'yui:log',","    UNDEFINED = 'undefined',","    LEVELS = { debug: 1,","               info: 1,","               warn: 1,","               error: 1 };","","/**"," * If the 'debug' config is true, a 'yui:log' event will be"," * dispatched, which the Console widget and anything else"," * can consume.  If the 'useBrowserConsole' config is true, it will"," * write to the browser console if available.  YUI-specific log"," * messages will only be present in the -debug versions of the"," * JS files.  The build system is supposed to remove log statements"," * from the raw and minified versions of the files."," *"," * @method log"," * @for YUI"," * @param  {String}  msg  The message to log."," * @param  {String}  cat  The log category for the message.  Default"," *                        categories are \"info\", \"warn\", \"error\", time\"."," *                        Custom categories can be used as well. (opt)."," * @param  {String}  src  The source of the the message (opt)."," * @param  {boolean} silent If true, the log event won't fire."," * @return {YUI}      YUI instance."," */","INSTANCE.log = function(msg, cat, src, silent) {","    var bail, excl, incl, m, f,","        Y = INSTANCE,","        c = Y.config,","        publisher = (Y.fire) ? Y : YUI.Env.globalEvents;","    // suppress log message if the config is off or the event stack","    // or the event call stack contains a consumer of the yui:log event","    if (c.debug) {","        // apply source filters","        src = src || \"\";","        if (typeof src !== \"undefined\") {","            excl = c.logExclude;","            incl = c.logInclude;","            if (incl && !(src in incl)) {","                bail = 1;","            } else if (incl && (src in incl)) {","                bail = !incl[src];","            } else if (excl && (src in excl)) {","                bail = excl[src];","            }","        }","        if (!bail) {","            if (c.useBrowserConsole) {","                m = (src) ? src + ': ' + msg : msg;","                if (Y.Lang.isFunction(c.logFn)) {","                    c.logFn.call(Y, msg, cat, src);","                } else if (typeof console != UNDEFINED && console.log) {","                    f = (cat && console[cat] && (cat in LEVELS)) ? cat : 'log';","                    console[f](m);","                } else if (typeof opera != UNDEFINED) {","                    opera.postError(m);","                }","            }","","            if (publisher && !silent) {","","                if (publisher == Y && (!publisher.getEvent(LOGEVENT))) {","                    publisher.publish(LOGEVENT, {","                        broadcast: 2","                    });","                }","","                publisher.fire(LOGEVENT, {","                    msg: msg,","                    cat: cat,","                    src: src","                });","            }","        }","    }","","    return Y;","};","","/**"," * Write a system message.  This message will be preserved in the"," * minified and raw versions of the YUI files, unlike log statements."," * @method message"," * @for YUI"," * @param  {String}  msg  The message to log."," * @param  {String}  cat  The log category for the message.  Default"," *                        categories are \"info\", \"warn\", \"error\", time\"."," *                        Custom categories can be used as well. (opt)."," * @param  {String}  src  The source of the the message (opt)."," * @param  {boolean} silent If true, the log event won't fire."," * @return {YUI}      YUI instance."," */","INSTANCE.message = function() {","    return INSTANCE.log.apply(INSTANCE, arguments);","};","","","}, '@VERSION@', {\"requires\": [\"yui-base\"]});"];
_yuitest_coverage["yui-log"].lines = {"1":0,"11":0,"38":0,"39":0,"45":0,"47":0,"48":0,"49":0,"50":0,"51":0,"52":0,"53":0,"54":0,"55":0,"56":0,"59":0,"60":0,"61":0,"62":0,"63":0,"64":0,"65":0,"66":0,"67":0,"68":0,"72":0,"74":0,"75":0,"80":0,"89":0,"105":0,"106":0};
_yuitest_coverage["yui-log"].functions = {"log:38":0,"message:105":0,"(anonymous 1):1":0};
_yuitest_coverage["yui-log"].coveredLines = 32;
_yuitest_coverage["yui-log"].coveredFunctions = 3;
_yuitest_coverline("yui-log", 1);
YUI.add('yui-log', function (Y, NAME) {

/**
 * Provides console log capability and exposes a custom event for
 * console implementations. This module is a `core` YUI module, <a href="../classes/YUI.html#method_log">it's documentation is located under the YUI class</a>.
 *
 * @module yui
 * @submodule yui-log
 */

_yuitest_coverfunc("yui-log", "(anonymous 1)", 1);
_yuitest_coverline("yui-log", 11);
var INSTANCE = Y,
    LOGEVENT = 'yui:log',
    UNDEFINED = 'undefined',
    LEVELS = { debug: 1,
               info: 1,
               warn: 1,
               error: 1 };

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
 *                        Custom categories can be used as well. (opt).
 * @param  {String}  src  The source of the the message (opt).
 * @param  {boolean} silent If true, the log event won't fire.
 * @return {YUI}      YUI instance.
 */
_yuitest_coverline("yui-log", 38);
INSTANCE.log = function(msg, cat, src, silent) {
    _yuitest_coverfunc("yui-log", "log", 38);
_yuitest_coverline("yui-log", 39);
var bail, excl, incl, m, f,
        Y = INSTANCE,
        c = Y.config,
        publisher = (Y.fire) ? Y : YUI.Env.globalEvents;
    // suppress log message if the config is off or the event stack
    // or the event call stack contains a consumer of the yui:log event
    _yuitest_coverline("yui-log", 45);
if (c.debug) {
        // apply source filters
        _yuitest_coverline("yui-log", 47);
src = src || "";
        _yuitest_coverline("yui-log", 48);
if (typeof src !== "undefined") {
            _yuitest_coverline("yui-log", 49);
excl = c.logExclude;
            _yuitest_coverline("yui-log", 50);
incl = c.logInclude;
            _yuitest_coverline("yui-log", 51);
if (incl && !(src in incl)) {
                _yuitest_coverline("yui-log", 52);
bail = 1;
            } else {_yuitest_coverline("yui-log", 53);
if (incl && (src in incl)) {
                _yuitest_coverline("yui-log", 54);
bail = !incl[src];
            } else {_yuitest_coverline("yui-log", 55);
if (excl && (src in excl)) {
                _yuitest_coverline("yui-log", 56);
bail = excl[src];
            }}}
        }
        _yuitest_coverline("yui-log", 59);
if (!bail) {
            _yuitest_coverline("yui-log", 60);
if (c.useBrowserConsole) {
                _yuitest_coverline("yui-log", 61);
m = (src) ? src + ': ' + msg : msg;
                _yuitest_coverline("yui-log", 62);
if (Y.Lang.isFunction(c.logFn)) {
                    _yuitest_coverline("yui-log", 63);
c.logFn.call(Y, msg, cat, src);
                } else {_yuitest_coverline("yui-log", 64);
if (typeof console != UNDEFINED && console.log) {
                    _yuitest_coverline("yui-log", 65);
f = (cat && console[cat] && (cat in LEVELS)) ? cat : 'log';
                    _yuitest_coverline("yui-log", 66);
console[f](m);
                } else {_yuitest_coverline("yui-log", 67);
if (typeof opera != UNDEFINED) {
                    _yuitest_coverline("yui-log", 68);
opera.postError(m);
                }}}
            }

            _yuitest_coverline("yui-log", 72);
if (publisher && !silent) {

                _yuitest_coverline("yui-log", 74);
if (publisher == Y && (!publisher.getEvent(LOGEVENT))) {
                    _yuitest_coverline("yui-log", 75);
publisher.publish(LOGEVENT, {
                        broadcast: 2
                    });
                }

                _yuitest_coverline("yui-log", 80);
publisher.fire(LOGEVENT, {
                    msg: msg,
                    cat: cat,
                    src: src
                });
            }
        }
    }

    _yuitest_coverline("yui-log", 89);
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
 *                        Custom categories can be used as well. (opt).
 * @param  {String}  src  The source of the the message (opt).
 * @param  {boolean} silent If true, the log event won't fire.
 * @return {YUI}      YUI instance.
 */
_yuitest_coverline("yui-log", 105);
INSTANCE.message = function() {
    _yuitest_coverfunc("yui-log", "message", 105);
_yuitest_coverline("yui-log", 106);
return INSTANCE.log.apply(INSTANCE, arguments);
};


}, '@VERSION@', {"requires": ["yui-base"]});
