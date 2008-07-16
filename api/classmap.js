YAHOO.env.classMap = {"NodeList": "node", "Bezier": "animation", "YUI": "yui", "Do.Method": "yui", "Node": "node", "Do": "yui", "Anim": "animation", "Get": "yui", "Object": "yui", "JSON": "JSON", "Base": "base", "Event.Target": "yui", "Lang": "yui", "Do.AlterArgs": "yui", "Event.Handle": "yui", "Event.Facade": "yui", "Easing": "animation", "Event.Custom": "yui", "Do.Error": "yui", "Attribute": "attribute", "Event.Subscriber": "yui", "Do.AlterReturn": "yui", "Array": "yui", "UA": "yui", "Event": "yui"};

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
