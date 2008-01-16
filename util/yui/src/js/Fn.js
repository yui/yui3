(function() {

    var M = function(Y) {

        var Native = Array.prototype;

        // function utils
        Y.fn = {
            /**
             * Returns a function that will execute the supplied function in the
             * supplied object's context, optionally adding any additional
             * supplied parameters to the end of the arguments the function
             * is executed with.
             */
            wrap: function(f, o) {
                var args = Native.slice.call(arguments, 2);
                return function () {
                    return f.apply(o || f, args.concat(Native.slice.call(arguments, 0)));
                };
            }
        };

    };

    YUI.add("fn", null, M, "3.0.0");

})();

