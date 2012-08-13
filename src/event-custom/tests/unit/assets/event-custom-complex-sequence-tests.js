YUI.add("event-custom-complex-sequence-tests", function(Y) {

    var suite = new Y.Test.Suite("Firing Sequence");

    suite.add(new Y.Test.Case({
        name : "Single Event Sequence",

        setUp : function () {
            this.source = new Y.EventTarget({
                emitFacade: true
            });
        },

        test_seqSimple : function () {
            var results = '';

            this.source.publish('foo');
            this.source.on('foo', function () { results += 'A'; });
            this.source.after('foo', function () { results += 'B'; });

            this.source.fire('foo');

            Y.Assert.areSame("AB",results);
        },

        test_seqDefaultFnComplete : function () {
            var results = '';

            this.source.publish('foo', {
                defaultFn: function () { results += 'B'; }});

            this.source.on('foo', function () { results += 'A'; });
            this.source.after('foo', function () { results += 'C'; });

            this.source.fire('foo');

            Y.Assert.areSame("ABC",results);
        },

        test_seqDefaultFnPrevented : function () {
            var results = '';

            this.source.publish('foo', {
                emitFacade: true,
                defaultFn: function () { results += '1'; }});

            this.source.on('foo', function (e) {
                results += 'A';
                e.preventDefault();
            });
            this.source.after('foo', function () { results += '2'; });

            this.source.fire('foo');

            Y.Assert.areSame("A",results);
        },

        test_seqPreventedFnComplete : function () {
            var results = '';

            this.source.publish('foo', {
                preventedFn: function () { results += '1'; }});

            this.source.on('foo', function () { results += 'A'; });
            this.source.after('foo', function () { results += 'B'; });

            this.source.fire('foo');

            Y.Assert.areSame("AB",results);
        },

        test_seqPreventedFnPrevented : function () {
            var results = '';

            this.source.publish('foo', {
                emitFacade: true,
                preventedFn: function () { results += 'B'; }});

            this.source.on('foo', function (e) {
                results += 'A';
                e.preventDefault();
            });
            this.source.after('foo', function () { results += '1'; });

            this.source.fire('foo');

            Y.Assert.areSame("AB",results);
        },

        test_seqDefaultAndPreventedFnComplete : function () {
            var results = '';

            this.source.publish('foo', {
                defaultFn: function () { results += 'B'; },
                preventedFn: function () { results += '1'; }
            });

            this.source.on('foo', function () { results += 'A'; });
            this.source.after('foo', function () { results += 'C'; });

            this.source.fire('foo');

            Y.Assert.areSame("ABC",results);
        },

        test_seqDefaultAndPreventedFnPrevented : function () {
            var results = '';

            this.source.publish('foo', {
                emitFacade: true,
                defaultFn: function () { results += '1'; },
                preventedFn: function () { results += 'B'; }
            });

            this.source.on('foo', function (e) {
                results += 'A';
                e.preventDefault();
            });
            this.source.after('foo', function () { results += '2'; });

            this.source.fire('foo');

            Y.Assert.areSame("AB",results);
        }
    }));

    /*
    suite.add(new Y.Test.Case({
        name : "Broadcast",
            
        setUp : function () {
            this.source = new Y.EventTarget;
        },

        test_broadcast0: function () {
            var results = '';

            this.source.publish('foo', { broadcast: 0 });

            this.source.on('foo', function () { results += 'A'; });
            this.source.after('foo', function () { results += 'B'; });

            Y.on('foo', function () { results += '1'; });
            Y.after('foo', function () { results += '2'; });

            Y.Global.on('foo', function () { results += '3'; });
            Y.Global.after('foo', function () { results += '4'; });

            this.source.fire('foo');

            Y.Assert.areSame('AB', results);
        },

        test_broadcast1: function () {
            var results = '';

            this.source.publish('foo', { broadcast: 1 });

            this.source.on('foo', function () { results += 'A'; });
            this.source.after('foo', function () { results += 'D'; });

            Y.on('foo', function () { results += 'B'; });
            Y.after('foo', function () { results += 'C'; });

            Y.Global.on('foo', function () { results += '1'; });
            Y.Global.after('foo', function () { results += '2'; });

            this.source.fire('foo');

            // Y.Assert.areSame('ABCD', results);
            Y.Assert.areSame('ADBC', results);
        },

        test_broadcast2: function () {
            var results = '';

            this.source.publish('foo', { broadcast: 2 });

            this.source.on('foo', function () { results += 'A'; });
            this.source.after('foo', function () { results += 'F'; });

            Y.on('foo', function () { results += 'B'; });
            Y.after('foo', function () { results += 'E'; });

            Y.Global.on('foo', function () { results += 'C'; });
            Y.Global.after('foo', function () { results += 'D'; });

            this.source.fire('foo');

            // Y.Assert.areSame('ABCDEF', results);
            Y.Assert.areSame('ABCDEF', results);
        },

        test_broadcast1Complete: function () {
            var results = '';

            this.source.publish('foo', {
                broadcast: 1,
                emitFacade: true,
                defaultFn: function () { results += 'C'; },
                preventedFn: function () { results += '1'; },
                stoppedFn: function () { results += '2' }
            });

            this.source.on('foo', function () { results += 'A'; });
            this.source.after('foo', function () { results += 'E'; });

            Y.on('foo', function () { results += 'B'; });
            Y.after('foo', function () { results += 'D'; });

            Y.Global.on('foo', function () { results += '3'; });
            Y.Global.after('foo', function () { results += '4'; });

            this.source.fire('foo');

            // Y.Assert.areSame('ABCDE', results);
            Y.Assert.areSame('ACBDE', results);
        },

        test_broadcast1Prevented: function () {
            var results = '';

            this.source.publish('foo', {
                broadcast: 1,
                emitFacade: true,
                defaultFn: function () { results += '1'; },
                preventedFn: function () { results += 'C'; },
                stoppedFn: function () { results += '2' }
            });

            this.source.on('foo', function () { results += 'A'; });
            this.source.after('foo', function () { results += '3'; });

            Y.on('foo', function (e) {
                results += 'B';
                e.preventDefault();
            });
            Y.after('foo', function () { results += '4'; });

            Y.Global.on('foo', function () { results += '5'; });
            Y.Global.after('foo', function () { results += '6'; });

            this.source.fire('foo');

            // Y.Assert.areSame('ABC', results);
            Y.Assert.areSame('A1BC4', results);
        },

        test_broadcast1StoppedAtSource: function () {
            var results = '';

            this.source.publish('foo', {
                broadcast: 1,
                emitFacade: true,
                defaultFn: function () { results += 'C'; },
                preventedFn: function () { results += '1'; },
                stoppedFn: function () { results += 'B' }
            });

            this.source.on('foo', function (e) {
                results += 'A';
                e.stopPropagation();
            });
            this.source.after('foo', function () { results += 'D'; });

            Y.on('foo', function () { results += '1'; });
            Y.after('foo', function () { results += '2'; });

            Y.Global.on('foo', function () { results += '3'; });
            Y.Global.after('foo', function () { results += '4'; });

            this.source.fire('foo');

            // Is this right?  stopProp allows defaultFn, but to what level should
            // the after subscribers be executed?
            Y.Assert.areSame('ABCD', results);
        },

        test_broadcast1StoppedAtYUIInstance: function () {
            var results = '';

            this.source.publish('foo', {
                broadcast: 1,
                emitFacade: true,
                defaultFn: function () { results += 'D'; },
                preventedFn: function () { results += '1'; },
                stoppedFn: function () { results += 'C' }
            });

            this.source.on('foo', function (e) { results += 'A'; });
            this.source.after('foo', function () { results += 'F'; });

            Y.on('foo', function (e) {
                results += 'B';
                e.stopPropagation();
            });
            Y.after('foo', function () { results += 'E'; });

            Y.Global.on('foo', function () { results += '2'; });
            Y.Global.after('foo', function () { results += '3'; });

            this.source.fire('foo');

            // Is this right?  stopProp allows defaultFn, but to what level should
            // the after subscribers be executed?  --- No, broadcast is not bubbling
            // Y.Assert.areSame('ABCDEF', results);
            Y.Assert.areSame('AD1BCE', results);
        },

        test_broadcast2Complete: function () {
            var results = '';

            this.source.publish('foo', {
                broadcast: 2,
                emitFacade: true,
                defaultFn: function () { results += 'C'; },
                preventedFn: function () { results += '1'; },
                stoppedFn: function () { results += '2' }
            });

            this.source.on('foo', function () { results += 'A'; });
            this.source.after('foo', function () { results += 'E'; });

            Y.on('foo', function () { results += 'B'; });
            Y.after('foo', function () { results += 'D'; });

            Y.Global.on('foo', function () { results += '3'; });
            Y.Global.after('foo', function () { results += '4'; });

            this.source.fire('foo');

            Y.Assert.areSame('ABCDE', results);
        },

        test_broadcast2PreventedAtYUIInstance: function () {
            var results = '';

            this.source.publish('foo', {
                broadcast: 2,
                emitFacade: true,
                defaultFn: function () { results += '1'; },
                preventedFn: function () { results += 'C'; },
                stoppedFn: function () { results += '2' }
            });

            this.source.on('foo', function () { results += 'A'; });
            this.source.after('foo', function () { results += '3'; });

            Y.on('foo', function (e) {
                results += 'B';
                e.preventDefault();
            });
            Y.after('foo', function () { results += '4'; });

            // preventDefault does not stop event bubbling
            Y.Global.on('foo', function () { results += 'D'; });
            Y.Global.after('foo', function () { results += '6'; });

            this.source.fire('foo');

            Y.Assert.areSame('ABCD', results);
        },

        test_broadcast2PreventedAtYUIGlobal: function () {
            var results = '';

            this.source.publish('foo', {
                broadcast: 2,
                emitFacade: true,
                defaultFn: function () { results += '1'; },
                preventedFn: function () { results += 'D'; },
                stoppedFn: function () { results += '2' }
            });

            this.source.on('foo', function () { results += 'A'; });
            this.source.after('foo', function () { results += '3'; });

            Y.on('foo', function (e) { results += 'B'; });
            Y.after('foo', function () { results += '4'; });

            Y.Global.on('foo', function (e) {
                results += 'C';
                e.preventDefault();
            });
            Y.Global.after('foo', function () { results += '5'; });

            this.source.fire('foo');

            Y.Assert.areSame('ABCD', results);
        },

        test_broadcast2StoppedAtSource: function () {
            var results = '';

            this.source.publish('foo', {
                broadcast: 2,
                emitFacade: true,
                defaultFn: function () { results += 'C'; },
                preventedFn: function () { results += '1'; },
                stoppedFn: function () { results += 'B' }
            });

            this.source.on('foo', function (e) {
                results += 'A';
                e.stopPropagation();
            });
            this.source.after('foo', function () { results += 'D'; });

            Y.on('foo', function () { results += '1'; });
            Y.after('foo', function () { results += '2'; });

            Y.Global.on('foo', function () { results += '3'; });
            Y.Global.after('foo', function () { results += '4'; });

            this.source.fire('foo');

            // Is this right?  stopProp allows defaultFn, but to what level should
            // the after subscribers be executed?
            Y.Assert.areSame('ABCD', results);
        },

        test_broadcast2StoppedAtYUIInstance: function () {
            var results = '';

            this.source.publish('foo', {
                broadcast: 2,
                emitFacade: true,
                defaultFn: function () { results += 'D'; },
                preventedFn: function () { results += '1'; },
                stoppedFn: function () { results += 'C' }
            });

            this.source.on('foo', function (e) { results += 'A'; });
            this.source.after('foo', function () { results += 'F'; });

            Y.on('foo', function (e) {
                results += 'B';
                e.stopPropagation();
            });
            Y.after('foo', function () { results += 'E'; });

            Y.Global.on('foo', function () { results += '2'; });
            Y.Global.after('foo', function () { results += '3'; });

            this.source.fire('foo');

            // Is this right?  stopProp allows defaultFn, but to what level should
            // the after subscribers be executed?
            Y.Assert.areSame('ABCDEF', results);
        },

        test_broadcast2StoppedAtYUIGlobal: function () {
            var results = '';

            this.source.publish('foo', {
                broadcast: 2,
                emitFacade: true,
                defaultFn: function () { results += 'E'; },
                preventedFn: function () { results += '1'; },
                stoppedFn: function () { results += 'D' }
            });

            this.source.on('foo', function (e) { results += 'A'; });
            this.source.after('foo', function () { results += 'H'; });

            Y.on('foo', function () { results += 'B'; });
            Y.after('foo', function () { results += 'G'; });

            Y.Global.on('foo', function (e) {
                results += 'C';
                e.stopPropagation(); // should be moot at this point
            });
            Y.Global.after('foo', function () { results += 'F'; });

            this.source.fire('foo');

            // Is this right?  stopProp allows defaultFn, but to what level should
            // the after subscribers be executed?
            Y.Assert.areSame('ABCDEFGH', results);
        }

    }));

    */

    suite.add(new Y.Test.Case({
        name : "Bubble",

        setUp : function () {
            this.source = new Y.EventTarget({
                emitFacade: true
            });
            this.middleMan1 = new Y.EventTarget({
                emitFacade: true
            });
            this.middleMan2 = new Y.EventTarget({
                emitFacade: true
            });

            this.source.addTarget(this.middleMan1);
            this.source.addTarget(this.middleMan2);
        },

        test_bubbleComplete: function () {
            var results = '';

            this.source.publish('foo', {
                broadcast: 0,
                defaultFn : function () { results += 'D'; },
                preventedFn : function () { results += '1'; },
                stoppedFn : function () { results += '2'; }
            });

            this.source.on('foo', function () { results += 'A'; });
            this.source.after('foo', function () { results += 'G'; });

            this.middleMan1.on('foo', function () { results += 'B'; });
            this.middleMan1.after('foo', function () { results += 'F'; });

            this.middleMan2.on('foo', function () { results += 'C'; });
            this.middleMan2.after('foo', function () { results += 'E'; });

            this.source.fire('foo');

            Y.Assert.areSame('ABCDGEF', results);
        },

        /*
        test_bubblePrevented: function () {
            var results = '';

            this.source.publish('foo', {
                broadcast: 0,
                emitFacade: true,
                defaultFn : function () { results += '1'; },
                preventedFn : function () { results += 'C'; },
                stoppedFn : function () { results += '2'; }
            });

            this.source.on('foo', function () { results += 'A'; });
            this.source.after('foo', function () { results += '3'; });

            this.middleMan1.on('foo', function (e) {
                results += 'B';
                e.preventDefault();
            });
            this.middleMan1.after('foo', function () { results += '4'; });

            this.middleMan2.on('foo', function () { results += 'D'; });
            this.middleMan2.after('foo', function () { results += '5'; });

            this.source.fire('foo');

            Y.Assert.areSame('ABCD', results);
        },

        test_bubbleStopped: function () {
            var results = '';

            this.source.publish('foo', {
                broadcast: 0,
                emitFacade: true,
                defaultFn : function () { results += 'D'; },
                preventedFn : function () { results += '1'; },
                stoppedFn : function () { results += 'C'; }
            });

            this.source.on('foo', function () { results += 'A'; });
            this.source.after('foo', function () { results += 'F'; });

            this.middleMan1.on('foo', function (e) {
                results += 'B';
                e.stopPropagation();
            });
            this.middleMan1.after('foo', function () { results += 'E'; });

            this.middleMan2.on('foo', function () { results += '2'; });
            this.middleMan2.after('foo', function () { results += '3'; });

            this.source.fire('foo');

            Y.Assert.areSame('ABCDEF', results);
        },

        test_bubbleAndBroadcast1Complete: function () {
            var results = '';

            this.source.publish('foo', {
                emitFacade: true,
                broadcast: 1,
                defaultFn : function () { results += 'E'; },
                preventedFn : function () { results += '1'; },
                stoppedFn : function () { results += '2'; }
            });

            this.source.on('foo', function () { results += 'A'; });
            this.source.after('foo', function () { results += 'I'; });

            this.middleMan1.on('foo', function (e) { results += 'B'; });
            this.middleMan1.after('foo', function () { results += 'H'; });

            this.middleMan2.on('foo', function () { results += 'C'; });
            this.middleMan2.after('foo', function () { results += 'G'; });

            Y.on('foo', function () { results += 'D'; });
            Y.after('foo', function () { results += 'F'; });

            Y.Global.on('foo', function () { results += '3'; });
            Y.Global.after('foo', function () { results += '4'; });

            this.source.fire('foo');

            Y.Assert.areSame('ABCDEFGHI', results);
        }
        */

    }));

    /*
        test_bubbleAndBroadcast1Prevented: function () {
            var results = '';

            this.source.publish('foo', {
                emitFacade: true,
                broadcast: 1,
                defaultFn : function () { results += '1'; },
                preventedFn : function () { results += 'C'; },
                stoppedFn : function () { results += '2'; }
            });

            this.source.on('foo', function () { results += 'A'; });
            this.source.after('foo', function () { results += '3'; });

            this.middleMan1.on('foo', function (e) {
                results += 'B';
                e.preventDefault();
            });
            this.middleMan1.after('foo', function () { results += '4'; });

            this.middleMan2.on('foo', function () { results += 'D'; });
            this.middleMan2.after('foo', function () { results += '5'; });

            Y.on('foo', function () { results += 'E'; });
            Y.after('foo', function () { results += '6'; });

            Y.Global.on('foo', function () { results += '7'; });
            Y.Global.after('foo', function () { results += '8'; });

            this.source.fire('foo');

            Y.Assert.areSame('ABCDE', results);
        },

        test_bubbleAndBroadcast1Stopped: function () {
            var results = '';

            this.source.publish('foo', {
                emitFacade: true,
                broadcast: 1,
                defaultFn : function () { results += 'E'; },
                preventedFn : function () { results += '1'; },
                stoppedFn : function () { results += 'D'; }
            });

            this.source.on('foo', function () { results += 'A'; });
            this.source.after('foo', function () { results += 'H'; });

            this.middleMan1.on('foo', function (e) { results += 'B'; });
            this.middleMan1.after('foo', function () { results += 'G'; });

            this.middleMan2.on('foo', function (e) {
                results += 'C';
                e.stopPropagation();
            });
            this.middleMan2.after('foo', function () { results += 'F'; });

            Y.on('foo', function () { results += '2'; });
            Y.after('foo', function () { results += '3'; });

            Y.Global.on('foo', function () { results += '4'; });
            Y.Global.after('foo', function () { results += '5'; });

            this.source.fire('foo');

            Y.Assert.areSame('ABCDEFGH', results);
        },

        test_bubbleAndBroadcast2Prevented: function () {
            var results = '';

            this.source.publish('foo', {
                emitFacade: true,
                broadcast: 2,
                defaultFn : function () { results += '1'; },
                preventedFn : function () { results += 'D'; },
                stoppedFn : function () { results += '2'; }
            });

            this.source.on('foo', function () { results += 'A'; });
            this.source.after('foo', function () { results += '3'; });

            this.middleMan1.on('foo', function (e) { results += 'B'; });
            this.middleMan1.after('foo', function () { results += '4'; });

            this.middleMan2.on('foo', function (e) {
                results += 'C';
                e.preventDefault();
            });
            this.middleMan2.after('foo', function () { results += '5'; });

            Y.on('foo', function () { results += 'E'; });
            Y.after('foo', function () { results += '6'; });

            Y.Global.on('foo', function () { results += 'F'; });
            Y.Global.after('foo', function () { results += '7'; });

            this.source.fire('foo');

            Y.Assert.areSame('ABCDE', results);
        },

        test_bubbleAndBroadcast2Stopped: function () {
            var results = '';

            this.source.publish('foo', {
                emitFacade: true,
                broadcast: 2,
                defaultFn : function () { results += 'E'; },
                preventedFn : function () { results += '1'; },
                stoppedFn : function () { results += 'D'; }
            });

            this.source.on('foo', function () { results += 'A'; });
            this.source.after('foo', function () { results += 'H'; });

            this.middleMan1.on('foo', function (e) { results += 'B'; });
            this.middleMan1.after('foo', function () { results += 'G'; });

            this.middleMan2.on('foo', function (e) {
                results += 'C';
                e.stopPropagation();
            });
            this.middleMan2.after('foo', function () { results += 'F'; });

            Y.on('foo', function () { results += '2'; });
            Y.after('foo', function () { results += '3'; });

            Y.Global.on('foo', function () { results += '4'; });
            Y.Global.after('foo', function () { results += '5'; });

            this.source.fire('foo');

            Y.Assert.areSame('ABCDEFGH', results);
        }

    }));
            */


    Y.Test.Runner.add(suite);

}, '@VERSION@' ,{requires:['event-custom', 'test']}); 