YUI.add('anim-core-test', function(Y) {
    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Basic Tests',

        'should find node via selector string': function() {
            var anim = new Y.Anim({
                node: '.demo'
            });

            Y.Assert.isNotNull(anim.get('node'));
            Y.Assert.areEqual(Y.one('.demo'), anim.get('node'));
        },

        'should end at default duration': function() {
            var node = Y.one('.demo'),
                anim = new Y.Anim({
                node: node,
                to: {height: 0}
            }),

                test = this,
                start;

            anim.on('end', function() {
                test.resume(function() {
                    Y.Assert.isTrue(new Date() - start > 900);
                    Y.Assert.isTrue(new Date() - start < 1100);
                    Y.Assert.areEqual('0px', node.getComputedStyle('height'));
                    node.setStyle('height', '');
                });
            });

            start = new Date();
            anim.run();
            test.wait(1500);
        }

    }));

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Event Tests',

        'should set initial value prior to running first frame': function() {
            var node = Y.one('.demo'),
                test = this,
                h = node.getComputedStyle('height'),
                firstFrame = true,
                ontween = function() {
                    if (firstFrame) {
                        Y.Assert.areEqual('0px', node.getComputedStyle('height'));
                        firstFrame = false;
                    }
                };

            new Y.Anim({
                node: node,
                from: { height: 0 },
                to: {
                    height: function() {
                        return h;
                    }
                },

                duration: 500,

                on: {
                    tween: ontween
                }
            }).run(); 

        },

        'should fire the tween event': function() {

            var node = Y.one('.demo'),
                test = this;

            new Y.Anim({
                node: node,
                to: {
                    height: 0,
                },

                duration: 0.5,
                on: {
                    tween: function() {
                        this.detach('tween'); 
                        test.resume(function() {
                            Y.Assert.isTrue(true);
                        });
                    }
                }
            }).run();

            test.wait(1000);
        },

        'should fire the end event': function() {

            var node = Y.one('.demo'),
                test = this;

            new Y.Anim({
                node: node,
                to: {
                    height: 0,
                },

                duration: 0.5,
                on: {
                    end: function() {
                        test.resume(function() {
                            Y.Assert.areEqual('0px', node.getComputedStyle('height'));
                            node.setStyle('height', '');
                        });
                    }
                }
            }).run();

            test.wait(1000);
        },

        'should fire the pause event when pause is called': function() {
            var node = Y.one('.demo'),
                test = this;

            var anim = new Y.Anim({
                node: node,
                to: {
                    height: 0,
                },

                duration: 0.5,
                on: {
                    pause: function() {
                        Y.Assert.isTrue(true);
                        node.setStyle('height', '');
                    }
                }
            });
            anim.run();
            anim.pause(); 
        },
        'should fire the end event when stop is called': function() {
            var node = Y.one('.demo'),
                test = this;

            var anim = new Y.Anim({
                node: node,
                to: {
                    height: 0,
                },

                duration: 0.5,
                on: {
                    end: function() {
                        Y.Assert.areEqual('200px', node.getComputedStyle('height'));
                        node.setStyle('height', '');
                    }
                }
            });
            anim.run();
            anim.stop(); 
        },

        'should run in reverse': function() {
            var node = Y.one('.demo'),
                test = this;

            var anim = new Y.Anim({
                reverse: true, 
                node: node,
                to: {
                    height: 0,
                },

                duration: 0.5,
                on: {
                    end: function() {
                        test.resume(function() {
                            Y.Assert.areEqual('200px', node.getComputedStyle('height'));
                            node.setStyle('height', '');
                        });
                    }
                }
            });
            anim.run();
            test.wait(1000);
        },

        'should fire the end event and set "to" values when stop(true) is called': function() {
            var node = Y.one('.demo'),
                test = this;

            var anim = new Y.Anim({
                node: node,
                to: {
                    height: 0,
                },

                duration: 0.5,
                on: {
                    end: function() {
                        Y.Assert.areEqual('0px', node.getComputedStyle('height'));
                        node.setStyle('height', '');
                    }
                }
            });
            anim.run();

            anim.stop(true); 
        },

        'should fire the resume event when run called while paused': function() {
            var node = Y.one('.demo'),
                test = this;

            var anim = new Y.Anim({
                node: node,
                duration: 0.1,
                on: {
                    resume: function() {
                        Y.Assert.isTrue(true);
                    }
                }
            });
            anim.run();
            anim.pause();
            anim.run(); 
        },

        'should run the onstart prior to setting target values': function() {
            var node = Y.one('.demo'),
                test = this,
                h = node.getComputedStyle('height'),
                onstart = function() {
                    node.setStyle('height', 0);
                    Y.Assert.areEqual('0px', node.getComputedStyle('height'));
                };

            new Y.Anim({
                node: node,
                to: {
                    height: function() {
                        return h;
                    }
                },

                duration: 500,

                on: {
                    start: onstart
                }
            }).run(); 

        },

        'should set "running" to true when run is called': function() {
            var node = Y.one('.demo'),
                test = this;

            var anim = new Y.Anim({
                node: node,
                duration: 0.1,
            });
            anim.run();
            Y.Assert.isTrue(anim.get('running'));
        },

        'should set "running" to false when stop is called': function() {
            var node = Y.one('.demo'),
                test = this;

            var anim = new Y.Anim({
                node: node,
                duration: 0.1,
            });
            anim.run();
            anim.stop(); 
            Y.Assert.isFalse(anim.get('running'));
        },

        'should start from correct offset': function() {
            var node = Y.one('.demo'),
                test = this,
                firstFrame = true,
                ontween = function() {
                    this.detach('tween');
                    test.resume(function() {
                        if (firstFrame) {
                            Y.Assert.areEqual('0', parseInt(node._node.style.top));
                            firstFrame = false;
                        }
                    });
                };

            new Y.Anim({
                node: node,
                to: {
                    top: '100px'
                },

                duration: 500,

                on: {
                    tween: ontween
                }
            }).run(); 

            test.wait(1000);
        }

    }));
