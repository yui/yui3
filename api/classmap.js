YAHOO.env.classMap = {"Node": "node", "lang": "yuiloader", "Anim": "animation", "NodeList": "node", "Get": "yuiloader", "Event.Handle": "yuiloader", "Attribute": "attribute", "array": "yuiloader", "Event.Subscriber": "yuiloader", "Y.Loader": "yuiloader", "Event.Target": "yuiloader", "Event.Facade": "yuiloader", "JSON": "JSON", "Base": "base", "Y.Easing": "animation", "Event": "yuiloader", "Event.Custom": "yuiloader"};

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
