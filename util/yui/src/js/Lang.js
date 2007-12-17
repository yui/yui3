
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

            _IEEnumFix: Y._IEEnumFix,
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

        // YAHOO.lang.later(timeToWait, instance(context), method/fn, data, interval?);
        // YAHOO.lang.later(10, instance, method, data, true);
        //
        // requires o (can be null) even if method is just a function
        // requires data (can be null) if using an interval
        //
        // YAHOO.lang.later(10, null, someFunction, null, true);
        //
        // It would be better if the API just had what was required:
        //
        // YAHOO.lang.later(10, functionOrCustomClosure, true);
        //
        // context object, callback function, and data object are all over
        // the place in the API.  later, addListener(onAvail, etc, etc), Get, yuiloader
        // connection, and anything that uses these functions and get the data from
        // the implementer (KeyListener).
        //
        // It would be better to get this out of API.  Prototype's bind gets rid of
        // the context obj -- that would help, but really all three of these things are
        // in most of the places we need it.
        //
        // Overloading the function argument to accept either a regular function or
        // a special closure might help
        //
        // var s=YAHOO.context(instance, method, data);
        // YAHOO.lang.later(10, s, true);
        //
        // In this case, fn gets all of the arguments that it was called with plus the
        // 'data' as the last parameter.  This is pretty interesting, but is potentially
        // a problem when calling methods that have optional arguments. 'data' _is_ an
        // optional parameter, so it could be up to the user when to use the data object
        context: function(o, fn, data) {
            var m=fn, d=data;
            return function() {
                var a=arguments, b=[];
                for (var i=0; i<a.length; i=i+1) {
                    b.push(a[i]);
                }
                if (d) {
                    b.push(d);
                }
                m.apply(o, b);
            };
        },

        // without the data object, it can be used generically.  We could still overload
        // the function argument to accept
        //
        // var s=YAHOO.context(instance, method);
        // YAHOO.lang.later(10, s, null, true); // leaves the null 'data' param in the API
        context: function(o, fn) {
            var m=fn;
            return function() {
                m.apply(o, arguments);
            };
        },

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
    YUI.use("lang"); // core YUI

})();

