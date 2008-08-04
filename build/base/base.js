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
        VALUE = "value",
        INITIALIZED = "initialized",
        DESTROYED = "destroyed",
        INITIALIZER = "initializer",
        DESTRUCTOR = "destructor";

    var ETP = Y.Event.Target.prototype;

    /**
     * <p>
     * Provides a base class for managed attribute based
     * objects, which handles the chaining of initializer and destructor methods
     * across the hierarchy during init and destroy lifecycle methods and 
     * handles automatic configuration of registered Attributes, through 
     * the static <a href="#property_ATTRS">ATTRS</a> property.
     * </p>
     *
     * <p>The Base class also handles prefixing of event types with the static <a href="#property_NAME">NAME</a> 
     * property for all events fired from instances of classes derived from Base.</p>
     *
     * @constructor
     * @class Base
     * @uses Attribute
     *
     * @param {Object} config Object literal of configuration property name/value pairs
     */
    var Base = function() {
        Y.Attribute.call(this);
        this.init.apply(this, arguments);
    };

    /**
     * <p>
     * Name string to be used to identify instances of 
     * this class, for example in prefixing events.
     * </p>
     * <p>
     * Classes extending Base, should define their own
     * static NAME property.
     * </p>
     * @property NAME
     * @type String
     * @static
     */
    Base.NAME = 'base';

    /**
     * Object literal defining the set of attributes which
     * will be available for instances of this class, and 
     * how they are configured. See Attributes addAtt method
     * for a description of configuration options available 
     * for each attribute.
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    Base.ATTRS = {
        /**
         * Flag indicating whether or not this object
         * has been through the init lifecycle phase.
         *
         * @attribute initialized
         * @readOnly
         * @default false
         * @type boolean
         */
        intialized: {
            readOnly:true,
            value:false
        },

        /**
         * Flag indicating whether or not this object
         * has been through the destroy lifecycle phase.
         *
         * @attribute destroyed
         * @readOnly
         * @default false
         * @type boolean
         */
        destroyed: {
            readOnly:true,
            value:false
        }
    };

    var _instances = {};

    /**
     * <p>
     * Builds a constructor function (class) from the
     * main function, and array of extension functions (classes)
     * provided.
     * </p>
     * <p>
     * The cfg object literal supports the following properties
     * </p>
     * <dl>
     *    <dt>dynamic {boolean}</dt>
     *    <dd>
     *    <p>If true, a completely new class
     *    is created which extends the main class, and acts as the 
     *    host on which the extension classes are augmented.</p>
     *    <p>If false, the extensions classes are augmented directly to
     *    the main class, modifying the main classes prototype.</p>
     *    </dd>
     *    <dt>aggregates {String[]}</dt>
     *    <dd>An array of static property names, which will get aggregated
     *    on to the built class in addition to the default properties build 
     *    will always aggregate - "ATTRS" and "PLUGINS", as defined by 
     *    Base.build.AGGREGATES</dd>
     * </dl>
     *
     * @method build
     * @static
     * @param {Function} main The main class on which to base the built class
     * @param {Function[]} extensions The set of extension classes which will be
     * augmented/aggregated to the built class.
     * @param {Object} cfg
     */
    Base.build = function(main, extensions, cfg) {

        var build = Base.build,
            builtClass,
            extClass,
            aggregates,
            dynamic,
            key = main.NAME;

        if (cfg) {
            aggregates = cfg.aggregates;
            dynamic = cfg.dynamic;
        }

        // Create dynamic class or just modify main class
        builtClass = (dynamic) ? build._template(main) : main;

        builtClass._yuibuild = {
            id: null,
            exts : [],
            dynamic : dynamic
        };

        aggregates = (aggregates) ? build.AGGREGATES.concat(aggregates) : build.AGGREGATES;

        var el = extensions.length,
            al = aggregates.length,
            i;

        // Shallow isolate aggregates
        if (dynamic && aggregates) {
            for (i = 0; i < al; i++) {
                var val = aggregates[i];
                if (O.owns(main, val)) {
                    builtClass[val] = L.isArray(main[val]) ? [] : {};
                }
            }
            Y.aggregate(builtClass, main, true, aggregates);
        }

        // Augment/Aggregate
        for (i = 0; i < el; i++) {
            extClass = extensions[i];

            if (aggregates) {
                Y.aggregate(builtClass, extClass, true, aggregates);
            }

            // Old augment
            Y.mix(builtClass, extClass, true, null, 1);

            builtClass._yuibuild.exts.push(extClass);
            key = key + ":" + Y.stamp(extClass);
        }

        builtClass._yuibuild.id = key;
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
                BuiltClass.superclass.constructor.apply(this, arguments);

                var f = BuiltClass._yuibuild.exts, 
                    l = f.length;

                for (var i = 0; i < l; i++) {
                    f[i].apply(this, arguments);
                }
                return this;
            }

            Y.extend(BuiltClass, main);

            return BuiltClass;
        },

        _hasImpl : function(extClass) {
            if (this.constructor._yuibuild) {
                var f = this.constructor._yuibuild.exts,
                    l = f.length,
                    i;

                for (i = 0; i < l; i++) {
                    if (f[i] === extClass) {
                        return true;
                    }
                }
            }

            return false;
        }
    });

    /**
     * <p>
     * Creates a new object instance, based on a dynamically created custom class.
     * The custom class is created from the main class passed in as the first parameter 
     * along with the list of extension classes passed in
     * as the second parameter using <a href="#method_build">Base.build</a> 
     * with "dynamic" set to true. See the documentation for this method 
     * to see how the main class and extension classes are used.
     * </p>
     * 
     * <p>Any arguments following the 2nd argument are passed as arguments to the 
     * constructor of the newly created class used to create the instance.</p>
     * 
     * @method create
     * @static
     *
     * @param {Function} main The main class on which the instance it to be 
     * based. This class will be extended to create the class for the custom instance
     * @param {Array} extensions The list of extension classes used to augment the
     * main class with.
     * @param {Any*} args  Zero or more arguments to pass to the constructor of the 
     * newly created class, when creating the instance.
     */
    Base.create = function(main, extensions, args) {
        var c = Base.build(main, extensions, {dynamic:true}),
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
         * @chainable
         * @param {Object} config Object literal of configuration property name/value pairs
         */
        init: function(config) {

            /**
             * The name string to be used to identify 
             * this instance of object. 
             * @property name
             * @type String
             */
            this.name = this.constructor.NAME;

            /**
             * <p>
             * Init event, fired prior to initialization. Invoking
             * the preventDefault method on the event object provided 
             * to subscribers will prevent initialization from occuring.
             * </p>
             * <p>
             * Subscribers to the "after" momemt of this event, will be notified
             * after initialization of the object is complete (and therefore
             * cannot prevent initialization).
             * </p>
             *
             * @event init
             * @preventable _defInitFn
             * @param {Event.Facade} e Event object
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
         * <p>
         * Destroy lifecycle method. Fires the destroy
         * event, prior to invoking destructors for the
         * class hierarchy.
         * </p>
         * <p>
         * Subscribers to the destroy
         * event can invoke preventDefault on the event object, to prevent destruction
         * from proceeding.
         * </p>
         * @method destroy
         * @final
         * @chainable
         */
        destroy: function() {

            /**
             * <p>
             * Destroy event, fired prior to destruction. Invoking
             * the preventDefault method on the event object provided 
             * to subscribers will prevent destruction from proceeding.
             * </p>
             * <p>
             * Subscribers to the "after" moment of this event, will be notified
             * after destruction is complete (and as a result cannot prevent
             * destruction).
             * </p>
             * @event destroy
             * @preventable _defDestroyFn
             * @param {Event.Facade} e Event object
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

            this._conf.remove(INITIALIZED, VALUE);
            this.set(INITIALIZED, true);
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

            this._conf.remove(DESTROYED, VALUE);
            this.set(DESTROYED, true);
        },

        /**
         * Returns the top down class hierarchy for this object,
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
         * in the class's static <a href="#property_ATTRS">ATTRS</a> property and invoking the initializer 
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

                if (constr._yuibuild && constr._yuibuild.exts && !constr._yuibuild.dynamic) {
                    for (var ei = 0, el = constr._yuibuild.exts.length; ei < el; ei++) {
                        constr._yuibuild.exts[ei].apply(this, arguments);
                    }
                }

                this._initAtts(constr.ATTRS, userConf);

                if (O.owns(constr.prototype, INITIALIZER)) {
                    constr.prototype[INITIALIZER].apply(this, arguments);
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
            var constr,
                classes = this._getClasses();

            for (var ci = classes.length-1; ci >= 0; ci--) {
                constr = classes[ci];
                if (O.owns(constr.prototype, DESTRUCTOR)) {
                    constr.prototype[DESTRUCTOR].apply(this, arguments);
                }
            }
        },

        /**
         * Default toString implementation
         * @method toString
         */
        toString: function() {
            return this.constructor.NAME + "[" + Y.stamp(this) + "]";
        },

        /**
         * <p>
         * Subscribe to a custom event hosted by this object.
         * </p>
         * <p>
         * Overrides Event.Target's <a href="Event.Target.html#method_subscribe">subscribe</a> method, to add the name prefix 
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
            a[0] = this._prefixEvtType(a[0]);
            return ETP.subscribe.apply(this, a);
        },

        /**
         * <p>
         * Fire a custom event by name.  The callback functions will be executed
         * from the context specified when the event was created, and with the 
         * following parameters.
         * </p>
         * <p>
         * Overrides Event.Target's <a href="Event.Target.html#method_fire">fire</a> method, to add the name prefix 
         * of the instance to the event type, if absent.
         * </p>
         * 
         * @method fire
         * @param {String|Object} type The type of the event, or an object that contains
         * a 'type' property. If the type does not contain a prefix ("prefix:eventType"),
         * the name property of the instance will be used as the default prefix.
         * @param {Object*} arguments an arbitrary set of parameters to pass to 
         * the handler.
         * @return {boolean} the return value from Event.Target.fire
         *
         */
        fire : function() {
            var a = arguments;
            if (L.isString(a[0])) {
                a[0] = this._prefixEvtType(a[0]);
            } else if (a[0].type){
                a[0].type = this._prefixEvtType(a[0].type);
            }
            return ETP.fire.apply(this, a);
        },

        /**
         * <p>
         * Creates a new custom event of the specified type.  If a custom event
         * by that name already exists, it will not be re-created.  In either
         * case the custom event is returned. 
         * </p>
         * <p>
         * Overrides Event.Target's <a href="Event.Target.html#method_publish">publish</a> method, to add the name prefix 
         * of the instance to the event type, if absent.
         * </p>
         *
         * @method publish
         * @param {String} type  The type, or name of the event. If the type does not 
         * contain a prefix ("prefix:eventType"), the name property of the instance will 
         * be used as the default prefix.
         * @param {Object} opts Optional config params (see Event.Target <a href="Event.Target.html#method_publish">publish</a> for details)
         * @return {Event.Custom} the custom event
         */
        publish : function() {
            var a = arguments;
            a[0] = this._prefixEvtType(a[0]);
            return ETP.publish.apply(this, a);
        },

        /**
         * <p>
         * Subscribe to a custom event hosted by this object.  The
         * supplied callback will execute <em>after</em> any listeners added
         * via the subscribe method, and after the default function,
         * if configured for the event, has executed.
         * </p>
         * <p>
         * Overrides Event.Target's <a href="Event.Target.html#method_after">after</a> method, to add the name prefix 
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
            a[0] = this._prefixEvtType(a[0]);
            return ETP.after.apply(this, a);
        },

        /**
         * <p>
         * Unsubscribes one or more listeners the from the specified event.
         * </p>
         * <p>
         * Overrides Event.Target's <a href="Event.Target.html#method_unsubscribe">unsubscribe</a> method, to add the name prefix 
         * of the instance to the event type, if absent.
         * </p>
         * @method unsubscribe
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
                a[0] = this._prefixEvtType(a[0]);
            }
            return ETP.unsubscribe.apply(this, a);
        },

        /**
         * <p>
         * Removes all listeners from the specified event.  If the event type
         * is not specified, all listeners from all hosted custom events will
         * be removed.
         * </p>
         * <p>
         * Overrides Event.Target's <a href="Event.Target.html#method_unsubscribeAll">unsubscribeAll</a> method, to add the name prefix 
         * of the instance to the event type, if absent.
         * </p>
         * @method unsubscribeAll
         * @param type {String}   The type, or name of the event. If 
         * the type string does not contain a prefix ("prefix:eventType"), 
         * the name property of the instance will be used as the default prefix.
         */
        unsubscribeAll: function(type) {
            var a = arguments;
            a[0] = this._prefixEvtType(a[0]);
            return ETP.unsubscribeAll.apply(this, a);
        },

        /**
         * Utility method to prefix the event name with the
         * name property of the instance, if absent
         *
         * @method _prefixEvtType
         * @private
         * @param {String} type The event name
         */
        _prefixEvtType: function(type) {
            if (type.indexOf(SEP) === -1 && this.name) {
               type = this.name + ":" + type;
            }
            return type;
        }
    };

    Y.mix(Base, Y.Attribute, false, null, 1);

    Y.Base = Base;



}, '@VERSION@' ,{requires:['attribute']});
