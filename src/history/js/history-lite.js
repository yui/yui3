/*global YUI */
/*jslint bitwise: true, browser: true, eqeqeq: true, immed: true, newcap: true, nomen: false, onevar: true, plusplus: false, white: false */

YUI.add('state-base', function (Y) {

/**
 * @module state-base
 */

/**
 * @class State
 * @static
 */

// -- Shorthand & Private Vars -------------------------------------------------
var Lang     = Y.Lang,
    Obj      = Y.Object,
    config   = Y.config,
    docMode  = config.doc && config.doc.documentMode,
    win      = config.win,
    encode   = encodeURIComponent,
    lastHash,
    location = win.location,

// IE8 supports the hashchange event, but only in IE8 Standards
// Mode. However, IE8 in IE7 compatibility mode still defines the
// event (but never fires it), so we can't just sniff for the event. We
// also can't just sniff for IE8, since other browsers will eventually
// support this event as well.
supportsHashChange = (typeof win.onhashchange !== 'undefined') &&
        (typeof docMode === 'undefined' || docMode > 7),

/**
 * Fired when the history state changes.
 *
 * @event historyLite:change
 * @param {EventFacade} Event facade with the following additional
 *     properties:
 * <dl>
 *   <dt>changed</dt>
 *   <dd>
 *     name:value pairs of history parameters that have been added or
 *     changed
 *   </dd>
 *   <dt>newVal</dt>
 *   <dd>
 *     name:value pairs of all history parameters after the change
 *   </dd>
 *   <dt>prevVal</dt>
 *   <dd>
 *     name:value pairs of all history parameters before the change
 *   </dd>
 *   <dt>removed</dt>
 *   <dd>
 *     name:value pairs of history parameters that have been removed
 *     (values are the old values)
 *   </dd>
 * </dl>
 */
EVT_CHANGE = 'historyLite:change',

HistoryLite = Y.HistoryLite = {
    // -- Public Properties ----------------------------------------------------

    /**
     * The name of this component.
     *
     * @property NAME
     * @type String
     * @static
     */
    NAME: 'historyLite',

    // -- Protected Properties -------------------------------------------------

    /**
     * Regular expression used to parse hash/query strings.
     *
     * @property _REGEX_QUERY
     * @type RegExp
     * @protected
     * @static
     */
    _REGEX_QUERY: /([^\?#&]+)=([^&]+)/g,

    // -- Public Methods -------------------------------------------------------

    /**
     * Adds a history entry with changes to the specified parameters. Any
     * parameters with a <code>null</code> or <code>undefined</code> value
     * will be removed from the new history entry.
     *
     * @method add
     * @param {String|Object} params query string, hash string, or object
     *     containing name/value parameter pairs
     * @param {Boolean} silent if <em>true</em>, a history change event will not
     *     be fired for this change
     * @static
     */
    add: function (params, silent) {
        var _params = Lang.isString(params) ? this.parseQuery(params) : params,
            newHash = this._createHash(Y.merge(this.parseQuery(this._getHash()), _params));

        if (silent) {
            this._defChangeFn({newVal: newHash});
        }

        this._setHash(newHash);
    },

    /**
     * Gets the current value of the specified history parameter, or an object
     * of name/value pairs for all current values if no parameter name is
     * specified.
     *
     * @method get
     * @param {String} name (optional) parameter name
     * @return {Object|mixed}
     * @static
     */
    get: function (name) {
        var params = this.parseQuery(this._getHash());
        return name ? params[name] : params;
    },

    /**
     * Parses a query string or hash string into an object hash of name/value
     * parameter pairs.
     *
     * @method parseQuery
     * @param {String} query query string or hash string
     * @return {Object}
     * @static
     */
    parseQuery: function (query) {
        // TODO: memoize this function
        var decode  = this._decode,
            i,
            matches = query.match(this._REGEX_QUERY) || [],
            len     = matches.length,
            param,
            params  = {};

        for (i = 0; i < len; ++i) {
            param = matches[i].split('=');
            params[decode(param[0])] = decode(param[1]);
        }

        return params;
    },

    // -- Protected Methods ----------------------------------------------------

    /**
     * Creates a hash string from the specified object hash of name/value
     * parameter pairs.
     *
     * @method _createHash
     * @param {Object} params name/value parameter pairs
     * @return {String} hash string
     * @protected
     * @static
     */
    _createHash: function (params) {
        var hash = [];

        Obj.each(params, function (value, name) {
            if (Lang.isValue(value)) {
                hash.push(encode(name) + '=' + encode(value));
            }
        });

        return '#' + hash.join('&');
    },

    /**
     * Wrapper around <code>decodeURIComponent()</code> that also converts +
     * chars into spaces.
     *
     * @method _decode
     * @param {String} string string to decode
     * @return {String} decoded string
     * @protected
     * @static
     */
    _decode: function (string) {
        return decodeURIComponent(string.replace(/\+/g, ' '));
    },

    /**
     * Gets the current URL hash.
     *
     * @method _getHash
     * @return {String}
     * @protected
     * @static
     */
    _getHash: (Y.UA.gecko ? function () {
        // Gecko's window.location.hash returns a decoded string and we want all
        // encoding untouched, so we need to get the hash value from
        // window.location.href instead.
        var matches = /#.*$/.exec(location.href);
        return matches && matches[0] ? matches[0] : '';
    } : function () {
        return location.hash;
    }),

    /**
     * Sets the browser's location hash to the specified string.
     *
     * @method _setHash
     * @param {String} hash
     * @protected
     * @static
     */
    _setHash: function (hash) {
        location.hash = hash;
    },

    // -- Protected Event Handlers ---------------------------------------------

    /**
     * Handles changes to the location hash and fires the history-lite:change
     * event if necessary.
     *
     * @method _afterHashChange
     * @param {String} newHash new hash value
     * @protected
     * @static
     */
    _afterHashChange: function (newHash) {
        var changedParams = {},
            lastParsed    = this.parseQuery(lastHash),
            newParsed     = this.parseQuery(newHash),
            removedParams = {},

            facade =  {
                newParsed : newParsed,
                prevParsed: lastParsed
            },

            isChanged;

        // Figure out what changed.
        Obj.each(newParsed, function (newVal, param) {
            var prevVal = lastParsed[param];

            if (newVal !== prevVal) {
                changedParams[param] = newVal;
                isChanged = true;

                this.fire(param + 'Change', Y.merge(facade, {
                    newVal : newVal,
                    prevVal: prevVal
                }));
            }
        }, this);

        // Figure out what was removed.
        Obj.each(lastParsed, function (value, param) {
            if (!newParsed.hasOwnProperty(param)) {
                removedParams[param] = value;
                isChanged = true;

                this.fire(param + 'Remove', Y.merge(facade, {
                    prevVal: value
                }));
            }
        }, this);

        if (isChanged) {
            this.fire(EVT_CHANGE, Y.merge(facade, {
                changed: changedParams,
                newVal : newHash,
                prevVal: lastHash,
                removed: removedParams
            }));
        }
    },

    // -- Private Event Handlers -----------------------------------------------

    /**
     * Default handler for the history-lite:change event. Stores the new hash
     * for later comparison and event triggering.
     *
     * @method _defChangeFn
     * @param {EventFacade} e event object for history change events
     * @private
     * @static
     */
    _defChangeFn: function (e) {
        lastHash = e.newVal;
    }
};

// Make HistoryLite an event target and publish the change event.
Y.augment(HistoryLite, Y.EventTarget, true, null, {emitFacade: true});

HistoryLite.publish(EVT_CHANGE, {
    broadcast: 2,
    defaultFn: HistoryLite._defChangeFn
});

// Start watching for hash changes.
lastHash = HistoryLite._getHash();

if (supportsHashChange) {
    Y.Event.attach('hashchange', function () {
        this._afterHashChange(this._getHash());
    }, win, HistoryLite);
} else {
    Y.later(config.pollInterval || 50, HistoryLite, function () {
        var hash = this._getHash();

        if (hash !== lastHash) {
            this._afterHashChange(hash);
        }
    }, null, true);
}

}, '@VERSION', {
    requires: ['event-base', 'event-custom', 'event-custom-complex']
});
