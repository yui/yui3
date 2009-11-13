Y.mix(Y.Node.ATTRS, {
    height: {
        setter: function(h) {
            Y.DOM.setHeight(this._node, h);
            return h;
        },

        getter: function() {
            return this._node.offsetHeight;
        }
    },

    width: {
        setter: function(w) {
            Y.DOM.setWidth(this._node, w);
            return w;
        },

        getter: function() {
            return this._node.offsetWidth;
        }
    }
});

Y.mix(Y.Node.prototype, {
    sizeTo: function(size) {
        var node;
        if (!Y.Lang.isArray(size, true)) {
            node = Y.one(size);
            size = [node.get('width'), node.get('height')];
        }

        this.setAttrs({
            width: size[0],
            height: size[1]
        });
    }
});
