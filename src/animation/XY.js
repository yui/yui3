
Y.Anim.CUSTOM_ATTRIBUTES.xy = {
    set: function(node, att, from, to, elapsed, duration, fn) {
        node.setXY([
            fn(elapsed, NUM(from[0]), NUM(to[0]) - NUM(from[0]), duration),
            fn(elapsed, NUM(from[1]), NUM(to[1]) - NUM(from[1]), duration)
        ]);
    },
    get: function(node) {
        return node.getXY();
    }
};

