YUI.add('tabview', function(Y) {

var queries = Y.TabviewBase.queries,
    templates = {
        contentBox: '<div></div>',
        tablist: '<ul></ul>',
        tab: '<li><a href="#"><em>{label}</em></li>',
        content: '<div></div>',
        tabPanel: '<div>{content}</div>'
    };

Y.Tabview = Y.Base.create('tabview', Y.Widget, [Y.TabviewBase, Y.WidgetParent], {
    // prototype
    select: function(index) {
        if (index instanceof Y.Node) { // might be a tab item
            index = this._node.all(queries.tab).indexOf(index);
        }

        if (Y.Lang.isNumber(index)) {
            this.set('activeIndex', index);
        }
    },

    addTab: function(config, index) {
        var node = this._node.one(queries.tablist)
                .insert(Y.substitute(templates.tab, config), index);

        var content = this._node.one(queries.content)
                .insert(Y.substitute(templates.tabPanel, config), index);

        this.initClassNames(index);
        if (config.active) {
            this.select(index);
        }

        this.fire('tabAdded', {
            index: index,
            target: node,
            relatedTarget: content
        });
        return this;
    },

    addTabs: function(tabs) {
        Y.each(tabs, function(tab) {
            this.addTab(tab);
        }, this);
    },

    create: function(config) {
        // create or use existing container
        this._node = this._node || Y.Node.create(templates.content);

        // create tab and panel containers
        var list = this._node.appendChild(Y.Node.create(templates.tablist)),
            content = this._node.appendChild(Y.Node.create(templates.content));

        if (config) {
            this.addTabs(config);
        }

        return this;
    },

    removeTab: function(index) {
        var node = this._node.one(queries.tablist).removeChild(
                this._node.all(queries.tab).item(index));

        var content = this._node.one(queries.content).removeChild(
                this._node.all(queries.tabPanel).item(index));

        this.fire('tabRemoved', {
            index: index,
            target: node,
            relatedTarget: content
        });
    }
}, {// static
    ATTRS: {
        node: {
            getter: function() {
                return this._node;
            },

            setter: function(node) {
                this._node = node;
                return node;
            },
            lazyAdd: false
        },

        activeIndex: {
            setter: function(index) {
                this._select(index);
                return index;
            },

            getter: function() {
                return this._node.all(queries.tab)
                        .indexOf(this._node.one(queries.selectedTab));
            }
        }
    }
});


}, '@VERSION@' ,{requires:['substitute', 'tabview-base', 'widget', 'widget-parent', 'widget-child']});
