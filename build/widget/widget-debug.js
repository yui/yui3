(function() {

    var M = function(Y) {
        /**
         * Provides Attribute configurations.
         * @namespace Y.util
         * @class Attribute
         * @constructor
         * @param hash {Object} The intial Attribute.
         * @param {Y.AttributeProvider} The owner of the Attribute instance.
         */
    
        Y.Attribute = function(name, map, owner) {
            this.name = name;
            if (owner) { 
                this.owner = owner;
                this.configure(map, true);
            }
        };

        Y.Attribute.prototype = {
            /**
             * The name of the attribute.
             * @property name
             * @type String
             */
            name: undefined,
    
            /**
             * The value of the attribute.
             * @property value
             * @type String
             */
            value: undefined,
    
            /**
             * The owner of the attribute.
             * @property owner
             * @type Y.AttributeProvider
             */
            owner: undefined,
    
            /**
             * Whether or not the attribute is read only.
             * @property readOnly
             * @type Boolean
             */
            readOnly: false,
    
            /**
             * Whether or not the attribute can only be written once.
             * @property writeOnce
             * @type Boolean
             */
            writeOnce: false,
    
            /**
             * The attribute's initial configuration.
             * @private
             * @property _initialConfig
             * @type Object
             */
            _initialConfig: undefined,
    
            /**
             * Whether or not the attribute's value has been set.
             * @private
             * @property _written
             * @type Boolean
             */
            _written: false,
    
            /**
             * The method to use when setting the attribute's value.
             * The method recieves the new value as the only argument.
             * @property set
             * @type Function
             */
            set: undefined,
    
            /**
             * The method to use when getting the attribute's value.
             * The method recieves the new value as the only argument.
             * @property get
             * @type Function
             */
            get: undefined,
    
            /**
             * The validator to use when setting the attribute's value.
             * @property validator
             * @type Function
             * @return Boolean
             */
            validator: undefined,
    
            /**
             * Retrieves the current value of the attribute.
             * @method getValue
             * @return {any} The current value of the attribute.
             */
            getValue: function() {
                return this.get ? this.get.apply(this.owner, arguments) : this.value;
            },

            /**
             * Sets the value of the attribute and fires beforeChange and change events.
             * @method setValue
             * @param {Any} value The value to apply to the attribute.
             * @param {Boolean} silent If true the change events will not be fired.
             * @return {Boolean} Whether or not the value was set.
             */
            setValue: function(value, silent) {
                var beforeRetVal,
                    retVal,
                    owner = this.owner,
                    name = this.name;
    
                var event = {
                    type: name, 
                    prevValue: this.getValue(),
                    newValue: value
                };

                if (this.readOnly || ( this.writeOnce && this._written) ) {
                    Y.log( 'setValue ' + name + ', ' +  value +
                            ' failed: read only', 'error', 'Attribute');
                    return false; // write not allowed
                }
    
                if (!silent) {
                    beforeRetVal = owner.fireBeforeChangeEvent(event);
                    if (beforeRetVal === false) { // TODO: event.preventDefault
                        Y.log('setValue ' + name + 
                                ' cancelled by beforeChange event', 'info', 'Attribute');
                        return false;
                    }
                }
    
                if (this.set) {
                    retVal = this.set.call(owner, value);
                }
    
                if (this.validator && !this.validator.call(owner, value) ) {
                    Y.log( 'setValue ' + name + ', ' + value +
                            ' validation failed', 'error', 'Attribute');
                    return false; // invalid value
                }
    
                this.value = (retVal === undefined) ? value : retVal;
                this._written = true;
    
                event.type = name;
    
                if (!silent) {
                    this.owner.fireChangeEvent(event);
                }
    
                return true;
            },
    
            /**
             * Allows for configuring the Attribute's properties.
             * @method configure
             * @param {Object} map A key-value map of Attribute properties.
             * @param {} init Whether or not this should become the initial config.
             */
            configure: function(map, init) {
                map = map || {};
                this._written = false; // reset writeOnce
                var silent = !!init; // silent set if initializing
    
                //this._initialConfig = this._initialConfig || {};
                for (var key in map) {
                    if ( key && Y.object.owns(map, key) ) {
                        if (key == 'value') {
                            if (map.readOnly && init) { // initialize readOnly with direct set
                                this.value = map[key];
                            } else {
                                this.setValue(map.value, silent);
                            }
                        } else {
                            this[key] = map[key];
                        }
                        /* TODO: need initialConfig?
                            if (init) {
                                this._initialConfig[key] = map[key];
                            }
                        */
                    }
                }
            },
    
            /**
             * Resets the value to the initial config value.
             * @method resetValue
             * @return {Boolean} Whether or not the value was set.
             */
            resetValue: function() {
                return this.setValue(this._initialConfig.value);
            },
    
            /**
             * Resets the attribute config to the initial config state.
             * @method resetConfig
             */
            resetConfig: function() {
                this.configure(this._initialConfig);
            },
    
            /**
             * Resets the value to the current value.
             * Useful when values may have gotten out of sync with actual properties.
             * @method refresh
             * @return {Boolean} Whether or not the value was set.
             */
            refresh: function(silent) {
                this.setValue(this.value, silent);
            }
        };

        /**
         * Provides and manages YUI.Attribute instances
         * @class AttributeProvider
         * @uses YUI.Event.Target
         */
         function AttributeProvider() {}

         AttributeProvider.prototype = {

            /**
             * A key-value map of Attribute configurations
             * @property _configs
             * @protected (may be used by subclasses and augmentors)
             * @private
             * @type {Object}
             */
            _configs: null,

            /**
             * Returns the current value of the attribute.
             * @method get
             * @param {String} key The attribute whose value will be returned.
             */
            get: function(key) {
                this._configs = this._configs || {};
                var config = this._configs[key];

                if (!config) {
                    Y.log(key + ' not found', 'warn', 'AttributeProvider');
                    return undefined;
                }

                return config.getValue();
            },

            /**
             * Sets the value of a config.
             * @method set
             * @param {String} key The name of the attribute
             * @param {Any} value The value to apply to the attribute
             * @param {Boolean} silent Whether or not to suppress change events
             * @return {Boolean} Whether or not the value was set.
             */
            set: function(key, value, silent) {
                this._configs = this._configs || {};
                var config = this._configs[key];
                if (!config) {
                    Y.log('set failed: ' + key + ' not found',
                            'error', 'AttributeProvider');
                    return false;
                }
                
                return config.setValue(value, silent);
            },

            /**
             * Returns an array of attribute names.
             * @method getAttributeKeys
             * @return {Array} An array of attribute names.
             */
            getAttributeKeys: function() {
                this._configs = this._configs;
                var keys = [];
                var config;
                for (var key in this._configs) {
                    config = this._configs[key];
                    if ( Y.object.owns(this._configs, key) && 
                            !Y.isUndefined(config) ) {
                        keys[keys.length] = key;
                    }
                }
                
                return keys;
            },

            /**
             * Sets multiple attribute values.
             * @method setAttributes
             * @param {Object} map  A key-value map of attributes
             * @param {Boolean} silent Whether or not to suppress change events
             */
            setAttributes: function(map, silent) {
                for (var key in map) {
                    if ( Y.object.owns(map, key) ) {
                        this.set(key, map[key], silent);
                    }
                }
            },

            /**
             * Resets the specified attribute's value to its initial value.
             * @method resetValue
             * @param {String} key The name of the attribute
             * @param {Boolean} silent Whether or not to suppress change events
             * @return {Boolean} Whether or not the value was set
             */
            resetValue: function(key, silent) {
                this._configs = this._configs || {};
                if (this._configs[key]) {
                    this.set(key, this._configs[key]._initialConfig.value, silent);
                    return true;
                }
                return false;
            },
        
            /**
             * Sets the attribute's value to its current value.
             * @method refresh
             * @param {Boolean} silent Whether or not to suppress change events
             */
            refresh: function(silent) {
                var keys = this.getAttributeKeys();
                
                for (var i = 0, len = keys.length; i < len; ++i) { 
                    this._configs[keys[i]].refresh(silent);
                }
            },
        
            /**
             * Returns the attribute's properties.
             * @method getAttributeConfig
             * @param {String} key The attribute's name
             * @private
             * @return {object} A key-value map containing all of the
             * attribute's properties.
             */
            getAttributeConfig: function(key) {
                this._configs = this._configs || {};
                var config = this._configs[key] || {};
                var map = {}; // returning a copy to prevent overrides
                
                for (key in config) {
                    if ( Y.object.owns(config, key) ) {
                        map[key] = config[key];
                    }
                }

                return map;
            },

            /**
             * Sets or updates an Attribute instance's properties. 
             * @method setAttributeConfig
             * @param {String} key The attribute's name.
             * @param {Object} map A key-value map of attribute properties
             * @param {Boolean} init Whether or not this should become the intial config.
             */
            setAttributeConfig: function(attr, map, init) {
                this._configs = this._configs || {};
                if (!this._configs[attr]) {
                    this._configs[attr] = this.createAttribute(attr, map);
                } else {
                    this._configs[attr].configure(map, init);
                }
            },

            /**
             * Sets or updates an array of Attribute instance's properties. 
             * @method setAttributeConfigs
             * @param {Array} configs An array of Attribute configs
             * @param {Boolean} init Whether or not this should become the intial config.
             */
            setAttributeConfigs: function(configs, init) {
                for (var attr in configs) {
                    if ( Y.object.owns(configs, attr) ) {
                        this.setAttributeConfig(attr, configs[attr], init);
                    }
                }
            },

            hasAttribute: function(prop) {
                return !! this._configs[prop];
            },

            /**
             * Resets an attribute to its intial configuration. 
             * @method resetAttributeConfig
             * @param {String} key The attribute's name.
             * @private
             */
            resetAttributeConfig: function(key) {
                this._configs = this._configs || {};
                this._configs[key].resetConfig();
            },

            // Wrapper for EventProvider.subscribe wrap type in name prefix
            subscribe: function(type, callback) {
                this._events = this._events || {};

                // Add "name" to type, ("menu:" + "click") when publishing
                type = this._prefixType(type);

                if ( !(type in this._events) ) {
                    // Is this required anymore? Y.Event.Target does this
                    // even more lazily (only when fired)
                    this._events[type] = this.publish(type);
                }

                Y.Event.Target.prototype.subscribe.apply(this, arguments);
            },

            // wrapper for EventProvider.fire to wrap type in name prefix
            fire: function(type, args) {
                // Add "name" to type, ("menu:" + "click") when publishing
                arguments[0] = this._prefixType(arguments[0]);
                Y.Event.Target.prototype.fire.apply(this, arguments);
            },

            on: function() {
                this.subscribe.apply(this, arguments);
            },

            addListener: function() {
                this.subscribe.apply(this, arguments);
            },

            /**
             * Fires the attribute's beforeChange event. 
             * @method fireBeforeChangeEvent
             * @param {String} key The attribute's name.
             * @param {Obj} e The event object to pass to handlers.
             */
            fireBeforeChangeEvent: function(e) {
                var type = 'before' + e.type.charAt(0).toUpperCase() + e.type.substr(1) + 'Change';
                e.type = this._prefixType(type);
                // Fire will prefix type
                return this.fire(type, e);
            },

            /**
             * Fires the attribute's change event. 
             * @method fireChangeEvent
             * @param {String} key The attribute's name.
             * @param {Obj} e The event object to pass to the handlers.
             */
            fireChangeEvent: function(e) {
                var type = e.type + 'Change';
                e.type = this._prefixType(e.type);
                // Fire will prefix type
                return this.fire(type, e);
            },

            createAttribute: function(name, map) {
                return new Y.Attribute(name, map, this);
            },

            _prefixType : function(type) {
                // TODO: Say if they pass in "calendar:click" to Menu. Do we return null? 
                // Or is their intention to capture bubble, and we just pass it through?
                if (type.indexOf(":") == -1) {
                   type = this.name + ":" + type;
                }
                return type;
            }
        };

        Y.augment(AttributeProvider, Y.Event.Target);
        Y.Attribute.Provider = AttributeProvider;

    };

    YUI.add("attribute", M, "3.0.0");
})();
(function() {

    var M = function(Y) {

        /**
         * Provides a base class for managed attribute based 
         * objects, which automates chaining of init and destroy
         * lifecycle methods and automatic instantiation of 
         * registered Attributes, through the static ATTR property
         * 
         * @class Base
         * @uses YUI.Attribute.Provider
         */
        function Base(config) {
            Y.log('constructor called', 'life', 'Base');
            this.init(config);
        }

        Base.NAME = 'base';

        /* No default attributes for Base */
        // Base.ATTRS = null;

        Base.prototype = {

            /**
             * Init lifecycle method, invoked during 
             * construction.
             * 
             * Provides beforeInit and init lifecycle events
             * (todo: registration mechanism, through config)
             * 
             * @method init
             * @final
             * @chain
             * @param {Object} config Configuration properties for the object
             */
            init: function(config) {
                Y.log('init called', 'life', 'Base');

                this.destroyed = false;
                this.initialized = false;
                this.name = this.constructor.NAME;

                if (this.fire('beforeInit') !== false) {

                    // Set name to current class, to use for events.

                    // initialize top down ( Base init'd first )
                    this._initHierarchy(config);
                    this.initialized = true;

                    this.fire('init', config);
                }
                return this;
            },


            /**
             * Init lifecycle method, invoked during 
             * construction.
             * 
             * Provides beforeInit and init lifecycle events
             * (todo: registration mechanism, through config)
             * 
             * @method destroy
             * @chain
             * @final
             */
            destroy: function() {
                Y.log('destroy called', 'life', 'Base');

                if (this.fire('beforeDestroy') !== false) {

                     // destruct bottom up ( Base destroyed last )
                    this._destroyHierarchy();
                    this.destroyed = true;

                    this.fire('destroy');
                }
                return this;
            },

            /**
             * Returns the top down class heirarchy for this object,
             * with YUI.Base being the first class in the array
             * 
             * @protected
             * @return {Array} array of classes
             */
            _getClasses : function() {
                if (!this._classes) {
                    var c = this.constructor, 
                        classes = [];

                    while (c && c.prototype) {
                        classes.unshift(c);
                        c = c.superclass ? c.superclass.constructor : null;
                    }
                    this._classes = classes;
                }
                return this._classes.concat();
            },

            /**
             * @private
             */
            _initHierarchy : function(config) {
                var attributes, 
                    attr,
                    constructor,
                    classes = this._getClasses();

                for (var i = 0; i < classes.length; i++) {
                    constructor = classes[i];
                    if (constructor.ATTRS) {
                        attributes = Y.merge(constructor.ATTRS);

                        Y.log('configuring' + constructor.NAME + 'attributes', 'attr', 'Base');

                        for (attr in config) {
                            if (attributes[attr]) {
                                // Not Cloning/Merging on purpose. Don't want to clone
                                // references to complex objects [ e.g. a reference to a widget ]
                                attributes[attr].value = config[attr];
                            }
                        }

                        this.setAttributeConfigs(attributes, true);
                    }
                    if (constructor.prototype.initializer) {
                        constructor.prototype.initializer.apply(this, arguments);
                    }
                }
            },

            /**
             * @private
             */
            _destroyHierarchy : function() {
                var constructor = this.constructor;
                while (constructor && constructor.prototype) {
                    if (constructor.destructor) {
                        constructor.prototype.destructor.apply(this, arguments);
                    }
                    constructor = constructor.superclass ? constructor.superclass.constructor : null;
                }
            },

            toString: function() {
                return Base.NAME + "[" + this + "]";
            }
        };

        Y.augment(Base, Y.Attribute.Provider);
        Y.Base = Base;
    };

    YUI.add("base", M, "3.0.0");
})();

