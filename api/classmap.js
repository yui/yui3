YAHOO.env.classMap = {"NodeList": "node", "UA": "yui", "YUI": "yui", "State": "attribute", "YUI~object": "yui", "YUI~substitute": "substitute", "io": "io", "Node": "node", "Do": "event", "Anim": "anim", "Get": "yui", "Drag": "dd", "Base": "base", "Proxy": "dd", "Event.Target": "event", "Lang": "yui", "DragPlugin": "dd-plugin", "Do.AlterArgs": "event", "Event.Handle": "event", "Drop": "dd", "DragConstained": "dd", "Event.Facade": "event", "DDM": "dd", "Do.Method": "event", "Event.Custom": "event", "Queue": "queue", "Do.Error": "event", "Y.Anim": "anim", "YUI~dump": "dump", "Attribute": "attribute", "YUI~array": "yui", "Event.Subscriber": "event", "Do.AlterReturn": "event", "Loader": "yui", "YUI~oop": "oop", "DropPlugin": "dd-plugin", "Event": "event"};

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
