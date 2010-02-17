YUI.add('tablist', function(Y) {

Y.TabList = Y.Base.create("tabList", Y.Widget, [Y.WidgetParent], {

    bindUI: function() {

        //  Use the Node Focus Manager to add keyboard support:
        //  Pressing the left and right arrow keys will move focus
        //  among each of the tabs.

        this.get("boundingBox").plug(Y.Plugin.NodeFocusManager, {
        
                        descendants: ">div>ul>li>a",
                        keys: { next: "down:39", // Right arrow
                                previous: "down:37" },  // Left arrow
                        circular: true

                    });

    },
    
    renderUI: function () {

        //  Create placeholder nodes for the tabs and tab panels to be 
        //  rendered into.

        this.get("contentBox").append("<ul></ul><div></div>");
        
        //  If no tab is selected, select the first tab.
        if (!this.get("selection")) {
            this.item(0).set("selected", 1);
        }
        
    }
    
}, {

    ATTRS : {

        defaultChildType: {  
            value: "Tab"
        },

        //  Override of Widget's default tabIndex attribute since we don't 
        //  want the bounding box of each TabList instance in the default
        //  tab index.  The focusable pieces of a TabList's UI will be 
        //  each tab's anchor element.
        
        tabIndex: {
            value: null,
            validator: "_validTabIndex"
        }
    }

});
var Lang = Y.Lang,
    getClassName = Y.ClassNameManager.getClassName;

Y.Tab = Y.Base.create("tab", Y.Widget, [Y.WidgetChild], {

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

    },
    
    initializer: function () {

         this.publish("click", { 

             defaultFn: function (event) {

                 if (event.target == this) {

                     //  Prevent the browser from navigating to the URL specified by the 
                     //  anchor's href attribute.

                     event.domEvent.preventDefault();

                     event.target.set("selected", 1);

                 }

             }

          });
        
    }
    
}, {

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


}, '@VERSION@' ,{requires:['widget', 'widget-parent', 'widget-child', 'node-focusmanager']});
