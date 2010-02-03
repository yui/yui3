var getClassName = Y.ClassNameManager.getClassName,
    TABVIEW = 'tabview',
    TAB = 'tab',
    CONTENT = 'content',
    PANEL = 'panel',
    SELECTED = 'selected',
    EMPTY_OBJ = {},

    classNames = {
        view: getClassName(TABVIEW),
        tabList: getClassName(TABVIEW, 'tablist'),
        tab: getClassName(TAB),
        tabControl: getClassName(TAB, 'link'),
        tabLabel: getClassName(TAB, 'label'),
        content: getClassName(TABVIEW, CONTENT),
        tabPanel: getClassName(TAB, PANEL),
        selectedTab: getClassName(TAB, SELECTED),
        selectedContent: getClassName(TAB, CONTENT, SELECTED)
    },

    roles = {
        tabList: 'aria-tablist',
        tab: 'aria-tab',
        tabControl: getClassName(TAB, 'link'),
        tabLabel: getClassName(TAB, 'label'),
        content: getClassName(TABVIEW, CONTENT),
        tabPanel: getClassName(TAB, PANEL),
        selectedTab: getClassName(TAB, SELECTED),
        selectedContent: getClassName(TAB, CONTENT, SELECTED)
    },

    queries = {
        tablist: '> ul, ',
        tab: 'ul > li',
        link: 'ul > li > a',
        label: 'ul > li > a > em',
        content:'> div',
        tabPanel:'div > div',
        selectedTab: '.' + classNames.selectedTab,
        selectedContent: '.' + classNames.selectedContent
    },

    TabviewBase = function(config) {
        if (TabviewBase.superclass) {
            TabviewBase.superclass.constructor.apply(this, arguments);
        } else {
            this.initializer.apply(this, arguments);
        }

    };

TabviewBase.NAME = 'tabBase';
TabviewBase.queries = queries;
TabviewBase.classNames = classNames;

Y.mix(TabviewBase.prototype, {
    initializer: function(config) {
        config = config || EMPTY_OBJ;
        this._node = config.host || Y.one(config.node);
    },

    initClassNames: function(index) {
        Y.Object.each(queries, function(query, name) {
            // this === tabview._node
            if (classNames[name]) {
                var result = this.all(query);
                
                if (index !== undefined) {
                    result = result.item(index);
                }

                if (result) {
                    result.addClass(classNames[name]);
                }
            }
        }, this._node);
    },

    _select: function(index) {
        var node = this._node,
            oldItem = node.one(queries.selectedTab),
            oldContent = node.one(queries.selectedContent),
            newItem = node.all(queries.tab).item(index),
            newContent = node.all(queries.tabPanel).item(index);

        if (oldItem) {
            oldItem.removeClass(classNames.selectedTab);
        }

        if (oldContent) {
            oldContent.removeClass(classNames.selectedContent);
        }

        if (newItem) {
            newItem.addClass(classNames.selectedTab);
        }

        if (newContent) {
            newContent.addClass(classNames.selectedContent);
        }
    },

    initState: function() {
        var node = this._node,
            activeNode = node.one(queries.selectedTab),
            activeIndex = activeNode ?
                    node.all(queries.tab).indexOf(activeNode) : 0;

        this._select(activeIndex);
    },

    // base renderer only enlivens existing markup
    renderer: function() {
        this.initClassNames();
        this.initState();
        this.initEvents();
    },

    render: function() {
        this.renderer.apply(this, arguments);
        return this;
    },

    tabEventName: 'click',

    initEvents: function() {
        // TODO: detach prefix for delegate?
        // this._node.delegate('tabview|' + this.tabEventName),
        this._node.delegate(this.tabEventName,
            this.onTabEvent,
            queries.tab,
            this
        );
    },

    onTabEvent: function(e) {
        e.preventDefault();
        this._select(this._node.all(queries.tab).indexOf(e.currentTarget));
    },

    destructor: function() {
        // remove events via detach prefix
        this._node.detach('tabview');
    },

    destroy: function() {
        this.destructor.apply(this, arguments);
    }
});

Y.TabviewBase = TabviewBase;
