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
