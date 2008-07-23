YAHOO.env.classMap = {"UA": "yui", "Bezier": "animation", "YUI": "yui", "io": "io", "Do.Method": "event", "Do": "event", "Anim": "animation", "Get": "JSON", "Object": "yui", "JSON": "JSON", "Base": "base", "Event.Target": "event", "Lang": "yui", "DragPlugin": "dd-plugin", "Do.AlterArgs": "event", "Event.Handle": "event", "Event.Facade": "event", "Easing": "animation", "Event.Custom": "event", "Do.Error": "event", "Attribute": "attribute", "Event.Subscriber": "event", "Do.AlterReturn": "event", "Loader": "JSON", "Array": "yui", "DropPlugin": "dd-plugin", "Event": "event"};

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
