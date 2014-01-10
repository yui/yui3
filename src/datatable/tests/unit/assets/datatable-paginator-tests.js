YUI.add('datatable-paginator-tests', function(Y) {

var suite = new Y.Test.Suite("DataTable: Paginator"),
    data = [];

while (data.length < 100) {
    data.push({
        id: data.length + 1,
        name: ['a','b', 'c','d','e','f','g'][data.length % 7].toUpperCase() + ':' + data.length,
        price: Math.round((Math.random() + Math.random()) * 500) / 500,
        qty: Math.ceil(data.length * Math.random() + Math.random())
    });
}

suite.add(new Y.Test.Case({

    name: "Paginator",

    "test rowsPerPage === null shows all rows": function () {
        var dt = new Y.DataTable({
            caption: 'test rowsPerPage === null shows all rows',
            columns: ['id', 'name', 'price', 'qty'],
            data: data
        });

        dt.render();

        // get number of items in the table
        Y.Assert.areSame(100, dt.get('data').size(), 'There are not 100 rows in the table data');
        Y.Assert.areSame(100, dt.body.tbodyNode.all('tr').size(), 'There are not 100 rows in the table');

        // set rows per page
        dt.set('rowsPerPage', 10);

        // get number of items in the table
        Y.Assert.areSame(10, dt.get('data').size(true), 'There are not 10 rows in the table data');
        Y.Assert.areSame(10, dt.body.tbodyNode.all('tr').size(), 'There are not 10 rows in the table');

        // set rows per page again
        dt.set('rowsPerPage', 5);

        // get number of items in the table
        Y.Assert.areSame(5, dt.get('data').size(true), 'There are not 5 rows in the table data');
        Y.Assert.areSame(5, dt.body.tbodyNode.all('tr').size(), 'There are not 5 rows in the table');

        // set rows per page to null
        dt.set('rowsPerPage', null);

        // get number of items in the table
        Y.Assert.areSame(100, dt.get('data').size(true), 'There are not 100 rows in the table data');
        Y.Assert.areSame(100, dt.body.tbodyNode.all('tr').size(), 'There are not 100 rows in the table');

        dt.destroy();
    },

    "test paginator totalItems should reflect the number of total items in the datatable": function () {
        var dt = new Y.DataTable({
                caption: 'test paginator totalItems should reflect the number of total items in the datatable',
                columns: ['fruit'],
                data: [
                    { fruit: 'apple' },
                    { fruit: 'banana' },
                    { fruit: 'cherry' },
                    { fruit: 'date' },
                    { fruit: 'fig' },
                    { fruit: 'grape' },
                    { fruit: 'pinapple'}
                ],
                rowsPerPage: 2
            }),
            pgModel;

        dt.render();

        pgModel = dt.get('paginatorModel');

        Y.Assert.areSame(pgModel.get('totalItems'), dt.get('data').size());

        dt.addRow({ fruit: 'prune' });

        Y.Assert.areSame(pgModel.get('totalItems'), dt.get('data').size());

        dt.removeRow('1');

        Y.Assert.areSame(pgModel.get('totalItems'), dt.get('data').size());

        dt.destroy();
    },

    "test paging directing functions should update table": function () {
        var dt = new Y.DataTable({
                caption: 'test paging directing functions should update table',
                columns: ['fruit'],
                data: [
                    { fruit: 'apple' },
                    { fruit: 'banana' },
                    { fruit: 'cherry' },
                    { fruit: 'date' },
                    { fruit: 'fig' },
                    { fruit: 'grape' },
                    { fruit: 'pinapple'}
                ],
                rowsPerPage: 2
            }),

            cell;

        dt.render(); // page 1

        cell = dt.body.tbodyNode.one('td');

        Y.Assert.areSame('apple', cell.get('text'), 'First cell on page is not an apple');
        Y.Assert.areSame(2, dt.body.tbodyNode.all('tr').size(), 'There are more than 2 rows on this page');

        dt.nextPage(); // page 2

        cell = dt.body.tbodyNode.one('td');

        Y.Assert.areSame('cherry', cell.get('text'), 'First cell on page is not an apple');
        Y.Assert.areSame(2, dt.body.tbodyNode.all('tr').size(), 'There are more than 2 rows on this page');

        dt.nextPage(); // page 3

        cell = dt.body.tbodyNode.one('td');

        Y.Assert.areSame('fig', cell.get('text'), 'First cell on page is not an apple');
        Y.Assert.areSame(2, dt.body.tbodyNode.all('tr').size(), 'There are more than 2 rows on this page');

        dt.previousPage(); // page 2

        cell = dt.body.tbodyNode.one('td');

        Y.Assert.areSame('cherry', cell.get('text'), 'First cell on page is not an apple');
        Y.Assert.areSame(2, dt.body.tbodyNode.all('tr').size(), 'There are more than 2 rows on this page');

        dt.firstPage(); // page 1

        cell = dt.body.tbodyNode.one('td');

        Y.Assert.areSame('apple', cell.get('text'), 'First cell on page is not an apple');
        Y.Assert.areSame(2, dt.body.tbodyNode.all('tr').size(), 'There are more than 2 rows on this page');

        dt.lastPage(); // page 4

        cell = dt.body.tbodyNode.one('td');

        Y.Assert.areSame('pinapple', cell.get('text'), 'First cell on page is not an apple');
        Y.Assert.areSame(1, dt.body.tbodyNode.all('tr').size(), 'There are more than 2 rows on this page');

        dt.destroy();
    },

    "test paginator location as header": function () {
        var dt = new Y.DataTable({
            caption: 'test paginator location as header',
            paginatorLocation: ['header'],
            columns: ['id', 'name'],
            data: data,
            rowsPerPage: 3
        }),
        className = 'yui3-datatable-paginator';

        dt.render();

        Y.Assert.isNotNull(dt.body.get('container').previous('.' + className));
        Y.Assert.isNull(dt.body.get('container').next('.' + className));
        Y.Assert.isNull(dt.body.get('container').one('.' + className));

        dt.destroy();
    },

    "test paginator insertion into a node": function () {
        var pgNode = Y.Node.create('<div/>'),
            dt = new Y.DataTable({
                caption: 'test paginator insertion into a node',
                paginatorLocation: pgNode,
                columns: ['id', 'name'],
                data: data,
                rowsPerPage: 3
            }),
            className = 'yui3-datatable-paginator';

        Y.one('body').prepend(pgNode);
        dt.render();

        Y.Assert.areSame(1, Y.all('.' + className).size());
        Y.Assert.areSame(pgNode, Y.all('.' + className).item(0).ancestor());

        dt.destroy();
    },

    "test set page sizes with mixed values": function () {
        var dt = new Y.DataTable({
                caption: 'test set page sizes with mixed values',
                columns: ['id', 'name'],
                data: data,
                rowsPerPage: -1,
                pageSizes: 'Show All'
            }),
            className = 'yui3-datatable-paginator';

        dt.render();

        Y.Assert.areSame(1, Y.all('.' + className + ' select option').size());
        Y.Assert.areSame('Show All', Y.one('.' + className + ' select option').get('text'));

        dt.destroy();
    },

    "test custom paginator model configuration": function () {
        var dt = new Y.DataTable({
                caption: 'test custom paginator model configuration',
                columns: ['id', 'name'],
                data: data,
                rowsPerPage: 10,
                paginatorModel: {},
                paginatorModelType: Y.DataTable.Paginator.Model
            }),
            className = 'yui3-datatable-paginator';

        dt.render();

        dt.nextPage();

        Y.Assert.areSame('11', dt.body.tbodyNode.one('td').get('text'));

        dt.destroy();
    },

    "test custom paginator model": function () {
        var dt = new Y.DataTable({
                caption: 'test custom paginator model',
                columns: ['id', 'name'],
                data: data,
                rowsPerPage: 10,
                paginatorModel: new Y.DataTable.Paginator.Model({})
            }),
            className = 'yui3-datatable-paginator';

        dt.render();

        dt.nextPage();

        Y.Assert.areSame('11', dt.body.tbodyNode.one('td').get('text'));

        dt.destroy();
    },

    "test swapping the data with new data": function () {
        var dt = new Y.DataTable({
            caption: 'test swapping the data with new data',
            columns: ['id', 'name'],
            data: data,
            rowsPerPage: 10
        }),
        data2 = [];

        while (data2.length < 50) {
            data2.push({
                id: data2.length + 1,
                name: ['a','b', 'c','d','e','f','g'][data2.length % 7].toUpperCase() + ':' + data.length,
                price: Math.round((Math.random() + Math.random()) * 500) / 500,
                qty: Math.ceil(data2.length * Math.random() + Math.random())
            });
        }

        dt.render();

        // check cell data
        Y.Assert.areSame(data[0].name.toString(), dt.body.tbodyNode.all('td').item(1).get('text'));

        // go to next page
        dt.nextPage();

        // check cell data
        Y.Assert.areSame(data[10].name.toString(), dt.body.tbodyNode.all('td').item(1).get('text'));

        // load new data
        dt.set('data', data2);


        // check page is first
        Y.Assert.isFalse(dt.get('paginatorModel').hasPrevPage());
        // check cell data
        Y.Assert.areSame(data2[0].name.toString(), dt.body.tbodyNode.all('td').item(1).get('text'));

        // go to next page
        dt.nextPage();

        // check cell data
        Y.Assert.areSame(data2[10].name.toString(), dt.body.tbodyNode.all('td').item(1).get('text'));

        // go to last page
        dt.lastPage();

        // check cell data
        Y.Assert.areSame(data2[40].name.toString(), dt.body.tbodyNode.all('td').item(1).get('text'));

        // go to first page and change data
        dt.firstPage();
        dt.set('data', data);

        // check cell data
        Y.Assert.areSame(data[0].name.toString(), dt.body.tbodyNode.all('td').item(1).get('text'));

        dt.destroy();
    },

    "test clicking on the controls": function () {
        var dt = new Y.DataTable({
                caption: 'test clicking on the controls',
                columns: ['id', 'name'],
                data: data,
                rowsPerPage: 10,
                paginatorModel: new Y.DataTable.Paginator.Model({})
            }),
            className = 'yui3-datatable-paginator',
            pgNode,
            firstBtn,
            lastBtn,
            prevBtn,
            nextBtn,
            submitBtn,
            selectNode;

        dt.render();

        pgNode = Y.one('.' + className);
        firstBtn = pgNode.one('.' + className + '-control-first');
        lastBtn  = pgNode.one('.' + className + '-control-last');
        prevBtn  = pgNode.one('.' + className + '-control-prev');
        nextBtn  =  pgNode.one('.' + className + '-control-next');
        submitBtn = pgNode.one('form button');
        selectNode = pgNode.one('select');

        // click next
        nextBtn.simulate('click');

        // test cell data
        Y.Assert.areSame(data[10].name.toString(), dt.body.tbodyNode.all('td').item(1).get('text'), 'a');

        // click prev
        prevBtn.simulate('click');

        // test cell data
        Y.Assert.areSame(data[0].name.toString(), dt.body.tbodyNode.all('td').item(1).get('text'), 'b');

        // click last
        lastBtn.simulate('click');

        // test cell data
        Y.Assert.areSame(data[90].name.toString(), dt.body.tbodyNode.all('td').item(1).get('text'), 'c');

        // click first
        firstBtn.simulate('click');

        // test cell data
        Y.Assert.areSame(data[0].name.toString(), dt.body.tbodyNode.all('td').item(1).get('text'), 'd');

        // change input number and submit
        submitBtn.previous('input').set('value', 4);
        submitBtn.ancestor('form').simulate('submit');

        // test cell data
        Y.Assert.areSame(data[30].name.toString(), dt.body.tbodyNode.all('td').item(1).get('text'), 'e');

        // change rows per page
        selectNode.focus();
        selectNode.set('selectedIndex', 1);
        selectNode.simulate('change');
        selectNode.blur();

        // test number of rows per page
        Y.Assert.areSame(50, dt.body.tbodyNode.all('tr').size(), 'f');
        // test cell data
        Y.Assert.areSame(data[0].name.toString(), dt.body.tbodyNode.all('td').item(1).get('text'), 'g');

        dt.destroy();
    },

    'test string availability for internationalization': function () {

        var dt = new Y.DataTable({
                caption: 'test language display in english',
                columns: ['id', 'name'],
                data: data,
                rowsPerPage: 10,
                paginatorModel: new Y.DataTable.Paginator.Model({})
            }),
            i18n = Y.Intl.getLang('datatable-paginator'),
            container,
            perPageNode,
            showAllNode;

        // find and eval "Show All" string
        // English

        Y.Intl.setLang('datatable-paginator', 'fr');

        dt.render();

        container = dt.get('boundingBox');

        perPageNode = container.one('.yui3-datatable-paginator-per-page select');

        showAllNode = perPageNode.one('option:last-child');

        Y.Assert.areSame('Show All', showAllNode.get('text'));

        dt.destroy();


        // French
        Y.use('lang/datatable-paginator_fr', function(Y) {
            Y.Intl.setLang('datatable-paginator', 'fr');

            dt = new Y.DataTable({
                caption: 'test language display in french',
                columns: ['id', 'name'],
                data: data,
                rowsPerPage: 10,
                paginatorModel: new Y.DataTable.Paginator.Model({})
            });

            dt.render();

            container = dt.get('boundingBox');

            perPageNode = container.one('.yui3-datatable-paginator-per-page select');

            showAllNode = perPageNode.one('option:last-child');

            Y.Assert.areSame('Afficher tout', showAllNode.get('text'));

            // Unset any changes we made
            Y.Intl.setLang('datatable-paginator', i18n);

            dt.destroy();

        });

    }

}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['datatable', 'datatable-paginator', 'node-event-simulate', 'test']});
