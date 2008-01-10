(function() {

    var Y = YAHOO.util,
        YUI = YAHOO.lang.CONST;

    // constructor
    function Widget(attributes) {
        YAHOO.log('constructor called', 'life', 'Widget');
        Widget.superclass.constructor.call(this, attributes);
    }

    // public 
    var proto = {
        initializer: function(attributes) {
            YAHOO.log('initializer called', 'life', 'Widget');

            this._initRootNode();
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

            this.renderer();
            this._rendered = true;
            this.fireEvent(YUI.Render);
        },

        _initRootNode: function() {
            var node = this._node;

            if (!node) {
                this.set('node', this.get('id')); // get from Dom by ID if no default node provided
            }
            Y.Dom.addClass(this._node, YUI.PREFIX + this.constructor.NAME.toLowerCase());
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
            if (this._node) {
                return this._node[attr];
            }
            return undefined;
        },

        setNodeAttr: function(attr, val) {
            if (this._node) {
                this._node[attr] = val;
            }
        },

        _setId: function(val) {
            this.setNodeAttr('id', val);
        },

        _setNode: function(val) {
            this._node = Y.Dom.get(val);
            Y.Dom.generateId(val); // use existing or generate new ID
            return this._node;
        },

        _setVisible: function(val) {
            if (val) { 
                Y.Dom.removeClass(this._node, YUI.CLASSES.HIDDEN); 
            } else {
                Y.Dom.addClass(this._node, YUI.CLASSES.HIDDEN); 
            }

        },

        _setDisabled: function(val) {
            if (val) {
                Y.Dom.addClass(this._root, YUI.CLASSES.DISABLED);
            } else {
                Y.Dom.removeClass(this._root, YUI.CLASSES.DISABLED);
            }

        },

        // override AttributeProvider method
        createAttribute: function(name, map) {
            return new YAHOO.widget.WidgetAttribute(name, map, this);
        },

        toString: function() {
            return this.constructor.NAME + this.get('node').get('id');
        }
    };

    Widget.NAME = "Widget";

    var _instances = {};

    Widget.getById = function(id) {
        return _instances[id]; 
    };

    Widget.CONFIG = {
        'id': {
            set: proto._setId
        },

        'node': { // TODO: is there a better name?  revert to 'root'? 
            set: proto._setNode
        },

        'visible': {
            set: proto._setVisible,
            postRender: true,
            value: true
        },

        'disabled': {
            set: proto._setDisabled,
            value: false
        }
    };

    Widget.PLUGINS = {
        'mouse': YAHOO.plugins.Mouse
    };


    YAHOO.lang.extend(Widget, Y.Object, proto);
    YAHOO.lang.augmentProto(Widget, YAHOO.plugin.PluginHost);
    YAHOO.widget.Widget = Widget;
})();
