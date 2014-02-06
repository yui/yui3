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
        name: 'Inline Editor Tests',

        setUp : function() {
            this.editorBaseUse = Y.EditorBase.USE.concat('node-event-simulate',
                                                        'dd');
        },

        tearDown : function() {
        },

        'test_load <inline>': function() {
            Y.Assert.isObject(Y.Plugin.ContentEditable, 'ContentEditable was not loaded');
            Y.Assert.isObject(Y.EditorBase, 'EditorBase was not loaded');
        },

        'test_frame <inline>': function() {
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

        'test_frame_use <inline>': function() {
            var inst = iframe.getInstance(),
                test = this;

            iframe.use('slider', function() {
                test.resume(function() {
                    Y.Assert.isObject(inst.Slider, 'Failed to load Slider inside frame object');
                });
            });

            test.wait();

        },
        'test_frame_general <inline>': function() {
            var n = iframe.get('node');
            var e = Y.one('#editor');
            Y.Assert.areSame(n, e, 'iframe node getter failed');

            iframe.delegate('click', function() {});
        },
        'test delgation <inline>': function () {
            var node = Y.Node.create('<div/>'),
                ce = new Y.Plugin.ContentEditable({
                    container: node,
                    content: 'This is a test.<a href="#" class=".foo">Foo</a>',
                    use: ['node','selector-css3', 'dd-drag', 'dd-ddm']
                });

            var inst = ce.delegate('click', function () {});
            Y.Assert.isFalse(inst, 'Delegate does not return false when no instance is present.');

            ce.render();

            var del = ce.delegate('click', function (e) {}, node, 'a');
            Y.Assert.isTrue(!!(del.evt && del.sub), 'Delgate returned does not have valid parameters');

            var del_no_sel = ce.delegate('click', function (e) {}, 'a');
            Y.Assert.isTrue(!!(del_no_sel.evt && del_no_sel.sub), 'Delgate returned does not have valid parameters');

        },

        'test rendering without a defined container <inline>': function () {
            var ce = new Y.Plugin.ContentEditable({
                    content: 'This is a test.',
                    use: ['node', 'selector-css3', 'dd-drag', 'dd-ddm']
                });

            // test rendering to update container when _rendered is already true
            ce._rendered = true;
            ce.render();
            Y.Assert.isFalse(!!(ce.get('container')), 'Container is not undefined');

            // set _rendered back to false and continue with normal rendering
            ce._rendered = false;
            ce.render();

            Y.Assert.isTrue(!!(ce.get('container')), 'Container was not created');
            Y.Assert.isInstanceOf(Y.Node, ce.get('container'), 'Container created is not a node instance');

            ce.get('container').remove(true);
        },

        'test getting id is accurate <inline>': function () {
            var node = Y.Node.create('<div/>'),
                ceID = new Y.Plugin.ContentEditable({
                    content: 'This is a test.',
                    container: node,
                    use: ['node', 'selector-css3', 'dd-drag', 'dd-ddm'],
                    id: 'myId'
                }),
                ce = new Y.Plugin.ContentEditable({
                    content: 'This is a test.',
                    container: node,
                    use: ['node', 'selector-css3', 'dd-drag', 'dd-ddm']
                });

            ceID.render();
            Y.Assert.areSame('myId', ceID.get('id'), 'Id is not held over');

            ce.render();
            Y.Assert.areSame('inlineedit-yui', ce.get('id').substr(0, ce.get('id').indexOf('_')), 'Id does not match prefix');
        },

        'test use after instantiation <inline>': function () {

            var ce = new Y.Plugin.ContentEditable({
                container: '#editor',
                designMode: true,
                content: 'This is a test.'
            });

            ce.render();

            this.wait(function() {
                ce.use('paginator');

                this.wait(function () {
                    var inst = ce.getInstance();

                    Y.Assert.isInstanceOf(YUI, inst, 'Internal instance not created');
                    Y.Assert.isObject(inst.Paginator, 'Paginator Not loaded inside the frame');
                }, 1500);
            },
            1500);

        },


        'test: _DOMPaste <inline>': function() {
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
        'test: _DOMPaste {empty} <inline>': function() {
            var node = Y.Node.create('<div/>'),
                ce = new Y.Plugin.ContentEditable({
                    container: node,
                    content: 'This is a test.<a href="#" class=".foo">Foo</a>',
                    use: ['node','selector-css3', 'dd-drag', 'dd-ddm']
                });

            ce.render();

            var OT = 'ORIGINAL_TARGET',
                fired = false;

            var inst = ce.getInstance(),
                win = inst.config.win;

            inst.config.win = {
                clipboardData: {
                    getData: function () {
                        return '';
                    },
                    setData: function (key, val) {
                        return true;
                    }
                }
            };

            ce.on('dom:paste', function(e) {
                fired = true;
                Y.Assert.areSame(e.clipboardData, null);
            });

            ce._DOMPaste({
                _event: {
                    target: OT,
                    currentTarget: OT
                }
            });


            Y.Assert.isTrue(fired);

            inst.config.win = win;

        },


        'test: _DOMPaste {no data} <inline>': function() {
            var node = Y.Node.create('<div/>'),
                ce = new Y.Plugin.ContentEditable({
                    container: node,
                    content: 'This is a test.<a href="#" class=".foo">Foo</a>',
                    use: ['node','selector-css3', 'dd-drag', 'dd-ddm']
                });

            ce.render();

            var OT = 'ORIGINAL_TARGET',
                fired = false;

            var inst = ce.getInstance(),
                win = inst.config.win;

            inst.config.win = {
            };

            ce.on('dom:paste', function(e) {
                fired = true;
                Y.Assert.areSame(e.clipboardData, null);
            });

            ce._DOMPaste({
                _event: {
                    target: OT,
                    currentTarget: OT
                }
            });

            inst.config.win = {
                clipboardData: {
                    getData: function () {
                        return '';
                    },
                    setData: function (key, val) {
                        return false;
                    }
                }
            };

            ce._DOMPaste({
                _event: {
                    target: OT,
                    currentTarget: OT
                }
            });

            Y.Assert.isTrue(fired);

            inst.config.win = win;
        },

        'test: empty _DOMPaste <inline>': function() {
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
                    target: OT,
                    currentTarget: OT
                }
            });

            Y.Assert.isTrue(fired);

            inst.config.win = win;

        },

        'test_frame_destroy <inline>': function() {
            iframe.destroy();

            Y.Assert.isFalse(Y.one('#editor').hasAttribute('contenteditable'), 'iframe DOM node was not destroyed');
        },
        'test_editor <inline>': function() {
            var iframeReady = false;

            editor = new Y.EditorBase({
                content: 'Hello <b>World</b>!!',
                extracss: 'b { color: red; }',
                plugins: [
                    {
                        fn: Y.Plugin.ContentEditable,
                        cfg: {
                            use: this.editorBaseUse
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
        'test_copy_styles <inline>': function() {

            var node = Y.Node.create('<b><u><div style="font-family: Arial; color: purple">Foo</div></u></b>'),
                node2 = Y.Node.create('<div/>');

            editor.copyStyles(node.one('div'), node2);

            Y.Assert.areSame(node.one('div').getStyle('color'), node2.getStyle('color'), 'Style failed to copy');
            Y.Assert.areSame(node.one('div').getStyle('fontFamily'), node2.getStyle('fontFamily'), 'Style failed to copy');

            node = Y.Node.create('<a>');
            node2 = Y.Node.create('<div/>');

            editor.copyStyles(node, node2);

        },
        'test_resolve_node <inline>': function() {
            var inst = editor.getInstance();
            var node = editor._resolveChangedNode(inst.one('html'));

            Y.Assert.areNotSame(inst.one('html'), node, 'Failed to resolve HTML node');

            node = editor._resolveChangedNode(null);
            Y.Assert.isTrue(inst.one('[contenteditable="true"]').compareTo(node), 'Failed to resolve HTML node');
        },
        'test_get_content <inline>': function() {
            var html = editor.getContent(),
                ex = ((Y.UA.gecko && Y.UA.gecko < 12) ? '<br>' : '');
                if (Y.UA.ie) {
                    html = html.replace(' style=""', '').replace(' style="RIGHT: auto"', '');
                }
            Y.Assert.areEqual(ex + 'Hello <b>World</b>!!'.toLowerCase(), html.toLowerCase(), 'getContent failed to get the editor content');
        },
        'test_font_size_normalize <inline>': function() {
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
        'test_selection_font_removal <inline>': function() {
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
        'test_gettext <inline>': function() {
            var inst = editor.getInstance();
            var node = inst.Node.create('<p><font><strong>This is <i>a test</i></strong></font>');

            var text = inst.EditorSelection.getText(node);
            Y.Assert.areSame('This is a test', text, 'Failed to filter out HTML');
        },
        'test_selection_general <inline>': function() {
            var inst = editor.getInstance();

            var count = inst.EditorSelection.hasCursor();
            Y.Assert.areSame(0, count, 'Cursor object found');

            inst.EditorSelection.cleanCursor();

            count = inst.EditorSelection.hasCursor();
            Y.Assert.areSame(0, count, 'Cursor object found');
        },
        'test_selection_methods <inline>': function() {
            var inst = editor.getInstance(),
                sel = new inst.EditorSelection();

            sel.insertContent('This is a test<br>');

            sel.setCursor(true);

            Y.Assert.isTrue(editor.getContent().indexOf('This is a test') > -1, 'Failed to insert content');

        },
        'test: EditorSelection <inline>': function() {

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
        'test_execCommands <inline>': function() {
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
                if (cmd !== 'bidi' && cmd !== 'insertandfocus') {
                    if (cmd.indexOf('insertunorderedlist') > 0 && Y.UA.ie && Y.UA.ie < 9) {
                        editor.execCommand(cmd, '<b>Foo</b>');
                    }
                }
            });
            inst.EditorSelection.hasCursor = hc;
            editor.execCommand('insertandfocus', '<b>Foo</b>');

            editor.frame._execCommand('bold', '');


            var SEL = inst.EditorSelection,
                i;

            inst.EditorSelection = function() {
                var sel = new SEL();
                sel.isCollapsed = false;
                return sel;
            };

            for (i in SEL) {
                if (SEL.hasOwnProperty(i)) {
                    inst.EditorSelection[i] = SEL[i];
                }
            }

            editor.execCommand('insertorderedlist', '');

            inst.EditorSelection = SEL;

        },
        'test: selection.remove() <inline>': function() {
            var inst = editor.getInstance(),
                sel = new inst.EditorSelection();

            sel.remove();
        },
        'test_destroy <inline>': function() {
            editor.destroy();
            Y.Assert.areEqual(Y.one('#editor iframe'), null, 'Frame was not destroyed');
        },
        'test_br_plugin <inline>': function() {
            editor = new Y.EditorBase({
                content: 'Hello <b>World</b>!!',
                extracss: 'b { color: red; }',
                plugins: [
                    {
                        fn: Y.Plugin.ContentEditable,
                        cfg: {
                            use: this.editorBaseUse
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

        makeEditorWithParaPlugin : function (initialContent, onReady) {
            var _this = this;

            editor = new Y.EditorBase({
                content: initialContent,
                extracss: 'b { color: red; }',
                plugins: [
                    {
                        fn: Y.Plugin.ContentEditable,
                        cfg: {
                            use: this.editorBaseUse
                        }
                    }
                ]
            });

            Y.Assert.isInstanceOf(Y.EditorBase, editor, 'EditorBase instance not created?');
            editor.plug(Y.Plugin.EditorPara);
            Y.Assert.isInstanceOf(Y.Plugin.EditorPara, editor.editorPara, 'EditorPara was not plugged.');

            if (onReady) {
                editor.after('ready', function () {
                        _this.resume(onReady);
                });
            }

            //force to always be async onReady call
            setTimeout( function () {
                editor.render('#editor');
            }, 0);
        },

        'test_para_plugin <inline>': function() {
            var inst, str, out;

            function onEditorReady() {
                editor.set('content', '<br><b>Test This</b>');

                inst = editor.getInstance();

                str = '<b>foo</b>';
                out = editor.frame.exec._wrapContent(str);
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

                editor.detachAll();
                editor.destroy();
                Y.Assert.areEqual(Y.one('#editor iframe'), null, 'Third Frame was not destroyed');
            }

            this.makeEditorWithParaPlugin('<p> content<br></p>', onEditorReady);
            this.wait();
        },

        'test para plugin gecko fix <inline>' : function () {
            function onEditorReady() {
                var inst = editor.frame.getInstance(),
                    container = editor.frame.get('container'),
                    node = container.getDOMNode(),
                    sel = new inst.EditorSelection(),
                    text = 'here is the initial text';

                //Simulate gecko state where: P is terminated by BR, then we
                //backspace into it and the cursor (collapsed selection) is
                //after the BR.  See:  https://github.com/yui/yui3/issues/1376
                editor.set('content', '<p>' + text + '</p>');
                container.one('p').appendChild('<br>');
                //place cursor 2 nodes after P start (1st is text node, 2nd is BR)
                node = container.one('p');
                sel.selectNode(node, true, 2);

                editor.editorPara._fixGeckoOnBackspace(inst);

                //Cursor should now be before the BR
                sel = new inst.EditorSelection();
                Y.Assert.isTrue(sel.isCollapsed, 'expected cursor, not range for selection');
                Y.Assert.areEqual(1, container.all('p').size());
                node = container.one('p');
                Y.Assert.areEqual('P', sel.anchorNode.get('nodeName'),
                                  'selection anchorNode wrong');
                Y.Assert.areEqual('P', sel.focusNode.get('nodeName'),
                                  'selection focusNode wrong');
                Y.Assert.areEqual(text.length, sel.anchorOffset,
                                  'selection anchorOffset wrong');
            }

            this.makeEditorWithParaPlugin('<p> content</p>', onEditorReady);
            this.wait();
        },

        'test_double_plug_setup <inline>': function() {
            editor = new Y.EditorBase({
                content: 'Hello <b>World</b>!!',
                extracss: 'b { color: red; }',
                plugins: [Y.Plugin.ContentEditable]
            });
            Y.Assert.isInstanceOf(Y.EditorBase, editor, 'Forth EditorBase instance can not be created');
        },
        'test_double_plug <inline>': function() {
            editor.plug(Y.Plugin.EditorPara);
            //This should error
            editor.plug(Y.Plugin.EditorBR);
        },
        'test_double_down <inline>': function() {
            Y.Assert.isInstanceOf(Y.Plugin.EditorPara, editor.editorPara, 'EditorPara was not plugged..');
            editor.render('#editor');
            editor.destroy();
            Y.Assert.areEqual(Y.one('#editor frame'), null, 'Forth Frame was not destroyed');
            Y.Assert.isFalse(Y.one('#editor').hasAttribute('contenteditable'), 'The editor was not destroyed');
        },
        'test_double_plug_setup2 <inline>': function() {
            editor = new Y.EditorBase({
                content: 'Hello <b>World</b>!!',
                extracss: 'b { color: red; }',
                plugins: [Y.Plugin.ContentEditable]
            });
            Y.Assert.isInstanceOf(Y.EditorBase, editor, 'Fifth EditorBase instance can not be created');
        },
        'test_double_plug2 <inline>': function() {
            editor.plug(Y.Plugin.EditorBR);
            //This should error
            editor.plug(Y.Plugin.EditorPara);
        },
        'test_double_down2 <inline>': function() {
            Y.Assert.isInstanceOf(Y.Plugin.EditorBR, editor.editorBR, 'EditorBR was not plugged..');
            editor.render('#editor');
            editor.destroy();
            Y.Assert.areEqual(Y.one('#editor frame'), null, 'Fifth Frame was not destroyed');
            Y.Assert.isFalse(Y.one('#editor').hasAttribute('contenteditable'), 'The editor was not destroyed');
        },
        'test_bidi_noplug <inline>': function() {
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
        'test_bidi_plug <inline>': function() {
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

        'test _onDomEvent with forced incorrect data <inline>': function () {
            var node = Y.Node.create('<div/>'),
                ce = new Y.Plugin.ContentEditable({
                    content: '<p>This is a test.</p>',
                    container: node
                });

            ce.render();

            ce.on('dom:keypress', function (e) {
                Y.Assert.areEqual(100, e.pageX);
                Y.Assert.areEqual(100, e.pageY);
                Y.Assert.areEqual('keypress', e.type);
            });
            ce._onDomEvent({ pageX: 100, pageY: 100, type: 'keypress' });

            ce.on('dom:click', function (e) {
                Y.Assert.areEqual('click', e.type);
            });
            ce._onDomEvent({ pageX: 100, pageY: 100, type: 'click' });
        },

        'test extra content ready calls <inline>': function () {
            var  node = Y.Node.create('<div/>'),
                ce = new Y.Plugin.ContentEditable({
                    content: '<p>This is a test.</p>',
                    container: node
                }),
                inst = ce.getInstance();

            Y.Assert.isNull(inst);

            ce._ready = true;
            ce._onContentReady();

            inst = ce.getInstance();
            Y.Assert.isNull(inst);

            ce._ready = false;
            ce.render();

            inst = ce.getInstance();
            Y.Assert.isNotNull(inst);
        },

        'test extra css added after render <inline>': function () {
            var node = Y.Node.create('<div/>'),
                ce = new Y.Plugin.ContentEditable({
                    content: '<p class="bar">This is a test.</p>',
                    container: node
                }),
                color;

            Y.one('body').append(node);
            ce.render();

            ce.set('extracss', '');

            ce.set('extracss', '.bar { color: blue; }');

            color = node.one('.bar').getStyle('color');
            color = Y.Color.toHex(color);

            Y.Assert.areSame('#0000FF', color);

            ce.set('extracss', '.bar { color: red; }');

            color = node.one('.bar').getStyle('color');
            color = Y.Color.toHex(color);

            Y.Assert.areSame('#FF0000', color);

            node.remove(true);
        },

        'test _setLinkedCSS works properly <inline>': function () {
            var test = this,
                node = Y.Node.create('<div/>'),
                ce = new Y.Plugin.ContentEditable({
                    content: '<p><span class="pure-button">This</span> is a <b class="foo">test</b>.</p>',
                    container: node,
                    extracss: '.foo { font-weight: normal; color: black; background-color: yellow; }'
                }),
                url = 'http://yui.yahooapis.com/pure/0.2.1/pure-min.css';

            Y.one('body').append(node);

            node.setStyles({
                borderColor: 'red',
                borderWidth: '1px',
                borderStyle: 'solid'
            });

            ce.render();

            ce.set('linkedcss', url);


            setTimeout(function () {
                Y.all('link').some(function (node) {
                    if (node.getAttribute('href') === url) {
                        test.resume(function () {
                            Y.Assert.isTrue(true);
                        });
                        return true;
                    }
                });
            }, 1000);
            test.wait();
        },

        'test selection <inline>': function () {
            var test = this,
                node = Y.Node.create('<div/>'),
                ce = new Y.InlineEditor({
                    content: 'Fooga',
                    container: node
                });

                Y.one('body').append(node);

                ce.after('ready', function (e) {
                    var sel = new (ce.contentEditable.getInstance()).EditorSelection();

                    var moved = sel.getEditorOffset(); // content across page

                    Y.Assert.isTrue(moved >= 90);
                });

                ce.render();

        },

        _should: {
            fail: {
                'test_selection_methods <inline>': (Y.UA.ie ? true : false)
            },
            ignore: {
                'test: EditorSelection <inline>': Y.UA.phantomjs,
                'test_selection_methods <inline>': Y.UA.phantomjs,
                'test_br_plugin <inline>': Y.UA.phantomjs,
                'test para plugin gecko fix <inline>': !Y.UA.gecko
            },
            error: { //These tests should error
                'test_selection_methods <inline>': (Y.UA.ie ? true : false),
                'test_double_plug <inline>': true,
                'test_double_plug2 <inline>': true,
                'test_bidi_noplug <inline>': true
            }
        }
    };

    var suite = new Y.Test.Suite("Editor");

    suite.add(new Y.Test.Case(template));
    Y.Test.Runner.add(suite);

});
