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
