YUI.add('scroll-list-tests', function(Y) {
    
    var Assert = Y.Assert,
        suite = new Y.Test.Suite('scroll-list');

    suite.add(new Y.Test.Case({
        name: 'scroll-list',
        'proxy element was created': function() {
            Assert.isNotNull(Y.one('.yui3-dd-proxy'));
        },
        '#list1 is rendered': function() {
            var el = Y.one('#list1');
            Assert.isNotNull(el, '#list1 is null');
            Assert.isTrue(el.hasClass('yui3-dd-drop'), 'Drop not init on #list1');
            
        },
        '#list2 is rendered': function() {
            var el = Y.one('#list2');
            Assert.isNotNull(el, '#list2 is null');
            Assert.isTrue(el.hasClass('yui3-dd-drop'), 'Drop not init on #list2');
            
        },
        'items in list 1 are rendered': function() {
            var lis = Y.all('#list1 li');
            lis.each(function(dd) {
                Assert.isTrue(dd.hasClass('list1'), 'Items does not have list1 class');
                Assert.isTrue(dd.hasClass('yui3-dd-drop'), 'Item does not have drop class');
                Assert.isTrue(dd.hasClass('yui3-dd-draggable', 'Item does not have drag class'));
            });
        },
        'items in list 2 are rendered': function() {
            var lis = Y.all('#list2 li');
            lis.each(function(dd) {
                Assert.isTrue(dd.hasClass('list2'), 'Items does not have list2 class');
                Assert.isTrue(dd.hasClass('yui3-dd-drop'), 'Item does not have drop class');
                Assert.isTrue(dd.hasClass('yui3-dd-draggable', 'Item does not have drag class'));
            });
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node-event-simulate' ] });
