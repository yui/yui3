(function() {

var M = function(Y) {
    TabView = function(attributes) {
        this.constructor.superclass.constructor.apply(this, arguments);
    };

    TabView.NAME = "tabview";

    TabView.LIST_CLASSNAME = 'yui-tablist';
    TabView.CONTENT_CLASSNAME = 'yui-tabview-content';

    TabView.SELECTORS = {
        tabs: '.' + TabView.LIST_CLASSNAME,
        content: 'div.' + TabView.CONTENT_CLASSNAME 
    };

    TabView.TEMPLATES = {
        list: ['ul', { 'class': TabView.LIST_CLASSNAME }],
        content: ['div', { 'class': TabView.CONTENT_CLASSNAME }]
    };

    var proto = {
        initializer: function(attributes) {
            this._initSubNodes();
        },

        renderer: function() {
            var tabs = this.get('tabs');
            if (tabs) {
                for (var i = 0, len = tabs.length; i < len; ++i) {
                    if (!tabs[i].render) {
                        tabs[i] = new Y.Tab(tabs[i]);
                    }
                    if (tabs[i].get('active')) {
                        this.set('activeTab', tabs[i]);
                    }
                    this.addTab(tabs[i]);
                    tabs[i].render();
                }
            }
        },

        addTab: function(tab, beforeIndex) {
            tab.on('activeChange', function() {
                this._onActiveChange(tab); 
            }, this, true);

            this.fire('addTab', { relatedTarget: tab, before: beforeIndex });
        },

        removeTab: function(item) {
            var tabs = this.get('tabs');
            tabs.splice(this.indexOf(item, 1));
            //this.set('tabs', tabs);
            this.fire('removeTab', { relatedTarget: item });
        },

        indexOf: function(item) {
            var tabs = this.get('tabs');
            for (var i = 0, len = tabs.length; i < len; ++i) {
                if (tabs[i] === item) {
                    return i;
                }
            } 
            return -1; // not found
        },

        getTab: function(index) {
            return this.get('tabs')[index];
        },

        _getNode: function(val) {
            return Y.Node.get(val);
        },

        _initSubNodes: function() {
            this._uiInitSubNode('list');
            this._uiInitSubNode('content');
        },

        _uiInitSubNode: function(name) {
            if (!this.get(name + 'Node')) { // find or create if not provided
                var node = this._root.query(TabView.SELECTORS[name]) || Y.Node.create(TabView.TEMPLATES[name]);
                this.set(name + 'Node', node);
            }
//console.log(this.get(name + 'Node').att('class'));

            if (!Y.Node.contains('body', this.get(name + 'Node'))) { // add to root node if not in document
                this._root.appendChild(this.get(name + 'Node'));
            }
            if (!this.get(name + 'Node')) {
                throw new Error('_uiInitNode failed for ' + name);
            }
        },

        _onActiveChange: function(tab) {
            this.set('activeTab', tab);
        },

        _setActiveTab: function(val) {
            var current = this.get('activeTab');
            if (current === val) {
                return;
            }

            if (current) {
                current.set('active', false);
            }
            if (val.get('active') === false) { // avoid inf loop
                val.set('active', true);
            }
        }
    };

    TabView.ATTRS = {
        listNode: {
            set: proto._getNode
        },

        contentNode: {
            set: proto._getNode
        },

        'tabs': {
            readOnly: true
        },

        'length': {
            readOnly: true,
            get: function() {
                return this.get('tabs').length;
            }
        },

        'activeTab': {
            set: proto._setActiveTab
        }
    };

    Y.lang.extend(TabView, Y.Widget, proto);
    Y.TabView = TabView;
};
YUI.add("tabview", M, "3.0.0");
})();
