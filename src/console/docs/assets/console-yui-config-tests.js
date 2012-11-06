YUI.add('console-yui-config-tests', function(Y) {

    var Assert = Y.Assert,
        suite = new Y.Test.Suite('console-yui-config');
    
    var uncheckAll = function() {
        Y.all('.filter-controls input[type=checkbox]').set('checked', false);
    };

    var clearAllLogs = function() {
        Y.all('#demo .yui3-console-entry').remove();
    };

    suite.add(new Y.Test.Case({
        name: 'Start Up Tests',
        'console should be visible': function () {
            var consoles = Y.all('#demo .yui3-console'),
                hidden   = Y.all('#demo .yui3-console-hidden');

            Assert.areSame(1, consoles.size());
            Assert.areSame(0, hidden.size());
        },
        'default has no entries': function() {
            var entries = Y.all('#demo .yui3-console-entry');

            Assert.areEqual(0, entries.size(), 'Console contains entries');
        }
    }));

    var getEntries = function() {
        return Y.all('#demo .yui3-console-entry');
    };

    var getSource = function() {
        return Y.one('#demo .yui3-console-entry-src');
    };

    var getCat = function() {
        return Y.one('#demo .yui3-console-entry-cat').get('innerHTML');
    };

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        setUp: function() {
            this.log = Y.one('#log');
            this.msg = Y.one('#msg');
            uncheckAll();
            clearAllLogs();
        },
        'click log button': function() {
            var entries = getEntries();

            Assert.areEqual(0, entries.size(), 'Console contains entries');

            this.log.simulate('click');

            this.wait(function() {
                var entries = Y.all('#demo .yui3-console-entry');
                Assert.areEqual(1, entries.size(), 'Console contains entries');
                var source = getSource();
                Assert.areEqual('sourceA', source.get('innerHTML'));
            
            }, 200);
        },
        'test different log message sourceA': function() {
            var entries = getEntries();

            Assert.areEqual(0, entries.size(), 'Console contains entries');
            
            this.msg.set('value', 'THIS IS A TEST');
            this.log.simulate('click');

            this.wait(function() {
                var entries = getEntries();
                Assert.areEqual(1, entries.size(), 'Console contains entries');
                var html = entries.item(0).one('.yui3-console-entry-content').get('innerHTML');
                Assert.areEqual('THIS IS A TEST', html);
                var source = getSource();
                Assert.areEqual('sourceA', source.get('innerHTML'));
                Assert.areEqual('info', getCat());
            }, 200);
        },
        'test different log message sourceB': function() {
            var entries = getEntries();

            Assert.areEqual(0, entries.size(), 'Console contains entries');
            
            this.msg.set('value', 'THIS IS ANOTHER TEST');
            Y.one('#msg_src_b').set('checked', true);
            this.log.simulate('click');

            this.wait(function() {
                var entries = getEntries();
                Assert.areEqual(1, entries.size(), 'Console contains entries');
                var html = entries.item(0).one('.yui3-console-entry-content').get('innerHTML');
                Assert.areEqual('THIS IS ANOTHER TEST', html);
                var source = getSource();
                Assert.areEqual('sourceB', source.get('innerHTML'));
                Assert.areEqual('info', getCat());
            }, 200);
        },
        'test different log message sourceC': function() {
            var entries = getEntries();

            Assert.areEqual(0, entries.size(), 'Console contains entries');
            
            this.msg.set('value', 'THIS IS ANOTHER TEST AGAIN');
            Y.one('#msg_src_c').set('checked', true);
            this.log.simulate('click');

            this.wait(function() {
                var entries = getEntries();
                Assert.areEqual(0, entries.size(), 'Console contains entries');
            }, 200);
        },
        'log level warn': function() {
            Y.one('#lvl_warn').set('checked', 'true');
            var entries = getEntries();

            Assert.areEqual(0, entries.size(), 'Console contains entries');
            
            this.msg.set('value', 'THIS IS ANOTHER TEST AGAIN');
            Y.one('#msg_src_a').set('checked', true);
            Y.one('#msg_warn').set('checked', true);
            this.log.simulate('click');

            this.wait(function() {
                var entries = getEntries();
                Assert.areEqual(1, entries.size(), 'Console contains entries');
                var source = getSource();
                Assert.areEqual('sourceA', source.get('innerHTML'));
                Assert.areEqual('warn', getCat());
            }, 200);
        },
        'log level error': function() {
            Y.one('#lvl_error').set('checked', 'true');
            var entries = getEntries();

            Assert.areEqual(0, entries.size(), 'Console contains entries');
            
            this.msg.set('value', 'THIS IS ANOTHER TEST AGAIN');
            Y.one('#msg_src_b').set('checked', true);
            Y.one('#msg_error').set('checked', true);
            this.log.simulate('click');

            this.wait(function() {
                var entries = getEntries();
                Assert.areEqual(1, entries.size(), 'Console contains entries');
                var source = getSource();
                Assert.areEqual('sourceB', source.get('innerHTML'));
                Assert.areEqual('error', getCat());
            }, 200);
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
