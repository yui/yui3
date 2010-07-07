/**
 * The history-hash module adds the History class, which provides browser
 * history management functionality backed by <code>window.location.hash</code>.
 * This allows the browser's back and forward buttons to be used to navigate
 * between states.
 *
 * @module history
 * @submodule history-hash
 */

/**
 * The History class provides browser history management backed by
 * <code>window.location.hash</code>, as well as convenience methods for working
 * with the location hash and a synthetic <code>hashchange</code> event that
 * normalizes differences across browsers.
 *
 * @class History
 * @extends HistoryBase
 * @constructor
 * @param {Object} config (optional) Configuration object. See the HistoryBase
 *   documentation for details.
 */

var HistoryBase    = Y.HistoryBase,
    Lang           = Y.Lang,
    Obj            = Y.Object,
    GlobalEnv      = YUI.namespace('Env.History'),

    SRC_HASH       = 'hash',

    config         = Y.config,
    doc            = config.doc,
    docMode        = doc.documentMode,
    hashNotifiers,
    oldHash,
    oldUrl,
    win            = config.win,
    location       = win.location,

    // IE8 supports the hashchange event, but only in IE8 Standards
    // Mode. However, IE8 in IE7 compatibility mode still defines the
    // event but never fires it, so we can't just sniff for the event. We also
    // can't just sniff for IE8, since other browsers have begun to support this
    // event as well.
    nativeHashChange = !Lang.isUndefined(win.onhashchange) &&
            (Lang.isUndefined(docMode) || docMode > 7),

History = function () {
    History.superclass.constructor.apply(this, arguments);
};

