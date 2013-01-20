YUI.add('paginator-core-tests', function (Y) {

var suite = new Y.Test.Suite("Paginator: Core");

suite.add(new Y.Test.Case({
    name: "Class extension",

    testClassExtension: function () {
        var Class = Y.Base.create('test-class', Y.Widget, [ Y.Paginator.Core ]),
            instance = new Class(),
            props = Y.Object.keys(Y.Paginator.Core.prototype),
            attrs = Y.Object.keys(Y.Paginator.Core.ATTRS),
            i;

        instance = new Class();

        for (i = props.length - 1; i >= 0; --i) {
            Y.Assert.isNotUndefined(instance[props[i]]);
        }

        for (i = attrs.length - 1; i >= 0; --i) {
            Y.Assert.isTrue(instance.attrAdded(attrs[i]));
        }
    }

}));

suite.add(new Y.Test.Case({
    name: 'Paging methods',

    'test first last paging': function () {
        var pg = new Y.Paginator.Core({
            itemsPerPage: 10,
            totalItems: 100
        });

        pg.last();

        Y.Assert.areSame(10, pg.get('page'), 'last() did not go to 10');

        pg.last();

        Y.Assert.areSame(10, pg.get('page'), 'last() did not go to 10');

        pg.first();

        Y.Assert.areSame(1, pg.get('page'), 'first() did not go to one');

        pg.first();

        Y.Assert.areSame(1, pg.get('page'), 'first() did not go to one');
    },

    'test next prev paging': function () {
        var pg = new Y.Paginator.Core({
                itemsPerPage: 10,
                totalItems: 100,
                page: 5
            }),
            currentPage = pg.get('page');

        pg.next();

        Y.Assert.areSame(currentPage + 1, pg.get('page'), 'next() did not go to current + 1');

        pg.prev();

        Y.Assert.areSame(currentPage, pg.get('page'), 'prev() did not go back to starting page');

    },

    'test direct paging': function () {
        var pg = new Y.Paginator.Core({
                itemsPerPage: 10,
                totalItems: 100,
                page: 5
            });

        pg.set('page', 6);

        Y.Assert.areSame(6, pg.get('page'), 'did not page to 6');

        pg.set('page', 2);

        Y.Assert.areSame(2, pg.get('page'), 'did not page to 2');

        pg.set('page', 8);

        Y.Assert.areSame(8, pg.get('page'), 'did not page to 8');


    },

    'test end +1 paging': function () {
        var pg = new Y.Paginator.Core({
                itemsPerPage: 10,
                totalItems: 100,
                page: 5
            });

        pg.first();
        Y.Assert.areSame(1, pg.get('page'), 'did not page to 1');
        pg.prev();
        Y.Assert.areSame(1, pg.get('page'), 'did not stay at page 1')


        pg.last();
        Y.Assert.areSame(10, pg.get('page'), 'did not page to 10');
        pg.next();
        Y.Assert.areSame(10, pg.get('page'), 'did not stay at page 10');
    },

    'test index count to page': function () {
        var pg = new Y.Paginator.Core({
                itemsPerPage: 10,
                totalItems: 100,
                page: 5
            });

        Y.Assert.areSame(41, pg.get('index'));
    }

}));


Y.Test.Runner.add(suite);


}, '@VERSION@' ,{ requires:['paginator-core', 'base-build', 'widget'] });
