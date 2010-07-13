YUI.add('history-html5', function(Y) {

/**
 * Provides browser history management using the HTML5 history API.
 *
 * @module history
 * @submodule history-html5
 * @since 3.2.0
 */

/**
 * <p>
 * Provides browser history management using the HTML5 history API.
 * </p>
 *
 * <p>
 * When calling the <code>add()</code>, <code>addValue()</code>,
 * <code>replace()</code>, or <code>replaceValue()</code> methods on
 * <code>HistoryHTML5</code>, the following additional options are supported:
 * </p>
 *
 * <dl>
 *   <dt><strong>title (String)</strong></dt>
 *   <dd>
 *     Title to use for the new history entry. Browsers will typically display
 *     this title to the user in the detailed history window or in a dropdown
 *     menu attached to the back/forward buttons. If not specified, the title
 *     of the current document will be used.
 *   </dd>
 *
 *   <dt><strong>url (String)</strong></dt>
 *   <dd>
 *     URL to display to the user for the new history entry. This URL will be
 *     visible in the browser's address bar and will be the bookmarked URL if
 *     the user bookmarks the page. It may be a relative path ("foo/bar"), an
 *     absolute path ("/foo/bar"), or a full URL ("http://example.com/foo/bar").
 *     If you specify a full URL, the origin <i>must</i> be the same as the 
 *     origin of the current page, or an error will occur. If no URL is
 *     specified, the current URL will not be changed.
 *   </dd>
 * </dl>
 *
 * @class HistoryHTML5
 * @extends HistoryBase
 * @constructor
 * @param {Object} config (optional) Configuration object. See the HistoryBase
 *   documentation for details.
 */

var HistoryBase = Y.HistoryBase,
    doc         = Y.config.doc,
    win         = Y.config.win,

    SRC_POPSTATE = 'popstate',
    SRC_REPLACE  = HistoryBase.SRC_REPLACE;

function HistoryHTML5() {
    HistoryHTML5.superclass.constructor.apply(this, arguments);
}

Y.extend(HistoryHTML5, HistoryBase, {
    // -- Initialization -------------------------------------------------------
    _init: function () {
        Y.on('popstate', this._onPopState, win, this);
        HistoryHTML5.superclass._init.apply(this, arguments);
    },

    // -- Protected Methods ----------------------------------------------------

    /**
     * Overrides HistoryBase's <code>_storeState()</code> and pushes or replaces
     * a history entry using the HTML5 history API when necessary.
     *
     * @method _storeState
     * @param {String} src Source of the changes.
     * @param {Object} newState New state to store.
     * @param {Object} options Zero or more options.
     * @protected
     */
    _storeState: function (src, newState, options) {
        if (src !== SRC_POPSTATE) {
            win.history[src === SRC_REPLACE ? 'replaceState' : 'pushState'](
                newState, options.title || doc.title || '', options.url || null
            );
        }

        HistoryHTML5.superclass._storeState.apply(this, arguments);
    },

    // -- Protected Event Handlers ---------------------------------------------

    /**
     * Handler for popstate events.
     *
     * @method _onPopState
     * @param {Event} e
     * @protected
     */
    _onPopState: function (e) {
        this._resolveChanges(SRC_POPSTATE, e._event.state || {});
    }
}, {
    // -- Public Static Properties ---------------------------------------------
    NAME: 'historyhtml5',

    /**
     * Constant used to identify state changes originating from
     * <code>popstate</code> events.
     *
     * @property SRC_POPSTATE
     * @type String
     * @static
     * @final
     */
    SRC_POPSTATE: SRC_POPSTATE
});

if (!Y.Node.DOM_EVENTS.popstate) {
    Y.Node.DOM_EVENTS.popstate = 1;
}

Y.HistoryHTML5 = HistoryHTML5;

// Only point Y.History at HistoryHTML5 if it doesn't already exist and if the
// current browser supports HTML5 history.
if (!Y.History && HistoryBase.html5) {
    Y.History = HistoryHTML5;
}


}, '@VERSION@' ,{requires:['event-base', 'history-base', 'node-base']});
