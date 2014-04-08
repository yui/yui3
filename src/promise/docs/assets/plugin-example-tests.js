YUI.add('plugin-example-tests', function (Y) {
    
    var Assert = Y.Assert,
        suite = new Y.Test.Suite('plugin-example');

    suite.add(new Y.Test.Case({
        name: 'Promise Node plugin tests',

        'is rendered': function () {
            Assert.isNotNull(Y.one('#square'), 'Test div is not present');
            Assert.isNotNull(Y.one('#with-plugin'), 'Button for plugin version not present');
            Assert.isNotNull(Y.one('#without-plugin'), 'Button for normal version not present');
        },

        'without plugin': function () {
            var square = Y.one('#square'),
                button = Y.one('#without-plugin'),
                test = this;

            button.once('click', function () {
                setTimeout(function () {
                    test.resume(function () {
                        Assert.areEqual('300px', square.getComputedStyle('width'), 'Test div does not have the correct width after transition');
                        Assert.areEqual('300px', square.getComputedStyle('height'), 'Test div does not have the correct height after transition');
                        Assert.areEqual('200px', square.getComputedStyle('left'), 'Test div does not have the correct position after transition');
                    });
                }, 1000);
            });

            button.simulate('click');

            test.wait();
        },

        // Check after the first transition
        'with plugin first stage': function () {
            var square = Y.one('#square'),
                button = Y.one('#with-plugin'),
                test = this,

                width, height, left;

            button.once('click', function () {
                setTimeout(function () {
                    // Store the values at this point and keep running the
                    // transition until the end. Make assertions at the end so
                    // that the next test can start over without collisions
                    // between transitions
                    width = square.getComputedStyle('width');
                    height = square.get('offsetHeight');
                    left = square.getComputedStyle('left');
                }, 600);
                setTimeout(function () {
                    test.resume(function () {
                        Assert.areEqual('300px', width, 'Test div does not have the correct width after transition');
                        // At this point the height of the square should be
                        // animating, so there is no way to tell exactly what
                        // height it has, but we can check if it started the
                        // transition or if it just jumped to the end as if
                        // the promise implementation failed
                        Assert.isTrue(height > 100, 'Height has not started transition');
                        Assert.isTrue(height < 300, 'Height has already finished transition');
                        Assert.areEqual('0px', left, 'Test div does not have the correct position after transition');
                    });
                }, 1600);
            });

            button.simulate('click');

            test.wait();
        },

        'with plugin second stage': function () {
            var square = Y.one('#square'),
                button = Y.one('#with-plugin'),
                test = this,

                width, height, left;

            button.once('click', function () {
                setTimeout(function () {
                    width = square.getComputedStyle('width');
                    height = square.getComputedStyle('height');
                    left = square.getComputedStyle('left');
                }, 1500);
                setTimeout(function () {
                    test.resume(function () {
                        left = +left.substr(0, left.length - 2);
                        Assert.areEqual('300px', width, 'Test div does not have the correct width after transition');
                        Assert.areEqual('300px', height, 'Test div does not have the correct height after transition');
                        // same as with the height in the first stage
                        Assert.isTrue(left > 0, 'left has not started transition');
                        Assert.isTrue(left < 200, 'left has already finished transition');
                    });
                }, 1600);
            });

            button.simulate('click');

            test.wait();
        },

        'with plugin final values': function () {
            var square = Y.one('#square'),
                button = Y.one('#with-plugin'),
                test = this;

            button.once('click', function () {
                setTimeout(function () {
                    test.resume(function () {
                        Assert.areEqual('300px', square.getComputedStyle('width'), 'Test div does not have the correct width after transition');
                        Assert.areEqual('300px', square.getComputedStyle('height'), 'Test div does not have the correct height after transition');
                        Assert.areEqual('200px', square.getComputedStyle('left'), 'Test div does not have the correct position after transition');
                    });
                }, 2000);
            });

            button.simulate('click');

            test.wait();
        }
    }));

    Y.Test.Runner.add(suite);
}, '', {requires: ['node-event-simulate']});
