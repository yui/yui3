
Y.Anim.CUSTOM_ATTRIBUTES.color = {
    set: function(node, att, from, to, elapsed, duration, fn) {
        from = RE_RGB.exec(Y.Color.toRGB(from));
        to = RE_RGB.exec(Y.Color.toRGB(to));
        node.setStyle(att, 'rgb(' + [
            Math.floor(fn(elapsed, NUM(from[1]), NUM(to[1]) - NUM(from[1]), duration)),
            Math.floor(fn(elapsed, NUM(from[2]), NUM(to[2]) - NUM(from[2]), duration)),
            Math.floor(fn(elapsed, NUM(from[3]), NUM(to[3]) - NUM(from[3]), duration))
        ].join(', ') + ')');
    },
    
    get: function(node, att) {
        var val = node.getComputedStyle(att);
        return (val === 'transparent') ? 'rgb(255, 255, 255)' : val;
    }
};

Y.each(['backgroundColor',
        'borderTopColor',
        'borderRightColor', 
        'borderBottomColor', 
        'borderLeftColor'],
        function(v, i) {
            Y.Anim.CUSTOM_ATTRIBUTES[v] = Y.Anim.CUSTOM_ATTRIBUTES.color;
        }
);
