    var L = Y.lang,
        O = Y.object;

    Y.CANCEL = 'yui:cancel';

    /**
     * Provides a base class for managed attribute based 
     * objects, which automates chaining of init and destroy
     * lifecycle methods and automatic instantiation of 
     * registered Attributes, through the static ATTR property
     *
     * @class Base
     * @uses YUI.Attribute.Provider
     */
    var Base = function() {
        Y.log('constructor called', 'life', 'Base');
        this.init.apply(this, arguments);
    };

    Base.NAME = 'base';
    Base._instances = {};

    Base.build = function(main, features, config) {
        var newClass = Base.build._getTemplate(main),
            key = main.NAME,
            featureClass,
            aggregates = [],
            methods,
            method,
            i,
            fl,
            al;

        features = features || [];

        if (config) {
            aggregates = config.aggregates;
            methods = config.methods;
        }

        features.splice(0, 0, main);
        aggregates.splice(0, 0, "ATTRS", "PLUGINS");

        fl = features.length;
        al = aggregates.length;

        // Statics
        for (i = 0; i < fl; i++) {
            featureClass = features[i];
            Y.mix(newClass, featureClass, true);
        }

        // Aggregates - need to reset these after Y.mix(.., .., true).
        if (aggregates) {
            for (i = 0; i < al; i++) {
                var val = aggregates[i];
                if (O.owns(main, val)) {
                    newClass[val] = L.isArray(main[val]) ? [] : {};
                }
            }
        }

        newClass._build = {
            id : null,
            f : []
        };

        // Augment/Aggregate
        for (i = 0; i < fl; i++) {
            featureClass = features[i];
            if (aggregates) {
                Y.aggregate(newClass, featureClass, true, aggregates);
            }
            Y.augment(newClass, featureClass, true);

            newClass._build.f.push(featureClass);
            key = key + ":" + Y.stamp(featureClass);
        }

        // Methods
        if (methods) {
            for (i = 0; i < methods.length; i++) {
                method = methods[i];
                newClass.prototype[method] = Base.build._wrappedFn(method);
            }
        }

        newClass._build.id = key;
        newClass.NAME = main.NAME;

        newClass.prototype.hasImpl = Base.build._impl;
        newClass.prototype.constructor = newClass;

        return newClass;
    };

    Base.build._getTemplate = function(main) {

        function BuiltClass() {
            var f = BuiltClass._build.f, l = f.length;
            for (var i = 0; i < l; i++) {
                f[i].apply(this, arguments);
            }
            return this;
        }

        return BuiltClass;
    };

    Base.build._impl = function (featureClass) {
        if (this.constructor._build) {

            var f = this.constructor._build.f,
                l = f.length,
                i;

            for (i = 0; i < l; i++) {
                if (f[i] === featureClass) {
                    return true;
                }
            }
        }
        return false;
    };

    Base.build._wrappedFn = function(method) {
        return function() {
    
            var f = this.constructor._build.f,
                l = f.length,
                fn,
                i,
                r;

            for (i = 0; i < l; i++) {
                fn = f[i].prototype[method];
                if (fn) {
                    // TODO: Can we do anything meaningful with return values?
                    r = fn.apply(this, arguments);
                }
            }
        };
    };

    Base.create = function(main, features, args) {
        var c = Y.Base.build(main, features),
            cArgs = Y.array(arguments, 2, true);

        function F(){}
        F.prototype = c.prototype;
        // Y.mix(F, c);

        return c.apply(new F(), cArgs);
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

                this._before = {};

                this._destroyed = false;
                this._initialized = false;
                this._eventHandles = {};

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
         * Provides beforeDestroy and destroy lifecycle events
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
                }
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
        _initHierarchy : function(userConf) {
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
                            var defConf = attributes[att];
                            if (userConf && O.owns(userConf, att)) {

                                // Support attrs which don't have a def config/value supplied
                                if (!L.isObject(defConf)) {
                                    defConf = {};
                                }

                                // Not Cloning/Merging on purpose. Don't want to clone
                                // references to complex objects [ e.g. a reference to a widget ]
                                // This means the user has to clone anything coming in, if they 
                                // want it detached
                                // attributes[att].value = conf[att];

                                defConf.value = userConf[att];
                            }
                            this.addAtt(att, defConf);
                            if ("value" in defConf) {
                                this.set(att, defConf.value);
                            }
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
            this._before[name] = this._before[name] || [];
            this._before[name].push(fn);
        },

        on: function() { this.subscribe.apply(this, arguments); }, // TODO: get from Event.Target ?

        toString: function() {
            return Base.NAME + "[" /* + this + // */ + "]";
        }
    };

    Y.Base = Base.build(Base, [Y.Attribute]);
