YUI.add('paginator-tests', function (Y) {


var suite = new Y.Test.Suite("Paginator");


suite.add(new Y.Test.Case({
    name: "Class extension",

    testClassExtension: function () {
        var Class = Y.Paginator,
            instance = new Class(),
            props = Y.Object.keys(Y.Paginator.prototype),
            attrs = Y.Object.keys(Y.Paginator.ATTRS),
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
    name: 'Paginator Core methods',

    'test first last paging': function () {
        var pg = new Y.Paginator({
            itemsPerPage: 10,
            totalItems: 100
        });

        pg.lastPage();

        Y.Assert.areSame(10, pg.get('page'), 'last() did not go to 10');

        pg.lastPage();

        Y.Assert.areSame(10, pg.get('page'), 'last() did not go to 10');

        pg.firstPage();

        Y.Assert.areSame(1, pg.get('page'), 'first() did not go to one');

        pg.firstPage();

        Y.Assert.areSame(1, pg.get('page'), 'first() did not go to one');
    },

    'test next prev paging': function () {
        var pg = new Y.Paginator({
                itemsPerPage: 10,
                totalItems: 100,
                page: 5
            }),
            currentPage = pg.get('page');

        pg.nextPage();

        Y.Assert.areSame(currentPage + 1, pg.get('page'), 'next() did not go to current + 1');

        pg.prevPage();

        Y.Assert.areSame(currentPage, pg.get('page'), 'prev() did not go back to starting page');

    },

    'test direct paging': function () {
        var pg = new Y.Paginator({
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
        var pg = new Y.Paginator({
                itemsPerPage: 10,
                totalItems: 100,
                page: 5
            });

        pg.firstPage();
        Y.Assert.areSame(1, pg.get('page'), 'did not page to 1');

        pg.prevPage();
        Y.Assert.areSame(1, pg.get('page'), 'did not stay at page 1')


        pg.lastPage();
        Y.Assert.areSame(10, pg.get('page'), 'did not page to 10');

        pg.nextPage();
        Y.Assert.areSame(10, pg.get('page'), 'did not stay at page 10');
    },

    'test continuous paging': function () {
        var pg = new Y.Paginator({
                itemsPerPage: 10
            });

        pg.firstPage();
        Y.Assert.areSame(1, pg.get('page'), 'did no page to 1');

        pg.nextPage();
        Y.Assert.areSame(2, pg.get('page'), 'did no page to 2');

        pg.lastPage();
        Y.Assert.areSame(3, pg.get('page'), 'did not page to 3');
    },

    'test all items per page has 1 page': function () {
        var pg = new Y.Paginator({
                itemsPerPage: '*',
                totalItems: 100,
                page: 1
            });

        Y.Assert.areSame(1, pg.get('totalPages'));
        Y.Assert.areSame(-1, pg.get('itemsPerPage'));

        // null should fail and keep same
        pg.set('itemsPerPage', null);
        Y.Assert.areSame(-1, pg.get('itemsPerPage'), 'Items were adjusted');
    }

}));


Y.Test.Runner.add(suite);


}, '@VERSION@' ,{ requires:['paginator'] });
