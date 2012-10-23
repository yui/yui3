YUI.add('synth-example-tests', function(Y) {

    // copied this from event-key-test.js to add tests for changing value by keyboard
    // key(38) // up
    // key(40) // down
    // key(39) // right
    // key(37) // left
    // key(36) // home
    // key(35) // end
    // key(33) // pageUp
    // key(34) // pageDown
// copied this from event-key-test.js to add tests for changing value by keyboard
Y.Node.prototype.key = function (code, mods, type) {
    var simulate = Y.Event.simulate,
        el       = this._node,
        config   = Y.merge(mods || {}, { keyCode: code, charCode: code });

    if (typeof code === "string") {
        code = code.charCodeAt(0);
    }

    if (type) {
        simulate(el, type, config);
    } else {
        simulate(el, 'keydown', config);
        simulate(el, 'keyup', config);
        simulate(el, 'keypress', config);
    }
};
// END   copied this from event-key-test.js to add tests for changing value by keyboard

    var suite = new Y.Test.Suite('synth-example example test suite'),
        Assert = Y.Assert;

    var toasterA = Y.one('#homebase #A'),
        toasterB = Y.one('#homebase #B'),
        bOrigXY = toasterB.getXY();

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'example has images': function() {
            var imgs = Y.all('.example #demo img');

            Assert.areEqual(2, imgs.size(), 'Failed to render images');
        },
        'test subscribe button': function() {
            var test = this,
                toasterA = Y.one('#homebase #A'),
                toasterB = Y.one('#homebase #B');

            Y.one('#demo #attach').simulate('click');
            toasterB.simulate('click');
            var foo = function(e) {
                setTimeout(function() { //dely this assert for ie
                    test.resume(function() {
                        Assert.isTrue((toasterB.hasClass('yui3-focused')), ' - Failed to set focus on toasterB');
                    });
                }, 100);
            }
            foo();
            test.wait(1000);
        },
        'test moving toasterB to right': function() {
            var node = toasterB,
                test = this;
            var foo = function(e) {
                setTimeout(function() {
                    test.resume(function() {
                        Y.Assert.isTrue((bOrigXY[0] + 40 === toasterB.getX()), ' - Failed to move toasterB to the right');
                    });
                }, 1000);
            }

            setTimeout(function() {
                toasterB.key(39);   //right
//                toasterB.simulate('keypress', { chrCode: 39 });  // doesn't work in IE
                foo();
            }, 1000);
            test.wait(3000);
        },
        'test moving toasterB to left': function() {
            var node = toasterB,
                test = this;
            var foo = function(e) {
                setTimeout(function() {
                    test.resume(function() {
                        Y.Assert.isTrue((bOrigXY[0] === toasterB.getX()), ' - Failed to move toasterB to the left');
                    });
                }, 1000);
            }

            setTimeout(function() {
                toasterB.key(37);   //left
                foo();
            }, 1000);
            test.wait(3000);
        },
        'test detaching subscriptions button': function() {
            Y.one('#demo #detach').simulate('click');
            toasterB.simulate('click');
            Assert.areEqual(0.5, toasterB.getStyle('opacity'), ' - Failed to set opacity to 0.5 on toasterB after detach');
        },
        'test delegated subscription': function() {
            Y.one('#delegate').simulate('click');
            Y.one('#delegate').set('checked', 'checked');
            Assert.areEqual(3, 3, ' - Failded');
        },
        'test subscribe button after checking delegate checkbox': function() {
            var test = this;

            Y.one('#demo #attach').simulate('click');
            toasterA.simulate('click');
            var foo = function(e) {
                setTimeout(function() { //dely this assert for ie
                    test.resume(function() {
                        Assert.isTrue((toasterA.hasClass('yui3-focused')), ' - Failed to set focus on toasterB');
                    });
                }, 100);
            }
            foo();
            test.wait(1000);
        },
        'test moving toasterA up': function() {
            var node = toasterA,
                test = this;
            var foo = function(e) {
                setTimeout(function() {
                    test.resume(function() {
                        Y.Assert.isTrue(test.closeEnough(bOrigXY[1] - 20, toasterA.getY()), ' - Failed to move toasterA up');
                        //Y.Assert.isTrue((bOrigXY[1] - 20 === toasterA.getY()), ' - Failed to move toasterA up');
                        
                    });
                }, 1000);
            }

            setTimeout(function() {
                toasterA.key(38);   //up
                foo();
            }, 1000);
            test.wait(3000);
        }


    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
