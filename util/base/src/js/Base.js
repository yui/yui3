YUI.add('base', function(Y) {

    var L = Y.lang,
        O = Y.object;

    /**
     * Provides a base class for managed attribute based 
     * objects, which automates chaining of init and destroy
     * lifecycle methods and automatic instantiation of 
     * registered Attributes, through the static ATTR property
     * 
     * @class Base
     * @uses YUI.Attribute.Provider
     */
    function Base() {
        Y.log('constructor called', 'life', 'Base');
        this.init.apply(this, arguments);
    };

    Base.NAME = 'base';
    Base._instances = {};

    Y.CANCEL = 'yui:cancel',


    // TODO: We could have the entry point be something other than initializer, for example initExt.
    // Thought initializer would provide symmetry with Base development.
    // Constructor maybe suitable also. Would avoid backup/restore step
    
    // TODO: Do we need to break Array/Object references
    Base.build = function(main, features) {

        var newClass = Base.build._getTemplate(main),
            key = main.NAME;

        // - Copy Prototype-to-Prototype
        // - Copy Static-to-Static
        // - Add feature classes
        Y.augment(newClass, main);
        Y.mix(newClass, main);
        Y.each(features, function(featureClass) {

            // - Backup initializer.
            if (featureClass.prototype.initializer) {
                var initializer = featureClass.prototype.initializer;
                delete featureClass.prototype.initializer;
            }

            // - Aggregate KNOWN Static-to-Static
            // - Copy Prototype-to-Prototype
            // - Copy other Static-to-Static (no overwrite or whitelist, so known aggregates should not get blown away)
            Y.aggregate(newClass, featureClass, false, Base.build._aggregates);
            Y.augment(newClass, featureClass);
            Y.mix(newClass, featureClass);

            // - Restore initializer
            if (initializer) {
                newClass._build.inits.push(initializer);
                featureClass.prototype.initializer = initializer; 
            }

            key = key + ":" + featureClass.NAME;
            newClass.NAME = key;
        });

        // Use to cache later, for Y.create
        newClass._build.id = key;

        return newClass;
    };

    Base.build._aggregates = ['ATTRS', 'PLUGINS', 'CLASSNAMES'];

    Base.build._getTemplate = function(main) {

        function BuiltClass(){
            this.constructor = BuiltClass;
            main.apply(this, arguments);

            var inits = BuiltClass._build.inits;
            for (var i = 0; i < inits.length; i++) {
                inits[i].apply(this, arguments);
            }

            return this;
        };

        BuiltClass._build = {
            id : null,
            inits : []
        }

        return BuiltClass;
    };

    Base.create = function(main, features, args) { 
        // TODO: allow just Base.create(arg1, ar2, etc)?
        var c = Y.Base.build(main, features),
            cArgs = Y.array(arguments, 2, true);
        return c.apply({}.prototype = c.prototype, cArgs);
    };

    /* No default attributes for Base */
    // Base.ATTRS = null;

    Base.prototype = {

        /**
         * Init lifecycle method, invoked during 
         * construction.
         * 
         * Provides beforeInit and init lifecycle events
         * (TODO: registration mechanism for beforeInit, init through config)
         * 
         * @method init
         * @final
         * @chain
         * @param {Object} config Configuration properties for the object
         */
        init: function(config) {
            Y.log('init called', 'life', 'Base');

            if (this.fire('beforeInit') !== Y.Base.CANCEL) {
                Y.Base._instances[Y.stamp(this)] = this;

                this._destroyed = false;
                this._initialized = false;
                this._eventHandlers = {};

                // Set name to current class, to use for events.
                this.name = this.constructor.NAME;

                // initialize top down ( Base init'd first )
                this._initHierarchy(config);
                this._initialized = true;
            }
            return this;
        },

        /**
         * Init lifecycle method, invoked during 
         * construction.
         * 
         * Provides beforeDestory and destroy lifecycle events
         * 
         * @method destroy
         * @chain
         * @final
         */
        destroy: function() {
            Y.log('destroy called', 'life', 'Base');

            if (this.fire('beforeDestroy') !== Y.Base.CANCEL) {

                 // destruct bottom up ( Base destroyed last )
                this._destroyHierarchy();
                this._destroyed = true;

                this.fire('destroy');
            }
            return this;
        },

        /**
         * Utility methods, to register and unregister listeners in 
         * named sets. These will save the handles for the listeners,
         * keyed by the set name.
         * 
         * @param {Object} category
         * @param {Object} listeners
         * @param {Object} replace
         */
        // TODO:DEPENDENCY - Event handles and possibly handle bubbling use case
        attachListeners: function(category, listeners, replace) {
            var e = this._eventHandles, 
                    handles;

            if (!e[category]) {
                e[category] = handles = [];

                // Not using Y.bind, to avoid the extra call/apply wrapper
                Y.each(listeners, function(value, key, object) {
                    if (key.indexOf(":") !== -1) {
                        // TODO: Say if we want to listen for "button:click" in editor (event bubbling)?
                        handles[handles.length] = Y.on(key, value);
                    } else {
                        handles[handles.length] = this.on(key, value);
                    }
                }, this);

            } else {
                if (replace) {
                    this.detachListeners(category);
                    this.attachListeners(category, listeners);
                }
            }
        },

        detachListeners: function(category) {
            var e = this._eventHandles;
            var handles = e[category];
            if (handles) {
                var l = handles.length;
                for (var h = 0; h < l; h++) {
                    h.detach();
                };
                delete e[category];
            }
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
        _initHierarchy : function(conf) {
            var attributes, 
                att,
                constructor,
                classes = this._getClasses();

            for (var i = 0; i < classes.length; i++) {
                constructor = classes[i];
                if (constructor.ATTRS) {
                    // Clone constructor.ATTRS, to a local copy
                    attributes = Y.merge(constructor.ATTRS);

                    Y.log('configuring ' + constructor.NAME + 'attributes', 'info', 'Base');

                    for (att in attributes) {
                        if (O.owns(attributes, att)) {
                            var val = attributes[att];

                            if (conf && O.owns(conf, att)) {

                                // TODO: COMMENTING, UNTIL COMPLEX ATTR FINALIZED
                                // if (!L.isObject(attributes[att])) {
                                //     attributes[att] = {};
                                // }

                                // Not Cloning/Merging on purpose. Don't want to clone
                                // references to complex objects [ e.g. a reference to a widget ]
                                // This means the user has to clone anything coming in, if they 
                                // want it detached

                                // attributes[att].value = conf[att];

                                val = conf[att];
                            }
                            this.set(att, val);
                        }
                    }
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
                if (constructor.prototype.destructor) {
                    constructor.prototype.destructor.apply(this, arguments);
                }
                constructor = constructor.superclass ? constructor.superclass.constructor : null;
            }
        },

        before: function(name, fn) { // TODO: get from Event.Target
            this._before = this._before || {};
            this._before[name] = fn;
        },

        on: function() { this.subscribe.apply(this, arguments); }, // TODO: get from Event.Target ?

        toString: function() {
            return Base.NAME + "[" /* + this + // */ + "]";
        }
    };

    Y.augment(Base, Y.Att);
    //Y.Base = Base.build(Base, [Y.Att]);
    Y.Base = Base;
}, '3.0.0');
