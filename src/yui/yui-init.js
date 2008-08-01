/*
 * YUI initializer
 * @module yui
 * @submodule init
 */
(function() {

    var min = ['yui-base', 'log', 'lang', 'array', 'core'], core,

    M = function(Y) {

        var C = Y.config;

        // apply the minimal required functionality
        Y.use.apply(Y, min);

        Y.log(Y.id + ' initialized', 'info', 'YUI');

        if (C.core) {

            core = C.core;

        } else {

            core = ["object", "ua", "later"];

            core.push(
              "get", 
              "loader");
        }

        Y.use.apply(Y, core);

    };
     
    YUI.add("yui", M, "@VERSION@");
    
    // {
        // the following will be bound automatically when this code is loaded
      //   use: core
    // });

})();
