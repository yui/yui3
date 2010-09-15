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

    isFunction = Lang.isFunction,
    isNumber   = Lang.isNumber,

    ALLOW_BROWSER_AC   = 'allowBrowserAutocomplete',
    DATA_SOURCE        = 'dataSource',
    INPUT_NODE         = 'inputNode',
    MIN_QUERY_LENGTH   = 'minQueryLength',
    QUERY              = 'query',
    QUERY_DELAY        = 'queryDelay',
    REQUEST_TEMPLATE   = 'requestTemplate',
    RESULT_FILTERS     = 'resultFilters',
    RESULT_FORMATTER   = 'resultFormatter',
    RESULT_HIGHLIGHTER = 'resultHighlighter',
    RESULT_LOCATOR     = 'resultLocator',
    RESULTS            = 'results',
    VALUE_CHANGE       = 'valueChange',

    EVT_CLEAR        = 'clear',
    EVT_QUERY        = QUERY,
    EVT_RESULTS      = RESULTS,
    EVT_VALUE_CHANGE = VALUE_CHANGE;

function AutoCompleteBase() {
    /**
     * Fires after the contents of the input field have been completely cleared.
     *
     * @event clear
     * @param {EventFacade} e Event facade with the following additional
     *   properties:
     *
     * <dl>
     *   <dt>prevVal (String)</dt>
     *   <dd>
     *     Value of the input node before it was cleared.
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

    /**
     * Fires after the input node's value changes, and before the
     * <code>query</code> event.
     *
     * @event valueChange
     * @param {EventFacade} e Event facade with the following additional
     *   properties:
     *
     * <dl>
     *   <dt>newVal (String)</dt>
     *   <dd>
     *     Value of the input node after the change.
     *   </dd>
     *
     *   <dt>prevVal (String)</dt>
     *   <dd>
     *     Value of the input node prior to the change.
     *   </dd>
     * </dl>
     */
    this.publish(EVT_VALUE_CHANGE, {
        preventable: false,
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
        validator: Lang.isArray,
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
    }
};

// Because nobody wants to type ".yui3-autocomplete-blah" a hundred times.
AutoCompleteBase.CSS_PREFIX = 'ac';

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
            // We're listening to the valueChange event from the
            // event-valuechange module here, not our own valueChange event
            // (which just wraps this one for convenience).
            inputNode.on(VALUE_CHANGE, this._onValueChange, this)
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
     * In <code>autocomplete-base</code> this just returns the input value
     * itself, but it can be overridden to implement more complex logic, such as
     * adding support for query delimiters (see the
     * <code>autocomplete-delim</code> module).
     * </p>
     *
     * @method _parseValue
     * @param {String} value input value from which to extract the query
     * @return {String|null} query
     * @protected
     */
    _parseValue: function (value) {
        return value;
    },

    // -- Protected Event Handlers ---------------------------------------------

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
    _onValueChange: function (e) {
        var delay,
            fire,
            value = e.newVal,
            query = this._parseValue(value),
            that;

        Y.log('valueChange: new: "' + value + '"; old: "' + e.prevVal + '"', 'info', 'autocomplete-base');

        this.fire(EVT_VALUE_CHANGE, {
            newVal : value,
            prevVal: e.prevVal
        });

        if (query.length >= this.get(MIN_QUERY_LENGTH)) {
            delay = this.get(QUERY_DELAY);
            that  = this;

            fire = function () {
                that.fire(EVT_QUERY, {
                    inputValue: value,
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

            // Empty query.
            this.fire(EVT_QUERY, {
                inputValue: value,
                query     : null
            });
        }

        if (!value.length) {
            this.fire(EVT_CLEAR, {
                prevVal: e.prevVal
            });
        }
    },

    // -- Protected Default Event Handlers -------------------------------------

    /**
     * Default <code>clear</code> event handler. Sets the <code>results</code>
     * property to an empty array.
     *
     * @method _defClearFn
     * @protected
     */
    _defClearFn: function () {
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
YUI.add('autocomplete-list', function(Y) {

/**
 * Traditional autocomplete dropdown list widget, just like Mom used to make.
 *
 * @module autocomplete
 * @submodule autocomplete-list
 * @class AutoCompleteList
 * @extends Widget
 * @uses AutoCompleteBase
 * @uses WidgetPosition
 * @uses WidgetPositionAlign
 * @uses WidgetStack
 * @constructor
 * @param {Object} config Configuration object.
 */

var Node   = Y.Node,
    YArray = Y.Array,

    // keyCode constants.
    KEY_DOWN  = 40,
    KEY_ENTER = 13,
    KEY_ESC   = 27,
    KEY_TAB   = 9,
    KEY_UP    = 38,

    // String shorthand.
    _CLASS_ITEM        = '_CLASS_ITEM',
    _CLASS_ITEM_ACTIVE = '_CLASS_ITEM_ACTIVE',
    _CLASS_ITEM_HOVER  = '_CLASS_ITEM_HOVER',
    _SELECTOR_ITEM     = '_SELECTOR_ITEM',

    ACTIVE_ITEM  = 'activeItem',
    CIRCULAR     = 'circular',
    HOVERED_ITEM = 'hoveredItem',
    INPUT_NODE   = 'inputNode',
    ITEM         = 'item',
    VISIBLE      = 'visible',
    WIDTH        = 'width',

    // Event names.
    EVT_SELECT = 'select',

List = Y.Base.create('autocompleteList', Y.Widget, [
    Y.AutoCompleteBase,
    Y.WidgetPosition,
    Y.WidgetPositionAlign,
    Y.WidgetStack
], {
    // -- Prototype Properties -------------------------------------------------
    CONTENT_TEMPLATE: '<ul/>',
    ITEM_TEMPLATE: '<li/>',

    // -- Lifecycle Prototype Methods ------------------------------------------
    initializer: function () {
        /**
         * Fires when an autocomplete suggestion is selected from the list by
         * a keyboard action or mouse click.
         *
         * @event select
         * @param {EventFacade} e Event facade with the following additional
         *   properties:
         *
         * <dl>
         *   <dt>result (Object)</dt>
         *   <dd>
         *     AutoComplete result object.
         *   </dd>
         * </dl>
         *
         * @preventable _defResultsFn
         */
        this.publish(EVT_SELECT, {
            defaultFn: this._defSelectFn
        });

        this._events    = [];
        this._inputNode = this.get(INPUT_NODE);

        // Cache commonly used classnames and selectors for performance.
        this[_CLASS_ITEM]        = this.getClassName(ITEM);
        this[_CLASS_ITEM_ACTIVE] = this.getClassName(ITEM, 'active');
        this[_CLASS_ITEM_HOVER]  = this.getClassName(ITEM, 'hover');
        this[_SELECTOR_ITEM]     = '.' + this[_CLASS_ITEM];

        if (!this._inputNode) {
            Y.error('No inputNode specified.');
        }

        if (!this.get('align.node')) {
            this.set('align.node', this._inputNode);
        }

        if (!this.get(WIDTH)) {
            this.set(WIDTH, this._inputNode.get('offsetWidth'));
        }
    },

    destructor: function () {
        this.unbindInput();

        while (this._events.length) {
            this._events.pop().detach();
        }
    },

    bindUI: function () {
        this._bindInput();
        this._bindList();
    },

    renderUI: function () {
        // See http://www.w3.org/WAI/PF/aria/roles#combobox for ARIA details.
        this._contentBox = this.get('contentBox').set('role', 'listbox');

        this._inputNode.addClass(this.getClassName('input')).setAttrs({
            'aria-autocomplete': 'list',
            'aria-owns': this._contentBox.get('id'),
            role: 'combobox'
        });
    },

    syncUI: function () {
        this.syncInput();
        this._syncResults();
        this._syncVisibility();
    },

    // -- Public Prototype Methods ---------------------------------------------

    /**
     * Hides the list.
     *
     * @method hide
     * @see show
     * @chainable
     */
    hide: function () {
        return this.set(VISIBLE, false);
    },

    /**
     * Selects the specified <i>itemNode</i>, or the current
     * <code>activeItem</code> if <i>itemNode</i> is not specified.
     *
     * @method selectItem
     * @param {Node} itemNode (optional) Item node to select.
     * @chainable
     */
    selectItem: function (itemNode) {
        if (itemNode) {
            if (!itemNode.hasClass(this[_CLASS_ITEM])) {
                return;
            }
        } else {
            itemNode = this.get(ACTIVE_ITEM);

            if (!itemNode) {
                return;
            }
        }

        this.fire(EVT_SELECT, {
            result: itemNode.getData('result')
        });

        return this;
    },

    /**
     * Shows the list.
     *
     * @method show
     * @see hide
     * @chainable
     */
    show: function () {
        return this.set(VISIBLE, true);
    },

    // -- Protected Prototype Methods ------------------------------------------

    /**
     * Activates the next item after the currently active item. If there is no
     * next item and the <code>circular</code> attribute is <code>true</code>,
     * the first item in the list will be activated.
     *
     * @method _activateNextItem
     * @protected
     */
    _activateNextItem: function () {
        var item     = this.get(ACTIVE_ITEM),
            selector = this[_SELECTOR_ITEM],
            nextItem;

        if (item) {
            // Get the next item. If there isn't a next item, circle back around
            // and get the first item.
            nextItem = item.next(selector) ||
                    (this.get(CIRCULAR) && item.get('parentNode').one(selector));

            if (nextItem) {
                this._set(ACTIVE_ITEM, nextItem);
            }
        }

        return this;
    },

    /**
     * Activates the item previous to the currently active item. If there is no
     * previous item and the <code>circular</code> attribute is
     * <code>true</code>, the last item in the list will be activated.
     *
     * @method _activatePrevItem
     * @protected
     */
    _activatePrevItem: function () {
        var item     = this.get(ACTIVE_ITEM),
            selector = this[_SELECTOR_ITEM],
            prevItem;

        if (item) {
            // Get the previous item. If there isn't a previous item, circle
            // back around and get the last item.
            prevItem = item.previous(selector) ||
                    (this.get(CIRCULAR) && item.get('parentNode').one(selector + ':last-child'));

            if (prevItem) {
                this._set(ACTIVE_ITEM, prevItem);
            }
        }

        return this;
    },

    /**
     * Appends the specified result <i>items</i> to the list inside a new item
     * node.
     *
     * @method _add
     * @param {Array|Node|HTMLElement|String} items Result item or array of
     *   result items.
     * @returns {NodeList} Added nodes.
     * @protected
     */
    _add: function (items) {
        var itemNodes = [];

        YArray.each(Y.Lang.isArray(items) ? items : [items], function (item) {
            itemNodes.push(this._createItemNode(item.display).setData('result', item));
        }, this);

        itemNodes = Y.all(itemNodes);
        this._contentBox.append(itemNodes.toFrag());

        return itemNodes;
    },

    /**
     * Binds <code>inputNode</code> events, in addition to those already bound
     * by <code>AutoCompleteBase</code>'s public <code>bindInput()</code>
     * method.
     *
     * @method _bindInput
     * @protected
     */
    _bindInput: function () {
        var inputNode = this._inputNode;

        // Call AutoCompleteBase's bind method first.
        this.bindInput();

        this._events.concat([
            inputNode.on('blur', this._onInputBlur, this),
            inputNode.on(Y.UA.gecko ? 'keypress' : 'keydown', this._onInputKey, this)
        ]);
    },

    /**
     * Binds list events.
     *
     * @method _bindList
     * @protected
     */
    _bindList: function () {
        this._events.concat([
            this.after('mouseover', this._afterMouseOver, this),
            this.after('mouseout', this._afterMouseOut, this),

            this.after('activeItemChange', this._afterActiveItemChange, this),
            this.after('hoveredItemChange', this._afterHoveredItemChange, this),
            this.after('resultsChange', this._afterResultsChange, this),
            this.after('visibleChange', this._afterVisibleChange, this),

            this._contentBox.delegate('click', this._onItemClick, this[_SELECTOR_ITEM], this)
        ]);
    },

    /**
     * Clears the contents of the tray.
     *
     * @method _clear
     * @protected
     */
    _clear: function () {
        this._set(ACTIVE_ITEM, null);
        this._set(HOVERED_ITEM, null);

        this._contentBox.get('children').remove(true);
    },

    /**
     * Creates an item node with the specified <i>content</i>.
     *
     * @method _createItemNode
     * @param {Node|HTMLElement|String} content
     * @protected
     * @returns {Node} Item node.
     */
    _createItemNode: function (content) {
        var itemNode = Node.create(this.ITEM_TEMPLATE);

        return itemNode.append(content).setAttrs({
            id  : Y.stamp(itemNode),
            role: 'option'
        }).addClass(this[_CLASS_ITEM]);
    },

    /**
     * Synchronizes the results displayed in the list with those in the
     * <i>results</i> argument, or with the <code>results</code> attribute if an
     * argument is not provided.
     *
     * @method _syncResults
     * @param {Array} results (optional) Results.
     * @protected
     */
    _syncResults: function (results) {
        var items;

        if (!results) {
            results = this.get('results');
        }

        this._clear();

        if (results.length) {
            items = this._add(results);
            this._set(ACTIVE_ITEM, items.item(0));
        }
    },

    /**
     * Synchronizes the visibility of the tray with the <i>visible</i> argument,
     * or with the <code>visible</code> attribute if an argument is not
     * provided.
     *
     * @method _syncVisibility
     * @param {Boolean} visible (optional) Visibility.
     * @protected
     */
    _syncVisibility: function (visible) {
        if (visible === undefined) {
            visible = this.get(VISIBLE);
        }

        this._contentBox.set('aria-hidden', !visible);

        if (!visible) {
            this._set(ACTIVE_ITEM, null);
            this._set(HOVERED_ITEM, null);
        }
    },

    // -- Protected Event Handlers ---------------------------------------------

    /**
     * Handles <code>activeItemChange</code> events.
     *
     * @method _afterActiveItemChange
     * @param {EventTarget} e
     * @protected
     */
    _afterActiveItemChange: function (e) {
        if (e.prevVal) {
            e.prevVal.removeClass(this[_CLASS_ITEM_ACTIVE]);
        }

        if (e.newVal) {
            e.newVal.addClass(this[_CLASS_ITEM_ACTIVE]);
        }
    },

    /**
     * Handles <code>hoveredItemChange</code> events.
     *
     * @method _afterHoveredItemChange
     * @param {EventTarget} e
     * @protected
     */
    _afterHoveredItemChange: function (e) {
        if (e.prevVal) {
            e.prevVal.removeClass(this[_CLASS_ITEM_HOVER]);
        }

        if (e.newVal) {
            e.newVal.addClass(this[_CLASS_ITEM_HOVER]);
        }
    },

    /**
     * Handles <code>mouseover</code> events.
     *
     * @method _afterMouseOver
     * @param {EventTarget} e
     * @protected
     */
    _afterMouseOver: function (e) {
        var itemNode = e.domEvent.target.ancestor('.' + this[_CLASS_ITEM], true);

        this._mouseOverList = true;

        if (itemNode) {
            this._set(HOVERED_ITEM, itemNode);
        }
    },

    /**
     * Handles <code>mouseout</code> events.
     *
     * @method _afterMouseOut
     * @param {EventTarget} e
     * @protected
     */
    _afterMouseOut: function () {
        this._mouseOverList = false;
        this._set(HOVERED_ITEM, null);
    },

    /**
     * Handles <code>resultsChange</code> events.
     *
     * @method _afterResultsChange
     * @param {EventFacade} e
     * @protected
     */
    _afterResultsChange: function (e) {
        this._syncResults(e.newVal);
        this.set(VISIBLE, !!e.newVal.length);
    },

    /**
     * Handles <code>visibleChange</code> events.
     *
     * @method _afterVisibleChange
     * @param {EventFacade} e
     * @protected
     */
    _afterVisibleChange: function (e) {
        this._syncVisibility(!!e.newVal);
    },

    /**
     * Handles <code>inputNode</code> <code>blur</code> events.
     *
     * @method _onInputBlur
     * @param {EventTarget} e
     * @protected
     */
    _onInputBlur: function (e) {
        // Hide the list on inputNode blur events, unless the mouse is currently
        // over the list (which indicates that the user is probably interacting
        // with it) or the tab key was pressed.
        if (this._mouseOverList && this._lastInputKey !== KEY_TAB) {
            this._inputNode.focus();
        } else {
            this.hide();
        }
    },

    /**
     * Handles <code>inputNode</code> key events.
     *
     * @method _onInputKey
     * @param {EventTarget} e
     * @protected
     */
    _onInputKey: function (e) {
        var keyCode = e.keyCode;

        this._lastInputKey = keyCode;

        if (this.get(VISIBLE)) {
            switch (keyCode) {
            case KEY_DOWN:
                this._activateNextItem();
                break;

            case KEY_ENTER:
                this.selectItem();
                break;

            case KEY_ESC:
                this.hide();
                break;

            // case KEY_TAB:
            //     break;

            case KEY_UP:
                this._activatePrevItem();
                break;

            default:
                return;
            }

            e.preventDefault();
        }
    },

    /**
     * Delegated event handler for item <code>click</code> events.
     *
     * @method _onItemClick
     * @param {EventTarget} e
     * @protected
     */
    _onItemClick: function (e) {
        e.preventDefault();
        this.selectItem(e.currentTarget);
    },

    // -- Protected Default Event Handlers -------------------------------------

    /**
     * Default <code>select</code> event handler.
     *
     * @method _defSelectFn
     * @param {EventTarget} e
     * @protected
     */
    _defSelectFn: function (e) {
        // TODO: support query delimiters, typeahead completion, etc.
        this.hide();
        this._inputNode.set('value', e.result.text).focus();
    }
}, {
    ATTRS: {
        /**
         * Item that's currently active, if any. When the user presses enter,
         * this is the item that will be selected.
         *
         * @attribute activeItem
         * @type Node
         * @readonly
         */
        activeItem: {
            readOnly: true,
            value: null
        },

        // The "align" attribute is documented in WidgetPositionAlign.
        align: {
            value: {
                points: ['tl', 'bl']
            }
        },

        /**
         * If <code>true</code>, keyboard navigation will wrap around to the
         * opposite end of the list when navigating past the first or last item.
         *
         * @attribute circular
         * @type Boolean
         * @default true
         */
        circular: {
            value: true
        },

        /**
         * Item currently being hovered over by the mouse, if any.
         *
         * @attribute hoveredItem
         * @type Node|null
         * @readonly
         */
        hoveredItem: {
            readOnly: true,
            value: null
        },

        // The "visible" attribute is documented in Widget.
        visible: {
            value: false
        }
    },

    CSS_PREFIX: Y.ClassNameManager.getClassName('aclist')
});

Y.AutoCompleteList = List;

/**
 * Alias for <a href="AutoCompleteList.html"><code>AutoCompleteList</code></a>.
 * See that class for API docs.
 *
 * @class AutoComplete
 */

Y.AutoComplete = List;


}, '@VERSION@' ,{requires:['autocomplete-base', 'widget', 'widget-position', 'widget-position-align', 'widget-stack'], skinnable:true});


YUI.add('autocomplete', function(Y){}, '@VERSION@' ,{use:['autocomplete-base', 'autocomplete-list']});

