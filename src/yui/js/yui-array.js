(function() {
/**
 * YUI core
 * @module yui
 */


var L = Y.Lang, Native = Array.prototype,

/**
 * Adds the following array utilities to the YUI instance
 * @class YUI~array
 */

/** 
 * Y.Array(o) returns an array:
 * - Arrays are return unmodified unless the start position is specified.
 * - "Array-like" collections (@see Array.test) are converted to arrays
 * - For everything else, a new array is created with the input as the sole item
 * - The start position is used if the input is or is like an array to return
 *   a subset of the collection.
 *
 *   @TODO this will not automatically convert elements that are also collections
 *   such as forms and selects.  Passing true as the third param will
 *   force a conversion.
 *
 * @method Array
 * @static
 *   @param o the item to arrayify
 *   @param i {int} if an array or array-like, this is the start index
 *   @param al {boolean} if true, it forces the array-like fork.  This
 *   can be used to avoid multiple array.test calls.
 *   @return {Array} the resulting array
 */
A = function(o, i, al) {
    var t = (al) ? 2 : Y.Array.test(o);

    // switch (t) {
    //     case 1:
    //         // return (i) ? o.slice(i) : o;
    //     case 2:
    //         return Native.slice.call(o, i || 0);
    //     default:
    //         return [o];
    // }

    if (t) {
        return Native.slice.call(o, i || 0);
    } else {
        return [o];
    }

};

Y.Array = A;

/** 
 * Evaluates the input to determine if it is an array, array-like, or 
 * something else.  This is used to handle the arguments collection 
 * available within functions, and HTMLElement collections
 *
 * @method Array.test
 * @static
 *
 * @todo current implementation (intenionally) will not implicitly 
 * handle html elements that are array-like (forms, selects, etc).  
 *
 * @return {int} a number indicating the results:
 * 0: Not an array or an array-like collection
 * 1: A real array. 
 * 2: array-like collection.
 */
A.test = function(o) {
    var r = 0;
    if (L.isObject(o, true)) {
        if (L.isArray(o)) {
            r = 1; 
        } else {
            try {
                // indexed, but no tagName (element) or alert (window)
                if ("length" in o && 
                    !("tagName" in o) && 
                    !("alert" in o) && 
                    (!Y.Lang.isFunction(o.size) || o.size() > 1)) {
                        r = 2;
                }
                    
            } catch(ex) {}
        }
    }
    return r;
};

/**
 * Executes the supplied function on each item in the array.
 * @method Array.each
 * @param a {Array} the array to iterate
 * @param f {Function} the function to execute on each item
 * @param o Optional context object
 * @static
 * @return {YUI} the YUI instance
 */
A.each = (Native.forEach) ?
    function (a, f, o) { 
        Native.forEach.call(a, f, o || Y);
        return Y;
    } :
    function (a, f, o) { 
        var l = a.length, i;
        for (i = 0; i < l; i=i+1) {
            f.call(o || Y, a[i], i, a);
        }
        return Y;
    };

/**
 * Executes the supplied function on each item in the array.
 * Returning true from the processing function will stop the 
 * processing of the remaining
 * items.
 * @method Array.some
 * @param a {Array} the array to iterate
 * @param f {Function} the function to execute on each item
 * @param o Optional context object
 * @static
 * @return {boolean} true if the 
 */
 A.some = (Native.forEach) ?
    function (a, f, o) { 
        Native.some.call(a, f, o || Y);
        return Y;
    } :
    function (a, f, o) {
        var l = a.length, i;
        for (i=0; i<l; i=i+1) {
            if (f.call(o, a[i], i, a)) {
                return true;
            }
        }
        return false;
    };

/**
 * Returns an object using the first array as keys, and
 * the second as values.  If the second array is not
 * provided the value is set to true for each.
 * @method Array.hash
 * @static
 * @param k {Array} keyset
 * @param v {Array} optional valueset
 * @return {object} the hash
 */
A.hash = function(k, v) {
    var o = {}, l = k.length, vl = v && v.length, i;
    for (i=0; i<l; i=i+1) {
        o[k[i]] = (vl && vl > i) ? v[i] : true;
    }

    return o;
};


/**
 * Returns the index of the first item in the array
 * that contains the specified value, -1 if the
 * value isn't found.
 * @method Array.indexOf
 * @static
 * @param a {Array} the array to search
 * @param val the value to search for
 * @return {int} the index of the item that contains the value or -1
 */
A.indexOf = (Native.indexOf) ?
    function(a, val) {
        return a.indexOf(val);
    } :
    function(a, val) {
        for (var i=0; i<a.length; i=i+1) {
            if (a[i] === val) {
                return i;
            }
        }

        return -1;
    };

/**
 * Returns the index of the last item in the array
 * that contains the specified value, -1 if the
 * value isn't found.
 * method Array.lastIndexOf
 * @static
 * @param a {Array} the array to search
 * @param val the value to search for
 * @return {int} the index of hte item that contains the value or -1
 */
A.lastIndexOf = (Native.lastIndexOf) ?
    function(a ,val) {
        return a.lastIndexOf(val);    
    } :
    function(a, val) {
        for (var i=a.length-1; i>=0; i=i-1) {
            if (a[i] === val) {
                break;
            }
        }
        return i;
    };

/**
 * Returns a copy of the array with the duplicate entries removed
 * @method Array.unique
 * @static
 * @param a {Array} the array to find the subset of uniques for
 * @param sort {bool} flag to denote if the array should be sorted or not. Defaults to true, this is a faster operation
 * @return {Array} a copy of the array with duplicate entries removed
 */
A.unique = function(a, sort) {
    var s = L.isValue(sort) ? sort : true;
    var b = a.slice(), i = 0, n, item;
    Y.log("Sort? " + s);
    if (s) {
        n = -1, item = null;
        b.sort();
        Y.log("Start: " + b);
        while (i < b.length) {
            if (b[i] === item) {
                n = (n == -1 ? i : n);
                i += 1;
            } else if (s !== -1) {
                Y.log("Removing " + (i-n) + " elements starting at " + n);
                b.splice(n, i-n);
                i = n;                
                n = -1;
            } else {
                item = b[i];
                i += 1;
            }
        }
        Y.log("Result: " + b);
        return b;
    } else {
        Y.log("Start: " + b);        
        while (i < b.length) {
            item = b[i];
            while ((n = b.lastIndexOf(item)) !== i) {
                b.splice(n, 1);
            }
            i += 1;
        }
        Y.log("Result: " + b);
        return b;
    }
};

})();
