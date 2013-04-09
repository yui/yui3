YUI.add('paginator-list-tests', function (Y) {

var suite = new Y.Test.Suite("Paginator: Base");


suite.add(new Y.Test.Case({
    name: 'Paginator Core methods',


    'test creation from string': function () {
        var pg = new Y.Paginator({
                itemsPerPage: 10,
                totalItems: 1000,
                view: 'Paginator.List',
                viewConfig: {
                    url: '?pg={page}',
                    displayRange: 10
                }
            }),
            pgRendered;

        pg.render('#testbed');

        pgRendered = Y.one('.yui3-paginator');

        Y.Assert.areSame(pg.get('boundingBox'), pgRendered);
        Y.Assert.areSame(1, pgRendered.all('.yui3-paginator-control-first').size());
        Y.Assert.areSame(1, pgRendered.all('.yui3-paginator-control-last').size());
        Y.Assert.areSame(1, pgRendered.all('.yui3-paginator-control-prev').size());
        Y.Assert.areSame(1, pgRendered.all('.yui3-paginator-control-next').size());
        Y.Assert.areSame(10, pgRendered.all('.yui3-paginator-page').size());
        Y.Assert.areSame('?pg=3', pgRendered.all('.yui3-paginator-page').item(2).getAttribute('href'));

        pg.destroy();
    },

    'test creation from view instance': function () {

        var listView = new Y.Paginator.List({
                url: '?pg={page}',
                displayRange: 10,
                container: '#testbed'
            }),
            pg = new Y.Paginator({
                itemsPerPage: 10,
                totalItems: 100,
                view: listView
            }),
            pgRendered;

        pg.render('#testbed');

        pgRendered = Y.one('.yui3-paginator');

        //Y.Assert.areSame(pg.get('boundingBox'), pgRendered);
        Y.Assert.areSame(1, pgRendered.all('.yui3-paginator-control-first').size());
        Y.Assert.areSame(1, pgRendered.all('.yui3-paginator-control-last').size());
        Y.Assert.areSame(1, pgRendered.all('.yui3-paginator-control-prev').size());
        Y.Assert.areSame(1, pgRendered.all('.yui3-paginator-control-next').size());
        Y.Assert.areSame(10, pgRendered.all('.yui3-paginator-page').size());
        Y.Assert.areSame('?pg=3', pgRendered.all('.yui3-paginator-page').item(2).getAttribute('href'));

        pg.get('boundingBox').prepend('4');

        pg.destroy();
    }

}));





Y.Test.Runner.add(suite);


}, '@VERSION@' ,{ requires:['paginator', 'paginator-list', 'base-build'] });
