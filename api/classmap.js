YAHOO.env.classMap = {"NodeList": "node", "UA": "yui", "YUI": "yui", "io": "io", "Do.Method": "event", "Node": "node", "Do": "event", "Anim": "anim", "Get": "get", "Object": "yui", "Base": "base", "Event.Target": "event", "Lang": "yui", "DragPlugin": "dd-plugin", "Do.AlterArgs": "event", "Event.Handle": "event", "Event.Facade": "event", "Easing": "anim-easing", "Event.Custom": "event", "Queue": "Queue", "Do.Error": "event", "Y.Anim": "anim", "Attribute": "attribute", "Event.Subscriber": "event", "Do.AlterReturn": "event", "Loader": "loader", "Array": "yui", "DropPlugin": "dd-plugin", "Event": "event"};

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
