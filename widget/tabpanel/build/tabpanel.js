(function() {
var Y = YAHOO.util;

var TabPanelView = function(widget) {
    this.superApply(widget);
};

TabPanelViewProto = {
    render: function() {
        var me = this;
        this.widget.forEach(function(item) {
            item.render();
            if (item.get('active') === true) {
                me.widget.set('activeTab', item);
            }
            Y.Event.on(item.get('node').get('node'), 'click', function(evt) { // hack around change bug
                me.widget.set('activeTab', item); 
            });
        });
    },

    activeChangeHandler: function(evt) {
        this.widget.set('activeTab', evt.newValue);
    },

    add: function(item, beforeIndex) {
        var node = this.widget.get('node');
        node.insertBefore(item, this.widget.item(beforeIndex));
    }
};

YAHOO.lang.extend(TabPanelView, YAHOO.widget.WidgetView, TabPanelViewProto);

var TabPanelController = function(widget, view) {
        this.superApply(widget, view);
};

TabPanelControllerProto = {
    apply : function() {
        // Events Fired in the UI, Update Model

        // Events Fired in the Model, Update/Refresh View
    }

};

YAHOO.lang.extend(TabPanelController, YAHOO.widget.WidgetController, TabPanelControllerProto);

var TabPanel = function(node, attributes) {
    this.constructor.superclass.constructor.apply(this, arguments);
};


TabPanel.NAME = "TabPanel";

TabPanel.CONFIG = {
    'tabs': {
        get: function() {
            var arr = this._configs.tabs ? this._configs.tabs.value : [];
            return [].slice.call(arr, 0); // copy tabs to break array reference
        },
        validator: YAHOO.lang.isArray
    },
    'length': {
        readOnly: true,
        get: function() {
            return this.get('tabs').length;
        }
    },

    'activeTab': {
        set: function(item) {
            var current = this.get('activeTab');
            if (current === item) {
                return;
            }

            if (current) {
                current.set('active', false);
            }
            item.set('active', true);
        }
    }
};


TabPanelProto = {
    viewClass: TabPanelView,
    controllerClass: TabPanelController,

    initializer: function(attributes) {
        this._configs.length.value = this._configs.tabs.value.length; // init length
    },

    addTab: function(item, beforeIndex) {
        var tabs = this.get('tabs');
        tabs.push(item);
        this.set('tabs', tabs);
        this.fireEvent('addTab', { relatedTarget: item });
    },

    removeTab: function(item) {
        var tabs = this.get('tabs');
        tabs.splice(this.indexOf(item, 1));
        this.set('tabs', tabs);
        this.fireEvent('addTab', { relatedTarget: item });
    },

    apply: function(fn, etc, etc) {
        var tabs = this.get('tabs');
        returnVal = fn.apply(tabs, [].slice.call(arguments, 1));
        this.set('tabs', tabs); // validates, fires listeners, etc.
        return returnVal;
    },

    shift: function() {
        [].unshift.call(arguments, [].shift);
        return this.apply.apply(this, arguments);
    },

    unshift: function(item1, item2, etc) {
        [].unshift.call(arguments, [].unshift);
        return this.apply.apply(this, arguments);
    },

    push: function(item1, item2, etc) {
        [].unshift.call(arguments, [].push);
        return this.apply.apply(this, arguments);
    },

    pop: function() {
        [].unshift.call(arguments, [].pop)
        return this.apply.apply(this, arguments);
    },

    splice: function(index, howMany, item1, item2, etc) {
        [].unshift.call(arguments, [].splice);
        return this.apply.apply(this, arguments);
    },

    slice: function(begin, end) {
        [].unshift.call(arguments, [].slice);
        return this.apply.apply(this, arguments);
    },

    forEach: function() {
        if ([].forEach) {
            return function() {
                [].unshift.call(arguments, [].forEach);
                return this.apply.apply(this, arguments);
            };
        } else {
            return function(callback, context) {
                var tabs = this.get('tabs');
                context = context || tabs;
                for (var i = tabs, len = tabs.length; i < len; ++i) {
                    callback.call(context, tabs[i], i, tabs);
                }
            };
        }
    }(),

    filter: function() {
        if ([].filter) {
            return function() {
                return this.apply([].filter, arguments);
            };
        } else {
            return function(callback, context) {
                var tabs = this.get('tabs');
                var a = [];
                context = context || tabs;
                this.forEach(function() {
                    if (callback.apply(context, arguments) === true) {
                        a[a.length] = tabs[i];
                    }
                });
                return a;
            };
        }
    }(),

    indexOf: function(item) {
        var tabs = this.get('tabs');
        for (var i = 0, len = tabs.length; i < len; ++i) {
            if (tabs[i] === item) {
                return i;
            }
        } 
        return -1; // not found
    },

    item: function(index) {
        return this.get('tabs')[index];
    },

    namedItem: function(id) {
        var tabs = this.get('tabs');
        for (var i = 0, len = tabs.length; i < len; ++i) {
            if (tabs[i].get('id') === id) {
                return tabs[i];
            }
        } 
    }
};

YAHOO.lang.extend(TabPanel, YAHOO.widget.Widget, TabPanelProto);

YAHOO.widget.TabPanel = TabPanel;
YAHOO.widget.TabPanelView = TabPanelView;
YAHOO.widget.TabPanelController = TabPanelController;

})();
(function() {
var Y = YAHOO.util;

var TabView = function(widget) {
    this.superApply(widget);
};

TabViewProto = {
    render: function() {
        var panel = this.widget.get('panel');
        panel.set('visible', this.widget.get('active')); // show content if active
    }
};

YAHOO.lang.extend(TabView, YAHOO.widget.WidgetView, TabViewProto);

var TabController = function(widget, view) {
        this.superApply(widget, view);
};

TabControllerProto = {
    apply: function() {
        var node = this.widget.get('node');
        var panel = this.widget.get('panel');

        // DOM
        Y.Event.on(node.get('node'), 'click', this.showPanel, this, true);

        // Model
        this.widget.on('contentVisibleChange', function(evt) {
            this.widget.get('panel').set('visible', evt.newValue);
        }, this, true);

        this.widget.on('activeChange', function(evt) {
            var visible = evt.newValue;
            if (visible) {
                this.get('node').addClass('yui-active');
            } else {
                this.get('node').removeClass('yui-active');
            }
            this.get('panel').set('visible', visible);
        }, this.widget, true);
    },

    hidePanel: function() {
        this.widget.get('panel').set('visible', false);
    },

    showPanel: function() {
        this.widget.get('panel').set('visible', true);
    },

    togglePanel: function() {
        var visible = this.widget.get('contentVisible');

        if (visible) {
            this.hidePanel();
        } else {
            this.showPanel();
        }
    }
};

YAHOO.lang.extend(TabController, YAHOO.widget.WidgetController, TabControllerProto);

var Tab = function(node, attributes) {
    this.constructor.superclass.constructor.apply(this, arguments);
};


Tab.NAME = "Tab";

Tab.CONFIG = {
    label: {
        validator: YAHOO.lang.isString,
        value: ''
    },

    content: {
        validator: YAHOO.lang.isString,
        value: ''
    },

    panel: {
        set: function(panel) {
            if (panel) {
                return Y.Element.get(Y.Dom.get(panel));
            }
        }
    },

    contentVisible: {
        validator: YAHOO.lang.isBoolean,
        value: false 
    },

    active: {
        validator: YAHOO.lang.isBoolean,
        value: false
    }
};


TabProto = {
    viewClass: TabView,
    controllerClass: TabController,

    initializer: function(attributes) {
    },
};

YAHOO.lang.extend(Tab, YAHOO.widget.Widget, TabProto);


YAHOO.widget.Tab = Tab;
YAHOO.widget.TabView = TabView;
YAHOO.widget.TabController = TabController;

})();
YAHOO.register("tabpanel", YAHOO.widget.TabPanel, {version: "@VERSION@", build: "@BUILD@"});
