    /**
     * Base class support for objects requiring managed attributes and acting as event targets. 
     *
     * The base module also provides an augmentable PluginHost interface.
     *
     * @module base
     */

    /**
     * The base-base sub-module provides the Base class, without Base.build functionality
     *
     * @module base
     * @sub-module base-base
     */
    var O = Y.Object,
        DOT = ".",
        DESTROY = "destroy",
        INIT = "init",
        INITIALIZED = "initialized",
        DESTROYED = "destroyed",
        INITIALIZER = "initializer",
        OBJECT_CONSTRUCTOR = Object.prototype.constructor,
        DEEP = "deep",
        SHALLOW = "shallow",
        VALUE = "value",
        DESTRUCTOR = "destructor";

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
     * @uses Attribute, Plugin.Host
     *
     * @param {Object} config Object literal of configuration property name/value pairs
     */
    function Base() {
        Y.log('constructor called', 'life', 'base');

        Y.Attribute.call(this);
        Y.Plugin.Host.call(this);

        this._silentInit = this._silentInit || false;
        if (this._lazyAddAttrs !== false) { this._lazyAddAttrs = true; }

        this.init.apply(this, arguments);
    }

    /**
     * The list of properties which can be configured for 
     * each attribute (e.g. setter, getter, writeOnce etc.)
     *
     * @property Base._ATTR_CFG
     * @type Array
     * @static
     * @private
     */
    Base._ATTR_CFG = Y.Attribute._ATTR_CFG.concat("cloneDefaultValue");

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
        initialized: {
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
         * @return {Base} A reference to this object
         */
        init: function(config) {
            Y.log('init called', 'life', 'base');

            /**
             * The name string to be used to identify 
             * this instance of object. 
             * @property name
             * @type String
             */
            this._yuievt.config.prefix = this.name = this.constructor.NAME;

            /**
             * <p>
             * Lifecycle event for the init phase, fired prior to initialization. 
             * Invoking the preventDefault method on the event object provided 
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
            if (!this._silentInit) {
                this.publish(INIT, {
                    queuable:false,
                    defaultFn:this._defInitFn
                });
            }

            if (config) {
                if (config.on) {
                    this.on(config.on);
                }
                if (config.after) {
                    this.after(config.after);
                }
            }

            if (!this._silentInit) {
                this.fire(INIT, {cfg: config});
            } else {
                this._defInitFn({cfg: config});
            }

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
         * @return {Base} A reference to this object
         * @final
         * @chainable
         */
        destroy: function() {
            Y.log('destroy called', 'life', 'base');

            /**
             * <p>
             * Lifecycle event for the destroy phase, 
             * fired prior to destruction. Invoking the preventDefault 
             * method on the event object provided to subscribers will 
             * prevent destruction from proceeding.
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
         * @param {Event.Facade} e Event object
         * @protected
         */
        _defInitFn : function(e) {
            this._initHierarchy(e.cfg);
            this._initPlugins(e.cfg);

            if (!this._silentInit) {
                this._set(INITIALIZED, true);
            } else {
                this._conf.add(INITIALIZED, VALUE, true);
            }
        },

        /**
         * Default destroy event handler
         *
         * @method _defDestroyFn
         * @param {Event.Facade} e Event object
         * @protected
         */
        _defDestroyFn : function(e) {
            this._destroyHierarchy();
            this._destroyPlugins();
            this._set(DESTROYED, true);
        },

        /**
         * Returns the class hierarchy for this object, with Base being the last class in the array.
         * 
         * @method _getClasses
         * @protected
         * @return {Function[]} An Array of classes (constructor functions), making up the class hierarchy for this object
         */
        _getClasses : function() {
            if (!this._classes) {
                this._initHierarchyData();
            }
            return this._classes;
        },

        /**
         * Returns an aggregated set of attribute configurations, by traversing the class hierarchy.
         *
         * @method _getAttrCfgs
         * @protected
         * @return {Object} The hash of attribute configurations, aggregated across classes in the hierarchy
         */
        _getAttrCfgs : function() {
            if (!this._attrs) {
                this._initHierarchyData();
            }
            return this._attrs;
        },

        /**
         * @method _filterAttrCfs
         * @private
         * @param {Function} clazz
         * @param {Objects} allCfgs
         */
        _filterAttrCfgs : function(clazz, allCfgs) {
            var cfgs = null, attr, attrs = clazz.ATTRS;

            if (attrs) {
                for (attr in attrs) {
                    if (attrs.hasOwnProperty(attr) && allCfgs[attr]) {
                        cfgs = cfgs || {};
                        cfgs[attr] = allCfgs[attr];
                        delete allCfgs[attr];
                    }
                }
            }

            return cfgs;
        },

        /**
         * @method _initHierarchyData
         * @private
         */
        _initHierarchyData : function() {
            var c = this.constructor, 
                classes = [],
                attrs = [];

            while (c) {
                // Add to classes
                classes[classes.length] = c;

                // Add to attributes
                if (c.ATTRS) {
                    attrs[attrs.length] = c.ATTRS;
                }
                c = c.superclass ? c.superclass.constructor : null;
            }

            this._classes = classes;
            this._attrs = this._aggregateAttrs(attrs);
        },

        /**
         * @method _aggregateAttrs
         * @private
         * @param {Object} allAttrs
         */
        _aggregateAttrs : function(allAttrs) {
            var attr, 
                attrs, 
                cfg, 
                val, 
                path, 
                i, 
                clone, 
                cfgProps = Base._ATTR_CFG,
                aggAttrs = {};

            if (allAttrs) {
                for (i = allAttrs.length-1; i >= 0; --i) {
                    attrs = allAttrs[i];

                    for (attr in attrs) {
                        if (attrs.hasOwnProperty(attr)) {

                            // Protect config passed in
                            cfg = Y.mix({}, attrs[attr], true, cfgProps);

                            val = cfg.value;
                            clone = cfg.cloneDefaultValue;

                            if (val) {
                                if ( (clone === undefined && (OBJECT_CONSTRUCTOR === val.constructor || L.isArray(val))) || clone === DEEP || clone === true) {
                                    Y.log('Cloning default value for attribute:' + attr, 'info', 'base');
                                    cfg.value = Y.clone(val);
                                } else if (clone === SHALLOW) {
                                    Y.log('Merging default value for attribute:' + attr, 'info', 'base');
                                    cfg.value = Y.merge(val);
                                }
                                // else if (clone === false), don't clone the static default value. 
                                // It's intended to be used by reference.
                            }

                            path = null;
                            if (attr.indexOf(DOT) !== -1) {
                                path = attr.split(DOT);
                                attr = path.shift();
                            }

                            if (path && aggAttrs[attr] && aggAttrs[attr].value) {
                                O.setValue(aggAttrs[attr].value, path, val);
                            } else if (!path){
                                if (!aggAttrs[attr]) {
                                    aggAttrs[attr] = cfg;
                                } else {
                                    Y.mix(aggAttrs[attr], cfg, true, cfgProps);
                                }
                            }
                        }
                    }
                }
            }

            return aggAttrs;
        },

        /**
         * Initializes the class hierarchy rooted at this base class,
         * which includes initializing attributes for each class defined 
         * in the class's static <a href="#property_ATTRS">ATTRS</a> property and invoking the initializer 
         * method on the prototype of each class in the hierarchy.
         *
         * @method _initHierarchy
         * @param {Object} userVals Object literal containing attribute name/value pairs
         * @private
         */
        _initHierarchy : function(userVals) {
            var lazy = this._lazyAddAttrs,
                constr,
                constrProto,
                ci,
                ei,
                el,
                classes = this._getClasses(),
                attrCfgs = this._getAttrCfgs();

            for (ci = classes.length-1; ci >= 0; ci--) {

                constr = classes[ci];
                constrProto = constr.prototype;

                if (constr._yuibuild && constr._yuibuild.exts && !constr._yuibuild.dynamic) {
                    for (ei = 0, el = constr._yuibuild.exts.length; ei < el; ei++) {
                        constr._yuibuild.exts[ei].apply(this, arguments);
                    }
                }

                this.addAttrs(this._filterAttrCfgs(constr, attrCfgs), userVals, lazy);

                if (constrProto.hasOwnProperty(INITIALIZER)) {
                    constrProto.initializer.apply(this, arguments);
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
                constrProto,
                ci, cl,
                classes = this._getClasses();

            for (ci = 0, cl = classes.length; ci < cl; ci++) {
                constr = classes[ci];
                constrProto = constr.prototype;
                if (constrProto.hasOwnProperty(DESTRUCTOR)) {
                    constrProto.destructor.apply(this, arguments);
                }
            }
        },

        /**
         * Default toString implementation. Provides the constructor NAME
         * and the instance ID.
         *
         * @method toString
         * @return {String} String representation for this object
         */
        toString: function() {
            return this.constructor.NAME + "[" + Y.stamp(this) + "]";
        }

    };

    // Straightup augment, no wrapper functions
    Y.mix(Base, Y.Attribute, false, null, 1);
    Y.mix(Base, PluginHost, false, null, 1);

    Base.plug = PluginHost.plug;
    Base.unplug = PluginHost.unplug;

    // Fix constructor
    Base.prototype.constructor = Base;

    Y.Base = Base;
