YUI.add('below-fold-tests', function(Y){ 

    var suite = new Y.Test.Suite('below-fold example test suite');

    suite.add(new Y.Test.Case({

        name: 'Below Fold Test',

        'should contain 5 images': function() {
            var imgs = Y.all('#everything img');

            Y.Assert.areSame(5, imgs.size(), 'There are not 5 images');
        },

        'should load all images': function() {
            var everything = Y.one('#everything'),
                imgs = everything.all('img'),
                imagesLoaded = 0;

            imgs.each(function(img) {
                if (img.get('src') !== '') {
                    imagesLoaded++;
                }
            });

            Y.Assert.areNotSame(imgs.size() + 1, imagesLoaded, 'There are too many images loaded.');

            // scroll below `everything`
            window.scrollTo(0, everything.getY() + everything.get('region').height );

            imagesLoaded = 0;

            setTimeout(function() {
                imgs.each(function(img) {
                    if (img.get('src') !== '') {
                        imagesLoaded++;
                    }
                });

                Y.Assert.areSame(imgs.size(), imagesLoaded, 'All images are not loaded.');
            }, 0);
        }

    }));

    Y.Test.Runner.add(suite);

}, '', {requires: ['imageloader', 'test']});
