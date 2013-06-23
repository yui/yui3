YUI.add('datatable-editable-tests', function(Y) {

    var suite = new Y.Test.Suite('datatable-editable'),
        Assert = Y.Test.Assert,
        areSame = Assert.areSame,
        isFalse = Assert.isFalse,
        isTrue = Assert.isTrue,
        isNull = Assert.isNull,

        fireKey = function(ceditor, key, opts) {
            opts = Y.merge({keyCode: key}, opts);

            ceditor.simulate('keydown', opts);
            ceditor.simulate('keypress', opts);
            ceditor.simulate('keyup', opts);
        },

        inputKey = function(ceditor,value,key) {
            ceditor.focus();
            ceditor.set('value',value);
            fireKey(ceditor,key);
        },

        checkPosition = function(dt, row, col, skip ) {

            var td = dt.getCell([row, col]),
                ed = Y.one('.yui3-datatable-celleditor-input'),
                regEd = ed.get('region'),
                regTd = td.get('region'),
                nextCell;
            areSame('block', ed.ancestor().getStyle('display'), 'Editor should be visible.: [' + row + ':' + col + ']');

            areSame(Math.round(regTd.top), Math.round(regEd.top), 'tops should match: [' + row + ':' + col + ']');
            areSame(Math.round(regTd.left), Math.round(regEd.left), 'lefts should match: [' + row + ':' + col + ']');
            nextCell = dt.getCell(td,[1,1]);
            if (nextCell) {
                regTd = nextCell.get('region');
                areSame(Math.round(regTd.top), Math.round(regEd.bottom), 'bottom should match top of next: [' + row + ':' + col + ']');
                areSame(Math.round(regTd.left + 1), Math.round(regEd.right), 'right edge should overlap left edge of next: [' + row + ':' + col + ']');
            } else isTrue(skip, 'there should be a further cell to the right or bottom');
        },

        openEditorAt = function (dt, row, col) {
            var td = dt.getCell([row, col]);
            td.simulate('click');

            isTrue(dt._openEditor.get('active'),'cell editor col 1 should be active: [' + row + ':' + col + ']')
            areSame(1, Y.all('.yui3-datatable-celleditor-input').size(),'There should be one editor: [' + row + ':' + col + ']');
            checkPosition(dt, row, col);
        },

        makeDT = function (config_arg ) {
            config_arg = config_arg || {};

            var someData = [
                {sid:10, sname:'Sneakers', sopen:0, stype:0, stock:0, sprice:59.93, shipst:'s', sdate:new Date(2009,3,11)},
                {sid:11, sname:'Varnished Cane Toads', sopen:1,  stype:10, stock:2, shipst:'u', sprice:17.49, sdate:new Date(2009,4,12)},
                {sid:12, sname:'JuJu Beans', sopen:0,  stype:20, stock:1, sprice:1.29, shipst:'s', sdate:new Date(2009,5,13)},
                {sid:13, sname:'Tent Stakes', sopen:1,  stype:30, stock:1, sprice:7.99, shipst:'n', sdate:new Date(2010,6,14)},
                {sid:14, sname:'Peanut Butter', sopen:0,  stype:40, stock:0, sprice:3.29, shipst:'e', sdate:new Date(2011,7,15)},
                {sid:15, sname:'Garbage Bags', sopen:1, stype:50,  stock:2, sprice:17.95, shipst:'r', sdate:new Date(2012,8,18)}
            ];

            // enlarge the dataset
            Y.Array.each(someData,function(d){
                d.sdesc = 'Description for Item ' + d.sid + ' : ' + d.sname;
            });

            var basic_config = {
                columns: [
                    {key:'sid',  editable:false},
                    {key:'sopen'},
                    {key:'sname'},
                    {key:'sdesc'},
                    {key:'stype'},
                    {key:'stock'},
                    {key:'sprice'},
                    {key:'sdate'}
                ],
                data:    someData
            };


            return new Y.DataTable(Y.merge(basic_config,config_arg)).render('#dtable');
        };


    suite.add(new Y.Test.Case({
        name: 'DataTable-Editable : basic setup and instance',

        setUp : function () {
            // {sid: sname: sdesc: sopen:0, stype:0, stock:0, sprice:, shipst:'s', sdate: },
            this.dt = makeDT();
        },

        tearDown : function () {
            if(this.dt) {
                this.dt.destroy();
            }
            delete this.dt;
        },

        'should be a class': function() {
            Assert.isFunction(Y.DataTable.Editable);
        },

        'should instantiate as a DT instance': function() {
            var dt = this.dt;
            Assert.isInstanceOf( Y.DataTable, dt, 'Not an instanceof Y.DataTable');
        },

        'check ATTR default values' : function(){
            var dt = this.dt;
            isFalse(dt.get('editable'), "editable default not false" );
            areSame('inline', dt.get('defaultEditor'), "default editor not inline" );
            areSame('dblclick', dt.get('editorOpenAction'), "default editorOpenAction not 'dblclick'" );
            Y.ArrayAssert.itemsAreSame([13, 113] , dt.get('editorOpenKey'), "default open keys should be 13 (enter) and 113 (F2)");
            isTrue(dt.get('wrapAroundNavigation'), "wrapAroundNavigation should be true");
        },

        'check ATTR editable setting' : function(){
            var dt = this.dt;
            isFalse( dt.get('editable'), "editable not initially false" );

            areSame( 0, Y.Object.size(dt.getCellEditors()), "No editors initially" );

            dt.set('editable',true);
            isTrue( dt.get('editable'), "set editable to true" );
            areSame( 7, Y.Object.size(dt.getCellEditors()), "All columns should have the default editor set" );
            areSame(1, Y.Object.size(dt._commonEditors), "There should be only one common editor" );

            dt.set('editable',false);
            isFalse( dt.get('editable'), "set editable false" );
            areSame( 0, Y.Object.size(dt.getCellEditors()), "No editors initially" );
            areSame( 0, Y.Object.size(dt._commonEditors), "There should be no common editor" );

        },

        'check ATTR editorOpenAction setting' : function(){
            var dt = this.dt;
            isFalse( dt.get('editable'), "editable not initially false" );
            areSame( 'dblclick', dt.get('editorOpenAction'), "default editorOpenAction not dblclick" );


            dt.set('editable',true);
            isTrue( dt.get('editable'), "set editable to true" );

            areSame('dblclick', dt.get('editorOpenAction'), "default editorOpenAction not dblclick" );

            dt.set('editorOpenAction',null);
            isNull(dt.get('editorOpenAction'), "set editorOpenAction failed on null" );

            dt.set('editorOpenAction', 1);
            isNull(dt.get('editorOpenAction'), "set editorOpenAction failed on 1" );

            dt.set('editorOpenAction','click');
            areSame( 'click', dt.get('editorOpenAction'), "set editorOpenAction to click failed" );

        },

        'check ATTR defaultEditor setting' : function(){
            var dt = this.dt;
            isFalse( dt.get('editable'), "editable not initially false" );
            areSame('inline', dt.get('defaultEditor'), "default defaultEditor not inline" );

            dt.set('editable',true);
            areSame( 7, Y.Object.size(dt.getCellEditors()), "No editors yet" );

            dt.set('defaultEditor',null);
            isNull( dt.get('defaultEditor'), "set defaultEditor not null" );

            dt.set('defaultEditor','inline');
            areSame( 'inline', dt.get('defaultEditor'), "set defaultEditor failed on inline" );

            areSame( 7, Y.Object.size(dt.getCellEditors()), "setup default editors count not 7" );
            areSame(1, Y.Object.size(dt._commonEditors), "There should be only one common editor" );

            Assert.isInstanceOf( Y.DataTable.Editors.inline , dt._commonEditors.inline, "common editor 0 should be inline");

        },
        'check ATTR editorOpenKey setting': function () {
            var dt = this.dt;
            dt.set('editable',true);

            Y.ArrayAssert.itemsAreSame([13, 113] , dt.get('editorOpenKey'), "default open keys should be 13 (enter) and 113 (F2)");
            dt.set('editorOpenKey', 13);
            Y.ArrayAssert.itemsAreSame([13] , dt.get('editorOpenKey'), "default open keys should only be 13 (enter)");
            dt.set('editorOpenKey', false);
            isFalse(dt.get('editorOpenKey'), 'editor open by key should be disabled');

        },

        'check destructor' : function(){
            var dt = this.dt;
            dt.set('editable',true);
            isTrue( dt.get('editable'), "set editable to true" );

            dt.destroy();
            isFalse( dt.get('editable'), "editable not false" );

            areSame(0, Y.Object.size(dt._commonEditors), "_commonEditors not {}" );
            Y.Object.each(dt._columnMap, function (col, colKey) {
                Assert.isUndefined(col._editorInstance, 'Editor instance for ' + colKey + ' still there');
            });
            isNull( dt._openEditor, "_openEditor not null" );
            isNull( dt._editorNode, "_editorNode not null" );
            areSame(0, Y.all('.yui3-datatable-celleditor-input').size(),'There should be no editors left behind');

        }


    }));


    suite.add(new Y.Test.Case({
        name: 'DataTable-Editable : check public methods ~ default as inline',

        setUp : function () {
            // {sid: sname: sdesc: sopen:0, stype:0, stock:0, sprice:, shipst:'s', sdate: },
            this.dt = makeDT({
                defaultEditor:  'inline',
                editorOpenAction:   'click',
                editable:       true
            });

        },

        tearDown : function () {
            if(this.dt) {
                this.dt.destroy();
            }
            delete this.dt;
        },

        'check editor counts' : function(){
            var dt = this.dt;

            isTrue( dt.get('editable'), "set editable to true" );

            areSame(7, Y.Object.size(dt.getCellEditors()), 'there should be 7 cell editors');
            areSame(1, Y.Object.size(dt._commonEditors) , 'there should be only one (the default) editor for all');

            isNull( dt.getCellEditor('sid'),'column 0 (sid) editor should be null');
            areSame( Y.DataTable.Editors.inline , dt.getCellEditor('sopen').constructor, "common editor 0 should be inline");


        },

        'check public methods - open/hide cell editors' : function(){
            var dt = this.dt;

            dt.getCell([0,0]).simulate('click');
            isNull(dt._openEditor, 'editor should not open on non-editable cell');

            dt.openCellEditor(dt.getCell([0,0]));
            isNull(dt._openEditor, 'editor should not open on non-editable cell');

            // on column 1, open an editor, then hide it
            openEditorAt(dt, 0,1);


            dt.hideCellEditor();
            isNull(dt._openEditor,'cell editor col 1 should be closed');
            isFalse(dt.getCellEditor('sopen').get('active'),'cell editor col 1 should be closed');

            // open column 1 again, then click another cell ... col 1 should hide, col 6 should be active
            dt.getCell([0,1]).simulate('click');
            isTrue(dt._openEditor.get('active'),'cell editor col 1 should be active');
            var ce = dt.getCellEditor('sopen');
            isTrue(ce.get('active'),'cell editor col 1 should be active');

            dt.getCell([0,6]).simulate('click');
            isTrue(dt._openEditor.get('active'),'cell editor col 6 should be active');
            areSame(59.93, dt._openEditor.get('value'),'cell editor col 6 value should be 59.93');

            /* Since there can only be one cell editor open at a time, I am not sure why this is needed
            // check hideallcelleditors
            dt.hideAllCellEditors();
            isFalse(dt.getCellEditor('sdesc').get('active'),'cell editor col 3 should be closed');
            isNull(dt._openEditor,'open editor should be null');
            isFalse(dt.getCellEditor('sprice').get('active'),'cell editor col 3 should be closed');
            */
            // select row 3, column 4 ... stype value=30
            dt.set('editable',false);

            dt.set('editable',true);

            var td4 = dt.getCell([3,4]);

            td4.simulate('click');
            areSame('30',td4.getHTML(),'row 3, col 4 should be "30"');
            areSame(td4.get('text'),dt._editorNode.getHTML());

            // check getColumnXXX methods
            areSame('stype',dt.getColumnByTd(td4).key,'getColumnByTd should be sdesc');
            areSame(Y.Object.size(dt.get('columns')[4]),
                Y.Object.size(dt.getColumnByTd(td4)),'getColumnByTd should be same as columns def');
            areSame('stype',dt.getColumnNameByTd(td4),'getColumnByTd should be sdesc');


        },




        'check initial setup - inline row 0' : function(){
            var dt = this.dt;

            // column 0 of any row is uneditable, make sure ...
            dt.getCell([0,0]).simulate('click');
            isNull(dt._openEditor,'cell editor col 0 should be null');

            // column 1 of row 0 should open ...
            dt.getCell([0,1]).simulate('click');
            Assert.isNotNull(dt._openEditor,'cell editor col 1 should be open');
            isTrue(dt._openEditor.get('active'),'cell editor col 1 should be active');

            areSame(0,dt._openEditor.get('value'),'initial editor value of col 1 should be 0');

            // ESC should close
            fireKey(dt._openEditor.get('container'), 27);
            isNull(dt._openEditor,'cell editor col 1 should be closed');

        },

        'check ATTR editorOpenAction setting' : function(){
            var dt = this.dt;

            isTrue( dt.get('editable'), "set editable to true" );


        },
        'check navigation': function () {
            var dt = this.dt;
            openEditorAt(dt, 0, 1);
            var ed = Y.one('.yui3-datatable-celleditor-input')



            fireKey(ed, 39,{ctrlKey:true});  // Ctrl-right
            checkPosition(dt, 0,2);

            fireKey(ed, 40,{ctrlKey:true});  // Ctrl-down
            checkPosition(dt, 1,2);

            fireKey(ed, 37,{ctrlKey:true});  // Ctrl-left
            checkPosition(dt, 1,1);
            fireKey(ed, 38,{ctrlKey:true});  // Ctrl-up
            checkPosition(dt, 0,1);
            fireKey(ed, 9);  // tab
            checkPosition(dt, 0,2);
            fireKey(ed, 9,{shiftKey:true});  // back-tab
            checkPosition(dt, 0,1);

            fireKey(ed, 9,{shiftKey:true});  // back-tab
            // It should wrap around and skip over column 0
            checkPosition(dt, 0,7, true);

            fireKey(ed, 38,{ctrlKey:true});  // Ctrl-up
            // It should wrap around to the bottom row
            checkPosition(dt, 5,7, true);
        },
        'check editing': function () {
            var dt = this.dt,
                td =  dt.getCell([0,1]),
                evFac = {}, fail = false;
            td.simulate('click');
            var ed = Y.one('.yui3-datatable-celleditor-input');
            dt.after('celleditor:save', function (ev) {
                evFac = ev;
            });
            dt.after('celleditor:cancel', function (ev) {
                fail = true;
            });

            areSame('0', ed.get('value'), 'check input box');
            areSame('0', td.getHTML(), 'check current cell');
            areSame(0, dt.getRecord(0).get('sopen'), 'check value on record');

            inputKey(ed, 'abc', 13);
            isFalse(fail, 'cancel should never fire');
            areSame('sopen',evFac.colKey, 'ev.colKey');
            areSame(td,evFac.td,'ev.td');
            areSame(0,evFac.initialValue,'ev.initialValue');
            areSame('abc',evFac.newValue,'ev.newValue');
            fail = false;
            evFac = null;
            areSame('abc', ed.get('value'), 'check changed input');

            areSame('abc', dt.getRecord(0).get('sopen'), 'record should have changed');
            areSame('abc', dt.getCell([0,1]).getHTML(), 'check cell after saving');
            areSame('none', ed.ancestor().getStyle('display') ,'editor should be hidden');
        },
        'check editing via keyboard': function () {
            var dt = this.dt,
                td =  dt.getCell([0,1]),
                evFac = {}, fail = false;
            td.focus();
            fireKey(td, 13);
            var ed = Y.one('.yui3-datatable-celleditor-input');
            dt.after('celleditor:save', function (ev) {
                evFac = ev;
            });
            dt.after('celleditor:cancel', function (ev) {
                fail = true;
            });

            areSame('0', ed.get('value'), 'check input box');
            areSame('0', td.getHTML(), 'check current cell');
            areSame(0, dt.getRecord(0).get('sopen'), 'check value on record');

            inputKey(ed, 'abc', 13);
                isFalse(fail, 'cancel should never fire');
                areSame('sopen',evFac.colKey, 'ev.colKey');
                areSame(td,evFac.td,'ev.td');
                areSame(0,evFac.initialValue,'ev.initialValue');
                areSame('abc',evFac.newValue,'ev.newValue');
                fail = false;
                evFac = null;
            areSame('abc', ed.get('value'), 'check changed input');

            areSame('abc', dt.getRecord(0).get('sopen'), 'record should have changed');
            areSame('abc', dt.getCell([0,1]).getHTML(), 'check cell after saving');
            areSame('none', ed.ancestor().getStyle('display') ,'editor should be hidden');
        },
        'check editing canceled via event': function () {
            var dt = this.dt,
                td =  dt.getCell([0,1]),
                evFac = {}, fail = false;
            td.simulate('click');
            var ed = Y.one('.yui3-datatable-celleditor-input');
            dt.on('celleditor:save', function (ev) {
                evFac = ev;
                ev.halt();
            });
            dt.after('celleditor:cancel', function (ev) {
                fail = true;
            });

            areSame('0', ed.get('value'), 'check input box');
            areSame('0', td.getHTML(), 'check current cell');
            areSame(0, dt.getRecord(0).get('sopen'), 'check value on record');

            inputKey(ed, 'abc', 13);

                isFalse(fail, 'cancel should never fire');
                areSame('sopen',evFac.colKey, 'ev.colKey');
                areSame(td,evFac.td,'ev.td');
                areSame(0,evFac.initialValue,'ev.initialValue');
                areSame('abc',evFac.newValue,'ev.newValue');
                fail = false;
                evFac = null;

            areSame('abc', ed.get('value'), 'check changed input');
            areSame(0, dt.getRecord(0).get('sopen'), 'record should not have changed');
            areSame('0', dt.getCell([0,1]).getHTML(), 'check cell remains the same');
            areSame('block', ed.ancestor().getStyle('display') ,'editor should remain visible');
        },

        'check canceled editing': function () {
            var dt = this.dt,
                td =  dt.getCell([0,1]),
                evFac = {}, fail = false;
            td.simulate('click');
            var ed = Y.one('.yui3-datatable-celleditor-input');
            dt.after('celleditor:save', function (ev) {
                fail = true;
            });
            dt.after('celleditor:cancel', function (ev) {
                evFac = ev;
            });

            areSame('0', ed.get('value'), 'check input box');
            areSame('0', td.getHTML(), 'check current cell');
            areSame(0, dt.getRecord(0).get('sopen'), 'check value on record');

            inputKey(ed, 'abc', 27);
            isFalse(fail, 'save event should not fire');
            areSame('sopen',evFac.colKey, 'ev.colKey');
            areSame(td,evFac.td,'ev.td');
            areSame(0,evFac.initialValue,'ev.initialValue');
            areSame('abc', ed.get('value'), 'check changed input');

            areSame(0, dt.getRecord(0).get('sopen'), 'record should not have changed');
            areSame('0', dt.getCell([0,1]).getHTML(), 'check cell remains unchanged');
            areSame('none', ed.ancestor().getStyle('display') ,'editor should be hidden');
        },

        'check clicking outside': function () {
            var dt = this.dt,
                td =  dt.getCell([0,1]),
                evFac = {}, fail = false;
            td.simulate('click');
            var ed = Y.one('.yui3-datatable-celleditor-input');
            dt.after('celleditor:save', function (ev) {
                fail = true;
            });
            dt.after('celleditor:cancel', function (ev) {
                evFac = ev;
            });

            areSame('0', ed.get('value'), 'check input box');
            areSame('0', td.getHTML(), 'check current cell');
            areSame(0, dt.getRecord(0).get('sopen'), 'check value on record');

            Y.one('#logger').simulate('click');
            isFalse(fail, 'save event should not fire');
            areSame('sopen',evFac.colKey, 'ev.colKey');
            areSame(td,evFac.td,'ev.td');
            areSame(0,evFac.initialValue,'ev.initialValue');

            areSame(0, dt.getRecord(0).get('sopen'), 'record should not have changed');
            areSame('0', dt.getCell([0,1]).getHTML(), 'check cell remains unchanged');
            areSame('none', ed.ancestor().getStyle('display') ,'editor should be hidden');

        },
        'check destructor' : function(){
            var dt = this.dt;
            dt.set('editable',true);
            isTrue( dt.get('editable'), "set editable to true" );

            dt.destroy();
            isFalse( dt.get('editable'), "editable not false" );

            areSame(0, Y.Object.size(dt._commonEditors), "_commonEditors not {}" );
            Y.Object.each(dt._columnMap, function (col, colKey) {
                Assert.isUndefined(col._editorInstance, 'Editor instance for ' + colKey + ' still there');
            });
            isNull( dt._openEditor, "_openEditor not null" );
            isNull( dt._editorNode, "_editorNode not null" );
            areSame(0, Y.all('.yui3-datatable-celleditor-input').size(),'There should be no editors left behind');

        }

    }));

    suite.add(new Y.Test.Case({
        name: "assorted tests without a standard setup",
        "check editors types and count with assorted settings": function () {
            var dt = makeDT({
                columns: [
                    {key:'sid',  editable:false},
                    {key:'sopen', editorConfig: {whatever:"doesn't really matter, the existence of an editorConfig should be enough"}},
                    {key:'sname'},
                    {key:'sdesc'},
                    {key:'stype'},
                    {key:'stock', editor: 'inlineNumber'},
                    {key:'sprice'},
                    {key:'sdate', editor: 'inlineDate'}
                ],
                defaultEditor:  'inline',
                editorOpenAction:   'click',
                editable:       true
            });
            areSame(7, Y.Object.size(dt.getCellEditors()), 'there should be 7 cell editors');
            // Editors with an editorConfig cannot be shared so there is going to be just three of them.
            areSame(3, Y.Object.size(dt._commonEditors) , 'there should be three (one per shared type) editors');
            isTrue(dt.getColumn('sopen')._editorInstance instanceof Y.DataTable.Editors.inline, 'The first one should have an editor instance');
            areSame('inline', dt.getColumn('sname')._editorInstance, 'sname should point to an instance in _commonEditors');
            areSame('inline', dt.getColumn('sdesc')._editorInstance, 'sname should point to an instance in _commonEditors');
            areSame('inline', dt.getColumn('stype')._editorInstance, 'sname should point to an instance in _commonEditors');
            areSame('inlineNumber', dt.getColumn('stock')._editorInstance, 'sname should point to an instance in _commonEditors');
            areSame('inline', dt.getColumn('sprice')._editorInstance, 'sname should point to an instance in _commonEditors');
            areSame('inlineDate', dt.getColumn('sdate')._editorInstance, 'sname should point to an instance in _commonEditors');
            dt.destroy();
        },
        "check passing the lookupTable": function () {
            var dt = makeDT({
                columns: [
                    {key:'sopen', editor: 'inlineAC', lookupTable: [
                        {value:0, text: 'no'},
                        {value:1, text: 'yes'}
                    ]}
                ],
                defaultEditor:  'inline',
                editorOpenAction:   'click',
                editable:       true
            });
            isTrue(dt.getColumn('sopen')._editorInstance instanceof Y.DataTable.Editors.inlineAC, 'It should be an instance, because it has an editorConfig');
            isTrue(Y.Lang.isObject(dt.getCellEditor('sopen').get('lookupTable')),'it should have received the lookupTable');
            dt.destroy();
        },
        "check changing the column def": function () {
            var dt = makeDT({
                columns: [
                    {key:'sopen'}
                ],
                defaultEditor:  'inline',
                editorOpenAction:   'click',
                editable:       true
            });
            areSame(1, Y.Object.size(dt._commonEditors) , 'there should be three (one per shared type) editors');
            areSame('inline', dt.getColumn('sopen')._editorInstance, 'It should be a reference to a common editor');
            dt.set('columns',[
                {key:'sopen', editor: 'inlineAC', lookupTable: [
                    {value:0, text: 'no'},
                    {value:1, text: 'yes'}
                ]}
            ] );
            areSame(0, Y.Object.size(dt._commonEditors) , 'there should be three (one per shared type) editors');
            isTrue(dt.getColumn('sopen')._editorInstance instanceof Y.DataTable.Editors.inlineAC, 'It should be an instance, because it has an editorConfig');
            isTrue(Y.Lang.isObject(dt.getCellEditor('sopen').get('lookupTable')),'it should have received the lookupTable');
            dt.destroy();
        },
        'check invalid input': function () {
            var dt = makeDT({
                    columns: [
                        {key: 'sopen', editorConfig: {parser: function (value) {
                             return (value.length < 4 ? value : Y.Attribute.INVALID_VALUE);
                        }}}
                    ],
                     defaultEditor:  'inline',
                     editorOpenAction:   'click',
                     editable:       true
                 }),
                td =  dt.getCell([0,0]),
                evFac = null, fail = false;

            td.simulate('click');
            var ed = Y.one('.yui3-datatable-celleditor-input');
            dt.after('celleditor:save', function (ev) {
                evFac = ev;
            });
            dt.after('celleditor:cancel', function (ev) {
                fail = true;
            });

            areSame('0', ed.get('value'), 'check input box');
            areSame('0', td.getHTML(), 'check current cell');
            areSame(0, dt.getRecord(0).get('sopen'), 'check value on record');

            inputKey(ed, 'abcde', 13);

            isFalse(fail, 'cancel should never fire');
            isNull(evFac, 'no save event yet');
            areSame('inline', ed.getStyle('display') ,'editor should still be visible');
            isTrue(ed.ancestor().hasClass('yui3-datatable-celleditor-error'), 'cell should be in error')

            inputKey(ed, 'abc', 13);
            areSame('sopen',evFac.colKey, 'ev.colKey');
            areSame(td,evFac.td,'ev.td');
            areSame(0,evFac.initialValue,'ev.initialValue');
            areSame('abc',evFac.newValue,'ev.newValue');
            fail = false;
            evFac = null;

            areSame('abc', ed.get('value'), 'check changed input');

            areSame('abc', dt.getRecord(0).get('sopen'), 'record should have changed');
            areSame('abc', dt.getCell([0,0]).getHTML(), 'check cell after saving');
            areSame('none', ed.ancestor().getStyle('display') ,'editor should be hidden');
            dt.destroy();

        }



    }));

    suite.add(new Y.Test.Case({
        name: "Scroll",



        setUp: function () {
            var data = [], i;

            for (i = 0; i < 100; ++i) {
                data.push({ a: i * 1000 , b: i * 1000, c: i * 1000, d: i * 1000, e: i * 1000});
            }

            this.dt = new Y.DataTable({
                columns: ['a','b','c','d','e'],
                data: data,
                scrollable: 'xy',
                width: '100px',
                height: '150px',
                defaultEditor:  'inline',
                editorOpenAction:   'click',
                editable:       true
            }).render();
        },

        tearDown: function () {
            if (this.dt) {
                this.dt.destroy();
            }
            delete this.dt;
        },

        "test scroll": function () {
            var dt = this.dt;

            // The scrolling happens asynchronously so I need to give it a chance to happen
            dt.scrollTo([0,2]);
            this.wait(function () {
                openEditorAt(dt, 0,2);
                dt.scrollTo([10,2]);
                this.wait(function () {
                    openEditorAt(dt, 8,2);
                    dt.scrollTo([10,0]);
                    this.wait(function () {
                        openEditorAt(dt, 8,0);
                    },100);
                },100);

            },100);
       }
    }));

    Y.Test.Runner.add(suite);


},'', {requires: [ 'test', 'datatable-editable', 'datatable-scroll','node-event-simulate', 'datatable-celleditors' ]});
