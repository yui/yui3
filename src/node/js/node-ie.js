
if (!document.documentElement.hasAttribute) { // IE < 8
    Y.Node.prototype.hasAttribute = function(attr) {
        return Y.DOM.getAttribute(this._node, attr) !== '';
    };
}

// IE throws error when setting input.type = 'hidden',
// input.setAttribute('type', 'hidden') and input.attributes.type.value = 'hidden'
Y.Node.ATTRS.type = {
    setter: function(val) {
        if (val === 'hidden') {
            try {
                this._node.type = 'hidden';
            } catch(e) {
                this._node.style.display = 'none';
            }
        }
        return val;
    }
};
