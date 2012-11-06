(function () {
var GLOBAL_ENV = YUI.Env;

if (!GLOBAL_ENV._ready) {
    GLOBAL_ENV._ready = function() {
        GLOBAL_ENV.DOMReady = true;
        GLOBAL_ENV.remove(YUI.config.doc, 'DOMContentLoaded', GLOBAL_ENV._ready);
    };

    GLOBAL_ENV.add(YUI.config.doc, 'DOMContentLoaded', GLOBAL_ENV._ready);
}
})();
