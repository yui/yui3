YUI.add('datatable-keynav-tests', function(Y) {

    var suite = new Y.Test.Suite('datatable-keynav'),
        Assert = Y.Test.Assert,
        areSame = Assert.areSame,
        isFalse = Assert.isFalse,
        isTrue = Assert.isTrue,
        isNull = Assert.isNull,
        isNotNull = Assert.isNotNull,

        SPACE = 32,
        PGUP = 33,
        PGDN = 34,
        END = 35,
        HOME = 36,
        LEFT = 37,
        UP = 38,
        RIGHT = 39,
        DOWN = 40;

    var fireKey = function( key, opts) {
        opts = Y.merge({keyCode: key}, opts);
        var doc = Y.one(Y.config.doc.activeElement);
        doc.simulate('keydown', opts);

        doc.simulate('keypress', opts);

        doc.simulate('keyup', opts);
    };

    var check = function (row, col) {
        var cell = document.activeElement;
        isNotNull(cell, col + row);
        if (cell.tagName.toUpperCase() === 'TH') {
            areSame(col, cell.textContent || cell.innerText, 'col ' + col + row);
            areSame(0,row, 'row ' + col + row);
        } else {
            var val = cell.innerHTML;
            areSame(row, parseInt(val.substr(1), 10), 'row ' + col + row);
            areSame(col, val[0], 'col ' + col + row);
        }
    };
    var data = [];
    for (var i = 1; i < 100; ++i) {
        data.push({a: 'a' + i , b: 'b' + i, c: 'c' + i, d: 'd' + i, e: 'e' + i});
    }
    var makeDTScroll = function (config_arg ) {
        config_arg = config_arg || {};

        var basic_config = {
            columns: ['a','b','c','d','e'],
            data: data
        };

        return new Y.DataTable(Y.merge(basic_config,config_arg)).render('#dtable');
    };

    var makeDT = function (config_arg ) {
        config_arg = config_arg || {};

        var basic_config = {
                columns: ['a','b','c','d','e'],
                data: data
            },
            DT = Y.Base.create('datatable', Y.DataTable.Base, [Y.DataTable.KeyNav]);

        return new DT(Y.merge(basic_config,config_arg)).render('#dtable');
    };




    suite.add(new Y.Test.Case({
        name: "Moving about",

        _moveAbout: function (dt) {
            dt.focus();
            check(0, 'a');
            fireKey(UP);  // shouldn't move'
            check(0, 'a');
            fireKey(LEFT);// shouldn't move
            check(0, 'a');
            fireKey(DOWN); // should cross to the data rows
            check(1, 'a');
            fireKey(RIGHT);
            check(1,'b');
            fireKey(END);
            check(1,'e');
            fireKey(RIGHT); // shouldn't move
            check(1,'e');
            fireKey(DOWN);
            check(2, 'e');
            fireKey(HOME);
            check(2,'a');
            fireKey(END);
            check(2,'e');
            fireKey(LEFT);
            check(2,'d')
            fireKey(UP);
            check(1,'d')
            fireKey(PGUP);
            check(0,'d')
            fireKey(DOWN);
            check(1,'d')
            fireKey(UP); // should cross to the header section
            check(0,'d')
            fireKey(PGDN);
            check(99,'d');
            fireKey(DOWN);// shouldn't move
            check(99,'d');

        },

        "test moving about normal DT": function () {
            var dt = makeDT();

            this._moveAbout(dt);
            dt.destroy();
        },


        "test moving about scrollable DT": function () {
            var dt = makeDTScroll({
                scrollable: 'xy',
                width: '100px',
                height: '150px'
            });

            this._moveAbout(dt);
            dt.destroy();
        }
    }));
    suite.add(new Y.Test.Case({
        name: "Various features",
        setUp: function () {
            this.dt = makeDT();

        },
        tearDown: function () {
            var dt = this.dt;
            if (dt) {
                dt.destroy();
                delete this.dt;
            }
        },
        'test click on cells': function () {
            var dt = this.dt;

            var td = Y.all('.yui3-datatable-col-c').item(2);
            isNotNull(td);
            td.simulate('click');
            areSame(td, dt.get('focusedCell'));
            areSame(td, Y.one(document.activeElement));
        },
        'test add function to keyActions': function () {
            var dt = this.dt,
                eventFacade = null,
                self = null,
                ch = 'a'.charCodeAt(0);
            dt.get('keyActions')[ch] = function (e) {
                eventFacade = e;
                self = this;
            };
            dt.focus();
            fireKey(ch);
            isNotNull(eventFacade);
            areSame(ch, eventFacade.keyCode);
            areSame(dt, self);
        },
        'test add event to keyActions': function () {
            var dt = this.dt,
                ev = null,
                ev1 = null,
                self = null,
                ch = 'a'.charCodeAt(0);
            dt.get('keyActions')[ch] = 'someEvent';

            dt.on('someEvent', function (e,e1) {
                ev = e;
                ev1 = e1;
                self = this;
            });
            dt.focus();
            fireKey(DOWN);
            fireKey(ch);
            isNotNull(ev);
            areSame(ch, ev1.keyCode);
            areSame(dt.getCell([0,0]), ev.cell);
            areSame('a1', ev.record.get(ev.column.key));
            areSame(dt, self);
        },
        'test add to keyActions with modifier': function () {
            var dt = this.dt,
                eventFacade = null,
                self = null;
            dt.get('keyActions')['shift-space'] = function (e) {
                eventFacade = e;
                self = this;
            };
            dt.focus();
            fireKey(32, {shiftKey:true});
            isNotNull(eventFacade);
            areSame(32, eventFacade.keyCode);
            areSame(dt, self);
        }
    }));
    Y.Test.Runner.add(suite);


},'', {requires: [ 'test', 'datatable-keynav', 'node-event-simulate','datatable-scroll']});
