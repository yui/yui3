
(function() {

    var M = function(Y) {

        /**
         * Provides the language utilites and extensions used by the library
         * @class YAHOO.lang
         */
        Y.lang = Y.lang || {

            /**
             * Determines whether or not the provided object is an array.
             * Testing typeof/instanceof/constructor of arrays across frame 
             * boundaries isn't possible in Safari unless you have a reference
             * to the other frame to test against its Array prototype.  To
             * handle this case, we test well-known array properties instead.
             * properties.
             * @method isArray
             * @param {any} o The object being testing
             * @return Boolean
             */
            isArray: function(o) { 

                if (o) {
                   var l = Y.lang;
                   return l.isNumber(o.length) && l.isFunction(o.splice);
                }
                return false;
            },

            /**
             * Determines whether or not the provided object is a boolean
             * @method isBoolean
             * @param {any} o The object being testing
             * @return Boolean
             */
            isBoolean: function(o) {
                return typeof o === 'boolean';
            },
            
            /**
             * Determines whether or not the provided object is a function
             * @method isFunction
             * @param {any} o The object being testing
             * @return Boolean
             */
            isFunction: function(o) {
                return typeof o === 'function';
            },
                
            /**
             * Determines whether or not the provided object is null
             * @method isNull
             * @param {any} o The object being testing
             * @return Boolean
             */
            isNull: function(o) {
                return o === null;
            },
                
            /**
             * Determines whether or not the provided object is a legal number
             * @method isNumber
             * @param {any} o The object being testing
             * @return Boolean
             */
            isNumber: function(o) {
                return typeof o === 'number' && isFinite(o);
            },
              
            /**
             * Determines whether or not the provided object is of type object
             * or function
             * @method isObject
             * @param {any} o The object being testing
             * @return Boolean
             */  
            isObject: function(o) {
        return (o && (typeof o === 'object' || Y.lang.isFunction(o))) || false;
            },
                
            /**
             * Determines whether or not the provided object is a string
             * @method isString
             * @param {any} o The object being testing
             * @return Boolean
             */
            isString: function(o) {
                return typeof o === 'string';
            },
                
            /**
             * Determines whether or not the provided object is undefined
             * @method isUndefined
             * @param {any} o The object being testing
             * @return Boolean
             */
            isUndefined: function(o) {
                return typeof o === 'undefined';
            },
            
            /**
             * Determines whether or not the property was added
             * to the object instance.  Returns false if the property is not present
             * in the object, or was inherited from the prototype.
             * This abstraction is provided to enable hasOwnProperty for Safari 1.3.x.
             * There is a discrepancy between YAHOO.lang.hasOwnProperty and
             * Object.prototype.hasOwnProperty when the property is a primitive added to
             * both the instance AND prototype with the same value:
             * <pre>
             * var A = function() {};
             * A.prototype.foo = 'foo';
             * var a = new A();
             * a.foo = 'foo';
             * alert(a.hasOwnProperty('foo')); // true
             * alert(YAHOO.lang.hasOwnProperty(a, 'foo')); // false when using fallback
             * </pre>
             * @method hasOwnProperty
             * @param {any} o The object being testing
             * @return Boolean
             */
            hasOwnProperty: function(o, prop) {
                if (Object.prototype.hasOwnProperty) {
                    return o.hasOwnProperty(prop);
                }
                
                return !Y.lang.isUndefined(o[prop]) && 
                        o.constructor.prototype[prop] !== o[prop];
            },

            _iefix: Y._iefix,
            _extended: Y._extended,
            augmentObject: Y.augmentObject,
            extend: Y.extend,
            augmentObject: Y.augmentObject,
            augmentProto: Y.augmentProto,
            augment: Y.augment,

            /**
             * Returns a string without any leading or trailing whitespace.  If 
             * the input is not a string, the input will be returned untouched.
             * @method trim
             * @since 2.3.0
             * @param s {string} the string to trim
             * @return {string} the trimmed string
             */
            trim: function(s){
                try {
                    return s.replace(/^\s+|\s+$/g, "");
                } catch(e) {
                    return s;
                }
            },

            merge: Y.merge,

            /**
             * A convenience method for detecting a legitimate non-null value.
             * Returns false for null/undefined/NaN, true for other values, 
             * including 0/false/''
             * @method isValue
             * @since 2.3.0
             * @param o {any} the item to test
             * @return {boolean} true if it is not null/undefined/NaN || false
             */
            isValue: function(o) {
                // return (o || o === false || o === 0 || o === ''); // Infinity fails
                var l = Y.lang;
        return (l.isObject(o) || l.isString(o) || l.isNumber(o) || l.isBoolean(o));
            }

        };
    };

    // Register the module with the global YUI object
    YUI.add("lang", null , M, "3.0.0");

})();

