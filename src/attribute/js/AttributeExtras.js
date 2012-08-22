    /**
     * The attribute module provides an augmentable Attribute implementation, which
     * adds configurable attributes and attribute change events to the class being
     * augmented. It also provides a State class, which is used internally by Attribute,
     * but can also be used independently to provide a name/property/value data structure to
     * store state.
     *
     * @module attribute
     */

    /**
     * The attribute-extras submodule provides less commonly used attribute methods, and can
     * be augmented/mixed into an implemention which used attribute-core.
     *
     * @module attribute
     * @submodule attribute-extras
     */
    var BROADCAST = "broadcast",
        PUBLISHED = "published",
        INIT_VALUE = "initValue",

        MODIFIABLE = {
            readOnly:1,
            writeOnce:1,
            getter:1,
            broadcast:1
        };

    /**
     * A augmentable implementation for AttributeCore, providing less frequently used
     * methods for Attribute management such as modifyAttrs(), removeAttr and reset()
     *
     * @class AttributeExtras
     */
    function AttributeExtras() {}

    AttributeExtras.prototype = {

        /**
         * Updates the configuration of an attribute which has already been added.
         * <p>
         * The properties which can be modified through this interface are limited
         * to the following subset of attributes, which can be safely modified
         * after a value has already been set on the attribute: readOnly, writeOnce,
         * broadcast and getter.
         * </p>
         * @method modifyAttr
         * @param {String} name The name of the attribute whose configuration is to be updated.
         * @param {Object} config An object with configuration property/value pairs, specifying the configuration properties to modify.
         */
        modifyAttr: function(name, config) {
            var prop, state;

            if (this.attrAdded(name)) {

                if (this._isLazyAttr(name)) {
                    this._addLazyAttr(name);
                }

                state = this._state;
                for (prop in config) {
                    if (MODIFIABLE[prop] && config.hasOwnProperty(prop)) {
                        state.add(name, prop, config[prop]);

                        // If we reconfigured broadcast, need to republish
                        if (prop === BROADCAST) {
                            state.remove(name, PUBLISHED);
                        }
                    }
                }
            }

            if (!this.attrAdded(name)) {Y.log('Attribute modifyAttr:' + name + ' has not been added. Use addAttr to add the attribute', 'warn', 'attribute');}
        },

        /**
         * Removes an attribute from the host object
         *
         * @method removeAttr
         * @param {String} name The name of the attribute to be removed.
         */
        removeAttr: function(name) {
            this._state.removeAll(name);
        },

        /**
         * Resets the attribute (or all attributes) to its initial value, as long as
         * the attribute is not readOnly, or writeOnce.
         *
         * @method reset
         * @param {String} name Optional. The name of the attribute to reset.  If omitted, all attributes are reset.
         * @return {Object} A reference to the host object.
         * @chainable
         */
        reset : function(name) {
            var data, key;

            if (name) {
                if (this._isLazyAttr(name)) {
                    this._addLazyAttr(name);
                }
                this._setAttr(name, this._state.get(name, INIT_VALUE));
            } else {
                data = this._state.data;

                for (key in data) {
                    if (data.hasOwnProperty(key)) {
                        this.reset(key);
                    }
                }
            }

            return this;
        },

        /**
         * Returns an object with the configuration properties (and value)
         * for the given attribute. If attrName is not provided, returns the
         * configuration properties for all attributes.
         *
         * @method _getAttrCfg
         * @protected
         * @param {String} name Optional. The attribute name. If not provided, the method will return the configuration for all attributes.
         * @return {Object} The configuration properties for the given attribute, or all attributes.
         */
        _getAttrCfg : function(name) {
            var state = this._state,
                key, obj;

            if (name) {
                obj = state.getAll(name) || {};
            } else {
                obj = {};

                for (key in state.data) {
                    if (state.data.hasOwnProperty(key)) {
                        obj[key] = state.getAll(key);
                    }
                }
            }

            return obj;
        }
    };

    Y.AttributeExtras = AttributeExtras;
