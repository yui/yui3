/**
 * The TabView module
 *
 * @module tabview
 */

var DOT = '.',

    /**
     * Provides a tabbed widget interface
     * @param config {Object} Object literal specifying tabview configuration properties.
     *
     * @class TabView
     * @constructor
     * @extends Widget
     * @uses WidgetParent
     */
    TabView = Y.Base.create('tabView', Y.Widget, [Y.WidgetParent], {

    _afterChildAdded: function() {
        this.get('contentBox').focusManager.refresh();
    },

    _defListNodeValueFn: function() {
        var node = Y.Node.create(this.LIST_TEMPLATE);

        node.addClass(Y.TabviewBase._classNames.tabviewList);

        return node;
    },

    _defPanelNodeValueFn: function() {
        var node = Y.Node.create(this.PANEL_TEMPLATE);

        node.addClass(Y.TabviewBase._classNames.tabviewPanel);

        return node;
    },

    _afterChildRemoved: function(e) { // update the selected tab when removed
        var i = e.index,
            selection = this.get('selection');

        if (!selection) { // select previous item if selection removed
            selection = this.item(i - 1) || this.item(0);
            if (selection) {
                selection.set('selected', 1);
            }
        }

        this.get('contentBox').focusManager.refresh();
    },

    _initAria: function(contentBox) {
        var tablist = contentBox.one(Y.TabviewBase._queries.tabviewList);

        if (tablist) {
            tablist.setAttrs({
                //'aria-labelledby':
                role: 'tablist'
            });
        }
    },

    bindUI: function() {
        //  Use the Node Focus Manager to add keyboard support:
        //  Pressing the left and right arrow keys will move focus
        //  among each of the tabs.

        this.get('contentBox').plug(Y.Plugin.NodeFocusManager, {
                        descendants: DOT + Y.TabviewBase._classNames.tabLabel,
                        keys: { next: 'down:39', // Right arrow
                                previous: 'down:37' },  // Left arrow
                        circular: true
                    });

        this.after('render', this._setDefSelection);
        this.after('addChild', this._afterChildAdded);
        this.after('removeChild', this._afterChildRemoved);
    },

    renderUI: function() {
        var contentBox = this.get('contentBox');
        this._renderListBox(contentBox);
        this._renderPanelBox(contentBox);
        this._childrenContainer = this.get('listNode');
        this._renderTabs(contentBox);
        this._initAria(contentBox);
    },

    _setDefSelection: function() {
        //  If no tab is selected, select the first tab.
        var selection = this.get('selection') || this.item(0);

        this.some(function(tab) {
            if (tab.get('selected')) {
                selection = tab;
                return true;
            }
        });
        if (selection) {
            // TODO: why both needed? (via widgetParent/Child)?
            this.set('selection', selection);
            selection.set('selected', 1);
        }
    },

    _renderListBox: function(contentBox) {
        var node = this.get('listNode');
        if (!node.inDoc()) {
            contentBox.append(node);
        }
    },

    _renderPanelBox: function(contentBox) {
        var node = this.get('panelNode');
        if (!node.inDoc()) {
            contentBox.append(node);
        }
    },

    _renderTabs: function(contentBox) {
        var _classNames = Y.TabviewBase._classNames,
            _queries = Y.TabviewBase._queries,
            tabs = contentBox.all(_queries.tab),
            panelNode = this.get('panelNode'),
            panels = (panelNode) ? this.get('panelNode').get('children') : null,
            tabview = this;

        if (tabs) { // add classNames and fill in Tab fields from markup when possible
            tabs.addClass(_classNames.tab);
            contentBox.all(_queries.tabLabel).addClass(_classNames.tabLabel);
            contentBox.all(_queries.tabPanel).addClass(_classNames.tabPanel);

            tabs.each(function(node, i) {
                var panelNode = (panels) ? panels.item(i) : null;
                tabview.add({
                    boundingBox: node,
                    contentBox: node.one(DOT + _classNames.tabLabel),
                    panelNode: panelNode
                });
            });
        }
    }
}, {
    ATTRS: {
        defaultChildType: {
            value: 'Tab'
        },

        listNode: {
            setter: function(node) {
                node = Y.one(node);
                if (node) {
                    node.addClass(Y.TabviewBase._classNames.tabviewList);
                }
                return node;
            },

            valueFn: '_defListNodeValueFn'
        },

        panelNode: {
            setter: function(node) {
                node = Y.one(node);
                if (node) {
                    node.addClass(Y.TabviewBase._classNames.tabviewPanel);
                }
                return node;
            },

            valueFn: '_defPanelNodeValueFn'
        },

        tabIndex: {
            value: null
            //validator: '_validTabIndex'
        }
    },

    HTML_PARSER: {
        listNode: function(srcNode) {
            return srcNode.one(Y.TabviewBase._queries.tabviewList);
        },
        panelNode: function(srcNode) {
            return srcNode.one(Y.TabviewBase._queries.tabviewPanel);
        }
    },

    // Static for legacy support.
    LIST_TEMPLATE: '<ul></ul>',
    PANEL_TEMPLATE: '<div></div>'
});

// Map to static values by default.
TabView.prototype.LIST_TEMPLATE = TabView.LIST_TEMPLATE;
TabView.prototype.PANEL_TEMPLATE = TabView.PANEL_TEMPLATE;

Y.TabView = TabView;
