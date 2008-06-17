    var L = Y.Lang,
        O = Y.Object,
        SEP = ":";

    Y.CANCEL = 'yui:cancel';

    var ETP = Y.EventTarget.prototype;

    function _prefixType(type, owner) {
        if (type.indexOf(SEP) === -1 && owner.name) {
           type = owner.name + ":" + type;
        }
        return type;
    }

    /**
     * Provides a base class for managed attribute based
     * objects, which automates chaining of init and destroy
     * lifecycle methods and automatic instantiation of
     * registered Attributes, through the static ATTR property
     *
     * @class Base
     * @uses Attribute
     */
    var Base = function() {
        Y.log('constructor called', 'life', 'Base');

        // Hack: Augment doesn't seem to be invoking the constructor without this.
        // Calling getEvent(which is a method not over-ridden by Base) causes
        // Y.augment supercedes replacement to kick in
        this.getEvent("init");

        this.init.apply(this, arguments);
    };

    Base.NAME = 'base';
    Base._instances = {};

    // TODO, Work in progress
    Base.build = function(main, extensions, cfg) {

        var build = Base.build,
            builtClass,
            extClass,
            aggregates,
            methods,
            method,
            dynamic,
            key = main.NAME;

        if (cfg) {
            aggregates = cfg.aggregates;
            methods = cfg.methods;
            dynamic = cfg.dynamic;
        }

        if (dynamic) {
            builtClass = build._template(main);
            extensions.splice(0, 0, main);
        } else {
            builtClass = main;
        }

        builtClass._build = {
            id: null,
            exts : [],
            dynamic : dynamic
        };

        aggregates = (aggregates) ? build.AGGREGATES.concat(aggregates) : build.AGGREGATES;

        var el = extensions.length,
            al = aggregates.length,
            i;

        if (dynamic) {
            // Statics
            for (i = 0; i < el; i++) {
                extClass = extensions[i];
                Y.mix(builtClass, extClass, true);
            }

            // Need to reset aggregates after Y.mix(.., .., true)
            if (aggregates) {
                for (i = 0; i < al; i++) {
                    var val = aggregates[i];
                    if (O.owns(main, val)) {
                        builtClass[val] = L.isArray(main[val]) ? [] : {};
                    }
                }
            }
        }

        // Augment/Aggregate
        for (i = 0; i < el; i++) {
            extClass = extensions[i];

            if (aggregates) {
                Y.aggregate(builtClass, extClass, true, aggregates);
            }

            // Old augment
            Y.mix(builtClass, extClass, true, null, 1);

            builtClass._build.exts.push(extClass);
            key = key + ":" + Y.stamp(extClass);
        }

        // Methods
        if (methods) {
            for (i = 0; i < methods.length; i++) {
                method = methods[i];
                builtClass.prototype[method] = build._wrappedFn(method);
            }
        }

        builtClass._build.id = key;
        builtClass.prototype.hasImpl = build._hasImpl;

        if (dynamic) {
            builtClass.NAME = main.NAME;
            builtClass.prototype.constructor = builtClass;
        }

        return builtClass;
    };

    Y.mix(Base.build, {

        AGGREGATES : ["ATTRS", "PLUGINS"],

        _template: function(main) {

            function BuiltClass() {
                var f = BuiltClass._build.exts, 
                    l = f.length;

                for (var i = 0; i < l; i++) {
                    f[i].apply(this, arguments);
                }
                return this;
            }

            return BuiltClass;
        },

        _hasImpl : function(featureClass) {
            if (this.constructor._build) {
                var f = this.constructor._build.exts,
                    l = f.length,
                    i;
    
                for (i = 0; i < l; i++) {
                    if (f[i] === featureClass) {
                        return true;
                    }
                }
            }
        
            return false;
        },

        _wrappedFn : function(method) {
            return function() {
        
                var f = this.constructor._build.exts,
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
        }
    });

    // TODO - Work in progress
    Base.create = function(main, features, args) {
        var c = Base.build(main, features, {dynamic:true}),
            cArgs = Y.Array(arguments, 2, true);

        function F(){}
        F.prototype = c.prototype;

        return c.apply(new F(), cArgs);
    };

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
         * @param {Object} config Configuration properties for the object
         */
        init: function(config) {
            Y.log('init called', 'life', 'Base');

            this.destroyed = false;
            this.initialized = false;

            // Set name to class, to use for events.
            this.name = this.constructor.NAME;

            this.publish("init", {
                defaultFn:this._defInitFn
            });
            this.fire("init", config);
            return this;
        },

        /**
         * Init lifecycle method, invoked during
         * construction.
         *
         * Provides beforeDestroy and destroy lifecycle events
         *
         * @method destroy
         * @final
         */
        destroy: function() {
            Y.log('destroy called', 'life', 'Base');
            this.publish("destroy", {
                defaultFn: this._defDestroyFn
            });
            this.fire("destroy");
            return this;
        },

        /**
         * @method _defInitFn
         * @private
         */
        _defInitFn : function(config) {
            Base._instances[Y.stamp(this)] = this;
            this._eventHandles = {};

            this._initHierarchy(config);
            this.initialized = true;
        },

        /**
         * @method _defDestroyFn
         * @private
         */
        _defDestroyFn : function() {
            this._destroyHierarchy();
            this.destroyed = true;
        },

        /**
         * Returns the top down class heirarchy for this object,
         * with Base being the first class in the array
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
         * Initialize the class hierarchy rooted at this base class.
         * 
         * @method _initHierarchy
         * @param {Object} userConf Config hash containing
         * attribute name/value pairs
         * @private
         */
        _initHierarchy : function(userConf) {
            var constr,
                classes = this._getClasses();

            for (var ci = 0, cl = classes.length; ci < cl; ci++) {
                constr = classes[ci];

                if (constr._build && constr._build.exts && !constr._build.dynamic) {
                    for (var ei = 0, el = constr._build.exts.length; ei < el; ei++) {
                        constr._build.exts[ei].apply(this, arguments);
                    }
                }

                this._initAtts(constr.ATTRS, userConf);

                if (O.owns(constr.prototype, "initializer")) {
                    constr.prototype.initializer.apply(this, arguments);
                }
            }
        },

        /**
         * Destroy the class hierarchy rooted at this base class.
         * 
         * @method _destroyHierarchy
         * @private
         */
        _destroyHierarchy : function() {
            var constructor = this.constructor;
            while (constructor && constructor.prototype) {
                if (O.owns(constructor.prototype, "destructor")) {
                    constructor.prototype.destructor.apply(this, arguments);
                }
                constructor = constructor.superclass ? constructor.superclass.constructor : null;
            }
        },

        toString: function() {
            return Y.Base.NAME + "[" /* + this + // */ + "]";
        },

        // Y.EventTarget over-rides for name prefix and before support
        on : function() {
            this.subscribe.apply(this, arguments);
            return this;
        },

        subscribe : function() {
            var a = arguments;
            a[0] = _prefixType(a[0], this);
            return ETP.subscribe.apply(this, a);
        },

        fire : function() {
            var a = arguments;
            if (L.isString(a[0])) {
                a[0] = _prefixType(a[0], this);
            } else if (a[0].type){
                a[0].type = _prefixType(a[0].type, this);
            }
            return ETP.fire.apply(this, a);
        },

        publish : function() {
            var a = arguments;
            a[0] = _prefixType(a[0], this);
            return ETP.publish.apply(this, a);
        },

        after : function() {
            var a = arguments;
            a[0] = _prefixType(a[0], this);
            return ETP.after.apply(this, a);
        }
    };

    Y.augment(Base, Y.Attribute);
    Y.Base = Base;
