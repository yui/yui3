(function() {

    // var min = ['yui-base', 'log', 'lang', 'array', 'core'], core, C = Y.config;
    var min = ['yui-base'], core, C = Y.config;

    // apply the minimal required functionality
    Y.use.apply(Y, min);

    Y.log(Y.id + ' initialized', 'info', 'yui');

    if (C.core) {

        core = C.core;

    } else {

        core = ['queue-base', 'get', 'loader'];
    }

    Y.use.apply(Y, core);

     
})();

