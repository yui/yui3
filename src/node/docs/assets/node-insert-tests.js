YUI.add('node-insert-tests', function(Y) {

    var suite = new Y.Test.Suite('node-insert example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'example has 2 initial images': function() {
            var imgs = Y.all('.example img');

            Assert.areEqual(2, imgs.size(), 'Failed to render bun images');
        },
        'burger has correct items, in the correct sequence': function() {
            var test = this,
                burgerItems,
                burgerList,
                buttons = Y.all('.example .buttons-list .yui3-button'),
                i;
                for (i = 0; i < buttons.size()-2; i += 1) {
                    buttons.item(i).simulate("click");
                }


            //Assert.areSame(first.getHTML(), second.getHTML(), 'Start items are different');
            test.wait( function() {
                burgerItems = Y.one('.example .demo').getHTML();
                burgerList = Y.all('.example .demo li');

                Assert.isTrue((burgerItems.indexOf('patty.png') > -1), 'Failed to find patty');
                Assert.isTrue((burgerItems.indexOf('lettuce.png') > -1), 'Failed to find lettuce');
                Assert.isTrue((burgerItems.indexOf('cheese.png') > -1), 'Failed to find cheese');
                Assert.isTrue((burgerItems.indexOf('tomato.png') > -1), 'Failed to find tomato');
                Assert.isTrue((burgerItems.indexOf('onions.png') > -1), 'Failed to find onions');
                Assert.isTrue((burgerItems.indexOf('pickles.png') > -1), 'Failed to find pickles');
                Assert.isTrue((burgerItems.indexOf('ketchup.png') > -1), 'Failed to find ketchup');

                Assert.isTrue((burgerList.item(0).hasClass('bun-top')), 'item 0 is not bun-top');
                Assert.isTrue((burgerList.item(1).hasClass('ketchup')), 'item 1 is not ketchup');
                Assert.isTrue((burgerList.item(2).hasClass('pickles')), 'item 2 is not pickles');
                Assert.isTrue((burgerList.item(3).hasClass('onions')), 'item 3 is not onions');
                Assert.isTrue((burgerList.item(4).hasClass('tomato')), 'item 4 is not tomato');
                Assert.isTrue((burgerList.item(5).hasClass('cheese')), 'item 5 is not cheese');
                Assert.isTrue((burgerList.item(6).hasClass('patty')), 'item 6 is not patty');
                Assert.isTrue((burgerList.item(7).hasClass('lettuce')), 'item 7 is not lettuce');
                Assert.isTrue((burgerList.item(8).hasClass('bun-bottom')), 'item 8 is not bun-bottom');

            }, 1000);

        },
        'click "done" button and burger is collapsed': function() {
            var test = this,
            anotherButton,
            anotherDisplayState;

            Y.one('.example .buttons-list .done').simulate("click");
            test.wait( function() {
                //alert('height: ' + parseInt(Y.one('.demo').getStyle('height'), 10));
                // modern browsers height is about 108px 111px etc. IE6 is 145px
                Assert.isTrue((parseInt(Y.one('.demo').getStyle('height'), 10) < 146), 'Done button failed to collapse burger <ul> to < 115 height');
            }, 1000);
            anotherButton = Y.one('.example .buttons-list .another'),
            anotherDisplayState = anotherButton.getStyle('display');

            Assert.areEqual(anotherDisplayState, 'block', 'Failed to display button "Another Please"');

        },
        'check buttons and images in "Another Please" clicked state ... ready to make another': function() {
            var btnAnother = Y.one('.example .buttons-list .another'),
                btnAnotherDisplay,
                btnDone = Y.one('.example .buttons-list .done'),
                numButtonsDisplayed = 0,
                buttons,
                imgs;

            // "done" button was clicked in prev test, so "Another Please" button should be displayed
            Assert.areEqual("block", btnAnother.getStyle('display'), 'Failed to display "Another Please" button xxx');
            btnAnother.simulate("click");

            buttons = Y.all('.example .buttons-list .yui3-button');
            for (i = 0; i < buttons.size(); i += 1) {
                if (buttons.item(i).getStyle('display') === 'block') {
                    numButtonsDisplayed += 1;
                }
            }

            // should be 8 buttons displayed, one of which is "Done". "Another Please" should be display: none
            Assert.areEqual(8, numButtonsDisplayed, 'Failed to display all 8 buttons');
            Assert.areEqual('none', btnAnother.getStyle('display'), 'Failed to display: none the "Another Please" button');
            Assert.areEqual('block', btnDone.getStyle('display'), 'Failed to display "Done" button');
            imgs = Y.all('.example img');

            Assert.areEqual(2, imgs.size(), 'Failed to render bun images');
            Assert.isTrue((Y.one('.example .buttons-list .cheese')._node.disabled), "Failed to disable cheese button");
        }

/**/
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
