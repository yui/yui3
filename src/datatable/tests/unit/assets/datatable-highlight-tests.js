YUI.add('datatable-highlight-tests', function(Y) {

var suite = new Y.Test.Suite("DataTable: highlight");

var dt = new Y.DataTable({
        columns: [ 'name', 'qty' ],
        data: [
            { name: 'Apple', qty: 7 },
            { name: 'Banana', qty: 6 },
            { name: 'Cherry', qty: 5 },
            { name: 'Grape', qty: 4 },
            { name: 'Orange', qty: 3 },
            { name: 'Pineapple', qty: 2 }
        ],
        render: true
    }),

    areSame = Y.Assert.areSame,
    toHex = Y.Color.toHex,

    oddHex = '#FFFFFF',
    evenHex = '#EDF5FF',
    highHex = '#FEF2CD',

    a1 = dt.getCell([0,0]),
    a2 = dt.getCell([0,1]),
    b1 = dt.getCell([1,0]),
    b2 = dt.getCell([1,1]);

function turnOff () {
    dt.setAttrs({
        highlightRows: false,
        highlightCols: false,
        highlightCells: false
    });
}

function turnOn () {
    dt.setAttrs({
        highlightRows: true,
        highlightCols: true,
        highlightCells: true
    });
}


suite.add(new Y.Test.Case({

    name: "highlight",

    'setUp': function () {
        a1.detachAll();
        turnOff();
    },

    'tearDown': function () {
        a1.detachAll();
    },

    "test turning off all highlight features will result in no background changes": function () {
        var test = this;

        a1.after('mouseover', function () {

            setTimeout(function () {

                var _a1 = toHex(a1.getStyle('backgroundColor')),
                    _a2 = toHex(a2.getStyle('backgroundColor')),
                    _b1 = toHex(b1.getStyle('backgroundColor'));
                    _b2 = toHex(b2.getStyle('backgroundColor'));

                test.resume(function () {
                    areSame(oddHex, _a1);
                    areSame(oddHex, _a2);
                    areSame(evenHex, _b1);
                    areSame(evenHex, _b2);
                });

            }, 500);

        }, this);

        a1.simulate('mouseover');

        test.wait();


    },

    "test turning on row highlighting will result in only the row changing": function () {
        var test = this;

        dt.set('highlightRows', true);

        a1.after('mouseover', function () {
            setTimeout(function () {
                var _a1 = toHex(a1.getStyle('backgroundColor')),
                    _a2 = toHex(a2.getStyle('backgroundColor')),
                    _b1 = toHex(b1.getStyle('backgroundColor'));
                    _b2 = toHex(b2.getStyle('backgroundColor'));

                areSame(highHex, _a1);
                areSame(highHex, _a2);
                areSame(evenHex, _b1);
                areSame(evenHex, _b2);

                a1.simulate('mouseout');

            }, 500); // have to delay the check to give css transitions adequate time to process
        });

        a1.after('mouseout', function () {
            setTimeout(function () {
                var _a1 = toHex(a1.getStyle('backgroundColor')),
                    _a2 = toHex(a2.getStyle('backgroundColor')),
                    _b1 = toHex(b1.getStyle('backgroundColor'));
                    _b2 = toHex(b2.getStyle('backgroundColor'));

                test.resume(function () {
                    areSame(oddHex, _a1);
                    areSame(oddHex, _a2);
                    areSame(evenHex, _b1);
                    areSame(evenHex, _b2);
                });
            }, 500); // have to delay the check to give css transitions adequate time to process
        });

        a1.simulate('mouseover');

        test.wait();
    },

    "test turning on column highlighting will result in only the column changing": function () {
        var test = this;

        dt.set('highlightCols', true);

        a1.after('mouseover', function () {
            setTimeout(function () {
                var _a1 = toHex(a1.getStyle('backgroundColor')),
                    _a2 = toHex(a2.getStyle('backgroundColor')),
                    _b1 = toHex(b1.getStyle('backgroundColor'));
                    _b2 = toHex(b2.getStyle('backgroundColor'));

                areSame(highHex, _a1);
                areSame(oddHex, _a2);
                areSame(highHex, _b1);
                areSame(evenHex, _b2);

                a1.simulate('mouseout');

            }, 500); // have to delay the check to give css transitions adequate time to process
        });

        a1.after('mouseout', function () {
            setTimeout(function () {
                var _a1 = toHex(a1.getStyle('backgroundColor')),
                    _a2 = toHex(a2.getStyle('backgroundColor')),
                    _b1 = toHex(b1.getStyle('backgroundColor'));
                    _b2 = toHex(b2.getStyle('backgroundColor'));

                test.resume(function () {
                    areSame(oddHex, _a1);
                    areSame(oddHex, _a2);
                    areSame(evenHex, _b1);
                    areSame(evenHex, _b2);
                });

            }, 500); // have to delay the check to give css transitions adequate time to process
        });

        a1.simulate('mouseover');

        test.wait();
    },

    "test turning on cell highlighting will result in only the cell changing": function () {
        var test = this;

        dt.set('highlightCells', true);

        a1.after('mouseover', function () {
            setTimeout(function () {
                var _a1 = toHex(a1.getStyle('backgroundColor')),
                    _a2 = toHex(a2.getStyle('backgroundColor')),
                    _b1 = toHex(b1.getStyle('backgroundColor'));
                    _b2 = toHex(b2.getStyle('backgroundColor'));

                areSame(highHex, _a1);
                areSame(oddHex, _a2);
                areSame(evenHex, _b1);
                areSame(evenHex, _b2);

                a1.simulate('mouseout');

            }, 500); // have to delay the check to give css transitions adequate time to process
        });

        a1.after('mouseout', function () {
            setTimeout(function () {
                var _a1 = toHex(a1.getStyle('backgroundColor')),
                    _a2 = toHex(a2.getStyle('backgroundColor')),
                    _b1 = toHex(b1.getStyle('backgroundColor'));
                    _b2 = toHex(b2.getStyle('backgroundColor'));


                test.resume(function() {
                    areSame(oddHex, _a1);
                    areSame(oddHex, _a2);
                    areSame(evenHex, _b1);
                    areSame(evenHex, _b2);
                });
            }, 500); // have to delay the check to give css transitions adequate time to process
        });

        a1.simulate('mouseover');

        test.wait();
    },

    'test all off then on then off then on' : function () {

        var test = this,
            count = 0,
            mode = false;

        function _switch () {
            mode ? turnOn() : turnOff();

            mode = !mode;
            count++;

            a1.simulate('mouseover');
            test.wait();
        }

        a1.after('mouseover', function () {
            setTimeout(function () {
                var _a1 = toHex(a1.getStyle('backgroundColor')),
                    _a2 = toHex(a2.getStyle('backgroundColor')),
                    _b1 = toHex(b1.getStyle('backgroundColor'));
                    _b2 = toHex(b2.getStyle('backgroundColor'));

                test.resume(function () {
                    if (!mode) { // need to reverse case because mode is changed in _switch
                        areSame(highHex, _a1);
                        areSame(highHex, _a2);
                        areSame(highHex, _b1);
                        areSame(evenHex, _b2);
                    } else {
                        areSame(oddHex, _a1);
                        areSame(oddHex, _a2);
                        areSame(evenHex, _b1);
                        areSame(evenHex, _b2);
                    }

                    a1.simulate('mouseout');

                    if (count < 5) {
                        _switch();
                    }
                });

            }, 500); // have to delay the check to give css transitions adequate time to process
        });

        _switch();

    }


}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['datatable', 'datatable-highlight', 'node-event-simulate', 'test', 'color']});
