YUI.add('event-tap-functional-tests', function(Y) {

    var suite = new Y.Test.Suite('Event: Tap'),
    Assert = Y.Assert,
    noop = function() {},
    body = Y.one('body'),
    doc = Y.config.doc,
    supportsTouch = !!(doc && doc.createTouch),
    GESTURE_MAP = Y.Event._GESTURE_MAP;

    Y.Node.prototype.tap = function (startOpts, endOpts) {
        Y.Event.simulate(this._node, GESTURE_MAP.start, startOpts);
        Y.Event.simulate(this._node, GESTURE_MAP.end, endOpts);
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
                'touchend not in same area': (Y.UA.phantomjs),
                'delegate tap': (Y.UA.phantomjs),
                'touchmove/mousemove fired': (Y.UA.phantomjs),
                'touchend not in same area': (Y.UA.ie === 9 || Y.UA.phantomjs),
                'on tap': Y.UA.phantomjs,
                'right mouse click': Y.UA.phantomjs,
                'attach and detach': Y.UA.phantomjs,
                'multiple touches': (Y.UA.ie === 9 || Y.UA.phantomjs)
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
                    type: GESTURE_MAP.start,
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
                    type: GESTURE_MAP.end,
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
                    type: GESTURE_MAP.start,
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
                    type: GESTURE_MAP.end,
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

            Y.Event.simulate(node.getDOMNode(), GESTURE_MAP.start, startOpts);
            Y.Event.simulate(node.getDOMNode(), GESTURE_MAP.end, endOpts);
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
                    type: GESTURE_MAP.start,
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
                type: GESTURE_MAP.end,
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
                    type: GESTURE_MAP.start,
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
                    type: GESTURE_MAP.move,
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

            Y.Event.simulate(node.getDOMNode(), GESTURE_MAP.start, startOpts);
            Y.Event.simulate(node.getDOMNode(), GESTURE_MAP.move, endOpts); 
            Y.Event.simulate(node.getDOMNode(), GESTURE_MAP.end, endOpts);        

            Y.Assert.isFalse(clicked, "click handler didn't work");

        },

        'attach and detach': function() {
            var node = Y.one('#clicker1'),
                clicked = false,
                startOpts = {
                    target: node,
                    type: GESTURE_MAP.start,
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
                    type: GESTURE_MAP.move,
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

            node.detach();

            Y.Event.simulate(node.getDOMNode(), GESTURE_MAP.start, startOpts);
            Y.Event.simulate(node.getDOMNode(), GESTURE_MAP.end, endOpts);   

            Y.Assert.isFalse(clicked, "detach() didn't work as expected");

        },

        'right mouse click': function () {
            var node = Y.one('#clicker1'),
            clicked = false,
            startOpts = {
                target: node,
                type: GESTURE_MAP.start,
                bubbles: true,            // boolean
                cancelable: true,         // boolean
                view: window, 
                button: 2,              // DOMWindow
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
                type: GESTURE_MAP.move,
                bubbles: true,            // boolean
                cancelable: true,         // boolean
                view: window,               // DOMWindow
                detail: 0, 
                button:2,           // long
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
            node.tap(startOpts, endOpts);
            Y.Assert.isFalse(clicked, "clicked boolean was flipped incorrectly");
        },

        'multiple touches': function () {
            var node = Y.one('#clicker1'),
            node2 = Y.one('#clicker2')
            clicked = false,
            startOpts = {
                target: node,
                type: GESTURE_MAP.start,
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
                    },
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
                        target: node2
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
                type: GESTURE_MAP.move,
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

            node.tap(startOpts, endOpts);
            Y.Assert.isFalse(clicked, "clicked boolean should not be flipped if there are multiple touches");
        },

        'changedTouches': function() {
            var node = Y.one('#clicker1'),
            node2 = Y.one('#clicker2')
            clicked = false,
            startOpts = {
                target: node,
                type: GESTURE_MAP.start,
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
                changedTouches: [
                    {
                        identifier: 'foo',
                        screenX: 235,
                        screenY: 25,
                        clientX: 600,
                        clientY: 600,
                        pageX: 500,
                        pageY: 500,
                        radiusX: 15,
                        radiusY: 15,
                        rotationAngle: 0,
                        force: 0.5,
                        target: node
                    }
                ]
            },
            endOpts = {
                target: node,
                type: GESTURE_MAP.move,
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
                    },
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
                        target: node2
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
                        clientX: 600,
                        clientY: 600,
                        pageX: 500,
                        pageY: 500,
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
                Y.Assert.areEqual(e.pageX, 500, 'pageX not the same as changedTouches pageX');
                Y.Assert.areEqual(e.pageY, 500, 'pageY not the same as changedTouches pageX');
                Y.Assert.areEqual(e.clientX, 600, 'clientX not the same as changedTouches pageX');
                Y.Assert.areEqual(e.clientY, 600, 'clientY not the same as changedTouches pageX');
            });

            node.tap(startOpts, endOpts);
            Y.Assert.isTrue(clicked, "clicked boolean should be flipped if there are changedTouches");
        }
    }));

    Y.Test.Runner.add(suite);

}, '@VERSION@' ,{requires:['event-tap','test', 'node-event-simulate']});
