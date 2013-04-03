YUI.add('paginator-tests', function (Y) {

var suite = new Y.Test.Suite("Paginator: Base");

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
        var pg = new Y.Paginator({
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
        var pg = new Y.Paginator({
                itemsPerPage: 10,
                totalItems: 100,
                page: 5
            });

        pg.page(6);
        Y.Assert.areSame(6, pg.get('page'), 'did not page to 6');

        pg.page(2);
        Y.Assert.areSame(2, pg.get('page'), 'did not page to 2');

        pg.page(8);
        Y.Assert.areSame(8, pg.get('page'), 'did not page to 8');

        pg.page();
        Y.Assert.areSame(8, pg.get('page'), 'did not stay at page 8');

    },

    'test end +1 paging': function () {
        var pg = new Y.Paginator({
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

    'test circular paging': function () {
        var pg = new Y.Paginator({
                itemsPerPage: 10,
                totalItems: 100,
                page: 5,
                circular: true
            });

        // go to last page
        pg.last();
        Y.Assert.areSame(10, pg.get('page'), 'did not page to 10');
        // go to next page from last ... page 1
        pg.next();
        Y.Assert.areSame(1, pg.get('page'), 'did not wrap to 1');
        // go to previous page from first ... page 10
        pg.prev();
        Y.Assert.areSame(10, pg.get('page'), 'did not wrap backwards to 10');
    },

    'test perPage should set page number': function () {
        var pg = new Y.Paginator({
                itemsPerPage: 10,
                totalItems: 100,
                page: 5
            });

        Y.Assert.areSame(5, pg.get('page'), 'Page is not currently set correctly.');

        pg.perPage();

        Y.Assert.areSame(10, pg.get('itemsPerPage'), 'itemsPerPage was updated');
        Y.Assert.areSame(5, pg.get('page'), 'current page was updated.');

        pg.perPage(2);

        Y.Assert.areSame(2, pg.get('itemsPerPage'), 'itemsPerPage did not update');
        Y.Assert.areSame(1, pg.get('page'), 'current page did not get updated to 1');
    },

    'test index count to page': function () {
        var pg = new Y.Paginator({
                itemsPerPage: 10,
                totalItems: 100,
                page: 5
            });

        Y.Assert.areSame(40, pg.get('index'));
        Y.Assert.areSame(41, pg.get('itemIndex'));
    },

    'test all items per page has 1 page': function () {
        var pg = new Y.Paginator({
                itemsPerPage: '*',
                totalItems: 100,
                page: 1
            });

        Y.Assert.areSame(1, pg.get('pages'));
        Y.Assert.areSame(-1, pg.get('itemsPerPage'));

        // null should fail and keep same
        pg.set('itemsPerPage', null);
        Y.Assert.areSame(-1, pg.get('itemsPerPage'), 'Items were adjusted');
    }

}));


suite.add(new Y.Test.Case({
    name: 'Paginator Widget methods',

    'test widget extending': function () {
        var pg = new Y.Paginator();

        Y.Assert.isTrue(pg instanceof Y.Widget);
    },

    'test paginator can render': function () {
        var pg = new Y.Paginator();

        Y.Assert.areSame('function', typeof pg.render);

        pg.render();
    },

    'test paging event listeners': function () {

    },

    'test to json method': function () {
        var pgConfig = {
                itemsPerPage: 10,
                totalItems: 100,
                page: 5,
                view: Y.View
            },
            pg = new Y.Paginator(pgConfig),
            json = pg.toJSON();

        Y.Assert.areSame(pgConfig.itemsPerPage, json.itemsPerPage, 'Items Per Page has changed.');
        Y.Assert.areSame(pgConfig.totalItems, json.totalItems, 'Total items has changed.');
        Y.Assert.areSame(pgConfig.page, json.page, 'Current page has changed.');
    },

    'test UI events': function () {
        function Publisher (bubbleTo) {
            this.init(bubbleTo);
        }
        Publisher.prototype = {
            init: function (bubbleTo) {
                this.addTarget(bubbleTo);
                this.attachEvents();
            }
        };
        Y.augment(Publisher, Y.EventTarget);

        var pg = new Y.Paginator({
                itemsPerPage: 10,
                totalItems: 100,
                page: 5,
                view: Y.View
            }),

            pub = new Publisher(pg);

        // wire up asserts
        pg.after('pageChange', function (e) {
            alert(pg.get('page'));
        });


        // fire controller events
        pub.fire('first');

    }
}));


Y.Test.Runner.add(suite);


}, '@VERSION@' ,{ requires:['paginator', 'base-build', 'widget', 'view'] });
