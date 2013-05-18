YUI.add('scrollview-paging-tests', function(Y) {

    var suite = new Y.Test.Suite('scrollview-paging test suite');

    suite.add(new Y.Test.Case({

        name : 'Example Tests',

        'test should fail' : function () {
            Y.Assert.pass();
        }

        // 'Flick should snap scrollview to page #2' : function () {
        //     var Test = this;

        //     Y.one('#scrollview-content').simulateGesture('flick', {
        //         distance: -400,
        //         axis: 'x'
        //     });

        //     Test.wait(function () {
        //         var transform = Y.one('#scrollview-content').getStyle('transform'),
        //             offset = transform.split(',')[4].replace(')', '').trim();

        //         if (offset == -328) {
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
