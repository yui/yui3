YUI.add('overlay-anim-plugin-tests', function(Y) {

    var suite = new Y.Test.Suite('overlay-anim-plugin example test suite'),
        Assert = Y.Assert,
        overlay = Y.one('.yui3-overlay'),
        unplug = Y.one('#unplug'),
        plug = Y.one('#plug');

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test overlay renders': function() {
            Assert.isTrue((overlay !== null), ' - Failed to render overlay container');
        },
        'test click show button': function() {
            var test = this;
            Y.one('.example #show').simulate('click');

            var foo = function(e) {
                setTimeout(function() { //dely this assert for ie
                    test.resume(function() {
                        Assert.areEqual('visible', overlay.getComputedStyle('visibility'),'failed to show overlay');
                    });
                }, 2300);
            }
            foo();
            test.wait(3000);
        },
        'test click hide button': function() {
            var test = this;
            Y.one('.example #hide').simulate('click');
            var foo = function(e) {
                setTimeout(function() { //dely this assert for ie
                    test.resume(function() {
                        Assert.areEqual('hidden', overlay.getComputedStyle('visibility'),'failed to hide overlay');
                    });
                }, 2300);
            }
            foo();
            test.wait(3000);
        },
        ////////////////////////// unplugged.
        'test click show button unplugged': function() {

            unplug.simulate('click'); ////////////////////////// unplugged.
            Y.one('.example #show').simulate('click');
            Assert.areEqual('visible', overlay.getComputedStyle('visibility'),'failed to show overlay');
        },
        'test click hide button unplugged': function() {
            Y.one('.example #hide').simulate('click');
            Assert.areEqual('hidden', overlay.getComputedStyle('visibility'),'failed to hide overlay');
        },


        //////////////////////////  Plugin with 0.5
        'test click show button': function() {
            plug.simulate('click'); ////////////////////////// plugged.
            var test = this;
            Y.one('.example #show').simulate('click');

            var foo = function(e) {
                setTimeout(function() { //dely this assert for ie
                    test.resume(function() {
                        Assert.areEqual('visible', overlay.getComputedStyle('visibility'),'failed to show overlay');
                    });
                }, 700);
            }
            foo();
            test.wait(1000);
        },
        'test click hide button': function() {
            var test = this;
            Y.one('.example #hide').simulate('click');
            var foo = function(e) {
                setTimeout(function() { //dely this assert for ie
                    test.resume(function() {
                        Assert.areEqual('hidden', overlay.getComputedStyle('visibility'),'failed to hide overlay');
                    });
                }, 700);
            }
            foo();
            test.wait(1000);
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
