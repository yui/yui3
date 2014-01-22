/**
Provides utilities for timed asynchronous callback execution.
Y.soon is a setImmediate/process.nextTick/setTimeout wrapper.

This module includes [asap.js](https://github.com/kriskowal/asap) for scheduling
asynchronous tasks.

@module timers
@author Steven Olmsted
**/
var module = {},
    global = Y.config.global;

function require(mod) {
    return Queue;
}
