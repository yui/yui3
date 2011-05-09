/**
 * The YUI module contains the components required for building the YUI seed
 * file.  This includes the script loading mechanism, a simple queue, and the
 * core utilities for the library.
 * @module yui
 * @submodule yui-base
 */

var Lang   = Y.Lang,
    Native = Array.prototype;

/**
 * Adds utilities to the YUI instance for working with arrays. Additional array
 * helpers can be found in the `collection` module.
 *
 * @class Array
 */

/**
 * `Y.Array(thing)` returns an array created from _thing_. Depending on
 * _thing_'s type, one of the following will happen:
 *
 *   - Arrays are returned unmodified unless a non-zero _startIndex_ is
 *     specified.
 *   - Array-like collections (see `Array.test()`) are converted to arrays.
 *   - For everything else, a new array is created with _thing_ as the sole
 *     item.
 *
 * Note: elements that are also collections, such as `<form>` and `<select>`
 * elements, are not automatically converted to arrays. To force a conversion,
 * pass `true` as the value of the _force_ parameter.
 *
 * @method ()
 * @param {mixed} thing The thing to arrayify.
 * @param {int} [startIndex=0] If non-zero and _thing_ is an array or array-like
 *   collection, a subset of items starting at the specified index will be
 *   returned.
 * @param {boolean} [force=false] If `true`, _thing_ will be treated as an
 *   array-like collection no matter what.
 * @return {Array}
 * @static
 */
function YArray(thing, startIndex, force) {
    var len, result;

    startIndex || (startIndex = 0);

    if (force || YArray.test(thing)) {
        // IE throws when trying to slice HTMLElement collections.
        try {
            return Native.slice.call(thing, startIndex);
        } catch (ex) {
            result = [];

            for (len = thing.length; startIndex < len; ++startIndex) {
                result.push(thing[startIndex]);
            }

            return result;
        }
    }

    return [thing];
}

Y.Array = YArray;

/**
 * Evaluates _obj_ to determine if it's an array, an array-like collection, or
 * something else. This is useful when working with the function `arguments`
 * collection and `HTMLElement` collections.
 *
 * Note: This implementation doesn't consider elements that are also
 * collections, such as `<form>` and `<select>`, to be array-like.
 *
 * @method test
 * @param {object} obj Object to test.
 * @return {int} A number indicating the results of the test:
 *   - 0: Neither an array nor an array-like collection.
 *   - 1: Real array.
 *   - 2: Array-like collection.
 * @static
 */
YArray.test = function (obj) {
    var result = 0;

    if (Lang.isArray(obj)) {
        result = 1;
    } else if (Lang.isObject(obj)) {
        try {
            // indexed, but no tagName (element) or alert (window),
            // or functions without apply/call (Safari
            // HTMLElementCollection bug).
            if ('length' in obj && !obj.tagName && !obj.alert && !obj.apply) {
                result = 2;
            }
        } catch (ex) {}
    }

    return result;
};

/**
 * Executes the supplied function on each item in the array. This method wraps
 * the native ES5 `Array.forEach()` method if available.
 *
 * @method each
 * @param {Array} array Array to iterate.
 * @param {Function} fn Function to execute on each item in the array.
 *   @param {mixed} fn.item Current array item.
 *   @param {Number} fn.index Current array index.
 *   @param {Array} fn.array Array being iterated.
 * @param {Object} [thisObj] `this` object to use when calling _fn_.
 * @return {YUI} The YUI instance.
 * @chainable
 * @static
 */
YArray.each = Native.forEach ? function (array, fn, thisObj) {
    Native.forEach.call(array || [], fn, thisObj || Y);
    return Y;
} : function (array, fn, thisObj) {
    for (var i = 0, len = (array && array.length) || 0; i < len; ++i) {
        fn.call(thisObj || Y, array[i], i, array);
    }

    return Y;
};

/**
 * Returns an object using the first array as keys and the second as values. If
 * the second array is not provided, or if it doesn't contain the same number of
 * values as the first array, then `true` will be used in place of the missing
 * values.
 *
 * @example
 *
 *     Y.Array.hash(['a', 'b', 'c'], ['foo', 'bar']);
 *     // => {a: 'foo', b: 'bar', c: true}
 *
 * @method hash
 * @param {Array} keys Array to use as keys.
 * @param {Array} [values] Array to use as values.
 * @return {Object}
 * @static
 */
YArray.hash = function (keys, values) {
    var hash = {},
        vlen = values && values.length,
        i, len;

    for (i = 0, len = keys.length; i < len; ++i) {
        hash[keys[i]] = vlen && vlen > i ? values[i] : true;
    }

    return hash;
};

/**
 * Returns the index of the first item in the array that's equal (using a strict
 * equality check) to the specified _value_, or `-1` if the value isn't found.
 *
 * This method wraps the native ES5 `Array.indexOf()` method if available.
 *
 * @method indexOf
 * @param {Array} array Array to search.
 * @param {any} value Value to search for.
 * @return {Number} Index of the item strictly equal to _value_, or `-1` if not
 *   found.
 * @static
 */
YArray.indexOf = Native.indexOf ? function (array, value) {
    // TODO: support fromIndex
    return Native.indexOf.call(array, value);
} : function (array, value) {
    for (var i = 0, len = array.length; i < len; ++i) {
        if (array[i] === value) {
            return i;
        }
    }

    return -1;
};

/**
 * Numeric sort convenience function.
 *
 * The native `Array.prototype.sort()` function converts values to strings and
 * sorts them in lexicographic order, which is unsuitable for sorting numeric
 * values. Provide `Y.Array.numericSort` as a custom sort function when you want
 * to sort values in numeric order.
 *
 * @example
 *
 *     [42, 23, 8, 16, 4, 15].sort(Y.Array.numericSort);
 *     // => [4, 8, 15, 16, 23, 42]
 *
 * @method numericSort
 * @param {Number} a First value to compare.
 * @param {Number} b Second value to compare.
 * @return {Number} Difference between _a_ and _b_.
 * @static
 */
YArray.numericSort = function (a, b) {
    return a - b;
};

/**
 * Executes the supplied function on each item in the array. Returning a truthy
 * value from the function will stop the processing of remaining items.
 *
 * @method some
 * @param {Array} array Array to iterate.
 * @param {Function} fn Function to execute on each item.
 *   @param {mixed} fn.value Current array item.
 *   @param {Number} fn.index Current array index.
 *   @param {Array} fn.array Array being iterated.
 * @param {Object} [thisObj] `this` object to use when calling _fn_.
 * @return {Boolean} `true` if the function returns a truthy value on any of the
 *   items in the array; `false` otherwise.
 * @static
 */
YArray.some = Native.some ? function (array, fn, thisObj) {
    return Native.some.call(array, fn, thisObj);
} : function (array, fn, thisObj) {
    for (var i = 0, len = array.length; i < len; ++i) {
        if (fn.call(thisObj, array[i], i, array)) {
            return true;
        }
    }

    return false;
};
