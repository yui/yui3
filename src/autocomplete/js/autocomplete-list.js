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
    // KEY_DOWN  = 40,
    // KEY_ENTER = 13,
    // KEY_ESC   = 27,
    KEY_TAB   = 9,
    // KEY_UP    = 38,

    // String shorthand.
    INPUT_NODE = 'inputNode',
    VISIBLE    = 'visible',
    WIDTH      = 'width',

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
        this._inputNode = this.get(INPUT_NODE);
        this._events    = [];

        if (!this._inputNode) {
            Y.error('No inputNode specified.');
        }

        if (!this.get('align.node')) {
            this.set('align.node', this._inputNode);
        }

        if (!this.get(WIDTH)) {
            this.set(WIDTH, this._inputNode.get('clientWidth'));
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
     * Appends the specified result <i>items</i> to the list inside a new item
     * node.
     *
     * @method _add
     * @param {Array|Node|HTMLElement|String} items Result item or array of
     *   result items.
     * @protected
     */
    _add: function (items) {
        var itemNodes = [];

        YArray.each(Y.Lang.isArray(items) ? items : [items], function (item) {
            itemNodes.push(this._createItemNode(item));
        }, this);

        this._contentBox.append(itemNodes);
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
            inputNode.on('keydown', this._onInputKeyDown, this)
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
            this.after('mouseenter', this._afterMouseEnter, this),
            this.after('mouseleave', this._afterMouseLeave, this),

            this.after('resultsChange', this._afterResultsChange, this),
            this.after('visibleChange', this._afterVisibleChange, this)
        ]);
    },

    /**
     * Clears the contents of the tray.
     *
     * @method _clear
     * @protected
     */
    _clear: function () {
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
        }).addClass(this.getClassName('item'));
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
        if (!results) {
            results = this.get('results');
        }

        this._clear();

        if (results.length) {
            this._add(results);
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
    },

    // -- Protected Event Handlers ---------------------------------------------

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
     * @method _onInputKeyDown
     * @param {EventTarget} e
     * @protected
     */
    _onInputKeyDown: function (e) {
        this._lastInputKey = e.keyCode;
    },

    /**
     * Handles <code>mouseenter</code> events.
     *
     * @method _afterMouseEnter
     * @param {EventTarget} e
     * @protected
     */
    _afterMouseEnter: function () {
        this._mouseOverList = true;
    },

    /**
     * Handles <code>mouseleave</code> events.
     *
     * @method _afterMouseLeave
     * @param {EventTarget} e
     * @protected
     */
    _afterMouseLeave: function () {
        this._mouseOverList = false;
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
    }
}, {
    ATTRS: {
        align: {
            value: {
                points: ['tl', 'bl']
            }
        },

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
