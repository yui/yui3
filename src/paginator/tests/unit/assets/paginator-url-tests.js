YUI.add('paginator-url-tests', function (Y) {


var suite = new Y.Test.Suite("Paginator: URL");


suite.add(new Y.Test.Case({
    name: 'Paginator Core methods',

    'test url formating': function () {
        var pg = new Y.Paginator({
            itemsPerPage: 10,
            totalItems: 100,
            page: 5,
            pageUrl: '?pg={page}'
        });

        Y.Assert.areSame('?pg=5', pg.formatPageUrl(), 'Could not format current page.');

        Y.Assert.areSame('?pg=10', pg.formatPageUrl(10), 'Could not format to a given page.');

        Y.Assert.areSame('?pg=4', pg.prevPageUrl(), 'Could not format the previous page url.');

        Y.Assert.areSame('?pg=6', pg.nextPageUrl(), 'Could not format the next page url.');
    },

    'test url formatting when no url is present': function () {
        var pg = new Y.Paginator({
                itemsPerPage: 10,
                totalItems: 100,
                page: 5
            });

        Y.Assert.isNull(pg.formatPageUrl());
    },

    'test url formating when at end of range': function () {
        var pg = new Y.Paginator({
                itemsPerPage: 10,
                totalItems: 100,
                page: 5,
                pageUrl: '?pg={page}'
            });

        pg.set('page', 1);
        Y.Assert.isNull(pg.prevPageUrl());

        pg.set('page', pg.get('totalPages'));
        Y.Assert.isNull(pg.nextPageUrl());
    }

}));


Y.Test.Runner.add(suite);


}, '@VERSION@' ,{ requires:['paginator-url'] });
