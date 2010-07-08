YUI.add('history-html5', function(Y) {

/**
 * Provides browser history management using the HTML5 history API.
 *
 * @module history
 * @submodule history-html5
 * @class HistoryHTML5
 * @extends HistoryBase
 * @constructor
 * @param {Object} config (optional) Configuration object. See the HistoryBase
 *   documentation for details.
 */

var HistoryBase = Y.HistoryBase;

function HistoryHTML5() {
    HistoryHTML5.superclass.constructor.apply(this, arguments);
}

Y.extend(HistoryHTML5, HistoryBase, {
    // -- Initialization -------------------------------------------------------
    _init: function (config) {
    },

    // -- Protected Methods ----------------------------------------------------
    _storeState: function (src, newState) {
    }
}, {
    // -- Public Static Properties ---------------------------------------------
    NAME: 'historyhtml5'

});

Y.HistoryHTML5 = HistoryHTML5;

// Only point Y.History at HistoryHTML5 if it doesn't already exist and if the
// current browser supports HTML5 history.
if (!Y.History && HistoryBase.html5) {
    Y.History = HistoryHTML5;
}


}, '@VERSION@' ,{requires:['history-base'], supersedes:['history-deprecated']});
