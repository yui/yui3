/**
 * @module history
 * @submodule history-hash
 */

/**
 * @class History
 * @extends HistoryBase
 * @constructor
 */

var Lang      = Y.Lang,
    Obj       = Y.Object,
    GlobalEnv = YUI.namespace('Env.History'),

    config          = Y.config,
    doc             = config.doc,
    docMode         = doc.documentMode,
    hashNotifiers,
    oldHash,
    oldUrl,
    win             = config.win,
    location        = win.location,

    // IE8 supports the hashchange event, but only in IE8 Standards
    // Mode. However, IE8 in IE7 compatibility mode still defines the
    // event but never fires it, so we can't just sniff for the event. We also
    // can't just sniff for IE8, since other browsers have begun to support this
    // event as well.
    nativeHashChange = !Lang.isUndefined(win.onhashchange) &&
            (Lang.isUndefined(docMode) || docMode > 7),

History = function (config) {
    History.superclass.constructor.apply(this, arguments);
};

Y.extend(History, Y.HistoryBase, {
    // -- Initialization -------------------------------------------------------
    _init: function (config) {
        // Use the bookmarked state as the initialState if no initialState was
        // specified.
        config = config || {};
        config.initialState = config.initialState ||
                this.constructor.parseHash();

        // Subscribe to the synthetic hashchange event (defined below) to handle
        // changes.
        Y.after('hashchange', Y.bind(this._afterHashChange, this), win);

        this.constructor.superclass._init.call(this, config);
    },

    // -- Protected Methods ----------------------------------------------------
    _storeState: function (newState, silent) {
        var constructor = this.constructor;

        constructor.superclass._storeState.apply(this, arguments);

        // Update the location hash with the changes, but only if the new hash
        // actually differs from the current hash (this avoids creating multiple
        // history entries for a single state).
        if (constructor.getHash() !== constructor.createHash(newState)) {
            constructor[silent ? 'replaceHash' : 'setHash'](
                    constructor.createHash(newState));
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
        this._resolveChanges(this.constructor.parseHash(e.newHash));
    }
}, {
    // -- Public Static Properties ---------------------------------------------
    NAME: 'history',

    /**
     * Whether or not this browser supports the window.onhashchange event
     * natively. Note that even if this is <code>true</code>, you may still want
     * to use History's synthetic hashchange event since it normalizes
     * implementation differences and fixes spec violations across various
     * browsers.
     *
     * @property nativeHashChange
     * @type Boolean
     * @default false
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
     * @method _decode
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
     * Gets the current location hash, minus the preceding '#' character.
     *
     * @method getHash
     * @return {String} current location hash
     * @static
     */
    getHash: (Y.UA.gecko ? function () {
        // Gecko's window.location.hash returns a decoded string and we want all
        // encoding untouched, so we need to get the hash value from
        // window.location.href instead.
        var matches = /#(.*)$/.exec(location.href);
        return matches && matches[1] ? matches[1] : '';
    } : function () {
        return location.hash.substr(1);
    }),

    /**
     * Parses a location hash string into an object of key/value parameter
     * pairs. If <em>hash</em> is not specified, the current location hash will
     * be used.
     *
     * @method parseHash
     * @param {String} hash (optional) location hash string
     * @return {Object} object of parsed key/value parameter pairs
     * @static
     */
    parseHash: function (hash) {
        hash = hash || History.getHash();

        var decode  = History.decode,
            i,
            matches = hash.match(History._REGEX_HASH) || [],
            len     = matches.length,
            param,
            params  = {};

        for (i = 0; i < len; ++i) {
            param = matches[i].split('=');
            params[decode(param[0])] = decode(param[1]);
        }

        return params;
    },

    /**
     * Replaces the browser's current location hash with the specified hash
     * and removes all forward navigation states, without creating a new browser
     * history entry.
     *
     * @method replaceHash
     * @param {String} hash new location hash
     * @static
     */
    replaceHash: function (hash) {
        Y.log('replaceHash: ' + hash, 'info', 'history-base');
        location.replace(hash.indexOf('#') === 0 ? hash : '#' + hash);
    },

    /**
     * Sets the browser's location hash to the specified string.
     *
     * @method setHash
     * @param {String} hash new location hash
     * @static
     */
    setHash: function (hash) {
        Y.log('setHash: ' + hash, 'info', 'history-base');
        location.hash = hash;
    }
});

// -- Synthetic hashchange Event -----------------------------------------------
hashNotifiers = YUI.namespace('Env.History._hashNotifiers');

// Synthetic hashchange event to normalize hashchange differences across
// browsers, and to provide hashchange for browsers that don't natively support
// it.
// TODO: how to document this?
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
oldUrl  = location.href;

if (nativeHashChange) {
    // Wrap the browser's native hashchange event.
    Y.Event.attach('hashchange', function (e) {
        var newHash = History.getHash(),
            newUrl  = location.href;

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
        if (Y.UA.webkit && !Y.UA.chrome) {
            // Attach a noop unload handler to disable Safari's back/forward
            // cache. This works around a nasty Safari bug when the back button
            // is used to return from a page on another domain, but results in
            // slightly worse performance. This bug is not present in Chrome.
            //
            // Current as of Safari 4.0.5 (6531.22.7).
            // See: https://bugs.webkit.org/show_bug.cgi?id=34679
            Y.on('unload', function () {}, win);
        }

        GlobalEnv._hashPoll = Y.later(config.pollInterval || 50, null, function () {
            var newHash = History.getHash(),
                newUrl;

            if (oldHash !== newHash) {
                newUrl = location.href;

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
