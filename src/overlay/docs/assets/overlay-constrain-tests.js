YUI.add('overlay-constrain-tests', function(Y) {

    var suite = new Y.Test.Suite('overlay-constrain example test suite'),
        Assert = Y.Assert,
        overlay = Y.one('.example .yui3-overlay'),
        sliderY = Y.one('#y .yui3-slider-rail'),
        sliderX = Y.one('#x .yui3-slider-rail'),
        cBox = Y.one('#constrain-box'),
        chkBox = Y.one('#constrain'),
        closeEnough = function(expected, actual) {
            if (Math.abs(expected - actual) < 2) {
                return true;
            } else {
                return false;
            }
        };


        window.scrollTo(0, 0); // this makes sure page is at top so mousedown/up clientX/Y will be predictable

        /** this sets the constrain checkbox to checked or not
         * The example code looks for chkbox.on('click')... attr checked == true
         * IE doesn't set attr checked with a click
         * In non-IE, if you set checked to true then also click it checked == false (it seems)
         * @param expectedState Boolean
         */
        var clickCheckbox = function(checkbox, expectedState) {

            if (Y.UA.ie && Y.UA.ie < 9) {
                checkbox.set("checked", expectedState);
            } else {
                // Just in case it's already at that state, and the test wants to flip it with the click
                if (checkbox.get("checked") === expectedState) {
                    checkbox.set("checked", !expectedState);
                }
            }
            checkbox.simulate("click");
        }

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test overlay renders': function() {
            Assert.isTrue((overlay !== null), ' - Failed to render overlay container');
            Assert.isTrue((Y.one('.example #overlay-example') !== null), ' - Failed to render #overlay-example');
        },
        'test moving y above constrain box': function() {
            var expected = parseInt(cBox.getStyle('top'), 10);
            sliderY.simulate("mousedown", { clientX: 5, clientY: 10 });
            sliderY.simulate("mouseup", { clientX: 5, clientY: 10 });


            Assert.isTrue((closeEnough(expected, parseInt(overlay.getStyle('top'), 10))),' - Failed to move to correct X');
            clickCheckbox(chkBox, false);
            Assert.isTrue((expected > parseInt(overlay.getStyle('top'), 10)), ' - Failed to unconstrain');
            clickCheckbox(chkBox, true);
        },
        'test moving y below constrain box': function() {
            var expected = parseInt(cBox.getStyle('top'), 10) + (cBox.get('offsetHeight') - overlay.get('offsetHeight'));
            sliderY.simulate("mousedown", { clientX: 5, clientY: sliderY.getY() + 300 });
            sliderY.simulate("mouseup", { clientX: 5, clientY: sliderY.getY() + 300 });

            Assert.isTrue((closeEnough(expected, parseInt(overlay.getStyle('top'), 10))),' - Failed to move to correct X');
            clickCheckbox(chkBox, false);
            Assert.isTrue((expected < parseInt(overlay.getStyle('top'), 10)), ' - Failed to unconstrain');
            clickCheckbox(chkBox, true);
        },
        'test moving x left of constrain box': function() {
            var expected = parseInt(cBox.getStyle('left'), 10);
            sliderX.simulate("mousedown", { clientX: 5, clientY: 10 });
            sliderX.simulate("mouseup", { clientX: 5, clientY: 10 });
            Assert.areEqual(expected, parseInt(overlay.getStyle('left'), 10), ' - Failed to move to correct XY');
            clickCheckbox(chkBox, false);
            Assert.isTrue((expected > parseInt(overlay.getStyle('left'), 10)), ' - Failed to unconstrain');
            clickCheckbox(chkBox, true);
        },
        'test moving x right of constrain box': function() {
            var expected = parseInt(cBox.getStyle('left'), 10) + (cBox.get('offsetWidth') - overlay.get('offsetWidth'));
            sliderX.simulate("mousedown", { clientX: sliderX.getX() + 300, clientY: 5 });
            sliderX.simulate("mouseup", { clientX: sliderX.getX() + 300, clientY: 5 });
            Assert.areEqual(expected, parseInt(overlay.getStyle('left'), 10), ' - Failed to move to correct XY');
            clickCheckbox(chkBox, false);
            Assert.isTrue((expected < parseInt(overlay.getStyle('left'), 10)), ' - Failed to unconstrain');
            clickCheckbox(chkBox, true);
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
