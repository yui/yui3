YUI.add('event-tap-tests', function(Y) {

    var suite = new Y.Test.Suite('Event: Tap'),
    Assert = Y.Assert,
    noop = function() {},
    body = Y.one('body'),
    supportsTouch = ("createTouch" in document) ? true : false;

    Y.Node.prototype.tap = function (startOpts, endOpts) {
        if (supportsTouch) {
            Y.Event.simulate(this._node, 'touchstart', startOpts);
            Y.Event.simulate(this._node, 'touchend', endOpts);
        }
        else {
            Y.Event.simulate(this._node, 'mousedown', startOpts);
            Y.Event.simulate(this._node, 'mouseup', endOpts);
        }
    };
    Y.NodeList.importMethod(Y.Node.prototype, 'tap');

    suite.add(new Y.Test.Case({
        name: 'event tap events',

        _should: {
            ignore: {
                /*
                Ignore the touchend test on IE9 because simulated event payloads
                provide 0,0 for pageX and pageY respectively. Manual testing confirms
                that this test works. See http://yuilibrary.com/projects/yui3/ticket/2531581
                */
                'touchend not in same area': (Y.UA.ie === 9),
            }
        },

         'on tap': function() {
            var clicked = false,
                node = Y.one('#clicker1');
            
            node.on('tap', function(e) {
                clicked = true;
            });

            node.tap({
                    target: node,
                    type: 'touchstart',
                    bubbles: true,            // boolean
                    cancelable: true,         // boolean
                    view: window,               // DOMWindow
                    detail: 0,
                    pageX: 5,
                    pageY:5,            // long
                    screenX: 5, 
                    screenY: 5,  // long
                    clientX: 5,
                    clientY: 5,   // long
                    ctrlKey: false, 
                    altKey: false, 
                    shiftKey:false,
                    metaKey: false, // boolean
                    touches: [
                        {
                            identifier: 'foo',
                            screenX: 5,
                            screenY: 5,
                            clientX: 5,
                            clientY: 5,
                            pageX: 5,
                            pageY: 5,
                            radiusX: 15,
                            radiusY: 15,
                            rotationAngle: 0,
                            force: 0.5,
                            target: node
                        }
                    ],            // TouchList
                    targetTouches: [
                        {
                            identifier: 'foo',
                            screenX: 5,
                            screenY: 5,
                            clientX: 5,
                            clientY: 5,
                            pageX: 5,
                            pageY: 5,
                            radiusX: 15,
                            radiusY: 15,
                            rotationAngle: 0,
                            force: 0.5,
                            target: node
                        }
                    ],      // TouchList
                    changedTouches: []     // TouchList
                }, {
                                        target: node,
                    type: 'touchend',
                    bubbles: true,            // boolean
                    cancelable: true,         // boolean
                    view: window,               // DOMWindow
                    detail: 0,
                    pageX: 5,
                    pageY:5,            // long
                    screenX: 5, 
                    screenY: 5,  // long
                    clientX: 5,
                    clientY: 5,   // long
                    ctrlKey: false, 
                    altKey: false, 
                    shiftKey:false,
                    metaKey: false, // boolean
                    touches: [
                        {
                            identifier: 'foo',
                            screenX: 5,
                            screenY: 5,
                            clientX: 5,
                            clientY: 5,
                            pageX: 5,
                            pageY: 5,
                            radiusX: 15,
                            radiusY: 15,
                            rotationAngle: 0,
                            force: 0.5,
                            target: node
                        }
                    ],            // TouchList
                    targetTouches: [
                        {
                            identifier: 'foo',
                            screenX: 5,
                            screenY: 5,
                            clientX: 5,
                            clientY: 5,
                            pageX: 5,
                            pageY: 5,
                            radiusX: 15,
                            radiusY: 15,
                            rotationAngle: 0,
                            force: 0.5,
                            target: node
                        }
                    ],      // TouchList
                    changedTouches: [
                        {
                            identifier: 'foo',
                            screenX: 5,
                            screenY: 5,
                            clientX: 5,
                            clientY: 5,
                            pageX: 5,
                            pageY: 5,
                            radiusX: 15,
                            radiusY: 15,
                            rotationAngle: 0,
                            force: 0.5,
                            target: node
                        }
                    ] 
                });

            Y.Assert.isTrue(clicked, "click handler didn't work");
            // Y.Assert.areEqual(1, context.a, "context didn't work");
            // Y.Assert.areEqual(2, ex1, "extra arg1 didn't work");
            // Y.Assert.areEqual(3, ex2, "extra arg2 didn't work");
         },

        'touchend not in same area': function() {
            var clicked = false,
                ex1 = 1,
                ex2 = 2
                obj = {
                    a: 1
                },
                node = Y.one('#clicker1'),

                startOpts = {
                    target: node,
                    type: 'touchstart',
                    bubbles: true,            // boolean
                    cancelable: true,         // boolean
                    view: window,               // DOMWindow
                    detail: 0,            // long
                    screenX: 0, 
                    screenY: 0,  // long
                    clientX: 0,
                    clientY: 0,   // long
                    ctrlKey: false, 
                    altKey: false, 
                    shiftKey:false,
                    metaKey: false, // boolean
                    touches: [
                        {
                            identifier: 'foo',
                            screenX: 0,
                            screenY: 0,
                            clientX: 0,
                            clientY: 0,
                            pageX: 0,
                            pageY: 0,
                            radiusX: 15,
                            radiusY: 15,
                            rotationAngle: 0,
                            force: 0.5,
                            target: node
                        }
                    ],            // TouchList
                    targetTouches: [
                        {
                            identifier: 'foo',
                            screenX: 0,
                            screenY: 0,
                            clientX: 0,
                            clientY: 0,
                            pageX: 0,
                            pageY: 0,
                            radiusX: 15,
                            radiusY: 15,
                            rotationAngle: 0,
                            force: 0.5,
                            target: node
                        }
                    ],      // TouchList
                    changedTouches: []     // TouchList
                },

                endOpts = {
                    target: node,
                    type: 'touchend',
                    bubbles: true,            // boolean
                    cancelable: true,         // boolean
                    view: window,               // DOMWindow
                    detail: 0,            // long
                    screenX: 235, 
                    screenY: 25,  // long
                    clientX: 235,
                    clientY: 25,   // long
                    ctrlKey: false,
                    pageX: 235,
                    pageY:25,  
                    altKey: false, 
                    shiftKey:false,
                    metaKey: false, // boolean
                    touches: [
                        {
                            identifier: 'foo',
                            screenX: 235,
                            screenY: 25,
                            clientX: 235,
                            clientY: 25,
                            pageX: 235,
                            pageY: 25,
                            radiusX: 15,
                            radiusY: 15,
                            rotationAngle: 0,
                            force: 0.5,
                            target: node
                        }
                    ],            // TouchList
                    targetTouches: [
                        {
                            identifier: 'foo',
                            screenX: 235,
                            screenY: 25,
                            clientX: 235,
                            clientY: 25,
                            pageX: 235,
                            pageY: 25,
                            radiusX: 15,
                            radiusY: 15,
                            rotationAngle: 0,
                            force: 0.5,
                            target: node
                        }
                    ],      // TouchList
                    changedTouches: [
                        {
                            identifier: 'foo',
                            screenX: 235,
                            screenY: 25,
                            clientX: 235,
                            clientY: 25,
                            pageX: 235,
                            pageY: 25,
                            radiusX: 15,
                            radiusY: 15,
                            rotationAngle: 0,
                            force: 0.5,
                            target: node
                        }
                    ]     // TouchList
                };
            
            node.on('tap', function(e) {
                clicked = true;
            });

            if (supportsTouch) {
                Y.Event.simulate(node.getDOMNode(), 'touchstart', startOpts);
                Y.Event.simulate(node.getDOMNode(), 'touchend', endOpts);

            }
            else {
                Y.Event.simulate(node.getDOMNode(), 'mousedown', startOpts);
                Y.Event.simulate(node.getDOMNode(), 'mouseup', endOpts);
            }

            Y.Assert.isFalse(clicked, "click handler was triggered when it shouldn't have been");
        },

        'delegate tap': function() {
            var clicked = false,
                container = Y.one('#clickcontainer'),
                node = Y.one('#clicker1');

             container.delegate('tap', function(e) {
                 clicked = true;
             }, '#clicker1');

             node.tap({
                    target: container,
                    type: 'touchstart',
                    bubbles: true,            // boolean
                    cancelable: true,         // boolean
                    view: window,               // DOMWindow
                    detail: 0,            // long
                    screenX: 0, 
                    screenY: 0,  // long
                    clientX: 0,
                    clientY: 0,   // long
                    ctrlKey: false, 
                    altKey: false, 
                    shiftKey:false,
                    metaKey: false, // boolean
                    touches: [
                        {
                            identifier: 'foo',
                            screenX: 0,
                            screenY: 0,
                            clientX: 0,
                            clientY: 0,
                            pageX: 0,
                            pageY: 0,
                            radiusX: 15,
                            radiusY: 15,
                            rotationAngle: 0,
                            force: 0.5,
                            target: container
                        }
                    ],            // TouchList
                    targetTouches: [
                        {
                            identifier: 'foo',
                            screenX: 0,
                            screenY: 0,
                            clientX: 0,
                            clientY: 0,
                            pageX: 0,
                            pageY: 0,
                            radiusX: 15,
                            radiusY: 15,
                            rotationAngle: 0,
                            force: 0.5,
                            target: container
                        }
                    ],      // TouchList
                    changedTouches: []     // TouchList
             }, {
                target: container,
                type: 'touchend',
                bubbles: true,            // boolean
                cancelable: true,         // boolean
                view: window,               // DOMWindow
                detail: 0,            // long
                screenX: 0, 
                screenY: 0,  // long
                clientX: 0,
                clientY: 0,   // long
                ctrlKey: false,
                pageX: 0,
                pageY:0,  
                altKey: false, 
                shiftKey:false,
                metaKey: false, // boolean
                touches: [
                    {
                        identifier: 'foo',
                        screenX: 0,
                        screenY: 0,
                        clientX: 0,
                        clientY: 0,
                        pageX: 0,
                        pageY: 0,
                        radiusX: 15,
                        radiusY: 15,
                        rotationAngle: 0,
                        force: 0.5,
                        target: container
                    }
                ],            // TouchList
                targetTouches: [
                    {
                        identifier: 'foo',
                        screenX: 0,
                        screenY: 0,
                        clientX: 0,
                        clientY: 0,
                        pageX: 0,
                        pageY: 0,
                        radiusX: 15,
                        radiusY: 15,
                        rotationAngle: 0,
                        force: 0.5,
                        target: container
                    }
                ],      // TouchList
                changedTouches: [
                    {
                        identifier: 'foo',
                        screenX: 0,
                        screenY: 0,
                        clientX: 0,
                        clientY: 0,
                        pageX: 0,
                        pageY: 0,
                        radiusX: 15,
                        radiusY: 15,
                        rotationAngle: 0,
                        force: 0.5,
                        target: container
                    }
                ]     // TouchList
             });

            Y.Assert.isTrue(clicked, "click handler didn't work");

        },

        'touchmove/mousemove fired': function() {
            
            var clicked = false,
                node = Y.one('#clicker1'),
                startOpts = {
                    target: node,
                    type: 'touchstart',
                    bubbles: true,            // boolean
                    cancelable: true,         // boolean
                    view: window,               // DOMWindow
                    detail: 0,            // long
                    screenX: 0, 
                    screenY: 0,  // long
                    clientX: 0,
                    clientY: 0,   // long
                    ctrlKey: false, 
                    altKey: false, 
                    shiftKey:false,
                    metaKey: false, // boolean
                    touches: [
                        {
                            identifier: 'foo',
                            screenX: 0,
                            screenY: 0,
                            clientX: 0,
                            clientY: 0,
                            pageX: 0,
                            pageY: 0,
                            radiusX: 15,
                            radiusY: 15,
                            rotationAngle: 0,
                            force: 0.5,
                            target: node
                        }
                    ],            // TouchList
                    targetTouches: [
                        {
                            identifier: 'foo',
                            screenX: 0,
                            screenY: 0,
                            clientX: 0,
                            clientY: 0,
                            pageX: 0,
                            pageY: 0,
                            radiusX: 15,
                            radiusY: 15,
                            rotationAngle: 0,
                            force: 0.5,
                            target: node
                        }
                    ],      // TouchList
                    changedTouches: []     // TouchList
                },

                endOpts = {
                    target: node,
                    type: 'touchend',
                    bubbles: true,            // boolean
                    cancelable: true,         // boolean
                    view: window,               // DOMWindow
                    detail: 0,            // long
                    screenX: 235, 
                    screenY: 25,  // long
                    clientX: 235,
                    clientY: 25,   // long
                    ctrlKey: false,
                    pageX: 235,
                    pageY:25,  
                    altKey: false, 
                    shiftKey:false,
                    metaKey: false, // boolean
                    touches: [
                        {
                            identifier: 'foo',
                            screenX: 235,
                            screenY: 25,
                            clientX: 235,
                            clientY: 25,
                            pageX: 235,
                            pageY: 25,
                            radiusX: 15,
                            radiusY: 15,
                            rotationAngle: 0,
                            force: 0.5,
                            target: node
                        }
                    ],            // TouchList
                    targetTouches: [
                        {
                            identifier: 'foo',
                            screenX: 235,
                            screenY: 25,
                            clientX: 235,
                            clientY: 25,
                            pageX: 235,
                            pageY: 25,
                            radiusX: 15,
                            radiusY: 15,
                            rotationAngle: 0,
                            force: 0.5,
                            target: node
                        }
                    ],      // TouchList
                    changedTouches: [
                        {
                            identifier: 'foo',
                            screenX: 235,
                            screenY: 25,
                            clientX: 235,
                            clientY: 25,
                            pageX: 235,
                            pageY: 25,
                            radiusX: 15,
                            radiusY: 15,
                            rotationAngle: 0,
                            force: 0.5,
                            target: node
                        }
                    ]
                };

            node.on('tap', function(e) {
                clicked = true;
            });

            if (supportsTouch) {
                Y.Event.simulate(node.getDOMNode(), 'touchstart', startOpts);
                Y.Event.simulate(node.getDOMNode(), 'touchmove', endOpts);

            }
            else {
                Y.Event.simulate(node.getDOMNode(), 'mousedown', startOpts);
                Y.Event.simulate(node.getDOMNode(), 'mousemove', endOpts);
            }            

            Y.Assert.isFalse(clicked, "click handler didn't work");

        }
    }));

    Y.Test.Runner.add(suite);

}, '@VERSION@' ,{requires:['event-tap','test', 'node-event-simulate']});
