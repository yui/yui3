(function() {

    var min = ['log', 'lang', 'array', 'core'], core,

    M = function(Y) {

        var C = Y.config;

        // apply the minimal required functionality
        Y.use.apply(Y, min);

        Y.log(Y.id + ' setup completing) .');

        if (C.core) {

            core = C.core;

        } else {

            core = ["object", "ua", "later"];

            core.push(
              "aop", 
              "event-custom", 
              "event-target", 
              "event-ready",
              "event-dom", 
              "event-facade",
              "get", 
              "loader", 
              "dom", 
              "node", 
              "io");
        }

        Y.use.apply(Y, core);
    };
     
    YUI.add("yui", M, "@VERSION@");
    
    // {
        // the following will be bound automatically when this code is loaded
      //   use: core
    // });

})();
