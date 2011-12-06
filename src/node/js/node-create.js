/**
 * @module node
 * @submodule node-base
 */

var Y_Node = Y.Node,
    Y_DOM = Y.DOM;

/**
 * Returns a new dom node using the provided markup string.
 * @method create
 * @static
 * @param {String} html The markup used to create the element
 * @param {HTMLDocument} doc An optional document context
 * @return {Node} A Node instance bound to a DOM node or fragment
 * @for Node
 */
Y_Node.create = function(html, doc) {
    if (doc && doc._node) {
        doc = doc._node;
    }
    return Y.one(Y_DOM.create(html, doc));
};

Y.mix(Y_Node.prototype, {
    /**
     * Creates a new Node using the provided markup string.
     * @method create
     * @param {String} html The markup used to create the element
     * @param {HTMLDocument} doc An optional document context
     * @return {Node} A Node instance bound to a DOM node or fragment
     */
    create: Y_Node.create,

    /**
     * Inserts the content before the reference node.
     * @method insert
     * @param {String | Node | HTMLElement | NodeList | HTMLCollection} content The content to insert
     * @param {Int | Node | HTMLElement | String} where The position to insert at.
     * Possible "where" arguments
     * <dl>
     * <dt>Y.Node</dt>
     * <dd>The Node to insert before</dd>
     * <dt>HTMLElement</dt>
     * <dd>The element to insert before</dd>
     * <dt>Int</dt>
     * <dd>The index of the child element to insert before</dd>
     * <dt>"replace"</dt>
     * <dd>Replaces the existing HTML</dd>
     * <dt>"before"</dt>
     * <dd>Inserts before the existing HTML</dd>
     * <dt>"before"</dt>
     * <dd>Inserts content before the node</dd>
     * <dt>"after"</dt>
     * <dd>Inserts content after the node</dd>
     * </dl>
     * @chainable
     */
    insert: function(content, where) {
        this._insert(content, where);
        return this;
    },

    _insert: function(content, where) {
        var node = this._node,
            ret = null;

        if (typeof where == 'number') { // allow index
            where = this._node.childNodes[where];
        } else if (where && where._node) { // Node
            where = where._node;
        }

        if (content && typeof content != 'string') { // allow Node or NodeList/Array instances
            content = content._node || content._nodes || content;
        }
        ret = Y_DOM.addHTML(node, content, where);

        return ret;
    },

    /**
     * Inserts the content as the firstChild of the node.
     * @method prepend
     * @param {String | Node | HTMLElement} content The content to insert
     * @chainable
     */
    prepend: function(content) {
        return this.insert(content, 0);
    },

    /**
     * Inserts the content as the lastChild of the node.
     * @method append
     * @param {String | Node | HTMLElement} content The content to insert
     * @chainable
     */
    append: function(content) {
        return this.insert(content, null);
    },

    /**
     * @method appendChild
     * @param {String | HTMLElement | Node} node Node to be appended
     * @return {Node} The appended node
     */
    appendChild: function(node) {
        return Y_Node.scrubVal(this._insert(node));
    },

    /**
     * @method insertBefore
     * @param {String | HTMLElement | Node} newNode Node to be appended
     * @param {HTMLElement | Node} refNode Node to be inserted before
     * @return {Node} The inserted node
     */
    insertBefore: function(newNode, refNode) {
        return Y.Node.scrubVal(this._insert(newNode, refNode));
    },

    /**
     * Appends the node to the given node.
     * @method appendTo
     * @param {Node | HTMLElement} node The node to append to
     * @chainable
     */
    appendTo: function(node) {
        Y.one(node).append(this);
        return this;
    },

    /**
     * Replaces the node's current content with the content.
     * @method setContent
     * @param {String | Node | HTMLElement | NodeList | HTMLCollection} content The content to insert
     * @chainable
     */
    setContent: function(content) {
        this._insert(content, 'replace');
        return this;
    },

    /**
     * Returns the node's current content (e.g. innerHTML)
     * @method getContent
     * @return {String} The current content
     */
    getContent: function(content) {
        return this.get('innerHTML');
    }
});

/**
 * Replaces the node's current html content with the content provided.
 * @method setHTML
 * @param {String | HTML | Node | HTMLElement | NodeList | HTMLCollection} content The content to insert
 * @chainable
 */
Y.Node.prototype.setHTML = Y.Node.prototype.setContent;

/**
 * Returns the node's current html content (e.g. innerHTML)
 * @method getContent
 * @return {String} The html content
 */
Y.Node.prototype.getHTML = Y.Node.prototype.getContent;

Y.NodeList.importMethod(Y.Node.prototype, [
    /**
     * Called on each Node instance
     * @for NodeList
     * @method append
     * @see Node.append
     */
    'append',

    /** Called on each Node instance
      * @method insert
      * @see Node.insert
      */
    'insert',

    /**
     * Called on each Node instance
     * @for NodeList
     * @method appendChild
     * @see Node.appendChild
     */
    'appendChild',

    /** Called on each Node instance
      * @method insertBefore
      * @see Node.insertBefore
      */
    'insertBefore',

    /** Called on each Node instance
      * @method prepend
      * @see Node.prepend
      */
    'prepend',

    /** Called on each Node instance
      * @method setContent
      * @see Node.setContent
      */
    'setContent',

    /** Called on each Node instance
      * @method getContent
      * @see Node.getContent
      */
    'getContent'
]);
