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

    var check = function (content, step) {
        var cell = document.activeElement;
        isNotNull(cell, content + ' ' + step);
        if (cell.tagName.toUpperCase() === 'TH') {
            areSame(content, cell.textContent || cell.innerText,  content + ' ' + step);
        } else {
            areSame(content, cell.innerHTML,  content + ' ' + step);
        }
    };
    var data = [];
    for (var i = 1; i < 20; ++i) {
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
            check('a',1);
            fireKey(UP);  // shouldn't move'
            check('a',2);
            fireKey(LEFT);// shouldn't move
            check('a',3);
            fireKey(DOWN); // should cross to the data rows
            check('a1',4);
            fireKey(RIGHT);
            check('b1',5);
            fireKey(END);
            check('e1',6);
            fireKey(RIGHT); // shouldn't move
            check('e1',7);
            fireKey(DOWN);
            check('e2',8);
            fireKey(HOME);
            check('a2',9);
            fireKey(END);
            check('e2',10);
            fireKey(LEFT);
            check('d2',11)
            fireKey(UP);
            check('d1',12)
            fireKey(PGUP);
            check('d',13)
            fireKey(DOWN);
            check('d1',14)
            fireKey(UP); // should cross to the header section
            check('d',15)
            fireKey(PGDN);
            check('d19',16);
            fireKey(DOWN);// shouldn't move
            check('d19',17);

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
        },

        "test moving about excluding headers": function () {
            var dt = makeDT({keyIntoHeaders: false});
            dt.focus();
            check('a1',1);
            fireKey(UP);
            check('a1',2);
            fireKey(PGDN);
            check('a19',3);
            fireKey(PGUP);
            check('a1',4)
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
            dt.keyActions[ch] = function (e) {
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
            dt.keyActions[ch] = 'someEvent';

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
            dt.keyActions['shift-space'] = function (e) {
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
    suite.add(new Y.Test.Case({
        name: "nested headers",
        'test nested headers': function () {
        var DT = Y.Base.create('datatable', Y.DataTable.Base, [Y.DataTable.KeyNav]),

            dt =  new DT({
                columns: [
                    {key:'abc', children: [
                        {key:'ab', children: [
                            'a',
                            'b'
                        ]},
                    'c'
                    ]},
                    {key: 'de', children: [
                       'd',
                       'e'
                    ]}
                ],
                data: data
            }).render('#dtable');
            dt.focus();
            check('abc',1);
            fireKey(DOWN);
            check('ab',2);
            fireKey(DOWN);
            check('a',3);
            fireKey(DOWN);
            check('a1',4);
            fireKey(RIGHT);
            check('b1',5);
            fireKey(UP);
            check('b',6);
            fireKey(UP);
            check('ab',7);
            fireKey(UP);
            check('abc',8);
            fireKey(RIGHT);
            check('de',9);
            fireKey(DOWN);
            check('d',10);
            fireKey(DOWN);
            check('d1',11);
            fireKey(LEFT);
            check('c1',12);
            fireKey(UP);
            check('c',13);
            fireKey(UP);
            check('abc',14);
            fireKey(RIGHT);
            check('de',15);
            fireKey(DOWN);
            check('d',16);
            fireKey(DOWN);
            check('d1', 17);
            fireKey(DOWN);
            check('d2',18);
            fireKey(PGUP);
            check('de', 19);
            dt.destroy();
        }
    }));
    Y.Test.Runner.add(suite);


},'', {requires: [ 'test', 'datatable-keynav', 'node-event-simulate','datatable-scroll', "base-build"]});
