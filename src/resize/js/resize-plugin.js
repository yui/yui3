function ResizePlugin(config) {
    config.node = ((Y.Widget && config.host instanceof Y.Widget) ? config.host.get('boundingBox') : config.host);
    ResizePlugin.superclass.constructor.call(this, config);
}
        
ResizePlugin.NAME = "resize-plugin";

ResizePlugin.NS = "resize";


Y.extend(ResizePlugin, Y.Resize, {

//node: undefined,
//host: undefined,

initializer: function(config) {

        this.on('resize:resize', function(e) {
                this._correctDimensions(e);
        });

},

_correctDimensions: function(e) {
        var node = this.get('node');
        //var widget = this.get('widget');

        node.setX(e.currentTarget.info.left);
        node.setY(e.currentTarget.info.top);

        Y.log('['+node.getX()+', '+node.getY()+']');

}


});
Y.namespace('Plugin');
Y.Plugin.Resize = ResizePlugin;