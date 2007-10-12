(function() {

    var Y = YAHOO.util,
        YUI = YAHOO.lang.CONST;

    // constructor
    function Widget(node, attributes) {
        YAHOO.log('constructor called', 'life', 'Widget');

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
            YAHOO.log('init called', 'life', 'Widget');
            _instances[attributes.node.get(YUI.ID)] = this;
        },

        /* @final */
        render: function() {
            return this.get('renderer')._render();
        },

        destructor: function() {
            YAHOO.log('destructor called', 'life', 'Widget');

            var node = this.get('node');
            var id = node.id;

            node.destroy();
            delete _instances[id];
        },

        setRenderer: function(renderClass) {
            this.set('renderer', renderClass);
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

        /* @abstract, @protected - wouldn't expect Widget users to call it directly */
        render : function() {
            // widget.node.appendChild, widget.node.element.innerHTML code
            YAHOO.log('render', 'life', 'WidgetRenderer');
        },
        
        /* @abstract, @protected */
        attachListeners : function() {
            // YAHOO.util.Event.on(domElem, "click") code
            YAHOO.log('attachListeners', 'life', 'WidgetRenderer');
        },

        /* @private */
        _attachListeners : function() {
            this._invoke("attachListeners");
        },

        /* @private - entry point for Widget. Not overrideable */
        _render: function() {

            var retValue = this.widget.fireEvent(YUI.BeforeRender);
            if (retValue === false) {
                return false;
            }
            this._invoke("render");
            this._attachListeners();

            this.widget.fireEvent(YUI.Render);
        },

        /* @private */
        // TODO: Move to Object with up/down boolean
        _invoke: function(method, args) {
            var constructor = this.constructor;
            if (constructor == Object.prototype.constructor) {
                // Hasn't been through YAHOO.util.extend;
                this[method].apply(this, args);
            } else {
                // Really required?

                // Don't see too much use for attachListener chaining. More often, 
                // it's over-ridden completely.
                while (constructor && constructor.prototype && constructor.prototype[method]) {
                    constructor.prototype[method].apply(this, args);
                    constructor = constructor.superclass ? constructor.superclass.constructor : null;
                }
            }
        }
    };

    YAHOO.widget.Widget = Widget;
    YAHOO.widget.WidgetRenderer = WidgetRenderer;

})();