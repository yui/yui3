YUI.add('tabview', function(Y) {

var _queries = Y.TabviewBase.queries,
    _classNames = Y.TabviewBase.classNames,
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
        
                        descendants: _queries.link,
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
        if (!contentBox.one(_queries.tablist)) {
            contentBox.append(TabView.LIST_TEMPLATE);
        }
    },

    _renderPanelBox: function(contentBox) {
        if (!contentBox.one(_queries.content)) {
            contentBox.append(TabView.PANEL_TEMPLATE);
        }
    }
}, {

    LIST_TEMPLATE: '<ul></ul>',
    PANEL_TEMPLATE: '<div></div>',

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

Y.mix(TabView.HTML_PARSER, {
});

Y.TabView = TabView;
var Lang = Y.Lang,
    _queries = Y.TabviewBase.queries,
    _classNames = Y.TabviewBase.classNames,
    getClassName = Y.ClassNameManager.getClassName;

Y.Tab = Y.Base.create('tab', Y.Widget, [Y.WidgetChild], {
    BOUNDING_TEMPLATE : '<li></li>',
    CONTENT_TEMPLATE : '<a></a>',
    PANEL_TEMPLATE: '<div class="' + getClassName('tab-panel') + '"></div>',

    _uiSetSelectedPanel: function(selected) {
        this.get('panelNode').toggleClass(_classNames.selectedContent, selected);
    },

    _afterTabSelectedChange: function(event) {
       this._uiSetSelectedPanel(event.newVal);
    },

    _afterParentChange: function(e) {
        if (!e.newVal) {
            this._remove();
        } else {
            this.render();
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
        parentContentBox.one(_queries.tablist).appendChild(this.get('boundingBox'));
    },

    _renderPanel: function(contentBox, parentContentBox) {
        if (!this.get('panelNode')) {
            var panel = parentContentBox.all(_queries.tabPanel).item(this.get('index'));
            if (!panel) {
                panel = Y.Node.create(this.PANEL_TEMPLATE);
                panel.setContent(this.get('content'));
                parentContentBox.one(_queries.content).appendChild(panel);
            }
            this._set('panelNode', panel);
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

    }

});


}, '@VERSION@' ,{requires:['substitute', 'tabview-base', 'widget', 'widget-parent', 'widget-child']});
