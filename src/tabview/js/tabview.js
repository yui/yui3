var _queries = Y.TabviewBase._queries,
    _classNames = Y.TabviewBase._classNames,
    TabView = Y.Base.create('tabView', Y.Widget, [Y.WidgetParent], {
    _afterChildRemoved: function(e) { // update the selected tab when removed
        var i = e.index,
            selection = this.get('selection');

        if (!selection) { // select previous item if selection removed
            selection = this.item(i - 1) || this.item(0);
            if (selection) {
                selection.set('selected', 1);
            }
        }
    },

    bindUI: function() {
        //  Use the Node Focus Manager to add keyboard support:
        //  Pressing the left and right arrow keys will move focus
        //  among each of the tabs.
        this.get('boundingBox').plug(Y.Plugin.NodeFocusManager, {
        
                        descendants: _queries.tabLabel,
                        keys: { next: 'down:39', // Right arrow
                                previous: 'down:37' },  // Left arrow
                        circular: true
                    });

        this.after('removeChild', this._afterChildRemoved);
    },
    
    renderUI: function() {
        var contentBox = this.get('contentBox'); 
        this._renderListBox(contentBox);
        this._renderPanelBox(contentBox);
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
        if (!contentBox.one(_queries.tabviewList)) {
            contentBox.append(TabView.LIST_TEMPLATE);
        }
    },

    _renderPanelBox: function(contentBox) {
        if (!contentBox.one(_queries.tabviewPanel)) {
            contentBox.append(TabView.PANEL_TEMPLATE);
        }
    }
}, {

    LIST_TEMPLATE: '<ul class="' + _classNames.tabviewList + '"></ul>',
    PANEL_TEMPLATE: '<div class="' + _classNames.tabviewPanel + '"></div>',

    ATTRS: {
        defaultChildType: {  
            value: 'Tab'
        },

        //  Override of Widget's default tabIndex attribute since we don't 
        //  want the bounding box of each TabView instance in the default
        //  tab index.  The focusable pieces of a TabView's UI will be 
        //  each tab's anchor element.
        tabIndex: {
            value: null,
            validator: '_validTabIndex'
        }
    }
});

Y.TabView = TabView;
