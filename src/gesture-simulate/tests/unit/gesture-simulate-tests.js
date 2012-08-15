YUI.add('gesture-simulate-tests', function(Y) {

    // phantomjs check may be temporary, until we determine if it really support touch all the way through, like it claims to (http://code.google.com/p/phantomjs/issues/detail?id=375)
    var SUPPORTS_TOUCH = ((Y.config.win && ("ontouchstart" in Y.config.win)) && !(Y.UA.phantomjs) && !(Y.UA.chrome && Y.UA.chrome < 6));

    Y.namespace("Tests");
    
    Y.Tests.GestureSimulate = (function(){
    
        function CustomAssertion() {};
        CustomAssertion.prototype.isIn = function(current, ideal, threshold, msg) {
            var low = ideal-threshold,
                high = ideal+threshold;
            msg = msg || "";
            msg = "(value:"+current+", range:"+low+"-"+high+") - "+msg;
            Y.Assert.isTrue(current>low && current<high, msg);
        };
    
        var Assert = Y.augment(Y.Assert, CustomAssertion),
            touchable = Y.one("#touchable"),
            glasspane = Y.one("#glasspane"),
            events = [
                "touchstart", "touchmove", "touchend", "touchcancel",
                "mousedown", "mousemove", "mouseup", "mouseout", "mouseover", "click", "dblclick",
                "gesturestart", "gesturechange", "gestureend"
            ];
        
        //-------------------------------------------------------------------------
        // Generic Event Test Case
        //-------------------------------------------------------------------------
        function GenericGestureTestCase(name /*:String*/){
            GenericGestureTestCase.superclass.constructor.call(this);
            this.gestureName = name;
            this.name = "Gesture '" + name + "' Tests";
            this.result = [];
        }
    
        Y.extend(GenericGestureTestCase, Y.Test.Case, {
            
            //---------------------------------------------------------------------
            // Setup and teardown of test harnesses
            //---------------------------------------------------------------------
            setUp : function() /*:Void*/{
                
                //reset the result
                this.result = [];
                
                Y.each(events, Y.bind(function(one) {
                    touchable.on(one, Y.bind(function(e) {
                        e.preventDefault();
                        // e = e || window.event;
                        e.timestamp = new Date().getTime();
                        this.result.push(e);
                    }, this));
                    
                    glasspane.on(one, Y.bind(function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }, this));
                }, this));
            },

            /*
             * Removes event handlers that were used during the test.
             */
            tearDown : function() /*:Void*/{
                Y.each(events, Y.bind(function(one) {
                    touchable.detach(one);
                    glasspane.detach(one);
                }, this));
            }
        });
        
        
        //-------------------------------------------------------------------------
        // Flick Test Case
        // This will cover flick gestures.
        //-------------------------------------------------------------------------
        function FlickTestCase() {
            FlickTestCase.superclass.constructor.call(this, "flick");
        }
        
        Y.extend(FlickTestCase, GenericGestureTestCase, {
            "test default flick gesture": function() {
                var that = this,
                    durationThreshold = 250,
                    distance = Y.GestureSimulation.defaults.DISTANCE_FLICK,
                    duration = Math.abs(distance)/Y.GestureSimulation.defaults.MIN_VELOCITY_FLICK;
                
                // The default behavior is to flick 200 pixels(DEFAULTS.DISTANCE) 
                // from the center of the element to the positive X-axis direction
                // for around 153.8ms (DEFAULTS.DISTANCE/DEFAULTS.MIN_VELOCITY). 
                // See gesture-simulate for DEFAULTS.
                Y.Event.simulateGesture(touchable, this.gestureName, function(err) {
                    that.resume(function() {
                        if(err) {
                            Assert.fail("Error from the simulation framework: "+that.gestureName);
                        } else {
                            var last = that.result.length-1;
                            Assert.isTrue((that.result[last].timestamp - that.result[0].timestamp)
                                >= (duration - durationThreshold));

                            if(SUPPORTS_TOUCH) {
                                // touch enabled devices
                                // touchstart, touchmove(xN), touchend 
                                Assert.isTrue(that.result.length >= 3);
                                Assert.areSame(that.result[0].type, "touchstart");
                                Assert.areSame(that.result[1].type, "touchmove");
                                Assert.areSame(that.result[last-1].type, "touchmove");
                                Assert.areSame(that.result[last].type, "touchend");

                                for(var i=0; i<that.result.length-1; i++) {
                                    Assert.isIn(that.result[i].touches[0].clientY, 
                                        that.result[0].touches[0].clientY, 5);
                                }
                                
                                Assert.isIn(that.result[last-1].touches[0].clientX,
                                    that.result[0].touches[0].clientX+distance, 5);
                            } else {
                                // devices falling back to mouse events
                                // mousedown, mousemove(xN), mouseup, click 
                                Assert.isTrue(that.result.length >= 4);
                                Assert.areSame(that.result[0].type, "mousedown");
                                Assert.areSame(that.result[1].type, "mousemove");
                                Assert.areSame(that.result[last-2].type, "mousemove");
                                Assert.areSame(that.result[last-1].type, "mouseup");
                                Assert.areSame(that.result[last].type, "click");

                                Y.each(that.result, function(one) {
                                    Assert.isIn(one.clientY, that.result[0].clientY, 5);
                                });
                                
                                Assert.isIn(that.result[last].clientX, 
                                    that.result[0].clientX+distance, 5);
                            }
                        }
                    });
                });
                
                this.wait();
            },
            
            "test flick to left for 100ms on a designated spot": function() {
                var that = this,
                    durationThreshold = 250,
                    options = {
                        point: [300, 100],
                        axis: "x",
                        distance: -150,
                        duration: 100
                    },
                    xdistance = options.distance,
                    ydistance = 0,
                    duration = options.duration;
        
                Y.Event.simulateGesture(touchable, this.gestureName, options, function(err) {
                    that.resume(function() {
                        if(err) {
                            Assert.fail("Error from the simulation framework: "+that.gestureName);
                        } else {
                            var last = that.result.length-1;
                            Assert.isTrue((that.result[last].timestamp - that.result[0].timestamp) 
                                >= (duration - durationThreshold));

                            if(SUPPORTS_TOUCH) {
                                // touch enabled devices
                                // touchstart, touchmove(xN), touchend 
                                Assert.isTrue(that.result.length >= 3);
                                Assert.areSame(that.result[0].type, "touchstart");
                                Assert.areSame(that.result[1].type, "touchmove");
                                Assert.areSame(that.result[last-1].type, "touchmove");
                                Assert.areSame(that.result[last].type, "touchend");
                                
                                Assert.isIn(that.result[last-1].touches[0].clientX, 
                                    that.result[0].touches[0].clientX+xdistance, 5);
                                Assert.isIn(that.result[last-1].touches[0].clientY, 
                                    that.result[0].touches[0].clientY+ydistance, 5);
                            } else {
                                // mousedown, mousemove(xN), mouseup, click 
                                Assert.isTrue(that.result.length >= 4);
                                Assert.areSame(that.result[0].type, "mousedown");
                                Assert.areSame(that.result[1].type, "mousemove");
                                Assert.areSame(that.result[last-2].type, "mousemove");
                                Assert.areSame(that.result[last-1].type, "mouseup");
                                Assert.areSame(that.result[last].type, "click");
                                
                                Assert.isIn(that.result[last].clientX, 
                                    that.result[0].clientX+xdistance, 5);
                                Assert.isIn(that.result[last].clientY, 
                                    that.result[0].clientY+ydistance, 5);
                            }
                        }
                    });
                });
                
                this.wait();
            },
            
            "test flick gesture with auto adjustment of duration when too slow": function() {
                var that = this,
                    durationThreshold = 250,
                    options = {
                        point: [300, 100],
                        axis: "x",
                        distance: -150,
                        duration: 200
                    },
                    xdistance = options.distance,
                    ydistance = 0,
                    
                    // The user given velocity, 150/200=0.75 is less than minmum velocity(1.3)
                    // Since it's too slow movement for a flick, the framework will
                    // automatically adjust the duration.
                    duration = Math.abs(xdistance)/Y.GestureSimulation.defaults.MIN_VELOCITY_FLICK;
        
                Y.Event.simulateGesture(touchable, this.gestureName, options, function(err) {
                    that.resume(function() {
                        if(err) {
                            Assert.fail("Error from the simulation framework: "+that.gestureName);
                        } else {
                            var last = that.result.length-1;
                            Assert.isTrue((that.result[last].timestamp - that.result[0].timestamp) 
                                >= (duration - durationThreshold));

                            if(SUPPORTS_TOUCH) {
                                // touch enabled devices
                                // touchstart, touchmove(xN), touchend 
                                Assert.isTrue(that.result.length >= 3);
                                Assert.areSame(that.result[0].type, "touchstart");
                                Assert.areSame(that.result[1].type, "touchmove");
                                Assert.areSame(that.result[last-1].type, "touchmove");
                                Assert.areSame(that.result[last].type, "touchend");
                                
                                
                                Assert.isIn(that.result[last-1].touches[0].clientX, 
                                    that.result[0].touches[0].clientX+xdistance, 5);
                                Assert.isIn(that.result[last-1].touches[0].clientY, 
                                    that.result[0].touches[0].clientY+ydistance, 5);
                            } else {
                                // mousedown, mousemove(xN), mouseup, click 
                                Assert.isTrue(that.result.length >= 4);
                                Assert.areSame(that.result[0].type, "mousedown");
                                Assert.areSame(that.result[1].type, "mousemove");
                                Assert.areSame(that.result[last-2].type, "mousemove");
                                Assert.areSame(that.result[last-1].type, "mouseup");
                                Assert.areSame(that.result[last].type, "click");
                                
                                Assert.isIn(that.result[last].clientX, 
                                    that.result[0].clientX+xdistance, 5);
                                Assert.isIn(that.result[last].clientY, 
                                    that.result[0].clientY+ydistance, 5);
                            }
                        }
                    });
                });
                
                this.wait();
            }
        });
        
        
        //-------------------------------------------------------------------------
        // Move Test Case
        // This will cover move gestures
        //-------------------------------------------------------------------------
        function MoveTestCase() {
            MoveTestCase.superclass.constructor.call(this, "move");
        }
        
        Y.extend(MoveTestCase, GenericGestureTestCase, {
            
            "test default move gesture": function() {
                var that = this,
                    durationThreshold = 250,
                    duration = Y.GestureSimulation.defaults.DURATION_MOVE,
                    distance = Y.GestureSimulation.defaults.DISTANCE_MOVE;
                
                // The default behavior is to drag 200 pixels(DEFAULTS.DISTANCE) 
                // from the center of the element to the positive X-axis direction
                // for 1s(DEFAULTS.DURATION). See gesture-simulate for DEFAULTS.
                Y.Event.simulateGesture(touchable, this.gestureName, function(err) {
                    that.resume(function() {
                        if(err) {
                            Assert.fail("Error from the simulation framework: "+that.gestureName);
                        } else {
                            var last = that.result.length-1;
                            Assert.isTrue((that.result[last].timestamp - that.result[0].timestamp) 
                                >= (duration - durationThreshold));

                            if(SUPPORTS_TOUCH) {
                                // touch enabled devices
                                // touchstart, touchmove(xN), touchend 
                                Assert.isTrue(that.result.length >= 3);
                                Assert.areSame(that.result[0].type, "touchstart");
                                Assert.areSame(that.result[1].type, "touchmove");
                                Assert.areSame(that.result[last-1].type, "touchmove");
                                Assert.areSame(that.result[last].type, "touchend");

                                for(var i=0; i<that.result.length-1; i++) {
                                    Assert.isIn(that.result[i].touches[0].clientY, 
                                        that.result[0].touches[0].clientY, 5);
                                }
                                
                                Assert.isIn(that.result[last-1].touches[0].clientX,
                                that.result[0].touches[0].clientX+distance, 5);
                            } else {
                                // mousedown, mousemove(xN), mouseup, click 
                                Assert.isTrue(that.result.length >= 4);
                                Assert.areSame(that.result[0].type, "mousedown");
                                Assert.areSame(that.result[1].type, "mousemove");
                                Assert.areSame(that.result[last-2].type, "mousemove");
                                Assert.areSame(that.result[last-1].type, "mouseup");
                                Assert.areSame(that.result[last].type, "click");

                                Y.each(that.result, function(one) {
                                    Assert.isIn(one.clientY, that.result[0].clientY, 5);
                                });
                                
                                Assert.isIn(that.result[last].clientX,
                                that.result[0].clientX+distance, 5);
                            }
                        }
                    });
                });
                
                this.wait();
            },
            
            "test move gesture on a designated spot to X and Y axies direction": function() {
                var that = this,
                    durationThreshold = 250,
                    options = {
                        path: {
                            point: [95, 200],
                            xdist: 50,
                            ydist: -50
                        },
                        duration: 2000
                    },
                    xdistance = options.path.xdist,
                    ydistance = options.path.ydist,
                    duration = options.duration;
                
                Y.Event.simulateGesture(touchable, this.gestureName, options, function(err) {
                    that.resume(function() {
                        if(err) {
                            Assert.fail("Error from the simulation framework: "+that.gestureName);
                        } else {
                            var last = that.result.length-1;
                            Assert.isTrue((that.result[last].timestamp - that.result[0].timestamp) 
                                >= (duration - durationThreshold));

                            if(SUPPORTS_TOUCH) {
                                // touch enabled devices
                                // touchstart, touchmove(xN), touchend 
                                Assert.isTrue(that.result.length >= 3);
                                Assert.areSame(that.result[0].type, "touchstart");
                                Assert.areSame(that.result[1].type, "touchmove");
                                Assert.areSame(that.result[last-1].type, "touchmove");
                                Assert.areSame(that.result[last].type, "touchend");
                                
                                Assert.isIn(that.result[last-1].touches[0].clientX,
                                    that.result[0].touches[0].clientX+xdistance, 5);
                                
                                Assert.isIn(that.result[last-1].touches[0].clientY, 
                                    that.result[0].touches[0].clientY+ydistance, 5);
                            } else {
                                // mousedown, mousemove(xN), mouseup, click 
                                Assert.isTrue(that.result.length >= 4);
                                Assert.areSame(that.result[0].type, "mousedown");
                                Assert.areSame(that.result[1].type, "mousemove");
                                Assert.areSame(that.result[last-2].type, "mousemove");
                                Assert.areSame(that.result[last-1].type, "mouseup");
                                Assert.areSame(that.result[last].type, "click");
                                
                                Assert.isIn(that.result[last].clientX, 
                                    that.result[0].clientX+xdistance, 5);
                                Assert.isIn(that.result[last].clientY, 
                                    that.result[0].clientY+ydistance, 5);
                            }
                        }
                    });
                });
                
                this.wait();
            }
        });
        
        //-------------------------------------------------------------------------
        // DoubleTap Test Case
        // This will cover the doubletap sugar gestures.
        //-------------------------------------------------------------------------
    
        function DoubleTapTestCase(){
            DoubleTapTestCase.superclass.constructor.call(this, "doubletap");
        }
    
        Y.extend(DoubleTapTestCase, GenericGestureTestCase, {
            
            "test doubletap gesture": function() {
                var that = this;
                Y.Event.simulateGesture(touchable, this.gestureName, function(err) {
                    that.resume(function() {
                        if(err) {
                            Assert.fail("Error from the simulation framework: "+that.gestureName);
                        } else {
                            if(SUPPORTS_TOUCH) {
                                // touch enabled devices
                                // (touchstart, touchend)x2
                                Assert.areSame(4, that.result.length, "should be two");
                                Assert.areSame(that.result[0].type, "touchstart");
                                Assert.areSame(that.result[1].type, "touchend");
                                Assert.areSame(that.result[2].type, "touchstart");
                                Assert.areSame(that.result[3].type, "touchend");
                            } else {
                                // devices falling back to mouse events
                                // (mousedown, mouseup and click)x2, dblclick
                                Assert.areSame(7, that.result.length, "should be three");
                                Assert.areSame(that.result[0].type, "mousedown");
                                Assert.areSame(that.result[1].type, "mouseup");
                                Assert.areSame(that.result[2].type, "click");
                                Assert.areSame(that.result[3].type, "mousedown");
                                Assert.areSame(that.result[4].type, "mouseup");
                                Assert.areSame(that.result[5].type, "click");
                                Assert.areSame(that.result[6].type, "dblclick");
                            }
                        }
                    });
                });
                
                this.wait();
            }
        });
        
        //-------------------------------------------------------------------------
        // Press Test Case
        // This will cover the press sugar gestures.
        //-------------------------------------------------------------------------
    
        function PressTestCase(){
            PressTestCase.superclass.constructor.call(this, "press");
        }
    
        Y.extend(PressTestCase, GenericGestureTestCase, {
            
            "test default press gesture": function() {
                var that = this;
                Y.Event.simulateGesture(touchable, this.gestureName, function(err) {
                    that.resume(function() {
                        if(err) {
                            Assert.fail("Error from the simulation framework: "+that.gestureName);
                        } else {
                            if(SUPPORTS_TOUCH) {
                                // touch enabled devices
                                // touchstart, touchend
                                Assert.areSame(2, that.result.length, "should be two");
                                Assert.areSame(that.result[0].type, "touchstart");
                                Assert.areSame(that.result[1].type, "touchend");
                            } else {
                                // devices falling back to mouse events
                                // mousedown, mouseup and click events.
                                Assert.areSame(3, that.result.length, "should be three");
                                Assert.areSame(that.result[0].type, "mousedown");
                                Assert.areSame(that.result[1].type, "mouseup");
                                Assert.areSame(that.result[2].type, "click");
                            }
                        }
                    });
                });
                
                this.wait();
            },
            
            "test long press for 1 sec": function() {
                var that = this,
                    durationThreshold = 250,
                    options = {
                        hold: 1000
                    };
                    
                Y.Event.simulateGesture(touchable, this.gestureName, options, function(err) {
                    that.resume(function() {
                        if(err) {
                            Assert.fail("Error from the simulation framework: "+that.gestureName);
                        } else {
                            if(SUPPORTS_TOUCH) {
                                // touch enabled devices
                                // touchstart, touchend
                                Assert.areSame(2, that.result.length, "should be two");
                                Assert.areSame(that.result[0].type, "touchstart");
                                Assert.areSame(that.result[1].type, "touchend");
                                
                                Assert.isTrue((that.result[1].timestamp - that.result[0].timestamp) 
                                    >= (1000 - durationThreshold), "hold time was set to 1s");
                            } else {
                                // devices falling back to mouse events
                                // mousedown, mouseup and click events.
                                Assert.areSame(3, that.result.length, "should be three");
                                Assert.areSame(that.result[0].type, "mousedown");
                                Assert.areSame(that.result[1].type, "mouseup");
                                Assert.areSame(that.result[2].type, "click");
                                
                                Assert.isTrue((that.result[1].timestamp - that.result[0].timestamp) 
                                    >= (1000 - durationThreshold), "hold time was set to 1s");
                            }
                        }
                    });
                });
                
                this.wait();
            }
        });
        
        
        //-------------------------------------------------------------------------
        // Tap Test Case
        // This will cover tap/doubletap and press gestures.
        //-------------------------------------------------------------------------
    
        function TapTestCase(){
            TapTestCase.superclass.constructor.call(this, "tap");
        }
    
        Y.extend(TapTestCase, GenericGestureTestCase, {
            
            "test gesture callback function": function() {
                var wasCalled = false;
                
                // test callback function
                Y.Event.simulateGesture(touchable, this.gestureName, function() {
                    wasCalled = true;
                });
                
                this.wait(function() {
                    Assert.isTrue(wasCalled, "callback wasn't called");
                }, 3000);
            },
            
            "test default tap gesture": function() {
                var that = this;
                Y.Event.simulateGesture(touchable, this.gestureName, function(err) {
                    that.resume(function() {
                        if(err) {
                            Assert.fail("Error from the simulation framework: "+that.gestureName);
                        } else {
                            if(SUPPORTS_TOUCH) {
                                // touch enabled devices
                                // touchstart, touchend
                                Assert.areSame(2, that.result.length, "should be two");
                                Assert.areSame(that.result[0].type, "touchstart");
                                Assert.areSame(that.result[1].type, "touchend");
                            } else {
                                // devices falling back to mouse events
                                // mousedown, mouseup and click events.
                                Assert.areSame(3, that.result.length, "should be three");
                                Assert.areSame(that.result[0].type, "mousedown");
                                Assert.areSame(that.result[1].type, "mouseup");
                                Assert.areSame(that.result[2].type, "click");
                            }
                        }
                    });
                });
                
                this.wait();
            },
            
            "test double taps on a designated spot with 500ms delay": function() {
                var that = this,
                    durationThreshold = 250,
                    delayThreshold = 200,
                
                    // touchstart/1000ms/touchend/500ms/touchstart/1000ms/touchend/
                    // should take at least 2.5sec in total at element coordination at (95,100).
                    options = {
                        point: [95, 100],
                        times: 2,
                        hold: 1000,
                        delay: 500
                    },
                    expectedX = Math.floor(touchable.getX())+95, 
                    expectedY = Math.floor(touchable.getY())+100;
                    
                Y.Event.simulateGesture(touchable, this.gestureName, options, function(err) {
                    that.resume(function() {
                        if(err) {
                            Assert.fail("Error from the simulation framework: "+that.gestureName);
                        } else {
                            if(SUPPORTS_TOUCH) {
                                // touch enabled devices
                                // touchstart, touchend(x2)
                                Assert.areSame(4, that.result.length, "should be 4 events");
                                Assert.areSame(that.result[0].type, "touchstart");
                                Assert.areSame(that.result[1].type, "touchend");
                                Assert.areSame(that.result[2].type, "touchstart");
                                Assert.areSame(that.result[3].type, "touchend");
                                
                                Assert.isTrue((that.result[1].timestamp - that.result[0].timestamp) 
                                    >= (1000 - durationThreshold), "hold time was set to 1s");

                                Assert.isTrue((that.result[2].timestamp - that.result[1].timestamp) 
                                    >= (500 - delayThreshold), "delay was set to 500ms");

                                Assert.areSame(1, that.result[0].touches.length);

                                Assert.isIn(that.result[0].touches[0].clientX, expectedX, 5, "cx is out of range");
                                Assert.isIn(that.result[0].touches[0].clientY, expectedY, 5, "cy is out of range");

                                Assert.isTrue((that.result[3].timestamp - that.result[0].timestamp) 
                                    >= (2500 - durationThreshold*2 - delayThreshold));
                            } else {
                                // devices falling back to mouse events
                                // mousedown, mouseup, click(x2), dblclick
                                Assert.areSame(7, that.result.length);
                                Assert.areSame(that.result[0].type, "mousedown");
                                Assert.areSame(that.result[1].type, "mouseup");
                                Assert.areSame(that.result[2].type, "click");
                                Assert.areSame(that.result[3].type, "mousedown");
                                Assert.areSame(that.result[4].type, "mouseup");
                                Assert.areSame(that.result[5].type, "click");
                                Assert.areSame(that.result[6].type, "dblclick");
                                
                                Assert.isTrue((that.result[1].timestamp - that.result[0].timestamp) 
                                    >= (1000 - durationThreshold), "hold time was set to 1s");
                                
                                Assert.isTrue((that.result[3].timestamp - that.result[1].timestamp) 
                                    >= (500 - delayThreshold), "delay was set to 500ms"); 

                                Assert.isIn(that.result[0].clientX, expectedX, 5, "cx is out of range");
                                Assert.isIn(that.result[0].clientY, expectedY, 5, "cy is out of range");  

                                Assert.isTrue((that.result[6].timestamp - that.result[0].timestamp) 
                                    >= (2500 - durationThreshold*2 - delayThreshold));
                            }
                        }
                    });
                });
                
                this.wait();
            }
        });
        
        //-------------------------------------------------------------------------
        // Rotate Test Case
        // This will cover rotate gestures.
        // Since they validate multi touch objects(2 fingers), this should be 
        // run from the multi-touch enabled revices.
        //-------------------------------------------------------------------------
    
        function RotateTestCase(){
            RotateTestCase.superclass.constructor.call(this, "rotate");
        }
    
        Y.extend(RotateTestCase, GenericGestureTestCase, {
            
            "test rotate 90 degree": function() {
                var that = this,
                    durationThreshold = 250,
                    duration = Y.GestureSimulation.defaults.DURATION_PINCH;
                
                // default is to move r1 to r2 for 1sec in y axis.
                Y.Event.simulateGesture(touchable, this.gestureName, {
                    rotation: 90
                }, function(err) {
                    that.resume(function() {
                        if(err) {
                            Assert.fail("Error from the simulation framework: "+that.gestureName);
                        } else {
                            // validate rotate gesture
                            var last = that.result.length-1;
                            Assert.isTrue((that.result[last].timestamp - that.result[0].timestamp)
                                >= (duration - durationThreshold));

                            if(Y.UA.ios >= 2.0) {
                                // touchstart/gesturestart, touchmove/gesturechange(xN), gestureend/touchend
                                Assert.isTrue(that.result.length >= 6);
                                Assert.areSame(that.result[0].type, "touchstart");
                                Assert.areSame(that.result[1].type, "gesturestart");
                                Assert.areSame(that.result[2].type, "touchmove");
                                Assert.areSame(that.result[3].type, "gesturechange");
                                Assert.areSame(that.result[last-3].type, "touchmove");
                                Assert.areSame(that.result[last-2].type, "gesturechange");
                                Assert.areSame(that.result[last-1].type, "gestureend");
                                Assert.areSame(that.result[last].type, "touchend");
                            } else {
                                // touchstart, touchmove(xN), touchend
                                Assert.isTrue(that.result.length >= 3);
                                Assert.areSame(that.result[0].type, "touchstart");
                                Assert.areSame(that.result[1].type, "touchmove");
                                Assert.areSame(that.result[last-1].type, "touchmove");
                                Assert.areSame(that.result[last].type, "touchend");
                                
                                // touchable (600x250), r = 62.5(=250/4)
                                // when starts.
                                var threshold = 50, cur, prev,
                                    lastIndex = that.result.length-1,
                                    cx1 = that.result[0].touches[0].clientX, // should be around 300 (600/2)
                                    cy1 = that.result[0].touches[0].clientY, // should be around 62.5 (250/2 - r)
                                    cx2 = that.result[0].touches[1].clientX, // should be around 300 (600/2)
                                    cy2 = that.result[0].touches[1].clientY, // should be around 187.5 (250/2 + r)
                                    
                                    // ideal values
                                    ix1 = touchable.getXY()[0] + 300,
                                    ix2 = ix1,
                                    iy1 = touchable.getXY()[1] + 62.5,
                                    iy2 = touchable.getXY()[1] + 187.5;

                                Assert.areSame(cx1, cx2, "Both fingers should be on the Y axis.");
                                Assert.isIn(cx1, ix1, threshold, "cx1 is out of whack");
                                Assert.isIn(cx2, ix2, threshold, "cx2 is out of whack");
                                Assert.isIn(cy1, iy1, threshold, "cy1 is out of whack");
                                Assert.isIn(cy2, iy2, threshold, "cy2 is out of whack");
                                
                                // when moves
                                for(var i=0; i<lastIndex; i++) {
                                    if(i > 1) {
                                        // 1st finger
                                        cur = that.result[i].touches[0].clientX;
                                        prev = that.result[i-1].touches[0].clientX;
                                        Assert.isTrue(cur >= prev);
                                        
                                        cur = that.result[i].touches[0].clientY;
                                        prev = that.result[i-1].touches[0].clientY;
                                        Assert.isTrue(cur >= prev);
                                        
                                        // 2nd finger
                                        cur = that.result[i].touches[1].clientX;
                                        prev = that.result[i-1].touches[1].clientX;
                                        Assert.isTrue(cur <= prev);
                                        
                                        cur = that.result[i].touches[1].clientY;
                                        prev = that.result[i-1].touches[1].clientY;
                                        Assert.isTrue(cur <= prev);
                                    }
                                }
                                
                                // when ends (note that the last element doesn't 
                                // have 'touches' so use the 2nd last element
                                cx1 = that.result[lastIndex-1].touches[0].clientX; // should be around 362.5 (600/2 + r)
                                cy1 = that.result[lastIndex-1].touches[0].clientY; // should be around 125 (250/2)
                                cx2 = that.result[lastIndex-1].touches[1].clientX; // should be around 237.5 (600/2 - r)
                                cy2 = that.result[lastIndex-1].touches[1].clientY; // should be around 125 (250/2)
                                
                                // ideal values
                                ix1 = touchable.getXY()[0] + 362.5;
                                ix2 = touchable.getXY()[0] + 237.5;
                                iy1 = touchable.getXY()[1] + 125;
                                iy2 = iy1;

                                Assert.isIn(cx1, ix1, threshold, "cx1 is out of whack");
                                Assert.isIn(cx2, ix2, threshold, "cx2 is out of whack");
                                Assert.isIn(cy1, iy1, threshold, "cy1 is out of whack");
                                Assert.isIn(cy2, iy2, threshold, "cy2 is out of whack");
                            }    
                        }
                    });
                });
                
                this.wait();
            },
            
            "test rotate -90 degree": function() {
                var that = this,
                    durationThreshold = 250,
                    duration = Y.GestureSimulation.defaults.DURATION_PINCH;
                
                // default is to move r1 to r2 for 1sec in y axis.
                Y.Event.simulateGesture(touchable, this.gestureName, {
                    rotation: -90
                }, function(err) {
                    that.resume(function() {
                        if(err) {
                            Assert.fail("Error from the simulation framework: "+that.gestureName);
                        } else {
                            // validate rotate gesture
                            var last = that.result.length-1;
                            Assert.isTrue((that.result[last].timestamp - that.result[0].timestamp)
                                >= (duration - durationThreshold));

                            if(Y.UA.ios >= 2.0) {
                                // touchstart/gesturestart, touchmove/gesturechange(xN), gestureend/touchend
                                Assert.isTrue(that.result.length >= 6);
                                Assert.areSame(that.result[0].type, "touchstart");
                                Assert.areSame(that.result[1].type, "gesturestart");
                                Assert.areSame(that.result[2].type, "touchmove");
                                Assert.areSame(that.result[3].type, "gesturechange");
                                Assert.areSame(that.result[last-3].type, "touchmove");
                                Assert.areSame(that.result[last-2].type, "gesturechange");
                                Assert.areSame(that.result[last-1].type, "gestureend");
                                Assert.areSame(that.result[last].type, "touchend");
                            } else {
                                // touchstart, touchmove(xN), touchend
                                Assert.isTrue(that.result.length >= 3);
                                Assert.areSame(that.result[0].type, "touchstart");
                                Assert.areSame(that.result[1].type, "touchmove");
                                Assert.areSame(that.result[last-1].type, "touchmove");
                                Assert.areSame(that.result[last].type, "touchend");
                                
                                // touchable (600x250), r = 62.5(=250/4)
                                // when starts.
                                var threshold = 50, cur, prev,
                                    lastIndex = that.result.length-1,
                                    cx1 = that.result[0].touches[0].clientX, // should be around 300 (600/2)
                                    cy1 = that.result[0].touches[0].clientY, // should be around 62.5 (250/2 - r)
                                    cx2 = that.result[0].touches[1].clientX, // should be around 300 (600/2)
                                    cy2 = that.result[0].touches[1].clientY, // should be around 187.5 (250/2 + r)
                                    
                                    // ideal values
                                    ix1 = touchable.getXY()[0] + 300,
                                    ix2 = ix1,
                                    iy1 = touchable.getXY()[1] + 62.5,
                                    iy2 = touchable.getXY()[1] + 187.5;

                                Assert.areSame(cx1, cx2, "Both fingers should be on the Y axis.");
                                Assert.isIn(cx1, ix1, threshold, "cx1 is out of whack");
                                Assert.isIn(cx2, ix2, threshold, "cx2 is out of whack");
                                Assert.isIn(cy1, iy1, threshold, "cy1 is out of whack");
                                Assert.isIn(cy2, iy2, threshold, "cy2 is out of whack");
                                
                                // when moves
                                for(var i=0; i<lastIndex; i++) {
                                    if(i > 1) {
                                        // 1st finger
                                        cur = that.result[i].touches[0].clientX;
                                        prev = that.result[i-1].touches[0].clientX;
                                        Assert.isTrue(cur <= prev);
                                        
                                        cur = that.result[i].touches[0].clientY;
                                        prev = that.result[i-1].touches[0].clientY;
                                        Assert.isTrue(cur >= prev);
                                        
                                        // 2nd finger
                                        cur = that.result[i].touches[1].clientX;
                                        prev = that.result[i-1].touches[1].clientX;
                                        Assert.isTrue(cur >= prev);
                                        
                                        cur = that.result[i].touches[1].clientY;
                                        prev = that.result[i-1].touches[1].clientY;
                                        Assert.isTrue(cur <= prev);
                                    }
                                }
                                
                                // when ends (note that the last element doesn't 
                                // have 'touches' so use the 2nd last element
                                cx1 = that.result[lastIndex-1].touches[0].clientX; // should be around 237.5 (600/2 - r)
                                cy1 = that.result[lastIndex-1].touches[0].clientY; // should be around 125 (250/2)
                                cx2 = that.result[lastIndex-1].touches[1].clientX; // should be around 362.5 (600/2 + r)
                                cy2 = that.result[lastIndex-1].touches[1].clientY; // should be around 125 (250/2)
                                
                                // ideal values
                                ix1 = touchable.getXY()[0] + 237.5;
                                ix2 = touchable.getXY()[0] + 362.5;
                                iy1 = touchable.getXY()[1] + 125;
                                iy2 = iy1;

                                Assert.isIn(cx1, ix1, threshold, "cx1 is out of whack");
                                Assert.isIn(cx2, ix2, threshold, "cx2 is out of whack");
                                Assert.isIn(cy1, iy1, threshold, "cy1 is out of whack");
                                Assert.isIn(cy2, iy2, threshold, "cy2 is out of whack");
                            }    
                        }
                    });
                });
                
                this.wait();
            } 
        });
        
        //-------------------------------------------------------------------------
        // Pinch Test Case
        // This will cover pinch/spread gestures.
        // Since they validate multi touch objects(2 fingers), this should be 
        // run from the multi-touch enabled revices.
        //-------------------------------------------------------------------------
    
        function PinchTestCase(){
            PinchTestCase.superclass.constructor.call(this, "pinch");
        }
    
        Y.extend(PinchTestCase, GenericGestureTestCase, {
            
            "test pinch with only required options": function() {
                var that = this,
                    durationThreshold = 250,
                    duration = Y.GestureSimulation.defaults.DURATION_PINCH;
                
                // default is to move r1 to r2 for 1sec in y axis.
                Y.Event.simulateGesture(touchable, this.gestureName, {
                    r1: 10,
                    r2: 20
                }, function(err) {
                    that.resume(function() {
                        if(err) {
                            Assert.fail("Error from the simulation framework: "+that.gestureName);
                        } else {
                            // validate pinch gesture
                            var last = that.result.length-1;
                            Assert.isTrue((that.result[last].timestamp - that.result[0].timestamp) >= (duration - durationThreshold), "Duration didn't match:" + duration + "," + durationThreshold + "," + that.result[last].timestamp - that.result[0].timestamp);
                            
                            if(Y.UA.ios >= 2.0) {
                                // touchstart/gesturestart, touchmove/gesturechange(xN), gestureend/touchend
                                Assert.isTrue(that.result.length >= 6);
                                Assert.areSame(that.result[0].type, "touchstart");
                                Assert.areSame(that.result[1].type, "gesturestart");
                                Assert.areSame(that.result[2].type, "touchmove");
                                Assert.areSame(that.result[3].type, "gesturechange");
                                Assert.areSame(that.result[last-3].type, "touchmove");
                                Assert.areSame(that.result[last-2].type, "gesturechange");
                                Assert.areSame(that.result[last-1].type, "gestureend");
                                Assert.areSame(that.result[last].type, "touchend");
                            } else {
                                // touchstart, touchmove(xN), touchend
                                Assert.isTrue(that.result.length >= 3, "result.length = " + that.result.length);
                                Assert.areSame(that.result[0].type, "touchstart");
                                Assert.areSame(that.result[1].type, "touchmove");
                                Assert.areSame(that.result[last-1].type, "touchmove");
                                Assert.areSame(that.result[last].type, "touchend");
                                
                                // touchable (600x250)
                                // when starts.
                                var threshold = 50, cur, prev,
                                    lastIndex = that.result.length-1,
                                    // returned values
                                    cx1 = that.result[0].touches[0].clientX, // should be around 300 (600/2)
                                    cy1 = that.result[0].touches[0].clientY, // should be around 115 (250/2 - r1)
                                    cx2 = that.result[0].touches[1].clientX, // should be around 300 (600/2)
                                    cy2 = that.result[0].touches[1].clientY, // should be around 135 (250/2 + r1)
                                
                                    // ideal values
                                    ix1 = touchable.getXY()[0] + 300,
                                    ix2 = ix1,
                                    iy1 = touchable.getXY()[1] + 115,
                                    iy2 = touchable.getXY()[1] + 135;

                                Assert.areSame(cx1, cx2, "Both fingers should be on the Y axis.");
                                Assert.isIn(cx1, ix1, threshold, "cx1 is out of whack");
                                Assert.isIn(cx2, ix2, threshold, "cx2 is out of whack");
                                Assert.isIn(cy1, iy1, threshold, "cy1 is out of whack");
                                Assert.isIn(cy2, iy2, threshold, "cy2 is out of whack");
                                
                                // when moves
                                for(var i=0; i<lastIndex; i++) {
                                    // 1st finger
                                    Assert.areSame(cx1, that.result[i].touches[0].clientX);
                                    // 2nd finger    
                                    Assert.areSame(cx2, that.result[i].touches[1].clientX);
                                    
                                    // during the move
                                    if(i > 1) {
                                        // 1st finger
                                        cur = that.result[i].touches[0].clientY;
                                        prev = that.result[i-1].touches[0].clientY;
                                        Assert.isTrue(cur <= prev);
                                        
                                        // 2nd finger
                                        cur = that.result[i].touches[1].clientY;
                                        prev = that.result[i-1].touches[1].clientY;
                                        Assert.isTrue(cur >= prev);
                                    }
                                }
                                
                                // when ends (note that the last element doesn't 
                                // have 'touches' so use the 2nd last element
                                cy1 = that.result[lastIndex-1].touches[0].clientY; // should be around 105 (250/2 - r2)
                                cy2 = that.result[lastIndex-1].touches[1].clientY; // should be around 145 (250/2 + r2)
                                
                                // ideal values
                                iy1 = touchable.getXY()[1] + 105;
                                iy2 = touchable.getXY()[1] + 145;
                                
                                Assert.isIn(cy1, iy1, threshold, "cy2 is out of whack");
                                Assert.isIn(cy2, iy2, threshold, "cy2 is out of whack");
                            }
                        }
                    });
                });
                
                this.wait();
            },
            
            "test pinch on X axis for 1.5 sec": function() {
                var that = this,
                    durationThreshold = 250,
                    duration = Y.GestureSimulation.defaults.DURATION_PINCH;
                
                // default is to move r1 to r2 for 1sec in y axis.
                Y.Event.simulateGesture(touchable, this.gestureName, {
                    r1: 10,
                    r2: 20,
                    duration: 1500,
                    start: 90,
                    rotation: 0
                }, function(err) {
                    that.resume(function() {
                        if(err) {
                            Assert.fail("Error from the simulation framework: "+that.gestureName);
                        } else {
                            // validate pinch gesture
                            var last = that.result.length-1;
                            Assert.isTrue((that.result[last].timestamp - that.result[0].timestamp) 
                                >= (duration - durationThreshold));
                            
                            if(Y.UA.ios >= 2.0) {
                                // touchstart/gesturestart, touchmove/gesturechange(xN), gestureend/touchend
                                Assert.isTrue(that.result.length >= 6);
                                Assert.areSame(that.result[0].type, "touchstart");
                                Assert.areSame(that.result[1].type, "gesturestart");
                                Assert.areSame(that.result[2].type, "touchmove");
                                Assert.areSame(that.result[3].type, "gesturechange");
                                Assert.areSame(that.result[last-3].type, "touchmove");
                                Assert.areSame(that.result[last-2].type, "gesturechange");
                                Assert.areSame(that.result[last-1].type, "gestureend");
                                Assert.areSame(that.result[last].type, "touchend");
                            } else {
                                // touchstart, touchmove(xN), touchend
                                Assert.isTrue(that.result.length >= 3);
                                Assert.areSame(that.result[0].type, "touchstart");
                                Assert.areSame(that.result[1].type, "touchmove");
                                Assert.areSame(that.result[last-1].type, "touchmove");
                                Assert.areSame(that.result[last].type, "touchend");
                                
                                // touchable (600x250)
                                // when starts.
                                var threshold = 50, cur, prev,
                                    lastIndex = that.result.length-1,
                                    cx1 = that.result[0].touches[0].clientX, // should be around 310 (600/2 + r1)
                                    cy1 = that.result[0].touches[0].clientY, // should be around 125 (250/2)
                                    cx2 = that.result[0].touches[1].clientX, // should be around 290 (600/2 - r1)
                                    cy2 = that.result[0].touches[1].clientY, // should be around 125 (250/2)
                                    
                                    // ideal values
                                    ix1 = touchable.getXY()[0] + 310,
                                    iy1 = touchable.getXY()[1] + 125,
                                    ix2 = touchable.getXY()[0] + 290;
                                
                                Assert.areSame(cy1, cy2, "Both fingers should be on the X axis.");
                                Assert.isIn(cy1, iy1, threshold, "cy1 is out of whack");
                                Assert.isIn(cx1, ix1, threshold, "cx1 is out of whack");
                                Assert.isIn(cx2, ix2, threshold, "cx2 is out of whack");
                                
                                for(var i=0; i<lastIndex; i++) {
                                    // 1st finger
                                    Assert.areSame(cy1, that.result[i].touches[0].clientY);
                                    
                                    // 2nd finger    
                                    Assert.areSame(cy2, that.result[i].touches[1].clientY);
                                    
                                    // during the move
                                    if(i > 1) {
                                        // 1st finger
                                        cur = that.result[i].touches[0].clientX;
                                        prev = that.result[i-1].touches[0].clientX;
                                        Assert.isTrue(cur >= prev);
                                        
                                        // 2nd finger
                                        cur = that.result[i].touches[1].clientX;
                                        prev = that.result[i-1].touches[1].clientX;
                                        Assert.isTrue(cur <= prev);
                                    }
                                }
                                
                                // when ends (note that the last element doesn't 
                                // have 'touches' so use the 2nd last element
                                cx1 = that.result[lastIndex-1].touches[0].clientX; // should be around 320 (600/2 + r2)
                                cx2 = that.result[lastIndex-1].touches[1].clientX; // should be around 280 (600/2 - r2)
                                
                                ix1 = touchable.getXY()[0] + 320;
                                ix2 = touchable.getXY()[0] + 280;
                                
                                Assert.isIn(cx1, ix1, threshold, "cx1 is out of whack");
                                Assert.isIn(cx2, ix2, threshold, "cx2 is out of whack");
                            }
                        }
                    });
                });
                
                this.wait();
            }
        });
        
        //-------------------------------------------------------------------------
        // UserAction Tests
        //-------------------------------------------------------------------------
    
        //the user action suite
        var gestureSuite = new Y.Test.Suite("Gesture Simulate");
    
        // common
        gestureSuite.add(new TapTestCase());
        gestureSuite.add(new DoubleTapTestCase());
        gestureSuite.add(new PressTestCase());
        gestureSuite.add(new MoveTestCase());
        gestureSuite.add(new FlickTestCase());

        // only for devices
        if(SUPPORTS_TOUCH) {
            gestureSuite.add(new PinchTestCase());
            gestureSuite.add(new RotateTestCase());
        }
        
        //return it
        return gestureSuite;

    })();

    Y.Test.Runner.add(Y.Tests.GestureSimulate);

}, "@VERSION@", {requires:['test', 'node', 'event-touch', 'gesture-simulate']});
