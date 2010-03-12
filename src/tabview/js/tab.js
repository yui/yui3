var Lang = Y.Lang,
    _queries = Y.TabviewBase._queries,
    _classNames = Y.TabviewBase._classNames,
    _isGeckoIEWin = ((Y.UA.gecko || Y.UA.ie) && navigator.userAgent.indexOf("Windows") > -1),
    getClassName = Y.ClassNameManager.getClassName;

/**
 * Provides Tab instances for use with TabView
 * @param config {Object} Object literal specifying tabview configuration properties.
 *
 * @class Tab
 * @constructor
 * @extends Widget
 */
Y.Tab = Y.Base.create('tab', Y.Widget, [Y.WidgetChild], {
    BOUNDING_TEMPLATE: '<li class="' + _classNames.tab + '"></li>',
    CONTENT_TEMPLATE: '<a class="' + _classNames.tabLabel + '"></a>',
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
 
 
        //  Remove the "href" attribute from the anchor element to
        //  prevent JAWS and NVDA from reading the value of the "href"
        //  attribute when the anchor is focused
 
        if (_isGeckoIEWin) {
            anchor.removeAttribute('href');
        }
 
        //  Apply the ARIA roles, states and properties to each panel
 
        panel.setAttrs({
            role: 'tabpanel',
            'aria-labelledby': id
        });
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
        this._initAria();
    },

    _renderLabel: function(contentBox, parentContentBox) {
        var label = this.get('label');
        contentBox.setContent(label);
    },

    _renderPanel: function(contentBox, parentContentBox) {
        var id,
            href = contentBox.get('href') || '',
            panel;

        if (href.charAt(0) === '#') {
            id = href.substr(1); 
            panel = Y.one(href);
        } else {
            id = Y.guid();
        }

        if (!panel) {
            panel = Y.Node.create(this.PANEL_TEMPLATE);
            panel.set('id', id);
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
         * @type String
         */
        label: { 
            validator: Lang.isString
        },

        /**
         * @attribute content
         * @type String
         */
        content: {
            validator: Lang.isString
        },

        panelNode: {},
        
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
