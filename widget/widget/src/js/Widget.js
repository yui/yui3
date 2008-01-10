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
            if (!attributes.id || _instances[attributes.id]) {
                throw new Error('unique id is required');
            }
            _instances[attributes.id] = this;
            this.initPlugins();
        },

        initUI: function() {},

        syncUI: function() {},

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

        renderer: function() {},

        destructor: function() {
            YAHOO.log('destructor called', 'life', 'Widget');
            delete _instances[this.get('id')];
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

            this._initUI();
            this._syncUI();
            this.renderer();
            this._rendered = true;
            this.fireEvent(YUI.Render);
            return this;
        },

        hide: function() {
            this.set('visible', false);
            return this;
        },

        show: function() {
            this.set('visible', true);
            return this;
        },

        enable: function() {
            return this.set('enabled', true);
        },

        disable: function() {
            return this.set('disabled', false);
        },

        set: function() { // extend to chain set calls
            YAHOO.util.AttributeProvider.prototype.set.apply(this, arguments);
            return this;
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
            return this;
        },

        toString: function() {
            return this.constructor.NAME + this.get('node').get('id');
        },

        _initUI: function() {
            this._initRootNode();
            this.on('visibleChange', this._onVisibleChange);
            this.on('disabledChange', this._onDisabledChange);
        },

        _syncUI: function() {
            this._uiSetVisible(this.get('visible'));
            this._uiSetDisabled(this.get('disabled'));
        },

        _uiSetVisible: function(val) {
            if (val === true) { 
                Y.Dom.removeClass(this._node, YUI.CLASSES.HIDDEN); 
            } else {
                Y.Dom.addClass(this._node, YUI.CLASSES.HIDDEN); 
            }

        },

        _uiSetDisabled: function(val) {
            if (val === true) {
                Y.Dom.addClass(this._root, YUI.CLASSES.DISABLED);
            } else {
                Y.Dom.removeClass(this._root, YUI.CLASSES.DISABLED);
            }

        },
        _initRootNode: function() {
            this._node = Y.Dom.get(this.get('id'));
            this.set('node', this._node);
            Y.Dom.addClass(this._node, YUI.PREFIX + this.constructor.NAME.toLowerCase());
        },

        _onVisibleChange: function(evt) {
            this._uiSetVisible(evt.newValue);
        },

        _onDisabledChange: function(evt) {
            this._uiSetDisabled(evt.newValue);
        }

    };

    Widget.NAME = "Widget";

    var _instances = {};

    Widget.getById = function(id) {
        return _instances[id]; 
    };

    Widget.CONFIG = {
        'id': {},

        'node': {},

        'visible': {
            value: true
        },

        'disabled': {
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
