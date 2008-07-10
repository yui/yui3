YAHOO.env.classMap = {"NodeList": "node", "array": "yuiloader", "Node": "node", "DD.Proxy": "dd-proxy", "Anim": "animation", "Get": "yuiloader", "DD.DDM": "dd-ddm-drop", "JSON": "JSON", "Base": "base", "DD.DragConstained": "dd-constrain", "DD.Drop": "dd-drop", "Event.Custom": "yuiloader", "Event.Target": "yuiloader", "DD.Drag": "dd-drag", "Event.Handle": "yuiloader", "Y.Loader": "yuiloader", "Event.Facade": "yuiloader", "Plugin.DragPlugin": "dd-plugin", "lang": "yuiloader", "Attribute": "attribute", "Event.Subscriber": "yuiloader", "Y.Easing": "animation", "Event": "yuiloader"};

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
