
YUI.add('array-extensions', function(Y) {
  var Native = Array.prototype;
  var A = Y.Array;
  Y.mix(A, {

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

      reject: 
          function(a, f, o) {
              return A.filter(a, function(item, i, a) {
                  return !f.call(o, item, i, a);
              });
          },

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
              return Native.reduce.call(a, f, init, o);
          } :
          function(a, f, init, o) {
              
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
