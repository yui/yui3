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

                // Set name to current class, to use for events.
                this.name = this.constructor.NAME;

                if (this.fire('beforeInit') !== false) {

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
                                // This means the user has to clone anything coming in, if they 
                                // want it detached
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
