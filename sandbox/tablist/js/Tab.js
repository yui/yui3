var Lang = Y.Lang,
    getClassName = Y.ClassNameManager.getClassName;

function Tab() {
    Tab.superclass.constructor.apply(this,arguments);
}

Y.mix(Tab, {

    NAME : "tab",

    ATTRS : {

        label: { 
            validator: Lang.isString
        },

        content: {
            validator: Lang.isString
        },
        
        panelNode: { 
            readOnly: true
        },

        //  Override of Widget's default tabIndex attribute since we don't 
        //  want the bounding box (<li>) of each Tab instance in the default
        //  tab index. The focusable pieces of a TabList's UI will be 
        //  each tab's anchor element.
        
        tabIndex: {
    		value: null,
    		validator: "_validTabIndex"
        }        

    }

});


Y.extend(Tab, Y.Widget,{

    PANEL_CLASS: getClassName("tabpanel"),

    SELECTED_PANEL_CLASS: getClassName("tabpanel", "selected"),

    BOUNDING_TEMPLATE : "<li></li>",

    CONTENT_TEMPLATE : "<a></a>",

    _uiSetSelectedPanel: function (selected) {

        var sClass = this.SELECTED_PANEL_CLASS,
            panel = this.get("panelNode");

        if (selected == 1) {
            panel.addClass(sClass);
        }
        else {
            panel.removeClass(sClass);
        }
        
    },

    _afterTabSelectedChange: function (event) {
        
       this._uiSetSelectedPanel(event.newVal);
        
    },

    syncUI: function () {

        this._uiSetSelectedPanel(this.get("selected"));

    },

    bindUI: function () {
      
       this.after("selectedChange", this._afterTabSelectedChange);
        
    },

    renderUI: function () {

        var parentContentBox = this.get("parent").get("contentBox"),
            contentBox = this.get("contentBox");

        //  Render the Tab's label

        contentBox.setContent(this.get("label"));
        parentContentBox.one("ul").appendChild(this.get("boundingBox"));


        //  Render the Tab's panel

        var html = '<div class="' + this.PANEL_CLASS + '">' + 
                    this.get("content") + 
                    '</div>',

            panel = Y.Node.create(html);

        this._set("panelNode", panel);
        parentContentBox.one("div").appendChild(panel);
        
        
        //  Set the href attribute of the anchor for each Tab to the id of 
        //  its corresponding panel, so that the tab's are perceived as 
        //  in-page links.

        var sID = Y.stamp(panel);
        
        panel.set("id", sID);
        contentBox.set("href", ("#" + sID));

    }

});

Y.Base.build(Tab.NAME, Tab, [Y.WidgetChild], { dynamic: false });

Y.Tab = Tab;