YUI.add('basic-features-tests', function(Y){

    var suite = new Y.Test.Suite('basic-features example test suite'),
        DOES_NOT_EXIST = ' does not exist.';

    suite.add(new Y.Test.Case({
        name: 'Basic Features Tests',

        'Group 1: ': function() {
            var img = Y.one('#delay'),
                test = this;

            Y.Assert.isNotNull(img, 'delay' + DOES_NOT_EXIST);

            Y.Assert.areSame('none', img.getStyle('backgroundImage'), 'Background image exists.');

            setTimeout(function() {
                test.resume(function() {
                    Y.Assert.areNotSame('none', img.getStyle('backgroundImage'), 'Does not have background image.');
                });
            }, 2000);

            test.wait(2300);

        },


        'Group 2: load on scroll': function() {
            var img = Y.one('#scroll');

            Y.Assert.isNotNull(img, 'scroll' + DOES_NOT_EXIST);

            Y.Assert.areSame('', img.get('src'), 'Source is not empty.');
            Y.Assert.areSame('hidden', img.getStyle('visibility'), 'Image is not hidden by default.');

            window.scrollTo(0, 0);
            window.scrollTo(1, 1);

            setTimeout(function(){
                Y.Assert.areNotSame('', img.get('src'), 'Source is not updated.');
                Y.Assert.areSame('visible', img.getStyle('visibility'), 'Image is not made visible.');
            }, 0);
        },

        'Group 3: load on mouse over': function() {
            var img = Y.one('#mouseover');

            Y.Assert.isNotNull(img, 'mouseover' + DOES_NOT_EXIST);

            Y.Assert.areSame('none', img.getStyle('backgroundImage'), 'Background image exists.');

            img.simulate('mouseover');

            Y.Assert.areNotSame('none', img.getStyle('backgroundImage'), 'Does not have a background image.');
        },

        'Group 4: load two images on click': function() {
            var img1 = Y.one('#duo1'),
                img2 = Y.one('#duo2')

            Y.Assert.isNotNull(img1, 'duo1' + DOES_NOT_EXIST);
            Y.Assert.isNotNull(img2, 'duo2' + DOES_NOT_EXIST);

            Y.Assert.areSame('none', img1.getStyle('backgroundImage'), 'Background image exists.');
            Y.Assert.areSame('none', img2.getStyle('backgroundImage'), 'Background image exists.');

            img1.simulate('click');

            Y.Assert.areNotSame('none', img1.getStyle('backgroundImage'), 'Does not have a background image.');
            Y.Assert.areNotSame('none', img2.getStyle('backgroundImage'), 'Does not have a background image.');
        }

    }));

    Y.Test.Runner.add(suite);


}, '', {requires: ['imageloader', 'test', 'node-event-simulate']});
