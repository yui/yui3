/**
 * Adds support for the <code>scroll</code> property in <code>to</code>
 * and <code>from</code> attributes.
 * @module anim
 * @submodule anim-scroll
 */

var NUM = Number;

//TODO: deprecate for scrollTop/Left properties?
Y.Anim.behaviors.scroll = {
    set: function(anim, att, from, to, elapsed, duration, fn) {
        var
            node = anim._node, 
            val = ([
            fn(elapsed, NUM(from[0]), NUM(to[0]) - NUM(from[0]), duration),
            fn(elapsed, NUM(from[1]), NUM(to[1]) - NUM(from[1]), duration)
            fn(elapsed, NUM(from[3]), NUM(to[3]) - NUM(from[3]), duration),
            fn(elapsed, NUM(from[4]), NUM(to[4]) - NUM(from[4]), duration)
        ]);

        node.set('transform', 'matrix(' + val.join(' ') + ')');
    },
    get: function(anim) {
        var node = anim._node,
            transform = node.get('transform'),
            matrix = transform.match(/[\d.]+/g);

        return matrix;
    }
};

