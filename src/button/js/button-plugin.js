function ButtonPlugin(config) {
    ButtonPlugin.superclass.constructor.apply(this, arguments);
}

Y.extend(ButtonPlugin, Y.ButtonBase, {
    _initNode: function(config) {
        this._host = config.host;
    },

}, {
    NAME: 'buttonPlugin',
    NS: 'button'
});

Y.Plugin.Button = ButtonPlugin;
