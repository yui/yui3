YUI.add('ducks-tests', function(Y) {

    var suite = new Y.Test.Suite('ducks example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'how many ducks are standing': function() {
            var ducksUp = Y.all('.duck-row .set-up');

            Assert.areEqual(10, ducksUp.size(), 'Failed to find initial 10 ducks set up');
        },
        'how many ducks are set-up after clicking one': function() {
            var ducksUp = Y.all('.duck-row .set-up');
            Y.one('.duck-row li').simulate('click');
            //ducksUp.item(3).simulate('click');
            Assert.areEqual('9', Y.one('.ducks-remain').getContent(), 'Failed to have one less duck set up after click');
        },
        'show attitude and click another': function() {
            var node = Y.one('.duck-row .set-up'),
                test = this;

    //        Y.one('#show-attitude').simulate('click');   // doesn't seem to work in IE9
            Y.one('#show-attitude').set('checked', 'checked');

            node.on('click', function(e) {
                setTimeout(function() {
                    test.resume(function() {
                        Assert.areEqual('8', Y.one('.ducks-remain').getContent(), 'Failed to have one less duck remaining after click');
                        Assert.areEqual('0px', Y.one('.duck-row .set-up .squawk').getStyle('top'), 'Squawk bubbles fail to display at top: 0px');
                    });
                }, 1100);
            });

            setTimeout(function() {
                node.simulate('click');
            }, 0);
            test.wait(1500);
        },
        'show NO attitude and click another': function() {
            var node = Y.one('.duck-row .set-up'),
                test = this;

//            Y.one('#show-attitude').simulate('click');    // doesn't seem to work in IE9
            Y.one('#show-attitude').set('checked', '');

            node.on('click', function(e) {
                setTimeout(function() {
                    test.resume(function() {
                        Assert.areEqual('7', Y.one('.ducks-remain').getContent(), 'Failed to have 7 duck remaining after click');
                        Assert.areEqual('-400px', Y.one('.duck-row .set-up .squawk').getStyle('top'), 'Failed to hide Squawk bubbles outside their container');
                    });
                }, 4000);
            });

            setTimeout(function() {
                node.simulate('click');
            }, 0);
            test.wait(4500);
        },
        'test reset ducks': function() {
            Y.one('#button-reset').simulate('click');

            Assert.areEqual('10', Y.one('.ducks-remain').getContent(), 'Failed to show "10" in ducks remaining span');
            Assert.areEqual(10, Y.all('.duck-row .set-up').size(), 'Failed to find 10 ducks with class set-up');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
