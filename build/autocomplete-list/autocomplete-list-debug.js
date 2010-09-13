YUI.add('autocomplete-list', function(Y) {

/**
 * AutoComplete dropdown list widget.
 *
 * @module autocomplete
 * @submodule autocomplete-list
 * @class AutoCompleteList
 * @extends Widget
 * @uses AutoCompleteBase
 * @constructor
 * @param {Object} config Configuration object.
 */

var Node   = Y.Node,
    YArray = Y.Array,

    INPUT        = 'input',
    INPUT_NODE   = 'inputNode',
    TRAY         = 'tray',
    TRAY_NODE    = 'trayNode',
    TRAY_VISIBLE = 'trayVisible',

ACList = Y.Base.create('autocompleteList', Y.Widget, [Y.AutoCompleteBase], {
    // -- Lifecycle Prototype Methods ------------------------------------------
    initializer: function () {
        this._events = [];
    },

    destructor: function () {
        this._unbindInput();

        while (this._events.length) {
            this._events.pop().detach();
        }
    },

    bindUI: function () {
        this._bindInput();
        this._bindTray();
    },

    renderUI: function () {
        this._contentBox = this.get('contentBox');

        this._renderInput();
        this._renderTray();
    },

    syncUI: function () {
        this._syncInput();
        this._syncTray();
    },

    // -- Public Prototype Methods ---------------------------------------------

    /**
     * Hides the result tray.
     *
     * @method hideTray
     * @see showTray
     */
    hideTray: function () {
        this.set(TRAY_VISIBLE, false);
    },

    /**
     * Shows the result tray.
     *
     * @method showTray
     * @see hideTray
     */
    showTray: function () {
        this.set(TRAY_VISIBLE, true);
    },

    // -- Protected Prototype Methods ------------------------------------------

    /**
     * Appends the specified <i>result</i> (which should be an HTML string) to
     * the tray inside a new result node.
     *
     * @method _addResult
     * @param {String} result Result.
     * @protected
     */
    _addResult: function (result) {
        var resultNode = Node.create(ACList.HTML_TEMPLATE.resultNode.replace(
                '{result}', result));

        resultNode.addClass(this.getClassName('result')).setAttrs({
            id  : Y.stamp(resultNode),
            role: 'option'
        });

        this._trayNode.append(resultNode);
    },

    /**
     * Attaches tray-related events.
     *
     * @method _bindTray
     * @protected
     */
    _bindTray: function () {
        this._events.concat([
            this.after('resultsChange', this._afterResultsChange, this),
            this.after('trayVisibleChange', this._afterTrayVisibleChange, this)
        ]);
    },

    /**
     * Clears the contents of the tray.
     *
     * @method _clearTray
     * @protected
     */
    _clearTray: function () {
        this._trayNode.setContent('');
    },

    /**
     * Renders the input node.
     *
     * @method _renderInput
     * @protected
     */
    _renderInput: function () {
        var input = this.get(INPUT_NODE);

        if (!input) {
            input = Node.create(ACList.HTML_TEMPLATE[INPUT_NODE]);
            this._contentBox.appendChild(input);
            this.set(INPUT_NODE, input);
        }

        input.addClass(this.getClassName(INPUT));
    
        // See http://www.w3.org/WAI/PF/aria/roles#combobox
        input.setAttrs({
            'aria-autocomplete': 'list',
            role: 'combobox'
        });

        this._inputNode = input;
    },

    /**
     * Renders the tray.
     *
     * @method _renderTray
     * @protected
     */
    _renderTray: function () {
        var id,
            tray = this.get(TRAY_NODE);

        if (!tray) {
            tray = Node.create(ACList.HTML_TEMPLATE[TRAY_NODE]);
            this._contentBox.appendChild(tray);
            this.set(TRAY_NODE, tray);
        }

        tray.addClass(this.getClassName(TRAY));

        // The tray needs an id so we can set up an ARIA relationship between it
        // and the inputNode.
        if (!(id = tray.get('id'))) {
            tray.set('id', id = Y.stamp(tray));
        }

        // See http://www.w3.org/WAI/PF/aria/roles#combobox
        tray.set('role', 'listbox');
        this._inputNode.set('aria-owns', id);

        this._trayNode = tray;
    },

    /**
     * Synchronizes the tray's UI state with the current state of the model.
     *
     * @method _syncTray
     * @protected
     */
    _syncTray: function () {
        this._syncTrayVisibility();
        this._syncTrayResults();
    },

    /**
     * Synchronizes the results displayed in the tray with those in the
     * <i>results</i> argument, or with those in the <code>results</code>
     * attribute if an argument is not provided.
     *
     * @method _syncTrayResults
     * @param {Array} results (optional) Results.
     * @protected
     */
    _syncTrayResults: function (results) {
        if (!results) {
            results = this.get('results');
        }

        this._clearTray();
        YArray.each(results, this._addResult, this);
    },

    /**
     * Synchronizes the visibility of the tray with the <i>visible</i> argument,
     * or with the <code>trayVisible</code> attribute if an argument is not
     * provided.
     *
     * @method _syncTrayVisibility
     * @param {Boolean} visible (optional) Visibility.
     * @protected
     */
    _syncTrayVisibility: function (visible) {
        if (visible === undefined) {
            visible = this.get(TRAY_VISIBLE);
        }

        this._trayNode.toggleClass(this.getClassName('hidden'), !visible);
        this._trayNode.set('aria-hidden', !visible);
        this._inputNode.set('aria-expanded', visible);
    },

    // -- Protected Event Handlers ---------------------------------------------

    /**
     * Handles <code>resultsChange</code> events.
     *
     * @method _afterResultsChange
     * @param {EventFacade} e
     * @protected
     */
    _afterResultsChange: function (e) {
        this._syncTrayResults(e.newVal);
        this.set(TRAY_VISIBLE, !!e.newVal.length);
    },

    /**
     * Handles <code>trayVisibleChange</code> events.
     *
     * @method _trayVisibleChange
     * @param {EventFacade} e
     * @protected
     */
    _afterTrayVisibleChange: function (e) {
        this._syncTrayVisibility(!!e.newVal);
    }
}, {
    ATTRS: {
        /**
         * Tray node in which results will be displayed.
         *
         * @attribute trayNode
         * @type Node|HTMLElement|String
         * @writeonce
         */
        trayNode: {
            setter: Y.one,
            writeOnce: 'initOnly'
        },

        /**
         * Whether or not the tray is currently visible.
         *
         * @attribute trayVisible
         * @type Boolean
         * @default false
         */
        trayVisible: {
            value: false
        }
    },

    CSS_PREFIX: Y.ClassNameManager.getClassName('aclist'),

    HTML_PARSER: {
        // Using functions here to allow subclasses to override CSS_PREFIX if
        // desired, since the default prefix is not specific to the
        // AutoCompleteList widget.

        inputNode: function (srcNode) {
            // Finds the first input element with class "yui3-aclist-input", or
            // falls back to the first text input element if one with that class
            // isn't found.
            return srcNode.one('input.' + this.getClassName(INPUT) +
                    ',input[type=text]');
        },

        trayNode : function (srcNode) {
            return srcNode.one('.' + this.getClassName(TRAY));
        }
    },

    HTML_TEMPLATE: {
        inputNode : '<input type="text">',
        resultNode: '<li>{result}</li>',
        trayNode  : '<ul/>'
    }
});

Y.AutoCompleteList = ACList;


}, '@VERSION@' ,{skinnable:true, requires:['autocomplete-base', 'widget']});
