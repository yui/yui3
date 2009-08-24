/**
 * The YUI module contains the components required for building the YUI seed file.
 * This includes the script loading mechanism, a simple queue, and the core utilities for the library.
 * @module yui
 * @submodule yui-base
 */

(function() {

    var min = ['yui-base'], core, C = Y.config, mods = YUI.Env.mods,
        extras, i;

    // apply the minimal required functionality
    Y.use.apply(Y, min);

    Y.log(Y.id + ' initialized', 'info', 'yui');

    if (C.core) {
        core = C.core;
    } else {
        core = [];
        extras = ['get', 'loader', 'yui-log', 'yui-later'];

        for (i=0; i<extras.length; i++) {
            if (mods[extras[i]]) {
                core.push(extras[i]);
            }
        }
    }

    Y.use.apply(Y, core);
     
})();

