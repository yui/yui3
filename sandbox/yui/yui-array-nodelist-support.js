
/**
 * The YUI module contains the components required for building the YUI seed file.
 * This includes the script loading mechanism, a simple queue, and the core utilities for the library.
 * @module yui
 * @submodule yui-base
 */

(function() {

var L = Y.Lang, Native = Array.prototype,

/**
 * Adds the following array utilities to the YUI instance.  Additional
 * array helpers can be found in the collection component.
 * @class Array
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
 * @method ()
 * @static
 *   @param o the item to arrayify
 *   @param i {int} if an array or array-like, this is the start index
 *   @param al {boolean} if true, it forces the array-like fork.  This
 *   can be used to avoid multiple array.test calls.
 *   @return {Array} the resulting array
 */
YArray = function(o, startIdx, al) {
    var t = (al) ? 2 : Y.Array.test(o), i, l, a, 
        start = startIdx || 0;

    if (t == 3) {
        o = o._nodes;
    }

    if (t) {
        try {
            return Native.slice.call(o, start);
        // IE errors when trying to slice element collections
        } catch(e) {
            a=[];
            for (i=start, l=o.length; i<l; i=i+1) {
                a.push(o[i]);
            }
            return a;
        }
    } else {
        return [o];
    }

};

Y.Array = YArray;

/** 
 * Evaluates the input to determine if it is an array, array-like, or 
 * something else.  This is used to handle the arguments collection 
 * available within functions, and HTMLElement collections
 *
 * @method test
 * @static
 *
 * @todo current implementation (intenionally) will not implicitly 
 * handle html elements that are array-like (forms, selects, etc).  
 *
 * @return {int} a number indicating the results:
 * 0: Not an array or an array-like collection
 * 1: A real array. 
 * 2: array-like collection.
 * 3: YUI3 NodeList
 */
YArray.test = function(o) {
    var r = 0;
    if (L.isObject(o)) {
        if (L.isArray(o)) {
            r = 1; 
        } else {
            try {
                // indexed, but no tagName (element) or alert (window)
                if ("length" in o && !(o.tagName) && !(o.alert) && !(o.apply)) {
                    r = 2;
                } else if (Y.NodeList && o instanceof Y.NodeList) {
                    r = 3;
                }
                    
            } catch(e) {}
        }
    }
    return r;
};

/**
 * Executes the supplied function on each item in the array.
 * @method each
 * @param a {Array} the array to iterate
 * @param f {Function} the function to execute on each item.  The 
 * function receives three arguments: the value, the index, the full array.
 * @param o Optional context object
 * @static
 * @return {YUI} the YUI instance
 */
YArray.each = (Native.forEach) ?
    function (a, f, o) { 
        Native.forEach.call(a || [], f, o || Y);
        return Y;
    } :
    function (a, f, o) { 
        var l = (a && a.length) || 0, i;
        for (i = 0; i < l; i=i+1) {
            f.call(o || Y, a[i], i, a);
        }
        return Y;
    };

/**
 * Returns an object using the first array as keys, and
 * the second as values.  If the second array is not
 * provided the value is set to true for each.
 * @method hash
 * @static
 * @param k {Array} keyset
 * @param v {Array} optional valueset
 * @return {object} the hash
 */
YArray.hash = function(k, v) {
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
 * @method indexOf
 * @static
 * @param a {Array} the array to search
 * @param val the value to search for
 * @return {int} the index of the item that contains the value or -1
 */
YArray.indexOf = (Native.indexOf) ?
    function(a, val) {
        return Native.indexOf.call(a, val);
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
 * Numeric sort convenience function.
 * Y.ArrayAssert.itemsAreEqual([1, 2, 3], [3, 1, 2].sort(Y.Array.numericSort));
 * @method numericSort
 */
YArray.numericSort = function(a, b) { 
    return (a - b); 
};

/**
 * Executes the supplied function on each item in the array.
 * Returning true from the processing function will stop the 
 * processing of the remaining
 * items.
 * @method some
 * @param a {Array} the array to iterate
 * @param f {Function} the function to execute on each item. The function 
 * receives three arguments: the value, the index, the full array.
 * @param o Optional context object
 * @static
 * @return {boolean} true if the function returns true on
 * any of the items in the array
 */
YArray.some = (Native.some) ?
    function (a, f, o) { 
        return Native.some.call(a, f, o);
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

})();
