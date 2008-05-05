(function() {

    var core = [],

    M = function(Y) {

        var C = Y.config;

        Y.log(Y.id + ' setup complete) .');

        if (C.core) {

            core = C.core;

        } else if (C.compat || Y !== YUI) {

            core = ["lang", "array", "core", "object", "ua", "later"];

            if (C.compat) {
                core.push("compat");
            }

            core.push(
              "aop", 
              "event-custom", 
              "event-target", 
              "event-ready",
              "event-dom", "event-facade",
              "node",
              // "io", 
              // "dump", 
              // "substitute",
              "get"
              );

        }

        Y.use.apply(Y, core);
    };
     
    YUI.add("yui", M, "3.0.0");
    
    // {
        // the following will be bound automatically when this code is loaded
      //   use: core
    // });

})();
