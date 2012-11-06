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
                h = node.get('offsetHeight'),
                ontween = function() {
                    this.detach('tween');
                    test.resume(function() {
                        Y.Assert.isTrue(node.get('offsetHeight') <= h);
                    });
                };

            new Y.Anim({
                node: node,
                from: { height: 0 },
                to: {
                    height: function() {
                        return h;
                    }
                },

                duration: 0.5,

                on: {
                    tween: ontween
                }
            }).run();

            test.wait(1000);

        },

        'should fire the tween event': function() {

            var node = Y.one('.demo'),
                test = this;

            new Y.Anim({
                node: node,
                to: {
                    height: 0
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
                    height: 0
                },

                duration: 0.5,
                on: {
                    end: function() {
                        test.resume(function() {
                            Y.Assert.areEqual('0px', parseInt(node.getComputedStyle('height').replace('px', ''), 10) + 'px');
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
                    height: 0
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
                    height: 0
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
                    height: 0
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
                    height: 0
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

                duration: 0.5,

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
                duration: 0.1
            });
            anim.run();
            Y.Assert.isTrue(anim.get('running'));
        },

        'should set "running" to false when stop is called': function() {
            var node = Y.one('.demo'),
                test = this;

            var anim = new Y.Anim({
                node: node,
                duration: 0.1
            });
            anim.run();
            anim.stop(); 
            Y.Assert.isFalse(anim.get('running'));
        },

        'should animate DOM properties': function() {
            var node = Y.one('.demo'),
                test = this,
                onend = function() {
                    test.resume(function() {
                        Y.Assert.areEqual('100', node.get('scrollLeft'));
                        Y.Assert.areEqual('50', node.get('scrollTop'));
                    });
                };

            new Y.Anim({
                node: node,
                to: {
                    scrollLeft: '100',
                    scrollTop: 50
                },

                duration: 0.5,

                on: {
                    end: onend
                }
            }).run(); 

            test.wait(1000);

        }

    }));
}, '@VERSION@' ,{requires:['anim-base', 'test']});
