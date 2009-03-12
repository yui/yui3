YAHOO.env.classMap = {"plugin.DDM": "dd", "plugin.Drop": "dd", "Test.TestNode": "yuitest", "Console": "console", "DOM": "dom", "YUI": "yui", "Test.DateAssert": "yuitest", "Subscriber": "event", "State": "attribute", "Test.ArrayAssert": "yuitest", "YUI~object": "yui", "YUI~substitute": "substitute", "io": "io", "Do.Method": "event", "Test.Suite": "yuitest", "Assert.UnexpectedError": "yuitest", "Node": "node", "Do": "event", "Widget": "widget", "Test.Runner": "yuitest", "Assert.ShouldError": "yuitest", "Test.Manager": "yuitest", "Overlay": "overlay", "JSON": "json", "Selector": "dom", "Assert": "yuitest", "Slider": "slider", "Assert.UnexpectedValue": "yuitest", "Base": "base", "Cookie": "cookie", "Test.Case": "yuitest", "History": "history", "plugin.Drag": "dd", "Event.Target": "event", "Test.Format.Mock": "yuitest", "Lang": "yui", "plugin.DragConstrained": "dd", "History.Module": "history", "Do.AlterArgs": "event", "Plugin": "plugin", "Assert.ShouldFail": "yuitest", "plugin.NodeMenuNav": "node-menunav", "plugin.DropPlugin": "dd-plugin", "ClassNameManager": "classnamemanager", "Queue": "queue", "plugin.Anim": "anim", "Do.Error": "event", "Assert.ObjectAssert": "yuitest", "WidgetStdMod": "widget-stdmod", "Test.Wait": "yuitest", "Do.Halt": "event", "Loader": "yui", "Easing": "anim", "Event.Custom": "event", "EventHandle": "event", "Assert.ComparisonFailure": "yuitest", "WidgetPositionExt": "widget-position-ext", "YUI~dump": "dump", "WidgetStack": "widget-stack", "plugin.Proxy": "dd", "Attribute": "attribute", "Get": "yui", "Do.AlterReturn": "event", "EventFacade": "event", "YUI~oop": "oop", "PluginHost": "widget", "Test.Reporter": "yuitest", "Assert.Error": "yuitest", "WidgetPosition": "widget-position", "UA": "yui", "Event": "event", "plugin.DragPlugin": "dd-plugin"};

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
