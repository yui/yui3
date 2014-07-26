/**
Provides utilities for timed asynchronous callback execution.
Y.soon is a setImmediate/process.nextTick/setTimeout wrapper.

This module includes [asap.js](https://github.com/kriskowal/asap) for scheduling
asynchronous tasks.

@module timers
@main timers
@author Steven Olmsted
**/

// Hack. asap.js is written as a Node module and expects require, module and
// global to be available in the module's scope.
var module = {},
    global = Y.config.global;

// `asap` only requires a `queue` module that is bundled into this same file.
function require(mod) {
    return Queue;
}