(function() {

    var M = function(Y) {

        // TODO: Move to Y.add/register
        var _registry = {};

        function Plugin(config) {
            Plugin.superclass.constructor.apply(this, arguments);
        }

        // No attributes
        // Plugin.ATTRS = null

        Plugin.NAME = "plugin";
        Plugin.NS = "plugin";

        // TODO: Move to Y.add
        Plugin.add = function(pluginclass) {
            if (pluginclass.NS) {
                _registry[pluginclass.NS] = pluginclass;
            }
        };

        Plugin.get = function(ns) {
            return _registry[ns];
        };

        var proto = {

            _listeners: null,
            _overrides: null,

            initializer : function(config) {

                if (!config.owner) {
                    throw('plugin needs to have an owner defined');
                }

                this.owner = config.owner;

                this._listeners = [];
                this._overrides = [];

                Y.log('Initializing: ' + this.constructor.NAME, 'info', 'Plugin');
            },

            destructor: function() {
                var i;

                for (i = 0; i < this._listeners.length; i++) {
                    var event = this._listeners[i];
                    if (Y.isObject(event)) {
                        event.obj.unsubscribe(event.ev, event.fn);
                    }
                }

                for (i = 0; i < this._overrides.length; i++) {
                    var o = this._overrides[i];
                    if (Y.isObject(o)) {
                        o.obj[o.method] = o.fn;
                        this._overrides[i] = null;
                    }
                }
            },

            // TODO: Change to use Event Handle, once implemented (and then use Y.bind)
            listen: function(obj, ev, fn, s, o) {
                this._listeners[this._listeners.length] = { obj: obj, ev: ev, fn: fn };
                obj.on(ev, fn, s, o);
            },

            // TODO: Change to use Event Handle, once implemented (and then use Y.bind)
            nolisten: function(obj, ev, fn) {
                obj.unsubscribe(ev, fn);
                for (var i = 0; i < this._listeners.length; i++) {
                    if ((this._listeners[i].ev == ev) && (this._listeners[i].fn == fn) && (this._listeners[i].obj == obj)) {
                        this._listeners[i] = null;
                        break;
                    }
                }
            },

            // TODO: Change to use Event Handle, once implemented (and Y.bind)
            listenBefore: function(obj, ev, fn, s, o) {
                ev = 'before' + ev.charAt(0).toUpperCase() + ev.substr(1) + 'Change';
                this.listen(obj, ev, fn, s, o);
            },

            // TODO: Change to use Event Handle, once implemented (and Y.bind)
            nolistenBefore: function(obj, ev, fn) {
                ev = 'before' + ev.charAt(0).toUpperCase() + ev.substr(1) + 'Change';
                this.nolisten(obj, ev, fn);
            },

            addOverride: function(obj, method, fn) {
                if (Y.isFunction(obj[method]) && Y.isFunction(fn)) {
                    this._overrides[this._overrides.length] = { method: method, obj: obj, fn: obj[method] };
                    obj[method] = fn;
                } else {
                    Y.log('Method (' + method + ') does not belong to object', 'error', 'Plugin');
                }
            },

            removeOverride: function(obj, method) {
                for (var i = 0; i < this._overrides.length; i++) {
                    var o = this._overrides[i];
                    if ((o.obj == obj) && (o.method == method)) {
                        obj[method] = o.fn;
                        this._overrides[i] = null;
                    }
                }
            },

            setSilent: function(obj, config, val) {
                obj._configs[config].value = val;
            },

            toString: function() {
                return this.constructor.NAME + "[" + this.constructor.NS + "]";
            }
        };

        Y.extend(Plugin, Y.Base, proto);
        Y.Plugin = Plugin;
    };

    YUI.add("plugin", M, "3.0.0");
})();
(function() {

    var M = function(Y) {

        var P = Y.Plugin;

        // String constants, don't want to create
        // literals everytime they are used.
        var PREFIX = "yui-",
            HIDDEN = PREFIX + "hidden",
            DISABLED = PREFIX + "disabled";

        // Widget id-to-instance map
        var _instances = {};

        /**
         * A base class for widgets, providing:
         * <ul>
         *    <li>The render lifecycle method to the init and destroy lifecycle 
         *        methods provide by Base</li>
         *    <li>Abstract methods to support consistent MVC structure across 
         *        widgets: renderer, initUI, syncUI</li>
         *    <li>Event subscriber support when binding listeners for model, ui 
         *        synchronization: onUI, setUI</li>
         *    <li>Support for common widget attributes, such as id, node, visible, 
         *        disabled, strings</li>
         *    <li>Plugin registration and activation support</li>
         * </ul>
         * 
         * @param config {Object} Object literal specifying widget configuration 
         * properties (may container both attributes and non attribute configuration).
         * 
         * @class YUI.Widget
         * @extends YUI.Base
         */
        function Widget(config) {
            Y.log('constructor called', 'life', 'Widget');

            this._normalizeNodeId(config);

            this.rendered = false;
            this._plugins = {};

            Widget.superclass.constructor.apply(this, arguments);
        }

        /**
         * Static property used to provie a string to identify the class.
         * Currently used to apply class identifiers to the root node
         * and to classify events.
         * 
         * @property YUI.Widget.NAME
         * @type {String}
         * @static
         */
        Widget.NAME = "widget";

        /**
         * Static property used to define default attribute configuration
         * for the Widget.
         * 
         * @property YUI.Widget.ATTRS
         * @type {Object}
         */
        Widget.ATTRS = {
            id: {},

            node: {},

            parent: {}, // TODO, reconcile parent, id, node

            disabled: {
                value: false
            },

            visible: {
                value: false
            },

            strings: {
                // Widget UI strings go here
            }
        };

        /**
         * Getter to obtain Widget instances by id.
         * 
         * @method YUI.Widget.getById
         * @param id {String} Id used to identify the widget uniquely.
         * @return {Widget} Widget instance
         */
        Widget.getById = function(id) {
            return _instances[id];
        };

        var proto = {

            /**
             * Initializer lifecycle implementation for the Widget class.
             * 
             * Base.init will invoke all prototype.initializer methods, for the
             * class hierarchy (starting from Base), after all attributes have 
             * been initialized.
             * 
             * @param  config {Object} Configuration obejct literal for the widget
             */
            initializer: function(config) {
                Y.log('initializer called', 'life', 'Widget');
                this._initPlugins(config);

                _instances[this.get('id')] = this;
            },

            /**
             * Descructor lifecycle implementation for the Widget class.
             * 
             * Base.destroy will invoke all prototype.destructor methods, for the
             * class hierarchy (starting from the lowest sub-class).
             * 
             * @param  config {Object} Configuration obejct literal for the widget
             */
            destructor: function() {
                Y.log('destructor called', 'life', 'Widget');

                this._destroyPlugins();
                delete _instances[this.get('id')];
            },

            /**
             * Establishes the initial DOM for the widget. Invoking this
             * method will lead to the creating of all DOM elements for
             * the widget (or the manipulation of existing DOM elements 
             * for the progressive enhancement use case).
             * <p>
             * This method should only be invoked once for an initialized
             * widget.
             * </p>
             * <p>
             * It delegates to the widget specific renderer method to do
             * the actual work.
             * </p>
             * 
             * @method render
             * @public
             * @chain
             * @final 
             */
            render: function() {
                if (this.destroyed) {
                    throw('render failed; widget has been destroyed');
                }

                if (!this._rendered && this.fire("beforeRender") !== false) {

                    if (this.renderer) {
                        this.renderer();
                    }

                    this._initUI();
                    this._syncUI();

                    this.rendered = true;
                    this.fire("render");
                }

                return this;
            },

            /** 
             * Creates DOM (or manipulates DOM for progressive enhancement)
             * This method is invoked by render() and is not chained 
             * automatically for the class hierarchy (like initializer, destructor) 
             * so it should be chained manually for subclasses if required.
             * 
             * @method renderer
             */
            renderer: function() {},

            /**
             * Configures/Setsup listeners to bind Widget State to UI/DOM
             * 
             * This method is not called by framework and is not chained 
             * automatically for the class hierarchy.
             * 
             * @method initUI
             */
            initUI: function(){},

            /**
             * Refreshes the rendered UI, based on Widget State
             * 
             * This method is not called by framework and is not chained
             * automatically for the class hierarchy.
             * 
             * @method syncUI
             */
            syncUI: function(){},

            /**
             * Sets the state of an attribute, based on UI state
             * change. Used to indentify the source of a change as 
             * UI based, so corresponding onUI listeners are not
             * invoked (since the UI state is already in sync)
             * 
             * @method setUI
             * @param name {String} attribute name
             * @param value {Any} attribute value
             * @param eventCfg {Object|boolean} Event configuration for the
             * set - silent, source etc. If boolean, true, the set occurs 
             * silently
             */
            setUI: function() {
                // TODO: Will identify sets with UI sources, once Event 
                // and AttributeProvider support is in place for event 
                // data
                return this.set.apply(this, arguments);
            },

            /**
             * Sets up an event listeners specifically to sync UI with
             * attribute state. These listeners will NOT be invoked if 
             * the setUI method is used to set the attribute (see setUI)
             * 
             * @method onUI
             * @param type {String} type of event
             * @param callback {Function} handler for the event
             */
            onUI: function() {
                // TODO: Will identify listeners for UI sources, once 
                // Event and AttributeProvider support is in place for 
                // event data
                return this.on.apply(this, arguments);
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

            /**
             * Sets the state of an attribute. Wrapper for
             * AttributeProvider.set, with additional ability 
             * to chain.
             * 
             * TODO: Check with Matt. How is this supposed 
             * to work if AttributeProvider set expects a return
             * value.
             * 
             * @method setUI
             * @chain
             */
            /*
            set: function() { // extend to chain set calls
                Y.Attribute.Provider.prototype.set.apply(this, arguments);
                return this;
            },
            */

            // TODO: Reimplement with new Node Facade
            getNodeAttr: function(attr) {
                if (this._node) {
                    return this._node[attr];
                }
                return undefined;
            },

            // TODO: Reimplement with new Node Facade
            setNodeAttr: function(attr, val) {
                if (this._node) {
                    this._node[attr] = val;
                }
                return this;
            },

            /**
             * Register and instantiate a plugin with the Widget.
             * 
             * @param p {String | Object |Array} Accepts the registered 
             * namespace for the Plugin or an object literal with an "ns" property
             * specifying the namespace for the Plugin and a "cfg" property specifying
             * the configuration for the Plugin.
             * <p>
             * Additionally an Array can also be passed in, with either String or 
             * Object literal elements, allowing for multiple plugin registration in 
             * a single call
             * </p>
             * @method plug
             * @chain
             * @public
             */
            plug: function(p) {
                var a = arguments,
                    p = a[0];
                if (Y.lang.isArray(p)) {
                    var ln = p.length;
                    for (var i = 0; i < ln; i++) {
                        this.plug(p[i]);
                    }
                } else if (Y.lang.isString(p)) {
                    this._plug(p);
                } else {
                    this._plug(p.ns, p.cfg);
                }
                return this;
            },

            /**
             * Unregister and destroy a plugin already instantiated with the Widget.
             * 
             * @method unplug
             * @param {String} ns The namespace key for the Plugin
             * @chain
             * @public
             */
            unplug: function(ns) {
                if (ns) {
                    this._unplug(ns);
                } else {
                    for (ns in this._plugins) {
                        this._unplug(ns);
                    }
                }
                return this;
            },

            /**
             * Determines if a plugin has been registered and instantiated 
             * for this widget.
             * 
             * @method hasPlugin
             * @public
             * @return {Boolean} returns true, if the plugin has been applied
             * to this widget.
             */
            hasPlugin : function(ns) {
                return (this._plugins[ns] && this[ns]);
            },

            /**
             * @private
             */
            _initPlugins: function(config) {

                // Class Configuration
                var classes = this._getClasses(), constructor;
                for (var i = 0; i < classes.length; i++) {
                    constructor = classes[i];
                    if (constructor.PLUGINS) {
                        this.plug(constructor.PLUGINS);
                    }
                }

                // User Configuration
                if (config && config.plugins) {
                    this.plug(config.plugins);
                }
            },

            /**
             * For readability, symmetry - wrapper for _unplug
             * // TODO - should be able to just do ??
             * 
             * _destoryPlugins: this._unplug
             * @private
             */
            _destroyPlugins: function() {
                this._unplug();
            },

            /**
             * @private
             */
            _plug: function(ns, config) {
                if (ns) {
                    var PluginClass = P.get(ns);
                    if (PluginClass) {

                        config = config || {};
                        config.owner = this;

                        if (this.hasPlugin(ns)) {
                            // Update config
                            this[ns].setAttributeConfigs(config, false);
                        } else {
                            // Create new instance
                            this[ns] = new PluginClass(config);
                            this._plugins[ns] = PluginClass;
                        }
                    }
                }
            },

            /**
             * @private
             */
            _unplug : function(ns) {
                if (ns) {
                    if (this[ns]) {
                        this[ns].destroy();
                        delete this[ns];
                    }
                    if (this._plugins[ns]) {
                        delete this._plugins[ns];
                    }
                }
            },

            /**
             * @protected
             */
            _initUI: function() {
                this._initRootNode();

                this.onUI('visibleChange', this._onVisibleChange);
                this.onUI('disabledChange', this._onDisabledChange);
            },

            /**
             * Syncs state of the UI with the widget state
             * @protected
             */
            _syncUI: function() {
                this._uiSetVisible(this.get('visible'));
                this._uiSetDisabled(this.get('disabled'));
            },

            /**
             * Sets the state of the visible UI
             * 
             * @protected
             * @param {boolean} val
             */
            _uiSetVisible: function(val) {
                if (val === true) { 
                    Y.Dom.removeClass(this._node, HIDDEN); 
                } else {
                    Y.Dom.addClass(this._node, HIDDEN); 
                }
            },

            /**
             * Sets the state of the disabled/enabled UI
             * 
             * @protected
             * @param {boolean} val
             */
            _uiSetDisabled: function(val) {
                if (val === true) {
                    Y.Dom.addClass(this._node, DISABLED);
                } else {
                    Y.Dom.removeClass(this._node, DISABLED);
                }
            },

            _normalizeNodeId : function(config) {

                if (_instances[config.id]) {
                    throw('unique id required');
                }

                /*
                if (!config.id && !config.node && !config.parent) {
                    throw('You need to specify and id, node or parent to provide a location in the DOM to insert the widget');
                }

                if (config.node && config.node.get) {
                    if (config.node.get("id")) {
                        config.id = config.node.get("id");
                    } else {
                        config.id = Y.Dom.generateId();
                        config.node.set("id", config.id);
                    }
                }

                if (!config.id) {
                    config.id = Y.Dom.generateId();
                }
                */
            },

            _initRootNode: function() {

                // TODO: Node to Id, Id to Node
                this._node = Y.Dom.get(this.get('id'));
                this.set('node', this._node);

                var classes = this._getClasses(), constructor;

                // Starting from 1, because we don't need Base (yui-base) marker
                for (var i = 1; i < classes.length; i++) {
                    constructor = classes[i];
                    if (constructor.NAME) {
                        Y.Dom.addClass(this._node, PREFIX + constructor.NAME.toLowerCase());
                    }
                }
            },

            /**
             * Visible attribute UI handler
             * 
             * @param {Object} evt
             */
            _onVisibleChange: function(evt) {
                this._uiSetVisible(evt.newValue);
            },

            /**
             * Disabled attribute UI handler
             * 
             * @param {Object} evt
             */
            _onDisabledChange: function(evt) {
                this._uiSetDisabled(evt.newValue);
            },

            toString: function() {
                return this.constructor.NAME + "[" + this.get('id') + "]";
            },

            /**
             * Used when dynamically creating the bounding box node for the widget
             */
            ROOT_NODE: "div"
        };

        /**
         * Static registration of default plugins for the class.
         * 
         * @property Y.Widget.PLUGINS
         * @static
         */
        Widget.PLUGINS = [
            // Placeholder for Widget Class Default plugins
            // {ns:P.Mouse.NS, cfg:mousecfg}
        ];

        Y.extend(Widget, Y.Base, proto);
        Y.Widget = Widget;
    };

    YUI.add("widget", M, "3.0.0");
})();

