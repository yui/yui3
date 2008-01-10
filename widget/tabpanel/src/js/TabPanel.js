(function() {
var Y = YAHOO.util;
var TabPanel = function(node, attributes) {
    this.constructor.superclass.constructor.apply(this, arguments);
};

TabPanel.NAME = "TabPanel";

var proto = {
    initializer: function(attributes) {
    },

    renderer: function() {
        var tabs = this.get('tabs');
        if (tabs) {
            for (var i = 0, len = tabs.length; i < len; ++i) {
                if (!tabs[i].render) {
                    tabs[i] = new YAHOO.widget.Tab(tabs[i]);
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
        tab.on('activeChange', this._onActiveChange, this, true); 
        this.fireEvent('addTab', { relatedTarget: tab, before: beforeIndex });
    },

    removeTab: function(item) {
        var tabs = this.get('tabs');
        tabs.splice(this.indexOf(item, 1));
        //this.set('tabs', tabs);
        this.fireEvent('removeTab', { relatedTarget: item });
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

    _onActiveChange: function(evt) {
        this.set('activeTab', evt.target);
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

TabPanel.CONFIG = {
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

YAHOO.lang.extend(TabPanel, YAHOO.widget.Widget, proto);

YAHOO.widget.TabPanel = TabPanel;
})();
