YUI.add('tabview', function (Y, NAME) {

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

    _initAria: function() {
        var contentBox = this.get('contentBox'),
            tablist = contentBox.one(Y.TabviewBase._queries.tabviewList);

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
/**
 * Provides Tab instances for use with TabView
 * @param config {Object} Object literal specifying tabview configuration properties.
 *
 * @class Tab
 * @constructor
 * @extends Widget
 * @uses WidgetChild
 */
Y.Tab = Y.Base.create('tab', Y.Widget, [Y.WidgetChild], {
    BOUNDING_TEMPLATE: '<li></li>',
    CONTENT_TEMPLATE: '<a></a>',
    PANEL_TEMPLATE: '<div></div>',

    _uiSetSelectedPanel: function(selected) {
        this.get('panelNode').toggleClass(Y.TabviewBase._classNames.selectedPanel, selected);
    },

    _afterTabSelectedChange: function(event) {
       this._uiSetSelectedPanel(event.newVal);
    },

    _afterParentChange: function(e) {
        if (!e.newVal) {
            this._remove();
        } else {
            this._add();
        }
    },

    _initAria: function() {
        var anchor = this.get('contentBox'),
            id = anchor.get('id'),
            panel = this.get('panelNode');

        if (!id) {
            id = Y.guid();
            anchor.set('id', id);
        }
        //  Apply the ARIA roles, states and properties to each tab
        anchor.set('role', 'tab');
        anchor.get('parentNode').set('role', 'presentation');

        //  Apply the ARIA roles, states and properties to each panel
        panel.setAttrs({
            role: 'tabpanel',
            'aria-labelledby': id
        });
    },

    syncUI: function() {
        var _classNames = Y.TabviewBase._classNames;

        this.get('boundingBox').addClass(_classNames.tab);
        this.get('contentBox').addClass(_classNames.tabLabel);
        this.set('label', this.get('label'));
        this.set('content', this.get('content'));
        this._uiSetSelectedPanel(this.get('selected'));
    },

    bindUI: function() {
       this.after('selectedChange', this._afterTabSelectedChange);
       this.after('parentChange', this._afterParentChange);
    },

    renderUI: function() {
        this._renderPanel();
        this._initAria();
    },

    _renderPanel: function() {
        this.get('parent').get('panelNode')
            .appendChild(this.get('panelNode'));
    },

    _add: function() {
        var parent = this.get('parent').get('contentBox'),
            list = parent.get('listNode'),
            panel = parent.get('panelNode');

        if (list) {
            list.appendChild(this.get('boundingBox'));
        }

        if (panel) {
            panel.appendChild(this.get('panelNode'));
        }
    },

    _remove: function() {
        this.get('boundingBox').remove();
        this.get('panelNode').remove();
    },

    _onActivate: function(e) {
         if (e.target === this) {
             //  Prevent the browser from navigating to the URL specified by the
             //  anchor's href attribute.
             e.domEvent.preventDefault();
             e.target.set('selected', 1);
         }
    },

    initializer: function() {
       this.publish(this.get('triggerEvent'), {
           defaultFn: this._onActivate
       });
    },

    _defLabelGetter: function() {
        return this.get('contentBox').getHTML();
    },

    _defLabelSetter: function(label) {
        var labelNode = this.get('contentBox');
        if (labelNode.getHTML() !== label) { // Avoid rewriting existing label.
            labelNode.setHTML(label);
        }
        return label;
    },

    _defContentSetter: function(content) {
        var panel = this.get('panelNode');
        if (panel.getHTML() !== content) { // Avoid rewriting existing content.
            panel.setHTML(content);
        }
        return content;
    },

    _defContentGetter: function() {
        return this.get('panelNode').getHTML();
    },

    // find panel by ID mapping from label href
    _defPanelNodeValueFn: function() {
        var _classNames = Y.TabviewBase._classNames,
            href = this.get('contentBox').get('href') || '',
            parent = this.get('parent'),
            hashIndex = href.indexOf('#'),
            panel;

        href = href.substr(hashIndex);

        if (href.charAt(0) === '#') { // in-page nav, find by ID
            panel = Y.one(href);
            if (panel) {
                panel.addClass(_classNames.tabPanel);
            }
        }

        // use the one found by id, or else try matching indices
        if (!panel && parent) {
            panel = parent.get('panelNode')
                    .get('children').item(this.get('index'));
        }

        if (!panel) { // create if none found
            panel = Y.Node.create(this.PANEL_TEMPLATE);
            panel.addClass(_classNames.tabPanel);
        }
        return panel;
    }
}, {
    ATTRS: {
        /**
         * @attribute triggerEvent
         * @default "click"
         * @type String
         */
        triggerEvent: {
            value: 'click'
        },

        /**
         * @attribute label
         * @type HTML
         */
        label: {
            setter: '_defLabelSetter',
            getter: '_defLabelGetter'
        },

        /**
         * @attribute content
         * @type HTML
         */
        content: {
            setter: '_defContentSetter',
            getter: '_defContentGetter'
        },

        /**
         * @attribute panelNode
         * @type Y.Node
         */
        panelNode: {
            setter: function(node) {
                node = Y.one(node);
                if (node) {
                    node.addClass(Y.TabviewBase._classNames.tabPanel);
                }
                return node;
            },
            valueFn: '_defPanelNodeValueFn'
        },

        tabIndex: {
            value: null,
            validator: '_validTabIndex'
        }

    },

    HTML_PARSER: {
        selected: function() {
            var ret = (this.get('boundingBox').hasClass(Y.TabviewBase._classNames.selectedTab)) ?
                        1 : 0;
            return ret;
        }
    }

});


}, '@VERSION@', {
    "requires": [
        "widget",
        "widget-parent",
        "widget-child",
        "tabview-base",
        "node-pluginhost",
        "node-focusmanager"
    ],
    "skinnable": true
});
