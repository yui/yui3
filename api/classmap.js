YAHOO.env.classMap = {"Node": "node", "YUI": "yui", "NodeList": "node", "lang": "yui", "Get": "yui", "Event.Handle": "yui", "object": "yui", "Event.Subscriber": "yui", "Y.util.Selector": "selector", "Event.Target": "yui", "Event.Facade": "yui", "Y.json": "json", "array": "yui", "ua": "yui", "Event": "yui", "ChainedError": "yui", "Event.Custom": "yui"};

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
