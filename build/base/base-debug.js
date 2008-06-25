YUI.add('base', function(Y) {

    /**
     * Base class support for objects requiring
     * managed attributes and acting as event targets
     *
     * @module base
     */

    var L = Y.Lang,
        O = Y.Object,
        SEP = ":",
        DESTROY = "destroy",
        INIT = "init",
        INITIALIZER = "initializer",
        DESTRUCTOR = "destructor";

    var ETP = Y.Event.Target.prototype;

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
     * registered Attributes, through the static ATTRS property
     * @constructor
     * @class Base
     * @uses Attribute
     *
     * @param {Object} config Object literal of configuration property name/value pairs
     */
    var Base = function() {
        Y.log('constructor called', 'life', 'Base');
        Y.Attribute.call(this);
        this.init.apply(this, arguments);
    };

    /**
     * Name string to be used to identify instances of 
     * this class, for example in prefixing events.
     *
     * Classes extending Base, should define their own
     * static NAME property.
     * 
     * @property NAME
     * @static
     */
    Base.NAME = 'base';

    var _instances = {};
    
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

    Base.create = function(main, features, args) {
        var c = Base.build(main, features, {dynamic:true}),
            cArgs = Y.Array(arguments, 2, true);

        function F(){}
        F.prototype = c.prototype;

        return c.apply(new F(), cArgs);
    };

    Base.prototype = {

        /**
         * Init lifecycle method, invoked during construction.
         * Fires the init event prior to invoking initializers on
         * the class hierarchy.
         * 
         * @method init
         * @final
         * @param {Object} config Object literal of configuration property name/value pairs
         */
        init: function(config) {
            Y.log('init called', 'life', 'Base');

            /**
             * Flag indicating whether or not this object
             * has been through the destory lifecycle phase.
             * 
             * @property destroyed
             * @type Boolean
             */
            this.destroyed = false;
            
            /**
             * Flag indicating whether or not this object
             * has been through the init lifecycle state.
             * 
             * @property initialized
             * @type Boolean
             */
            this.initialized = false;

            /**
             * The name string to be used to identify 
             * this instance of object. 
             * @property name
             * @type String
             */
            this.name = this.constructor.NAME;

            /**
             * Init event, fired prior to initialization. Invoking
             * the preventDefault method on the EventFacade provided 
             * to subscribers will prevent initialization from occuring.
             * <p>
             * Subscribers to the after momemt of this event, will be notified
             * after initialization of the object is complete (and therefore
             * cannot prevent initialization).
             * </p>
             *
             * @event init
             * @param {EventFacade} e Event object
             * @param config Object literal of configuration name/value pairs
             */
            this.publish(INIT, {
                queuable:false,
                defaultFn:this._defInitFn
            });
            this.fire(INIT, config);

            return this;
        },

        /**
         * Destroy lifecycle method. Fires the destroy
         * event, prior to invoking destructors for the
         * class heirarchy.
         * <p>
         * Subscribers to the destroy
         * event can preventDefault to prevent destruction
         * from proceeding.
         * </p>
         * @method destroy
         * @final
         */
        destroy: function() {
            Y.log('destroy called', 'life', 'Base');

            /**
             * Destroy event, fired prior to destruction. Invoking
             * the preventDefault method on the EventFacade provided 
             * to subscribers will prevent destruction from proceeding.
             * <p>
             * Subscribers to the after momemt of this event, will be notified
             * after destruction is complete (and as a result cannot prevent
             * destruction).
             * </p>
             * @event destroy
             * @param {EventFacade} e Event object
             */
            this.publish(DESTROY, {
                queuable:false,
                defaultFn: this._defDestroyFn
            });
            this.fire(DESTROY);
            return this;
        },

        /**
         * Default init event handler
         *
         * @method _defInitFn
         * @protected
         */
        _defInitFn : function(config) {
            _instances[Y.stamp(this)] = this;
            this._initHierarchy(config);
            this.initialized = true;
        },

        /**
         * Default destroy event handler
         *
         * @method _defDestroyFn
         * @protected
         */
        _defDestroyFn : function() {
            this._destroyHierarchy();
            delete _instances[this._yuid];
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
         * Initializes the class hierarchy rooted at this base class,
         * which includes initializing attributes for each class defined 
         * in the class's static ATTRS property and invoking the initializer 
         * method on the prototype of each class in the hierarchy.
         * 
         * @method _initHierarchy
         * @param {Object} userConf Config hash containing attribute name/value pairs
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

                if (O.owns(constr.prototype, INITIALIZER)) {
                    constr.prototype.initializer.apply(this, arguments);
                }
            }
        },

        /**
         * Destroys the class hierarchy rooted at this base class by invoking
         * the descructor method on the prototype of each class in the hierarchy.
         * 
         * @method _destroyHierarchy
         * @private
         */
        _destroyHierarchy : function() {
            var constructor = this.constructor;
            while (constructor && constructor.prototype) {
                if (O.owns(constructor.prototype, DESTRUCTOR)) {
                    constructor.prototype.destructor.apply(this, arguments);
                }
                constructor = constructor.superclass ? constructor.superclass.constructor : null;
            }
        },

        /**
         * Default toString implementation
         * @method toString
         */
        toString: function() {
            return this.contructor.NAME + "[" + this._yuid + "]";
        },

        /**
         * Alias for the subscribe method.
         * @method on
         */
        on : function() {
            return this.subscribe.apply(this, arguments);
        },

        /**
         * Subscribe to a custom event hosted by this object.
         * <p>
         * Overrides Event.Target's subscribe method, to add the name prefix 
         * of the instance to the event type, if absent.
         * </p>
         * 
         * @method subscribe
         * @param {String} type The type of event to subscribe to. If 
         * the type string does not contain a prefix ("prefix:eventType"), 
         * the name property of the instance will be used as the default prefix.
         * @param {Function} fn The callback, invoked when the event is fired.
         * @param {Object} context The execution context
         * @param {Object*} args* 1..n params to supply to the callback
         * 
         * @return {Event.Handle} unsubscribe handle
         */
        subscribe : function() {
            var a = arguments;
            a[0] = _prefixType(a[0], this);
            return ETP.subscribe.apply(this, a);
        },

        /**
         * Fire a custom event by name.  The callback functions will be executed
         * from the context specified when the event was created, and with the 
         * following parameters.
         * <p>
         * Overrides Event.Target's fire method, to add the name prefix 
         * of the instance to the event type, if absent.
         * </p>
         * @method fire
         * @param {String|Object} type The type of the event, or an object that contains
         * a 'type' property. If the type does not contain a prefix ("prefix:eventType"),
         * the name property of the instance will be used as the default prefix.
         * @param {Object*} arguments an arbitrary set of parameters to pass to 
         * the handler.
         * @return {Boolean} the return value from Event.Target.fire
         *                   
         */
        fire : function() {
            var a = arguments;
            if (L.isString(a[0])) {
                a[0] = _prefixType(a[0], this);
            } else if (a[0].type){
                a[0].type = _prefixType(a[0].type, this);
            }
            return ETP.fire.apply(this, a);
        },

        /**
         * Creates a new custom event of the specified type.  If a custom event
         * by that name already exists, it will not be re-created.  In either
         * case the custom event is returned. 
         *
         * <p>
         * Overrides Event.Target's publish method, to add the name prefix 
         * of the instance to the event type, if absent.
         * </p>
         *
         * @method publish
         * @param {String} type  The type, or name of the event. If the type does not 
         * contain a prefix ("prefix:eventType"), the name property of the instance will 
         * be used as the default prefix.
         * @param {Object} opts Optional config params (see Event.Target publish for details)
         * @return {Event.Custom} the custom event
         */
        publish : function() {
            var a = arguments;
            a[0] = _prefixType(a[0], this);
            return ETP.publish.apply(this, a);
        },

        /**
         * Subscribe to a custom event hosted by this object.  The
         * supplied callback will execute <em>after</em> any listeners added
         * via the subscribe method, and after the default function,
         * if configured for the event, has executed.
         * <p>
         * Overrides Event.Target's after method, to add the name prefix 
         * of the instance to the event type, if absent.
         * </p>
         * @method after
         * @param {String} type The type of event to subscribe to. If 
         * the type string does not contain a prefix ("prefix:eventType"), 
         * the name property of the instance will be used as the default prefix.
         * @param {Function} fn  The callback
         * @param {Object} context The execution context
         * @param {Object*} args* 1..n params to supply to the callback
         */
        after : function() {
            var a = arguments;
            a[0] = _prefixType(a[0], this);
            return ETP.after.apply(this, a);
        },

        /**
         * Unsubscribes one or more listeners the from the specified event
         * @method unsubscribe.
         * <p>
         * Overrides Event.Target's unsubscribe method, to add the name prefix 
         * of the instance to the event type, if absent.
         * </p>
         * @param type {String|Object} Either the handle to the subscriber or the 
         *                        type of event.  If the type
         *                        is not specified, it will attempt to remove
         *                        the listener from all hosted events. If 
         *                        the type string does not contain a prefix 
         *                        ("prefix:eventType"), the name property of the 
         *                        instance will be used as the default prefix.
         * @param fn   {Function} The subscribed function to unsubscribe, if not
         *                          supplied, all subscribers will be removed.
         * @param context  {Object}   The custom object passed to subscribe.  This is
         *                        optional, but if supplied will be used to
         *                        disambiguate multiple listeners that are the same
         *                        (e.g., you subscribe many object using a function
         *                        that lives on the prototype)
         * @return {boolean} true if the subscriber was found and detached.
         */
        unsubscribe: function(type, fn, context) {
            var a = arguments;
            if (L.isString(a[0])) {
                a[0] = _prefixType(a[0], this);
            }
            return ETP.unsubscribe.apply(this, a);
        },
        
        /**
         * Removes all listeners from the specified event.  If the event type
         * is not specified, all listeners from all hosted custom events will
         * be removed.
         * <p>
         * Overrides Event.Target's unsubscribeAll method, to add the name prefix 
         * of the instance to the event type, if absent.
         * </p>
         * @method unsubscribeAll
         * @param type {String}   The type, or name of the event. If 
         * the type string does not contain a prefix ("prefix:eventType"), 
         * the name property of the instance will be used as the default prefix.
         */
        unsubscribeAll: function(type) {
            var a = arguments;
            a[0] = _prefixType(a[0], this);
            return ETP.unsubscribeAll.apply(this, a);
        }
    };

    Y.mix(Base, Y.Attribute, false, null, 1);

    Y.Base = Base;



}, '@VERSION@' ,{requires:['attribute']});
