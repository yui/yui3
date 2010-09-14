YUI.add('autocomplete-list', function(Y) {

/**
 * AutoComplete dropdown list widget.
 *
 * @module autocomplete-list
 * @class AutoCompleteList
 * @extends Widget
 * @uses AutoCompleteBase
 * @uses WidgetPosition
 * @uses WidgetPositionAlign
 * @uses WidgetStack
 * @constructor
 * @param {Object} config Configuration object.
 * @since 3.3.0
 */

var Node   = Y.Node,
    YArray = Y.Array,

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
    ITEM_TEMPLATE: '<li role="option"/>',

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
        this._unbindInput();

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
     */
    hide: function () {
        this.set(VISIBLE, false);
    },

    /**
     * Shows the list.
     *
     * @method show
     * @see hide
     */
    show: function () {
        this.set(VISIBLE, true);
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
     * Binds list events.
     *
     * @method _bindList
     * @protected
     */
    _bindList: function () {
        this._events.concat([
            this._inputNode.after('blur', this._afterInputBlur, this),

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
        this._contentBox.setContent('');
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
        itemNode.append(content).addClass(this.getClassName('item'));
        return itemNode.set('id', Y.stamp(itemNode));
    },

    /**
     * Synchronizes the results displayed in the tray with those in the
     * <i>results</i> argument.
     *
     * @method _syncResults
     * @param {Array} results Results.
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
     * Handles <code>inputNode</code> blur events.
     *
     * @method _afterInputBlur
     * @param {EventTarget} e
     * @protected
     */
    _afterInputBlur: function () {
        // Hide the list when neither the input node nor the list has focus.
        Y.later(20, this, function () {
            if (!this.get('focused')) {
                this.hide();
            }
        });
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


}, '@VERSION@' ,{skinnable:true, requires:['autocomplete-base', 'widget', 'widget-position', 'widget-position-align', 'widget-stack']});
