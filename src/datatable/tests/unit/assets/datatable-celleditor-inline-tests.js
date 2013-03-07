YUI.add('module-tests-dtinline', function(Y) {

    var suite = new Y.Test.Suite('gallery-datatable-celleditor-inline'),
        Assert = Y.Test.Assert;

    var fireKey = function(ceditor, key) {
        //var inst = editor.getInstance();
        inst = Y.one('body');

        ceditor.simulate('keydown', {
            keyCode: key
        });

        ceditor.simulate('keypress', {
            keyCode: key
        });

        ceditor.simulate('keyup', {
            keyCode: key
        });
    };

    var fireKeyObj = function(ceditor, keyobj) {
        //var inst = editor.getInstance();
        inst = Y.one('body');

        ceditor.simulate('keydown', keyobj);
        ceditor.simulate('keypress', keyobj);
        ceditor.simulate('keyup', keyobj);
    };

    var inputKey = function(ceditor,value,key) {
        ceditor.focus();
        ceditor.set('value',value);
        fireKey(ceditor,key);
    };

    function makeDT( colChoice, config_arg ) {
        config_arg = config_arg || {};

        var someData = [
            {sid:10, sname:'Sneakers', sopen:0, stype:0, stock:0, sprice:59.93, shipst:'s', sdate:new Date(2009,3,11) },
            {sid:11, sname:'Varnished Cane Toads', sopen:1,  stype:10, stock:2, shipst:'u', sprice:17.49, sdate:new Date(2009,4,12) },
            {sid:12, sname:'JuJu Beans', sopen:0,  stype:20, stock:1, sprice:1.29, shipst:'s', sdate:new Date(2009,5,13) },
            {sid:13, sname:'Tent Stakes', sopen:1,  stype:30, stock:1, sprice:7.99, shipst:'n', sdate:new Date(2010,6,14) },
            {sid:14, sname:'Peanut Butter', sopen:0,  stype:40, stock:0, sprice:3.29, shipst:'e', sdate:new Date(2011,7,15) },
            {sid:15, sname:'Garbage Bags', sopen:1, stype:50,  stock:2, sprice:17.95, shipst:'r', sdate:new Date(2012,8,18) }
        ];

        // enlarge the dataset
        Y.Array.each(someData,function(d,di){
            d.sdesc = 'Description for Item ' + d.sid + ' : ' + d.sname;
        });
     //   someData = someData.concat(someData,someData);

        //
        // Define some Arrays / Object Hashes to be used by formatters / editor options ...
        //
        var stypes = [
            {value:0,  text:'Standard'},
            {value:10, text:'Improved'},
            {value:20, text:'Deluxe'},
            {value:30, text:'Better'},
            {value:40, text:'Subpar'},
            {value:50, text:'Junk'}
        ];

        var shipTypes = { s:'Shipped', u:'Unknown', n:'Not Shipped', e:'Expedited', r:'Returned' };

        var stypesObj = {};
        Y.Array.each(stypes,function(r){
            stypesObj[r.value] = r.text;
        });

        var stock = { 0:'No ', 1:'Yes ', 2:'B/O ' };
        var sopen = { 0:'No', 1:'Yes'};

    //
    // We use pre-named editors on the "editor" property of the Columns,
    //   in some cases, editorConfig are added to provide stuff to pass to the editor Instance ...

       var colsNoEditors = [
            { key:'sid',  editable:false },
            { key:'sopen' },
            { key:'sname' },
            { key:'sdesc' },
            { key:'stype' },
            { key:'stock' },
            { key:'sprice' },
            { key:'sdate' }
        ];

       var colsEditors = [
            { key:'sid',  editable:false },
            { key:'sopen' },
            { key:'sname' },
            { key:'sdesc' },
            { key:'stype' },
            { key:'stock' },
            { key:'sprice', editor:'inlineNumber' },
            { key:'sdate', editor:'inlineDate' }
        ];

        var cols = [ colsNoEditors, colsEditors ];

        var basic_config = {
            columns: cols[colChoice],
            data:    someData,
            defaultEditor:  'inline',
            editOpenType:   'click',
            editable:       true
        };

        var dt = new Y.DataTable(Y.merge(basic_config,config_arg)).render('#dtable');

        return dt;
    }




    suite.add(new Y.Test.Case({
        name: 'Gallery DataTable-Celleditor-Inline : basic setup and configuration of inlines',

        setUp : function () {
            // {sid: sname: sdesc: sopen:0, stype:0, stock:0, sprice:, shipst:'s', sdate: },
            this.dt = makeDT(0);
        },

        tearDown : function () {
            if(this.dt) {
                this.dt.destroy();
                delete this.dt;
            }
        },

        'should be a class': function() {
            Assert.isFunction(Y.DataTable.Editable);
        },

        'each inline should be an object': function() {
            Assert.isObject(Y.DataTable.EditorOptions);
            Assert.isObject(Y.DataTable.EditorOptions.inline);
            Assert.isObject(Y.DataTable.EditorOptions.inlineNumber);
            Assert.isObject(Y.DataTable.EditorOptions.inlineDate);
            Assert.isObject(Y.DataTable.EditorOptions.inlineAC);
        },

        'inline editor should be a View': function() {
            var dt = this.dt,
                ce = dt.getCellEditor('sopen');

            Assert.isInstanceOf( Y.View, ce, 'editor is not an instanceof Y.View');
        },


        'check ATTR defaults' : function(){

        },

        'check destructor' : function(){
            var dt = this.dt,
                ce = dt.getCellEditor('sopen');

            ce.destroy();

            Assert.isNull(ce._subscr,'subscribers should be null');

        }

    }));


    suite.add(new Y.Test.Case({
        name: 'Gallery DataTable-Celleditor-Inline : basic functioning of the editor',

        setUp : function () {
            // {sid: sname: sdesc: sopen:0, stype:0, stock:0, sprice:, shipst:'s', sdate: },
            this.dt = makeDT(0);

        },

        tearDown : function () {
            if(this.dt) {
                this.dt.destroy();
                delete this.dt;
            }
        },

        'check editor counts' : function(){
            var dt = this.dt;

            Assert.isTrue( dt.get('editable'), "set editable to true" );

            var ces = dt.getCellEditors();
            Assert.areSame(7, ces.length, 'there should be 7 cell editors');

            Assert.isNull( dt.getCellEditor('sid'),'column 0 (sid) editor should be null');
            Assert.areSame( 'inline', dt.getCellEditor('sopen').get('name'),'column 1 (sopen) editor name should be inline');

        },

        'check inline editor - row 0 column 6 (sprice) : showeditor' : function(){
            var dt = this.dt,
                tr0 = dt.getRow(0),
                td6 = tr0.all('td').item(6),
                oe,val,inp;

            // open the editor
            td6.simulate('click');
            oe = dt._openEditor;
            Assert.isTrue(oe.get('visible'),'cell editor col 6 should be visible');
        },

        'check inline editor - row 0 column 6 (sprice) : hideeditor' : function(){
            var dt = this.dt,
                tr0 = dt.getRow(0),
                td6 = tr0.all('td').item(6),
                oe,val,inp;

            // open the editor
            td6.simulate('click');
            oe = dt._openEditor;
            Assert.isTrue(oe.get('visible'),'cell editor col 6 should be visible');

            // hideEditor
            oe.hideEditor();
            Assert.isFalse(oe.get('visible'),'cell editor col 1 should be closed');
            Assert.isFalse(dt.getCellEditor('sprice').get('visible'),'cell editor col 1 should be closed');
            Assert.isFalse(dt.getCellEditor('sprice').get('hidden'),'cell editor col 1 should not be hidden');

            // open the editor
            td6.simulate('click');
            oe = dt._openEditor;
            Assert.isTrue(oe.get('visible'),'cell editor col 6 should be visible');

            // hideEditor
            oe.hideEditor(true);
            Assert.isFalse(oe.get('visible'),'cell editor col 1 should be closed');
            Assert.isFalse(dt.getCellEditor('sprice').get('visible'),'cell editor col 1 should be closed');
            Assert.isTrue(dt.getCellEditor('sprice').get('hidden'),'cell editor col 1 should be hidden');
        },

        'canceleditor via ESC' : function(){
            var dt = this.dt,
                tr0 = dt.getRow(0),
                td6 = tr0.all('td').item(6),
                oe,val,inp;

            // open the editor
            td6.simulate('click');
            oe = dt._openEditor;

            // showEditor
            oe.showEditor(td6);
            inp = oe._inputNode;

            // ESC cancelEditor
            td6.simulate('click');
            //inp.focus();
            inp.simulate('keypress',{charCode:72}); //  4:52     H:72   i:105
            inp.simulate('keypress',{charCode:52}); //  4:52     H:72   i:105
            inp.simulate('keydown',{keyCode:27});
            Assert.isFalse(oe.get('visible'),'cell editor col 1 should be closed');
            Assert.isFalse(dt.getCellEditor('sprice').get('visible'),'cell editor col 1 should be closed');

        },

        'canceleditor call' : function() {
            var dt = this.dt,
                tr0 = dt.getRow(0),
                td6 = tr0.all('td').item(6),
                oe,val,inp;

            // cancelEditor
            td6.simulate('click');
            oe = dt._openEditor;
            oe.cancelEditor();
            Assert.isFalse(oe.get('visible'),'cell editor col 1 should be closed');
            Assert.isFalse(dt.getCellEditor('sprice').get('visible'),'cell editor col 1 should be closed');

        },

        'saveEditor call ' : function() {
            var dt = this.dt,
                tr0 = dt.getRow(0),
                td6 = tr0.all('td').item(6),
                oe,val,inp;

            // saveEditor
            td6.simulate('click');
            oe = dt._openEditor;
            oe.saveEditor('abcdefg');
            Assert.isFalse(oe.get('visible'),'cell editor col 1 should be closed');
            Assert.areSame('abcdefg', oe.get('value'),'after save lastvalue should be abcdefg');
            Assert.areSame(59.93, oe.get('lastValue'),'after save lastvalue should be 59.93');
        },

        'saveEditor via RTN' : function() {
            var dt = this.dt,
                tr0 = dt.getRow(0),
                td6 = tr0.all('td').item(6),
                oe,val,inp;

            td6.simulate('click');
            oe = dt._openEditor;
            inp = oe._inputNode;
            inputKey(inp,'abcdefg',13);
            Assert.isFalse(oe.get('visible'),'cell editor col 1 should be closed');
            Assert.areSame('abcdefg', oe.get('value'),'after save lastvalue should be abcdefg');
            Assert.areSame(59.93, oe.get('lastValue'),'after save lastvalue should be 59.93');
        },

        'saveEditor with undefined' : function() {
            var dt = this.dt,
                tr0 = dt.getRow(0),
                td6 = tr0.all('td').item(6),
                oe,val,inp;

            td6.simulate('click');
            oe = dt._openEditor;
            inp = oe._inputNode;
            inputKey(inp,undefined,13);
            Assert.isFalse(oe.get('visible'),'cell editor col 1 should be closed');
    //      Assert.areSame(59.93, oe.get('value'),'after save value should be 59.93');
        },

        'saveEditor(undefined)' : function() {
            var dt = this.dt,
                tr0 = dt.getRow(0),
                td6 = tr0.all('td').item(6),
                oe,val,inp;

            td6.simulate('click');
            oe = dt._openEditor;
            inp = oe._inputNode;
            //inputKey(inp,undefined,13);
            oe.saveEditor(undefined);
            Assert.isFalse(oe.get('visible'),'cell editor col 1 should be closed');
            Assert.areSame(59.93, oe.get('value'),'after save value should be 59.93');
        }

    }));



    suite.add(new Y.Test.Case({

        name: 'Gallery DataTable-Celleditor-Inline : inter-cell navigation',

        setUp : function () {
            // {sid: sname: sdesc: sopen:0, stype:0, stock:0, sprice:, shipst:'s', sdate: },
            this.dt = makeDT(0);
        },

        tearDown : function () {
            if(this.dt) {
                this.dt.destroy();
                delete this.dt;
            }
        },

        'start at row index 2, col index 3 TAB right' :    function() {
            var dt = this.dt,
                tr2 = dt.getRow(2),
                tds = tr2.all('td'),
                td3 = tds.item(3),
                oe,val,inp;

            // open cell 3
            td3.simulate('click');
            oe = dt._openEditor;
            inp = oe._inputNode;
            Assert.isTrue(oe.get('visible'),'cell editor should be visible');
            Assert.areSame(td3,oe.get('cell').td);

            // navigate to cell 4 via TAB
            inputKey(inp,'abc',9);
            Assert.areSame(tds.item(4),oe.get('cell').td,'should have tabbed to cell 4');

        },

        'start at row index 2, col index 3 shift-TAB left' :    function() {
            var dt = this.dt,
                tr2 = dt.getRow(2),
                tds = tr2.all('td'),
                td3 = tds.item(3),
                oe,val,inp;

            // open cell 3
            td3.simulate('click');
            oe = dt._openEditor;
            inp = oe._inputNode;
            Assert.isTrue(oe.get('visible'),'cell editor should be visible');
            Assert.areSame(td3,oe.get('cell').td);

            // navigate to cell 4 via TAB
            //inputKey(inp,'abc',9);
            fireKeyObj(inp,{keyCode:9,shiftKey:true});
            Assert.areSame(tds.item(2),oe.get('cell').td,'should have shift tabbed to cell 2');

        },

        'start at row index 2, col index 3 ctrl-up' :    function() {
            var dt = this.dt,
                tr2 = dt.getRow(2),
                tds = tr2.all('td'),
                td3 = tds.item(3),
                oe,val,inp;

            // open cell 3
            td3.simulate('click');
            oe = dt._openEditor;
            inp = oe._inputNode;
            Assert.isTrue(oe.get('visible'),'cell editor should be visible');
            Assert.areSame(td3,oe.get('cell').td);

            // navigate up one row, via ctrl-up
            fireKeyObj(inp,{keyCode:38,ctrlKey:true});
            Assert.areSame(dt.getCell(td3,[-1,0]),oe.get('cell').td,'should have shift tabbed to cell 2');

        },

        'start at row index 2, col index 3 ctrl-down' :    function() {
            var dt = this.dt,
                tr2 = dt.getRow(2),
                tds = tr2.all('td'),
                td3 = tds.item(3),
                oe,val,inp;

            // open cell 3
            td3.simulate('click');
            oe = dt._openEditor;
            inp = oe._inputNode;
            Assert.isTrue(oe.get('visible'),'cell editor should be visible');
            Assert.areSame(td3,oe.get('cell').td);

            // navigate down one row, via ctrl-up
            fireKeyObj(inp,{keyCode:40,ctrlKey:true});
            Assert.areSame(dt.getRow(3).all('td').item(3),oe.get('cell').td,'should have shift tabbed to cell 2');

        },

        'start at row index 2, col index 3 ctrl-left' :    function() {
            var dt = this.dt,
                tr2 = dt.getRow(2),
                tds = tr2.all('td'),
                td3 = tds.item(3),
                oe,val,inp;

            // open cell 3
            td3.simulate('click');
            oe = dt._openEditor;
            inp = oe._inputNode;
            Assert.isTrue(oe.get('visible'),'cell editor should be visible');
            Assert.areSame(td3,oe.get('cell').td);

            // navigate left one cell
            fireKeyObj(inp,{keyCode:37,ctrlKey:true});
            Assert.areSame(tds.item(2),oe.get('cell').td);

        },

        'start at row index 2, col index 3 ctrl-right' :    function() {
            var dt = this.dt,
                tr2 = dt.getRow(2),
                tds = tr2.all('td'),
                td3 = tds.item(3),
                oe,val,inp;

            // open cell 3
            td3.simulate('click');
            oe = dt._openEditor;
            inp = oe._inputNode;
            Assert.isTrue(oe.get('visible'),'cell editor should be visible');
            Assert.areSame(td3,oe.get('cell').td);

            // navigate right one cell, via ctrl-right
            fireKeyObj(inp,{keyCode:39,ctrlKey:true});
            Assert.areSame(tds.item(4),oe.get('cell').td);

        }

    }));

    suite.add(new Y.Test.Case({
        name: 'Gallery DataTable-Celleditor-Inline : check inlineNumber',

        setUp : function () {
            // {sid: sname: sdesc: sopen:0, stype:0, stock:0, sprice:, shipst:'s', sdate: },
            this.dt = makeDT(1);
        },

        tearDown : function () {
            if(this.dt) {
                this.dt.destroy();
                delete this.dt;
            }
        },

        'row index 2, column 6 (sprice) - inlineNumber valid' : function(){
            var dt = this.dt,
                tr2 = dt.getRow(2),
                td6 = tr2.all('td').item(6),
                oe,val,inp;

            // open the editor
            td6.simulate('click');
            oe = dt._openEditor;
            inp = oe._inputNode;
            Assert.isTrue(oe.get('visible'),'cell editor col 6 should be visible');


            inputKey(inp,'9876.5',13);
            Assert.isFalse(oe.get('visible'),'cell editor col 6 should be closed');
            Assert.areSame(9876.5,oe.get('value'));
        },

        'row index 2, column 6 (sprice) - inlineNumber valid via saveEditor' : function(){
            var dt = this.dt,
                tr2 = dt.getRow(2),
                td6 = tr2.all('td').item(6),
                oe,val,inp;

            // open the editor
            td6.simulate('click');
            oe = dt._openEditor;
            inp = oe._inputNode;
            Assert.isTrue(oe.get('visible'),'cell editor col 6 should be visible');


            //inputKey(inp,'9876.5',13);
            oe.saveEditor(9876.5);
            Assert.isFalse(oe.get('visible'),'cell editor col 6 should be closed');
            Assert.areSame(9876.5,oe.get('value'));
        },

        'row index 2, column 6 (sprice) - inlineNumber invalid' : function(){
            var dt = this.dt,
                tr2 = dt.getRow(2),
                td6 = tr2.all('td').item(6),
                oe,val,inp;

            // open the editor
            td6.simulate('click');
            oe = dt._openEditor;
            inp = oe._inputNode;
            Assert.isTrue(oe.get('visible'),'cell editor col 6 should be visible');


            inputKey(inp,'abcdefg',13);
            Assert.isFalse(oe.get('visible'),'cell editor col 6 should be closed');
            Assert.areSame(1.29,oe.get('value'));
        },

        'row index 2, column 6 (sprice) - inlineNumber invalid via saveEditor' : function(){
            var dt = this.dt,
                tr2 = dt.getRow(2),
                td6 = tr2.all('td').item(6),
                oe,val,inp;

            // open the editor
            td6.simulate('click');
            oe = dt._openEditor;
            inp = oe._inputNode;
            Assert.isTrue(oe.get('visible'),'cell editor col 6 should be visible');

            //inputKey(inp,'abcdefg',13);
            oe.saveEditor('abcdefg');
            Assert.isFalse(oe.get('visible'),'cell editor col 6 should be closed');
            Assert.areSame(1.29,oe.get('value'));
        }

    }));


    suite.add(new Y.Test.Case({
        name: 'Gallery DataTable-Celleditor-Inline : check inlineDate',

        setUp : function () {
            // {sid: sname: sdesc: sopen:0, stype:0, stock:0, sprice:, shipst:'s', sdate: },
            this.dt = makeDT(1);
        },

        tearDown : function () {
            if(this.dt) {
                this.dt.destroy();
                delete this.dt;
            }
        },

        'row index 2, column 7 (sdate) - inlineDate valid' : function(){
            var dt = this.dt,
                tr2 = dt.getRow(2),
                td6 = tr2.all('td').item(7),
                oe,val,inp;

            // open the editor
            td6.simulate('click');
            oe = dt._openEditor;
            inp = oe._inputNode;
            Assert.isTrue(oe.get('visible'),'cell editor col 7 should be visible');

            // prepFn should format as 06/13/09
            Assert.areSame('06/13/09',inp.get('value'),'prepfn did not work');

            inputKey(inp,'2013-01-12',13);
            Assert.isFalse(oe.get('visible'),'cell editor col 7 should be closed');
            Assert.isTrue(Y.Lang.isDate(oe.get('value')));
        },

        'row index 2, column 7 (sdate) - inlineDate valid via saveEditor' : function(){
            var dt = this.dt,
                tr2 = dt.getRow(2),
                td6 = tr2.all('td').item(7),
                oe,val,inp;

            // open the editor
            td6.simulate('click');
            oe = dt._openEditor;
            inp = oe._inputNode;
            Assert.isTrue(oe.get('visible'),'cell editor col 7 should be visible');

            // prepFn should format as 06/13/09
            Assert.areSame('06/13/09',inp.get('value'),'prepfn did not work');

            //inputKey(inp,'2013-01-12',13);
            oe.saveEditor('09/11/2011');
            Assert.isFalse(oe.get('visible'),'cell editor col 7 should be closed');
            Assert.isTrue(Y.Lang.isDate(oe.get('value')));
        },

        'row index 2, column 7 (sdate) - inlineDate invalid' : function(){
            var dt = this.dt,
                tr2 = dt.getRow(2),
                td6 = tr2.all('td').item(7),
                oe,val,inp;

            // open the editor
            td6.simulate('click');
            oe = dt._openEditor;
            inp = oe._inputNode;
            Assert.isTrue(oe.get('visible'),'cell editor col 7 should be visible');

            // prepFn should format as 06/13/09
            Assert.areSame('06/13/09',inp.get('value'),'prepfn did not work');

            inputKey(inp,'abc2013-01-12',13);
            Assert.isFalse(oe.get('visible'),'cell editor col 7 should be closed');
            Assert.areSame('06/13/2009',Y.Date.format(oe.get('value'),{format:'%m/%d/%Y'}));
        }


    }));


    Y.Test.Runner.add(suite);

},'', { requires: [ 'test' ] });
