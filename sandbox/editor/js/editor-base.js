YUI.add('editor-base', function(Y) {

    /**
     * Base class for Editor. Handles the business logic of Editor, no GUI involved only utility methods and events.
     * @module editor
     * @submodule editor-base
     */     
    /**
     * Base class for Editor. Handles the business logic of Editor, no GUI involved only utility methods and events.
     * @class EditorBase
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
            }).plug(Y.Plugin.ExecCommand);

            frame.after('ready', Y.bind(this._afterFrameReady, this));
            frame.addTarget(this);
            this.frame = frame;
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
            inst.Selection.filter();
        },
        /**
        * Fires nodeChange event
        * @method _onFrameMouseDown
        * @private
        */
        _onFrameMouseDown: function(e) {
            this.fire('nodeChange', { node: e.frameTarget, type: 'mousedown' });
        },
        /**
        * The Y.later handle to determine if there is an active timer running.
        * @property _keyUpTimer
        * @private
        */
        _keyupTimer: null,
        /**
        * Fires nodeChange event from _onKeyUpTimer on a timer for performance
        * @method _onKeyUpTimer
        * @param {Boolean} fromTimer If it's from the timer, kill the _keyUpTimer property
        * @private
        */
        _onKeyUpTimer: function(fromTimer) {
            var inst = this.frame.getInstance(),
                sel = new inst.Selection();

            if (sel.anchorNode) {
                this.fire('nodeChange', { node: sel.anchorNode, type: 'keyup', selection: sel });
            }
            if (fromTimer) {
                this._keyUpTimer = null;
            }
        },
        /**
        * Fires nodeChange event via _onKeyUpTimer on a timer for performance
        * @method _onFrameKeyUp
        * @private
        */
        _onFrameKeyUp: function(e) {
            if (!this._keyUpTimer) {
                this._keyUpTimer = Y.later(350, this, Y.bind(this._onKeyUpTimer, this, true));
                this._onKeyUpTimer(false);
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
            return this.frame.execCommand(cmd, val);
        },
        /**
        * Get the YUI instance of the frame
        * @method getInstance
        * @return {YUI} The YUI instance bound to the frame.
        */
        getInstance: function() {
            return this.frame.getInstance();
        },
        destructor: function() {
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
        * @return {EditorBase}
        * @chainable
        */
        focus: function() {
            this.frame.getInstance().one('win').focus();
            return this;
        },
        /**
        * (Un)Filters the content of the Editor, cleaning YUI related code. //TODO better filtering
        * @method getContent
        * @return {String} The filtered content of the Editor
        */
        getContent: function() {
            var html = this.getInstance().Selection.unfilter();
            return html;
        }
    }, {
        /**
        * The default modules to use inside the Frame
        * @static
        * @property USE
        * @type Array
        */
        USE: ['substitute', 'node','selector-css3', 'selection', 'stylesheet'],
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
            }
        }
    });

    Y.EditorBase = EditorBase;

    /**
    * @event nodeChange
    * @description Fired from mouseup & keyup.
    * @param {Event.Facade} event An Event Facade object with the following specific property added:
    * <dl><dt>node</dt><dd>The node currently being interacted with</dd></dl>
    * @type {Event.Custom}
    */



}, '@VERSION@' ,{requires:['base', 'frame', 'node', 'exec-command'], skinnable:false });
