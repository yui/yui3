YUI.add('collection', function(Y) {

/**
 * Collection utilities beyond what is provided in the YUI core
 * @module yui
 */


var L = Y.Lang, Native = Array.prototype, A = Y.Array;

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
    var s = L.isValue(sort) ? sort : true,
        b = a.slice(), i = 0, n = -1, item = null;
    Y.log("Sort? " + s);
    if (s) {
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



}, '@VERSION@' );
