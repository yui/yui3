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
_yuitest_coverage["build/deferred-extras/deferred-extras.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/deferred-extras/deferred-extras.js",
    code: []
};
_yuitest_coverage["build/deferred-extras/deferred-extras.js"].code=["YUI.add('deferred-extras', function (Y, NAME) {","","\"use strict\";","/**","Adds additional functionality to Y.Deferred and Y.Promise.","","* `promise.onProgress(callback)` to register lifecycle status subscribers","* `deferred.notify(args*)` to notify progress subscribers","* `promise.wait(ms)` to insert a delay into a promise chain","","@module deferred","@submodule deferred-extras","@since 3.7.0","@for Deferred","**/","","var slice = [].slice,","    isFunction = Y.Lang.isFunction;","","Y.mix(Y.Deferred.prototype, {","    /**","    Creates a Y.Deferred that will resolve in the specified amount of","    milliseconds.  Returns the Deferred's promise to allow sequential chaining","    of operations after the inserted pause.","","    @method wait","    @param {Number} ms Number of milliseconds to wait before resolving","    @return {Promise}","    **/","    wait: function (ms) {","        var deferred = new Y.Deferred(),","            promise  = deferred.promise(),","            timeout;","","        // || 0 catches 0 and NaN","        ms = Math.max(0, +ms || 0);","","        this.then(function () {","            var args = slice.call(arguments);","","            timeout = setTimeout(function () {","                deferred.resolve.apply(deferred, args);","            }, ms);","        });","","        promise.cancel = function () {","            clearTimeout(timeout);","            deferred.reject.apply(deferred, arguments);","        };","","        return promise;","    },","","    /**","    Executes callbacks registered with `onProgress`, relaying all arguments.","    This will only work when the Deferred has not been resolved or rejected","    (the represented operation is still active).","","    @method notify","    @param {Any} arg* Any arguments to pass to the callbacks","    @return {Deferred} This Deferred","    @chainable","    **/","    notify: function () {","        var subs    = this._subs.progress || [],","            promise = this.promise(),","            args    = slice.call(arguments),","            i, len;","","        for (i = 0, len = subs.length; i < len; ++i) {","            subs[i].apply(promise, args);","        }","","        return this;","    },","","    /**","    Registers a callback to be executed with progress updates from the operation","    represented by this Deferred (if it can and does notify of progress).","","    @method onProgress","    @param {Function} callback The callback to notify","    @return {Promise} The Deferred's promise","    **/","    onProgress: function (callback) {","        var subs = this._subs;","","        // no-op subscribers after resolution","        if (this._status === 'in progress') {","            // First call, need to supplement the subs collection with an array","            // for progress listeners","            if (!subs.progress) {","                subs.progress = [];","            }","","            subs.progress.push(callback);","        }","","        return this.promise();","    },","","    /**","    Returns `true` if the Deferred has been resolved.","","    @method isResolved","    @return {Boolean}","    **/","    isResolved: function () {","        return this._status === 'resolved';","    },","","    /**","    Returns `true` if the Deferred has been rejected.","","    @method isRejected","    @return {Boolean}","    **/","    isRejected: function () {","        return this._status === 'rejected';","    },","","    /**","    Returns `true` if the Deferred has not yet been resolved or rejected.","","    @method isInProgress","    @return {Boolean}","    **/","    isInProgress: function () {","        return this._status === 'in progress';","    }","","}, true);","","/**","Registers a callback to be executed with progress updates from the operation","represented by this Deferred (if it can and does notify of progress).","","@method onProgress","@param {Function} callback The callback to notify","@return {Promise} The Deferred's promise","@for Promise","**/","","/**","Creates a Y.Deferred that will resolve in the specified amount of milliseconds.","Returns the Deferred's promise to allow sequential chaining of operations.","","@method wait","@param {Number} ms Number of milliseconds to wait before resolving","@return {Promise}","**/","","/**","Returns `true` if the Deferred has been resolved.","","@method isResolved","@return {Boolean}","**/","","/**","Returns `true` if the Deferred has been rejected.","","@method isRejected","@return {Boolean}","**/","","/**","Returns `true` if the Deferred has not yet been resolved or rejected.","","@method isInProgress","@return {Boolean}","**/","Y.Promise.addMethod(","    ['wait', 'onProgress', 'isResolved', 'isRejected', 'isInProgress']);","/**","Adds a `Y.batch()` method to wrap any number of callbacks or promises in a","Y.Deferred, and return the associated promise that will resolve when all","callbacks and/or promises have completed.  Each callback is passed a Y.Deferred","that it must `resolve()` when it completes.","","@module deferred","@submodule deferred-when","**/","","/**","Wraps any number of callbacks in a Y.Deferred, and returns the associated","promise that will resolve when all callbacks have completed.  Each callback is","passed a Y.Deferred that it must `resolve()` when that callback completes.","","@for YUI","@method batch","@param {Function|Promise} operation* Any number of functions or Y.Promise","            objects","@return {Promise}","**/","Y.batch = function () {","    var funcs     = slice.call(arguments),","        remaining = funcs.length,","        results   = [];","","    return Y.defer(function (allDone) {","        var failed = Y.bind('reject', allDone);","","        function oneDone(i) {","            return function () {","                var args = slice.call(arguments);","","                results[i] = args.length > 1 ? args : args[0];","","                remaining--;","","                if (!remaining && allDone.getStatus() !== 'rejected') {","                    allDone.resolve.apply(allDone, results);","                }","            };","        }","","        Y.Array.each(funcs, function (fn, i) {","            Y.when((isFunction(fn) ? Y.defer(fn) : fn), oneDone(i), failed);","        });","    });","};","","","}, '@VERSION@', {\"requires\": [\"deferred\"]});"];
_yuitest_coverage["build/deferred-extras/deferred-extras.js"].lines = {"1":0,"3":0,"17":0,"20":0,"31":0,"36":0,"38":0,"39":0,"41":0,"42":0,"46":0,"47":0,"48":0,"51":0,"65":0,"70":0,"71":0,"74":0,"86":0,"89":0,"92":0,"93":0,"96":0,"99":0,"109":0,"119":0,"129":0,"173":0,"196":0,"197":0,"201":0,"202":0,"204":0,"205":0,"206":0,"208":0,"210":0,"212":0,"213":0,"218":0,"219":0};
_yuitest_coverage["build/deferred-extras/deferred-extras.js"].functions = {"(anonymous 3):41":0,"(anonymous 2):38":0,"cancel:46":0,"wait:30":0,"notify:64":0,"onProgress:85":0,"isResolved:108":0,"isRejected:118":0,"isInProgress:128":0,"(anonymous 5):205":0,"oneDone:204":0,"(anonymous 6):218":0,"(anonymous 4):201":0,"batch:196":0,"(anonymous 1):1":0};
_yuitest_coverage["build/deferred-extras/deferred-extras.js"].coveredLines = 41;
_yuitest_coverage["build/deferred-extras/deferred-extras.js"].coveredFunctions = 15;
_yuitest_coverline("build/deferred-extras/deferred-extras.js", 1);
YUI.add('deferred-extras', function (Y, NAME) {

_yuitest_coverfunc("build/deferred-extras/deferred-extras.js", "(anonymous 1)", 1);
_yuitest_coverline("build/deferred-extras/deferred-extras.js", 3);
"use strict";
/**
Adds additional functionality to Y.Deferred and Y.Promise.

* `promise.onProgress(callback)` to register lifecycle status subscribers
* `deferred.notify(args*)` to notify progress subscribers
* `promise.wait(ms)` to insert a delay into a promise chain

@module deferred
@submodule deferred-extras
@since 3.7.0
@for Deferred
**/

_yuitest_coverline("build/deferred-extras/deferred-extras.js", 17);
var slice = [].slice,
    isFunction = Y.Lang.isFunction;

_yuitest_coverline("build/deferred-extras/deferred-extras.js", 20);
Y.mix(Y.Deferred.prototype, {
    /**
    Creates a Y.Deferred that will resolve in the specified amount of
    milliseconds.  Returns the Deferred's promise to allow sequential chaining
    of operations after the inserted pause.

    @method wait
    @param {Number} ms Number of milliseconds to wait before resolving
    @return {Promise}
    **/
    wait: function (ms) {
        _yuitest_coverfunc("build/deferred-extras/deferred-extras.js", "wait", 30);
_yuitest_coverline("build/deferred-extras/deferred-extras.js", 31);
var deferred = new Y.Deferred(),
            promise  = deferred.promise(),
            timeout;

        // || 0 catches 0 and NaN
        _yuitest_coverline("build/deferred-extras/deferred-extras.js", 36);
ms = Math.max(0, +ms || 0);

        _yuitest_coverline("build/deferred-extras/deferred-extras.js", 38);
this.then(function () {
            _yuitest_coverfunc("build/deferred-extras/deferred-extras.js", "(anonymous 2)", 38);
_yuitest_coverline("build/deferred-extras/deferred-extras.js", 39);
var args = slice.call(arguments);

            _yuitest_coverline("build/deferred-extras/deferred-extras.js", 41);
timeout = setTimeout(function () {
                _yuitest_coverfunc("build/deferred-extras/deferred-extras.js", "(anonymous 3)", 41);
_yuitest_coverline("build/deferred-extras/deferred-extras.js", 42);
deferred.resolve.apply(deferred, args);
            }, ms);
        });

        _yuitest_coverline("build/deferred-extras/deferred-extras.js", 46);
promise.cancel = function () {
            _yuitest_coverfunc("build/deferred-extras/deferred-extras.js", "cancel", 46);
_yuitest_coverline("build/deferred-extras/deferred-extras.js", 47);
clearTimeout(timeout);
            _yuitest_coverline("build/deferred-extras/deferred-extras.js", 48);
deferred.reject.apply(deferred, arguments);
        };

        _yuitest_coverline("build/deferred-extras/deferred-extras.js", 51);
return promise;
    },

    /**
    Executes callbacks registered with `onProgress`, relaying all arguments.
    This will only work when the Deferred has not been resolved or rejected
    (the represented operation is still active).

    @method notify
    @param {Any} arg* Any arguments to pass to the callbacks
    @return {Deferred} This Deferred
    @chainable
    **/
    notify: function () {
        _yuitest_coverfunc("build/deferred-extras/deferred-extras.js", "notify", 64);
_yuitest_coverline("build/deferred-extras/deferred-extras.js", 65);
var subs    = this._subs.progress || [],
            promise = this.promise(),
            args    = slice.call(arguments),
            i, len;

        _yuitest_coverline("build/deferred-extras/deferred-extras.js", 70);
for (i = 0, len = subs.length; i < len; ++i) {
            _yuitest_coverline("build/deferred-extras/deferred-extras.js", 71);
subs[i].apply(promise, args);
        }

        _yuitest_coverline("build/deferred-extras/deferred-extras.js", 74);
return this;
    },

    /**
    Registers a callback to be executed with progress updates from the operation
    represented by this Deferred (if it can and does notify of progress).

    @method onProgress
    @param {Function} callback The callback to notify
    @return {Promise} The Deferred's promise
    **/
    onProgress: function (callback) {
        _yuitest_coverfunc("build/deferred-extras/deferred-extras.js", "onProgress", 85);
_yuitest_coverline("build/deferred-extras/deferred-extras.js", 86);
var subs = this._subs;

        // no-op subscribers after resolution
        _yuitest_coverline("build/deferred-extras/deferred-extras.js", 89);
if (this._status === 'in progress') {
            // First call, need to supplement the subs collection with an array
            // for progress listeners
            _yuitest_coverline("build/deferred-extras/deferred-extras.js", 92);
if (!subs.progress) {
                _yuitest_coverline("build/deferred-extras/deferred-extras.js", 93);
subs.progress = [];
            }

            _yuitest_coverline("build/deferred-extras/deferred-extras.js", 96);
subs.progress.push(callback);
        }

        _yuitest_coverline("build/deferred-extras/deferred-extras.js", 99);
return this.promise();
    },

    /**
    Returns `true` if the Deferred has been resolved.

    @method isResolved
    @return {Boolean}
    **/
    isResolved: function () {
        _yuitest_coverfunc("build/deferred-extras/deferred-extras.js", "isResolved", 108);
_yuitest_coverline("build/deferred-extras/deferred-extras.js", 109);
return this._status === 'resolved';
    },

    /**
    Returns `true` if the Deferred has been rejected.

    @method isRejected
    @return {Boolean}
    **/
    isRejected: function () {
        _yuitest_coverfunc("build/deferred-extras/deferred-extras.js", "isRejected", 118);
_yuitest_coverline("build/deferred-extras/deferred-extras.js", 119);
return this._status === 'rejected';
    },

    /**
    Returns `true` if the Deferred has not yet been resolved or rejected.

    @method isInProgress
    @return {Boolean}
    **/
    isInProgress: function () {
        _yuitest_coverfunc("build/deferred-extras/deferred-extras.js", "isInProgress", 128);
_yuitest_coverline("build/deferred-extras/deferred-extras.js", 129);
return this._status === 'in progress';
    }

}, true);

/**
Registers a callback to be executed with progress updates from the operation
represented by this Deferred (if it can and does notify of progress).

@method onProgress
@param {Function} callback The callback to notify
@return {Promise} The Deferred's promise
@for Promise
**/

/**
Creates a Y.Deferred that will resolve in the specified amount of milliseconds.
Returns the Deferred's promise to allow sequential chaining of operations.

@method wait
@param {Number} ms Number of milliseconds to wait before resolving
@return {Promise}
**/

/**
Returns `true` if the Deferred has been resolved.

@method isResolved
@return {Boolean}
**/

/**
Returns `true` if the Deferred has been rejected.

@method isRejected
@return {Boolean}
**/

/**
Returns `true` if the Deferred has not yet been resolved or rejected.

@method isInProgress
@return {Boolean}
**/
_yuitest_coverline("build/deferred-extras/deferred-extras.js", 173);
Y.Promise.addMethod(
    ['wait', 'onProgress', 'isResolved', 'isRejected', 'isInProgress']);
/**
Adds a `Y.batch()` method to wrap any number of callbacks or promises in a
Y.Deferred, and return the associated promise that will resolve when all
callbacks and/or promises have completed.  Each callback is passed a Y.Deferred
that it must `resolve()` when it completes.

@module deferred
@submodule deferred-when
**/

/**
Wraps any number of callbacks in a Y.Deferred, and returns the associated
promise that will resolve when all callbacks have completed.  Each callback is
passed a Y.Deferred that it must `resolve()` when that callback completes.

@for YUI
@method batch
@param {Function|Promise} operation* Any number of functions or Y.Promise
            objects
@return {Promise}
**/
_yuitest_coverline("build/deferred-extras/deferred-extras.js", 196);
Y.batch = function () {
    _yuitest_coverfunc("build/deferred-extras/deferred-extras.js", "batch", 196);
_yuitest_coverline("build/deferred-extras/deferred-extras.js", 197);
var funcs     = slice.call(arguments),
        remaining = funcs.length,
        results   = [];

    _yuitest_coverline("build/deferred-extras/deferred-extras.js", 201);
return Y.defer(function (allDone) {
        _yuitest_coverfunc("build/deferred-extras/deferred-extras.js", "(anonymous 4)", 201);
_yuitest_coverline("build/deferred-extras/deferred-extras.js", 202);
var failed = Y.bind('reject', allDone);

        _yuitest_coverline("build/deferred-extras/deferred-extras.js", 204);
function oneDone(i) {
            _yuitest_coverfunc("build/deferred-extras/deferred-extras.js", "oneDone", 204);
_yuitest_coverline("build/deferred-extras/deferred-extras.js", 205);
return function () {
                _yuitest_coverfunc("build/deferred-extras/deferred-extras.js", "(anonymous 5)", 205);
_yuitest_coverline("build/deferred-extras/deferred-extras.js", 206);
var args = slice.call(arguments);

                _yuitest_coverline("build/deferred-extras/deferred-extras.js", 208);
results[i] = args.length > 1 ? args : args[0];

                _yuitest_coverline("build/deferred-extras/deferred-extras.js", 210);
remaining--;

                _yuitest_coverline("build/deferred-extras/deferred-extras.js", 212);
if (!remaining && allDone.getStatus() !== 'rejected') {
                    _yuitest_coverline("build/deferred-extras/deferred-extras.js", 213);
allDone.resolve.apply(allDone, results);
                }
            };
        }

        _yuitest_coverline("build/deferred-extras/deferred-extras.js", 218);
Y.Array.each(funcs, function (fn, i) {
            _yuitest_coverfunc("build/deferred-extras/deferred-extras.js", "(anonymous 6)", 218);
_yuitest_coverline("build/deferred-extras/deferred-extras.js", 219);
Y.when((isFunction(fn) ? Y.defer(fn) : fn), oneDone(i), failed);
        });
    });
};


}, '@VERSION@', {"requires": ["deferred"]});
