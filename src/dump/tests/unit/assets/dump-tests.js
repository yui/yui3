YUI.add('dump-tests', function(Y) {

    var Assert = Y.Assert,
        ObjectAssert = Y.ObjectAssert,
        deep = {
            one: {
                two: {
                    three: {
                        four: {
                            five: {
                                six: {
                                    seven: [1, 2, 3, 4, 5]
                                }
                            }
                        }
                    }
                }
            }
        };

    var suite = new Y.Test.Suite("Dump");

    suite.add(new Y.Test.Case({
        name: "Dump tests",
    
        test_dump: function() {
            Assert.areEqual("0", Y.Lang.dump(0));
            Assert.areEqual("null", Y.Lang.dump(null));
            Assert.areEqual("false", Y.Lang.dump(false));
            // Other types tested in substitute
        },
        'test: dump with a date': function() {
            var d = new Date();
            var control = '{date => ' + d.toString() + '}';
            var out = Y.Lang.dump({
                date: d
            });
            Assert.areSame(control, out, 'Failed to encode Date properly');
        },
        'test: HTMLElement': function() {
            var out = Y.Lang.dump({
                nodeType: 3,
                tagName: 'DIV',
                id: 'foo'
            });
            Assert.areEqual('DIV#foo', out, 'Failed to encode HTMLElement');
        },
        'test: HTMLDocument': function() {
            var out = Y.Lang.dump({
                location: {},
                body: {}
            });
            Assert.areEqual('document', out, 'Failed to encode HTMLDocument');
        },
        'test: HTMLWindow': function() {
            var out = Y.Lang.dump({
                document: {},
                navigator: {}
            });
            Assert.areEqual('window', out, 'Failed to encode HTMLWindow');
        },
        'test: function': function() {
            var out = Y.Lang.dump(function() {
            });
            Assert.areEqual('f(){...}', out, 'Failed to encode function');
        },
        'test: array': function() {
            var out = Y.Lang.dump([ 1, 2, 3, 4 ]);
            Assert.areEqual('[1, 2, 3, 4]', out, 'Failed to encode array');
        },
        'test: array with object': function() {
            var out = Y.Lang.dump([ 1, 2, 3, 4, {
                one: true, two: true
            }]);
            Assert.areEqual('[1, 2, 3, 4, {one => true, two => true}]', out, 'Failed to encode array with Object');
        },
        'test: array with regex': function() {
            var out = Y.Lang.dump([ 1, 2, 3, 4, /foo^bar/]);
            Assert.areEqual('[1, 2, 3, 4, /foo^bar/]', out, 'Failed to encode array with RegEx');
        },
        'test: default depth': function() {
            var out = Y.Lang.dump(deep);
            Assert.areEqual('{one => {two => {three => {four => {...}}}}}', out, 'Failed to truncate at 3');
        },
        'test: depth of 5': function() {
            var out = Y.Lang.dump(deep, 5);
            Assert.areEqual('{one => {two => {three => {four => {five => {six => {...}}}}}}}', out, 'Failed to truncate at 5');
        },
        'test: depth of 10': function() {
            var out = Y.Lang.dump(deep, 10);
            Assert.areEqual('{one => {two => {three => {four => {five => {six => {seven => [1, 2, 3, 4, 5]}}}}}}}', out, 'Failed to truncate at 5');
        }
    }));

    Y.Test.Runner.add(suite);

});
