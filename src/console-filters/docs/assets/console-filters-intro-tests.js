YUI.add('console-filters-intro-tests', function(Y) {

    var Assert = Y.Assert,
        suite = new Y.Test.Suite('console-filters-intro');

    var clearAllLogs = function() {
        Y.all('#yconsole .yui3-console-entry').remove();
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
        name: 'console-filters-intro',
        'should have entries': function() {
            var entries = getEntries();
            Assert.isTrue(entries.size() > 5, 'should have at least 5 entries');
        },
        'click hide info': function() {
            Y.one('#toggle_info').simulate('click');
            var entries = getEntries();
            Assert.areEqual(0, entries.size() , 'should have 0 entries');
        },
        'click hide info again': function() {
            Y.one('#toggle_info').simulate('click');
            var entries = getEntries();
            Assert.isTrue(entries.size() > 5, 'should have at least 5 entries');
        },
        'add a message': function() {
            clearAllLogs();
            var entries = getEntries();
            Assert.areEqual(0, entries.size() , 'should have 0 entries');
            Y.one('#log').simulate('click');
            this.wait(function() {
                var entries = getEntries();
                Assert.areEqual(2, entries.size() , 'should have 2 entries');
                Assert.isNotNull(Y.one('#yconsole .yui3-console-filter-my_stuff'));
                Assert.isNotNull(Y.one('#yconsole .yui3-console-filter-MyApp'));
            }, 200);       
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node-event-simulate'  ]  });
