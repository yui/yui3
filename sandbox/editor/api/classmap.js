YAHOO.env.classMap = {"Plugin.Frame": "editor", "Plugin.Selection": "editor", "Plugin.ExecCommand": "editor", "EditorBase": "editor", "Plugin.EditorLists": "editor"};

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
