YUI.add('pjax-plugin', function(Y) {

/**
Node plugin that provides seamless, gracefully degrading pjax functionality.

@module pjax-plugin
**/

function PjaxPlugin() {
    PjaxPlugin.superclass.constructor.apply(this, arguments);
}

Y.extend(PjaxPlugin, Y.Pjax, {
    // -- Lifecycle Methods ----------------------------------------------------
    initializer: function (config) {
        this._host = config.host;
        this._pluginEvents = this.after(['error', 'load'], this._onComplete);
    },

    destructor: function () {
        this._pluginEvents.detach();
    },

    // -- Protected Event Handlers ---------------------------------------------
    _onComplete: function (e) {
        var content = e.content;

        if (content.node) {
            this._host.setContent(content.node);
        }

        if (content.title && Y.config.doc) {
            Y.config.doc.title = content.title;
        }
    }
}, {
    NS: 'pjax'
});

Y.Plugin.Pjax = PjaxPlugin;


}, '@VERSION@' ,{requires:['node-pluginhost', 'pjax']});
