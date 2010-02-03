function TabviewPlugin() {
    TabviewPlugin.superclass.constructor.apply(this, arguments);
};

TabviewPlugin.NAME = 'tabviewPlugin';
TabviewPlugin.NS = 'tabs';

Y.extend(TabviewPlugin, Y.TabviewBase);

// allow for node.tabs()
Y.Node.prototype[TabviewPlugin.NS] = function(config) {
    this.plug(Y.Plugin.Tabview, config);
    return this[TabviewPlugin.NS].render();
};

Y.namespace('Plugin');
Y.Plugin.Tabview = TabviewPlugin;
