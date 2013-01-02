YUI.add('event-delegate-change-tests', function(Y) {
    var suite = new Y.Test.Suite('Event: event-delegate-change'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'event-delegate-change',

        setUp: function() {
            var self = this;

            this._fireResultStopPropagation = 0;

            this._fireResultStopImmediatePropagation = 0;

            this._fireResultBody = 0;

            this._fireResultDIV = 0;

            this._handles = [
                Y.delegate(
                    'change',
                    function() {
                        ++self._fireResultBody;
                    },
                    document.body,
                    'input, select'
                ),

                Y.delegate(
                    'change',
                    function() {
                        ++self._fireResultDIV;
                    },
                    '#mainWrapper',
                    'input, select'
                ),

                Y.one('#checkboxStopPropagation').on(
                    'change',
                    function(event) {
                        ++self._fireResultStopPropagation;

                        event.stopPropagation();
                    }
                ),

                Y.one('#checkboxStopPropagation').on(
                    'change',
                    function(event) {
                        ++self._fireResultStopPropagation;
                    }
                ),

                Y.one('#checkboxStopImmediatePropagation').on(
                    'change',
                    function(event) {
                        ++self._fireResultStopImmediatePropagation;

                        event.stopImmediatePropagation();
                    }
                ),

                Y.one('#checkboxStopImmediatePropagation').on(
                    'change',
                    function(event) {
                        ++self._fireResultStopImmediatePropagation;
                    }
                )
            ];
        },
        
        tearDown: function() {
            this._fireResultStopPropagation = 0;

            this._fireResultStopImmediatePropagation = 0;

            this._fireResultBody = 0;

            this._fireResultDIV = 0;

            Y.Array.invoke(this._handles, 'detach');

            this._handles.length = 0;
        },

        test_stop_propagation: function() {
            Y.Event.simulate(document.getElementById('checkboxStopPropagation'), 'click');

            Assert.isTrue(this._fireResultStopPropagation === 2);

            Assert.isTrue(this._fireResultStopImmediatePropagation === 0);

            Assert.isTrue(this._fireResultBody === 0);

            Assert.isTrue(this._fireResultDIV === 0);
        },

        test_stop_immediate_propagation: function() {
            Y.Event.simulate(document.getElementById('checkboxStopImmediatePropagation'), 'click');

            Assert.isTrue(this._fireResultStopPropagation === 0);

            Assert.isTrue(this._fireResultStopImmediatePropagation === 1);

            Assert.isTrue(this._fireResultBody === 0);

            Assert.isTrue(this._fireResultDIV === 0);
        }

        /**
         * FIXME: This test fails, simulate 'click' does not bubble 'change' event in any browser
         */
        
        /*
        ,
        test_normal_event_handling: function() {
            Y.Event.simulate(document.getElementById('checkboxNormal'), 'click');

            Assert.isTrue(this._fireResultStopPropagation === 0);

            Assert.isTrue(this._fireResultStopImmediatePropagation === 0);

            Assert.isTrue(this._fireResultBody === 1);

            Assert.isTrue(this._fireResultDIV === 1);
        }
        */
    }));

    Y.Test.Runner.add(suite);

});
