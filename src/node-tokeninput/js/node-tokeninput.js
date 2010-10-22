var doc = Y.config.doc,

    Lang   = Y.Lang,
    Node   = Y.Node,
    YArray = Y.Array,

    getClassName = Y.bind(Y.ClassNameManager.getClassName, null, 'tokeninput'),

    // keyCode constants.
    KEY_BACKSPACE = 8,
    KEY_DELETE    = 46,
    KEY_DOWN      = 40,
    KEY_ENTER     = 13,
    KEY_LEFT      = 37,
    KEY_RIGHT     = 39,
    KEY_UP        = 38,

    EMPTY_OBJECT = {};

function TokenInput() {
    TokenInput.superclass.constructor.apply(this, arguments);
}

Y.extend(TokenInput, Y.Plugin.Base, {
    // -- Prototype Properties -------------------------------------------------
    BOX_TEMPLATE    : '<div/>',
    CONTENT_TEMPLATE: '<div/>',
    INPUT_TEMPLATE  : '<input type="text" autocomplete="off">',
    ITEM_TEMPLATE   : '<li/>',
    LIST_TEMPLATE   : '<ul/>',

    // -- Lifecycle Methods ----------------------------------------------------
    initializer: function (config) {
        var keys      = {},
            selectors = {},
            initialTokens;

        Y.Object.each(TokenInput.CLASS_NAMES, function (className, name) {
            selectors[name] = '.' + className;
        }, this);

        keys[KEY_BACKSPACE] = this._keyBackspace;
        keys[KEY_DELETE]    = this._keyDelete;
        keys[KEY_DOWN]      = this._keyDown;
        keys[KEY_ENTER]     = this._keyEnter;
        keys[KEY_LEFT]      = this._keyLeft;
        keys[KEY_RIGHT]     = this._keyRight;
        keys[KEY_UP]        = this._keyUp;

        this._host      = this.get('host');
        this._keys      = keys;
        this._selectors = selectors;

        initialTokens = this._tokenizeValue(this._host, null, {
            all     : true,
            updateUI: false
        });

        if (initialTokens) {
            this.set('tokens', this.get('tokens').concat(initialTokens));
        }

        this._render();
        this._bind();
        this._sync();
    },

    destructor: function () {
        var events = this._events;

        while (events && events.length) {
            events.pop().detach();
        }
    },

    // -- Public Prototype Methods ---------------------------------------------

    /**
     * Adds one or more tokens at the specified index, or at the end of the
     * token list if no index is specified.
     *
     * @method add
     * @param {Array|String} newTokens Token string or array of token strings.
     * @param {Number} index (optional) Index at which to add the token.
     * @chainable
     */
    add: function (newTokens, index) {
        var addTokens = [],
            items     = [],
            tokens    = this.get('tokens');

        newTokens = Lang.isArray(newTokens) ? newTokens :
                newTokens.split(this.get('delimiter'));

        YArray.each(newTokens, function (token, i) {
            token = Lang.trim(token);

            if (token) {
                addTokens.push(token);

                items.push(this._createItem({
                    text : token,
                    token: true
                }));
            }
        }, this);

        if (items.length && addTokens.length) {
            items = Y.all(items).toFrag();

            if ((index || index === 0) && index < tokens.length) {
                tokens = tokens.concat();
                tokens.splice.apply(tokens, [index, 0].concat(addTokens));
                this._tokenNodes.item(index).insert(items, 'before');
            } else {
                tokens = tokens.concat(addTokens);
                this._inputItem.insert(items, 'before');
            }

            this._tokenNodes.refresh();
            this.set('tokens', tokens, {atomic: true});
        }

        return this;
    },

    /**
     * Removes all tokens.
     *
     * @method clear
     * @chainable
     */
    clear: function () {
        this._tokenNodes.remove(true);
        this._tokenNodes.refresh();

        return this.set('tokens', [], {atomic: true});
    },

    /**
     * Removes the token at the specified index.
     *
     * @method remove
     * @param {Number} index 0-based index of the token to remove.
     * @chainable
     */
    remove: function (index) {
        var tokens = this.get('tokens');

        tokens.splice(index, 1);

        this._tokenNodes.item(index).remove(true);
        this._tokenNodes.refresh();

        return this.set('tokens', tokens, {atomic: true});
    },

    // -- Protected Prototype Methods ------------------------------------------

    /**
     * Binds token input events.
     *
     * @method _bind
     * @protected
     */
    _bind: function () {
        var list      = this._list,
            selectors = this._selectors;

        if (!this._events) {
            this._events = [];
        }

        this._events.concat([
            this._boundingBox.after('blur', this._afterBlur, this),
            this._boundingBox.after('focus', this._afterFocus, this),

            list.delegate('blur', this._onTokenBlur, selectors.token, this),
            list.delegate('focus', this._onTokenFocus, selectors.token, this),
            list.delegate('mouseover', this._onTokenMouseOver, selectors.token, this),
            list.delegate('mouseout', this._onTokenMouseOut, selectors.token, this),

            list.delegate(Y.UA.gecko ? 'keypress' : 'keydown', this._onKey,
                    selectors.input + ',' + selectors.token, this),

            this.after('tokensChange', this._afterTokensChange)
        ]);
    },

    _clearItems: function () {
        this._list.all(this._selectors.item).remove(true);
    },

    /**
     * Creates and returns a new token list item.
     *
     * @method _createItem
     * @param {Object} options (optional) Item options.
     * @return {Node} New item.
     * @protected
     */
    _createItem: function (options) {
        var classNames = TokenInput.CLASS_NAMES,
            item       = Node.create(this.ITEM_TEMPLATE),
            input;

        if (!options) {
            options = EMPTY_OBJECT;
        }

        item.addClass(classNames.item);

        YArray.each(['editable', 'hidden', 'token'], function (option) {
            if (options[option]) {
                item.addClass(classNames[option]);
            }
        });

        if (options.editable) {
            input = Node.create(this.INPUT_TEMPLATE).addClass(classNames.input);

            // Event will be purged when item is removed.
            input.on('valueChange', this._afterInputValueChange, this);

            item.append(input);
        }

        if (options.token) {
            item.set('tabIndex', -1);
            item.set('text', options.text || '');
        }

        return item;
    },

    _focusNext: function (node) {
        var selectors = this._selectors,
            nextToken;

        node      = node.ancestor(selectors.item, true);
        nextToken = node && node.next(selectors.token);

        if (nextToken) {
            nextToken.focus();
        } else {
            this._inputNode.focus();
        }

        return true;
    },

    _focusPrev: function (node) {
        var selectors = this._selectors,
            prevToken;

        node      = node.ancestor(selectors.item, true);
        prevToken = node && node.previous(selectors.token);

        if (prevToken) {
            prevToken.focus();
        } else {
            return false;
        }

        return true;
    },

    _getSelection: function (node) {
        // TODO: this should probably be a Node extension named node-selection
        // or something.
        var el        = Node.getDOMNode(node),
            selection = {end: 0, start: 0},
            length, value, range;

        if ('selectionStart' in el) {
            // Good browsers.
            selection.start = el.selectionStart;
            selection.end   = el.selectionEnd;
        } else if (el.createTextRange) {
            // IE.
            value  = el.value;
            length = value.length;
            range  = doc.selection.createRange().duplicate();

            range.moveEnd('character', length);
            selection.start = range.text === '' ? length :
                    value.lastIndexOf(range.text);

            range.moveStart('character', -length);
            selection.end = range.text.length;
        }

        return selection;
    },

    _keyBackspace: function (e) {
        var node = e.currentTarget,
            index, selection;

        if (node.hasClass(TokenInput.CLASS_NAMES.input)) {
            selection = this._getSelection(node);

            if (selection.start !== 0 || selection.end !== 0) {
                return false;
            }

            // Focus the previous token.
            return this._focusPrev(node);
        }

        node  = node.ancestor(this._selectors.token, true);
        index = this._tokenNodes.indexOf(node);

        if (!node || index === -1) {
            return false;
        }

        // Delete the current token and focus the preceding token. If there is
        // no preceding token, focus the next token, or the input field if there
        // is no next token.
        (this._focusPrev(node) || this._focusNext(node));
        this.remove(index);

        return true;
    },

    _keyDelete: function (e) {
        var node = e.currentTarget,
            index;

        if (!node.hasClass(TokenInput.CLASS_NAMES.token)) {
            return false;
        }

        index = this._tokenNodes.indexOf(node);

        if (index === -1) {
            return false;
        }

        // Delete the current token and focus the following token (or the input
        // field if there is no following token).
        this._focusNext(node);
        this.remove(index);

        return true;
    },

    _keyDown: function (e) {
        return this._keyRight(e);
    },

    _keyEnter: function (e) {
        var value = Lang.trim(this._inputNode.get('value'));

        if (!this.get('tokenizeOnEnter') || !value) {
            return false;
        }

        this._tokenizeValue(null, null, {all: true});
    },

    _keyLeft: function (e) {
        var node = e.currentTarget;

        if (node.hasClass(TokenInput.CLASS_NAMES.input) &&
                this._getSelection(node).start !== 0) {
            return false;
        }

        return this._focusPrev(node);
    },

    _keyRight: function (e) {
        var node = e.currentTarget;

        if (node.hasClass(TokenInput.CLASS_NAMES.input)) {
            return false;
        }

        return this._focusNext(node);
    },

    _keyUp: function (e) {
        return this._keyLeft(e);
    },

    _refresh: function () {
        if (this._tokenNodes) {
            this._tokenNodes.refresh();
        } else {
            this._tokenNodes = this._list.all(this._selectors.token);
        }
    },

    /**
     * Renders the token input markup.
     *
     * @method _render
     * @protected
     */
    _render: function () {
        var classNames  = TokenInput.CLASS_NAMES,
            boundingBox = Node.create(this.BOX_TEMPLATE),
            contentBox  = Node.create(this.CONTENT_TEMPLATE);

        contentBox.addClass(classNames.content);

        boundingBox.addClass(classNames.box).set('tabIndex', -1)
                .append(contentBox);

        this._set('boundingBox', boundingBox);
        this._set('contentBox', contentBox);

        this._boundingBox = boundingBox;
        this._contentBox  = contentBox;

        this._renderList();

        this._host.addClass(classNames.host).insert(boundingBox, 'after');
    },

    /**
     * Renders the token list.
     *
     * @method _renderList
     * @protected
     */
    _renderList: function () {
        var list = Node.create(this.LIST_TEMPLATE);

        list.addClass(TokenInput.CLASS_NAMES.list);

        this._list = list;
        this._set('listNode', list);

        this._contentBox.append(list);
    },

    _setTokens: function (tokens) {
        // Filter out empty tokens.
        return YArray.filter(tokens, function (token) {
            return !!Lang.trim(token);
        });
    },

    _sync: function () {
        var items  = [],
            tokens = this.get('tokens');

        this._contentBox[this.get('fauxInput') ? 'addClass' : 'removeClass'](
                TokenInput.CLASS_NAMES.fauxinput);

        YArray.each(tokens, function (token, i) {
            items.push(this._createItem({
                text     : Lang.trim(token),
                token    : true
            }));
        }, this);

        this._inputItem = this._createItem({editable: true});
        this._inputNode = this._inputItem.one(this._selectors.input);

        this._set('inputNode', this._inputNode);

        items.push(this._inputItem);
        items = Y.all(items).toFrag();

        this._clearItems();
        this._list.append(items);
        this._refresh();
        this._syncHost();
    },

    _syncHost: function () {
        this._host.set('value', this.get('tokens').join(this.get('delimiter')));
    },

    _tokenizeValue: function (node, value, options) {
        var tokens;

        options = Y.merge({
            updateUI: true
        }, options || EMPTY_OBJECT);

        if (!node) {
            node = this._inputNode;
        }

        if (!value && value !== '') {
            value = node.get('value');
        }

        tokens = value.split(this.get('delimiter'));

        if (options.all || tokens.length > 1) {
            if (options.all) {
                value = '';
            } else {
                // New input field value is the last item in the array.
                value = Lang.trim(tokens.pop());
            }

            if (options.updateUI) {
                node.set('value', value);

                if (tokens.length) {
                    // All other items are added as tokens.
                    this.add(tokens);
                }
            }
        }

        if (options.updateUI) {
            // Adjust the width of the input field as necessary to fit its
            // contents.
            node.setStyle('width', Math.max(5, value.length + 3) + 'ex');
        }

        return tokens;
    },

    // -- Protected Event Handlers ---------------------------------------------
    _afterBlur: function (e) {
        if (this.get('tokenizeOnBlur')) {
            this._tokenizeValue(null, null, {all: true});
        }
    },

    _afterFocus: function (e) {
        var that = this;

        if (!e.target.ancestor(this._selectors.item, true)) {
            setTimeout(function () {
                // FIXME: this doesn't display the keyboard in iOS.
                that._inputNode.focus();
            }, 1);
        }
    },

    _afterInputValueChange: function (e) {
        this._tokenizeValue(e.currentTarget, e.newVal);
    },

    _afterTokensChange: function (e) {
        // Only do a full sync for non-atomic changes (i.e., changes that are
        // made via some means other than the add()/remove() methods).
        if (e.atomic) {
            this._syncHost();
        } else {
            this._sync();
        }
    },

    _onTokenBlur: function (e) {
        e.currentTarget.removeClass(TokenInput.CLASS_NAMES.focus);
    },

    _onTokenFocus: function (e) {
        e.currentTarget.addClass(TokenInput.CLASS_NAMES.focus);
    },

    _onTokenMouseOut: function (e) {
        e.currentTarget.removeClass(TokenInput.CLASS_NAMES.hover);
    },

    _onTokenMouseOver: function (e) {
        e.currentTarget.addClass(TokenInput.CLASS_NAMES.hover);
    },

    _onKey: function (e) {
        var handler = this._keys[e.keyCode];

        if (handler) {
            // A handler may return false to indicate that it doesn't wish
            // to prevent the default key behavior.
            if (handler.call(this, e) !== false) {
                e.preventDefault();
            }
        }
    }
}, {
    NAME: 'pluginTokenInput',
    NS  : 'tokenInput',

    ATTRS: {
        boundingBox: {
            readOnly: true
        },

        contentBox: {
            readOnly: true
        },

        delimiter: {
            value: ','
        },

        fauxInput: {
            value: true
        },

        inputNode: {
            readOnly: true
        },

        listNode: {
            readOnly: true
        },

        tokenizeOnBlur: {
            value: true
        },

        tokenizeOnEnter: {
            value: true
        },

        tokens: {
            setter: '_setTokens',
            value : []
        }
    },

    CLASS_NAMES: {
        box      : getClassName(),
        content  : getClassName('content'),
        editable : getClassName('editable'),
        fauxinput: getClassName('fauxinput'),
        hidden   : getClassName('hidden'),
        host     : getClassName('host'),
        hover    : getClassName('hover'),
        focus    : getClassName('focus'),
        input    : getClassName('input'),
        item     : getClassName('item'),
        list     : getClassName('list'),
        token    : getClassName('token')
    }
});

Y.Plugin.TokenInput = TokenInput;
