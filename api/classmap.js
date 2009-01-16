YAHOO.env.classMap = {"plugin.DDM": "dd", "plugin.Drop": "dd", "Test.TestNode": "yuitest", "Console": "console", "DOM": "dom", "plugin.DragConstrained": "dd", "Test.DateAssert": "yuitest", "YUI": "yui", "State": "attribute", "Test.ArrayAssert": "yuitest", "YUI~object": "yui", "YUI~substitute": "substitute", "io": "io", "Do.Method": "event", "Assert.UnexpectedError": "yuitest", "Node": "node", "Do": "event", "Widget": "widget", "Test.Runner": "yuitest", "Assert.ShouldError": "yuitest", "Test.Manager": "yuitest", "Overlay": "overlay", "JSON": "json", "Selector": "dom", "Assert": "yuitest", "Event.Handle": "event", "Assert.UnexpectedValue": "yuitest", "Base": "base", "Cookie": "cookie", "Test.Case": "yuitest", "plugin.Drag": "dd", "Event.Target": "event", "Test.Format.Mock": "yuitest", "Lang": "yui", "Slider": "slider", "Test.Suite": "yuitest", "Do.AlterArgs": "event", "Plugin": "plugin", "Assert.ShouldFail": "yuitest", "plugin.NodeMenuNav": "node-menunav", "plugin.DropPlugin": "dd-plugin", "ClassNameManager": "classnamemanager", "Event.Facade": "event", "plugin.Anim": "anim", "Do.Error": "event", "Assert.ObjectAssert": "yuitest", "WidgetStdMod": "widget-stdmod", "Test.Wait": "yuitest", "Do.Halt": "event", "Easing": "anim", "Event.Custom": "event", "Queue": "queue", "Assert.ComparisonFailure": "yuitest", "WidgetPositionExt": "widget-position-ext", "YUI~dump": "dump", "WidgetStack": "widget-stack", "plugin.Proxy": "dd", "Attribute": "attribute", "Get": "yui", "Event.Subscriber": "event", "Do.AlterReturn": "event", "Loader": "yui", "YUI~oop": "oop", "PluginHost": "widget", "Test.Reporter": "yuitest", "Assert.Error": "yuitest", "WidgetPosition": "widget-position", "UA": "yui", "Event": "event", "plugin.DragPlugin": "dd-plugin"};

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
