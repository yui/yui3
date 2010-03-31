/**
 * The TabView module 
 *
 * @module tabview
 */

var _queries = Y.TabviewBase._queries,
    _classNames = Y.TabviewBase._classNames,
    DOT = '.',
    _isGeckoIEWin = ((Y.UA.gecko || Y.UA.ie) && navigator.userAgent.indexOf("Windows") > -1),
    getClassName = Y.ClassNameManager.getClassName,

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
    _afterChildAdded: function(e) {
        this.get('contentBox').focusManager.refresh();
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
            tablist = contentBox.one(_queries.tabviewList);

        if (tablist) {
            tablist.setAttrs({
                //'aria-labelledby': 
                role: tablist
            });
        }

        //  Since the anchor's "href" attribute has been removed, the
        //  element will not fire the click event in Firefox when the
        //  user presses the enter key.  To fix this, dispatch the
        //  "click" event to the anchor when the user presses the
        //  enter key.
     
        if (_isGeckoIEWin) {
            tabView.delegate('keydown', function (event) {
                if (event.charCode === 13) {
                    this.simulate("click");
                }
     
            }, ">ul>li>a");
     
        }
    },

    bindUI: function() {
        //  Use the Node Focus Manager to add keyboard support:
        //  Pressing the left and right arrow keys will move focus
        //  among each of the tabs.
        this.get('contentBox').plug(Y.Plugin.NodeFocusManager, {
                        descendants: DOT + _classNames.tabLabel,
                        keys: { next: 'down:39', // Right arrow
                                previous: 'down:37' },  // Left arrow
                        circular: true
                    });

        this.after('addChild', this._afterChildAdded);
        this.after('removeChild', this._afterChildRemoved);
    },
    
    renderUI: function() {
        var contentBox = this.get('contentBox'); 
        this._renderListBox(contentBox);
        this._renderPanelBox(contentBox);
        this._renderTabs(contentBox);
        this._setDefSelection(contentBox);

    },

    _setDefSelection: function() {
        //  If no tab is selected, select the first tab.
        var firstItem = this.item(0);
        if (!this.get('selection') && firstItem) {
            firstItem.set('selected', 1);
        }
    },

    _renderListBox: function(contentBox) {
        var list = contentBox.one(_queries.tabviewList);
        if (!list) {
            list = contentBox.appendChild(Y.Node.create(TabView.LIST_TEMPLATE));
        } else {
            list.addClass(_classNames.tabviewList);
        }

        this._childrenContainer = list;
    },

    _renderPanelBox: function(contentBox) {
        var panel = contentBox.one(_queries.tabviewPanel);
        if (!panel) {
            contentBox.append(TabView.PANEL_TEMPLATE);
        } else {
            panel.addClass(_classNames.tabviewPanel);
        }
    },

    _renderTabs: function(contentBox) {
        var tabs = contentBox.all(_queries.tab),
            panels = contentBox.all(_queries.tabPanel),
            tabview = this;

        if (tabs) { // add classNames and fill in Tab fields from markup when possible
            tabs.addClass(_classNames.tab);
            contentBox.all(_queries.tabLabel).addClass(_classNames.tabLabel);
            contentBox.all(_queries.tabPanel).addClass(_classNames.tabPanel);

            tabs.each(function(node, i) {
                var panelNode = panels.item(i);
                tabview.add({
                    boundingBox: node,
                    contentBox: node.one(DOT + _classNames.tabLabel),
                    label: node.one(DOT + _classNames.tabLabel).get('text'),
                    content: panelNode ? panelNode.get('innerHTML') : null
                });
            });
        }

    }
}, {

    LIST_TEMPLATE: '<ul class="' + _classNames.tabviewList + '"></ul>',
    PANEL_TEMPLATE: '<div class="' + _classNames.tabviewPanel + '"></div>',

    ATTRS: {
        defaultChildType: {  
            value: 'Tab'
        },

        tabIndex: {
            value: null
            //validator: '_validTabIndex'
        }
    }
});

Y.TabView = TabView;
