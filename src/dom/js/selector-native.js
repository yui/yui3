Y.Selector = Y.Selector || {};

if (document.querySelectorAll) {
    Y.Selector.query = function(selector, root, firstOnly) {
        var ret;

        if (typeof root === 'string') {
            root = Y.DOM.byId(root);
        }

        if (firstOnly) {
            ret = root.querySelector(selector);
        } else {
            ret = root.querySelectorAll(selector);
        }

        return ret;
    };

    Y.Selector.test = Y.Selector.test || function() {};
    Y.Selector.filter = Y.Selector.filter || function() {};
}
