YUI.add('editor-tests', function(Y) {
    var editor = null,
    iframe = null,
    fireKey = function(editor, key) {
        var inst = editor.getInstance();

        var editorNode = inst.one('[contenteditable="true"]');

        editorNode.simulate('keydown', {
            keyCode: key
        });

        editorNode.simulate('keypress', {
            keyCode: key
        });

        editorNode.simulate('keyup', {
            keyCode: key
        });
    },
    template = {
        name: 'Editor Tests',
        setUp : function() {
        },

        tearDown : function() {
        },
        test_load: function() {
            Y.Assert.isObject(Y.Plugin.ContentEditable, 'ContentEditable was not loaded');
            Y.Assert.isObject(Y.EditorBase, 'EditorBase was not loaded');
        },
        test_frame: function() {
            var iframeReady = false;

            iframe = new Y.Plugin.ContentEditable({
                container: '#editor',
                content: 'This is a test.',
                use: ['node','selector-css3', 'dd-drag', 'dd-ddm']
            });
            Y.Assert.isInstanceOf(Y.Plugin.ContentEditable, iframe, 'ContentEditable instance can not be created');

            iframe.after('ready', function() {
                iframeReady = true;
            });
            iframe.render();

            this.wait(function() {
                Y.Assert.isTrue(iframeReady, 'IFRAME ready event did not fire');
                var inst = iframe.getInstance();

                Y.Assert.isInstanceOf(YUI, inst, 'Internal instance not created');
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
            var e = Y.one('#editor');
            Y.Assert.areSame(n, e, 'iframe node getter failed');

            iframe.delegate('click', function() {});
        },
        'test: _DOMPaste': function() {
            var OT = 'ORIGINAL_TARGET',
            fired = false;

            var inst = iframe.getInstance(),
            win = inst.config.win;

            inst.config.win = {
                clipboardData: {
                    getData: function() {
                        return 'foobar';
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
                            return 'foobar';
                        }
                    }
                }
            });

            Y.Assert.isTrue(fired);

            inst.config.win = win;

        },
        test_frame_destroy: function() {
            iframe.destroy();

            Y.Assert.isFalse(Y.one('#editor').hasAttribute('contenteditable'), 'iframe DOM node was not destroyed');
        },
        test_editor: function() {
            Y.EditorBase.USE.push('dd');
            Y.EditorBase.USE.push('node-event-simulate');
            var iframeReady = false;

            editor = new Y.EditorBase({
                content: 'Hello <b>World</b>!!',
                extracss: 'b { color: red; }',
                plugins: [
                    {
                        fn: Y.Plugin.ContentEditable,
                        cfg: {
                            use: Y.EditorBase.USE
                        }
                    }
                ]
            });
            Y.Assert.isInstanceOf(Y.EditorBase, editor, 'EditorBase instance can not be created');

            editor.after('ready', function() {
                iframeReady = true;
            });
            editor.on('nodeChange', function(e) {
                var events = {
                    'execcommand': true,
                    'paste': true,
                    'mouseup': true,
                    'mousedown': true,
                    'keydown': true,
                    'keyup': true,
                    'keypress': true,
                    'enter': true,
                    'enter-up': true,
                    'enter-down': true,
                    'enter-press': true
                };
                Y.Assert.isTrue(events[e.changedType], 'NodeChange working for ' + e.changedType);
                if (e.changedType !== 'execcommand') {
                    Y.Assert.isTrue(e.changedNode.test('b, [contenteditable="true"]'), 'Changed Node');
                }

            });
            editor.render('#editor');
            editor.hide();
            editor.show();


            this.wait(function() {
                Y.Assert.isTrue(iframeReady, 'IFRAME ready event did not fire');
                var inst = editor.getInstance();

                Y.Assert.isInstanceOf(YUI, inst, 'Internal instance not created');
                Y.Assert.isObject(inst.DD.Drag, 'DD Not loaded inside the frame');
                Y.Assert.isObject(inst.DD.DDM, 'DD Not loaded inside the frame');
                Y.Assert.areSame(Y.EditorBase.FILTER_RGB(inst.one('b').getStyle('color')), '#ff0000', 'Extra CSS Failed');
                inst.one('[contenteditable="true"]').simulate('mousedown', {
                    pageX: 100,
                    pageY: 100
                });
                inst.one('b').simulate('mousedown');
                inst.one('[contenteditable="true"]').simulate('mouseup');
                inst.one('b').simulate('mouseup');

                fireKey(editor, 13);

            }, 1500);
        },
        test_copy_styles: function() {

            var node = Y.Node.create('<b><u><div style="font-family: Arial; color: purple">Foo</div></u></b>'),
                node2 = Y.Node.create('<div/>');

            editor.copyStyles(node.one('div'), node2);

            Y.Assert.areSame(node.one('div').getStyle('color'), node2.getStyle('color'), 'Style failed to copy');
            Y.Assert.areSame(node.one('div').getStyle('fontFamily'), node2.getStyle('fontFamily'), 'Style failed to copy');

            node = Y.Node.create('<a>');
            node2 = Y.Node.create('<div/>');

            editor.copyStyles(node, node2);

        },
        test_resolve_node: function() {
            var inst = editor.getInstance();
            var node = editor._resolveChangedNode(inst.one('html'));

            Y.Assert.areNotSame(inst.one('html'), node, 'Failed to resolve HTML node');

            node = editor._resolveChangedNode(null);
            Y.Assert.isTrue(inst.one('[contenteditable="true"]').compareTo(node), 'Failed to resolve HTML node');
        },
        test_get_content: function() {
            var html = editor.getContent(),
                ex = ((Y.UA.gecko && Y.UA.gecko < 12) ? '<br>' : '');
                if (Y.UA.ie) {
                    html = html.replace(' style=""', '').replace(' style="RIGHT: auto"', '');
                }
            Y.Assert.areEqual(ex + 'Hello <b>World</b>!!'.toLowerCase(), html.toLowerCase(), 'getContent failed to get the editor content');
        },
        test_font_size_normalize: function() {
            var n = Y.Node.create('<span style="font-size: -webkit-xxx-large"></span>'),
                size;

            if (Y.UA.webkit) { //Can't apply -webkit styles in something other than webkit, duh..
                size = Y.EditorBase.NORMALIZE_FONTSIZE(n);
                Y.Assert.areSame('48px', size, 'Failed to parse size');
            }

            n.setStyle('fontSize', 'xx-large');
            size = Y.EditorBase.NORMALIZE_FONTSIZE(n);
            Y.Assert.areSame('32px', size, 'Failed to parse size');

            n.setStyle('fontSize', 'x-large');
            size = Y.EditorBase.NORMALIZE_FONTSIZE(n);
            Y.Assert.areSame('24px', size, 'Failed to parse size');

            n.setStyle('fontSize', 'large');
            size = Y.EditorBase.NORMALIZE_FONTSIZE(n);
            Y.Assert.areSame('18px', size, 'Failed to parse size');

            n.setStyle('fontSize', 'medium');
            size = Y.EditorBase.NORMALIZE_FONTSIZE(n);
            Y.Assert.areSame('16px', size, 'Failed to parse size');

            n.setStyle('fontSize', 'small');
            size = Y.EditorBase.NORMALIZE_FONTSIZE(n);
            Y.Assert.areSame('13px', size, 'Failed to parse size');

            n.setStyle('fontSize', 'x-small');
            size = Y.EditorBase.NORMALIZE_FONTSIZE(n);
            Y.Assert.areSame('10px', size, 'Failed to parse size');

        },
        test_selection_font_removal: function() {
            var inst = editor.getInstance();
            var node = inst.Node.create('<font face="" style="foo: bar; font-family: ;"></font>');
            inst.EditorSelection.removeFontFamily(node);

            Y.Assert.areSame(node.getAttribute('face'), '', 'Failed to remove font face');
            if (!Y.UA.ie || (Y.UA.ie && Y.UA.ie > 8)) {
                //IE 6 doesn't like the getAttribute('style') call, it returns an object
                Y.Assert.isTrue((node.getAttribute('style').indexOf('foo: bar') > -1), 'Failed to remove font-family ;');
                Y.Assert.isTrue((node.getAttribute('style').indexOf('font-family') === -1), 'Failed to remove font-family ;');
            }

            node.setAttribute('style', 'font-family: ');
            inst.EditorSelection.removeFontFamily(node);
            Y.Assert.areSame(node.getAttribute('style'), '', 'Failed to remove style attribute');
        },
        test_gettext: function() {
            var inst = editor.getInstance();
            var node = inst.Node.create('<p><font><strong>This is <i>a test</i></strong></font>');

            var text = inst.EditorSelection.getText(node);
            Y.Assert.areSame('This is a test', text, 'Failed to filter out HTML');
        },
        test_selection_general: function() {
            var inst = editor.getInstance();

            var count = inst.EditorSelection.hasCursor();
            Y.Assert.areSame(0, count, 'Cursor object found');

            inst.EditorSelection.cleanCursor();

            count = inst.EditorSelection.hasCursor();
            Y.Assert.areSame(0, count, 'Cursor object found');
        },
        test_selection_methods: function() {
            var inst = editor.getInstance(),
                sel = new inst.EditorSelection();

            sel.insertContent('This is a test<br>');
            editor.execCommand('inserthtml', 'This is another test<br>');

            editor.execCommand('selectall');
            editor.execCommand('wrap', 'div');
            var html = editor.getContent().toLowerCase();

            sel.setCursor(true);


            Y.Assert.isTrue(editor.getContent().indexOf('This is a test') > -1, 'Failed to insert content');
            Y.Assert.isTrue(editor.getContent().indexOf('This is another test') > -1, 'Failed to insert content');
            Y.Assert.isTrue(html.indexOf('<div>') > -1, 'Failed to wrap the content');

        },
        'test: EditorSelection': function() {

            var inst = editor.getInstance(),
                sel = new inst.EditorSelection(),
                html = '<b>Foobar</b>',
                node = inst.Node.create(html);

            var n = sel._wrap(node, 'span');
            Y.Assert.areSame('foobar', n.innerHTML.toLowerCase());
            Y.Assert.areSame('span', n.tagName.toLowerCase());

            var a = sel.anchorNode;
            sel.anchorNode = node;

            sel.replace('Foobar', 'davglass');

            //sel.remove();

            sel.anchorNode = a;

            Y.Assert.areSame('EditorSelection Object', sel.toString());

        },
        test_execCommands: function() {
            editor.focus(true);
            var inst = editor.getInstance();
            var cmds = Y.Plugin.ExecCommand.COMMANDS;
            var b = cmds.bidi;
            Y.each(cmds, function(val, cmd) {
                if (cmd !== 'bidi') {
                    editor.execCommand(cmd, '<b>Foo</b>');
                }
            });

            var hc = inst.EditorSelection.hasCursor;
            inst.EditorSelection.hasCursor = function() { return true; };

            Y.each(cmds, function(val, cmd) {
                if (cmd !== 'bidi' && cmd != 'insertandfocus') {
                    if (cmd.indexOf('insertunorderedlist') > 0 && Y.UA.ie && Y.UA.ie < 9) {
                        editor.execCommand(cmd, '<b>Foo</b>');
                    }
                }
            });
            inst.EditorSelection.hasCursor = hc;
            editor.execCommand('insertandfocus', '<b>Foo</b>');

            editor.frame._execCommand('bold', '');


            var SEL = inst.EditorSelection;
            inst.EditorSelection = function() {
                var sel = new SEL();
                sel.isCollapsed = false;
                return sel;
            };

            for (var i in SEL) {
                inst.EditorSelection[i] = SEL[i];
            }

            editor.execCommand('insertorderedlist', '');

            inst.EditorSelection = SEL;

        },
        'test: selection.remove()': function() {
            var inst = editor.getInstance(),
                sel = new inst.EditorSelection();

            sel.remove();
        },
        test_destroy: function() {
            editor.destroy();
            Y.Assert.areEqual(Y.one('#editor iframe'), null, 'Frame was not destroyed');
        },
        test_br_plugin: function() {
            editor = new Y.EditorBase({
                content: 'Hello <b>World</b>!!',
                extracss: 'b { color: red; }',
                plugins: [
                    {
                        fn: Y.Plugin.ContentEditable,
                        cfg: {
                            use: Y.EditorBase.USE
                        }
                    }
                ]
            });
            Y.Assert.isInstanceOf(Y.EditorBase, editor, 'Second EditorBase instance can not be created');
            editor.plug(Y.Plugin.EditorBR);
            editor.render('#editor');
            Y.Assert.isInstanceOf(Y.Plugin.EditorBR, editor.editorBR, 'EditorBR was not plugged..');
            editor.set('content', '<br>');

            fireKey(editor, 13);
            fireKey(editor, 8);

            editor.destroy();
            Y.Assert.areEqual(Y.one('#editor iframe'), null, 'Second Frame was not destroyed');
            Y.Assert.isFalse(Y.one('#editor').hasAttribute('contenteditable'), 'iframe DOM node was not destroyed');
        },
        test_para_plugin: function() {
            editor = new Y.EditorBase({
                content: 'Hello <b>World</b>!!',
                extracss: 'b { color: red; }',
                plugins: [
                    {
                        fn: Y.Plugin.ContentEditable,
                        cfg: {
                            use: Y.EditorBase.USE
                        }
                    }
                ]
            });
            Y.Assert.isInstanceOf(Y.EditorBase, editor, 'Third EditorBase instance can not be created');
            editor.plug(Y.Plugin.EditorPara);
            Y.Assert.isInstanceOf(Y.Plugin.EditorPara, editor.editorPara, 'EditorPara was not plugged..');
            editor.render('#editor');
            editor.set('content', '<br><b>Test This</b>');

            var inst = editor.getInstance();

            var str = '<b>foo</b>';
            var out = editor.frame.exec._wrapContent(str);
            Y.Assert.areEqual('<p><b>foo</b></p>', out);

            out = editor.frame.exec._wrapContent(str, true);
            Y.Assert.areEqual('<b>foo</b><br>', out);

            fireKey(editor, 13);
            fireKey(editor, 8);
            editor.editorPara._fixFirstPara();
            editor.editorPara._afterPaste();
            editor.editorPara._onNodeChange({
                changedEvent: {},
                changedNode: inst.one('b'),
                changedType: 'enter-up'
            });
            editor.editorPara._onNodeChange({
                changedEvent: {},
                changedNode: inst.one('br'),
                changedType: 'enter'
            });
            editor.destroy();
            Y.Assert.areEqual(Y.one('#editor iframe'), null, 'Third Frame was not destroyed');

        },
        test_double_plug_setup: function() {
            editor = new Y.EditorBase({
                content: 'Hello <b>World</b>!!',
                extracss: 'b { color: red; }',
                plugins: [Y.Plugin.ContentEditable]
            });
            Y.Assert.isInstanceOf(Y.EditorBase, editor, 'Forth EditorBase instance can not be created');
        },
        test_double_plug: function() {
            editor.plug(Y.Plugin.EditorPara);
            //This should error
            editor.plug(Y.Plugin.EditorBR);
        },
        test_double_down: function() {
            Y.Assert.isInstanceOf(Y.Plugin.EditorPara, editor.editorPara, 'EditorPara was not plugged..');
            editor.render('#editor');
            editor.destroy();
            Y.Assert.areEqual(Y.one('#editor frame'), null, 'Forth Frame was not destroyed');
            Y.Assert.isFalse(Y.one('#editor').hasAttribute('contenteditable'), 'The editor was not destroyed');
        },
        test_double_plug_setup2: function() {
            editor = new Y.EditorBase({
                content: 'Hello <b>World</b>!!',
                extracss: 'b { color: red; }',
                plugins: [Y.Plugin.ContentEditable]
            });
            Y.Assert.isInstanceOf(Y.EditorBase, editor, 'Fifth EditorBase instance can not be created');
        },
        test_double_plug2: function() {
            editor.plug(Y.Plugin.EditorBR);
            //This should error
            editor.plug(Y.Plugin.EditorPara);
        },
        test_double_down2: function() {
            Y.Assert.isInstanceOf(Y.Plugin.EditorBR, editor.editorBR, 'EditorBR was not plugged..');
            editor.render('#editor');
            editor.destroy();
            Y.Assert.areEqual(Y.one('#editor frame'), null, 'Fifth Frame was not destroyed');
            Y.Assert.isFalse(Y.one('#editor').hasAttribute('contenteditable'), 'The editor was not destroyed');
        },
        test_bidi_noplug: function() {
            editor = new Y.EditorBase({
                content: 'Hello <b>World</b>!!',
                extracss: 'b { color: red; }',
                plugins: [Y.Plugin.ContentEditable]
            });
            editor.render('#editor');
            this.wait(function() {
                //This should error
                editor.execCommand('bidi');
            }, 1500);
        },
        test_bidi_plug: function() {
            editor.destroy();
            editor = new Y.EditorBase({
                content: 'Hello <b>World</b>!!',
                extracss: 'b { color: red; }',
                plugins: [Y.Plugin.ContentEditable]
            });
            editor.plug(Y.Plugin.EditorPara);
            editor.plug(Y.Plugin.EditorBidi);
            editor.render('#editor');
            Y.Assert.isInstanceOf(Y.Plugin.EditorBidi, editor.editorBidi, 'EditorBidi plugin failed to load');
            editor.focus(true);

            var inst = editor.getInstance();
            var sel = new inst.EditorSelection();
            var b = inst.one('b');
            Y.Assert.areEqual(b.get('parentNode').get('dir'), '', 'Default direction');
            sel.selectNode(b, true, true);
            editor.execCommand('bidi');
            Y.Assert.areEqual(b.get('parentNode').get('dir'), 'rtl', 'RTL not added to node');

            sel.selectNode(b, true, true);
            editor.execCommand('bidi');
            Y.Assert.areEqual(b.get('parentNode').get('dir'), 'ltr', 'LTR not added to node');

            sel.selectNode(b, true, true);
            editor.execCommand('bidi');
            Y.Assert.areEqual(b.get('parentNode').get('dir'), 'rtl', 'RTL not added BACK to node');

            editor.editorBidi._afterMouseUp();
            editor.editorBidi._afterNodeChange({
                changedType: 'end-up'
            });

            var out = Y.Plugin.EditorBidi.blockParent(inst.one('[contenteditable="true"]').get('firstChild.firstChild'));
            Y.Assert.isTrue(out.test('p'));

            var root = inst.one('[contenteditable="true"]');

            out = Y.Plugin.EditorBidi.addParents([root.get('firstChild')], root);
            Y.Assert.areEqual(1, out.length);
            Y.Assert.isTrue(out[0].test('p'));

        },
        _should: {
            fail: {
                test_selection_methods: (Y.UA.ie ? true : false)
            },
            ignore: {
                'test: EditorSelection': Y.UA.phantomjs,
                test_selection_methods: Y.UA.phantomjs,
                test_br_plugin: Y.UA.phantomjs
            },
            error: { //These tests should error
                test_selection_methods: (Y.UA.ie ? true : false),
                test_double_plug: true,
                test_double_plug2: true,
                test_bidi_noplug: true
            }
        }
    };

    var suite = new Y.Test.Suite("Editor");

    suite.add(new Y.Test.Case(template));
    Y.Test.Runner.add(suite);

});
