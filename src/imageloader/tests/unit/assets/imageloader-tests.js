YUI.add('imageloader-tests', function(Y) {

    var bgImgUrlTestCase = new Y.Test.Case({
        /* 
         * Test case to check the URL setting on bg-url images
         */
        
        name: 'Setting Background Urls',

        setUp: function() {
            // background-image group
            this.bgImgUrl = 'http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/museum.jpg';
            this.mainGroup = new Y.ImgLoadGroup({ name: 'imgUrlsTestBgImg' });
            this.mainGroup.addTrigger('#topmain', 'mouseover');
            this.mainGroup.registerImage({ domId: 'topmain', bgUrl: this.bgImgUrl });
            this.mainGroupImage = document.getElementById('topmain');
            
        },

        testBgImg: function() {
            Y.one('#topmain').simulate('mouseover');
            // style.bgImg is "url('...')", but we can't rely on those quotes across browsers. indexOf is sufficient
            Y.Assert.areNotEqual(this.mainGroupImage.style.backgroundImage.indexOf(this.bgImgUrl), -1);
        }
        
    });

    var srcImgUrlTestCase = new Y.Test.Case({
        /* 
         * Test case to check the URL setting on src-url images
         */
        
        name: 'Setting Source Urls',

        setUp: function() {
            // src-image group
            this.srcImgUrl = 'http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/morraine.jpg';
            this.srcGroup = new Y.ImgLoadGroup({ name: 'imgUrlsTestSrcImg' });
            this.srcGroup.addTrigger('#srcImgCont', 'click');
            this.srcGroup.registerImage({ domId: 'srcImg', srcUrl: this.srcImgUrl });
            this.srcGroupImage = document.getElementById('srcImg');
        },

        testSrcImg: function() {
            Y.one('#srcImgCont').simulate('click');
            Y.Assert.areEqual(this.srcGroupImage.src, this.srcImgUrl);
        }

    });

    var classNameTestCase = new Y.Test.Case({
        /*
         * Test case to check fetching by CSS class name
         */

        name: 'Class Name Fetching',

        setUp: function() {
            this.duo1Url = 'http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/uluru.jpg';
            this.duo2Url = 'http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/katatjuta.jpg';
            this.duo3Url = 'http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/katatjuta.jpg';
            this.duo1Image = document.getElementById('duo1');
            this.duo2Image = document.getElementById('duo2');
            this.duo3Image = document.getElementById('duo3');
            // classname group
            this.classGroup = new Y.ImgLoadGroup({ name: 'classNameTest', className: 'yui-imgload' });
            this.classGroup.addTrigger('#duo1', 'mouseover');
            
            this.classGroup2 = new Y.ImgLoadGroup({ name: 'classNameTest1', className: 'yui-newimgload', classNameAction: 'enhanced'});
            this.classGroup2.addTrigger('#duo3', 'mouseover');
            
        },

        testClassNames: function() {
            // We have to just check for the classname. Nothing else in the element will indicate the difference between before and after url application
            Y.Assert.areEqual(this.duo1Image.className, 'duo1 yui-imgload');
            Y.Assert.areEqual(this.duo2Image.className, 'yui-imgload');
            Y.one('#duo1').simulate('mouseover');
            Y.Assert.areEqual(this.duo1Image.className, 'duo1');
            Y.Assert.areEqual(this.duo2Image.className, '');
            
            //enhanced behavior
            Y.one('#duo3').simulate('mouseover');
            Y.Assert.areEqual('', this.duo3Image.className);
            Y.Assert.areEqual(this.duo3Url, this.duo3Image.src);
            Y.Assert.areEqual('', this.duo3Image.style.backgroundImage);
        }

    });

    var addTriggerTestCase = new Y.Test.Case({
        /*
         * Test case for checking the addTrigger method
         */

        name: 'addTrigger test',

        setUp: function() {
            this.imageUrl = 'http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/museum.jpg';
            this.triggerGroup = new Y.ImgLoadGroup({ name: 'addTriggerGroup' });
            this.triggerGroup.addTrigger('#topmain', 'dblclick').addTrigger('#addlTrigger', 'click');
            this.triggerGroup.registerImage({ domId: 'addlTrigger', bgUrl: this.imageUrl });
            this.triggerImage = document.getElementById('addlTrigger');
        },

        testAddTrigger: function() {
            Y.Assert.areEqual(this.triggerImage.style.backgroundImage, '');
            Y.one('#addlTrigger').simulate('click');
            Y.Assert.areNotEqual(this.triggerImage.style.backgroundImage.indexOf(this.imageUrl), -1);
        }

    });

    var customTriggerTestCase = new Y.Test.Case({
        /*
         * Test case for checking adding custom event triggers to a group, for which the custom event is attached to the Y instance
         */
        
        name: 'custom trigger test',

        setUp: function() {
            this.imageUrl = 'http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/uluru.jpg';
            // event attached to Y instance
            this.customEvent = 'imageloader_unit_test:custom_trigger_test';
            this.triggerGroup = new Y.ImgLoadGroup({ name: 'customTriggerGroup' });
            this.triggerGroup.addCustomTrigger('imageloader_unit_test:custom_trigger_test');
            this.triggerGroup.registerImage({ domId: 'customTrigger', bgUrl: this.imageUrl });
            this.triggerImage = document.getElementById('customTrigger');
        },

        testCustomTrigger: function() {
            Y.Assert.areEqual(this.triggerImage.style.backgroundImage, '');
            Y.fire('imageloader_unit_test:custom_trigger_test');
            Y.Assert.areNotEqual(this.triggerImage.style.backgroundImage.indexOf(this.imageUrl), -1);
        }

    });

    var localInstanceCustomTriggerTestCase = new Y.Test.Case({
        /*
         * Test case for checking adding custom event triggers to a group, for which the custom event is attached to an instance of a local object
         */
        
        name: 'local object custom trigger test',

        setUp: function() {
            this.imageUrl = 'http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/uluru.jpg';
            // event attached to custom instance
            this.customEvent2 = 'imageloader_unit_test:custom_trigger_test_2';
            this.customEvent2Obj = new Y.Event.Target();
            this.triggerGroup2 = new Y.ImgLoadGroup({ name: 'customTriggerGroup2' });
            this.triggerGroup2.addCustomTrigger('imageloader_unit_test:custom_trigger_test_2', this.customEvent2Obj);
            this.triggerGroup2.registerImage({ domId: 'customTrigger2', bgUrl: this.imageUrl });
            this.triggerImage2 = document.getElementById('customTrigger2');
        },

        testLocalObjectCustomTrigger: function() {
            Y.Assert.areEqual(this.triggerImage2.style.backgroundImage, '');
            this.customEvent2Obj.fire('imageloader_unit_test:custom_trigger_test_2');
            Y.Assert.areNotEqual(this.triggerImage2.style.backgroundImage.indexOf(this.imageUrl), -1);
        }
        
    });

    var imgSizingTestCase = new Y.Test.Case({
        /*
         * Test case to check post-fetch resizing of image, as well as 'visibility' setting
         */

        name: 'Image Sizing',

        setUp: function() {
            this.imageUrl = 'http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/japan.jpg';
            this.sizerGroup = new Y.ImgLoadGroup({ name: 'imgSizingGroup' });
            this.sizerGroup.addTrigger('#sizerImg', 'mouseover');
            var sizerILImg = this.sizerGroup.registerImage({ domId: 'sizerImg', srcUrl: this.imageUrl, width: 200, height: 150, setVisible: true });
            this.sizerImage = document.getElementById('sizerImg');
        },

        testImageVisibility: function() {
            Y.one('#sizerImg').simulate('mouseover');
            Y.Assert.areEqual(this.sizerImage.style.visibility, 'visible');
        },

        testImageSizing: function() {
            Y.one('#sizerImg').simulate('mouseover');
            Y.Assert.areEqual(this.sizerImage.height, 150);
            Y.Assert.areEqual(this.sizerImage.width, 200);
        }

    });

    var triggerRemovalTestCase = new Y.Test.Case({
        /*
         * Test case to check removing the trigger from groups that share the same trigger.
         * During development, there was an initial problem of when one group fired, the other group's trigger was removed.
         * This was due to the way the fetch() methods were passed to Event's addListener(); fixed by wrapping the fetch calls.
         * More details available in js code comments, in addTrigger() method
         */

        name: "Trigger Removal for Competing Groups' Triggers",

        setUp: function() {
            this.imageAUrl = 'http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/morraine.jpg';
            this.imageZUrl = 'http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/uluru.jpg';
            this.groupA = new Y.ImgLoadGroup({ name: 'triggerRemovalGroup(A)' });
            this.groupA.addTrigger('#sharedTrigger1', 'click');
            this.groupA.registerImage({ domId: 'sharedTrigger1', bgUrl: this.imageAUrl });
            this.groupZ = new Y.ImgLoadGroup({ name: 'triggerRemovalGroup(Z)' });
            this.groupZ.addTrigger('#sharedTrigger1', 'click').addTrigger('#sharedTrigger2', 'click');
            this.groupZ.registerImage({ domId: 'sharedTrigger2', bgUrl: this.imageZUrl });
            this.groupAImage = document.getElementById('sharedTrigger1');
            this.groupZImage = document.getElementById('sharedTrigger2');
        },

        testCompetingTriggers: function() {
            Y.one('#sharedTrigger2').simulate('click');
            Y.Assert.areNotEqual(this.groupZImage.style.backgroundImage.indexOf(this.imageZUrl), -1);
            Y.Assert.areEqual(this.groupAImage.style.backgroundImage, '');
            Y.one('#sharedTrigger1').simulate('click');
            Y.Assert.areNotEqual(this.groupAImage.style.backgroundImage.indexOf(this.imageAUrl), -1);
        }

    });

    var foldConditionalTestCase = new Y.Test.Case({
        /*
         * Test case to check fold-conditional loading of a group
         * We're faking the viewport size and fold determination so that everything will be dependable in any situation (including automated runs)
         * Includes testing cascading behavior, in which images are rechecked at every scroll to determine if they are within distance of the fold
         */

        name: "Fold Conditional Loading",

        setUp: function() {
            /* absolute postions of images:
             *   top: 130
             *   mid: 350
             *   bot: 500
             */
            var myFoldDistance = 20;
            Y.one('.fold-bottom-visual-indicator').setStyle('height', myFoldDistance);

            this.imageUrl = 'http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/japan.jpg';
            this.foldGroup = new Y.ImgLoadGroup({ name: 'foldConditionalGroup', foldDistance: myFoldDistance });
            this.foldGroup.registerImage({ domId: 'foldImgTop', srcUrl: this.imageUrl });
            this.foldGroup.registerImage({ domId: 'foldImgMiddle', srcUrl: this.imageUrl });
            this.foldGroup.registerImage({ domId: 'foldImgBottom', srcUrl: this.imageUrl });
            this.groupTopImage = document.getElementById('foldImgTop');
            this.groupMidImage = document.getElementById('foldImgMiddle');
            this.groupBotImage = document.getElementById('foldImgBottom');
        },

        testFoldChecks: function() {
            // override DOM's viewportRegion function so that the real browser viewport is not a variable in this test
            var bottomVal = 320;
            Y.one('.fold-bottom-visual-indicator').setStyle('top', bottomVal);
            Y.DOM.viewportRegion = function() {
                return { bottom: bottomVal };
            };

            // fold is at position where only the top image is loaded
            this.foldGroup._foldCheck();
            Y.Assert.areEqual(this.imageUrl, this.groupTopImage.src, 'top image should load/display with an src = "...japan.jpg"');
            Y.Assert.areEqual('', this.groupMidImage.src, 'mid image should *not* load, has an src=""');
            Y.Assert.areEqual('', this.groupBotImage.src, 'bot image should *not* load, has an src=""');

            // extend viewport down so that middle image is within distance of the fold and loads
            bottomVal = 355;
            Y.one('.fold-bottom-visual-indicator').setStyle('top', bottomVal);
            Y.DOM.viewportRegion = function() {
                return { bottom: bottomVal };
            };

            this.foldGroup._foldCheck();
            Y.Assert.areEqual(this.imageUrl, this.groupTopImage.src, 'top image should load/display with an src = "...japan.jpg"');
            Y.Assert.areEqual(this.imageUrl, this.groupMidImage.src, 'mid image should load/display with an src = "...japan.jpg"');
            Y.Assert.areEqual('', this.groupBotImage.src, 'bot image should *not* load, has an src=""');
        },
        _should: {
            fail: {
                'testFoldChecks': false  //(Y.UA.ie && Y.UA.ie < 9)
            }
        }
    });

    var timeLimitTestCase = new Y.Test.Case({
        /*
         * Test case for checking the time limit functionality of a group
         */
        
        name: 'time limit test',

        setUp: function() {
            this.timeLimit = .5;
            this.imageUrl = 'http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/small/museum.jpg';
            this.timeGroup = new Y.ImgLoadGroup({ name: 'timeLimitGroup', timeLimit: this.timeLimit });
            this.timeGroup.registerImage({ domId: 'timeImg', srcUrl: this.imageUrl });
            this.timeGroupImg = document.getElementById('timeImg');
        },

        testTimeLimit: function() {
            /* Note on timing:
             *   The TestRunner is started at domready
             *   During this test case, the timeGroup is created, which attaches the timer-starting JS to domready
             *   Meaning the following wait() call is executed before the group timer starts
             *   It's hard to guarantee how long after the wait() call the timer actually starts,
             *   but hopefully a half second is plenty of time
             * Y.log('About to start wait()ing in test case');
             */
            this.wait(function() {
                Y.Assert.areEqual(this.timeGroupImg.src, this.imageUrl);
            }, (this.timeLimit + .5) * 1000);  // check starting, at minimum, a half second after timeLimit
        }

    });


    var imageLoaderTestSuite = new Y.Test.Suite('ImageLoader');
    imageLoaderTestSuite.add(bgImgUrlTestCase);
    imageLoaderTestSuite.add(srcImgUrlTestCase);
    imageLoaderTestSuite.add(classNameTestCase);
    imageLoaderTestSuite.add(addTriggerTestCase);
    imageLoaderTestSuite.add(customTriggerTestCase);
    imageLoaderTestSuite.add(localInstanceCustomTriggerTestCase);
    imageLoaderTestSuite.add(imgSizingTestCase);
    imageLoaderTestSuite.add(triggerRemovalTestCase);
    imageLoaderTestSuite.add(foldConditionalTestCase);
    imageLoaderTestSuite.add(timeLimitTestCase);

    Y.Test.Runner.add(imageLoaderTestSuite);

});
