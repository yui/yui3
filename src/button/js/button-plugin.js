function ButtonPlugin(config) {
    ButtonPlugin.superclass.constructor.apply(this, arguments);
}

Y.extend(ButtonPlugin, Y.ButtonBase, {
    _initNode: function(config) {
        this._host = config.host;
    },

    enable: function() {
        this.set('disabled', false);
    },

    disable: function() {
        this.set('disabled', true);
    }
}, {
    NAME: 'buttonPlugin',
    NS: 'button'
});

Y.Plugin.Button = ButtonPlugin;
