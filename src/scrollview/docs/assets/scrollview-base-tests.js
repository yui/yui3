YUI.add('scrollview-base-tests', function(Y) {

    var suite = new Y.Test.Suite('scrollview-base test suite');

    suite.add(new Y.Test.Case({

        name : 'Example Tests',

        'test should fail - requires manual tests' : function () {
            Y.Assert.pass();
        }

        // 'Flick should offset scrollview to the bottom' : function () {
        //     var Test = this;

        //     Y.one('#scrollview-content').simulateGesture('flick', {
        //         distance: -1500,
        //         axis: 'y'
        //     });

        //     Test.wait(function () {
        //         var transform = Y.one('#scrollview-content').getStyle('transform'),
        //             offset = transform.split(',')[5].replace(')', '').trim();

        //         if (offset == -1538 /*Chrome, Safari*/ || offset == -1569 /*FF*/) {
        //             Y.Assert.pass();
        //         }
        //         else {
        //             Y.Assert.fail();
        //         }
        //     }, 3000);
        // }
    }));

    Y.Test.Runner.add(suite);

}, '', {requires:[]});
