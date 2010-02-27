YUI.add('editor-base', function(Y) {

    
    var EditorBase = function() {
        EditorBase.superclass.constructor.apply(this, arguments);
    };

    Y.extend(EditorBase, Y.Base, {
        frame: null,
        initializer: function() {
            var frame = new Y.Frame({
                designMode: true,
                use: EditorBase.USE
            }).plug(Y.Plugin.ExecCommand);

            frame.on('ready', Y.bind(this._onFrameReady, this));
            frame.after('ready', Y.bind(this._afterFrameReady, this));
            frame.addTarget(this);
            this.frame = frame;
            
        },
        _afterFrameReady: function() {
            this.frame.on('mousedown', Y.bind(this._onFrameMouseDown, this));
            this.frame.on('keyup', Y.bind(this._onFrameKeyUp, this));
        },
        _onFrameMouseDown: function(e) {
            this.fire('nodeChange', { node: e.frameTarget });
        },
        _onFrameKeyUp: function(e) {
            var inst = this.frame.getInstance();
            var sel = new inst.Selection();
            if (sel.anchorNode) {
                this.fire('nodeChange', { node: sel.anchorNode });
            }
        },
        _onFrameReady: function() {
            var inst = this.frame.getInstance();
            inst.Selection.filter();
        },
        execCommand: function(cmd, val) {
            return this.frame.execCommand(cmd, val);
        },
        getInstance: function() {
            return this.frame.getInstance();
        },
        destructor: function() {
        },
        render: function(node) {
            this.frame.set('content', this.get('content'));
            this.frame.render(node);
        }
    }, {
        USE: ['node','selector-css3', 'selection', 'stylesheet'],
        NAME: 'editor-base',
        ATTRS: {
            content: {
                value: '<br>'
            }
        }
    });

    Y.EditorBase = EditorBase;


}, '@VERSION@' ,{requires:['base', 'frame', 'node', 'exec-command'], skinnable:false });
