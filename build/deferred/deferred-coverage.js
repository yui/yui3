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
_yuitest_coverage["build/deferred/deferred.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/deferred/deferred.js",
    code: []
};
_yuitest_coverage["build/deferred/deferred.js"].code=["YUI.add('deferred', function (Y, NAME) {","","\"use strict\";","/**","Wraps the execution of synchronous or asynchronous operations, providing a","promise object that can be used to subscribe to the various ways the operation","may terminate.","","When the operation completes successfully, call the Deferred's `resolve()`","method, passing any relevant response data for subscribers.  If the operation","encounters an error or is unsuccessful in some way, call `reject()`, again","passing any relevant data for subscribers.","","The Deferred object should be shared only with the code resposible for","resolving or rejecting it. Public access for the Deferred is through its","_promise_, which is returned from the Deferred's `promise()` method. While both","Deferred and promise allow subscriptions to the Deferred's state changes, the","promise may be exposed to non-controlling code. It is the preferable interface","for adding subscriptions.","","Subscribe to state changes in the Deferred with the promise's","`then(callback, errback)` method.  `then()` wraps the passed callbacks in a","new Deferred and returns the corresponding promise, allowing chaining of","asynchronous or synchronous operations. E.g.","`promise.then(someAsyncFunc).then(anotherAsyncFunc)`","","@module deferred","@since 3.7.0","**/","var slice   = [].slice,","    isArray = Y.Lang.isArray,","    isFunction = Y.Lang.isFunction;","","/**","Represents an operation that may be synchronous or asynchronous.  Provides a","standard API for subscribing to the moment that the operation completes either","successfully (`resolve()`) or unsuccessfully (`reject()`).","","@class Deferred","@constructor","**/","function Deferred() {","    this._subs = {","        resolve: [],","        reject : []","    };","","    this._promise = new Y.Promise(this);","","    this._status = 'in progress';","","}","","Y.mix(Deferred.prototype, {","    /**","    Returns the promise for this Deferred.","","    @method promise","    @return {Promise}","    **/","    promise: function () {","        return this._promise;","    },","","    /**","    Resolves the Deferred, signaling successful completion of the","    represented operation. All \"resolve\" subscriptions are executed with","    all arguments passed in. Future \"resolve\" subscriptions will be","    executed immediately with the same arguments. `reject()` and `notify()`","    are disabled.","","    @method resolve","    @param {Any} arg* Any data to pass along to the \"resolve\" subscribers","    @return {Deferred} the instance","    @chainable","    **/","    resolve: function () {","        this._result = slice.call(arguments);","","        this._notify(this._subs.resolve, this.promise(), this._result);","","        this._subs = { resolve: [] };","","        this._status = 'resolved';","","        return this;","    },","","    /**","    Resolves the Deferred, signaling *un*successful completion of the","    represented operation. All \"reject\" subscriptions are executed with","    all arguments passed in. Future \"reject\" subscriptions will be","    executed immediately with the same arguments. `resolve()` and `notify()`","    are disabled.","","    @method reject","    @param {Any} arg* Any data to pass along to the \"reject\" subscribers","    @return {Deferred} the instance","    @chainable","    **/","    reject: function () {","        this._result = slice.call(arguments);","","        this._notify(this._subs.reject, this.promise(), this._result);","","        this._subs = { reject: [] };","","        this._status = 'rejected';","","        return this;","    },","","    /**","    Schedule execution of a callback to either or both of \"resolve\" and","    \"reject\" resolutions for the Deferred.  The callbacks","    are wrapped in a new Deferred and that Deferred's corresponding promise","    is returned.  This allows operation chaining ala","    `functionA().then(functionB).then(functionC)` where `functionA` returns","    a promise, and `functionB` and `functionC` _may_ return promises.","","    @method then","    @param {Function} [callback] function to execute if the Deferred","                resolves successfully","    @param {Function} [errback] function to execute if the Deferred","                resolves unsuccessfully","    @return {Promise} The promise of a new Deferred wrapping the resolution","                of either \"resolve\" or \"reject\" callback","    **/","    then: function (callback, errback) {","        // When the current promise is resolved or rejected, either the","        // callback or errback will be executed via the function pushed onto","        // this._subs.resolve or this._sub.reject.  However, to allow then()","        // chaining, the execution of either function needs to be represented","        // by a Deferred (the same Deferred can represent both flow paths), and","        // its promise returned.","        var then    = new Y.Deferred(),","            promise = this.promise(),","            resolveSubs = this._subs.resolve || [],","            rejectSubs  = this._subs.reject  || [];","","        // Because the callback and errback are represented by a Deferred, it","        // must be resolved or rejected to propagate through the then() chain.","        // The same logic applies to resolve() and reject() for fulfillment.","        function wrap(fn) {","            return function () {","                // The args coming in to the callback/errback from the","                // resolution of the parent promise.","                var args = slice.call(arguments);","","                // Wrapping all callbacks in setTimeout to guarantee","                // asynchronicity. Because setTimeout can cause unnecessary","                // delays that *can* become noticeable in some situations","                // (especially in Node.js), I'm using Y.soon if available.","                // As of today, Y.soon is only available in the gallery as","                // gallery-soon, but maybe it could get promoted to core?","                (Y.soon || setTimeout)(function () {","                    // Call the callback/errback with promise as `this` to","                    // preserve the contract that access to the deferred is","                    // only for code that may resolve/reject it.","                    // Another option would be call the function from the","                    // global context, but it seemed less useful.","                    var result = fn.apply(promise, args),","                        resultPromise;","","                    // If the callback returned a promise (or deferred), only","                    // resolve the deferred if the returned promise is resolved","                    // or rejected. Otherwise, wait for it.","                    if (result && typeof result.promise === 'function') {","                        resultPromise = result.promise();","                        result        = resultPromise.getResult();","","                        switch (resultPromise.getStatus()) {","                            // Proceed twiddling thumbs until the promise is","                            // fulfilled.","                            case 'in progress':","                                resultPromise.then(","                                    Y.bind(then.resolve, then), // callback","                                    Y.bind(then.reject, then)); // errback","                                break;","                            case 'resolved':","                                // The promise returned from the callback/errback","                                // is fulfilled, so the deferred wrapping the","                                // callback can be resolved. For errbacks","                                // returning a promise, this signals that the","                                // parent promise's rejection was repaired, so","                                // rejected.then(..., errback).then(A, B) will","                                // continue on to A if errback's promise is","                                // resolved.","                                then.resolve.apply(then, result);","                                break;","                            case 'rejected':","                                // For callbacks, promise rejection indicates","                                // something went wrong, so the subsequent","                                // errback (if applicable) should be executed.","                                // For errbacks, promise rejection indicates","                                // either something went wrong while trying to","                                // recover from the parent promise's rejection,","                                // or the errback didn't attempt to recover","                                // from the rejection, so it is appropriate to","                                // continue to the subsequent deferred's","                                // errback.","                                then.reject.apply(then, result);","                                break;","                        }","                    } else {","                        // Non-promise return values always trigger resolve()","                        // because callback is affirmative, and errback is","                        // recovery.  To continue on the rejection path, errbacks","                        // must return rejected promises.","                        then.resolve.apply(then,","                            (isArray(result) ? result : [result]));","                    }","                }, 0);","            };","        }","","        resolveSubs.push((typeof callback === 'function') ?","            wrap(callback, 'resolve') : Y.bind('resolve', then));","","        rejectSubs.push((typeof errback === 'function') ?","            wrap(errback, 'reject') : Y.bind('reject', then));","","        if (this._status === 'resolved') {","            this.resolve.apply(this, this._result);","        } else if (this._status === 'rejected') {","            this.reject.apply(this, this._result);","        }","","        resolveSubs = rejectSubs = null;","","        return then.promise();","    },","","    /**","    Returns the current status of the Deferred as a string \"in progress\",","    \"resolved\", or \"rejected\".","","    @method getStatus","    @return {String}","    **/","    getStatus: function () {","        return this._status;","    },","","    /**","    Returns the result of the Deferred.  Use `getStatus()` to test that the","    promise is resolved before calling this.","","    @method getResult","    @return {Any[]} Array of values passed to `resolve()` or `reject()`","    **/","    getResult: function () {","        return this._result;","    },","","    /**","    Executes an array of callbacks from a specified context, passing a set of","    arguments.","","    @method _notify","    @param {Function[]} subs The array of subscriber callbacks","    @param {Object} context The `this` object for the callbacks","    @param {Any[]} args Any arguments to pass the callbacks","    @protected","    **/","    _notify: function (subs, context, args) {","        var i, len;","","        if (subs) {","            for (i = 0, len = subs.length; i < len; ++i) {","                subs[i].apply(context, args);","            }","        }","    }","","}, true);","","Y.Deferred = Deferred;","","/**","Factory method to create a Deferred that will be resolved or rejected by a","provided _executor_ callback.  The callback is executed asynchronously.","","The associated promise is returned.","","@for YUI","@method defer","@param {Function} executor The function responsible for resolving or rejecting","                        the Deferred.","@return {Promise}","**/","Y.defer = function (executor) {","    var deferred = new Y.Deferred();","","    (Y.soon || setTimeout)(function () {","        if (isFunction(executor)) {","            executor(deferred);","        } else {","            deferred.resolve(executor);","        }","    }, 0);","","    return deferred.promise();","};","","/**","Abstraction API allowing you to interact with promises or raw values as if they","were promises. If a non-promise object is passed in, a new Deferred is created","and scheduled to resolve asynchronously with the provided value.","","In either case, a promise is returned.  If either _callback_ or _errback_ are","provided, the promise returned is the one returned from calling","`promise.then(callback, errback)` on the provided or created promise.  If neither","are provided, the original promise is returned.","","@method when","@param {Any} promise Promise object or value to wrap in a resolved promise","@param {Function} [callback] callback to execute if the promise is resolved","@param {Function} [errback] callback to execute if the promise is rejected","@return {Promise}","**/","Y.when = function (promise, callback, errback) {","    var value;","","    if (!isFunction(promise.then)) {","        value = promise;","","        promise = Y.defer(function (deferred) {","            deferred.resolve(value);","        });","    }","","    return (callback || errback) ? promise.then(callback, errback) : promise;","};","/**","The public API for a Deferred.  Used to subscribe to the notification events for","resolution or progress of the operation represented by the Deferred.","","@class Promise","@constructor","@param {Deferred} deferred The Deferred object that the promise represents","**/","function Promise(deferred) {","    this._deferred = deferred;","}","","/**","Adds a method or array of methods to the Promise prototype to relay to the","so named method on the associated Deferred.","","DO NOT use this expose the Deferred's `resolve` or `reject` methods on the","Promise.","","@method addMethod","@param {String|String[]} methods String or array of string names of functions","                                 already defined on the Deferred to expose on","                                 the Promise prototype.","@static","**/","Promise.addMethod = function(methods) {","    if (!isArray(methods)) {","        methods = [methods];","    }","","    Y.Array.each(methods, function (method) {","        Promise.prototype[method] = function () {","            return this._deferred[method].apply(this._deferred, arguments);","        };","    });","};","","/**","Schedule execution of a callback to either or both of \"resolve\" and","\"reject\" resolutions for the associated Deferred.  The callbacks","are wrapped in a new Deferred and that Deferred's corresponding promise","is returned.  This allows operation chaining ala","`functionA().then(functionB).then(functionC)` where `functionA` returns","a promise, and `functionB` and `functionC` _may_ return promises.","","@method then","@param {Function} [callback] function to execute if the Deferred","            resolves successfully","@param {Function} [errback] function to execute if the Deferred","            resolves unsuccessfully","@return {Promise} The promise of a new Deferred wrapping the resolution","            of either \"resolve\" or \"reject\" callback","**/","","/**","Returns this promise.  Meta, or narcissistic?  Useful to test if an object","is a Deferred or Promise when the intention is to call its `then()`,","`getStatus()`, or `getResult()` method.","","@method promise","@return {Promise} This.","**/","","/**","Returns the current status of the Deferred. Possible results are","\"in progress\", \"resolved\", and \"rejected\".","","@method getStatus","@return {String}","**/","","/**","Returns the result of the Deferred.  Use `getStatus()` to test that the","promise is resolved before calling this.","","@method getResult","@return {Any[]} Array of values passed to `resolve()` or `reject()`","**/","Promise.addMethod(['then', 'promise', 'getStatus', 'getResult']);","","Y.Promise = Promise;","","","}, '@VERSION@', {\"requires\": [\"oop\"]});"];
_yuitest_coverage["build/deferred/deferred.js"].lines = {"1":0,"3":0,"30":0,"42":0,"43":0,"48":0,"50":0,"54":0,"62":0,"78":0,"80":0,"82":0,"84":0,"86":0,"102":0,"104":0,"106":0,"108":0,"110":0,"136":0,"144":0,"145":0,"148":0,"156":0,"162":0,"168":0,"169":0,"170":0,"172":0,"176":0,"179":0,"189":0,"190":0,"202":0,"203":0,"210":0,"217":0,"220":0,"223":0,"224":0,"225":0,"226":0,"229":0,"231":0,"242":0,"253":0,"267":0,"269":0,"270":0,"271":0,"278":0,"292":0,"293":0,"295":0,"296":0,"297":0,"299":0,"303":0,"322":0,"323":0,"325":0,"326":0,"328":0,"329":0,"333":0,"343":0,"344":0,"360":0,"361":0,"362":0,"365":0,"366":0,"367":0,"413":0,"415":0};
_yuitest_coverage["build/deferred/deferred.js"].functions = {"Deferred:42":0,"promise:61":0,"resolve:77":0,"reject:101":0,"(anonymous 3):156":0,"(anonymous 2):145":0,"wrap:144":0,"then:129":0,"getStatus:241":0,"getResult:252":0,"_notify:266":0,"(anonymous 4):295":0,"defer:292":0,"(anonymous 5):328":0,"when:322":0,"Promise:343":0,"]:366":0,"(anonymous 6):365":0,"addMethod:360":0,"(anonymous 1):1":0};
_yuitest_coverage["build/deferred/deferred.js"].coveredLines = 75;
_yuitest_coverage["build/deferred/deferred.js"].coveredFunctions = 20;
_yuitest_coverline("build/deferred/deferred.js", 1);
YUI.add('deferred', function (Y, NAME) {

_yuitest_coverfunc("build/deferred/deferred.js", "(anonymous 1)", 1);
_yuitest_coverline("build/deferred/deferred.js", 3);
"use strict";
/**
Wraps the execution of synchronous or asynchronous operations, providing a
promise object that can be used to subscribe to the various ways the operation
may terminate.

When the operation completes successfully, call the Deferred's `resolve()`
method, passing any relevant response data for subscribers.  If the operation
encounters an error or is unsuccessful in some way, call `reject()`, again
passing any relevant data for subscribers.

The Deferred object should be shared only with the code resposible for
resolving or rejecting it. Public access for the Deferred is through its
_promise_, which is returned from the Deferred's `promise()` method. While both
Deferred and promise allow subscriptions to the Deferred's state changes, the
promise may be exposed to non-controlling code. It is the preferable interface
for adding subscriptions.

Subscribe to state changes in the Deferred with the promise's
`then(callback, errback)` method.  `then()` wraps the passed callbacks in a
new Deferred and returns the corresponding promise, allowing chaining of
asynchronous or synchronous operations. E.g.
`promise.then(someAsyncFunc).then(anotherAsyncFunc)`

@module deferred
@since 3.7.0
**/
_yuitest_coverline("build/deferred/deferred.js", 30);
var slice   = [].slice,
    isArray = Y.Lang.isArray,
    isFunction = Y.Lang.isFunction;

/**
Represents an operation that may be synchronous or asynchronous.  Provides a
standard API for subscribing to the moment that the operation completes either
successfully (`resolve()`) or unsuccessfully (`reject()`).

@class Deferred
@constructor
**/
_yuitest_coverline("build/deferred/deferred.js", 42);
function Deferred() {
    _yuitest_coverfunc("build/deferred/deferred.js", "Deferred", 42);
_yuitest_coverline("build/deferred/deferred.js", 43);
this._subs = {
        resolve: [],
        reject : []
    };

    _yuitest_coverline("build/deferred/deferred.js", 48);
this._promise = new Y.Promise(this);

    _yuitest_coverline("build/deferred/deferred.js", 50);
this._status = 'in progress';

}

_yuitest_coverline("build/deferred/deferred.js", 54);
Y.mix(Deferred.prototype, {
    /**
    Returns the promise for this Deferred.

    @method promise
    @return {Promise}
    **/
    promise: function () {
        _yuitest_coverfunc("build/deferred/deferred.js", "promise", 61);
_yuitest_coverline("build/deferred/deferred.js", 62);
return this._promise;
    },

    /**
    Resolves the Deferred, signaling successful completion of the
    represented operation. All "resolve" subscriptions are executed with
    all arguments passed in. Future "resolve" subscriptions will be
    executed immediately with the same arguments. `reject()` and `notify()`
    are disabled.

    @method resolve
    @param {Any} arg* Any data to pass along to the "resolve" subscribers
    @return {Deferred} the instance
    @chainable
    **/
    resolve: function () {
        _yuitest_coverfunc("build/deferred/deferred.js", "resolve", 77);
_yuitest_coverline("build/deferred/deferred.js", 78);
this._result = slice.call(arguments);

        _yuitest_coverline("build/deferred/deferred.js", 80);
this._notify(this._subs.resolve, this.promise(), this._result);

        _yuitest_coverline("build/deferred/deferred.js", 82);
this._subs = { resolve: [] };

        _yuitest_coverline("build/deferred/deferred.js", 84);
this._status = 'resolved';

        _yuitest_coverline("build/deferred/deferred.js", 86);
return this;
    },

    /**
    Resolves the Deferred, signaling *un*successful completion of the
    represented operation. All "reject" subscriptions are executed with
    all arguments passed in. Future "reject" subscriptions will be
    executed immediately with the same arguments. `resolve()` and `notify()`
    are disabled.

    @method reject
    @param {Any} arg* Any data to pass along to the "reject" subscribers
    @return {Deferred} the instance
    @chainable
    **/
    reject: function () {
        _yuitest_coverfunc("build/deferred/deferred.js", "reject", 101);
_yuitest_coverline("build/deferred/deferred.js", 102);
this._result = slice.call(arguments);

        _yuitest_coverline("build/deferred/deferred.js", 104);
this._notify(this._subs.reject, this.promise(), this._result);

        _yuitest_coverline("build/deferred/deferred.js", 106);
this._subs = { reject: [] };

        _yuitest_coverline("build/deferred/deferred.js", 108);
this._status = 'rejected';

        _yuitest_coverline("build/deferred/deferred.js", 110);
return this;
    },

    /**
    Schedule execution of a callback to either or both of "resolve" and
    "reject" resolutions for the Deferred.  The callbacks
    are wrapped in a new Deferred and that Deferred's corresponding promise
    is returned.  This allows operation chaining ala
    `functionA().then(functionB).then(functionC)` where `functionA` returns
    a promise, and `functionB` and `functionC` _may_ return promises.

    @method then
    @param {Function} [callback] function to execute if the Deferred
                resolves successfully
    @param {Function} [errback] function to execute if the Deferred
                resolves unsuccessfully
    @return {Promise} The promise of a new Deferred wrapping the resolution
                of either "resolve" or "reject" callback
    **/
    then: function (callback, errback) {
        // When the current promise is resolved or rejected, either the
        // callback or errback will be executed via the function pushed onto
        // this._subs.resolve or this._sub.reject.  However, to allow then()
        // chaining, the execution of either function needs to be represented
        // by a Deferred (the same Deferred can represent both flow paths), and
        // its promise returned.
        _yuitest_coverfunc("build/deferred/deferred.js", "then", 129);
_yuitest_coverline("build/deferred/deferred.js", 136);
var then    = new Y.Deferred(),
            promise = this.promise(),
            resolveSubs = this._subs.resolve || [],
            rejectSubs  = this._subs.reject  || [];

        // Because the callback and errback are represented by a Deferred, it
        // must be resolved or rejected to propagate through the then() chain.
        // The same logic applies to resolve() and reject() for fulfillment.
        _yuitest_coverline("build/deferred/deferred.js", 144);
function wrap(fn) {
            _yuitest_coverfunc("build/deferred/deferred.js", "wrap", 144);
_yuitest_coverline("build/deferred/deferred.js", 145);
return function () {
                // The args coming in to the callback/errback from the
                // resolution of the parent promise.
                _yuitest_coverfunc("build/deferred/deferred.js", "(anonymous 2)", 145);
_yuitest_coverline("build/deferred/deferred.js", 148);
var args = slice.call(arguments);

                // Wrapping all callbacks in setTimeout to guarantee
                // asynchronicity. Because setTimeout can cause unnecessary
                // delays that *can* become noticeable in some situations
                // (especially in Node.js), I'm using Y.soon if available.
                // As of today, Y.soon is only available in the gallery as
                // gallery-soon, but maybe it could get promoted to core?
                _yuitest_coverline("build/deferred/deferred.js", 156);
(Y.soon || setTimeout)(function () {
                    // Call the callback/errback with promise as `this` to
                    // preserve the contract that access to the deferred is
                    // only for code that may resolve/reject it.
                    // Another option would be call the function from the
                    // global context, but it seemed less useful.
                    _yuitest_coverfunc("build/deferred/deferred.js", "(anonymous 3)", 156);
_yuitest_coverline("build/deferred/deferred.js", 162);
var result = fn.apply(promise, args),
                        resultPromise;

                    // If the callback returned a promise (or deferred), only
                    // resolve the deferred if the returned promise is resolved
                    // or rejected. Otherwise, wait for it.
                    _yuitest_coverline("build/deferred/deferred.js", 168);
if (result && typeof result.promise === 'function') {
                        _yuitest_coverline("build/deferred/deferred.js", 169);
resultPromise = result.promise();
                        _yuitest_coverline("build/deferred/deferred.js", 170);
result        = resultPromise.getResult();

                        _yuitest_coverline("build/deferred/deferred.js", 172);
switch (resultPromise.getStatus()) {
                            // Proceed twiddling thumbs until the promise is
                            // fulfilled.
                            case 'in progress':
                                _yuitest_coverline("build/deferred/deferred.js", 176);
resultPromise.then(
                                    Y.bind(then.resolve, then), // callback
                                    Y.bind(then.reject, then)); // errback
                                _yuitest_coverline("build/deferred/deferred.js", 179);
break;
                            case 'resolved':
                                // The promise returned from the callback/errback
                                // is fulfilled, so the deferred wrapping the
                                // callback can be resolved. For errbacks
                                // returning a promise, this signals that the
                                // parent promise's rejection was repaired, so
                                // rejected.then(..., errback).then(A, B) will
                                // continue on to A if errback's promise is
                                // resolved.
                                _yuitest_coverline("build/deferred/deferred.js", 189);
then.resolve.apply(then, result);
                                _yuitest_coverline("build/deferred/deferred.js", 190);
break;
                            case 'rejected':
                                // For callbacks, promise rejection indicates
                                // something went wrong, so the subsequent
                                // errback (if applicable) should be executed.
                                // For errbacks, promise rejection indicates
                                // either something went wrong while trying to
                                // recover from the parent promise's rejection,
                                // or the errback didn't attempt to recover
                                // from the rejection, so it is appropriate to
                                // continue to the subsequent deferred's
                                // errback.
                                _yuitest_coverline("build/deferred/deferred.js", 202);
then.reject.apply(then, result);
                                _yuitest_coverline("build/deferred/deferred.js", 203);
break;
                        }
                    } else {
                        // Non-promise return values always trigger resolve()
                        // because callback is affirmative, and errback is
                        // recovery.  To continue on the rejection path, errbacks
                        // must return rejected promises.
                        _yuitest_coverline("build/deferred/deferred.js", 210);
then.resolve.apply(then,
                            (isArray(result) ? result : [result]));
                    }
                }, 0);
            };
        }

        _yuitest_coverline("build/deferred/deferred.js", 217);
resolveSubs.push((typeof callback === 'function') ?
            wrap(callback, 'resolve') : Y.bind('resolve', then));

        _yuitest_coverline("build/deferred/deferred.js", 220);
rejectSubs.push((typeof errback === 'function') ?
            wrap(errback, 'reject') : Y.bind('reject', then));

        _yuitest_coverline("build/deferred/deferred.js", 223);
if (this._status === 'resolved') {
            _yuitest_coverline("build/deferred/deferred.js", 224);
this.resolve.apply(this, this._result);
        } else {_yuitest_coverline("build/deferred/deferred.js", 225);
if (this._status === 'rejected') {
            _yuitest_coverline("build/deferred/deferred.js", 226);
this.reject.apply(this, this._result);
        }}

        _yuitest_coverline("build/deferred/deferred.js", 229);
resolveSubs = rejectSubs = null;

        _yuitest_coverline("build/deferred/deferred.js", 231);
return then.promise();
    },

    /**
    Returns the current status of the Deferred as a string "in progress",
    "resolved", or "rejected".

    @method getStatus
    @return {String}
    **/
    getStatus: function () {
        _yuitest_coverfunc("build/deferred/deferred.js", "getStatus", 241);
_yuitest_coverline("build/deferred/deferred.js", 242);
return this._status;
    },

    /**
    Returns the result of the Deferred.  Use `getStatus()` to test that the
    promise is resolved before calling this.

    @method getResult
    @return {Any[]} Array of values passed to `resolve()` or `reject()`
    **/
    getResult: function () {
        _yuitest_coverfunc("build/deferred/deferred.js", "getResult", 252);
_yuitest_coverline("build/deferred/deferred.js", 253);
return this._result;
    },

    /**
    Executes an array of callbacks from a specified context, passing a set of
    arguments.

    @method _notify
    @param {Function[]} subs The array of subscriber callbacks
    @param {Object} context The `this` object for the callbacks
    @param {Any[]} args Any arguments to pass the callbacks
    @protected
    **/
    _notify: function (subs, context, args) {
        _yuitest_coverfunc("build/deferred/deferred.js", "_notify", 266);
_yuitest_coverline("build/deferred/deferred.js", 267);
var i, len;

        _yuitest_coverline("build/deferred/deferred.js", 269);
if (subs) {
            _yuitest_coverline("build/deferred/deferred.js", 270);
for (i = 0, len = subs.length; i < len; ++i) {
                _yuitest_coverline("build/deferred/deferred.js", 271);
subs[i].apply(context, args);
            }
        }
    }

}, true);

_yuitest_coverline("build/deferred/deferred.js", 278);
Y.Deferred = Deferred;

/**
Factory method to create a Deferred that will be resolved or rejected by a
provided _executor_ callback.  The callback is executed asynchronously.

The associated promise is returned.

@for YUI
@method defer
@param {Function} executor The function responsible for resolving or rejecting
                        the Deferred.
@return {Promise}
**/
_yuitest_coverline("build/deferred/deferred.js", 292);
Y.defer = function (executor) {
    _yuitest_coverfunc("build/deferred/deferred.js", "defer", 292);
_yuitest_coverline("build/deferred/deferred.js", 293);
var deferred = new Y.Deferred();

    _yuitest_coverline("build/deferred/deferred.js", 295);
(Y.soon || setTimeout)(function () {
        _yuitest_coverfunc("build/deferred/deferred.js", "(anonymous 4)", 295);
_yuitest_coverline("build/deferred/deferred.js", 296);
if (isFunction(executor)) {
            _yuitest_coverline("build/deferred/deferred.js", 297);
executor(deferred);
        } else {
            _yuitest_coverline("build/deferred/deferred.js", 299);
deferred.resolve(executor);
        }
    }, 0);

    _yuitest_coverline("build/deferred/deferred.js", 303);
return deferred.promise();
};

/**
Abstraction API allowing you to interact with promises or raw values as if they
were promises. If a non-promise object is passed in, a new Deferred is created
and scheduled to resolve asynchronously with the provided value.

In either case, a promise is returned.  If either _callback_ or _errback_ are
provided, the promise returned is the one returned from calling
`promise.then(callback, errback)` on the provided or created promise.  If neither
are provided, the original promise is returned.

@method when
@param {Any} promise Promise object or value to wrap in a resolved promise
@param {Function} [callback] callback to execute if the promise is resolved
@param {Function} [errback] callback to execute if the promise is rejected
@return {Promise}
**/
_yuitest_coverline("build/deferred/deferred.js", 322);
Y.when = function (promise, callback, errback) {
    _yuitest_coverfunc("build/deferred/deferred.js", "when", 322);
_yuitest_coverline("build/deferred/deferred.js", 323);
var value;

    _yuitest_coverline("build/deferred/deferred.js", 325);
if (!isFunction(promise.then)) {
        _yuitest_coverline("build/deferred/deferred.js", 326);
value = promise;

        _yuitest_coverline("build/deferred/deferred.js", 328);
promise = Y.defer(function (deferred) {
            _yuitest_coverfunc("build/deferred/deferred.js", "(anonymous 5)", 328);
_yuitest_coverline("build/deferred/deferred.js", 329);
deferred.resolve(value);
        });
    }

    _yuitest_coverline("build/deferred/deferred.js", 333);
return (callback || errback) ? promise.then(callback, errback) : promise;
};
/**
The public API for a Deferred.  Used to subscribe to the notification events for
resolution or progress of the operation represented by the Deferred.

@class Promise
@constructor
@param {Deferred} deferred The Deferred object that the promise represents
**/
_yuitest_coverline("build/deferred/deferred.js", 343);
function Promise(deferred) {
    _yuitest_coverfunc("build/deferred/deferred.js", "Promise", 343);
_yuitest_coverline("build/deferred/deferred.js", 344);
this._deferred = deferred;
}

/**
Adds a method or array of methods to the Promise prototype to relay to the
so named method on the associated Deferred.

DO NOT use this expose the Deferred's `resolve` or `reject` methods on the
Promise.

@method addMethod
@param {String|String[]} methods String or array of string names of functions
                                 already defined on the Deferred to expose on
                                 the Promise prototype.
@static
**/
_yuitest_coverline("build/deferred/deferred.js", 360);
Promise.addMethod = function(methods) {
    _yuitest_coverfunc("build/deferred/deferred.js", "addMethod", 360);
_yuitest_coverline("build/deferred/deferred.js", 361);
if (!isArray(methods)) {
        _yuitest_coverline("build/deferred/deferred.js", 362);
methods = [methods];
    }

    _yuitest_coverline("build/deferred/deferred.js", 365);
Y.Array.each(methods, function (method) {
        _yuitest_coverfunc("build/deferred/deferred.js", "(anonymous 6)", 365);
_yuitest_coverline("build/deferred/deferred.js", 366);
Promise.prototype[method] = function () {
            _yuitest_coverfunc("build/deferred/deferred.js", "]", 366);
_yuitest_coverline("build/deferred/deferred.js", 367);
return this._deferred[method].apply(this._deferred, arguments);
        };
    });
};

/**
Schedule execution of a callback to either or both of "resolve" and
"reject" resolutions for the associated Deferred.  The callbacks
are wrapped in a new Deferred and that Deferred's corresponding promise
is returned.  This allows operation chaining ala
`functionA().then(functionB).then(functionC)` where `functionA` returns
a promise, and `functionB` and `functionC` _may_ return promises.

@method then
@param {Function} [callback] function to execute if the Deferred
            resolves successfully
@param {Function} [errback] function to execute if the Deferred
            resolves unsuccessfully
@return {Promise} The promise of a new Deferred wrapping the resolution
            of either "resolve" or "reject" callback
**/

/**
Returns this promise.  Meta, or narcissistic?  Useful to test if an object
is a Deferred or Promise when the intention is to call its `then()`,
`getStatus()`, or `getResult()` method.

@method promise
@return {Promise} This.
**/

/**
Returns the current status of the Deferred. Possible results are
"in progress", "resolved", and "rejected".

@method getStatus
@return {String}
**/

/**
Returns the result of the Deferred.  Use `getStatus()` to test that the
promise is resolved before calling this.

@method getResult
@return {Any[]} Array of values passed to `resolve()` or `reject()`
**/
_yuitest_coverline("build/deferred/deferred.js", 413);
Promise.addMethod(['then', 'promise', 'getStatus', 'getResult']);

_yuitest_coverline("build/deferred/deferred.js", 415);
Y.Promise = Promise;


}, '@VERSION@', {"requires": ["oop"]});
