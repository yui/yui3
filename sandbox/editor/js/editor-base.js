YUI.add('editor-base', function(Y) {

    /**
     * Base class for Editor. Handles the MVC portion of Editor, no GUI involved.
     * @module editor-base
     */     
    /**
     * Base class for Editor. Handles the MVC portion of Editor, no GUI involved.
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
                title: 'Rich Text Editor',
                use: EditorBase.USE
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
            this.fire('nodeChange', { node: e.frameTarget });
        },
        /**
        * Fires nodeChange event
        * @method _onFrameKeyUp
        * @private
        */
        _onFrameKeyUp: function(e) {
            var inst = this.frame.getInstance();
            var sel = new inst.Selection();
            if (sel.anchorNode) {
                this.fire('nodeChange', { node: sel.anchorNode });
            }
        },
        /**
        * Pass through to the frame.execCommand method
        * @method execCommand
        * @param String cmd The command to pass: inserthtml, insertimage, bold
        * @param String val The optional value of the command: Helvetica
        * @return Node/NodeList
        */
        execCommand: function(cmd, val) {
            return this.frame.execCommand(cmd, val);
        },
        /**
        * Get the YUI instance of the frame
        * @method getInstance
        * @return YUI
        */
        getInstance: function() {
            return this.frame.getInstance();
        },
        destructor: function() {
        },
        /**
        * Renders the Y.Frame to the passed node.
        * @method render
        * @param Selector/HTMLElement/Node node The node to append the Editor to
        * @return self
        * @chainable
        */
        render: function(node) {
            this.frame.set('content', this.get('content'));
            this.frame.render(node);
            return this;
        }
    }, {
        /**
        * The default modules to use inside the Frame
        * @static
        * @property USE
        * @type Array
        */
        USE: ['node','selector-css3', 'selection', 'stylesheet'],
        /**
        * The Class Name: editor-base
        * @static
        * @property NAME
        */
        NAME: 'editorBase',
        ATTRS: {
            /**
            * The content to load into the Editor Frame
            * @attribute content
            */
            content: {
                value: '<br>',
                setter: function(str) {
                    return this.frame.set('content', str);
                },
                getter: function() {
                    return this.frame.get('content');
                }
            }
        }
    });

    Y.EditorBase = EditorBase;

}, '@VERSION@' ,{requires:['base', 'frame', 'node', 'exec-command'], skinnable:false });
