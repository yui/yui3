
YUI.add("lang", function(Y) {

    /**
     * Provides the language utilites and extensions used by the library
     * @class Lang
     */
    Y.Lang = Y.Lang || {};

    var L = Y.Lang, SPLICE="splice", LENGTH="length";

    /**
     * Determines whether or not the provided object is an array.
     * Testing typeof/instanceof/constructor of arrays across frame 
     * boundaries isn't possible in Safari unless you have a reference
     * to the other frame to test against its Array prototype.  To
     * handle this case, we test well-known array properties instead.
     * properties.
     * @TODO can we kill this cross frame hack?
     * @method isArray
     * @param o The object to test
     * @return {boolean} true if o is an array
     */
     L.isArray = function(o) { 
        if (o) {
           //return L.isNumber(o.length) && L.isFunction(o.splice);
           return (o[SPLICE] && L.isNumber(o[LENGTH]));
        }
        return false;
    };

    /**
     * Determines whether or not the provided object is a boolean
     * @method isBoolean
     * @param o The object to test
     * @return {boolean} true if o is a boolean
     */
    L.isBoolean = function(o) {
        return typeof o === 'boolean';
    };
    
    /**
     * Determines whether or not the provided object is a function
     * @method isFunction
     * @param o The object to test
     * @return {boolean} true if o is a function
     */
    L.isFunction = function(o) {
        return typeof o === 'function';
    };
        
    /**
     * Determines whether or not the supplied object is a date instance
     * @method isDate
     * @param o The object to test
     * @return {boolean} true if o is a date
     */
    L.isDate = function(o) {
        return o instanceof Date;
    };

    /**
     * Determines whether or not the provided object is null
     * @method isNull
     * @param o The object to test
     * @return {boolean} true if o is null
     */
    L.isNull = function(o) {
        return o === null;
    };
        
    /**
     * Determines whether or not the provided object is a legal number
     * @method isNumber
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
     * @param o The object to test
     * @param failfn {boolean} fail if the input is a function
     * @return {boolean} true if o is an object
     */  
    L.isObject = function(o, failfn) {
return (o && (typeof o === 'object' || (!failfn && L.isFunction(o)))) || false;
    };
        
    /**
     * Determines whether or not the provided object is a string
     * @method isString
     * @param o The object to test
     * @return {boolean} true if o is a string
     */
    L.isString = function(o) {
        return typeof o === 'string';
    };
        
    /**
     * Determines whether or not the provided object is undefined
     * @method isUndefined
     * @param o The object to test
     * @return {boolean} true if o is undefined
     */
    L.isUndefined = function(o) {
        return typeof o === 'undefined';
    };
    
    /**
     * Returns a string without any leading or trailing whitespace.  If 
     * the input is not a string, the input will be returned untouched.
     * @method trim
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
     * @param the item to test
     * @return {boolean} true if it is not null/undefined/NaN || false
     */
    L.isValue = function(o) {
// return (o || o === false || o === 0 || o === ''); // Infinity fails
return (L.isObject(o) || L.isString(o) || L.isNumber(o) || L.isBoolean(o));
    };

}, "@VERSION@");

