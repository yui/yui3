// Compatibility layer for 2.x
(function() {


    var o = (window.YAHOO) ? YUI.merge(window.YAHOO) : null;

    window.YAHOO = YUI;

    if (o) {
        //YUI.augmentObject(YUI, o);
        YUI.augment(YUI, o, 2);
    }

    // Protect against 2.x messing up the new augment (to some degree)
    var ex = YUI.prototype._extended;
    ex.prototype = {};
    YUI.augment(ex, ex, 4);

    // add registration for yahoo
    YUI.register("yahoo", YUI, {version: "@VERSION@", build: "@BUILD@"});

})();
