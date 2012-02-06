function ButtonPlugin() {
    ButtonPlugin.superclass.constructor.apply(this, arguments);
};

Y.extend(ButtonPlugin, Y.ButtonBase, {
    initNode: function(config) {
        this._host = config.host;
    }
}, {
    NAME: 'ButtonPlugin',
    NS: 'button'
});

Y.Plugin.Button = ButtonPlugin;
