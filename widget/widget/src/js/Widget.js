(function() {

    var Y = YAHOO.util,
        YUI = YAHOO.lang.CONST;

    // constructor
    function Widget(attributes) {
        YAHOO.log('constructor called', 'life', 'Widget');
        Widget.superclass.constructor.call(this, attributes);
    }

    Widget.NAME = "Widget";

    Widget.CONFIG = {
        'node': { // TODO: is there a better name?  revert to 'root'? 
            set: function(node) {
                this._node = Y.Dom.get(node);
                Y.Dom.generateId(node); // use existing or generate new ID
                return this._node;
            }
        },
        'visible': {
            set: function(val) {
                if (val) { 
                    Y.Dom.removeClass(this._node, YUI.CLASSES.HIDDEN); 
                } else {
                    Y.Dom.addClass(this._node, YUI.CLASSES.HIDDEN); 
                }
            },
            value: true
        },
        'disabled': {
            set: function(val) {
                if (val) {
                    Y.Dom.addClass(this._root, YUI.CLASSES.DISABLED);
                } else {
                    Y.Dom.removeClass(this._root, YUI.CLASSES.DISABLED);
                }
            },
            value: false
        }
    };

    Widget.PLUGINS = {
        'mouse': YAHOO.plugins.Mouse
    };

    var _instances = {};

    Widget.getByNodeId = function(id) {
        return _instances[id]; 
    };

    // public 
    var proto = {
        initializer: function(attributes) {
            YAHOO.log('initializer called', 'life', 'Widget');
            this.initPlugins();
            _instances[this.getNodeAttr('id')] = this; // TODO: can we assume node has id ?
        },

        initPlugins: function(plugins) {
            this._plugins = {};
            var Klass;
            for (var plugin in plugins) { // user defined
                    this._plugins[plugin] = new plugins[plugin](this);
            }

            for (var plugin in Widget.PLUGINS) { // default
                this._plugins[plugin] = this._plugins[plugin] || new Widget.PLUGINS[plugin](this);
            }
        },

        renderer: function() {

        },

        destructor: function() {
            YAHOO.log('destructor called', 'life', 'Widget');
            delete _instances[this.getNodeAttr('id')];
        },

        /* @final */
        render: function() {
            if (this.get('destroyed')) {
                throw('render failed; widget has been destroyed');
            }

            var retValue = this.fireEvent(YUI.BeforeRender);
            if (retValue === false || this._rendered) {
                return false;
            }

            Y.Dom.addClass(this._node, YUI.PREFIX + this.constructor.NAME.toLowerCase());
            this.renderer();
            this._rendered = true;
            this.fireEvent(YUI.Render);
        },

        /* @final */
        erase: function() {
            var retValue = this.fireEvent(YUI.BeforeErase);
            if (retValue === false) {
                return false;
            }
            this._node.removeClass(YUI.PREFIX + this.constructor.NAME.toLowerCase());
            if (this.view.erase) {
                this.view.erase();
            }
            this._rendered = false;
            this.fireEvent(YUI.Erase);
        },

        hide: function() {
            this.set('visible', false);
        },

        show: function() {
            this.set('visible', true);
        },

        enable: function() {
            this.set('enabled', true);
        },

        disable: function() {
            this.set('disabled', false);
        },

        getNodeAttr: function(attr) {
            return this._node[attr];
        },

        setNodeAttr: function(attr, val) {
            this._node[attr] = val;
        },

        toString: function() {
            return this.constructor.NAME + this.get('node').get('id');
        }
    };

    YAHOO.lang.extend(Widget, Y.Object, proto);
    YAHOO.lang.augmentProto(Widget, YAHOO.plugin.PluginHost);
    YAHOO.widget.Widget = Widget;
})();
