(function() {

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

var O = Y.Object,

    /**
     * Extracts the keys, values, or size from an object
     * 
     * @method _extract
     * @param o the object
     * @param what what to extract (0: keys, 1: values, 2: size)
     * @return {boolean|Array} the extracted info
     * @private
     */
    _extract = function(o, what) {
        var count = (what === 2), out = (count) ? 0 : [], i;

        for (i in o) {
            if (count) {
                out++;
            } else {
                if (o.hasOwnProperty(i)) {
                    out.push((what) ? o[i] : i);
                }
            }
        }

        return out;
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
    return _extract(o);
};

/**
 * Returns an array containing the object's values
 * @TODO use native Object.values() if available
 * @method Object.values
 * @static
 * @param o an object
 * @return {Array} the values
 */
O.values = function(o) {
    return _extract(o, 1);
};

/**
 * Returns the size of an object
 * @TODO use native Object.size() if available
 * @method Object.size
 * @static
 * @param o an object
 * @return {int} the size
 */
O.size = function(o) {
    return _extract(o, 2);
};

/**
 * Returns true if the object contains a given key
 * @method Object.hasKey
 * @static
 * @param o an object
 * @param k the key to query
 * @return {boolean} true if the object contains the key
 */
O.hasKey = function(o, k) {
    // return (o.hasOwnProperty(k));
    return (k in o);
};

/**
 * Returns true if the object contains a given value
 * @method Object.hasValue
 * @static
 * @param o an object
 * @param v the value to query
 * @return {boolean} true if the object contains the value
 */
O.hasValue = function(o, v) {
    return (Y.Array.indexOf(O.values(o), v) > -1);
};

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
O.owns = O.hasKey;

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
    var s = c || Y, i;

    for (i in o) {
        if (proto || o.hasOwnProperty(i)) {
            f.call(s, o[i], i, o);
        }
    }
    return Y;
};

})();
