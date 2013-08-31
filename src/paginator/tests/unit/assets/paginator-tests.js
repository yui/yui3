YUI.add('paginator-tests', function (Y) {


var suite = new Y.Test.Suite("Paginator");


suite.add(new Y.Test.Case({
    name: 'Paginator Core methods',

    'test next prev paging': function () {
        var pg = new Y.Paginator({
                itemsPerPage: 10,
                totalItems: 100,
                page: 5
            }),
            currentPage = pg.get('page');

        pg.nextPage();

        Y.Assert.areSame(currentPage + 1, pg.get('page'), 'nextPage() did not go to current + 1');

        pg.prevPage();

        Y.Assert.areSame(currentPage, pg.get('page'), 'prevPage() did not go back to starting page');

    },

    'test event name': function () {
        var test = this,
            pg = new Y.Paginator({
                itemsPerPage: 10,
                totalItems: 100
            });

        pg.after('pageChange', function (e) {
            Y.Assert.areSame('paginator:pageChange', e.type);
        });

        pg.nextPage();
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

        pg.set('page', 1);
        Y.Assert.areSame(1, pg.get('page'), 'did not page to 1');

        pg.prevPage();
        Y.Assert.areSame(1, pg.get('page'), 'did not stay at page 1')


        pg.set('page', pg.get('totalPages'));
        Y.Assert.areSame(10, pg.get('page'), 'did not page to 10');

        pg.nextPage();
        Y.Assert.areSame(10, pg.get('page'), 'did not stay at page 10');
    },

    'test all items per page has 1 page': function () {
        var pg = new Y.Paginator({
                itemsPerPage: -1,
                totalItems: 100,
                page: 1
            });

        Y.Assert.areSame(1, pg.get('totalPages'));
        Y.Assert.areSame(-1, pg.get('itemsPerPage'));

    }

}));


Y.Test.Runner.add(suite);


}, '@VERSION@' ,{ requires:['paginator'] });
