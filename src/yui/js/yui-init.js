(function() {

    // var min = ['yui-base', 'log', 'lang', 'array', 'core'], core, C = Y.config;
    var min = ['yui-base'], core, C = Y.config;

    // apply the minimal required functionality
    Y.use.apply(Y, min);

    Y.log(Y.id + ' initialized', 'info', 'yui');

    if (C.core) {

        core = C.core;

    } else {

        // core = ["object", "ua", "later"];
        // core.push("get", "loader");
        
        core = ["get", "loader"];
    }

    Y.use.apply(Y, core);

     
})();
