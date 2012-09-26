YUI.add('overlay-stack-tests', function(Y) {

    var suite = new Y.Test.Suite('overlay-stack example test suite'),
        Assert = Y.Assert,
        overlays = Y.all('.example .yui3-overlay');

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test 6 overlays render': function() {
            Assert.areEqual(6, overlays.size(), ' - Failed to render 6 overlays');
        },
        'test initial z-index': function() {
            Assert.areEqual('1', overlays.item(0).getStyle('zIndex'), ' - Failed z-index for 0');
            Assert.areEqual('2', overlays.item(1).getStyle('zIndex'), ' - Failed z-index for 1');
            Assert.areEqual('3', overlays.item(2).getStyle('zIndex'), ' - Failed z-index for 2');
            Assert.areEqual('4', overlays.item(3).getStyle('zIndex'), ' - Failed z-index for 3');
            Assert.areEqual('5', overlays.item(4).getStyle('zIndex'), ' - Failed z-index for 4');
            Assert.areEqual('6', overlays.item(5).getStyle('zIndex'), ' - Failed z-index for 5');
        },
        'test z-index after click overlay.item(2)': function() {
            overlays.item(2).simulate("mousedown", { clientX: 10, clientY: 10 });
            Assert.areEqual('1', overlays.item(0).getStyle('zIndex'), ' - Failed z-index for 0');
            Assert.areEqual('2', overlays.item(1).getStyle('zIndex'), ' - Failed z-index for 1');
            Assert.areEqual('6', overlays.item(2).getStyle('zIndex'), ' - Failed z-index for 2');
            Assert.areEqual('4', overlays.item(3).getStyle('zIndex'), ' - Failed z-index for 3');
            Assert.areEqual('5', overlays.item(4).getStyle('zIndex'), ' - Failed z-index for 4');
            Assert.areEqual('3', overlays.item(5).getStyle('zIndex'), ' - Failed z-index for 5');
        },
        'test z-index after click overlay.item(1)': function() {
            overlays.item(1).simulate("mousedown", { clientX: 10, clientY: 10 });
            Assert.areEqual('1', overlays.item(0).getStyle('zIndex'), ' - Failed z-index for 0');
            Assert.areEqual('6', overlays.item(1).getStyle('zIndex'), ' - Failed z-index for 1');
            Assert.areEqual('2', overlays.item(2).getStyle('zIndex'), ' - Failed z-index for 2');
            Assert.areEqual('4', overlays.item(3).getStyle('zIndex'), ' - Failed z-index for 3');
            Assert.areEqual('5', overlays.item(4).getStyle('zIndex'), ' - Failed z-index for 4');
            Assert.areEqual('3', overlays.item(5).getStyle('zIndex'), ' - Failed z-index for 5');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
