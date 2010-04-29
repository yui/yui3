YUI.add('history-hash-ie', function(Y) {

/**
 * The history-hash-ie module improves IE6/7 support in history-hash by using a
 * hidden iframe to create entries in IE's browser history. This module is only
 * needed if IE6/7 support is necessary; it's not needed for any other browser.
 *
 * @module history
 * @submodule history-hash-ie
 */

var Do        = Y.Do,
    GlobalEnv = YUI.namespace('Env.History'),
    History   = Y.History,
    iframe    = GlobalEnv._iframe,
    win       = Y.config.win,
    location  = win.location;

if (Y.UA.ie && Y.UA.ie < 8) {
    History.getHash = function () {
        return iframe ? iframe.contentWindow.location.hash.substr(1) : '';
    };

    History.getUrl = function () {
        var hash = History.getHash();

        if (hash && hash !== location.hash.substr(1)) {
            return location.href.replace(/#.*$/, '') + '#' + hash;
        } else {
            return location.href;
        }
    };

    /**
     * Updates the history iframe with the specified hash.
     *
     * @method _updateIframe
     * @param {String} hash location hash
     * @param {Boolean} replace (optional) if <code>true</code>, the current
     *   history state will be replaced without adding a new history entry
     * @protected
     * @static
     * @for History
     */
    History._updateIframe = function (hash, replace) {
        var iframeDoc      = iframe.contentWindow.document,
            iframeLocation = iframeDoc.location;

        Y.log('updating history iframe: ' + hash, 'info', 'history');

        iframeDoc.open().close();

        if (replace) {
            iframeLocation.replace(hash.charAt(0) === '#' ? hash : '#' + hash);
        } else {
            iframeLocation.hash = hash;
        }
    };

    Do.after(History._updateIframe, History, 'replaceHash', History, true);
    Do.after(History._updateIframe, History, 'setHash');

    if (!iframe) {
        // Create an iframe to store history state.
        Y.log('creating dynamic history iframe', 'info', 'history');

        iframe = GlobalEnv._iframe = Y.Node.getDOMNode(Y.Node.create(
            '<iframe src="javascript:0" style="display:none"/>'
        ));

        // Don't add the iframe to the DOM until the DOM is ready, lest we
        // frighten IE.
        Y.on('domready', function () {
            // The iframe is appended to the documentElement rather than the
            // body. Keeping it outside the body prevents scrolling on the
            // initial page load (hat tip to Ben Alman and jQuery BBQ for this
            // technique).
            Y.config.doc.documentElement.appendChild(iframe);

            // Update the iframe with the initial location hash, if any. This
            // will create an initial history entry that the user can return to
            // after the state has changed.
            History._updateIframe(location.hash.substr(1));
        });

        // Listen for hashchange events and keep the parent window's location
        // hash in sync with the hash stored in the iframe.
        Y.on('hashchange', function (e) {
            if (location.hash.substr(1) !== e.newHash) {
                Y.log('updating parent location hash to match iframe location hash', 'info', 'history');
                location.hash = e.newHash;
            }
        }, win);
    }
}


}, '@VERSION@' ,{requires:['history-base', 'history-hash', 'node-base']});
