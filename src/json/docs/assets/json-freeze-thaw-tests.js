YUI.add('json-freeze-thaw-tests', function(Y) {

    var Assert = Y.Assert,
        suite = new Y.Test.Suite('json-freeze-thaw');

    suite.add(new Y.Test.Case({
        name: 'json-freeze-thaw',
        'is rendered': function() {
            Assert.isNotNull(Y.one('#demo_freeze'));
            Assert.isNotNull(Y.one('#demo_thaw'));
            Assert.isNotNull(Y.one('#demo_frozen'));
            Assert.isNotNull(Y.one('#demo_thawed'));
        },
        'freeze button click': function() {
            var text = Y.one('#demo_frozen').get('text');
            Assert.areEqual('(stringify results here)', text);
            Assert.isTrue(Y.one('#demo_thaw').get('disabled'));
            var button = Y.one('#demo_freeze');
            button.simulate('click');

            this.wait(function() {
                Assert.isFalse(Y.one('#demo_thaw').get('disabled'));
                var json = Y.JSON.parse(Y.one('#demo_frozen').get('text'));
                Assert.areEqual(json.type, 'Hominid');
                Assert.areEqual(json.count, 1);
                Assert.isArray(json.specimen);
                Assert.areEqual(json.specimen[0]._class, 'CaveMan');
                Assert.areEqual(json.specimen[0].n, 'Ed');

            }, 200);
        },
        'thaw button click': function() {
            var text = Y.one('#demo_thawed').get('text');
            Assert.areEqual('', text);
            Assert.isFalse(Y.one('#demo_thaw').get('disabled'));
            var button = Y.one('#demo_thaw');
            button.simulate('click');

            this.wait(function() {
                Assert.isFalse(Y.one('#demo_thaw').get('disabled'));
                var ps = Y.all('#demo_thawed p');
                Assert.areEqual(ps.item(0).get('text'), 'Specimen count: 1');
                Assert.areEqual(ps.item(1).get('text'), 'Specimen type: Hominid');
                Assert.areEqual(ps.item(2).get('text'), 'Instanceof CaveMan: true');
                Assert.areEqual(ps.item(3).get('text'), 'Name: Ed, the cave man');
            }, 200);
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'json-parse', 'node-event-simulate' ] });
