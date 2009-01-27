/*
 * Array extensions
 * @module array-extensions
 */

YUI.add('array-extensions', function(Y) {
    var Native = Array.prototype;
    var A = Y.Array;
    Y.mix(A, {

        /**
        * Adds the following array utilities to the YUI instance
        * @class YUI~array
        */
        
        /**
        * Executes the supplied function on each item in the array.
        * Returns a new array containing the items that the supplied
        * function returned true for.
        * @method Array.filter
        * @param a {Array} the array to iterate
        * @param f {Function} the function to execute on each item
        * @param o Optional context object
        * @static
        * @return {Array} The items on which the supplied function
        * returned true.
        */
        filter: (Native.filter) ?
            function(a, f, o) {
                return Native.filter.call(a, f, o);
            } :
            function(a, f, o) {
                var results = [];
                A.each(a, function(item, i, a) {
                    if (f.call(o, item, i, a)) {
                        results.push(item);
                    }
                });

                return results;
            },

        /**
        * The inverse of filter. Executes the supplied function on each item. 
        * Returns a new array containing the items that the supplied
        * function returned *false* for.
        * @method Array.reject
        * @param a {Array} the array to iterate
        * @param f {Function} the function to execute on each item
        * @param o Optional context object
        * @static
        * @return {Array} The items on which the supplied function
        * returned false.
        */
        reject: 
            function(a, f, o) {
                return A.filter(a, function(item, i, a) {
                    return !f.call(o, item, i, a);
                });
            },

        /**
        * Executes the supplied function on each item in the array.
        * @method Array.every
        * @param a {Array} the array to iterate
        * @param f {Function} the function to execute on each item
        * @param o Optional context object
        * @static
        * @return {boolean} true if every item in the array returns true
        * from the supplied function.
        */
        every: (Native.every) ?
            function(a, f, o) {
                return Native.every.call(a,f,o);
            } :
            function(a, f, o) {
                var l = a.length;
                for (var i = 0; i < l; i=i+1) {
                    if (!f.call(o, a[i], i, a)) {
                        return false;
                    }
                }

                return true;
            },

        /**
        * Executes the supplied function on each item in the array.
        * @method Array.map
        * @param a {Array} the array to iterate
        * @param f {Function} the function to execute on each item
        * @param o Optional context object
        * @static
        * @return {Array} A new array containing the return value
        * of the supplied function for each item in the original
        * array.
        */
        map: (Native.map) ? 
            function(a, f, o) {
                return Native.map.call(a, f, o);
            } :
            function(a, f, o) {
                var results = [];
                A.each(a, function(item, i, a) {
                    results.push(f.call(o, item, i, a));
                });
                return results;
            },

        reduce: (Native.reduce) ?
            function(a, init, f, o) {
                //Firefox's Array.reduce does not allow inclusion of a
                //  thisObject, so we need to implement it ourselves
                return Native.reduce.call(a, function(init, item, i, a) {
                    return f.call(o, init, item, i, a);
                }, init);
            } :
            function(a, init, f, o) {
                var r = init;
                A.each(a, function (item, i, a) {
                    r = f.call(o, r, item, i, a);
                });
                return r;
            },

        find:
            function(a, f, o) {
                var l = a.length;
                for(var i=0; i < l; i++) {
                    if (f.call(o, a[i], i, a)) {
                        return a[i];
                    }
                }
                return null;
            },

      /**
        Function: grep

        Parameters:
        a - a collection to iterate over
        pattern - The regular expression to test against each item

        Returns:
        All the items in the collection that produce a match against the
        supplied regular expression. If no items match, an empty array is returned.

        Example:
        var matches = Y.Array.grep(['Chris', 'Dan', 'Diego'], /^D.+$/);
        
        => ['Dan', 'Diego']
      */
      grep:
          function (a, pattern) {
              return A.filter(a, function (item, index) {
                  return pattern.test(item);
              });
          },
    
      /**
        Function: partition

        Parameters:
        a - a collection to iterate over
        f - a function that will receive each item in the collection and its index
        o - execution context of f.

        Returns:
        An object with two members, 'matches' and 'rejects', that are arrays
        continaing the items that were selected or rejected by the test function
        (or an empty array).

        Example:
        var nums = Y.Array.partition([1, 2, 3, 4], function (item) {
            return item % 2 == 0;
        });

        nums.matches => [2, 4]
        nums.rejects => [1, 3]
      */
      partition:
          function (a, f, o) {
              var results = {matches: [], rejects: []};
              A.each(a, function (item, index) {
                  var set = f.call(o, item, index, a) ? results.matches : results.rejects;
                  set.push(item);
              });
              return results;
          },
    
      /**
        Function: zip

        Parameters:
        a - a collection to iterate over
        a2 - another collection whose members will be paired with members of the first parameter

        Returns:
        An array of arrays formed by pairing each element of the first collection
        with an item in the second collection having the corresponding index.
        
        Example:
        var pairs = Y.Array.zip([1, 2, 3], ['a', 'b', 'c']);

        => [[1, 'a'], [2, 'b'], [3, 'c']]
      */
      zip: function (a, a2) {
          var results = [];
          A.each(a, function (item, index) {
              results.push([item, a2[index]]);
          });
          return results;
      }

  });
});
