YUI.add('autocomplete-base', function(Y) {

/**
 * <p>
 * Extension that provides core autocomplete logic for a text input field or
 * textarea.
 * </p>
 *
 * @module autocomplete
 * @submodule autocomplete-base
 */

/**
 * <p>
 * Extension that provides core autocomplete logic for a text input field or
 * textarea.
 * </p>
 *
 * <p>
 * This extension cannot be instantiated directly, since it doesn't provide an
 * actual implementation. It provides the core logic used by the
 * <code>AutoComplete</code> class, and you can mix it into a custom class as
 * follows if you'd like to create a customized autocomplete implementation:
 * </p>
 *
 * <pre>
 * YUI().use('autocomplete-base', 'base', function (Y) {
 * &nbsp;&nbsp;var MyAutoComplete = Y.Base.create('myAutocomplete', Y.Base, [Y.AutoComplete], {
 * &nbsp;&nbsp;&nbsp;&nbsp;initializer: function () {
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this._bindInput();
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this._syncInput();
 * &nbsp;&nbsp;&nbsp;&nbsp;},
 * &nbsp;
 * &nbsp;&nbsp;&nbsp;&nbsp;destructor: function () {
 * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this._unbindInput();
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

    ALLOW_BROWSER_AC      = 'allowBrowserAutocomplete',
    DATA_SOURCE           = 'dataSource',
    INPUT_NODE            = 'inputNode',
    MIN_QUERY_LENGTH      = 'minQueryLength',
    QUERY                 = 'query',
    QUERY_DELAY           = 'queryDelay',
    REQUEST_TEMPLATE      = 'requestTemplate',
    RESULT_FILTERS        = 'resultFilters',
    RESULT_FILTER_LOCATOR = 'resultFilterLocator',
    RESULT_HIGHLIGHTER    = 'resultHighlighter',
    RESULT_FORMATTER      = 'resultFormatter',
    RESULTS               = 'results',
    RESULTS_RAW           = 'resultsRaw',
    VALUE_CHANGE          = 'valueChange',

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
     *   <dt>results (Array|Object)</dt>
     *   <dd>
     *     Normalized and filtered result data returned from the DataSource.
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
     * Filter locator that should be used to extract a filterable string from a
     * non-string result item, so that <code>resultFilters</code> (which assume
     * that results are string) can be used to filter non-string results.
     * </p>
     *
     * <p>
     * By default, no filter locator is applied, and all results are assumed to
     * be strings.
     * </p>
     *
     * <p>
     * The locator may be either a function (which will receive the raw result
     * as an argument and must return a string) or a string representing an
     * object path, such as "foo.bar.baz" (which would return the value of
     * <code>result.foo.bar.baz</code>).
     * </p>
     *
     * <p>
     * While <code>resultFilterLocator</code> may be set to either a function or
     * a string, it will always be returned as a function that accepts a result
     * argument and returns a string.
     * </p>
     *
     * @attribute resultFilterLocator
     * @type Function|String|null
     */
    resultFilterLocator: {
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
     * <p>
     * Array of local result filter functions. If provided, each filter
     * will be called with two arguments when results are received: the
     * query and an array of results received from the DataSource. Each filter
     * is expected to return a filtered or modified version of those results,
     * which will then be passed on to subsequent filters, then the
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
     * will be called with two arguments after results have been received,
     * filtered, and highlighted: the query and an array of filtered
     * results. The formatter is expected to return a modified version of the
     * results array with any desired custom formatting applied.
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
     * Current formatted results, or an empty array if there are no results.
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
     * Current raw (unformatted) results, or an empty array if there are no
     * results.
     *
     * @attribute resultsRaw
     * @type Array
     * @default []
     * @readonly
     */
    resultsRaw: {
        readOnly: true,
        value: []
    }
};

// Because nobody wants to type ".yui3-autocomplete-blah" a hundred times.
AutoCompleteBase.CSS_PREFIX = 'ac';

AutoCompleteBase.prototype = {
    // -- Protected Prototype Methods ------------------------------------------

    /**
     * Attaches <code>inputNode</code> event listeners.
     *
     * @method _bindInput
     * @protected
     */
    _bindInput: function () {
        var inputNode = this.get(INPUT_NODE);

        if (!inputNode) {
            Y.error('No inputNode specified.');
        }

        // Unbind first, just in case.
        this._unbindInput();

        this._inputEvents = [
            // We're listening to the valueChange event from the
            // event-valuechange module here, not our own valueChange event
            // (which just wraps this one for convenience).
            inputNode.on(VALUE_CHANGE, this._onValueChange, this)
        ];
    },

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

    /**
     * Synchronizes the state of the <code>inputNode</code>.
     *
     * @method _syncInput
     * @protected
     */
    _syncInput: function () {
        var inputNode = this.get(INPUT_NODE);

        if (inputNode.get('nodeName').toLowerCase() === 'input') {
            inputNode.setAttribute('autocomplete', this.get(ALLOW_BROWSER_AC) ? 'on' : 'off');
        }
    },

    /**
     * Detaches <code>inputNode</code> event listeners.
     *
     * @method _unbindInput
     * @protected
     */
    _unbindInput: function () {
        while (this._inputEvents && this._inputEvents.length) {
            this._inputEvents.pop().detach();
        }
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
        var facade,
            filters,
            formatter,
            highlighter,
            i,
            len,
            locator,
            locatorMap,
            query = e && e.callback && e.callback.query,
            results,
            resultsRaw,
            unfiltered;

        // Ignore stale responses that aren't for the current query.
        if (!query || query !== this.get(QUERY)) {
            return;
        }

        facade = {
            data      : e.data,
            query     : query,
            results   : [],
            resultsRaw: []
        };

        unfiltered = e.response && e.response.results;

        if (unfiltered) {
            filters     = this.get(RESULT_FILTERS);
            formatter   = this.get(RESULT_FORMATTER);
            highlighter = this.get(RESULT_HIGHLIGHTER);
            locator     = this.get(RESULT_FILTER_LOCATOR);

            if (locator) {
                // In order to allow filtering based on locator queries, we have
                // to create a mapping of "located" results to original results
                // so we can sync up the original results later without
                // requiring the filters to do extra work.
                resultsRaw = YArray.map(unfiltered, locator);
                locatorMap = YArray.hash(resultsRaw, unfiltered);
            } else {
                resultsRaw = unfiltered;
            }

            for (i = 0, len = filters.length; i < len; ++i) {
                resultsRaw = filters[i](query, resultsRaw);

                if (!resultsRaw || !resultsRaw.length) {
                    break;
                }
            }

            if (locator) {
                // Sync up the original results with the filtered, "located"
                // results.
                results = [];

                for (i = 0, len = resultsRaw.length; i < len; ++i) {
                    results.push(locatorMap[resultsRaw[i]]);
                }

                resultsRaw = results;
            }

            results = resultsRaw;

            if (formatter) {
                results = formatter(query, results);
            }

            if (highlighter) {
                results = highlighter(query, results);
            }

            facade.results    = results;
            facade.resultsRaw = resultsRaw;
        }

        this.fire(EVT_RESULTS, facade);
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
        Y.log('raw results: ' + Y.dump(e.resultsRaw), 'info', 'autocomplete-base');
        Y.log('formatted results: ' + Y.dump(e.results), 'info', 'autocomplete-base');

        this._set(RESULTS, e[RESULTS]);
        this._set(RESULTS_RAW, e[RESULTS_RAW]);
    }
};

Y.AutoCompleteBase = AutoCompleteBase;
/**
 * Provides automatic input completion or suggestions for text input fields and
 * textareas.
 *
 * @module autocomplete
 * @class AutoComplete
 * @extends Base
 * @uses AutoCompleteBase
 * @constructor
 * @param {Object} config Configuration object.
 * @since 3.3.0
 */

Y.AutoComplete = Y.Base.create('autocomplete', Y.Base, [Y.AutoCompleteBase], {
    initializer: function () {
        this._bindInput();
        this._syncInput();
    },

    destructor: function () {
        this._unbindInput();
    }
});


}, '@VERSION@' ,{requires:['array-extras', 'base-build', 'event-valuechange', 'node-base']});
YUI.add('autocomplete-plugin', function(Y) {

/**
 * Binds an AutoComplete instance to a Node instance.
 *
 * @module autocomplete
 * @submodule autocomplete-plugin
 * @class Plugin.AutoComplete
 * @extends AutoComplete
 */

function AutoCompletePlugin(config) {
    config = Y.mix({}, config, true); // fast shallow clone
    config.inputNode = config.host;
    AutoCompletePlugin.superclass.constructor.apply(this, arguments);
}

Y.namespace('Plugin').AutoComplete = Y.extend(AutoCompletePlugin, Y.AutoComplete, {}, {
    NAME: 'autocompletePlugin',
    NS  : 'ac'
});


}, '@VERSION@' ,{requires:['autocomplete-base', 'node-pluginhost']});


YUI.add('autocomplete', function(Y){}, '@VERSION@' ,{use:['autocomplete-base', 'autocomplete-plugin']});

