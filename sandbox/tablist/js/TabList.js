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
