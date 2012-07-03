YUI.add('gesture-simulate', function(Y) {

(function() {
/**
 * Simulate user gestuires by generating a set of native DOM events.
 *
 * @module gesture-simulate
 * @requires event-simulate, async-queue, node-screen
 */

var gestureNames = {
        tap: 1,
        doubletap: 1,
        press: 1,
        gesturemove: 1,
        flick: 1,
        pinch: 1,
        rotate: 1
    },
    document = Y.config.doc,
    emptyTouchList,

    DEFAULTS = {
        EVENT_INTERVAL: 20,     // 20ms
        START_PAGEX: 0,         // will be adjusted to the node element center
        START_PAGEY: 0,         // will be adjusted to the node element center
        DISTANCE: 200,          // 200 pixels
        DURATION: 1000,         // 1sec
        HOLD_PRESS: 3000,       // 3sec
        HOLD_TAP: 10,           // 10ms
        DELAY_TAP: 10,          // 10ms
        MAX_DURATION_MOVE: 5000,// 5sec
        MIN_HOLD_PRESS: 1000,   // 1sec
        MAX_HOLD_PRESS: 60000,  // 1min
        MIN_VELOCITY: 1.3
    },

    TOUCH_START = 'touchstart',
    TOUCH_MOVE = 'touchmove',
    TOUCH_END = 'touchend',

    GESTURE_START = 'gesturestart',
    GESTURE_CHANGE = 'gesturechange',
    GESTURE_END = 'gestureend',

    MOUSE_DBLCLICK = 'dblclick',

    X_AXIS = 'x',
    Y_AXIS = 'y';

function Simulations(node) {
    if(!node) {
        Y.error(NAME+': invalid target node');
    }
    this.node = node;
    this.target = Y.Node.getDOMNode(node);

    DEFAULTS.START_PAGEX = this.node.getX() + this.target.getBoundingClientRect().width/2;
    DEFAULTS.START_PAGEY = this.node.getY() + this.target.getBoundingClientRect().height/2;

    if(Y.Event.GestureSimulation.defaults) {
        DEFAULTS = Y.merge(DEFAULTS, Y.Event.GestureSimulation.defaults);
    }
}

Simulations.prototype = {

    _toRadian: function(deg) {
        return deg * (Math.PI/180);
    },

    _calculateDefaultPoint: function(point) {

        if(!Y.Lang.isArray(point) || point.length === 0) {
            point = [DEFAULTS.START_PAGEX, DEFAULTS.START_PAGEY];
        } else {
            if(point.length == 1) {
                point[1] = this.target.getBoundingClientRect().height/2;
            }
            // convert to page(viewport) coordination
            point[0] = this.node.getX() + point[0];
            point[1] = this.node.getY() + point[1];
        }

        return point;
    },

    rotate: function(center, startRadius, endRadius, duration, start, rotation) {
        var radius,
            r1 = startRadius,   // optional
            r2 = endRadius;     // optional

        if(!Y.Lang.isNumber(r1) || !Y.Lang.isNumber(r2) || r1<0 || r2<0) {
            radius = (this.target.offsetWidth < this.target.offsetHeight)? 
                this.target.offsetWidth/2 : this.target.offsetHeight/2;
            r1 = radius;
            r2 = radius;
        }

        // required
        if(!Y.Lang.isNumber(rotation)) {
            Y.error(NAME+'Invalid rotation detected.');
        }

        this.pinch(center, r1, r2, duration, start, rotation);
    },

    pinch: function(center, startRadius, endRadius, duration, start, rotation) {
        var eventQueue,
            interval = DEFAULTS.EVENT_INTERVAL,
            touches,
            id = 0,
            r1 = startRadius,   // required
            r2 = endRadius,     // required
            radiusPerStep,
            centerX, centerY,
            startScale, endScale, scalePerStep,
            startRot, endRot, rotPerStep, rotPerStepRadian,
            path1 = {start: [], end: []}, // paths for 1st and 2nd fingers. 
            path2 = {start: [], end: []},
            steps;

        center = this._calculateDefaultPoint(center);

        if(!Y.Lang.isNumber(r1) || !Y.Lang.isNumber(r2) || r1<0 || r2<0) {
            Y.error(NAME+'Invalid startRadius and endRadius detected.');
        }

        if(!Y.Lang.isNumber(duration) || duration <= 0) {
            duration = DEFAULTS.DURATION;
        }

        if(!Y.Lang.isNumber(start)) {
            start = 0.0;
        } else {
            start = start%360;
            if(start < 0) {
                start += 360;
            }
        }

        if(!Y.Lang.isNumber(rotation)) {
            rotation = 0.0;
        }

        Y.AsyncQueue.defaults.timeout = interval;
        eventQueue = new Y.AsyncQueue();

        // range determination
        centerX = center[0];
        centerY = center[1];

        startRot = start;
        endRot = start + rotation;

        // 1st finger path
        path1.start = [
            centerX+r1*Math.sin(this._toRadian(startRot)), 
            centerY-r1*Math.cos(this._toRadian(startRot))
        ];
        path1.end   = [
            centerX + r2*Math.sin(this._toRadian(endRot - startRot)), 
            centerY - r2*Math.cos(this._toRadian(endRot - startRot))
        ];

        // 2nd finger path
        path2.start = [
            centerX - r1*Math.sin(this._toRadian(startRot)), 
            centerY + r1*Math.cos(this._toRadian(startRot))
        ];
        path2.end   = [
            centerX - r2*Math.sin(this._toRadian(endRot - startRot)), 
            centerY + r2*Math.cos(this._toRadian(endRot - startRot))
        ];

        startScale = 1.0;
        endScale = endRadius/startRadius;

        // touch/gesture start
        eventQueue.add({
            fn: function() {
                var coord1, coord2, coord, touches;

                // coordinate for each touch object.
                coord1 = {
                    pageX: path1.start[0], 
                    pageY: path1.start[1],
                    clientX: path1.start[0], 
                    clientY: path1.start[1]
                };
                coord2 = {
                    pageX: path2.start[0], 
                    pageY: path2.start[1],
                    clientX: path2.start[0], 
                    clientY: path2.start[1]
                };
                touches = this._createTouchList([Y.merge({
                    identifier: id++   
                }, coord1), Y.merge({
                    identifier: id++
                }, coord2)]);

                // coordinate for top level event
                coord = {
                    pageX: (path1.start[0] + path2.start[0])/2,
                    pageY: (path1.start[0] + path2.start[1])/2,
                    clientX: (path1.start[0] + path2.start[0])/2,
                    clientY: (path1.start[0] + path2.start[1])/2
                };

                Y.Event.simulate(this.target, TOUCH_START, Y.merge({
                    touches: touches,
                    targetTouches: touches,
                    changedTouches: touches,
                    scale: startScale,
                    rotation: startRot
                }, coord));

                if(Y.UA.ios >= 2.0) {
                    /* gesture starts when the 2nd finger touch starts.
                    * The implementation will fire 1 touch start event for both fingers,
                    * simulating 2 fingers touched on the screen at the same time.
                    */
                    Y.Event.simulate(this.target, GESTURE_START, Y.merge({
                        scale: startScale,
                        rotation: startRot
                    }, coord));
                }
            },
            timeout: 0,
            context: this
        });

        // gesture change
        steps = Math.floor(duration/interval);
        radiusPerStep = (r2 - r1)/steps;
        scalePerStep = (endScale - startScale)/steps;
        rotPerStep = (endRot - startRot)/steps;
        rotPerStepRadian = this._toRadian(endRot - startRot)/steps;

        for(var i=0; i<steps; i++) {
            eventQueue.add({
                fn: function(i) {
                    var radius = r1 + (radiusPerStep)*i,
                        px1 = centerX + radius*Math.sin(startRot + rotPerStepRadian*i),
                        py1 = centerY - radius*Math.cos(startRot + rotPerStepRadian*i),
                        px2 = centerX - radius*Math.sin(startRot + rotPerStepRadian*i),
                        py2 = centerY + radius*Math.cos(startRot + rotPerStepRadian*i),
                        px = (px1+px2)/2,
                        py = (py1+py2)/2,
                        coord1, coord2, coord, touches;

                    // coordinate for each touch object.    
                    coord1 = {
                        pageX: px1,
                        pageY: py1,
                        clientX: px1,
                        clientY: py1
                    };
                    coord2 = {
                        pageX: px2,
                        pageY: py2,
                        clientX: px2,
                        clientY: py2
                    };
                    touches = this._createTouchList([Y.merge({
                        identifier: id++   
                    }, coord1), Y.merge({
                        identifier: id++
                    }, coord2)]);

                    // coordinate for top level event
                    coord = {
                        pageX: px,
                        pageY: py,
                        clientX: px,
                        clientY: py
                    };

                    Y.Event.simulate(this.target, TOUCH_MOVE, Y.merge({
                        touches: touches,
                        targetTouches: touches,
                        changedTouches: touches,
                        scale: startScale + scalePerStep*i,
                        rotation: startRot + rotPerStep*i
                    }, coord));

                    if(Y.UA.ios >= 2.0) {
                        Y.Event.simulate(this.target, GESTURE_CHANGE, Y.merge({
                            scale: startScale + scalePerStep*i,
                            rotation: startRot + rotPerStep*i
                        }, coord));
                    }
                },
                args: [i],
                context: this
            });
        }

        // gesture end
        eventQueue.add({
            fn: function() {
                var emptyTouchList = this._getEmptyTouchList(),
                    coord1, coord2, coord, touches;

                // coordinate for each touch object.
                coord1 = {
                    pageX: path1.end[0], 
                    pageY: path1.end[1],
                    clientX: path1.end[0], 
                    clientY: path1.end[1]
                };
                coord2 = {
                    pageX: path2.end[0], 
                    pageY: path2.end[1],
                    clientX: path2.end[0], 
                    clientY: path2.end[1]
                };
                touches = this._createTouchList([Y.merge({
                    identifier: id++   
                }, coord1), Y.merge({
                    identifier: id++
                }, coord2)]);

                // coordinate for top level event
                coord = {
                    pageX: (path1.end[0] + path2.end[0])/2,
                    pageY: (path1.end[0] + path2.end[1])/2,
                    clientX: (path1.end[0] + path2.end[0])/2,
                    clientY: (path1.end[0] + path2.end[1])/2
                };  

                if(Y.UA.ios >= 2.0) {
                    Y.Event.simulate(this.target, GESTURE_END, Y.merge({
                        scale: endScale,
                        rotation: endRot
                    }, coord));
                }

                Y.Event.simulate(this.target, TOUCH_END, Y.merge({
                    touches: emptyTouchList,
                    targetTouches: emptyTouchList,
                    changedTouches: touches,
                    scale: endScale,
                    rotation: endRot
                }, coord));
            },
            context: this
        });

        eventQueue.run();
    },

    tap: function(point, times, hold, delay) {            
        var eventQueue = new Y.AsyncQueue(),
            emptyTouchList = this._getEmptyTouchList(),
            touches,
            coord,
            i;

        point = this._calculateDefaultPoint(point);

        if(!Y.Lang.isNumber(times) || times < 1) {
            times = 1;
        }

        if(!Y.Lang.isNumber(hold)) {
            hold = DEFAULTS.HOLD_TAP;
        }

        if(!Y.Lang.isNumber(delay)) {
            delay = DEFAULTS.DELAY_TAP;
        }

        coord = {
            pageX: point[0], 
            pageY: point[1],
            clientX: point[0], 
            clientY: point[1]
        };

        touches = this._createTouchList([Y.merge({identifier: 0}, coord)]);

        for(i=0; i<times; i++) {
            eventQueue.add({
                fn: function() {
                    Y.Event.simulate(this.target, TOUCH_START, Y.merge({
                        touches: touches,
                        targetTouches: touches,
                        changedTouches: touches
                    }, coord));
                },
                context: this,
                timeout: (i === 0)? 0 : delay
            });

            eventQueue.add({
                fn: function() {
                    Y.Event.simulate(this.target, TOUCH_END, Y.merge({
                        touches: emptyTouchList,
                        targetTouches: emptyTouchList,
                        changedTouches: touches
                    }, coord));
                },
                context: this,
                timeout: hold
            });
        }

        if(times > 1 && !((Y.config.win && ("ontouchstart" in Y.config.win)) && !(Y.UA.chrome && Y.UA.chrome < 6))) {
            eventQueue.add({
                fn: function() {
                    Y.Event.simulate(this.target, MOUSE_DBLCLICK, coord);
                },
                context: this
            });
        }

        eventQueue.run();
    },

    flick: function(point, axis, distance, duration) {
        var path;

        point = this._calculateDefaultPoint(point);

        if(!Y.Lang.isString(axis)) {
            axis = X_AXIS;
        } else {
            axis = axis.toLowerCase();
            if(axis !== X_AXIS && axis !== Y_AXIS) {
                Y.error(NAME+'(flick): Only x or y axis allowed');
            }
        }

        if(!Y.Lang.isNumber(distance)) { 
            distance = DEFAULTS.DISTANCE; 
        }

        if(!Y.Lang.isNumber(duration)){
            duration = DEFAULTS.DURATION; // ms
        } else {
            if(duration > DEFAULTS.MAX_DURATION_MOVE) {
                duration = DEFAULTS.MAX_DURATION_MOVE;
            }
        }

        /**
            * Check if too slow for a flick.
            * Adjust duration if the calculated velocity is less than 
            * the minimum velcocity to be claimed as a flick.
            */
        if(Math.abs(distance)/duration < DEFAULTS.MIN_VELOCITY) {
            duration = Math.abs(distance)/DEFAULTS.MIN_VELOCITY;
        }

        path = {
            start: Y.clone(point),
            end: [
                (axis === X_AXIS) ? point[0]+distance : point[0],
                (axis === Y_AXIS) ? point[1]+distance : point[1]
            ]
        };

        this._gesturemove(path, duration);
    },

    gesturemove: function(path, duration) {
        var convertedPath;

        if(!Y.Lang.isObject(path)) {
            path = {
                point: this._calculateDefaultPoint([]),
                xdist: DEFAULTS.DISTANCE,
                ydist: 0
            };
        } else {
            // convert to the page coordination
            if(!Y.Lang.isArray(path.point)) {
                path.point = this._calculateDefaultPoint([]);
            } else {
                path.point = this._calculateDefaultPoint(path.point);
            }

            if(!Y.Lang.isNumber(path.xdist)) {
                path.xdist = DEFAULTS.DISTANCE;
            }

            if(!Y.Lang.isNumber(path.ydist)) {
                path.ydist = 0;
            }
        }

        convertedPath = {
            start: Y.clone(path.point),
            end: [path.point[0]+path.xdist, path.point[1]+path.ydist]
        };

        this._gesturemove(convertedPath, duration);
    },

    _gesturemove: function(path, duration) {
        var eventQueue,
            interval = DEFAULTS.EVENT_INTERVAL,
            steps, stepX, stepY,
            id = 0;

        if(!Y.Lang.isNumber(duration)){
            duration = DEFAULTS.DURATION; // ms
        } else {
            if(duration > DEFAULTS.MAX_DURATION_MOVE) {
                duration = DEFAULTS.MAX_DURATION_MOVE;
            }
        }

        if(!Y.Lang.isObject(path)) {
            path = {
                start: [
                    DEFAULTS.START_PAGEX, 
                    DEFAULTS.START_PAGEY
                ], 
                end: [
                    DEFAULTS.START_PAGEX + DEFAULTS.DISTANCE, 
                    DEFAULTS.START_PAGEY
                ]
            };
        } else {
            if(!Y.Lang.isArray(path.start)) {
                path.start = [
                    DEFAULTS.START_PAGEX, 
                    DEFAULTS.START_PAGEY
                ];
            }
            if(!Y.Lang.isArray(path.end)) {
                path.end = [
                    DEFAULTS.START_PAGEX + DEFAULTS.DISTANCE, 
                    DEFAULTS.START_PAGEY
                ];
            }
        }

        Y.AsyncQueue.defaults.timeout = interval;
        eventQueue = new Y.AsyncQueue();

        // start
        eventQueue.add({
            fn: function() {
                var coord = {
                        pageX: path.start[0], 
                        pageY: path.start[1],
                        clientX: path.start[0], 
                        clientY: path.start[1]
                    }, 
                    touches = this._createTouchList([
                        Y.merge({identifier: id++}, coord)
                    ]);

                Y.Event.simulate(this.target, TOUCH_START, Y.merge({
                    touches: touches,
                    targetTouches: touches,
                    changedTouches: touches
                }, coord));
            },
            timeout: 0,
            context: this
        });

        // move
        steps = Math.floor(duration/interval);
        stepX = (path.end[0] - path.start[0])/steps;
        stepY = (path.end[1] - path.start[1])/steps;

        for(var i=0; i<steps; i++) {
            eventQueue.add({
                fn: function(i) {
                    var px = path.start[0]+(stepX * i),
                        py = path.start[1]+(stepY * i), 
                        coord = {
                            pageX: px, 
                            pageY: py,
                            clientX: px,
                            clientY: py
                        }, 
                        touches = this._createTouchList([
                            Y.merge({identifier: id++}, coord)
                        ]);

                    Y.Event.simulate(this.target, TOUCH_MOVE, Y.merge({
                        touches: touches,
                        targetTouches: touches,
                        changedTouches: touches
                    }, coord));
                },
                args: [i],
                context: this
            });
        }

        // last move
        eventQueue.add({
            fn: function() {
                var coord = {
                        pageX: path.end[0], 
                        pageY: path.end[1],
                        clientX: path.end[0], 
                        clientY: path.end[1]
                    },
                    touches = this._createTouchList([
                        Y.merge({identifier: id}, coord)
                    ]);

                Y.Event.simulate(this.target, TOUCH_MOVE, Y.merge({
                    touches: touches,
                    targetTouches: touches,
                    changedTouches: touches
                }, coord));
            },
            timeout: 0,
            context: this
        });

        // end
        eventQueue.add({
            fn: function() {
                var coord = {
                    pageX: path.end[0], 
                    pageY: path.end[1],
                    clientX: path.end[0], 
                    clientY: path.end[1]
                },
                emptyTouchList = this._getEmptyTouchList(),
                touches = this._createTouchList([
                    Y.merge({identifier: id}, coord)
                ]);

                Y.Event.simulate(this.target, TOUCH_END, Y.merge({
                    touches: emptyTouchList,
                    targetTouches: emptyTouchList,
                    changedTouches: touches
                }, coord));
            },
            context: this
        });

        eventQueue.run();
    },

    _getEmptyTouchList: function() {
        if(!emptyTouchList) {
            emptyTouchList = this._createTouchList([]);
        }

        return emptyTouchList;
    },

    _createTouchList: function(touchPoints) {
        /*
        * Android 4.0.3 emulator:
        * Native touch api supported starting in version 4.0 (Ice Cream Sandwich).
        * However the support seems limited. In Android 4.0.3 emulator, I got
        * "TouchList is not defined".
        */
        var touches = [],
            touchList,
            self = this;

        if(!!touchPoints && Y.Lang.isArray(touchPoints)) {
            if(Y.UA.android && Y.UA.android >= 4.0 || Y.UA.ios && Y.UA.ios >= 2.0) {
                Y.each(touchPoints, function(point) {
                    if(!point.identifier) {point.identifier = 0;}
                    if(!point.pageX) {point.pageX = 0;}
                    if(!point.pageY) {point.pageY = 0;}
                    if(!point.screenX) {point.screenX = 0;}
                    if(!point.screenY) {point.screenY = 0;}

                    touches.push(document.createTouch(Y.config.win, 
                        self.target,
                        point.identifier, 
                        point.pageX, point.pageY, 
                        point.screenX, point.screenY));
                });

                touchList = document.createTouchList.apply(document, touches);
            } else if(Y.UA.ios && Y.UA.ios < 2.0) { 
                Y.error(NAME+': No touch event simulation framework present.');
            } else {
                // this will inclide android(Y.UA.android && Y.UA.android < 4.0) 
                // and desktops among all others. 

                /**
                    * Touch APIs are broken in androids older than 4.0. We will use 
                    * simulated touch apis for these versions. 
                    */
                touchList = [];
                Y.each(touchPoints, function(point) {
                    if(!point.identifier) {point.identifier = 0;}
                    if(!point.clientX)  {point.clientX = 0;}
                    if(!point.clientY)  {point.clientY = 0;}
                    if(!point.pageX)    {point.pageX = 0;}
                    if(!point.pageY)    {point.pageY = 0;}
                    if(!point.screenX)  {point.screenX = 0;}
                    if(!point.screenY)  {point.screenY = 0;}

                    touchList.push({
                        target: self.target,
                        identifier: point.identifier,
                        clientX: point.clientX,
                        clientY: point.clientY,
                        pageX: point.pageX,
                        pageY: point.pageY,
                        screenX: point.screenX,
                        screenY: point.screenY
                    });
                });

                touchList.item = function(i) {
                    return touchList[i];
                };
            }
        } else {
            Y.error(NAME+': Invalid touchPoints passed');
        }

        return touchList;
    }
};

// high level gesture names that YUI knows how to simulate.
Y.Event.GESTURES = gestureNames;
Y.Event.GestureSimulation = Simulations;          // should make private?
Y.Event.GestureSimulation.defaults = DEFAULTS;

Y.Event.simulateGesture = function(node, name, options) {

    var sim = new Y.Event.GestureSimulation(node);
    name = name.toLowerCase();
    options = options || {};

    if (Y.Event.GESTURES[name]) {
        switch(name) {
            // single-touch: point gestures 
            case 'tap':
                sim.tap(options.point, options.times, options.hold, options.delay);
                break;
            case 'doubletap':
                sim.tap(options.point, 2);
                break;
            case 'press':
                if(!Y.Lang.isNumber(options.hold)) {
                    options.hold = DEFAULTS.HOLD_PRESS;
                } else if(options.hold < DEFAULTS.MIN_HOLD_PRESS) {
                    options.hold = DEFAULTS.MIN_HOLD_PRESS;
                } else if(options.hold > DEFAULTS.MAX_HOLD_PRESS) {
                    options.hold = DEFAULTS.MAX_HOLD_PRESS;
                }
                sim.tap(options.point, 1, options.hold);
                break;

            // single-touch: move gestures
            // as per Satyen's suggestion, changed "move" to "gesturemove". 
            case 'gesturemove':
                sim.gesturemove(options.path, options.duration);
                break;
            case 'flick':
                sim.flick(options.point, options.axis, options.distance, 
                    options.duration);
                break;

            // multi-touch: pinch/rotation gestures
            case 'pinch':
                sim.pinch(options.center, options.r1, options.r2, 
                    options.duration, options.start, options.rotation);
                break;    
            case 'rotate':
                sim.rotate(options.center, options.r1, options.r2, 
                    options.duration, options.start, options.rotation);
                break;
        }
    } else {
        Y.error(NAME+': Not a supported gesture simulation: '+name);
    }
};

})();


}, '@VERSION@' ,{requires:['event-simulate', 'async-queue', 'node-screen']});
