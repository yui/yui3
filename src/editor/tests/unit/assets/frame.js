YUI.add('frame-tests', function(Y) {


    var iframe = null,
    template = {
        name: 'Frame Tests',
        test_load: function() {
            Y.Assert.isObject(Y.Frame, 'EditorBase was not loaded');
        },
        test_frame: function() {
            var iframeReady = false;

            iframe = new Y.Frame({
                container: '#editor',
                designMode: true,
                content: 'This is a test.',
                use: ['node','selector-css3', 'dd-drag', 'dd-ddm']
            });
            Y.Assert.isInstanceOf(Y.Frame, iframe, 'Iframe instance can not be created');
            
            iframe.after('ready', function() {
                iframeReady = true;
            });
            iframe.render();

            this.wait(function() {
                Y.Assert.isTrue(iframeReady, 'IFRAME ready event did not fire');
                var inst = iframe.getInstance();

                Y.Assert.isTrue(YUI.instanceOf(inst), 'Internal instance not created');
                Y.Assert.isObject(inst.DD.Drag, 'DD Not loaded inside the frame');
                Y.Assert.isObject(inst.DD.DDM, 'DD Not loaded inside the frame');
                

            }, 1500);
            
        },
        test_frame_use: function() {
            var inst = iframe.getInstance(),
                test = this;

            iframe.use('slider', function() {
                test.resume(function() {
                    Y.Assert.isObject(inst.Slider, 'Failed to load Slider inside frame object');
                });
            });

            test.wait();

        },
        test_frame_general: function() {
            var n = iframe.get('node');
            var e = Y.one('#editor iframe');
            Y.Assert.areSame(n, e, 'iframe node getter failed');
            
            iframe._fixIECursors();

            iframe.delegate('click', function() {});

            var id = iframe.get('id');
            Y.Assert.isTrue((id.indexOf('iframe-yui') === 0));

        },
        'test: _DOMPaste': function() {
            var OT = 'ORIGINAL_TARGET',
            fired = false;
            
            var inst = iframe.getInstance(),
            win = inst.config.win;

            inst.config.win = {
                clipboardData: {
                    getData: function() {
                        return 'foobar'
                    }
                }
            };
            iframe.on('dom:paste', function(e) {
                fired = true;
                Y.Assert.areSame(e.clipboardData.data, 'foobar');
                Y.Assert.areSame(e.clipboardData.getData(), 'foobar');
            });
            iframe._DOMPaste({
                _event: {
                    originalTarget: OT,
                    target: OT,
                    currentTarget: OT,
                    clipboardData: {
                        getData: function() {
                            return 'foobar'
                        }
                    }
                }
            });

            Y.Assert.isTrue(fired);

            inst.config.win = win;

        },
        test_frame_destroy: function() {
            iframe.destroy();

            Y.Assert.isNull(Y.one('#editor iframe'), 'iframe DOM node was not destroyed');
        }
    };
    
    var suite = new Y.Test.Suite('Frame');
    
    suite.add(new Y.Test.Case(template));
    Y.Test.Runner.add(suite);

});

