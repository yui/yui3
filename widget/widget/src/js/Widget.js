(function() {

    var Y = YAHOO.util,
        YUI = YAHOO.lang.CONST;

    // constructor
    function Widget(node, attributes) {
        YAHOO.log('constructor called', 'info', 'Widget');

        attributes = attributes || {};
        attributes.node = new Y.Element(node);

        // Default CONFIG value not currently working, 
        // so setting this here temporarily
        attributes.renderer = WidgetRenderer;

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

        'renderer' : {
            set: function(renderer) {
                // TODO: attribute or .property?
                return (YAHOO.lang.isFunction(renderer)) ? new renderer(this) : renderer;
            }
            // TODO: Not working currently
            // value: WidgetRenderer
        }
    };

    var _instances = {};

    Widget.getByNodeId = function(id) {
        return _instances[id]; 
    };

    // public 
    var proto = {

        init: function(attributes) {
            YAHOO.log('init called', 'info', 'Widget');
            _instances[attributes.node.get(YUI.ID)] = this;
        },

        /* @final */
        render: function() {
            return this.get('renderer').doRender();
        },

        destructor: function() {
            YAHOO.log('destructor called', 'info', 'Widget');

            var node = this.get('node');
            var id = node.id;

            node.destroy();
            delete _instances[id];
        },

        toString: function() {
            return 'Widget: ' + this.get('node').get('id');
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

        widget : null,

        /* @protected - wouldn't expect Widget users to call it directly */
        render : function() {
            // widget.node.appendChild, widget.node.element.innerHTML code
            YAHOO.log('render', 'info', 'WidgetRenderer');
        },

        /* @protected */
        attachListeners : function() {
            // YAHOO.util.Event.on(domElem, "click") code
            YAHOO.log('attachListeners', 'info', 'WidgetRenderer');
        },

        /* @private - entry point for Widget. Not overrideable */
        doRender: function() {

            var retValue = this.widget.fireEvent(YUI.BeforeRender);
            if (retValue === false) {
                return false;
            }

            var constructor = this.constructor;
            if (constructor == Object.prototype.constructor) {
                this.render();
            } else {
                // Really required?

                // Don't see too much use for render chaining. More often, 
                // it's over-ridden completely.
                while (constructor && constructor.prototype && constructor.prototype.render) {
                    constructor.prototype.render.apply(this, arguments);
                    constructor = constructor.superclass ? constructor.superclass.constructor : null;
                }
            }

            this.widget.fireEvent(YUI.Render);
            this.attachListeners();
        }
    };

    YAHOO.widget.Widget = Widget;
    YAHOO.widget.WidgetRenderer = WidgetRenderer;

})();