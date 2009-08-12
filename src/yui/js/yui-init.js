(function() {

    var min = ['yui-base'], core, C = Y.config, LOADER='loader';

    // apply the minimal required functionality
    Y.use.apply(Y, min);

    Y.log(Y.id + ' initialized', 'info', 'yui');

    if (C.core) {
        core = C.core;
    } else {
        core = ['queue-base', 'get'];
        if (YUI.Env.mods[LOADER]) {
            core.push(LOADER);
        }
    }

    Y.use.apply(Y, core);
     
})();

