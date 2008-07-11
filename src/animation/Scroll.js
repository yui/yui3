Y.Anim.CUSTOM_ATTRIBUTES.scroll = {
    set: function(node, att, from, to, elapsed, duration, fn) {
        var val = ([
            fn(elapsed, NUM(from[0]), NUM(to[0]) - NUM(from[0]), duration),
            fn(elapsed, NUM(from[1]), NUM(to[1]) - NUM(from[1]), duration)
        ]);

        node.set('scrollLeft', val[0]);
        node.set('scrollTop', val[1]);
    },
    get: function(node) {
        return [node.get('scrollLeft'), node.get('scrollTop')];
    }
};

