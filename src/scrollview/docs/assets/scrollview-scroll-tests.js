YUI.add('scrollview-scroll-tests', function(Y) {

    var suite = new Y.Test.Suite('scrollview test suite');

    suite.add(new Y.Test.Case({

        name : 'Example Tests',

        'test should probably fail' : function () {
            Y.Assert.pass();
        }

        // 'Flick on <a> should offset scrollview to the bottom and suppress click' : function () {
        //     var Test = this;

        //     Y.one('#scrollview-content li a').simulateGesture('flick', {
        //         distance: -1500,
        //         axis: 'y'
        //     });

        //     Test.wait(function () {
        //         var transform = Y.one('#scrollview-content').getStyle('transform'),
        //             offset = transform.split(',')[5].replace(')', '').trim();

        //         if (offset == -1581 /*Chrome, Safari*/ || offset == -1613 /*FF*/) {
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
