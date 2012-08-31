YUI.add('listbox', function(Y) {

Y.ListBox = Y.Base.create("listbox", Y.Widget, [Y.WidgetParent, Y.WidgetChild], {

    CONTENT_TEMPLATE : "<ul></ul>",

    bindUI: function() {

        if (this.isRoot()) {
            this.get("boundingBox").plug(Y.Plugin.NodeFocusManager, {
                descendants: ".yui3-option",
                keys: {
                    next: "down:40",    // Down arrow
                    previous: "down:38" // Up arrow
                },
                circular: true
            });
        }

        this.get("boundingBox").on("contextmenu", function (event) {
            event.preventDefault();
        });

        // Setup listener to control keyboard based single/multiple item selection
        this.on("option:keydown", function (event) {

            var item = event.target,
                domEvent = event.domEvent,
                keyCode = domEvent.keyCode,
                direction = (keyCode == 40);

            if (this.get("multiple")) {
                if (keyCode == 40 || keyCode == 38) {
                    if (domEvent.shiftKey) {
                        this._selectNextSibling(item, direction);
                    } else {
                        this.deselectAll();
                        this._selectNextSibling(item, direction);
                    }
                }
            } else {
                if (keyCode == 13 || keyCode == 32) {
                    domEvent.preventDefault();
                    item.set("selected", 1);
                }
            }
        });

        // Setup listener to control mouse based single/multiple item selection
        this.on("option:mousedown", function (event) {

            var item = event.target,
                domEvent = event.domEvent,
                selection;

            if (this.get("multiple")) {
                if (domEvent.metaKey) {
                    item.set("selected", 1);
                } else {
                    this.deselectAll();
                    item.set("selected", 1);
                }
            } else {
                item.set("selected", 1);
            }

        });
    },

    // Helper Method, to find the correct next sibling, taking into account nested ListBoxes
    _selectNextSibling : function(item, direction) {

        var parent = item.get("parent"),
            method =  (direction) ? "next" : "previous",

            // Only go circular for the root listbox
            circular = (parent === this),
            sibling = item[method](circular);

        if (sibling) {
            // If we found a sibling, it's either an Option or a ListBox
            if (sibling instanceof Y.ListBox) {
                // If it's a ListBox, select it's first child (in the direction we're headed)
                sibling.selectChild((direction) ? 0 : sibling.size() - 1);
            } else {
                // If it's an Option, select it
                sibling.set("selected", 1);
            }
        } else {
            // If we didn't find a sibling, we're at the last leaf in a nested ListBox
            parent[method](true).set("selected", 1);
        }
    },

    NESTED_TEMPLATE : '<li class="{nestedOptionClassName}"><em class="{labelClassName}">{label}</em></li>',

    renderUI: function () {

        if (this.get("depth") > -1) {

            var tokens = {
                    labelClassName : this.getClassName("label"),
                    nestedOptionClassName : this.getClassName("option"),
                    label : this.get("label")
                },
                liHtml = Y.Lang.sub(this.NESTED_TEMPLATE, tokens),
                li = Y.Node.create(liHtml),

                boundingBox = this.get("boundingBox"),
                parent = boundingBox.get("parentNode");

            li.appendChild(boundingBox);
            parent.appendChild(li);
        }
    }

}, {
    ATTRS : {
        defaultChildType: {
            value: "Option"
        },
        label : {
            validator: Y.Lang.isString
        }
    }
});

Y.Option = Y.Base.create("option", Y.Widget, [Y.WidgetChild], {

    CONTENT_TEMPLATE : "<em></em>",
    BOUNDING_TEMPLATE : "<li></li>",

    renderUI: function () {
        this.get("contentBox").setContent(this.get("label"));
    }

}, {

    ATTRS : {
        label : {
            validator: Y.Lang.isString
        },
        tabIndex: {
            value: -1
        }
    }
});

}, '3.1.0' ,{requires:['widget', 'widget-parent', 'widget-child', 'node-focusmanager']});
