YUI.add('widget-extend-tests', function(Y) {
    
    var suite = new Y.Test.Suite('widget-extend example test suite'),
        TIMEOUT = 10000;

    suite.add(new Y.Test.Case({

        name : 'Example Tests',

        'test initial render' : function() {

            var test = this;

                condition = function() {
                    return Y.Node.one("div.yui3-spinner.yui3-widget.yui3-spinner-focused") !== null;
                },

                success = function() {
                    var input = Y.one(".yui3-spinner-value"),
                        bb = Y.one(".yui3-spinner"),
                        cb = Y.one(".yui3-spinner-content"),
                        upArrow = Y.one(".yui3-spinner-increment"),
                        dnArrow = Y.one(".yui3-spinner-decrement");

                    Y.Assert.areEqual("20", input.get("value"));
                    Y.Assert.areEqual("Increment", upArrow.get("text"));
                    Y.Assert.areEqual("Decrement", dnArrow.get("text"));

                    Y.Assert.areEqual(3, cb.get("children").size());

                    Y.Assert.isTrue(cb.compareTo(input.get("parentNode")));
                    Y.Assert.isTrue(cb.compareTo(upArrow.get("parentNode")));
                    Y.Assert.isTrue(cb.compareTo(dnArrow.get("parentNode")));

                    Y.Assert.isTrue(bb.compareTo(cb.get("parentNode")));
                    Y.Assert.isTrue(Y.one("#widget-extend-example").compareTo(bb.get("parentNode")));
                },

                failure = function() {
                    Y.Assert.fail("Example does not seem to have executed within " + TIMEOUT + "ms.");
                };

            this.poll(condition, 100, TIMEOUT, success, failure);
        },

        'test key press' : function() {

            var bb = Y.one(".yui3-spinner"),
                input = Y.one(".yui3-spinner-value"),
                keyEvent = !(Y.UA.opera) ? "keydown" : "keypress",
                i;

            bb.focus();

            for (i = 0; i < 7; i++) {
                bb.simulate(keyEvent, {
                    charCode : 38,
                    keyCode : 38 
                });
            }

            Y.Assert.areEqual("27", input.get("value"));

            for (i = 0; i < 12; i++) {
                bb.simulate(keyEvent, {
                    charCode : 40,
                    keyCode : 40
                });
            }

            Y.Assert.areEqual("15", input.get("value"));

            for (i = 0; i < 20; i++) {
                bb.simulate(keyEvent, {
                    charCode : 40,
                    keyCode : 40
                });
            }

            Y.Assert.areEqual("0", input.get("value"));

            for (i = 0; i < 3; i++) {
                bb.simulate(keyEvent, {
                    charCode : 33,
                    keyCode : 33
                });
            }

            Y.Assert.areEqual("30", input.get("value"));

            for (i = 0; i < 17; i++) {
                bb.simulate(keyEvent, {
                    charCode : 38,
                    keyCode : 38
                });
            }

            for (i = 0; i < 2; i++) {
                bb.simulate(keyEvent, {
                    charCode : 33,
                    keyCode : 33
                });
            }

            Y.Assert.areEqual("67", input.get("value"));

            for (i = 0; i < 4; i++) {
                bb.simulate(keyEvent, {
                    charCode : 33,
                    keyCode : 33
                });
            }

            Y.Assert.areEqual("100", input.get("value"));

            for (i = 0; i < 4; i++) {
                bb.simulate(keyEvent, {
                    charCode : 40,
                    keyCode : 40
                });
            }

            for (i = 0; i < 7; i++) {
                bb.simulate(keyEvent, {
                    charCode : 34,
                    keyCode : 34
                });
            }

            Y.Assert.areEqual("26", input.get("value"));

            for (i = 0; i < 5; i++) {
                bb.simulate(keyEvent, {
                    charCode : 34,
                    keyCode : 34
                });
            }

            Y.Assert.areEqual("0", input.get("value"));

            for (i = 0; i < 150; i++) {
                bb.simulate(keyEvent, {
                    charCode : 38,
                    keyCode : 38
                });
            }

            Y.Assert.areEqual("100", input.get("value"));

            for (i = 0; i < 12; i++) {
                bb.simulate(keyEvent, {
                    charCode : 40,
                    keyCode : 40
                });
            }

            Y.Assert.areEqual("88", input.get("value"));
        },

        'test invalid input' : function() {

            var bb = Y.one(".yui3-spinner"),
                input = Y.one(".yui3-spinner-value"),
                origValue = input.get("value");

            bb.focus();

            input.set("value", "foobar");

            Y.Assert.areEqual("foobar", input.get("value"));

            input.simulate("change");

            Y.Assert.areEqual(origValue, input.get("value"));
        },

        'test arrow clicks' : function() {
            var i,
                input = Y.one(".yui3-spinner-value"),
                bb = Y.one(".yui3-spinner"),
                upArrow = Y.one(".yui3-spinner-increment"),
                dnArrow = Y.one(".yui3-spinner-decrement"),
                // Should be at 88, based on the last test above
                currVal = parseInt(input.get("value"), 10),
                expectedVal;

            bb.focus();

            dnArrow.simulate("mousedown");
            dnArrow.simulate("mouseup", {
                bubbles:true
            });

            expectedVal = Math.max(currVal - 1, 0);

            Y.Assert.areEqual(expectedVal, parseInt(input.get("value"), 10));

            upArrow.simulate("mousedown");
            upArrow.simulate("mouseup", {
                bubbles:true
            });

            upArrow.simulate("mousedown");
            upArrow.simulate("mouseup", {
                bubbles:true
            });

            upArrow.simulate("mousedown");
            upArrow.simulate("mouseup", {
                bubbles:true
            });

            expectedVal = Math.min(expectedVal + 3, 100);

            Y.Assert.areEqual(expectedVal, parseInt(input.get("value"), 10));
        },

        'test arrows held down' : function() {
            var test = this,
                i,
                input = Y.one(".yui3-spinner-value"),
                bb = Y.one(".yui3-spinner"),
                upArrow = Y.one(".yui3-spinner-increment"),
                dnArrow = Y.one(".yui3-spinner-decrement"),
                // Should be at 90, based on the last test above
                currVal = parseInt(input.get("value"), 10),
                expectedVal;

            bb.focus();

            dnArrow.simulate("mousedown");

            test.wait(function() {

                dnArrow.simulate("mouseup", {
                    bubbles:true
                });

                Y.Assert.isTrue(parseInt(input.get("value"), 10) < currVal - 1); // Make sure we picked up more than one decrement

                currVal = parseInt(input.get("value"), 10);

                upArrow.simulate("mousedown");

                test.wait(function() {

                    upArrow.simulate("mouseup", {
                        bubbles:true
                    });

                    Y.Assert.isTrue(parseInt(input.get("value"), 10) > currVal + 1); // Make sure we picked up more than one increment

                }, 800);

            }, 800);
        }

    }));

    Y.Test.Runner.add(suite);

}, '', {requires:['node', 'node-event-simulate']})