YUI.add('paginator-url-tests', function (Y) {


var suite = new Y.Test.Suite("Paginator: URL");


suite.add(new Y.Test.Case({
    name: 'Paginator Core methods',

    'test url formating': function () {
        var pg = new Y.Paginator({
            itemsPerPage: 10,
            totalItems: 100,
            page: 5,
            url: '?pg={page}'
        });

        Y.Assert.areSame('?pg=5', pg.formatPageUrl());

        Y.Assert.areSame('?pg=10', pg.formatPageUrl(10));

        Y.Assert.areSame('?pg=4', pg.prevPageUrl());

        Y.Assert.areSame('?pg=6', pg.nextPageUrl());
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
                url: '?pg={page}'
            });

        pg.firstPage();
        Y.Assert.isNull(pg.prevPageUrl());

        pg.lastPage();
        Y.Assert.isNull(pg.nextPageUrl());
    }

}));


Y.Test.Runner.add(suite);


}, '@VERSION@' ,{ requires:['paginator-url'] });
