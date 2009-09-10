YUI.add( 'textnodeeditor', function( Y ) {

	function TextNodeEditor( config ) {
		TextNodeEditor.superclass.constructor.apply(this, arguments);
	};

	TextNodeEditor.NAME = "textNodeEditor";
	TextNodeEditor.NS = "editor";

	Y.extend( TextNodeEditor, Y.NodeEditor, {

		_getEditorValue: function( ) {
			return this._editorNode.query('.yui-editor-field').get('value');
		},
		_detachEditorEvents: function(e) {
			//Remove Event Handles from the form
			this._cancelHandle.detach();
			this._saveHandle.detach();
			this._submitHandle.detach();
			this._keyESCHandle.detach();
		},

    _renderEditorElements: function( editor ) {
			Y.log("TextNodeEditor::renderEditorElements");
			//create additional elements
			this._input = Y.Node.create('<input type="text" class="yui-editor-field">').set('value',this.get('value'));
			editor.appendChild(this._input);
    },
    _evtOnRender: function() {
      Y.log("TextNodeEditor::evtOnRender");
      //this._input.select();
    }

	});

Y.TextNodeEditor = TextNodeEditor;


},'3.0.0b1',{ requires: ["nodeeditor"] } ); 
