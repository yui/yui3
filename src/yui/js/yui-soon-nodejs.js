/**
 * Provides a process.nextTick wrapper.  This module is a `core` YUI module,
 * <a href="../classes/YUI.html#method_soon">its documentation is located under
 * the YUI class</a>.
 *
 * @module yui
 * @submodule yui-soon-nodejs
 * @author Steven Olmsted
 */

// This module is a simplified version of yui-soon designed for Node.js.  Refer
// to yui-soon for more documentation.
var soon = function (callbackFunction) {
    var canceled;

    soon._asynchronizer(function () {
        if (!canceled) {
            callbackFunction();
        }
    }, 0);

    return {
        cancel: function () {
            canceled = 1;
        }
    };
};

soon._asynchronizer = process.nextTick;
soon._impl = 'nextTick';

Y.soon = soon;