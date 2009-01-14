(function() {

var M = function(Y) {

    var tabIO = function() {
        tabIO.superclass.constructor.apply(this, arguments);
    };

    tabIO.NAME = 'tabio';

    var proto = {
        initializer: function(config) {
            this.listen(this.owner, 'activeChange', this.onActiveChange, this, true);
        },

        onActiveChange: function() {
            this.request();
        },

        onSuccess: function(o) {
            this.owner.set('content', o.responseText);
        }
    };

    Y.lang.extend(tabIO, Y.IOPlugin, proto);
    Y.TabIOPlugin = tabIO;
};
YUI.add("tabioplugin", M, "3.0.0");
})();
