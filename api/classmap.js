YAHOO.env.classMap = {"NodeList": "node", "YUI": "yui", "array": "yui", "Node": "node", "DD.Proxy": "dd-proxy", "Anim": "animation", "Get": "yui", "DD.DDM": "dd-ddm-drop", "Selector": "selector", "JSON": "JSON", "DD.DragConstained": "dd-constrain", "DD.Drop": "dd-drop", "Event.Custom": "yui", "Event.Target": "yui", "DD.Drag": "dd-drag", "Event.Handle": "yui", "object": "yui", "Event.Facade": "yui", "Plugin.DragPlugin": "dd-plugin", "lang": "yui", "Event.Subscriber": "yui", "Y.Easing": "animation", "ua": "yui", "Event": "yui"};

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
