
YUI.add('array-extensions', function(Y) {
  var Native = Array.prototype;
  var A = Y.Array;
  Y.mix(A, {
      /*
      * mozilla methods:
      * filter(select/findAll), every, map, reduce, reduceRight
      *
      * yui-functional additional methods:
      * 
      * detect/find, reject (negated select), grep, partition, zip 
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
              
          }

  });
});
