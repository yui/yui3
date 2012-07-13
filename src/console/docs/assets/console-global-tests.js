YUI.add('console-global-tests', function(Y) {

    var Assert = Y.Assert,
        suite = new Y.Test.Suite('console-global');
    
    var clearAllLogs = function() {
        Y.all('#yconsole .yui3-console-entry').remove();
    };

    var click = function(id) {
        Y.one('#' + id).simulate('click');
    };

    var getEntries = function() {
        return Y.all('#yconsole .yui3-console-entry');
    };

    var getSource = function() {
        return Y.one('#yconsole .yui3-console-entry-src');
    };

    var getCat = function() {
        return Y.one('#yconsole .yui3-console-entry-cat').get('innerHTML');
    };

    var getContent = function(entries) {
        return entries.item(0).one('.yui3-console-entry-content').get('innerHTML');
    };

    suite.add(new Y.Test.Case({
        name: 'Start Up Tests',
        'console should be visible': function () {
            var consoles = Y.all('#yconsole .yui3-console'),
                hidden   = Y.all('#yconsole .yui3-console-hidden');

            Assert.areSame(1, consoles.size());
            Assert.areSame(0, hidden.size());
        },
        'default has no entries': function() {
            var entries = Y.all('#yconsole .yui3-console-entry');

            Assert.areEqual(0, entries.size(), 'Console contains entries');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'console-global',
        setUp: function() {
            clearAllLogs();
        },
        'first button click': function() {
            var entries = getEntries();
            Assert.areEqual(0, entries.size());

            click('yui1');

            this.wait(function() {
                var entries = getEntries();
                Assert.areEqual(1, entries.size());
                Assert.areEqual('info', getCat());
                Assert.areEqual('Message from YUI instance #1', getContent(entries));
            }, 500);
        },
        'second button click': function() {
            var entries = getEntries();
            Assert.areEqual(0, entries.size());

            click('yui2');

            this.wait(function() {
                var entries = getEntries();
                Assert.areEqual(1, entries.size());
                Assert.areEqual('info', getCat());
                Assert.areEqual("I'm the second YUI instance", getContent(entries));
            }, 500);
        },
        'third button click': function() {
            var entries = getEntries();
            Assert.areEqual(0, entries.size());

            click('yui3');

            this.wait(function() {
                var entries = getEntries();
                Assert.areEqual(1, entries.size());
                Assert.areEqual('info', getCat());
                Assert.areEqual("And this is #3 YUI", getContent(entries));
            }, 500);
        }
    }));

    Y.Test.Runner.add(suite);


}, '', { requires: [ 'node-event-simulate' ] });
