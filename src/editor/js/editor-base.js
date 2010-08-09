
    /**
     * Base class for Editor. Handles the business logic of Editor, no GUI involved only utility methods and events.
     * @module editor
     * @submodule editor-base
     */     
    /**
     * Base class for Editor. Handles the business logic of Editor, no GUI involved only utility methods and events.
     * @class EditorBase
     * @for EditorBase
     * @extends Base
     * @constructor
     */
    
    var EditorBase = function() {
        EditorBase.superclass.constructor.apply(this, arguments);
    };

    Y.extend(EditorBase, Y.Base, {
        /**
        * Internal reference to the Y.Frame instance
        * @property frame
        */
        frame: null,
        initializer: function() {
            var frame = new Y.Frame({
                designMode: true,
                title: EditorBase.STRINGS.title,
                use: EditorBase.USE,
                dir: this.get('dir'),
                extracss: this.get('extracss'),
                host: this
            }).plug(Y.Plugin.ExecCommand);

            frame.after('ready', Y.bind(this._afterFrameReady, this));
            frame.addTarget(this);
            this.frame = frame;

            this.publish('nodeChange', {
                emitFacade: true,
                bubbles: true,
                defaultFn: this._defNodeChangeFn
            });
        },
        destructor: function() {
            this.frame.destroy();

            this.detachAll();
        },
        /**
        * Copy certain styles from one node instance to another (used for new paragraph creation mainly)
        * @method copyStyles
        * @param {Node} from The Node instance to copy the styles from 
        * @param {Node} to The Node instance to copy the styles to
        */
        copyStyles: function(from, to) {
            var styles = ['color', 'fontSize', 'fontFamily', 'backgroundColor', 'fontStyle' ],
                newStyles = {};

            Y.each(styles, function(v) {
                newStyles[v] = from.getStyle(v);
            });
            if (from.ancestor('b,strong')) {
                newStyles.fontWeight = 'bold';
            }
            to.setStyles(newStyles);
        },
        /**
        * The default handler for the nodeChange event.
        * @method _defNodeChangeFn
        * @param {Event} e The event
        * @private
        */
        _defNodeChangeFn: function(e) {
            //Y.log('Default nodeChange function: ' + e.changedType, 'info', 'editor');
            var inst = this.getInstance();

            /*
            * @TODO
            * This whole method needs to be fixed and made more dynamic.
            * Maybe static functions for the e.changeType and an object bag
            * to walk through and filter to pass off the event to before firing..
            */
            
            switch (e.changedType) {
                case 'enter':
                    if (Y.UA.webkit) {
                        //Webkit doesn't support shift+enter as a BR, this fixes that.
                        if (e.changedEvent.shiftKey) {
                            this.execCommand('insertbr');
                            e.changedEvent.preventDefault();
                        }
                    }
                    break;
                case 'tab':
                    if (!e.changedNode.test('li, li *') && !e.changedEvent.shiftKey) {
                        Y.log('Overriding TAB key to insert HTML', 'info', 'editor');
                        var sel = new inst.Selection();
                        sel.setCursor();
                        var cur = sel.getCursor();
                        cur.insert(EditorBase.TABKEY, 'before');
                        sel.focusCursor();
                        e.changedEvent.preventDefault();
                    }
                    break;
                case 'enter-up':
                    if (e.changedNode.test('p')) {
                        var prev = e.changedNode.previous(), lc, lc2, found = false;
                        if (prev) {
                            lc = prev.one(':last-child');
                            while (!found) {
                                if (lc) {
                                    lc2 = lc.one(':last-child');
                                    if (lc2) {
                                        lc = lc2;
                                    } else {
                                        found = true;
                                    }
                                } else {
                                    found = true;
                                }
                            }
                            if (lc) {
                                this.copyStyles(lc, e.changedNode);
                            }
                        }
                    }
                    break;
            }

            var changed = this.getDomPath(e.changedNode),
                cmds = {}, family, fsize, classes = [],
                fColor = '', bColor = '';

            if (e.commands) {
                cmds = e.commands;
            }

            changed.each(function(n) {
                var tag = n.get('tagName').toLowerCase(),
                    cmd = EditorBase.TAG2CMD[tag],
                    el = Y.Node.getDOMNode(n);

                if (cmd) {
                    cmds[cmd] = 1;
                }

                //Bold and Italic styles
                var s = el.style;
                if (s.fontWeight.toLowerCase() == 'bold') {
                    cmds.bold = 1;
                }
                if (s.fontStyle.toLowerCase() == 'italic') {
                    cmds.italic = 1;
                }
                if (s.textDecoration.toLowerCase() == 'underline') {
                    cmds.underline = 1;
                }
                if (s.textDecoration.toLowerCase() == 'line-through') {
                    cmds.strikethrough = 1;
                }

                var family2 = n.getStyle('fontFamily').split(',')[0].toLowerCase();
                if (family2) {
                    family = family2;
                }
                fsize = n.getStyle('fontSize');

                var cls = n.get('className').split(' ');
                Y.each(cls, function(v) {
                    if (v !== '' && (v.substr(0, 4) !== 'yui_')) {
                        classes.push(v);
                    }
                });

                fColor = EditorBase.FILTER_RGB(n.getStyle('color'));
                var bColor2 = EditorBase.FILTER_RGB(n.getStyle('backgroundColor'));
                if (bColor2 !== 'transparent') {
                    bColor = bColor2;
                }
                
            });
            
            e.dompath = changed;
            e.classNames = classes;
            e.commands = cmds;

            //TODO Dont' like this, not dynamic enough..
            if (!e.fontFamily) {
                e.fontFamily = family;
            }
            if (!e.fontSize) {
                e.fontSize = fsize;
            }
            if (!e.fontColor) {
                e.fontColor = fColor;
            }
            if (!e.backgroundColor) {
                e.backgroundColor = bColor;
            }
        },
        /**
        * Walk the dom tree from this node up to body, returning a reversed array of parents.
        * @method getDomPath
        * @param {Node} node The Node to start from 
        */
        getDomPath: function(node) {
            
			var domPath = [],
                inst = this.frame.getInstance();

            while (node !== null) {
                if (node.test('html') || node.test('doc') || !node.get('tagName')) {
                    node = null;
                    break;
                }
                if (!node.inDoc()) {
                    node = null;
                    break;
                }
                //Check to see if we get el.nodeName and nodeType
                if (node.get('nodeName') && node.get('nodeType') && (node.get('nodeType') == 1)) {
                    domPath.push(inst.Node.getDOMNode(node));
                }

                if (node.test('body')) {
                    node = null;
                    break;
                }

                node = node.get('parentNode');
            }
            if (domPath.length === 0) {
                domPath[0] = inst.config.doc.body;
            }
            
            return inst.all(domPath.reverse());

        },
        /**
        * After frame ready, bind mousedown & keyup listeners
        * @method _afterFrameReady
        * @private
        */
        _afterFrameReady: function() {
            var inst = this.frame.getInstance();
            this.frame.on('mousedown', Y.bind(this._onFrameMouseDown, this));
            this.frame.on('keyup', Y.bind(this._onFrameKeyUp, this));
            this.frame.on('keydown', Y.bind(this._onFrameKeyDown, this));
            this.frame.on('keypress', Y.bind(this._onFrameKeyPress, this));
            inst.Selection.filter();
            this.fire('ready');
        },
        /**
        * Fires nodeChange event
        * @method _onFrameMouseDown
        * @private
        */
        _onFrameMouseDown: function(e) {
            this.fire('nodeChange', { changedNode: e.frameTarget, changedType: 'mousedown', changedEvent: e  });
        },
        /**
        * Fires nodeChange event for keyup on specific keys
        * @method _onFrameKeyUp
        * @private
        */
        _onFrameKeyUp: function(e) {
            var inst = this.frame.getInstance(),
                sel = new inst.Selection();
            
            if (sel.anchorNode) {
                this.fire('nodeChange', { changedNode: sel.anchorNode, changedType: 'keyup', selection: sel, changedEvent: e  });
                if (EditorBase.NC_KEYS[e.keyCode]) {
                    this.fire('nodeChange', { changedNode: sel.anchorNode, changedType: EditorBase.NC_KEYS[e.keyCode] + '-up', selection: sel, changedEvent: e  });
                }
            }
        },
        /**
        * Fires nodeChange event
        * @method _onFrameKeyDown
        * @private
        */
        _onFrameKeyDown: function(e) {
            var inst = this.frame.getInstance(),
                sel = new inst.Selection();

            if (sel.anchorNode) {
                this.fire('nodeChange', { changedNode: sel.anchorNode, changedType: 'keydown', changedEvent: e });
                if (EditorBase.NC_KEYS[e.keyCode]) {
                    this.fire('nodeChange', { changedNode: sel.anchorNode, changedType: EditorBase.NC_KEYS[e.keyCode], changedEvent: e });
                    this.fire('nodeChange', { changedNode: sel.anchorNode, changedType: EditorBase.NC_KEYS[e.keyCode] + '-down', changedEvent: e });
                }
            }
        },
        /**
        * Fires nodeChange event
        * @method _onFrameKeyPress
        * @private
        */
        _onFrameKeyPress: function(e) {
            var inst = this.frame.getInstance(),
                sel = new inst.Selection();

            if (sel.anchorNode) {
                this.fire('nodeChange', { changedNode: sel.anchorNode, changedType: 'keypress', changedEvent: e });
                if (EditorBase.NC_KEYS[e.keyCode]) {
                    this.fire('nodeChange', { changedNode: sel.anchorNode, changedType: EditorBase.NC_KEYS[e.keyCode] + '-press', changedEvent: e });
                }
            }
        },
        /**
        * Pass through to the frame.execCommand method
        * @method execCommand
        * @param {String} cmd The command to pass: inserthtml, insertimage, bold
        * @param {String} val The optional value of the command: Helvetica
        * @return {Node/NodeList} The Node or Nodelist affected by the command. Only returns on override commands, not browser defined commands.
        */
        execCommand: function(cmd, val) {
            var ret = this.frame.execCommand(cmd, val),
                inst = this.frame.getInstance(),
                sel = new inst.Selection(), cmds = {},
                e = { changedNode: sel.anchorNode, changedType: 'execcommand', nodes: ret };

            switch (cmd) {
                case 'forecolor':
                    e.fontColor = val;
                    break;
                case 'backcolor':
                    e.backgroundColor = val;
                    break;
                case 'fontsize':
                    e.fontSize = val;
                    break;
                case 'fontname':
                    e.fontFamily = val;
                    break;
            }

            cmds[cmd] = 1;
            e.commands = cmds;

            this.fire('nodeChange', e);

            return ret;
        },
        /**
        * Get the YUI instance of the frame
        * @method getInstance
        * @return {YUI} The YUI instance bound to the frame.
        */
        getInstance: function() {
            return this.frame.getInstance();
        },
        /**
        * Renders the Y.Frame to the passed node.
        * @method render
        * @param {Selector/HTMLElement/Node} node The node to append the Editor to
        * @return {EditorBase}
        * @chainable
        */
        render: function(node) {
            this.frame.set('content', this.get('content'));
            this.frame.render(node);
            return this;
        },
        /**
        * Focus the contentWindow of the iframe
        * @method focus
        * @param {Function} fn Callback function to execute after focus happens
        * @return {EditorBase}
        * @chainable
        */
        focus: function(fn) {
            this.frame.focus(fn);
            return this;
        },
        /**
        * Handles the showing of the Editor instance. Currently only handles the iframe
        * @method show
        * @return {EditorBase}
        * @chainable
        */
        show: function() {
            this.frame.show();
            return this;
        },
        /**
        * Handles the hiding of the Editor instance. Currently only handles the iframe
        * @method hide
        * @return {EditorBase}
        * @chainable
        */
        hide: function() {
            this.frame.hide();
            return this;
        },
        /**
        * (Un)Filters the content of the Editor, cleaning YUI related code. //TODO better filtering
        * @method getContent
        * @return {String} The filtered content of the Editor
        */
        getContent: function() {
            var html = '', inst = this.getInstance();
            if (inst && inst.Selection) {
                html = inst.Selection.unfilter();
            }
            //Removing the _yuid from the objects in IE
            html = html.replace(/ _yuid="([^>]*)"/g, '');
            return html;
        }
    }, {
        /**
        * @static
        * @property TABKEY
        * @description The HTML markup to use for the tabkey
        */
        TABKEY: '<span class="tab">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>',
        /**
        * @static
        * @method FILTER_RGB
        * @param String css The CSS string containing rgb(#,#,#);
        * @description Converts an RGB color string to a hex color, example: rgb(0, 255, 0) converts to #00ff00
        * @return String
        */
        FILTER_RGB: function(css) {
            if (css.toLowerCase().indexOf('rgb') != -1) {
                var exp = new RegExp("(.*?)rgb\\s*?\\(\\s*?([0-9]+).*?,\\s*?([0-9]+).*?,\\s*?([0-9]+).*?\\)(.*?)", "gi");
                var rgb = css.replace(exp, "$1,$2,$3,$4,$5").split(',');
            
                if (rgb.length == 5) {
                    var r = parseInt(rgb[1], 10).toString(16);
                    var g = parseInt(rgb[2], 10).toString(16);
                    var b = parseInt(rgb[3], 10).toString(16);

                    r = r.length == 1 ? '0' + r : r;
                    g = g.length == 1 ? '0' + g : g;
                    b = b.length == 1 ? '0' + b : b;

                    css = "#" + r + g + b;
                }
            }
            return css;
        },        
        /**
        * @static
        * @property TAG2CMD
        * @description A hash table of tags to their execcomand's
        */
        TAG2CMD: {
            'b': 'bold',
            'strong': 'bold',
            'i': 'italic',
            'em': 'italic',
            'u': 'underline',
            'sup': 'superscript',
            'sub': 'subscript',
            'img': 'insertimage',
            'a' : 'createlink',
            'ul' : 'insertunorderedlist',
            'ol' : 'insertorderedlist'
        },
        /**
        * Hash table of keys to fire a nodeChange event for.
        * @static
        * @property NC_KEYS
        * @type Object
        */
        NC_KEYS: {
            8: 'backspace',
            9: 'tab',
            13: 'enter',
            32: 'space',
            33: 'pageup',
            34: 'pagedown',
            35: 'end',
            36: 'home',
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down',
            46: 'delete'
        },
        /**
        * The default modules to use inside the Frame
        * @static
        * @property USE
        * @type Array
        */
        USE: ['substitute', 'node', 'selector-css3', 'selection', 'stylesheet'],
        /**
        * The Class Name: editorBase
        * @static
        * @property NAME
        */
        NAME: 'editorBase',
        /**
        * Editor Strings
        * @static
        * @property STRINGS
        */
        STRINGS: {
            /**
            * Title of frame document: Rich Text Editor
            * @static
            * @property STRINGS.title
            */
            title: 'Rich Text Editor'
        },
        ATTRS: {
            /**
            * The content to load into the Editor Frame
            * @attribute content
            */
            content: {
                value: '<br>',
                setter: function(str) {
                    if (str.substr(0, 1) === "\n") {
                        Y.log('Stripping first carriage return from content before injecting', 'warn', 'editor');
                        str = str.substr(1);
                    }
                    if (str === '') {
                        str = '<br>';
                    }
                    return this.frame.set('content', str);
                },
                getter: function() {
                    return this.frame.get('content');
                }
            },
            /**
            * The value of the dir attribute on the HTML element of the frame. Default: ltr
            * @attribute dir
            */
            dir: {
                writeOnce: true,
                value: 'ltr'
            },
            /**
            * @attribute extracss
            * @description A string of CSS to add to the Head of the Editor
            * @type String
            */            
            extracss: {
                value: false,
                setter: function(css) {
                    if (this.frame) {
                        this.frame.set('extracss', css);
                    }
                    return css;
                }
            }
        }
    });

    Y.EditorBase = EditorBase;

    /**
    * @event nodeChange
    * @description Fired from mouseup & keyup.
    * @param {Event.Facade} event An Event Facade object with the following specific properties added:
    * <dl>
    *   <dt>changedEvent</dt><dd>The event that caused the nodeChange</dd>
    *   <dt>changedNode</dt><dd>The node that was interacted with</dd>
    *   <dt>changedType</dt><dd>The type of change: mousedown, mouseup, right, left, backspace, tab, enter, etc..</dd>
    *   <dt>commands</dt><dd>The list of execCommands that belong to this change and the dompath that's associated with the changedNode</dd>
    *   <dt>classNames</dt><dd>An array of classNames that are applied to the changedNode and all of it's parents</dd>
    *   <dt>dompath</dt><dd>A sorted array of node instances that make up the DOM path from the changedNode to body.</dd>
    *   <dt>backgroundColor</dt><dd>The cascaded backgroundColor of the changedNode</dd>
    *   <dt>fontColor</dt><dd>The cascaded fontColor of the changedNode</dd>
    *   <dt>fontFamily</dt><dd>The cascaded fontFamily of the changedNode</dd>
    *   <dt>fontSize</dt><dd>The cascaded fontSize of the changedNode</dd>
    * </dl>
    * @type {Event.Custom}
    */

    /**
    * @event ready
    * @description Fired after the frame is ready.
    * @param {Event.Facade} event An Event Facade object.
    * @type {Event.Custom}
    */



