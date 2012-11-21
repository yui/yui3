YUI.add('portal-drag-tests', function(Y) {
    
    var Assert = Y.Assert,
        suite = new Y.Test.Suite('portal-drag');

    suite.add(new Y.Test.Case({
        name: 'portal-drag',
        'proxy element was created': function() {
            var test = this;
            test.wait(function() {
                Assert.isNotNull(Y.one('.yui3-dd-proxy'), 'Failed to find the DD proxy element');
            }, 5000);
        },
        'did drops initialize': function() {
            Assert.isTrue(Y.one('#list1').hasClass('yui3-dd-drop'), 'Failed to initialize drop on list1');
            Assert.isTrue(Y.one('#list2').hasClass('yui3-dd-drop'), 'Failed to initialize drop on list2');
            Assert.isTrue(Y.one('#list3').hasClass('yui3-dd-drop'), 'Failed to initialize drop on list3');
        },
        'did draggabls initialize': function() {
            var lis = Y.all('#feeds li');

            lis.each(function(dd) {
                Assert.isTrue(dd.hasClass('yui3-dd-draggable'),'Failed to initialize drag on ' + dd.get('id'));
            });
        }
    }));

    Y.Test.Runner.add(suite);

});
