YUI.add('swipe-example-tests', function(Y) {
    
    var suite = new Y.Test.Suite('swipe-example test suite'),
        SWIPE_DURATION = 0,
        SWIPE_WAIT_DURATION = 100;

    suite.add(new Y.Test.Case({

        name : 'Example Tests',

        'Initial State' : function() {

            var TIMEOUT = 10000;

            var test = this,
                out = Y.Node.one("#out");

                condition = function() {
                    return (Y.all(".myexample-hidden").size() === 0);
                },

                success = function() {
                    Y.Assert.pass(); // Condition is the only thing we needed to check
                },

                failure = function() {
                    Y.Assert.fail("Example does not seem to have executed within " + TIMEOUT + "ms.");
                };

            test.poll(condition, 100, TIMEOUT, success, failure);
        },

        assertDeleteButtonVisible : function(btn) {
            Y.Assert.isFalse(btn.hasClass("myapp-hidden"));
            Y.Assert.areNotEqual("hidden", btn.getComputedStyle("visibility"));
        },

        assertDeleteButtonHidden : function(btn) {
            Y.Assert.isTrue(btn.hasClass("myapp-hidden"));
            Y.Assert.areEqual("hidden", btn.getComputedStyle("visibility"));
        },

        simulateSwipeRight : function(node, distance, duration, cb) {
            var test = this;

            node.simulateGesture("move", {
                path : {
                    xdist: distance
                },
                duration: duration
            }, function() {
                test.resume(cb);
            });

            test.wait();
        },

        simulateSwipeLeft : function(node, distance, duration, cb) {
            var test = this;
            
            node.simulateGesture("move", {
                path : {
                    xdist: -distance
                },
                duration: duration
            }, function() {
                test.resume(cb);
            });

            test.wait();
        },

        simulateTap : function(node, cb) {
            var test = this;
            
            node.simulateGesture("tap", function() {
                test.resume(cb);
            });

            test.wait();
        },

        'swipe right' : function() {
            var test = this,
                allItems = Y.all("#swipe > li"),
                deleteButtons,
                item = allItems.item(1);

            test.simulateSwipeRight(item, 40, SWIPE_DURATION, function() {
                deleteButtons = Y.all("#swipe .myapp-delete");

                Y.Assert.isTrue(deleteButtons.size() === 5);

                deleteButtons.each(function(btn) {
                    test.assertDeleteButtonHidden(btn);
                });
            });
        },

        'swipe left' : function() {
            var test = this,
                allItems = Y.all("#swipe > li"),
                deleteButtons,
                item = allItems.item(1),
                deleteButton = item.one(".myapp-delete");

            test.simulateSwipeLeft(item, 30, SWIPE_DURATION, function() {
                deleteButtons = Y.all("#swipe .myapp-delete");
                Y.Assert.isTrue(deleteButtons.size() === 5);

                test.assertDeleteButtonVisible(deleteButton);

                deleteButtons.each(function(btn) {
                    if (!btn.get("parentNode").compareTo(item)) {
                        test.assertDeleteButtonHidden(btn);
                    }
                });
            });
        },

        'swipe left and delete' : function() {
            var test = this,
                allItems = Y.all("#swipe > li"),
                item = allItems.item(2),
                deleteButton = item.one(".myapp-delete");

            test.simulateSwipeLeft(item, 30, SWIPE_DURATION, function() {

                test.assertDeleteButtonVisible(deleteButton);

                test.simulateTap(deleteButton, function() {

                    test.wait(function() {
                        allItems.refresh();
                        Y.Assert.areEqual(4, allItems.size());
                        Y.Assert.isFalse(item.inDoc());
                    }, 1000); // Transition is 0.3s

                });
            });
        },

        'swipe left and tap outside the delete button' : function() {
            var test = this,
                allItems = Y.all("#swipe > li"),
                item = allItems.item(0),
                deleteButton = item.one(".myapp-delete");

            test.simulateSwipeLeft(item, 30, SWIPE_DURATION, function() {
                test.assertDeleteButtonVisible(deleteButton);

                test.simulateTap(item, function() {
                    test.assertDeleteButtonHidden(deleteButton);
                });

                test.wait();
            });
        },

        'swipe left while delete is displayed on another item' : function() {

            var test = this,
                allItems = Y.all("#swipe > li"),

                item = allItems.item(0),
                deleteButton = item.one(".myapp-delete"),

                otherItem = allItems.item(1),
                otherDeleteButton = otherItem.one(".myapp-delete");

            test.simulateSwipeLeft(item, 30, SWIPE_DURATION, function() {

                test.assertDeleteButtonVisible(deleteButton);

                test.simulateSwipeLeft(otherItem, 30, SWIPE_DURATION, function() {
                    test.assertDeleteButtonHidden(deleteButton);
                    test.assertDeleteButtonVisible(otherDeleteButton);
                });

            });
        }

    }));

    Y.Test.Runner.add(suite);

}, '', {requires:['node', 'node-event-simulate']});
