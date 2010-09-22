YUI.add('autocomplete-base', function(Y) {

/**
 * Provides automatic input completion or suggestions for text input fields and
 * textareas.
 *
 * @module autocomplete
 * @since 3.3.0
 */

/**
 * <code>Y.Base</code> extension that provides core autocomplete logic (but no
 * UI implementation) for a text input field or textarea. Must be mixed into a
 * <code>Y.Base</code>-derived class to be useful.
 *
 * @module autocomplete
 * @submodule autocomplete-base
 */

/**
 * <p>
 * Extension that provides core autocomplete logic (but no UI implementation)
 * for a text input field or textarea.
 * </p>
 *
 * <p>
 * The <code>AutoCompleteBase</code> class provides events and attributes that
 * abstract away core autocomplete logic and configuration, but does not provide
 * a widget implementation or suggestion UI. For a prepackaged autocomplete
 * widget, see <code>AutoCompleteList</code>.
 * </p>
 *
 * <p>
 * This extension cannot be instantiated directly, since it doesn't provide an
 * actual implementation. It's intended to be mixed into a
 * <code>Base</code>-based class or widget, as illustrated in the following
 * example:
 * </p>
 *
 * <pre>
 * YUI().use('autocomplete-base', 'base', function (Y) {
 * &nbsp;&nbsp;var MyAutoComplete = Y.Base.create('myAutocomplete', Y.Base, [Y.AutoComplete], {
 * &nbsp;&nbsp;&nbsp;&nbsp;initializer: function () {
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.bindInput();
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.syncInput();
 * &nbsp;&nbsp;&nbsp;&nbsp;},
 * &nbsp;
 * &nbsp;&nbsp;&nbsp;&nbsp;destructor: function () {
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.unbindInput();
 * &nbsp;&nbsp;&nbsp;&nbsp;}
 * &nbsp;&nbsp;});
 * &nbsp;
 * &nbsp;&nbsp;// ... custom implementation code ...
 * });
 * </pre>
 *
 * @class AutoCompleteBase
 */

var Lang   = Y.Lang,
    YArray = Y.Array,

    isArray    = Lang.isArray,
    isFunction = Lang.isFunction,
    isNumber   = Lang.isNumber,
    trim       = Lang.trim,

    ALLOW_BROWSER_AC   = 'allowBrowserAutocomplete',
    DATA_SOURCE        = 'dataSource',
    INPUT_NODE         = 'inputNode',
    MIN_QUERY_LENGTH   = 'minQueryLength',
    QUERY              = 'query',
    QUERY_DELAY        = 'queryDelay',
    QUERY_DELIMITER    = 'queryDelimiter',
    REQUEST_TEMPLATE   = 'requestTemplate',
    RESULT_FILTERS     = 'resultFilters',
    RESULT_FORMATTER   = 'resultFormatter',
    RESULT_HIGHLIGHTER = 'resultHighlighter',
    RESULT_LOCATOR     = 'resultLocator',
    RESULTS            = 'results',
    VALUE              = 'value',
    VALUE_CHANGE       = 'valueChange',

    EVT_CLEAR   = 'clear',
    EVT_QUERY   = QUERY,
    EVT_RESULTS = RESULTS;

function AutoCompleteBase() {
    /**
     * Fires after the query has been completely cleared or no longer meets the
     * minimum query length requirement.
     *
     * @event clear
     * @param {EventFacade} e Event facade with the following additional
     *   properties:
     *
     * <dl>
     *   <dt>prevVal (String)</dt>
     *   <dd>
     *     Value of the query before it was cleared.
     *   </dd>
     * </dl>
     *
     * @preventable _defClearFn
     */
    this.publish(EVT_CLEAR, {
        defaultFn: this._defClearFn,
        queueable: true
    });

    /**
     * Fires when the contents of the input field have changed and the input
     * value meets the criteria necessary to generate an autocomplete query.
     *
     * @event query
     * @param {EventFacade} e Event facade with the following additional
     *   properties:
     *
     * <dl>
     *   <dt>inputValue (String)</dt>
     *   <dd>
     *     Full contents of the text input field or textarea that generated
     *     the query.
     *   </dd>
     *
     *   <dt>query (String)</dt>
     *   <dd>
     *     Autocomplete query. This is the string that will be used to
     *     request completion results. It may or may not be the same as
     *     <code>inputValue</code>.
     *   </dd>
     * </dl>
     *
     * @preventable _defQueryFn
     */
    this.publish(EVT_QUERY, {
        defaultFn: this._defQueryFn,
        queueable: true
    });

    /**
     * Fires after query results are received from the DataSource. If no
     * DataSource has been set, this event will not fire.
     *
     * @event results
     * @param {EventFacade} e Event facade with the following additional
     *   properties:
     *
     * <dl>
     *   <dt>data (Array|Object)</dt>
     *   <dd>
     *     Raw, unfiltered result data (if available).
     *   </dd>
     *
     *   <dt>query (String)</dt>
     *   <dd>
     *     Query that generated these results.
     *   </dd>
     *
     *   <dt>results (Array)</dt>
     *   <dd>
     *     Array of filtered, formatted, and highlighted results. Each item in
     *     the array is an object with the following properties:
     *
     *     <dl>
     *       <dt>display (Node|HTMLElement|String)</dt>
     *       <dd>
     *         Formatted result HTML suitable for display to the user.
     *       </dd>
     *
     *       <dt>raw (mixed)</dt>
     *       <dd>
     *         Raw, unformatted result in whatever form it was provided by the
     *         DataSource.
     *       </dd>
     *
     *       <dt>text (String)</dt>
     *       <dd>
     *         Plain text version of the result, suitable for being inserted
     *         into the value of a text input field or textarea when the result
     *         is selected by a user.
     *       </dd>
     *     </dl>
     *   </dd>
     * </dl>
     *
     * @preventable _defResultsFn
     */
    this.publish(EVT_RESULTS, {
        defaultFn: this._defResultsFn,
        queueable: true
    });
}

// -- Public Static Properties -------------------------------------------------
AutoCompleteBase.ATTRS = {
    /**
     * Whether or not to enable the browser's built-in autocomplete
     * functionality for input fields.
     *
     * @attribute allowBrowserAutocomplete
     * @type Boolean
     * @default false
     * @writeonce
     */
    allowBrowserAutocomplete: {
        value: false,
        writeOnce: 'initOnly'
    },

    /**
     * <p>
     * DataSource object which will be used to make queries. This can be
     * an actual DataSource instance or any other object with a
     * sendRequest() method that has the same signature as DataSource's
     * sendRequest() method.
     * </p>
     *
     * <p>
     * As an alternative to providing a DataSource, you could listen for
     * <code>query</code> events and handle them any way you see fit.
     * Providing a DataSource or DataSource-like object is optional, but
     * will often be simpler.
     * </p>
     *
     * @attribute dataSource
     * @type DataSource|Object|null
     */
    dataSource: {
        validator: function (value) {
            return (value && isFunction(value.sendRequest)) || value === null;
        }
    },

    /**
     * Node to monitor for changes, which will generate <code>query</code>
     * events when appropriate. May be either an input field or a textarea.
     *
     * @attribute inputNode
     * @type Node|HTMLElement|String
     * @writeonce
     */
    inputNode: {
        setter: Y.one,
        writeOnce: 'initOnly'
    },

    /**
     * Minimum number of characters that must be entered before a
     * <code>query</code> event will be fired. A value of <code>0</code>
     * allows empty queries; a negative value will effectively disable all
     * <code>query</code> events.
     *
     * @attribute minQueryLength
     * @type Number
     * @default 1
     */
    minQueryLength: {
        validator: isNumber,
        value: 1
    },

    /**
     * <p>
     * Current query, or <code>null</code> if there is no current query.
     * </p>
     *
     * <p>
     * The query might not be the same as the current value of the input
     * node, both for timing reasons (due to <code>queryDelay</code>) and
     * because when one or more <code>queryDelimiter</code> separators are
     * in use, only the last portion of the delimited input string will be
     * used as the query value.
     * </p>
     *
     * @attribute query
     * @type String|null
     * @default null
     * @readonly
     */
    query: {
        readOnly: true,
        value: null
    },

    /**
     * <p>
     * Number of milliseconds to delay after input before triggering a
     * <code>query</code> event. If new input occurs before this delay is
     * over, the previous input event will be ignored and a new delay will
     * begin.
     * </p>
     *
     * <p>
     * This can be useful both to throttle queries to a remote data source
     * and to avoid distracting the user by showing them less relevant
     * results before they've paused their typing.
     * </p>
     *
     * @attribute queryDelay
     * @type Number
     * @default 150
     */
    queryDelay: {
        validator: function (value) {
            return isNumber(value) && value >= 0;
        },

        value: 150
    },

    /**
     * Query delimiter string. When a delimiter is configured, the input value
     * will be split on the delimiter, and only the portion that contains the
     * cursor will be used in autocomplete queries and updated when the
     * <code>query</code> attribute is modified.
     *
     * @attribute queryDelimiter
     * @type String|null
     * @default null
     */
    queryDelimiter: {
        value: null
    },

    /**
     * <p>
     * DataSource request template. This can be a function that accepts a
     * query as a parameter and returns a request string, or it can be a
     * string containing the placeholder "{query}", which will be replaced
     * with the actual URI-encoded query.
     * </p>
     *
     * <p>
     * When using a string template, if it's necessary for the literal
     * string "{query}" to appear in the request, escape it with a slash:
     * "\{query}".
     * </p>
     *
     * <p>
     * While <code>requestTemplate</code> may be set to either a function or
     * a string, it will always be returned as a function that accepts a
     * query argument and returns a string.
     * </p>
     *
     * @attribute requestTemplate
     * @type Function|String
     * @default encodeURIComponent
     */
    requestTemplate: {
        setter: function (template) {
            if (isFunction(template)) {
                return template;
            }

            template = template.toString();

            return function (query) {
                // Replace {query} with the URI-encoded query, but turn
                // \{query} into the literal string "{query}" to allow that
                // string to appear in the request if necessary.
                return template.
                    replace(/(^|[^\\])((\\{2})*)\{query\}/, '$1$2' + encodeURIComponent(query)).
                    replace(/(^|[^\\])((\\{2})*)\\(\{query\})/, '$1$2$4');
            };
        },

        value: encodeURIComponent
    },

    /**
     * <p>
     * Array of local result filter functions. If provided, each filter
     * will be called with two arguments when results are received: the query
     * and an array of results (as returned by the <code>resultLocator</code>,
     * if one is set).
     * </p>
     *
     * <p>
     * Each filter is expected to return a filtered or modified version of the
     * results, which will then be passed on to subsequent filters, then the
     * <code>resultHighlighter</code> function (if set), then the
     * <code>resultFormatter</code> function (if set), and finally to
     * subscribers to the <code>results</code> event.
     * </p>
     *
     * <p>
     * If no DataSource is set, result filters will not be called.
     * </p>
     *
     * @attribute resultFilters
     * @type Array
     * @default []
     */
    resultFilters: {
        validator: isArray,
        value: []
    },

    /**
     * <p>
     * Function which will be used to format results. If provided, this function
     * will be called with four arguments after results have been received and
     * filtered: the query, an array of raw results, an array of highlighted
     * results, and an array of plain text results. The formatter is expected to
     * return a modified copy of the results array with any desired custom
     * formatting applied.
     * </p>
     *
     * <p>
     * If no DataSource is set, the formatter will not be called.
     * </p>
     *
     * @attribute resultFormatter
     * @type Function|null
     */
    resultFormatter: {
        validator: '_functionValidator'
    },

    /**
     * <p>
     * Function which will be used to highlight results. If provided, this
     * function will be called with two arguments after results have been
     * received and filtered: the query and an array of filtered results. The
     * highlighter is expected to return a modified version of the results
     * array with the query highlighted in some form.
     * </p>
     *
     * <p>
     * If no DataSource is set, the highlighter will not be called.
     * </p>
     *
     * @attribute resultHighlighter
     * @type Function|null
     */
    resultHighlighter: {
        validator: '_functionValidator'
    },

    /**
     * <p>
     * Locator that should be used to extract a plain text string from a
     * non-string result item. This value will be fed to any defined filters,
     * and will typically also be the value that ends up being inserted into a
     * text input field or textarea when the user of an autocomplete widget
     * implementation selects a result.
     * </p>
     *
     * <p>
     * By default, no locator is applied, and all results are assumed to be
     * plain text strings. If all results are already plain text strings, you
     * don't need to define a locator.
     * </p>
     *
     * <p>
     * The locator may be either a function (which will receive the raw result
     * as an argument and must return a string) or a string representing an
     * object path, such as "foo.bar.baz" (which would return the value of
     * <code>result.foo.bar.baz</code> if the result is an object).
     * </p>
     *
     * <p>
     * While <code>resultLocator</code> may be set to either a function or a
     * string, it will always be returned as a function that accepts a result
     * argument and returns a string.
     * </p>
     *
     * @attribute resultLocator
     * @type Function|String|null
     */
    resultLocator: {
        setter: function (locator) {
            if (locator === null || isFunction(locator)) {
                return locator;
            }

            locator = locator.toString().split('.');

            return function (result) {
                return Y.Object.getValue(result, locator);
            };
        }
    },

    /**
     * Current results, or an empty array if there are no results.
     *
     * @attribute results
     * @type Array
     * @default []
     * @readonly
     */
    results: {
        readOnly: true,
        value: []
    },

    /**
     * Current value of the input node.
     *
     * @attribute value
     * @type String
     * @default ''
     */
    value: {
        // Why duplicate this._inputNode.get('value')? Because we need a
        // reliable way to track the source of value changes. We want to perform
        // completion when the user changes the value, but not when we change
        // the value.
        value: ''
    }
};

AutoCompleteBase.CSS_PREFIX = 'ac';
AutoCompleteBase.UI_SRC = (Y.Widget && Y.Widget.UI_SRC) || 'ui';

AutoCompleteBase.prototype = {
    // -- Public Lifecycle Methods ---------------------------------------------

    /**
     * Attaches <code>inputNode</code> event listeners.
     *
     * @method bindInput
     */
    bindInput: function () {
        var inputNode = this.get(INPUT_NODE);

        if (!inputNode) {
            Y.error('No inputNode specified.');
        }

        // Unbind first, just in case.
        this.unbindInput();

        this._inputEvents = [
            // This is the valueChange event on the inputNode provided by the
            // event-valuechange module, not our own valueChange.
            inputNode.on(VALUE_CHANGE, this._onInputValueChange, this),

            // And here's our own valueChange event.
            this.after(VALUE_CHANGE, this._afterValueChange, this)
        ];
    },

    /**
     * Synchronizes the UI state of the <code>inputNode</code>.
     *
     * @method syncInput
     */
    syncInput: function () {
        var inputNode = this.get(INPUT_NODE);

        if (inputNode.get('nodeName').toLowerCase() === 'input') {
            inputNode.setAttribute('autocomplete', this.get(ALLOW_BROWSER_AC) ? 'on' : 'off');
        }

        this.set(VALUE, inputNode.get(VALUE));
    },

    /**
     * Detaches <code>inputNode</code> event listeners.
     *
     * @method unbindInput
     */
    unbindInput: function () {
        while (this._inputEvents && this._inputEvents.length) {
            this._inputEvents.pop().detach();
        }
    },

    // -- Protected Prototype Methods ------------------------------------------

    /**
     * Returns <code>true</code> if <i>value</i> is either a function or
     * <code>null</code>.
     *
     * @method _functionValidator
     * @param {Function|null} value Value to validate.
     * @protected
     */
    _functionValidator: function (value) {
        return isFunction(value) || value === null;
    },

    /**
     * Parses result responses, performs filtering and highlighting, and fires
     * the <code>results</code> event.
     *
     * @method _parseResponse
     * @param {String} query Query that generated these results.
     * @param {Object} response Response containing results.
     * @param {Object} data Raw response data.
     * @protected
     */
    _parseResponse: function (query, response, data) {
        var facade = {
                data   : data,
                query  : query,
                results: []
            },

            // Filtered result arrays representing different formats. These will
            // be unrolled into the final array of result objects as properties.
            formatted,   // HTML, Nodes, whatever
            raw,         // whatever format came back in the response
            unformatted, // plain text (ideally)

            // Unfiltered raw results, fresh from the response.
            unfiltered = response && response.results,

            // Final array of result objects.
            results = [],

            // Other stuff.
            filters,
            formatter,
            highlighter,
            i,
            len,
            locator,
            locatorMap;

        if (unfiltered) {
            filters     = this.get(RESULT_FILTERS);
            formatter   = this.get(RESULT_FORMATTER);
            highlighter = this.get(RESULT_HIGHLIGHTER);
            locator     = this.get(RESULT_LOCATOR);

            if (locator) {
                // In order to allow filtering based on locator queries, we have
                // to create a mapping of "located" results to original results
                // so we can sync up the original results later without
                // requiring the filters to do extra work.
                raw        = YArray.map(unfiltered, locator);
                locatorMap = YArray.hash(raw, unfiltered);
            } else {
                raw = unfiltered;
            }

            // Run the raw results through all configured result filters.
            for (i = 0, len = filters.length; i < len; ++i) {
                raw = filters[i](query, raw);

                if (!raw || !raw.length) {
                    break;
                }
            }

            if (locator) {
                // Sync up the original results with the filtered, "located"
                // results.
                unformatted = raw;
                raw = [];

                for (i = 0, len = unformatted.length; i < len; ++i) {
                    raw.push(locatorMap[unformatted[i]]);
                }
            } else {
                unformatted = [].concat(raw); // copy
            }

            // Run the unformatted results through the configured highlighter
            // (if any) to produce the first stage of formatted results.
            formatted = highlighter ? highlighter(query, unformatted) :
                    [].concat(unformatted);

            // Run the highlighted results through the configured formatter (if
            // any) to produce the final formatted results.
            if (formatter) {
                formatted = formatter(query, raw, formatted, unformatted);
            }

            // Finally, unroll all the result arrays into a single array of
            // result objects.
            for (i = 0, len = formatted.length; i < len; ++i) {
                results.push({
                    display: formatted[i],
                    raw    : raw[i],
                    text   : unformatted[i]
                });
            }

            facade.results = results;
        }

        this.fire(EVT_RESULTS, facade);
    },

    /**
     * <p>
     * Returns the query portion of the specified input value, or
     * <code>null</code> if there is no suitable query within the input value.
     * </p>
     *
     * <p>
     * If a query delimiter is defined, the query will be the delimited part of
     * the input value that's closest to the cursor.
     * </p>
     *
     * @method _parseValue
     * @param {String} value Input value from which to extract the query.
     * @return {String|null} query
     * @protected
     */
    _parseValue: function (value) {
        var delim = this.get(QUERY_DELIMITER);

        if (delim) {
            value = value.split(delim);
            value = value[value.length - 1];
        }

        return this._trimLeft(value);
    },

    /**
     * Utility function to trim whitespace from the left side of a string.
     *
     * @method _trimLeft
     * @param {String} string String to trim.
     * @return {String} Trimmed string.
     * @protected
     */
    _trimLeft: String.prototype.trimLeft ? function (string) {
        // Micro-optimization, since trimming occurs often in value parsing. The
        // native method is faster than the regex in all browsers except Chrome,
        // but it's not worth doing a Chrome-specific fork.
        // http://jsperf.com/native-trimleft-vs-regex
        return string.trimLeft();
    } : function (string) {
        return string.replace(/^\s+/, '');
    },

    /**
     * <p>
     * Updates the query portion of the <code>value</code> attribute.
     * </p>
     *
     * <p>
     * If a query delimiter is defined, the delimited portion of the input value
     * closest to the cursor will be replaced with the specified <i>value</i>.
     * </p>
     *
     * @method _updateValue
     * @param {String} newVal New value.
     * @protected
     */
    _updateValue: function (newVal) {
        var delim = this.get(QUERY_DELIMITER),
            insertDelim,
            len,
            prevVal;

        newVal = this._trimLeft(newVal);

        if (delim) {
            insertDelim = trim(delim); // so we don't double up on spaces
            prevVal     = YArray.map(trim(this.get(VALUE)).split(delim), trim);
            len         = prevVal.length;

            if (len > 1) {
                prevVal[len - 1] = newVal;
                newVal = prevVal.join(insertDelim + ' ');
            }

            newVal = newVal + insertDelim + ' ';
        }

        this.set(VALUE, newVal);
    },

    // -- Protected Event Handlers ---------------------------------------------

    /**
     * Handles change events for the <code>value</code> attribute.
     *
     * @method _afterValueChange
     * @param {EventFacade} e
     * @protected
     */
    _afterValueChange: function (e) {
        var delay,
            fire,
            newVal = e.newVal,
            query,
            that;

        // Don't query on value changes that didn't come from the user.
        if (e.src !== AutoCompleteBase.UI_SRC) {
            this._inputNode.set(VALUE, newVal);
            return;
        }

        Y.log('valueChange: new: "' + newVal + '"; old: "' + e.prevVal + '"', 'info', 'autocomplete-base');

        query = this._parseValue(newVal);

        if (query && query.length >= this.get(MIN_QUERY_LENGTH)) {
            delay = this.get(QUERY_DELAY);
            that  = this;

            fire = function () {
                that.fire(EVT_QUERY, {
                    inputValue: newVal,
                    query     : query
                });
            };

            if (delay) {
                clearTimeout(this._delay);
                this._delay = setTimeout(fire, delay);
            } else {
                fire();
            }
        } else {
            clearTimeout(this._delay);
            this.fire(EVT_CLEAR);
        }
    },

    /**
     * Handles DataSource responses and fires the <code>results</code> event.
     *
     * @method _onResponse
     * @param {EventFacade} e
     * @protected
     */
    _onResponse: function (e) {
        var query = e && e.callback && e.callback.query;

        // Ignore stale responses that aren't for the current query.
        if (query && query === this.get(QUERY)) {
            this._parseResponse(query, e.response, e.data);
        }
    },

    /**
     * Handles <code>valueChange</code> events on the input node and fires a
     * <code>query</code> event when the input value meets the configured
     * criteria.
     *
     * @method _onValueChange
     * @param {EventFacade} e
     * @protected
     */
    _onInputValueChange: function (e) {
        var newVal = e.newVal;

        // Don't query if the internal value is the same as the new value
        // reported by valueChange.
        if (newVal === this.get(VALUE)) {
            return;
        }

        this.set(VALUE, newVal, {src: AutoCompleteBase.UI_SRC});
    },

    // -- Protected Default Event Handlers -------------------------------------

    /**
     * Default <code>clear</code> event handler. Sets the <code>results</code>
     * property to an empty array and <code>query</code> to null.
     *
     * @method _defClearFn
     * @protected
     */
    _defClearFn: function () {
        this._set(QUERY, null);
        this._set(RESULTS, []);
    },

    /**
     * Default <code>query</code> event handler. Sets the <code>query</code>
     * property and sends a request to the DataSource if one is configured.
     *
     * @method _defQueryFn
     * @param {EventFacade} e
     * @protected
     */
    _defQueryFn: function (e) {
        var dataSource = this.get(DATA_SOURCE),
            query      = e.query;

        this._set(QUERY, query);

        Y.log('query: "' + query + '"; inputValue: "' + e.inputValue + '"', 'info', 'autocomplete-base');

        if (query && dataSource) {
            Y.log('sendRequest: ' + this.get(REQUEST_TEMPLATE)(query), 'info', 'autocomplete-base');

            dataSource.sendRequest({
                request: this.get(REQUEST_TEMPLATE)(query),
                callback: {
                    query  : query,
                    success: Y.bind(this._onResponse, this)
                }
            });
        }
    },

    /**
     * Default <code>results</code> event handler. Sets the <code>results</code>
     * and <code>resultsRaw</code> properties to the latest results.
     *
     * @method _defResultsFn
     * @param {EventFacade} e
     * @protected
     */
    _defResultsFn: function (e) {
        Y.log('results: ' + Y.dump(e.results), 'info', 'autocomplete-base');
        this._set(RESULTS, e[RESULTS]);
    }
};

Y.AutoCompleteBase = AutoCompleteBase;


}, '@VERSION@' ,{requires:['array-extras', 'event-valuechange', 'node-base']});