/*
    }));
    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Single Transition Tests',
        setUp: function() {
            Y.all('.demo').setStyles({
                height: '200px',
                width: '200px',
                borderWidth: '5px',
                paddingTop: 0,
                opacity: '1'
            });
        },
        
        'should end at final value': function() {
            var node = Y.one('.demo'),
                test = this;

            new Y.Anim(({
                to: {
                    width: 0       
                },

                on: {
                    end: function(e) {
                        test.resume(function() { 
                            Y.Assert.areEqual('0px', node.getComputedStyle('width'));
                        });
                    }
                }
            });
            test.wait(2000);
        },

        'should end at both final values': function() {
            var node = Y.one('.demo'),
                test = this;

            node.transition({
               opacity: {
                  easing: 'ease-out',
                  duration: 1.25,
                  value: 0
                },
                height: {
                  delay:1.25,
                  easing: 'ease-out',
                  value: 0
                }
            }, function(e) {
                test.resume(function() { 
                    Y.Assert.areEqual('0px', node.getComputedStyle('height'));
                    Y.Assert.areEqual('0', node.getComputedStyle('opacity'));
                });
            });

            test.wait(2000);
        },

        'callback should fire when transitioning to current value': function() {
            var node = Y.one('.demo'),
                test = this;

            node.transition({
                duration: 1,
                height: '200px',
                width: 0
            }, function(e) {
                test.resume(function() { 
                    Y.Assert.areEqual(1, parseInt(e.elapsedTime));
                    Y.Assert.areEqual('200px', node.getComputedStyle('height'));
                    Y.Assert.areEqual('0px', node.getComputedStyle('width'));
                });
            });

            test.wait(2000);

        },

        'callback should fire when transitioning to current number value': function() {
            var node = Y.one('.demo'),
                test = this;

            node.setStyle('width', 0);

            node.transition({
                duration: 1,
                width: 0
            }, function(e) {
                test.resume(function() { 
                    Y.Assert.areEqual(1, parseInt(e.elapsedTime));
                    Y.Assert.areEqual('0px', node.getComputedStyle('width'));
                });
            });

            test.wait(2000);

        },

        'should end at all final values': function() {
            var node = Y.one('.demo'),
                test = this;

            node.transition({
                duration: 1,
                width: 0,
                height: 0,
                opacity: 0,
                borderTopWidth: '1px',
                foo: 0, // ignore non-supported
                paddingTop: '100px'
            }, function(e) {
                test.resume(function() { 
                    Y.Assert.areEqual(1, parseInt(e.elapsedTime));
                    Y.Assert.areEqual('0px', node.getComputedStyle('width'));
                    Y.Assert.areEqual('0px', node.getComputedStyle('height'));
                    Y.Assert.areEqual('0', node.getComputedStyle('opacity'));
                    Y.Assert.areEqual('100px', node.getComputedStyle('paddingTop'));
                    Y.Assert.areEqual('1px', node.getStyle('borderTopWidth'));
                });
            });

            test.wait(2000);
        },

        'callback should fire after longest duration': function() {
            var node = Y.one('.demo'),
                test = this;

            node.transition({
                easing: 'ease-in',
                duration: 1,
                opacity: {
                    value: 0,
                    duration: 2
                },
                height: 0,
                width: 0
            }, function(e) {
                test.resume(function() { 
                    Y.Assert.areEqual(2, parseInt(e.elapsedTime));

                node.setStyle('height', '100px');
                node.setStyle('opacity', '1');
                Y.Assert.areEqual(1, node.getStyle('opacity'));
                });
            });

            test.wait(3000);
        },

        'native transform should map to vendor prefix': function() {
            var node = Y.one('.demo'),
                test = this;

            node.transition({
                easing: 'ease',
                duration: 1,
                height: 0,
                transform: 'rotate(180deg)'
            }, function(e) {
                test.resume(function() { 
                    Y.Assert.areEqual(1, parseInt(e.elapsedTime));
                    node.setStyle('height', '100px');
                    if (Y.UA.webkit) {
                        Y.Assert.areEqual('matrix(-1, 0.00000000000000012246467991473532, -0.00000000000000012246467991473532, -1, 0, 0)', node.getComputedStyle('WebkitTransform'));
                    }
                });
            });

            test.wait(2000);
        },

        'setStyle should not transition': function() {
            var node = Y.one('.demo'),
                test = this;

            node.setStyle('height', '100px');
            Y.Assert.areEqual('100px', node.getComputedStyle('height'));
        },

        'destroyed node should complete transition': function() {
            var node = Y.one('.demo'),
                test = this;

            node.transition({
                easing: 'ease',
                duration: 1,
                height: 0
            }, function(e) {
                test.resume(function() { 
                    var node = Y.one('.demo');
                    Y.Assert.areEqual(1, parseInt(e.elapsedTime));
                    Y.Assert.areEqual('0px', node.getComputedStyle('height'));
                });
            });
            node.destroy();
            test.wait(2000);
        },

        'should clean up style object': function() {

        }
    }));

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'toggleView Tests',

        'should force state with boolean first arg': function() {
            var node = Y.one('.demo'),
                test = this;

            node.toggleView(false, function() {
                test.resume(function() {
                    Y.Assert.areEqual(0, node.getStyle('opacity'));
                    node.destroy();
                })
            });
            test.wait(2000);
        }

    }));
*/
}, '@VERSION@' ,{requires:['anim-base', 'test']});
