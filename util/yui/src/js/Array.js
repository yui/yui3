(function() {

    var M = function(Y) {

        var L = Y.lang, Native = Array.prototype;
        
        // YUI array utilities
        Y.array = {

            /** 
             * Evaluates the input to determine if it is an array, array-like, or 
             * something else.  This is used to handle the arguments collection 
             * available within functions, and HTMLElement collections
             * @return {int} a number indicating the results:
             * 0: Not an array or array-like. 
             * 1: A real array. 
             * 2: Not an array, but is array-like.
             */
            test: function(o) {
                var r = 0;
                if (o) {
                    if (L.isArray(o) {
                        r = 1; 
                    } else {
                        try {
                            if ( !L.isString(o) && // o is not a string
                                     "length" in o  && // o is indexed
                                     !("tagName" in o) && // o is not an HTML element
                                     !("alert" in o)) {   // o is not a window
                                r = 2; 
                            }
                                
                        } catch(ex) {
                        }
                    }
                }
                return r;
            },

            /** 
             * Returns an array:
             * - Arrays are return unmodified unless the start position is specified.
             * - "Array-like" collections (@see Array.test) are converted to arrays
             * - For everything else, a new array is created with the input as the sole item
             * - The start position is used if the input is or is like an array to return
             *   a subset of the collection.
             */
            coerce: function(o, start) {
                switch (Y.array.test(o)) {
                    case 1:
                        return (start) ? o.slice(o, start) : o;
                    case 2:
                        return Native.slice.call(o, start || 0);
                    default:
                        return [o];
                }
            }

            //toHash
        };
    };

    YUI.add("array", null , M, "3.0.0");

})();

