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

    Widget.NAME = "Widget";

    Widget.CONFIG = {
        'node': {
            set : function(node) {
                this.__.node = (node.get) ? node : Y.Element.get(node); // TODO: more robust Element test
                return this.__.node;
                // TODO: require Y.Element? re-initialize?
            },
            validator : function(el) {
                return true;//!!el.tagName || el.get;
            }
        },
        'visible' : {
            set: function() {
                this._setNodeAttribute('visible', val);
            },
            get: function() {
                this.__.node.get('visible', val);
            },
            readOnly: true,
            value: true
        },
        'disabled' : {
            set: function(val) {
                this._setNodeAttribute('disabled', val);
            },
            value: false
        },
        'focused' : {
            set: function(val) {
                this._setNodeAttribute('focused', val);
            },
            value: false
        },
        'width' : {
            set : function(val) {
                this.get('node').setStyle('width', val);
            }
        },
        'height' : {
            set : function(val) {
                this.get('node').setStyle('height', val);
            }
        }
    };

    var _instances = {};

    Widget.getByNodeId = function(id) {
        return _instances[id]; 
    };

    // public 
    var proto = {

        viewClass : WidgetView,
        controllerClass : WidgetController,

        initializer : function(attributes) {
            YAHOO.log('initializer called', 'life', 'Widget');
            this.initPlugins();
            _instances[this.__.node.get(YUI.ID)] = this;
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
            if (this.get('destroyed')) {
                throw('render failed; widget has been destroyed');
            }

            var retValue = this.fireEvent(YUI.BeforeRender);
            if (retValue === false || this._.rendered) {
                return false;
            }

            this.__.node.addClass(YUI.PREFIX + this.constructor.NAME.toLowerCase());

            if (!this._.mvcInst) {
                this.view = new this.viewClass(this);

                if (!YAHOO.lang.isFunction(this.view.render)) {
                    throw new TypeError("View needs to implement a render() method");
                }
                this._.mvcInst = true;
            }
            this.view.render();

            this._.rendered = true;
            this.fireEvent(YUI.Render);
        },

        /* @final */
        erase : function() {
            var retValue = this.fireEvent(YUI.BeforeErase);
            if (retValue === false) {
                return false;
            }
            this.__.node.removeClass(YUI.PREFIX + this.constructor.NAME.toLowerCase());
            if (this.view.erase) {
                this.view.erase();
            }
            this._.rendered = false;
            this.fireEvent(YUI.Erase);
        },

        hide : function() {
            this.get('node').set('visible', false);
        },

        show : function() {
            this.get('node').set('visible', true);
        },

        enable : function() {
            this.get('node').set('enabled', true);
        },

        disable : function() {
            this.get('node').set('disabled', false);
        },

        focus : function() {
            this.get('node').set('focused', true);
        },

        blur : function() {
            this.get('node').set('focused', false);
        },

        toString : function() {
            return this.constructor.NAME + this.get('node').get('id');
        },

        _setNodeAttribute : function(attr, val) {
            this.__.node.set(attr, val);
        }
    };

    YAHOO.lang.extend(Widget, Y.Object, proto);

    //YAHOO.lang.augmentObject(Widget, Y.Object); // add static members

    YAHOO.lang.augmentProto(Widget, YAHOO.plugin.PluginHost);

    function WidgetView(widget) {
        this.widget = widget;
        var c = new this.widget.controllerClass(this.widget, this);
    }

    WidgetView.prototype = {
        render : function() {
            /* Abstract, Implement me for intial render */
        },

        update : function() {
            /* Abstract, Implement me to refresh the root nodes you just added */
        },

        super : function() {
            this.constructor.superclass.constructor.apply(this, arguments);
        }
    };

    function WidgetController(widget, view) {
        this.widget = widget;
        this.view = view;
        this.widget.subscribe("render", this.apply, this, true);
    }

    WidgetController.prototype = {
        apply : function() {
            /* Abstract, Implement me to apply listeners */
        },

        super : function() {
            this.constructor.superclass.constructor.apply(this, arguments);
        }
    };

    YAHOO.widget.Widget = Widget;
    YAHOO.widget.WidgetView = WidgetView;
    YAHOO.widget.WidgetController = WidgetController;

})();
