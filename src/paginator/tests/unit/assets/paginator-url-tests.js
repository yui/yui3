YUI.add('paginator-url-tests', function(Y) {

var suite = new Y.Test.Suite("Paginator: Core");


suite.add(new Y.Test.Case({
    name: 'Naviagion methods',

    'test navigation url generation': function() {
        var url = '/?pg={page}',
            pg = new Y.Paginator({
                itemsPerPage: 10,
                totalItems: 100,
                url: url
            });

        pg.first();
        Y.Assert.areSame('/?pg=1', pg.formatUrl(), 'incorrect url as page 1');

        pg.select(5);
        Y.Assert.areSame('/?pg=5', pg.formatUrl(), 'incorrect url as page 5');

        Y.Assert.areSame('/?pg=10', pg.formatUrl(10), 'incorrect url as page 10');

    },

    'test prev next naviagion generation': function() {
        var pg = new Y.Paginator({
            itemsPerPage: 10,
            totalItems: 100,
            page: 5,
            url: '{page}'
        });

        Y.Assert.areSame('4', pg.prevUrl(), 'did not generate the previous url');
        Y.Assert.areSame('6', pg.nextUrl(), 'did not generate the next url');

        pg.first();
        Y.Assert.isNull(pg.prevUrl());

        pg.last();
        Y.Assert.isNull(pg.nextUrl());

    }

}));


Y.Test.Runner.add(suite);


}, '@VERSION@' ,{ requires:['paginator-base'] });
