YUI.add('base', function(Y) {

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

    Y.CANCEL = 'yui:cancel',

    Base._instances = {};

    Base.build = function(main, features) {
        var newClass = function() {};
        Y.augment(newClass, main);
        Y.mix(newClass, main);
        newClass.constructor = main.constructor;

        Y.each(features, function(v, n) { // add feature classes
            Y.aggregate(newClass, v, true, ['ATTR', 'PLUGINS']); // merge attributes and plugins
            Y.augment(newClass, v);
            if (v.constructor) {
                newClass.constructor = function() {
                    // TODO: chain constructors
                }
            } 
        });

        return newClass;
    };

    Base.create = function(main, features, arg1, arg2, etc) { // TODO: allow just Base.create(arg1, ar2, etc)?
        return new (Y.Base.build(main, features))(arg1, arg2, etc);
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
                classes = this._getClasses(),
                isObj = Y.lang.isObject,
                owns = Y.object.owns;

            for (var i = 0; i < classes.length; i++) {
                constructor = classes[i];
                if (constructor.ATTRS) {
                    attributes = Y.merge(constructor.ATTRS);

                    Y.log('configuring' + constructor.NAME + 'attributes', 'info', 'Base');

                    for (att in conf) {
                        if (owns(attributes, att)) {
                            if (!isObj(attributes[att])) {
                                attributes[att] = {};
                            }
                            // Not Cloning/Merging on purpose. Don't want to clone
                            // references to complex objects [ e.g. a reference to a widget ]
                            // This means the user has to clone anything coming in, if they 
                            // want it detached
                            attributes[att].value = conf[att];
                        }
                        this.set(att);
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
