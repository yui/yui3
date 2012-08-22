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
_yuitest_coverage["yui-throttle"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "yui-throttle",
    code: []
};
_yuitest_coverage["yui-throttle"].code=["YUI.add('yui-throttle', function (Y, NAME) {","","/**","Throttles a call to a method based on the time between calls. This method is attached","to the `Y` object and is <a href=\"../classes/YUI.html#method_throttle\">documented there</a>.","","    var fn = Y.throttle(function() {","        counter++;","    });","","    for (i; i< 35000; i++) {","        out++;","        fn();","    }","","","@module yui","@submodule yui-throttle","*/","","/*! Based on work by Simon Willison: http://gist.github.com/292562 */","/**"," * Throttles a call to a method based on the time between calls."," * @method throttle"," * @for YUI"," * @param fn {function} The function call to throttle."," * @param ms {int} The number of milliseconds to throttle the method call."," * Can set globally with Y.config.throttleTime or by call. Passing a -1 will"," * disable the throttle. Defaults to 150."," * @return {function} Returns a wrapped function that calls fn throttled."," * @since 3.1.0"," */","Y.throttle = function(fn, ms) {","    ms = (ms) ? ms : (Y.config.throttleTime || 150);","","    if (ms === -1) {","        return (function() {","            fn.apply(null, arguments);","        });","    }","","    var last = Y.Lang.now();","","    return (function() {","        var now = Y.Lang.now();","        if (now - last > ms) {","            last = now;","            fn.apply(null, arguments);","        }","    });","};","","","}, '@VERSION@', {\"requires\": [\"yui-base\"]});"];
_yuitest_coverage["yui-throttle"].lines = {"1":0,"33":0,"34":0,"36":0,"37":0,"38":0,"42":0,"44":0,"45":0,"46":0,"47":0,"48":0};
_yuitest_coverage["yui-throttle"].functions = {"(anonymous 2):37":0,"(anonymous 3):44":0,"throttle:33":0,"(anonymous 1):1":0};
_yuitest_coverage["yui-throttle"].coveredLines = 12;
_yuitest_coverage["yui-throttle"].coveredFunctions = 4;
_yuitest_coverline("yui-throttle", 1);
YUI.add('yui-throttle', function (Y, NAME) {

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
 * @param ms {int} The number of milliseconds to throttle the method call.
 * Can set globally with Y.config.throttleTime or by call. Passing a -1 will
 * disable the throttle. Defaults to 150.
 * @return {function} Returns a wrapped function that calls fn throttled.
 * @since 3.1.0
 */
_yuitest_coverfunc("yui-throttle", "(anonymous 1)", 1);
_yuitest_coverline("yui-throttle", 33);
Y.throttle = function(fn, ms) {
    _yuitest_coverfunc("yui-throttle", "throttle", 33);
_yuitest_coverline("yui-throttle", 34);
ms = (ms) ? ms : (Y.config.throttleTime || 150);

    _yuitest_coverline("yui-throttle", 36);
if (ms === -1) {
        _yuitest_coverline("yui-throttle", 37);
return (function() {
            _yuitest_coverfunc("yui-throttle", "(anonymous 2)", 37);
_yuitest_coverline("yui-throttle", 38);
fn.apply(null, arguments);
        });
    }

    _yuitest_coverline("yui-throttle", 42);
var last = Y.Lang.now();

    _yuitest_coverline("yui-throttle", 44);
return (function() {
        _yuitest_coverfunc("yui-throttle", "(anonymous 3)", 44);
_yuitest_coverline("yui-throttle", 45);
var now = Y.Lang.now();
        _yuitest_coverline("yui-throttle", 46);
if (now - last > ms) {
            _yuitest_coverline("yui-throttle", 47);
last = now;
            _yuitest_coverline("yui-throttle", 48);
fn.apply(null, arguments);
        }
    });
};


}, '@VERSION@', {"requires": ["yui-base"]});
