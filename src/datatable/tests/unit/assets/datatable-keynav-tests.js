YUI.add('datatable-keynav-tests', function(Y) {
/*
 * ****   IMPORTANT ***
 * Please READ the note below about activeElement before doing any changes to these tests.
 */
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

/***********  Please Read ****************************

It happens that the native DOM property `document.activeElement` is not always
reliable, not in all browsers (guess which?).  The only reliable way to
find out which element has the focus is to set listeners for the `focus` event.

Since `focus` does not bubble and since this is a test suite and not a final product,
individual listeners are set on each individual cell that might get the focus.

Also, some browsers (yes the same ones) don't fire `focus` synchronously
but do so at the first idle moment.  This means that you have to pause execution
so the event can fire.  It can be done via `window.setTimeout` or, within a test
suite, using method `wait`.

That is why this `activeElement` variable exists.  It replaces the native
`document.activeElement`.

For any test that has to check which cell got the focus, you have to call
`setFocusListeners` first which will set all the listeners to track the cell
with the focus.

`setFocusListeners` is an asynchronous method since its first task is to
force the first `focus` event to get fired. To do that it calls the `blur`
method of the datatable instance before setting the listeners
and the`focus` method  after so as to pick the initial focused element.
Since the `focus` event is asynchronous, the `setFocusListeners` is forced
to be asynchronous as well.

Note that `fireKey` also needs to know which element has the focus so even
if the test doesn't directly need to check the focused element, if you use
`fireKey` you also need to call `setFocusListeners.

*/

    var activeElement,
        eventHandles,
        data = [];

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

    var fireKey = function( key, opts) {
        opts = Y.merge({keyCode: key}, opts);

        activeElement.simulate('keydown', opts);
        activeElement.simulate('keypress', opts);
        activeElement.simulate('keyup', opts);
    };


    var setFocusListeners = function (dt, callback) {
        var self = this;
        dt.blur();
        if (eventHandles) {
            dropFocusListeners();
        }
        eventHandles = Y.all('#dtable td , #dtable th').on('focus', function (ev) {
            activeElement = ev.target;
        });
        self.wait(function () {
            dt.focus();
            self.wait(callback, 1);
        }, 1);
    };

    var dropFocusListeners = function () {
        eventHandles && eventHandles.detach && eventHandles.detach();
        eventHandles = null;
    };

    var moveAndCheck = function (dt, sequence) {
        var seq = sequence.slice(0),
            step = seq.shift(),
            self = this,
            doStep = function () {
                areSame(step[1], activeElement.get('text'), step[1] + ' ' + step[2]);
                step = seq.shift();
                if (step) {
                    fireKey(step[0]);
                    self.wait(doStep, 1);
                } else {
                    dropFocusListeners();
                    dt.destroy();
                }
            };
        setFocusListeners.call(this, dt, doStep);
    };





    suite.add(new Y.Test.Case({
        name: "Moving about",

        _moveAbout: function (dt) {
            moveAndCheck.call(this, dt,[
                /*
                 moveAndCheck takes a sequence of arrays each of them containing
                 - a keycode,
                 - the content of the cell where it should have landed
                 - a value to identify the step that failed.
                The first entry does not have a keycode because it is meant
                to check the initial focus, when the datatable gets the focus.
                Obviously, it expects that all cells have unique values so that
                it can easily be checked.  Header cells have a simple
                alphabetic name, cells have the column content plus a row index.
                 */
                [null, 'a',1],
                [UP,'a',2],
                [LEFT,'a',3],
                [DOWN,'a1',4],
                [RIGHT,'b1',5],
                [END,'e1',6],
                [RIGHT,'e1',7],
                [DOWN,'e2',8],
                [HOME,'a2',9],
                [END,'e2',10],
                [LEFT,'d2',11],
                [UP,'d1',12],
                [PGUP,'d',13],
                [DOWN,'d1',14],
                [UP,'d',15],
                [PGDN,'d19',16],
                [DOWN,'d19',17]
            ]);

        },

        "test moving about normal DT": function () {
            var dt = makeDT();

            this._moveAbout(dt);
        },


        "test moving about scrollable DT": function () {
            var dt = makeDTScroll({
                scrollable: 'xy',
                width: '100px',
                height: '150px'
            });
            this._moveAbout(dt);
        },

        "test moving about excluding headers": function () {
            var dt = makeDT({keyIntoHeaders: false});
            moveAndCheck.call(this, dt,[
                [null,'a1',1],
                [UP,'a1',2],
                [PGDN,'a19',3],
                [PGUP,'a1',4]
            ]);
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
            dropFocusListeners();
        },

        'test click on cells': function () {
            var dt = this.dt;

            var td = Y.all('.yui3-datatable-col-c').item(2);
            isNotNull(td);
            setFocusListeners.call(this, dt, function () {
                td.simulate('click');
                areSame(td, dt.get('focusedCell'),'clicked cell should be focusedCell');
                areSame(td, activeElement, 'clicked cell should be activeElement');
            });
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
            setFocusListeners.call(this, dt, function () {
                fireKey(ch);
                isNotNull(eventFacade);
                areSame(ch, eventFacade.keyCode);
                areSame(dt, self);
            });
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
            setFocusListeners.call(this, dt, function () {
                fireKey(DOWN);
                fireKey(ch);
                isNotNull(ev);
                areSame(ch, ev1.keyCode);
                areSame(dt.getCell([0,0]), ev.cell);
                areSame('a1', ev.record.get(ev.column.key));
                areSame(dt, self);
            });
        },

        'test add to keyActions with modifier': function () {
            var dt = this.dt,
                eventFacade = null,
                self = null;
            dt.keyActions['shift-space'] = function (e) {
                eventFacade = e;
                self = this;
            };
            setFocusListeners.call(this, dt, function () {
                fireKey(SPACE, {shiftKey:true});
                isNotNull(eventFacade);
                areSame(SPACE, eventFacade.keyCode);
                areSame(dt, self);
            });
        }
    }));


    suite.add(new Y.Test.Case({
        name: "nested headers",

        'test cell focusing': function () {
            var dt =  makeDT({
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
                ]
            });

            dt.set('focusedCell', dt.getCell([1,1]));
            dt.set('focusedCell', null);
            dt.focus();
            Y.Assert.areSame('abc', dt.get('focusedCell').get('text'));
        },

        'test nested headers': function () {
            var dt =  makeDT({
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
                ]
            });

            moveAndCheck.call(this, dt,[
                [null, 'abc', 1],
                [DOWN, 'ab',  2],
                [DOWN, 'a',   3],
                [DOWN, 'a1',  4],
                [RIGHT,'b1',  5],
                [UP,   'b',   6],
                [UP,   'ab',  7],
                [UP,   'abc', 8],
                [RIGHT,'de',  9],
                [DOWN, 'd',  10],
                [DOWN, 'd1', 11],
                [LEFT, 'c1', 12],
                [UP,   'c',  13],
                [UP,   'abc',14],
                [UP,   'abc',15],
                [RIGHT,'de', 15],
                [DOWN, 'd',  16],
                [DOWN, 'd1', 17],
                [DOWN, 'd2', 18],
                [PGUP, 'de', 19],
                [LEFT, 'abc',20],
                [DOWN, 'ab', 21],
                [RIGHT,'c',  22],
                [RIGHT,'d',  23],
                [LEFT, 'c',  24],
                [LEFT, 'ab', 25],
                [DOWN, 'a',  26],
                [RIGHT,'b',  27],
                [RIGHT,'c',  28],
                [RIGHT,'d',  29],
                [RIGHT,'e',  31],
                [RIGHT,'e',  32]
            ]);
        }
    }));


    Y.Test.Runner.add(suite);


},'', {requires: [ 'test', 'datatable-keynav', 'node-event-simulate','datatable-scroll', "base-build", 'event']});
