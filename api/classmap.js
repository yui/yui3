YAHOO.env.classMap = {"NodeList": "node", "Bezier": "animation", "YUI": "yui", "io": "io", "Do.Method": "event", "Node": "node", "Do": "event", "Anim": "animation", "Get": "yui", "Object": "yui", "JSON": "JSON", "Base": "base", "Event.Target": "event", "Lang": "yui", "Do.AlterArgs": "event", "Event.Handle": "event", "Event.Facade": "event", "Easing": "animation", "Event.Custom": "event", "Do.Error": "event", "Attribute": "attribute", "Event.Subscriber": "event", "Do.AlterReturn": "event", "Loader": "yui", "Array": "yui", "UA": "yui", "Event": "event"};

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