Y.extend(History, HistoryBase, {
    // -- Initialization -------------------------------------------------------
    _init: function (config) {
        // Use the bookmarked state as the initialState if no initialState was
        // specified.
        config = config || {};
        config.initialState = config.initialState || History.parseHash();

        // Subscribe to the synthetic hashchange event (defined below) to handle
        // changes.
        Y.after('hashchange', Y.bind(this._afterHashChange, this), win);

        History.superclass._init.call(this, config);
    },

    // -- Protected Methods ----------------------------------------------------
    _storeState: function (src, newState) {
        var newHash = History.createHash(newState);

        History.superclass._storeState.apply(this, arguments);

        // Update the location hash with the changes, but only if the new hash
        // actually differs from the current hash (this avoids creating multiple
        // history entries for a single state).
        if (History.getHash() !== newHash) {
            History[src === HistoryBase.SRC_REPLACE ? 'replaceHash' : 'setHash'](newHash);
        }
    },

    // -- Protected Event Handlers ---------------------------------------------

    /**
     * Handler for hashchange events.
     *
     * @method _afterHashChange
     * @protected
     */
    _afterHashChange: function (e) {
        this._resolveChanges(SRC_HASH, History.parseHash(e.newHash));
    }
}, {
    // -- Public Static Properties ---------------------------------------------
    NAME: 'history',

    /**
     * Constant used to identify state changes originating from
     * <code>hashchange</code> events.
     *
     * @property SRC_HASH
     * @type String
     * @static
     * @final
     */
    SRC_HASH: SRC_HASH,

    /**
     * <p>
     * Prefix to prepend when setting the hash fragment. For example, if the
     * prefix is <code>!</code> and the hash fragment is set to
     * <code>#foo=bar&baz=quux</code>, the final hash fragment in the URL will
     * become <code>#!foo=bar&baz=quux</code>. This can be used to help make an
     * Ajax application crawlable in accordance with Google's guidelines at
     * <a href="http://code.google.com/web/ajaxcrawling/">http://code.google.com/web/ajaxcrawling/</a>.
     * </p>
     *
     * <p>
     * Note that this prefix applies to all History instances. It's not possible
     * for individual instances to use their own prefixes since they all operate
     * on the same URL.
     * </p>
     *
     * @property hashPrefix
     * @type String
     * @default ''
     * @static
     */
    hashPrefix: '',

    /**
     * Whether or not this browser supports the <code>window.onhashchange</code>
     * event natively. Note that even if this is <code>true</code>, you may
     * still want to use History's synthetic <code>hashchange</code> event since
     * it normalizes implementation differences and fixes spec violations across
     * various browsers.
     *
     * @property nativeHashChange
     * @type Boolean
     * @static
     */
    nativeHashChange: nativeHashChange,

    // -- Protected Static Properties ------------------------------------------

    /**
     * Regular expression used to parse location hash/query strings.
     *
     * @property _REGEX_HASH
     * @type RegExp
     * @protected
     * @static
     * @final
     */
    _REGEX_HASH: /([^\?#&]+)=([^&]+)/g,

    // -- Public Static Methods ------------------------------------------------

    /**
     * Creates a location hash string from the specified object of key/value
     * pairs.
     *
     * @method createHash
     * @param {Object} params object of key/value parameter pairs
     * @return {String} location hash string
     * @static
     */
    createHash: function (params) {
        var encode = History.encode,
            hash   = [];

        Obj.each(params, function (value, key) {
            if (Lang.isValue(value)) {
                hash.push(encode(key) + '=' + encode(value));
            }
        });

        return hash.join('&');
    },

    /**
     * Wrapper around <code>decodeURIComponent()</code> that also converts +
     * chars into spaces.
     *
     * @method decode
     * @param {String} string string to decode
     * @return {String} decoded string
     * @static
     */
    decode: function (string) {
        return decodeURIComponent(string.replace(/\+/g, ' '));
    },

    /**
     * Wrapper around <code>encodeURIComponent()</code> that converts spaces to
     * + chars.
     *
     * @method encode
     * @param {String} string string to encode
     * @return {String} encoded string
     * @static
     */
    encode: function (string) {
        return encodeURIComponent(string).replace(/%20/g, '+');
    },

    /**
     * Gets the raw (not decoded) current location hash, minus the preceding '#'
     * character and the hashPrefix (if one is set).
     *
     * @method getHash
     * @return {String} current location hash
     * @static
     */
    getHash: (Y.UA.gecko ? function () {
        // Gecko's window.location.hash returns a decoded string and we want all
        // encoding untouched, so we need to get the hash value from
        // window.location.href instead. We have to use UA sniffing rather than
        // feature detection, since the only way to detect this would be to
        // actually change the hash.
        var matches = /#(.*)$/.exec(location.href),
            hash    = matches && matches[1] || '',
            prefix  = History.hashPrefix;

        return prefix && hash.indexOf(prefix) === 0 ?
                    hash.replace(prefix, '') : hash;
    } : function () {
        var hash   = location.hash.substr(1),
            prefix = History.hashPrefix;

        // Slight code duplication here, but execution speed is of the essence
        // since getHash() is called every 20ms or so to poll for changes in
        // browsers that don't support native onhashchange. An additional
        // function call would add unnecessary overhead.
        return prefix && hash.indexOf(prefix) === 0 ?
                    hash.replace(prefix, '') : hash;
    }),

    /**
     * Gets the current bookmarkable URL.
     *
     * @method getUrl
     * @return {String} current bookmarkable URL
     * @static
     */
    getUrl: function () {
        return location.href;
    },

    /**
     * Parses a location hash string into an object of key/value parameter
     * pairs. If <i>hash</i> is not specified, the current location hash will
     * be used.
     *
     * @method parseHash
     * @param {String} hash (optional) location hash string
     * @return {Object} object of parsed key/value parameter pairs
     * @static
     */
    parseHash: function (hash) {
        var decode = History.decode,
            i,
            len,
            matches,
            param,
            params = {},
            prefix = History.hashPrefix,
            prefixIndex;

        hash = Lang.isValue(hash) ? hash : History.getHash();

        if (prefix) {
            prefixIndex = hash.indexOf(prefix);

            if (prefixIndex === 0 || (prefixIndex === 1 && hash.charAt(0) === '#')) {
                hash = hash.replace(prefix, '');
            }
        }

        matches = hash.match(History._REGEX_HASH) || [];

        for (i = 0, len = matches.length; i < len; ++i) {
            param = matches[i].split('=');
            params[decode(param[0])] = decode(param[1]);
        }

        return params;
    },

    /**
     * Replaces the browser's current location hash with the specified hash
     * and removes all forward navigation states, without creating a new browser
     * history entry. Automatically prepends the <code>hashPrefix</code> if one
     * is set.
     *
     * @method replaceHash
     * @param {String} hash new location hash
     * @static
     */
    replaceHash: function (hash) {
        if (hash.charAt(0) === '#') {
            hash = hash.substr(1);
        }

        location.replace('#' + (History.hashPrefix || '') + hash);
    },

    /**
     * Sets the browser's location hash to the specified string. Automatically
     * prepends the <code>hashPrefix</code> if one is set.
     *
     * @method setHash
     * @param {String} hash new location hash
     * @static
     */
    setHash: function (hash) {
        if (hash.charAt(0) === '#') {
            hash = hash.substr(1);
        }

        location.hash = (History.hashPrefix || '') + hash;
    }
});

// -- Synthetic hashchange Event -----------------------------------------------
hashNotifiers = YUI.namespace('Env.History._hashNotifiers');

// TODO: YUIDoc currently doesn't provide a good way to document synthetic DOM
// events. For now, we're just documenting the hashchange event on the YUI
// object, which is about the best we can do until enhancements are made to
// YUIDoc.

/**
 * <p>
 * Synthetic <code>window.onhashchange</code> event that normalizes differences
 * across browsers and provides support for browsers that don't natively support
 * <code>onhashchange</code>.
 * </p>
 *
 * <p>
 * This event is provided by the <code>history-hash</code> module.
 * </p>
 *
 * <p>
 * <strong>Usage example:</strong>
 * </p>
 *
 * <code><pre>
 * YUI().use('history-hash', function (Y) {
 * &nbsp;&nbsp;Y.on('hashchange', function (e) {
 * &nbsp;&nbsp;&nbsp;&nbsp;// Handle hashchange events on the current window.
 * &nbsp;&nbsp;}, Y.config.win);
 * });
 * </pre></code>
 *
 * @event hashchange
 * @param {EventFacade} e Event facade with the following additional
 *   properties:
 *
 * <dl>
 *   <dt>oldHash</dt>
 *   <dd>
 *     Previous hash fragment value before the change.
 *   </dd>
 *
 *   <dt>oldUrl</dt>
 *   <dd>
 *     Previous URL (including the hash fragment) before the change.
 *   </dd>
 *
 *   <dt>newHash</dt>
 *   <dd>
 *     New hash fragment value after the change.
 *   </dd>
 *
 *   <dt>newUrl</dt>
 *   <dd>
 *     New URL (including the hash fragment) after the change.
 *   </dd>
 * </dl>
 * @for YUI
 */
Y.Event.define('hashchange', {
    on: function (node, subscriber, notifier) {
        // Ignore this subscriber if the node is anything other than the
        // window or document body, since those are the only elements that
        // should support the hashchange event. Note that the body could also be
        // a frameset, but that's okay since framesets support hashchange too.
        if ((node.compareTo(win) || node.compareTo(doc.body)) &&
                !Obj.owns(hashNotifiers, notifier.key)) {

            hashNotifiers[notifier.key] = notifier;
        }
    },

    detach: function (node, subscriber, notifier) {
        // TODO: Is it safe to use hasSubs()? It's not marked private/protected,
        // but also not documented. Also, subscriber counts don't seem to be
        // updated after detach().
        if (!notifier.hasSubs()) {
            delete hashNotifiers[notifier.key];
        }
    }
});

oldHash = History.getHash();
oldUrl  = History.getUrl();

if (nativeHashChange) {
    // Wrap the browser's native hashchange event.
    Y.Event.attach('hashchange', function (e) {
        var newHash = History.getHash(),
            newUrl  = History.getUrl();

        Obj.each(hashNotifiers, function (notifier) {
            // TODO: would there be any benefit to making this an overridable
            // protected method?
            notifier.fire({
                oldHash: oldHash,
                oldUrl : oldUrl,
                newHash: newHash,
                newUrl : newUrl
            });
        });

        oldHash = newHash;
        oldUrl  = newUrl;
    }, win);
} else {
    // Begin polling for location hash changes if there's not already a global
    // poll running.
    if (!GlobalEnv._hashPoll) {
        if (Y.UA.webkit && !Y.UA.chrome &&
                navigator.vendor.indexOf('Apple') !== -1) {
            // Attach a noop unload handler to disable Safari's back/forward
            // cache. This works around a nasty Safari bug when the back button
            // is used to return from a page on another domain, but results in
            // slightly worse performance. This bug is not present in Chrome.
            //
            // Unfortunately a UA sniff is unavoidable here, but the
            // consequences of a false positive are minor.
            //
            // Current as of Safari 5.0 (6533.16).
            // See: https://bugs.webkit.org/show_bug.cgi?id=34679
            Y.on('unload', function () {}, win);
        }

        GlobalEnv._hashPoll = Y.later(config.pollInterval || 50, null, function () {
            var newHash = History.getHash(),
                newUrl;

            if (oldHash !== newHash) {
                newUrl = History.getUrl();

                Obj.each(hashNotifiers, function (notifier) {
                    notifier.fire({
                        oldHash: oldHash,
                        oldUrl : oldUrl,
                        newHash: newHash,
                        newUrl : newUrl
                    });
                });

                oldHash = newHash;
                oldUrl  = newUrl;
            }
        }, null, true);
    }
}

Y.History = History;
