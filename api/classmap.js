YAHOO.env.classMap = {"plugin.DDM": "dd", "plugin.Drop": "dd", "Test.TestNode": "yuitest", "Console": "console", "DOM": "dom", "Test.DateAssert": "yuitest", "YUI": "yui", "State": "attribute", "Test.ArrayAssert": "yuitest", "YUI~object": "yui", "YUI~substitute": "substitute", "io": "io", "Assert.UnexpectedError": "yuitest", "Node": "node", "Widget": "widget", "Test.Runner": "yuitest", "Get": "yui", "Test.Manager": "yuitest", "Overlay": "overlay", "Assert.UnexpectedValue": "yuitest", "Selector": "dom", "Assert": "yuitest", "Slider": "slider", "JSON": "json", "Base": "base", "Cookie": "cookie", "Test.Case": "yuitest", "plugin.Drag": "dd", "Test.Format.Mock": "yuitest", "Lang": "yui", "Test.Suite": "yuitest", "Plugin": "plugin", "Assert.ShouldFail": "yuitest", "plugin.NodeMenuNav": "node-menunav", "plugin.DropPlugin": "dd-plugin", "ClassNameManager": "classnamemanager", "Queue": "queue", "plugin.Anim": "anim", "Assert.ObjectAssert": "yuitest", "WidgetStdMod": "widget-stdmod", "Test.Wait": "yuitest", "Easing": "anim", "Assert.ComparisonFailure": "yuitest", "WidgetPositionExt": "widget-position-ext", "YUI~dump": "dump", "WidgetStack": "widget-stack", "plugin.Proxy": "dd", "Attribute": "attribute", "Assert.ShouldError": "yuitest", "plugin.DragConstrained": "dd", "Loader": "yui", "YUI~oop": "oop", "PluginHost": "widget", "Test.Reporter": "yuitest", "Assert.Error": "yuitest", "WidgetPosition": "widget-position", "UA": "yui", "Event": "event", "plugin.DragPlugin": "dd-plugin"};

YAHOO.env.resolveClass = function(className) {
    var a=className.split('.'), ns=YAHOO.env.classMap;

    for (var i=0; i<a.length; i=i+1) {
        if (ns[a[i]]) {
            ns = ns[a[i]];
        } else {
            return null;
        }
    }

    return ns;
};
