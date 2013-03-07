YUI.add('module-tests-dtpopup', function(Y) {

    var suite = new Y.Test.Suite('gallery-datatable-celleditor-popup'),
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

       var colsNoediting = [
            { key:'sid',  editable:false },
            { key:'sopen' },
            { key:'sname' },
            { key:'sdesc' },
            { key:'stype' },
            { key:'stock' },
            { key:'sprice' },
            { key:'sdate' }
        ];

        var colsPopup = [
                { key:'sid',    label:"sID", editable:false },
                { key:'sopen',  label:"Open?",
                  editor:"checkbox", editorConfig:{
                    checkboxHash:{ 'true':1, 'false':0 }
                  }
                },

                { key:'sname',  label:"Item Name" },

                { key:'sdesc',  label:"Description",  editor:"textarea" },

                { key:'stype',  label:"Condition",
                  editor:"select",
                  editorConfig:{
                      selectOptions:  stypesObj, //stypes,
                      templateEngine:Y.Handlebars
                  }
                },

                { key:'stock',  label:"In Stock?",
                  editor:"radio",
                  editorConfig:{
                      radioOptions:stock,
                      overlayWidth: 260,
                      templateEngine:Y.Handlebars
                  }
                },

                { key:'sprice', label:"Retail Price", editor:'number'  },

                { key:'sdate',  label:"Trans Date", editor:'calendar'  }
            ];


        var cols = [ colsNoediting, colsPopup ];

        var basic_config = {
            columns: cols[colChoice],
            data:    someData
        };

        var dt = new Y.DataTable(Y.merge(basic_config,config_arg)).render('#dtable');

        return dt;
    }


    suite.add(new Y.Test.Case({
        name: 'Gallery DataTable-Celleditor-Popup : basic setup and instance',

        setUp : function () {
            // cols
            // {sid: sname: sdesc: sopen:0, stype:0, stock:0, sprice:, shipst:'s', sdate: },
            this.dt = makeDT(0);

        },

        tearDown : function () {
            this.dt.destroy();
            delete this.dt;
        },

        'should be a class': function() {
            Assert.isFunction(Y.DataTable.Editable);
        },

        'should instantiate as a Model': function() {
            Assert.isInstanceOf( Y.DataTable, this.dt, 'Not an instanceof Y.DataTable');
        },

        'listeners are set' : function(){
            //Assert.areSame( 3, this.m._subscr.length, "Didn't find 3 listeners" );
        },

        'check ATTR default values' : function(){
            Assert.isFalse( this.dt.get('editable'), "editable default not false" );
            Assert.areSame( null, this.dt.get('defaultEditor'), "default editor not 'none'" );
            Assert.areSame( 'dblclick', this.dt.get('editOpenType'), "default editOpenType not 'dblclick'" );
        }

    }));



    suite.add(new Y.Test.Case({
        name: 'Gallery DataTable-Celleditor-Popup : all columns editable (except 1) with "text"',

        setUp : function () {
            this.dt = makeDT(0,{
                editable: true,
                defaultEditor: 'text'
            });

        },

        tearDown : function () {
            this.dt.destroy();
            delete this.dt;
        },

        'check all editors set as "text" except first col' : function(){

            Assert.isTrue( this.dt.get('editable'), "set editable to true" );
            Assert.areSame( 'text', this.dt.get('defaultEditor'), "defaultEditor not text" );

            var ed = this.dt._commonEditors[this.dt.get('defaultEditor')];
            Assert.areSame( 'text', ed.get('name'), "common editor 0 should be text");

            var ces = this.dt.getCellEditors();
            Assert.areSame( 7, ces.length,'there are not 7 columns editable');

            Assert.isNull( this.dt.getCellEditor('sid'));
        },

        'editor on col 0 doesn\'t come up' : function(){
            var dt = this.dt,
                tr3 = dt.getRow(3),
                oe;

            tr3.all('td').item(0).simulate('click');
            oe = dt._openEditor;
            Assert.isNull(oe,'col 0 is not editable');

            tr3.all('td').item(0).simulate('dblclick');
            oe = dt._openEditor;
            Assert.isNull(oe,'col 0 is not editable');
        },

        'row index 3 popup editor on col 1 come up' : function(){
            var dt = this.dt,
                tr3 = dt.getRow(3),
                oe;

            tr3.all('td').item(1).simulate('click');
            oe = dt._openEditor;
            Assert.isNull(oe,'col 1 opened on click');

            tr3.all('td').item(1).simulate('dblclick');
            oe = dt._openEditor;
            Assert.isObject(oe,'col 1 not open on dblclick');
            Assert.isTrue(oe.get('visible'),'col 1 not open on dblclick');

        },

        'row index 3 popup "text" editor checks' : function(){
            var dt = this.dt,
                tr3 = dt.getRow(3),
                oe;

            tr3.all('td').item(1).simulate('dblclick');
            oe = dt._openEditor;
            Assert.isObject(oe,'col 1 not open on dblclick');
            Assert.isTrue(oe.get('visible'),'col 1 not open on dblclick');

            Assert.isInstanceOf(Y.View,oe);
            Assert.isInstanceOf(Y.Node,oe._inputNode);

            oe.destroy({remove:true});

            Assert.isTrue(oe.get('destroyed'),'destroyed flag not set');

        },

        'row index 3 col 1 - enter data in text' : function(){
            var dt = this.dt,
                tr3 = dt.getRow(3),
                oe,inp;

            tr3.all('td').item(1).simulate('dblclick');
            oe = dt._openEditor;
            inp = oe._inputNode;

            Assert.isObject(oe,'col 1 not open on dblclick');
            Assert.isTrue(oe.get('visible'),'col 1 not open on dblclick');

            inputKey(inp,"hi",13);
            Assert.isFalse(oe.get('visible'),'col 1 not open on dblclick');
            Assert.areSame('hi',oe.get('value'));
            Assert.areSame(1,oe.get('lastValue'));

        },

        'row index 3 col 1 - enter data in text ~ cancel with ESC' : function(){
            var dt = this.dt,
                tr3 = dt.getRow(3),
                oe,inp;

            tr3.all('td').item(1).simulate('dblclick');
            oe = dt._openEditor;
            inp = oe._inputNode;

            Assert.isObject(oe,'col 1 not open on dblclick');
            Assert.isTrue(oe.get('visible'),'col 1 not open on dblclick');

            inputKey(inp,"hi",27);
            Assert.isFalse(oe.get('visible'),'col 1 not open on dblclick');
            Assert.areSame(1,oe.get('value'));
        },

        'row index 3 col 1 : tab to next cell' : function(){
            var dt = this.dt,
                tr3 = dt.getRow(3),
                td1 = tr3.all('td').item(1),
                td2 = tr3.all('td').item(2),
                tds = tr3.all('td'),
                oe,inp;

            td1.simulate('dblclick');
            oe = dt._openEditor;
            inp = oe._inputNode;

            Assert.isObject(oe,'col 1 not open on dblclick');
            Assert.isTrue(oe.get('visible'),'col 1 not open on dblclick');

            inputKey(inp,"hi",9);
            Assert.isTrue(oe.get('visible'),'col 1 not open on dblclick');
            Assert.areSame(oe.get('cell').td,td2);
            Assert.areSame("1",td1.getHTML(),'old cell should not have saved')

            inputKey(inp,"hi",9);
            Assert.isTrue(oe.get('visible'),'col 1 not open on dblclick');
            Assert.areSame(oe.get('cell').td,tds.item(3));

        },

    }));


    Y.Test.Runner.add(suite);


},'', { requires: [ 'test' ] });
