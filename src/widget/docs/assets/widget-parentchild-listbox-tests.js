YUI.add('widget-parentchild-listbox-tests', function(Y) {
    
    var suite = new Y.Test.Suite('widget-parentchild-listbox example test suite'),
        TIMEOUT = 10000;

    suite.add(new Y.Test.Case({

        name : 'Example Tests',

        'test initial render' : function() {

            var test = this;

                condition = function() {
                    return Y.Node.one("#mylistbox") !== null;
                },

                success = function() {
                    var widgetParent = Y.one("#mylistbox"),
                        widgetParentContent = Y.one("#mylistbox > ul.yui3-listbox-content"),
                        allOptions;

                    Y.Assert.isNotNull(widgetParent);
                    Y.Assert.isNotNull(widgetParentContent);

                    allOptions = widgetParentContent.all("> li");

                    Y.Assert.areEqual(6, allOptions.size());
                    Y.Assert.areEqual(4, widgetParentContent.all("> li.yui3-option").size());
                    Y.Assert.areEqual(2, widgetParentContent.all("> li.yui3-listbox-option").size());

                    Y.Assert.areEqual("Item One", allOptions.item(0).get("text"));
                    Y.Assert.areEqual("Item Two", allOptions.item(1).get("text"));
                    Y.Assert.areEqual("Item Three", allOptions.item(2).one(".yui3-listbox-label").get("text"));
                    Y.Assert.areEqual("Item Four", allOptions.item(3).get("text"));
                    Y.Assert.areEqual("Item Five", allOptions.item(4).get("text"));
                    Y.Assert.areEqual("Item Six", allOptions.item(5).one(".yui3-listbox-label").get("text"));

                    var nestedOptions = widgetParentContent.all("> li.yui3-listbox-option");

                    Y.Assert.areEqual("Item Three - One", nestedOptions.item(0).all(".yui3-option").item(0).get("text"));
                    Y.Assert.areEqual("Item Three - Two", nestedOptions.item(0).all(".yui3-option").item(1).get("text"));

                    Y.Assert.areEqual("Item Six - One", nestedOptions.item(1).all(".yui3-option").item(0).get("text"));
                    Y.Assert.areEqual("Item Six - Two", nestedOptions.item(1).all(".yui3-option").item(1).get("text"));
                },

                failure = function() {
                    Y.Assert.fail("Example does not seem to have executed within " + TIMEOUT + "ms.");
                };

            this.poll(condition, 100, TIMEOUT, success, failure);
        },

        'test select by click' : function() {
            var bb = Y.one("#mylistbox"),
                allItems = Y.all("#mylistbox li"),
                selection = Y.one("#selection"); 

            allItems.item(1).simulate("mousedown"); // Item Two

            Y.Assert.areEqual("Item Two", selection.get("text"));
            Y.Assert.areEqual("Item Two", bb.one(".yui3-option-selected").get("text"));

            allItems.item(2).simulate("mousedown");

            Y.Assert.areEqual("Item Two", selection.get("text")); // No change, Item Three is not selectable
            Y.Assert.areEqual("Item Two", bb.one(".yui3-option-selected").get("text"));

            allItems.item(6).simulate("mousedown"); // Item Five

            Y.Assert.areEqual("Item Five", selection.get("text"));
            Y.Assert.areEqual("Item Five", bb.one(".yui3-option-selected").get("text"));

            allItems.item(4).simulate("mousedown"); // Item Three - Two

            Y.Assert.areEqual("Item Three - Two", selection.get("text"));
            Y.Assert.areEqual("Item Three - Two", bb.one(".yui3-option-selected").get("text"));

            allItems.item(8).simulate("mousedown"); // Item Six - One

            Y.Assert.areEqual("Item Six - One", selection.get("text"));
            Y.Assert.areEqual("Item Six - One", bb.one(".yui3-option-selected").get("text"));
        },

        'test select by key press' : function() {

            // Assumes 'test select by click was last test which passed, leaving Item Six - One selected

            var bb = Y.one("#mylistbox"),
                allItems = bb.all("li.yui3-option"),
                focusedItem = bb.one(".yui3-option-focused"),
                selection = Y.one("#selection");

            bb.focus();

            focusedItem.simulate("keydown", {
                keyCode: 38,
                charCode: 38
            });

            focusedItem = bb.one(".yui3-option-focused");

            Y.Assert.areEqual("Item Five", focusedItem.get("text"));
            Y.Assert.areEqual("Item Six - One", selection.get("text"));

            focusedItem.simulate("keydown", {
                keyCode: 32,
                charCode: 32
            });

            Y.Assert.areEqual("Item Five", selection.get("text"));

            focusedItem.simulate("keydown", {
                keyCode: 38,
                charCode: 38
            });
            focusedItem = bb.one(".yui3-option-focused");

            focusedItem.simulate("keydown", {
                keyCode: 38,
                charCode: 38
            });
            focusedItem = bb.one(".yui3-option-focused");

            Y.Assert.areEqual("Item Three - Two", focusedItem.get("text"));
            Y.Assert.areEqual("Item Five", bb.one(".yui3-option-selected").get("text"));
            Y.Assert.areEqual("Item Five", selection.get("text"));

            focusedItem.simulate("keydown", {
                keyCode: 32,
                charCode: 32
            });

            Y.Assert.areEqual("Item Three - Two", bb.one(".yui3-option-selected").get("text"));
            Y.Assert.areEqual("Item Three - Two", selection.get("text"));

            focusedItem.simulate("keydown", {
                keyCode: 40,
                charCode: 40
            });
            focusedItem = bb.one(".yui3-option-focused");

            Y.Assert.areEqual("Item Four", focusedItem.get("text"));
            Y.Assert.areEqual("Item Three - Two", bb.one(".yui3-option-selected").get("text"));
            Y.Assert.areEqual("Item Three - Two", selection.get("text"));

            focusedItem.simulate("keydown", {
                keyCode: 32,
                charCode: 32
            });

            Y.Assert.areEqual("Item Four", bb.one(".yui3-option-selected").get("text"));
            Y.Assert.areEqual("Item Four", selection.get("text"));

            focusedItem.simulate("keydown", {
                keyCode: 40,
                charCode: 40
            });
            focusedItem = bb.one(".yui3-option-focused");

            focusedItem.simulate("keydown", {
                keyCode: 40,
                charCode: 40
            });
            focusedItem = bb.one(".yui3-option-focused");

            focusedItem.simulate("keydown", {
                keyCode: 40,
                charCode: 40
            });
            focusedItem = bb.one(".yui3-option-focused");

            focusedItem.simulate("keydown", {
                keyCode: 40,
                charCode: 40
            });
            focusedItem = bb.one(".yui3-option-focused");

            Y.Assert.areEqual("Item One", focusedItem.get("text"));
            Y.Assert.areEqual("Item Four", bb.one(".yui3-option-selected").get("text"));
            Y.Assert.areEqual("Item Four", selection.get("text"));

            focusedItem.simulate("keydown", {
                keyCode: 32,
                charCode: 32
            });

            Y.Assert.areEqual("Item One", bb.one(".yui3-option-selected").get("text"));
            Y.Assert.areEqual("Item One", selection.get("text"));

            focusedItem.simulate("keydown", {
                keyCode: 38,
                charCode: 38
            });
            focusedItem = bb.one(".yui3-option-focused");

            focusedItem.simulate("keydown", {
                keyCode: 32,
                charCode: 32
            });

            Y.Assert.areEqual("Item Six - Two", bb.one(".yui3-option-selected").get("text"));
            Y.Assert.areEqual("Item Six - Two", selection.get("text"));
        }

    }));

    Y.Test.Runner.add(suite);

}, '', {requires:['node', 'node-event-simulate']})