/*
 * YUI lang utils
 * @module yui
 * @submodule lang
 */
YUI.add("lang", function(Y) {

    /**
     * Provides the language utilites and extensions used by the library
     * @class Lang
     * @static
     */
    Y.Lang = Y.Lang || {};

    var L = Y.Lang, 

    ARRAY_TOSTRING = '[object Array]',
    FUNCTION_TOSTRING = '[object Function]',
    STRING = 'string',
    OBJECT = 'object',
    BOOLEAN = 'boolean',
    UNDEFINED = 'undefined',
    OP = Object.prototype;

    /**
     * Determines whether or not the provided object is an array.
     * Testing typeof/instanceof/constructor of arrays across frame 
     * boundaries isn't possible in Safari unless you have a reference
     * to the other frame to test against its Array prototype.  To
     * handle this case, we test well-known array properties instead.
     * properties.
     * @TODO can we kill this cross frame hack?
     * @method isArray
     * @static
     * @param o The object to test
     * @return {boolean} true if o is an array
     */
    L.isArray = function(o) { 
        return OP.toString.apply(o) === ARRAY_TOSTRING;
    };

    /**
     * Determines whether or not the provided object is a boolean
     * @method isBoolean
     * @static
     * @param o The object to test
     * @return {boolean} true if o is a boolean
     */
    L.isBoolean = function(o) {
        return typeof o === BOOLEAN;
    };
    
    /**
     * Determines whether or not the provided object is a function
     * Note: Internet Explorer thinks certain functions are objects:
     *
     * var obj = document.createElement("object");
     * Y.Lang.isFunction(obj.getAttribute) // reports false in IE
     *
     * var input = document.createElement("input"); // append to body
     * Y.Lang.isFunction(input.focus) // reports false in IE
     *
     * You will have to implement additional tests if these functions
     * matter to you.
     *
     * @method isFunction
     * @static
     * @param o The object to test
     * @return {boolean} true if o is a function
     */
    L.isFunction = function(o) {
        return OP.toString.apply(o) === FUNCTION_TOSTRING;
    };
        
    /**
     * Determines whether or not the supplied object is a date instance
     * @method isDate
     * @static
     * @param o The object to test
     * @return {boolean} true if o is a date
     */
    L.isDate = function(o) {
        return o instanceof Date;
    };

    /**
     * Determines whether or not the provided object is null
     * @method isNull
     * @static
     * @param o The object to test
     * @return {boolean} true if o is null
     */
    L.isNull = function(o) {
        return o === null;
    };
        
    /**
     * Determines whether or not the provided object is a legal number
     * @method isNumber
     * @static
     * @param o The object to test
     * @return {boolean} true if o is a number
     */
    L.isNumber = function(o) {
        return typeof o === 'number' && isFinite(o);
    };
      
    /**
     * Determines whether or not the provided object is of type object
     * or function
     * @method isObject
     * @static
     * @param o The object to test
     * @param failfn {boolean} fail if the input is a function
     * @return {boolean} true if o is an object
     */  
    L.isObject = function(o, failfn) {
return (o && (typeof o === OBJECT || (!failfn && L.isFunction(o)))) || false;
    };
        
    /**
     * Determines whether or not the provided object is a string
     * @method isString
     * @static
     * @param o The object to test
     * @return {boolean} true if o is a string
     */
    L.isString = function(o) {
        return typeof o === STRING;
    };
        
    /**
     * Determines whether or not the provided object is undefined
     * @method isUndefined
     * @static
     * @param o The object to test
     * @return {boolean} true if o is undefined
     */
    L.isUndefined = function(o) {
        return typeof o === UNDEFINED;
    };
    
    /**
     * Returns a string without any leading or trailing whitespace.  If 
     * the input is not a string, the input will be returned untouched.
     * @method trim
     * @static
     * @param s {string} the string to trim
     * @return {string} the trimmed string
     */
    L.trim = function(s){
        try {
            return s.replace(/^\s+|\s+$/g, "");
        } catch(e) {
            return s;
        }
    };

    /**
     * A convenience method for detecting a legitimate non-null value.
     * Returns false for null/undefined/NaN, true for other values, 
     * including 0/false/''
     * @method isValue
     * @static
     * @param o The item to test
     * @return {boolean} true if it is not null/undefined/NaN || false
     */
    L.isValue = function(o) {
// return (o || o === false || o === 0 || o === ''); // Infinity fails
return (L.isObject(o) || L.isString(o) || L.isNumber(o) || L.isBoolean(o));
    };

}, "@VERSION@");

