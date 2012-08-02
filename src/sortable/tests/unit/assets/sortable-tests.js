YUI.add('sortable-tests', function(Y) {

    var sort, sort2,
        Assert = Y.Assert;

    var template = {
        name: 'Sortable Test',

        setUp : function() {
        },

        tearDown : function() {
        },

        'test: loading': function() {
            Assert.isFunction(Y.Sortable);
        },
        'test: instantiate': function() {
            sort = new Y.Sortable({
                container: '#cont1',
                nodes: 'li',
                handles: ['a']
            });

            sort2 = new Y.Sortable({
                container: '#cont2',
                nodes: 'li',
                handles: ['a']
            });
            Assert.isInstanceOf(Y.Base, sort, 'Sortable not an instance of Base');
            Assert.isInstanceOf(Y.Sortable, sort, 'Sortable not an instance of Sortable');
        },
        'test: getSortable': function() {
            var s = Y.Sortable.getSortable('#cont1');
            Assert.areSame(sort, s, 'Failed to get Sortable instance');

            var n = Y.Sortable.getSortable(Y.one('#cont1'));
            Assert.areSame(sort, n, 'Failed to get Sortable instance from Node instance');
        },
        'test: full join': function() {
            var _1len = sort.delegate.dd.get('groups').length,
                _2len = sort2.delegate.dd.get('groups').length;

            sort.join(sort2); //Testing no second argument
            var _1len2 = sort.delegate.dd.get('groups').length,
                _2len2 = sort2.delegate.dd.get('groups').length;
            Assert.areEqual((_1len + 1), _1len2, 'Failed to add full join to sort');
            Assert.areEqual((_2len + 1), _2len2, 'Failed to add full join to sort');

            sort.join(sort2, 'none');
        },
        'test: outer join': function() {
            var _1len = sort.delegate.dd.get('groups').length,
                _2len = sort2.delegate.dd.get('groups').length;

            sort.join(sort2, 'outer');
            var _1len2 = sort.delegate.dd.get('groups').length,
                _2len2 = sort2.delegate.dd.get('groups').length;
            Assert.areEqual((_1len + 1), _1len2, 'Failed to add outer join to sort');
            Assert.areEqual(_2len, _2len2, 'Failed to add outer join to sort');
            
            sort.join(sort2, 'none');
        },
        'test: inner join': function() {
            var _1len = sort.delegate.dd.get('groups').length,
                _2len = sort2.delegate.dd.get('groups').length;

            sort.join(sort2, 'inner');
            var _1len2 = sort.delegate.dd.get('groups').length,
                _2len2 = sort2.delegate.dd.get('groups').length;
            Assert.areEqual(_1len, _1len2, 'Failed to add inner join to sort');
            Assert.areEqual((_2len + 1), _2len2, 'Failed to add inner join to sort');
            
            sort.join(sort2, 'none');
        },
        'test: no join': function() {
            var groups = sort.delegate.dd.get('groups');
            sort.join(sort, 'none');
            var groups = sort.delegate.dd.get('groups');
            Assert.areEqual(0, groups, 'Group removal failed');
        },
        'test: ordering': function() {
            var order = sort.getOrdering();
            var items = [];
            Y.all('#cont1 li').each(function(n) {
                items.push(n);
            });
            Assert.areEqual(items.length, order.length, 'Failed to find nodes');
        },
        'test: dragging start': function() {
            sort.set('currentNode', Y.one('#cont1 li'));
        },
        'test: startDrag': function() {
            var oNode = sort.delegate.get(sort.get('opacityNode'));

            sort._onDragStart();
        },
        'test: onDrag': function() {
            var i = 0;
            for (i = 100; i <=200; i++) {
                sort._onDrag({
                    pageY: i
                });
                Assert.isFalse(sort._up);
            }

            for (i = 0; i <=200; i++) {
                sort._onDrag({
                    pageY: i*-1
                });
                Assert.isTrue(sort._up);
            }

        },
        'test: dragEnd event': function() {
            var oNode = sort.delegate.get(sort.get('opacityNode')),
                opacity = oNode.getStyle('opacity');

            sort._onDragEnd();

            var opacity2 = oNode.getStyle('opacity');
            Assert.areSame('0.75', opacity);
            Assert.areSame('1', opacity2);
        },
        'test: DD passthru for errors': function() {
            sort.sync();
            sort.plug(Y.Plugin.SortableScroll);
        },
        'test: destroy': function() {
            sort.destroy();
            Assert.isTrue(sort.get('destroyed'), 'Failed to destroy the sortable instance');
            Assert.isTrue(sort.delegate.get('destroyed'), 'Failed to destroy the delegate instance');
            Assert.isTrue(sort.drop.get('destroyed'), 'Failed to destroy the drop instance');
        },
        _should: {
            fail: {
                'test: dragEnd event': (Y.UA.ie && Y.UA.ie < 9)
            }
        }
    };


    var suite = new Y.Test.Suite("Sortable");
    suite.add(new Y.Test.Case(template));
    Y.Test.Runner.add(suite);

});

