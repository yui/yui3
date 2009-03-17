Y.Selector = {
    query: function(selector, root, firstOnly) {
        var ret = firstOnly ? null : [];

        root = root || Y.config.doc; // default to configured document

        if (typeof root === 'string') { // allow string input TODO: do we need this?
            root = Y.DOM.byId(root);
        }

        if (root) {
            if (firstOnly) {
                ret = Sizzle(selector + ':first', root)[0] || null;
            } else {
                ret  = Sizzle(selector, root)
            }
        }
        return ret;
    },
    test: function(node, selector) {
        var matches,
            ret = false;

        if (node && selector) {
            matches = Sizzle.matches(selector, [node]);
            if (matches.length) {
                ret = (matches[0] === node);
            }
        } else {
            Y.log('test called with invalid arguments, node:  ' +node + ', selector: ' + selector, 'warn', 'Selector');
        }
        return ret;
    },

    filter: function(nodes, selector) {
        nodes = nodes || [];
        return Sizzle.matches(selector, nodes); 
    }
};
