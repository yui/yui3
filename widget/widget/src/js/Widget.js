(function() {

    var Y = YAHOO.util,
        YUI = YAHOO.lang.CONST;

    // constructor
    function Widget(node, attributes) {
        YAHOO.log('constructor called', 'life', 'Widget');

        attributes = attributes || {};
        attributes.node = new Y.Element(node);

        Widget.superclass.constructor.call(this, attributes);
    }

    Widget.CONFIG = {
        'node': {
            set: function(node) {
                // TODO: require Y.Element? re-initialize?
            },
            validator: function(el) {
                return true;//!!el.tagName || el.get;
            }
        },

        'visible' : {
            set: function(bVisible) {
                var elem = this.get('node');
                if (bVisible) {
                    Y.Dom.addClass(elem.get('node'), YUI.CSS.VISIBLE);
                } else {
                    Y.Dom.removeClass(elem.get('node'), YUI.CSS.VISIBLE);
                }
            }
            //value: true
        }
    };

    var _instances = {};

    Widget.getByNodeId = function(id) {
        return _instances[id]; 
    };

    // public 
    var proto = {

        initializer : function(attributes) {
            YAHOO.log('initializer called', 'life', 'Widget');
            _instances[attributes.node.get(YUI.ID)] = this;
        },

        destructor : function() {
            YAHOO.log('destructor called', 'life', 'Widget');

            var node = this.get('node');
            var id = node.id;

            node.destroy();
            delete _instances[id];
        },

        /* @final */
        render : function() {
            if (!this.__renderer) {
                this.__setDefaultRenderer();
            }
            var retValue = this.fireEvent(YUI.BeforeRender);
            if (retValue === false) {
                return false;
            }
            this.__renderer._render();
            this.fireEvent(YUI.Render);
        },

        setRenderer : function(renderer) {
            if (YAHOO.lang.isFunction(renderer)) {
                renderer = new renderer(this);
            }
            renderer._widget = this;
            this.__renderer = renderer;
        },

        setNode : function(node) {
            this.set('node', node);
        },

        hide : function() {
            this.set('visible', false);
        },

        show : function() {
            this.set('visible', true);
        },

        enable : function() {
        },

        disable : function() {
        },

        focus : function() {
        },

        blur : function() {
        },

        toString: function() {
            return 'Widget: ' + this.get('node').get('id');
        },

        // TODO: Move to .__.
        __renderer : null,

        // TODO: Move to .__. - Means it has to be invoked using call/apply
        __setDefaultRenderer : function() {
            var renderClass = this.constructor.renderClass || Widget.renderClass;
            this.__renderer = new renderClass(this);
        }

    };

    YAHOO.lang.extend(Widget, Y.Object, proto);
    //YAHOO.lang.augmentObject(Widget, Y.Object); // add static members

    // WidgetRenderer constructor
    function WidgetRenderer(widget) {
        this.widget = widget;
    }

    // Should it extend Object/EventProvider or just leech off of Widget?
    WidgetRenderer.prototype = {

        // TODO: Move to ._.
        /* @protected */
        _widget : null,

        /** 
         * @protected - entry point for Widget 
         * @abstract
         */
        // TODO: Move to ._. - Means it has to be invoked using call/apply
        _render: function() {
            YAHOO.log('render', 'life', 'WidgetRenderer');
        }
    };

    Widget.renderClass = WidgetRenderer;

    YAHOO.widget.Widget = Widget;
    YAHOO.widget.WidgetRenderer = WidgetRenderer;

})();