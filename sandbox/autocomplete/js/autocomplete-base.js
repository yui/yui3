YUI.add('autocomplete-base', function (Y) {

/**
 * Provides automatic input completion or suggestions for text input fields and
 * textareas.
 *
 * @module autocomplete
 * @since 3.3.0
 */

/**
 * Provides basic autocomplete logic for an existing text input field or
 * textarea. This module is the lowest-level building block for an autocomplete
 * implementation and doesn't provide a UI layer (see
 * <code>autocomplete-widget</code> for that).
 *
 * @module autocomplete
 * @submodule autocomplete-base
 */

/**
 * The AutoComplete class provides basic autocomplete logic for a text input
 * field or textarea.
 *
 * @class AutoComplete
 * @extends Base
 * @constructor
 * @param {Object} config configuration object
 */

// -- Shorthand & Private Variables --------------------------------------------
var Lang       = Y.Lang,
    isFunction = Lang.isFunction,
    isNumber   = Lang.isNumber,

    AC                 = 'autocomplete',
    ALLOW_BROWSER_AC   = 'allowBrowserAutocomplete',
    DATA_SOURCE        = 'dataSource',
    INPUT_NODE         = 'inputNode',
    MIN_QUERY_LENGTH   = 'minQueryLength',
    QUERY              = 'query',
    QUERY_DELAY        = 'queryDelay',
    REQUEST_TEMPLATE   = 'requestTemplate',
    RESULT_FILTERS     = 'resultFilters',
    RESULT_HIGHLIGHTER = 'resultHighlighter',
    VALUE_CHANGE       = 'valueChange',

    EVT_QUERY          = QUERY,
    EVT_RESULTS        = 'results',
    EVT_VALUE_CHANGE   = VALUE_CHANGE;

// Constructor
function AutoComplete() {
    AutoComplete.superclass.constructor.apply(this, arguments);
}

Y.AutoComplete = Y.extend(AutoComplete, Y.Base, {
    // -- Public Prototype Methods ---------------------------------------------
    initializer: function (config) {
        var input = this.get(INPUT_NODE);

        if (!input) {
            Y.error('No input node specified.');
        }

        if (input.get('nodeName').toLowerCase() === 'input') {
            input.setAttribute(AC, this.get(ALLOW_BROWSER_AC) ? 'on' : 'off');
        }

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
         */
        this.publish(EVT_RESULTS, {
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
            preventable: false
        });

        // Attach events.
        this._events = [
            // Note that we're listening to the valueChange event from the
            // value-change module here, not our own valueChange event (which
            // just wraps this one for convenience).

            // NOTE: bind is currently necessary because synthetic events don't
            // respect context params.
            input.on(VALUE_CHANGE, Y.bind(this._onValueChange, this))
        ];
    },

    destructor: function () {
        // Detach events.
        while (this._events.length) {
            this._events.pop().detach();
        }
    },

    // -- Protected Methods ----------------------------------------------------

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
     * Handles DataSource responses and fires the <code>results</code> event if
     * there appear to be results.
     *
     * @method _onResponse
     * @param {EventFacade} e
     * @protected
     */
    _onResponse: function (e) {
        var filters,
            highlighter,
            i,
            len,
            query,
            results = e && e.response && e.response.results;

        if (results) {
            query = e.callback.query;

            // Ignore stale responses that aren't for the current query.
            if (query === this.get(QUERY)) {
                filters     = this.get(RESULT_FILTERS) || [];
                highlighter = this.get(RESULT_HIGHLIGHTER);

                if (highlighter) {
                    // The highlighter is treated just like a filter except that
                    // it's always called last. Concat is used to ensure that
                    // the original filters array isn't touched.
                    filters = filters.concat([highlighter]);
                }

                for (i = 0, len = filters.length; i < len; ++i) {
                    results = filters[i](query, results);
                }

                this.fire(EVT_RESULTS, {
                    data   : e.data,
                    query  : query,
                    results: results
                });
            }
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

        Y.log('valueChange: new: "' + value + '"; old: "' + e.prevVal + '"', 'info', AC);

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
        }
    },

    // -- Protected Default Event Handlers -------------------------------------

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

        Y.log('query: "' + query + '"; inputValue: "' + e.inputValue + '"', 'info', AC);

        if (dataSource) {
            Y.log('sendRequest: ' + this.get(REQUEST_TEMPLATE)(query), 'info', AC);

            dataSource.sendRequest({
                request: this.get(REQUEST_TEMPLATE)(query),
                callback: {
                    query  : query,
                    success: Y.bind(this._onResponse, this)
                    // TODO: handle failures here, or should the implementer rely on DataSource events for that?
                }
            });
        }
    }
}, {
    // -- Public Static Properties ---------------------------------------------

    /**
     * Name of this component.
     *
     * @property NAME
     * @type String
     * @static
     * @final
     */
    NAME: AC,

    /**
     * Attribute definitions for this component.
     *
     * @property ATTRS
     * @type Object
     * @static
     * @final
     */
    ATTRS: {
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
            validator: Lang.isBoolean,
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

            // Note: While the requestTemplate can be set to either a function
            // or a string, it will always be returned as a function that
            // accepts a query and returns a string.
            value: encodeURIComponent
        },

        /**
         * <p>
         * Array of local result filter functions. If provided, each filter
         * will be called with two arguments when results are received: the
         * query and the results received from the DataSource. Each filter is
         * expected to return a filtered or modified version of those results,
         * which will then be passed on to subsequent filters, to the
         * <code>resultHighlighter</code> function (if set), and finally to
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
            validator: function (value) {
                return Lang.isArray(value);
            },

            value: []
        },

        /**
         * <p>
         * Function which will be used to highlight results. If provided, this
         * function will be called with two arguments after results have been
         * received and filtered: the query and the filtered results. The
         * highlighter is expected to return a modified version of the results
         * with the query highlighted in some form.
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
            validator: function (value) {
                return isFunction(value) || value === null;
            }
        }
    },

    // -- Protected Static Methods ---------------------------------------------

    /**
     * Returns a copy of the specified string with special HTML characters
     * escaped. The following characters will be converted to their
     * corresponding character entities:
     * <code>&amp; &lt; &gt; &quot; &#x27; &#x2F;</code>
     *
     * @method _escapeHTML
     * @param {String} string string to escape
     * @return {String} escaped string
     * @protected
     * @static
     */
    _escapeHTML: function (string) {
        // Based on the OWASP HTML escaping recommendations at
        // http://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet
        return string.replace(/&/g, '&amp;').
                      replace(/</g, '&lt;').
                      replace(/>/g, '&gt;').
                      replace(/"/g, '&quot;').
                      replace(/'/g, '&#x27;').
                      replace(/\//g, '&#x2F;');
    },

    /**
     * Returns a copy of the specified string with special RegExp characters
     * escaped.
     *
     * @method _escapeRegExp
     * @param {String} string string to escape
     * @return {String} escaped string
     * @protected
     * @static
     */
    _escapeRegExp: function (string) {
        return string.replace(/([\\\^\$*+\[\]?{}.=!:(|)])/g, '\\$1');
    }
});

}, '@VERSION@', {
    requires: ['base-base', 'event-valuechange', 'node-base']
});
