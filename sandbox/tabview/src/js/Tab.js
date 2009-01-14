(function() {

var M = function(Y) {

    Tab = function(config) {
        config = Y.lang.merge(config);
        Tab.superclass.constructor.apply(this, arguments);
    };

    Tab.ACTIVATION_EVENT = 'click';

    Tab.CLASSNAMES = {
        label: 'yui-tab-label',
        content: 'yui-tab-content',
        hidden: 'yui-hidden',
        active: 'yui-active'
    };

    Tab.TEMPLATE = ['li']; // TODO: mv to ROOT_TEMPLATE?

    Tab.SELECTORS = {
        label: 'a',
        content: 'div'
    };

    Tab.TEMPLATES = {
        label: ['a', { 'class': Tab.CLASSNAMES.label }],
        content: ['div', { 'class': Tab.CLASSNAMES.content }]
    };


    Tab.NAME = "tab";

    var proto  = {
        initializer: function(config) {
            this._initSubNodes();
        },

        renderer: function() {
            this.renderUI(); // lays down DOM subtree when applicable 
            this.bindUI(); // handle UI events
            this.synchUI();
        },

        createNodes: function () { // TODO: automate?
            this._createNode('label');
            this._createNode('content');
        },

        findNodes: function () { // TODO: automate?
            this._findNode('label');
            this._findNode('content');
        },

        _onActivate: function() {
            this.set('active', true);
        },

        _initSubNodes: function() {
            if (this._root.children().length) { // try and parse from selector
                this.findNodes();
            } else { // create
                this.createNodes();
            }
        },

        _getNode: function(val) {
            return Y.Node.get(val);
        },

        _createNode: function (name) {
            this.set(name + 'Node', Y.Node.create(Tab.TEMPLATES[name]));
        },

        _findNode: function (name) {
            var node = this._root.query(Tab.SELECTORS[name]);
            if (!node) { // not enough DOM provided to continue
                throw new Error('node ' + name + ' not found');
            }

            if (Tab.CLASSNAMES[name]) { // add widget specific classNames as needed
                node.addClass(Tab.CLASSNAMES[name]);
            }

            this.set(name + 'Node', node);
        },

    // UI methods
        renderUI: function() {
            // TODO: automate this for all subnodes?
            if (!Y.Node.contains('body', this.get('labelNode'))) { // add to root node if not in document
                this._root.appendChild(this.get('labelNode'));
            }

            if (!Y.Node.contains('body', this.get('contentNode'))) { // add to root node if not in document
                this._root.appendChild(this.get('contentNode'));
            }
        },

        bindUI: function() {
            this.get('labelNode').on(Tab.ACTIVATION_EVENT,
                    this._onActivate, this, true);

            this.on('activeChange', this._uiSetActive);
            this.on('labelChange', this._uiSetLabel);
            this.on('contentChange', this._uiSetContent);
        },

        synchUI: function() {
            this._uiSetActive();
            this._uiSetLabel();
            this._uiSetContent();
        },

        _uiSetLabel: function() {
            this.get('labelNode').innerHTML(this.get('label'));
        },

        _uiSetContent: function() {
            this.get('contentNode').innerHTML(this.get('content'));
        },

        _uiSetActive: function() {
            if (this.get('active') === true) {
                this.get('labelNode').addClass(Tab.CLASSNAMES.active);
                this.get('contentNode').removeClass(Tab.CLASSNAMES.hidden);
            } else {
                this.get('labelNode').removeClass(Tab.CLASSNAMES.active);
                this.get('contentNode').addClass(Tab.CLASSNAMES.hidden);
            }
        }
    };

    Tab.ATTRS = {
        labelNode: {
            set: proto._getNode
        },

        contentNode: {
            set: proto._getNode
        },

        label: {
            validator: Y.lang.isString,
            value: ''
        },

        content: {
            validator: Y.lang.isString,
            value: ''
        },

        active: {
            set: proto._setActive
        }
    };

    Y.lang.extend(Tab, Y.Widget, proto);
    Y.Tab = Tab;
};


YUI.add("tab", M, "3.0.0");

/*
    // TODO: generate TEMPLATES/SELECTORS from something like this?
    Tab.NODES = [
        {
            name: 'label',
            tag: 'a',
            className: Tab.CLASSNAMES.label
        },

        {
            name: 'content',
            tag: 'div',
            className: Tab.CLASSNAMES.content
        }
    ];
*/

})();
