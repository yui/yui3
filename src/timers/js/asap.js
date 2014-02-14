"use strict";

// Use the fastest possible means to execute a task in a future turn
// of the event loop.

// Queue is a circular buffer with good locality of reference and doesn't
// allocate new memory unless there are more than `InitialCapacity` parallel
// tasks in which case it will resize itself generously to x8 more capacity.
// The use case of asap should require no or few amount of resizes during
// runtime.
// Calling a task frees a slot immediately so if the calling
// has a side effect of queuing itself again, it can be sustained
// without additional memory
// Queue specifically uses
// http://en.wikipedia.org/wiki/Circular_buffer#Use_a_Fill_Count
// Because:
// 1. We need fast .length operation, since queue
//   could have changed after every iteration
// 2. Modulus can be negated by using power-of-two
//   capacities and replacing it with bitwise AND
// 3. It will not be used in a multi-threaded situation.

var Queue = require("./queue");

//1024 = InitialCapacity
var queue = new Queue(1024);
var flushing = false;
var requestFlush = void 0;
var hasSetImmediate = typeof setImmediate === "function";
var domain;

// Avoid shims from browserify.
// The existence of `global` in browsers is guaranteed by browserify.
var process = global.process;

// Note that some fake-Node environments,
// like the Mocha test runner, introduce a `process` global.
var isNodeJS = !!process && ({}).toString.call(process) === "[object process]";

function flush() {
    /* jshint loopfunc: true */

    while (queue.length > 0) {
        var task = queue.shift();

        try {
            task.call();

        } catch (e) {
            if (isNodeJS) {
                // In node, uncaught exceptions are considered fatal errors.
                // Re-throw them to interrupt flushing!

                // Ensure continuation if an uncaught exception is suppressed
                // listening process.on("uncaughtException") or domain("error").
                requestFlush();

                throw e;

            } else {
                // In browsers, uncaught exceptions are not fatal.
                // Re-throw them asynchronously to avoid slow-downs.
                setTimeout(function () {
                    throw e;
                }, 0);
            }
        }
    }

    flushing = false;
}

if (isNodeJS) {
    // Node.js
    requestFlush = function () {
        // Ensure flushing is not bound to any domain.
        var currentDomain = process.domain;
        if (currentDomain) {
            domain = domain || (1,require)("domain");
            domain.active = process.domain = null;
        }

        // Avoid tick recursion - use setImmediate if it exists.
        if (flushing && hasSetImmediate) {
            setImmediate(flush);
        } else {
            process.nextTick(flush);
        }

        if (currentDomain) {
            domain.active = process.domain = currentDomain;
        }
    };

} else if (hasSetImmediate) {
    // In IE10, or https://github.com/NobleJS/setImmediate
    requestFlush = function () {
        setImmediate(flush);
    };

} else if (typeof MessageChannel !== "undefined") {
    // modern browsers
    // http://www.nonblocking.io/2011/06/windownexttick.html
    var channel = new MessageChannel();
    // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
    // working message ports the first time a page loads.
    channel.port1.onmessage = function () {
        requestFlush = requestPortFlush;
        channel.port1.onmessage = flush;
        flush();
    };
    var requestPortFlush = function () {
        // Opera requires us to provide a message payload, regardless of
        // whether we use it.
        channel.port2.postMessage(0);
    };
    requestFlush = function () {
        setTimeout(flush, 0);
        requestPortFlush();
    };

} else {
    // old browsers
    requestFlush = function () {
        setTimeout(flush, 0);
    };
}

function asap(task) {
    if (isNodeJS && process.domain) {
        task = process.domain.bind(task);
    }

    queue.push(task);

    if (!flushing) {
        requestFlush();
        flushing = true;
    }
};

module.exports = asap;
