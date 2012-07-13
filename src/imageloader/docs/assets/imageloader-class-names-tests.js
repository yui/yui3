YUI.add('imageloader-class-names-tests', function(Y){ 

    var suite = new Y.Test.Suite('imageloader-class-names example test suite'),
        TIMEOUT = 10000;

    suite.add(new Y.Test.Case({

        name: 'ImageLoader Class Names Test',

        'should contain 4 images': function() {
            var imgs = Y.all('#topmain, #duo1, #duo2, #scrollImg');

            Y.Assert.areSame(4, imgs.size(), 'There are not 4 images');
        },

        'should load all images': function() {
            var test = this,
                topmain = Y.one('#topmain'),
                duo1 = Y.one('#duo1'),
                duo2 = Y.one('#duo2'),
                scroll = Y.one('#scrollImg'),
                imagesLoaded = 0,

                topCondition = function() {
                    return topmain.getComputedStyle('backgroundImage') !== 'none';
                },

                topSuccess = function() {
                    Y.Assert.areNotSame('none', topmain.getComputedStyle('backgroundImage'));

                    // test duo
                    test.poll(duoCondition, 100, TIMEOUT, duoSuccess, duoFailure);
                },

                topFailure = function() {
                    Y.Assert.fail('#topmain does not load.');
                },
                
                duoCondition = function() {
                    return duo1.getComputedStyle('backgroundImage') !== 'none' &&
                        duo2.getComputedStyle('backgroundImage') !== 'none';
                },
                
                duoSuccess = function() {
                    Y.Assert.areNotSame('none', duo1.getComputedStyle('backgroundImage'));
                    Y.Assert.areNotSame('none', duo2.getComputedStyle('backgroundImage'));
                },
                
                duoFailure = function() {
                    Y.Assert.fail('#duo1 or #duo2 did not load.');
                };

            // let's make sure no images are loaded yet
            Y.Array.each([topmain, duo1, duo2, scroll], function(img) {
                if (img.getComputedStyle('backgroundImage') !== 'none') {
                    imagesLoaded++;
                }
            });

            Y.Assert.areSame(0, imagesLoaded, 'There are too many images loaded.');

            // reset counter
            imagesLoaded = 0;

            // scroll image 
            window.scrollTo(0,0);
            window.scrollTo(1,1);

            setTimeout(function() {
                Y.Assert.areNotSame('none', scroll.getComputedStyle('backgroundImage'), 'Scroll image is not loaded.');
            }, 500);


            // test topmain
            test.poll(topCondition, 100, TIMEOUT, topSuccess, topFailure);




        }
    }));

    Y.Test.Runner.add(suite);

}, '', {requires: ['imageloader', 'test']});
