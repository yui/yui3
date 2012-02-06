function ButtonPlugin(config) {
    this._host = config.host;
    ButtonPlugin.superclass.constructor.apply(this, arguments);
}

Y.extend(ButtonPlugin, Y.ButtonBase, {
    getNode: function(config) {
        return this._host;
    }
}, {
    NAME: 'buttonPlugin',
    NS: 'button'
});

Y.Plugin.Button = ButtonPlugin;
