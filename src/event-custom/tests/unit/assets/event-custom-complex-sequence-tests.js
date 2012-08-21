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

    // 08/20/2012 - Based on a conversation with Adam Moore, original Custom Event author,
    // broadcast was designed to be completely independent of bubbling, and broadcast
    // listeners do no participate in the propagation flow. The tests below were modified, 
    // (and enabled) based on that feedback, to reflect current 'as designed' behavior and 
    // implementation.

    suite.add(new Y.Test.Case({
        name : "Broadcast With Facade",
            
        setUp : function () {
            this.source = new Y.EventTarget({
                emitFacade:true
            });
        },

        tearDown : function() {
            if (this.handles) {
                Y.each(this.handles, function(h) {
                    h.detach();
                });
            }
        },

        test_broadcast_0: function () {
            var results = '';

            this.source.publish('foo', { 
                broadcast: 0,

                defaultFn : function() {
                    results += 'B';
                }
            });

            this.source.on('foo', function () { results += 'A'; });
            this.source.after('foo', function () { results += 'C'; });

            this.handles = [
                Y.on('foo', function () { results += '1'; }),
                Y.after('foo', function () { results += '2'; }),

                Y.Global.on('foo', function () { results += '3'; }),
                Y.Global.after('foo', function () { results += '4'; })
            ];

            this.source.fire('foo');

            Y.Assert.areSame('ABC', results);
        },


        test_broadcast_1: function () {

            var results = '';

            this.source.publish('foo', { 
                broadcast: 1,
                
                defaultFn : function() {
                    results += 'B';
                }
            });

            this.source.on('foo', function () { results += 'A'; });
            this.source.after('foo', function () { results += 'E'; });

            this.handles = [
                Y.on('foo', function () { results += 'C'; }),
                Y.after('foo', function () { results += 'D'; }),

                Y.Global.on('foo', function () { results += '1'; }),
                Y.Global.after('foo', function () { results += '2'; })
            ];

            this.source.fire('foo');

            Y.Assert.areSame('ABCDE', results);
        },

        test_broadcast_2: function () {
            var results = '';

            this.source.publish('foo', { 
                broadcast: 2,

                defaultFn : function() {
                    results += 'B';
                }
            });

            this.source.on('foo', function () { results += 'A'; });
            this.source.after('foo', function () { results += 'G'; });

            this.handles = [
                Y.on('foo', function () { results += 'C'; }),
                Y.after('foo', function () { results += 'D'; }),

                Y.Global.on('foo', function () { results += 'E'; }),
                Y.Global.after('foo', function () { results += 'F'; })
            ];

            this.source.fire('foo');

            Y.Assert.areSame('ABCDEFG', results);
        },

        test_broadcast_1_complete: function () {

            var results = '';

            this.source.publish('foo', {
                broadcast: 1,
                emitFacade: true,
                defaultFn: function () { results += 'B'; },
                preventedFn: function () { results += '1'; },
                stoppedFn: function () { results += '2' }
            });

            this.source.on('foo', function () { results += 'A'; });
            this.source.after('foo', function () { results += 'E'; });

            this.handles = [
                Y.on('foo', function () { results += 'C'; }),
                Y.after('foo', function () { results += 'D'; }),

                Y.Global.on('foo', function () { results += '3'; }),
                Y.Global.after('foo', function () { results += '4'; })
            ];

            this.source.fire('foo');

            Y.Assert.areSame('ABCDE', results);
        },

        // Bug. e.preventDefault() in the Y on listener should not stop the source after listener - 
        'test_broadcast_1_prevented_at_YUI_Instance': function () {
            var results = '';

            this.source.publish('foo', {
                broadcast: 1,
                emitFacade: true,
                defaultFn: function () { results += 'B'; },
                preventedFn: function () { results += '1'; },
                stoppedFn: function () { results += '2' }
            });

            this.source.on('foo', function () { results += 'A'; });
            this.source.after('foo', function () { results += 'E'; });

            this.handles = [
                Y.on('foo', function (e) {
                    results += 'C';
                    e.preventDefault();
                }),
                Y.after('foo', function () { results += 'D'; }),

                Y.Global.on('foo', function () { results += '3'; }),
                Y.Global.after('foo', function () { results += '4'; })
            ];

            this.source.fire('foo');

            Y.Assert.areSame('ABCD', results);
        },

        test_broadcast_1_stopped_at_source: function () {
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

            this.handles = [
                Y.on('foo', function () { results += '1'; }),
                Y.after('foo', function () { results += '2'; }),

                Y.Global.on('foo', function () { results += '3'; }),
                Y.Global.after('foo', function () { results += '4'; })
            ];

            this.source.fire('foo');

            // Based on current impl, we only broadcast if !stopped. In this case we have stopped. 
            // There's something wrong with this if the working definition is that broadcast is independent of bubble, but it's explicitly implemented this way.
            Y.Assert.areSame('ABCD', results);
        },

        test_broadcast_1_stopped_at_YUI_Instance: function () {
            var results = '';

            this.source.publish('foo', {
                broadcast: 1,
                emitFacade: true,
                defaultFn: function () { results += 'B'; },
                preventedFn: function () { results += '1'; },
                stoppedFn: function () { results += 'D' }
            });

            this.source.on('foo', function (e) { results += 'A'; });
            this.source.after('foo', function () { results += 'F'; });

            this.handles = [
                Y.on('foo', function (e) {
                    results += 'C';
                    e.stopPropagation();
                }),
                Y.after('foo', function () { results += 'E'; }),

                Y.Global.on('foo', function () { results += '1'; }),
                Y.Global.after('foo', function () { results += '2'; })
            ];

            this.source.fire('foo');

            Y.Assert.areSame('ABCDEF', results);
        },

        'test_broadcast_2_complete': function () {
            var results = '';

            this.source.publish('foo', {
                broadcast: 2,
                emitFacade: true,
                defaultFn: function () { results += 'B'; },
                preventedFn: function () { results += '1'; },
                stoppedFn: function () { results += '2' }
            });

            this.source.on('foo', function () { results += 'A'; });
            this.source.after('foo', function () { results += 'G'; });

            this.handles = [
                Y.on('foo', function () { results += 'C'; }),
                Y.after('foo', function () { results += 'D'; }),

                Y.Global.on('foo', function () { results += 'E'; }),
                Y.Global.after('foo', function () { results += 'F'; })
            ];

            this.source.fire('foo');

            Y.Assert.areSame('ABCDEFG', results);
        },

        // Bug. e.preventDefault() in the Y on listener should not stop the source after listener?
        'test_broadcast_2_prevented_at_YUI_Instance': function () {
            var results = '';

            this.source.publish('foo', {
                broadcast: 2,
                emitFacade: true,
                defaultFn: function () { results += 'B'; },
                preventedFn: function () { results += '1'; },
                stoppedFn: function () { results += '2' }
            });

            this.source.on('foo', function () { results += 'A'; });
            this.source.after('foo', function () { results += '3'; });

            this.handles = [
                Y.on('foo', function (e) { results += 'C'; e.preventDefault(); }),
                Y.after('foo', function () { results += 'D'; }),

                // preventDefault does not stop event bubbling
                Y.Global.on('foo', function () { results += 'E'; }),
                Y.Global.after('foo', function () { results += 'F'; })
            ];

            this.source.fire('foo');

            Y.Assert.areSame('ABCDEF', results);
        },

        // Bug. e.preventDefault() in the YUI on listener should not stop the source after listener?
        test_broadcast_2_prevented_at_YUI_global: function () {
            var results = '';

            this.source.publish('foo', {
                broadcast: 2,
                emitFacade: true,
                defaultFn: function () { results += 'B'; },
                preventedFn: function () { results += '1'; },
                stoppedFn: function () { results += '2' }
            });

            this.source.on('foo', function () { results += 'A'; });
            this.source.after('foo', function () { results += '3'; });

            this.handles = [
                Y.on('foo', function (e) { results += 'C'; }),
                Y.after('foo', function () { results += 'D'; }),

                Y.Global.on('foo', function (e) {
                    results += 'E';
                    e.preventDefault();
                }),
                Y.Global.after('foo', function () { results += 'F'; })
            ];

            this.source.fire('foo');

            Y.Assert.areSame('ABCDEF', results);
        },

        test_broadcast_2_stopped_at_source: function () {
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

            this.handles = [
                Y.on('foo', function () { results += '1'; }),
                Y.after('foo', function () { results += '2'; }),

                Y.Global.on('foo', function () { results += '3'; }),
                Y.Global.after('foo', function () { results += '4'; })
            ];

            this.source.fire('foo');

            // Based on current impl, we only broadcast if !stopped. In this case we have stopped. 
            // There's something wrong with this if the working definition is that broadcast is independent of bubble, but it's explicitly implemented this way.
            Y.Assert.areSame('ABCD', results);
        },

        test_broadcast_2_stopped_at_YUI_instance: function () {
            var results = '';

            this.source.publish('foo', {
                broadcast: 2,
                emitFacade: true,
                defaultFn: function () { results += 'B'; },
                preventedFn: function () { results += '1'; },
                stoppedFn: function () { results += 'D' }
            });

            this.source.on('foo', function (e) { results += 'A'; });
            this.source.after('foo', function () { results += 'H'; });

            this.handles = [
                Y.on('foo', function (e) {
                    results += 'C';
                    e.stopPropagation();
                }),
                Y.after('foo', function () { results += 'E'; }),

                Y.Global.on('foo', function () { results += 'F'; }),
                Y.Global.after('foo', function () { results += 'G'; })
            ];

            this.source.fire('foo');

            Y.Assert.areSame('ABCDEFGH', results);
        },

        test_broadcast_2_stopped_at_YUI_global: function () {
            var results = '';

            this.source.publish('foo', {
                broadcast: 2,
                emitFacade: true,
                defaultFn: function () { results += 'B'; },
                preventedFn: function () { results += '1'; },
                stoppedFn: function () { results += 'F' }
            });

            this.source.on('foo', function (e) { results += 'A'; });
            this.source.after('foo', function () { results += 'H'; });

            this.handles = [
                Y.on('foo', function (e) {results += 'C';}),
                Y.after('foo', function () { results += 'D'; }),

                Y.Global.on('foo', function (e) { 
                    results += 'E'; 
                    e.stopPropagation();
                }),
                Y.Global.after('foo', function () { results += 'G'; })
            ];

            this.source.fire('foo');

            Y.Assert.areSame('ABCDEFGH', results);
        }

    }));

    suite.add(new Y.Test.Case({
        name : "Bubble Single Target",

        setUp : function () {

            this.source = new Y.EventTarget({
                emitFacade: true
            });

            this.middleMan1 = new Y.EventTarget({
                emitFacade: true
            });

            this.source.addTarget(this.middleMan1);
        },

        test_bubbleComplete: function () {

            var results = '';

            this.source.publish('foo', {
                defaultFn : function () { results += 'C'; },
                preventedFn : function () { results += '1'; },
                stoppedFn : function () { results += '2'; }
            });

            this.source.on('foo', function () { results += 'A'; });
            this.source.after('foo', function () { results += 'D'; });

            this.middleMan1.on('foo', function () { results += 'B'; });
            this.middleMan1.after('foo', function () { results += 'E'; });

            this.source.fire('foo');

            Y.Assert.areSame('ABCDE', results);
        },

        test_bubblePrevented: function () {
            var results = '';

            this.source.publish('foo', {
                broadcast: 0,
                defaultFn : function () { results += '1'; },
                preventedFn : function () { results += 'C'; },
                stoppedFn : function () { results += '2'; }
            });

            this.source.on('foo', function (e) { results += 'A'; e.preventDefault(); });
            this.source.after('foo', function () { results += '3'; });

            this.middleMan1.on('foo', function () { results += 'B'; });
            this.middleMan1.after('foo', function () { results += '4'; });

            this.source.fire('foo');

            Y.Assert.areSame('ABC', results);
        },

        test_bubblePreventedOnTarget: function () {
            var results = '';

            this.source.publish('foo', {
                broadcast: 0,
                defaultFn : function () { results += '1'; },
                preventedFn : function () { results += 'C'; },
                stoppedFn : function () { results += '2'; }
            });

            this.source.on('foo', function (e) { results += 'A'; });
            this.source.after('foo', function () { results += '3'; });

            this.middleMan1.on('foo', function (e) { results += 'B'; e.preventDefault(); });
            this.middleMan1.after('foo', function () { results += '4'; });

            this.source.fire('foo');

            Y.Assert.areSame('ABC', results);
        },

        test_bubbleStopped: function () {

            var results = '';

            this.source.publish('foo', {
                broadcast: 0,
                defaultFn : function () { results += 'C'; },
                preventedFn : function () { results += '1'; },
                stoppedFn : function () { results += 'B'; }
            });

            this.source.on('foo', function (e) { results += 'A'; e.stopPropagation(); });
            this.source.after('foo', function () { results += 'D'; });

            this.middleMan1.on('foo', function (e) {results += '2';});
            this.middleMan1.after('foo', function () { results += '3'; });

            this.source.fire('foo');

            Y.Assert.areSame('ABCD', results);
        },

        test_bubbleStoppedOnTarget: function () {

            var results = '';

            this.source.publish('foo', {
                broadcast: 0,
                defaultFn : function () { results += 'C'; },
                preventedFn : function () { results += '1'; },
                stoppedFn : function () { results += '2'; }
            });

            this.source.on('foo', function (e) { results += 'A';});
            this.source.after('foo', function () { results += 'D';  });

            this.middleMan1.on('foo', function (e) {results += 'B'; e.stopPropagation(); }); // No effect. Doesn't bubble anywhere
            this.middleMan1.after('foo', function () { results += 'E'; });

            this.source.fire('foo');

            Y.Assert.areSame('ABCDE', results);
        },

        test_bubbleHalted: function () {

            var results = '';

            this.source.publish('foo', {
                broadcast: 0,
                defaultFn : function () { results += '1'; },
                preventedFn : function () { results += 'C'; },
                stoppedFn : function () { results += 'B'; }
            });

            this.source.on('foo', function (e) { results += 'A'; e.halt(); });
            this.source.after('foo', function () { results += '2'; });

            this.middleMan1.on('foo', function (e) {results += '3';});
            this.middleMan1.after('foo', function () { results += '4'; });

            this.source.fire('foo');

            Y.Assert.areSame('ABC', results);
        },

        test_bubbleHaltedOnTarget: function () {

            var results = '';

            this.source.publish('foo', {
                broadcast: 0,
                defaultFn : function () { results += '1'; },
                preventedFn : function () { results += 'C'; },
                stoppedFn : function () { results += '2'; } // No effect. Doesn't bubble anywhere.
            });

            this.source.on('foo', function (e) { results += 'A'; });
            this.source.after('foo', function () { results += '3'; });

            this.middleMan1.on('foo', function (e) {results += 'B';  e.halt();});
            this.middleMan1.after('foo', function () { results += '4'; });

            this.source.fire('foo');

            Y.Assert.areSame('ABC', results);
        }

    }));

    /*
    suite.add(new Y.Test.Case({
        name : "Bubble Two Targets",

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
                defaultFn : function () { results += 'D'; },
                preventedFn : function () { results += '1'; },
                stoppedFn : function () { results += '2'; }
            });

            this.source.on('foo', function () { results += 'A'; });
            this.source.after('foo', function () { results += 'E'; });

            this.middleMan1.on('foo', function () { results += 'B'; });
            this.middleMan1.after('foo', function () { results += 'G'; });

            this.middleMan2.on('foo', function () { results += 'C'; });
            this.middleMan2.after('foo', function () { results += 'F'; });

            this.source.fire('foo');

            Y.Assert.areSame('ABCDEFG', results);
        },

        test_bubblePrevented: function () {
            var results = '';

            this.source.publish('foo', {
                broadcast: 0,
                defaultFn : function () { results += '1'; },
                preventedFn : function () { results += 'D'; },
                stoppedFn : function () { results += '2'; }
            });

            this.source.on('foo', function () { results += 'A'; });
            this.source.after('foo', function () { results += '3'; });

            this.middleMan1.on('foo', function (e) {
                results += 'B';
                e.preventDefault();
            });
            this.middleMan1.after('foo', function () { results += '4'; });

            // This is called before the preventedFn. The preventedFn is called at the point in the flow, where the defaultFn would have been executed.
            this.middleMan2.on('foo', function () { results += 'C'; });
            this.middleMan2.after('foo', function () { results += '5'; });

            this.source.fire('foo');

            Y.Assert.areSame('ABCD', results);
        },

        test_bubbleStopped: function () {

            var results = '';

            this.source.publish('foo', {
                broadcast: 0,
                defaultFn : function () { results += 'D'; },
                preventedFn : function () { results += '1'; },
                stoppedFn : function () { results += 'C'; }
            });

            this.source.on('foo', function () { results += 'A'; });
            this.source.after('foo', function () { results += 'E'; });

            this.middleMan1.on('foo', function (e) {results += 'B'; e.stopPropagation()});
            this.middleMan1.after('foo', function () { results += 'F'; });

            this.middleMan2.on('foo', function () { results += '2'; });
            this.middleMan2.after('foo', function () { results += '3'; });

            this.source.fire('foo');

            Y.Assert.areSame('ABCDE', results);
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
        },

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
