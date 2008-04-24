YAHOO.env.classMap = {"Node": "node", "lang": "yui", "NodeList": "node", "Get": "yui", "Event.Handle": "yui", "Doc": "node", "object": "yui", "Event.Subscriber": "yui", "Y.util.Selector": "selector", "Event.Target": "yui", "YUI": "yui", "Win": "node", "Y.json": "json", "array": "yui", "ua": "yui", "Event": "yui", "ChainedError": "yui", "Event.Custom": "yui"};

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
