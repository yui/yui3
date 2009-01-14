
/**
 * Adds the following Object utilities to the YUI instance
 * @class YUI~object
 */

/**
 * Y.Object(o) returns a new object based upon the supplied object.  
 * @TODO Use native Object.create() when available
 * @method Object
 * @static
 * @param o the supplier object
 * @return {object} the new object
 */
Y.Object = function(o) {
    var F = function() {};
    F.prototype = o;
    return new F();
}; 

var O = Y.Object, L = Y.Lang;

/**
 * Determines whether or not the property was added
 * to the object instance.  Returns false if the property is not present
 * in the object, or was inherited from the prototype.
 *
 * @deprecated Safari 1.x support has been removed, so this is simply a 
 * wrapper for the native implementation.  Use the native implementation
 * directly instead.
 *
 * @TODO Remove in B1
 *
 * @method Object.owns
 * @static
 * @param o {any} The object being testing
 * @param p {string} the property to look for
 * @return {boolean} true if the object has the property on the instance
 */
O.owns = function(o, p) {
    Y.message('Object.owns is deprecated, use the native method');
    return (o && o.hasOwnProperty) ? o.hasOwnProperty(p) : false;
};

/**
 * Returns an array containing the object's keys
 * @TODO use native Object.keys() if available
 * @method Object.keys
 * @static
 * @param o an object
 * @return {string[]} the keys
 */
O.keys = function(o) {
    var a=[], i;
    for (i in o) {
        if (o.hasOwnProperty(i)) {
            a.push(i);
        }
    }

    return a;
};

/**
 * Executes a function on each item. The function
 * receives the value, the key, and the object
 * as paramters (in that order).
 * @method Object.each
 * @static
 * @param o the object to iterate
 * @param f {function} the function to execute
 * @param c the execution context
 * @param proto {boolean} include proto
 * @return {YUI} the YUI instance
 */
O.each = function (o, f, c, proto) {
    var s = c || Y;

    for (var i in o) {
        if (proto || o.hasOwnProperty(i)) {
            f.call(s, o[i], i, o);
        }
    }
    return Y;
};
