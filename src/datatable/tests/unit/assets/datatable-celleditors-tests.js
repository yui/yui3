YUI.add('datatable-celleditors-tests', function(Y) {


    var suite = new Y.Test.Suite('datatable-celleditors'),
        Assert = Y.Test.Assert,
        areSame = Assert.areSame,
        isFalse = Assert.isFalse,
        isTrue = Assert.isTrue,
        isNull = Assert.isNull,

        tearDown = function () {
             if (this.dt) {
                this.dt.destroy();
                this.dt.data.invoke('destroy');
                this.dt.data.destroy();
                delete this.dt;
            }
        },

        fireKey = function(ceditor, key, opts) {
            opts = Y.merge({keyCode: key}, opts);

            ceditor.simulate('keydown', opts);
            ceditor.simulate('keypress', opts);
            ceditor.simulate('keyup', opts);
        },

        inputKey = function(ceditor, value, key, opts) {
            ceditor.focus();
            ceditor.set('value', value);
            fireKey(ceditor, key, opts);
        },

        makeDT = function (config_arg) {
            config_arg = config_arg || {};

            var someData = [
                    {sid: 10, sname: 'Sneakers', sopen: 0, stype: 0, stock: 0, sprice: 59.93, shipst: 's', sdate: new Date(2009, 3, 11)},
                    {sid: 11, sname: 'Varnished Cane Toads', sopen: 1, stype: 10, stock: 2, shipst: 'u', sprice: 17.49, sdate: new Date(2009, 4, 12)},
                    {sid: 12, sname: 'JuJu Beans', sopen: 0, stype: 20, stock: 1, sprice: 1.29, shipst: 's', sdate: new Date(2009, 5, 13)},
                    {sid: 13, sname: 'Tent Stakes', sopen: 1, stype: 30, stock: 1, sprice: 7.99, shipst: 'n', sdate: new Date(2010, 6, 14)},
                    {sid: 14, sname: 'Peanut Butter', sopen: 0, stype: 40, stock: 0, sprice: 3.29, shipst: 'e', sdate: new Date(2011, 7, 15)},
                    {sid: 15, sname: 'Garbage Bags', sopen: 1, stype: 50, stock: 2, sprice: 17.95, shipst: 'r', sdate: new Date(2012, 8, 18)}
                ],

                //
                // Define some Arrays / Object Hashes to be used by formatters / editor options ...
                //
                stypes = [
                    {value: 0, text: 'Standard'},
                    {value: 10, text: 'Improved'},
                    {value: 20, text: 'Deluxe'},
                    {value: 30, text: 'Better'},
                    {value: 40, text: 'Subpar'},
                    {value: 50, text: 'Junk'}
                ],

                shipTypes = [
                     {value: 's', text: 'Shipped'},
                     {value: 'u', text: 'Unknown'},
                     {value: 'n', text: 'Not Shipped'},
                     {value: 'e', text: 'Expedited'},
                     {value: 'r', text: 'Returned'}
                ],
                stock = [{value: 0, text: 'No '}, {value: 1, text: 'Yes '}, {value: 2, text: 'B/O '}],
                sopen =  [{value: 0, text: 'No'}, {value: 1, text: 'Yes'}],


                colsEditors = [
                    {key: 'sid', editable: false},
                    {key: 'sopen', editor: 'inlineAC', editorConfig: {autocompleteConfig: {source: sopen, queryDelay: 0}}},
                    {key: 'sname'},
                    {key: 'sdesc'},
                    {key: 'stype', editor: 'inlineAC', lookupTable: stypes, editorConfig: {autocompleteConfig: {queryDelay: 0}}},
                    {key: 'stock', editor: 'inlineAC', editorConfig: {lookupTable: stock, autocompleteConfig: {queryDelay: 0}}},
                    {key: 'sprice', editor: 'inlineNumber', editorConfig: {numberFormat: {decimalSeparator: ','}}},
                    {key: 'shipst', editor: 'inlineAC', lookupTable: shipTypes},
                    {key: 'sdate', editor: 'inlineDate'}
                ];

            // enlarge the dataset
            Y.Array.each(someData, function(d, di) {
                d.sdesc = 'Description for Item ' + d.sid + ' : ' + d.sname;
            });

            return new Y.DataTable(Y.merge({
                columns: colsEditors,
                data: someData,
                defaultEditor: 'inline',
                editorOpenAction: 'click',
                editable: true
            }, config_arg)).render('#dtable');
        };


    suite.add(new Y.Test.Case({
        name: 'datatable-celleditors : basic setup and configuration of inlines',

        setUp: function() {
            this.dt = makeDT();
        },
        tearDown: function() {
            tearDown.call(this);
        },

        'should be a class': function() {
            Assert.isFunction(Y.DataTable.Editable);
        },
        'each inline should be an object': function() {
            Assert.isObject(Y.DataTable.Editors);
            Assert.isObject(Y.DataTable.Editors.inline);
            Assert.isObject(Y.DataTable.Editors.inlineNumber);
            Assert.isObject(Y.DataTable.Editors.inlineDate);
            Assert.isObject(Y.DataTable.Editors.inlineAC);
        },
        'inline editor should be a View': function() {
            var dt = this.dt,
                ce = dt.getCellEditor('sopen');

            Assert.isInstanceOf(Y.View, ce, 'editor is not an instanceof Y.View');
            Assert.isInstanceOf(Y.DataTable.BaseCellEditor, ce, 'editor is not an instance of BaseCellEditor');
        },
        'check destructor': function() {
            var dt = this.dt,
                ce = dt.getCellEditor('sopen');

            ce.destroy();

            isNull(ce._subscr, 'subscribers should be null');

        }

    }));



    suite.add(new Y.Test.Case({
        name: 'datatable-celleditors : check inlineNumber',
        setUp: function() {
            this.dt = makeDT();
        },
        tearDown: function() {
            tearDown.call(this);
        },
        'row index 2, column 6 (sprice) - inlineNumber valid': function() {
            var dt = this.dt,
                oe, inp;

            dt.getCell([2,6]).simulate('click');
            oe = dt._openEditor;
            inp = oe._inputNode;
            isTrue(oe.get('active'), 'cell editor col 6 should be active');


            inputKey(inp, '9876,5', 13);
            isFalse(oe.get('active'), 'cell editor col 6 should be closed');
            areSame(9876.5, oe.get('value'));
        },
        'row index 2, column 6 (sprice) - inlineNumber valid via saveEditor': function() {
            var dt = this.dt,
                oe, inp;

            // open the editor
            dt.getCell([2,6]).simulate('click');
            oe = dt._openEditor;
            inp = oe._inputNode;
            isTrue(oe.get('active'), 'cell editor col 6 should be active');


            //inputKey(inp,'9876.5',13);
            oe.saveEditor(9876.5);
            isFalse(oe.get('active'), 'cell editor col 6 should be closed');
            areSame(9876.5, oe.get('value'));
        },
        'row index 2, column 6 (sprice) - inlineNumber invalid': function() {
            var dt = this.dt,
                oe, inp;

            // open the editor
            dt.getCell([2,6]).simulate('click');
            oe = dt._openEditor;
            inp = oe._inputNode;
            isTrue(oe.get('active'), 'cell editor col 6 should be active');


            inputKey(inp, 'abcdefg', 13);
            isTrue(oe.get('active'), 'cell editor col 6 should have refused to close');
            isTrue(inp.ancestor().hasClass('yui3-datatable-celleditor-error'), 'input box should show error');
            areSame(1.29, oe.get('value'));
            fireKey(inp, 27);
            isFalse(oe.get('active'), 'cell editor col 6 should close when escaped');
        },
        'row index 2, column 6 (sprice) - inlineNumber invalid via saveEditor': function() {
            var dt = this.dt,
                oe, inp;

            // open the editor
            dt.getCell([2,6]).simulate('click');
            oe = dt._openEditor;
            inp = oe._inputNode;
            isTrue(oe.get('active'), 'cell editor col 6 should be active');

            //inputKey(inp,'abcdefg',13);
            oe.saveEditor('abcdefg');
            isTrue(oe.get('active'), 'cell editor col 6 should have refused to close');
            isTrue(inp.ancestor().hasClass('yui3-datatable-celleditor-error'), 'input box should show error');
            areSame(1.29, oe.get('value'));
            fireKey(inp, 27);
            isFalse(oe.get('active'), 'cell editor col 6 should close when escaped');
        }

    }));


    suite.add(new Y.Test.Case({
        name: 'datatable-celleditors : check inlineDate',
        setUp: function() {
            this.dt = makeDT();
        },
        tearDown: function() {
            tearDown.call(this);
        },
        'row index 2, column 8 (sdate) - inlineDate valid': function() {
            var dt = this.dt,
                    oe, inp,
                    date = new Date(2013,5,13);

            // open the editor
            dt.getCell([2, 8]).simulate('click');
            oe = dt._openEditor;
            inp = oe._inputNode;
            isTrue(oe.get('active'), 'cell editor col 8 should be active');

            areSame('06/13/09', inp.get('value'), 'formatter did not work');

            inputKey(inp, Y.DataType.Date.format(date, {format: '%x'}), 13);
            isFalse(oe.get('active'), 'cell editor col 8 should be closed');
            isTrue(Y.Lang.isDate(oe.get('value')));
            isTrue(Y.Date.areEqual(date , oe.get('value')), 'Value should be in table cell');
            isTrue(Y.Date.areEqual(date, dt.getRecord(2).get('sdate')), 'Value should have been stored');

        },
        'row index 2, column 8 (sdate) - inlineDate valid via saveEditor': function() {
            var dt = this.dt,
                oe, inp;

            // open the editor
            dt.getCell([2, 8]).simulate('click');
            oe = dt._openEditor;
            inp = oe._inputNode;
            isTrue(oe.get('active'), 'cell editor col 8 should be active');

            // prepFn should format as 06/13/09
            areSame('06/13/09', inp.get('value'), 'formatter did not work');

            //inputKey(inp,'2013-01-12',13);
            oe.saveEditor('09/11/2011');
            isFalse(oe.get('active'), 'cell editor col 8 should be closed');
            isTrue(Y.Lang.isDate(oe.get('value')));
        },
        'row index 2, column 8 (sdate) - inlineDate invalid': function() {
            var dt = this.dt,
                oe, inp;

            // open the editor
            dt.getCell([2, 8]).simulate('click');
            oe = dt._openEditor;
            inp = oe._inputNode;
            isTrue(oe.get('active'), 'cell editor col 8 should be active');

            // prepFn should format as 06/13/09
            areSame('06/13/09', inp.get('value'), 'formatter did not work');

            inputKey(inp, 'abc2013-01-12', 13);
            isTrue(oe.get('active'), 'cell editor col 8 should remain open until fixed');
            areSame('06/13/2009', Y.Date.format(oe.get('value'), {format: '%m/%d/%Y'}));
        }


    }));
    suite.add(new Y.Test.Case({
        name: 'datatable-celleditors : check inlineAC',
        setUp: function() {
            this.dt = makeDT();
        },
        tearDown: function() {
            tearDown.call(this);
        },
        'check selecting item from list': function() {
            var dt = this.dt;

            dt.openCellEditor(dt.getCell([0, 4]));
            var ed = dt.getCellEditor('stype')._container;
            ed.set('value', 'Im');
            ed.ac._onInputValueChange({newVal: 'Im'});
            ed.ac.selectItem(Y.all('.yui3-aclist-item').item(2));
            // Since the table is refreshed, the td has to be fetched again
            areSame(20, dt.data.item(0).get('stype'), 'The internal value (20) for Improved should have been saved');
            areSame('20', dt.getCell([0, 4]).getHTML());
        },
        'check changing column def': function() {
            var dt = this.dt,
                cols = dt.get('columns');


            cols[4] = {key: 'stype', editor: 'inlineAC', editorConfig: {autocompleteConfig: {source: [
                {value: 0, text: 'xStandard'},
                {value: 10, text: 'xImproved'},
                {value: 20, text: 'xDeluxe'},
                {value: 30, text: 'xBetter'},
                {value: 40, text: 'xSubpar'},
                {value: 50, text: 'xJunk'}
            ], queryDelay: 0}}};

            dt.set('columns', cols);

            dt.openCellEditor(dt.getCell([0, 4]));
            var ed = dt.getCellEditor('stype')._container;
            ed.set('value', 'xIm');
            ed.ac._onInputValueChange({newVal: 'xIm'});
            ed.ac.selectItem(Y.all('.yui3-aclist-item').item(3));
            // Since the table is refreshed, the td has to be fetched again
            areSame('30', dt.getCell([0, 4]).getHTML());

        }

    }));


    Y.Test.Runner.add(suite);

}, '', {requires: ['test', 'node-event-simulate', 'datatable-celleditors']});
