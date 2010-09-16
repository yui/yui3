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
    ID           = 'id',
    INPUT_NODE   = 'inputNode',
    ITEM         = 'item',
    RESULT       = 'result',
    RESULTS      = 'results',
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
         *   <dt>itemNode (Node)</dt>
         *   <dd>
         *     List item node that was selected.
         *   </dd>
         *
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
            'aria-live': 'polite', // causes the screen reader to announce the value of an item when selected
            'aria-owns': this._contentBox.get(ID),
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
            itemNode: itemNode,
            result  : itemNode.getData(RESULT)
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
        var item = this.get(ACTIVE_ITEM),
            nextItem;

        nextItem = (item && item.next(this[_SELECTOR_ITEM])) ||
                this.get(CIRCULAR) && this._getFirstItemNode();

        if (nextItem) {
            this._set(ACTIVE_ITEM, nextItem);
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
            prevItem;

        prevItem = (item && item.previous(this[_SELECTOR_ITEM])) ||
                this.get(CIRCULAR) && this._getLastItemNode();

        if (prevItem) {
            this._set(ACTIVE_ITEM, prevItem);
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
     * @return {NodeList} Added nodes.
     * @protected
     */
    _add: function (items) {
        var itemNodes = [];

        YArray.each(Y.Lang.isArray(items) ? items : [items], function (item) {
            itemNodes.push(this._createItemNode(item).setData(RESULT, item));
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
     * @param {Object} result Result object.
     * @protected
     * @return {Node} Item node.
     */
    _createItemNode: function (result) {
        var itemNode = Node.create(this.ITEM_TEMPLATE);

        return itemNode.append(result.display).setAttrs({
            id  : Y.stamp(itemNode),
            role: 'option'
        }).addClass(this[_CLASS_ITEM]);
    },

    /**
     * Gets the last item node in the list, or <code>null</code> if the list is
     * empty.
     *
     * @method _getLastItemNode
     * @return {Node|null}
     * @protected
     */
    _getLastItemNode: function () {
        return this._contentBox.one(this[_SELECTOR_ITEM] + ':last-child');
    },

    /**
     * Gets the first item node in the list, or <code>null</code> if the list is
     * empty.
     *
     * @method _getFirstItemNode
     * @return {Node|null}
     * @protected
     */
    _getFirstItemNode: function () {
        return this._contentBox.one(this[_SELECTOR_ITEM]);
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
            results = this.get(RESULTS);
        }

        this._clear();

        if (results.length) {
            items = this._add(results);
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
        var newVal  = e.newVal,
            prevVal = e.prevVal;

        if (prevVal) {
            prevVal.removeClass(this[_CLASS_ITEM_ACTIVE]);
        }

        if (newVal) {
            newVal.addClass(this[_CLASS_ITEM_ACTIVE]);
            this._inputNode.set('aria-activedescendant', newVal.get(ID));
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
        var newVal  = e.newVal,
            prevVal = e.prevVal;

        if (prevVal) {
            prevVal.removeClass(this[_CLASS_ITEM_HOVER]);
        }

        if (newVal) {
            newVal.addClass(this[_CLASS_ITEM_HOVER]);
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
        var itemNode = e.domEvent.target.ancestor(this[_SELECTOR_ITEM], true);

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
        var action,
            keyCode = e.keyCode,
            visible;

        this._lastInputKey = keyCode;

        if (!this.get(RESULTS).length) {
            return;
        }

        visible = this.get(VISIBLE);

        if (keyCode === KEY_DOWN) {
            action = 1;

            if (!visible) {
                this.show();
            }

            this._activateNextItem();
        }

        if (visible) {
            switch (keyCode) {
            case KEY_ENTER:
                action = 1;
                this.selectItem();
                break;

            case KEY_ESC:
                action = 1;
                this.hide();
                break;

            // case KEY_TAB:
            //     break;

            case KEY_UP:
                action = 1;
                this._activatePrevItem();
                break;
            }
        }

        if (action) {
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
        this.set('value', e.result.text);
        this._inputNode.focus();
        this.hide();
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
