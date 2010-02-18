YUI.add('tabview', function(Y) {

var _queries = Y.TabviewBase._queries,
    _classNames = Y.TabviewBase._classNames,
    DOT = '.',
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
            contentBox.append(TabView.LIST_TEMPLATE);
        } else {
            list.addClass(_classNames.tabviewList);
        }
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
            panels = contentBox.all(_queries.tabPanel);
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
var Lang = Y.Lang,
    _queries = Y.TabviewBase._queries,
    _classNames = Y.TabviewBase._classNames,
    getClassName = Y.ClassNameManager.getClassName;

Y.Tab = Y.Base.create('tab', Y.Widget, [Y.WidgetChild], {
    BOUNDING_TEMPLATE : '<li class="' + _classNames.tab + '"></li>',
    CONTENT_TEMPLATE : '<a class="' + _classNames.tabLabel + '"></a>',
    PANEL_TEMPLATE: '<div class="' + _classNames.tabPanel + '"></div>',

    _uiSetSelectedPanel: function(selected) {
        this.get('panelNode').toggleClass(_classNames.selectedPanel, selected);
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

    syncUI: function() {
        this._uiSetSelectedPanel(this.get('selected'));
    },

    bindUI: function() {
       this.after('selectedChange', this._afterTabSelectedChange);
       this.after('parentChange', this._afterParentChange);
    },

    renderUI: function() {
        var parentContentBox = this.get('parent').get('contentBox'),
            contentBox = this.get('contentBox');

        this._renderLabel(contentBox, parentContentBox);
        this._renderPanel(contentBox, parentContentBox);
    },

    _renderLabel: function(contentBox, parentContentBox) {
        var label = this.get('label');
        contentBox.setContent(label);
        parentContentBox.one(_queries.tabviewList).appendChild(this.get('boundingBox'));
    },

    _renderPanel: function(contentBox, parentContentBox) {
        var panel = parentContentBox.all(_queries.tabPanel).item(this.get('index'));
        if (!panel) {
            panel = Y.Node.create(this.PANEL_TEMPLATE);
            panel.setContent(this.get('content'));
            parentContentBox.one(_queries.tabviewPanel).appendChild(panel);
        }

        this._set('panelNode', panel);
    },

    _add: function() {
        var parentNode = this.get('parent').get('contentBox'),
            list = parentNode.one(_queries.tabviewList),
            tabviewPanel = parentNode.one(_queries.tabviewPanel);
        if (list) {
            list.appendChild(this.get('boundingBox'));
        }

        if (tabviewPanel) {
            tabviewPanel.appendChild(this.get('panelNode'));
        }
    },
    
    _remove: function() {
        this.get('boundingBox').remove();
        this.get('panelNode').remove();
    },
    
    initializer: function() {
         this.publish('click', { 
             defaultFn: function(event) {
                 if (event.target == this) {
                     //  Prevent the browser from navigating to the URL specified by the 
                     //  anchor's href attribute.
                     event.domEvent.preventDefault();
                     event.target.set('selected', 1);
                 }
             }
          });
    }
}, {
    ATTRS: {
        label: { 
            validator: Lang.isString
        },

        content: {
            validator: Lang.isString
        },

        panelNode: {},
        
        //  Override of Widget's default tabIndex attribute since we don't 
        //  want the bounding box (<li>) of each Tab instance in the default
        //  tab index. The focusable pieces of a TabView's UI will be 
        //  each tab's anchor element.
        tabIndex: {
            value: null,
            validator: '_validTabIndex'
        }        

    },

    HTML_PARSER: {
        selection: function(contentBox) {
            return this.get('boundingBox').hasClass(_classNames.selectedTab);
        }
    }

});


}, '@VERSION@' ,{requires:['substitute', 'tabview-base', 'widget', 'widget-parent', 'widget-child']});
