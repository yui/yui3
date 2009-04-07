var Token = {};

Token.DEFAULT_TAG = '*';

Token.Tag = function(selector, root) {
    this.init(selector, root);
};

Token.Tag.prototype = {
    re: /^((?:-?[_a-z]+[\w-]*)|\*)/i,
    nodes: null,
    test: null,

    init: function(selector, root) {
        this.initRoot(root);
        this.initValue(selector);
        this.initNodes();
    },

    initRoot: function(root)  {
        this.root = root || document; // TODO: Y.config.doc
    },

    initValue: function(selector) {
        this.re.test(selector);
        this.value = RegExp.$1 || Token.DEFAULT_TAG;
        this.test = new RegExp('^' + this.value + '$');
    },

    initNodes: function() {
        this.nodes = this.root.getElementsByTagName(this.value);
    }
};
