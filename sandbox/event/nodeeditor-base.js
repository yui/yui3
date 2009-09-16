      YUI.add( 'nodeeditor', function( Y ) {

        function NodeEditor( config ) {
          NodeEditor.superclass.constructor.apply(this, arguments);
        };

        NodeEditor.NAME = "nodeEditor";
        NodeEditor.NS = "editor";
        NodeEditor.NE_ON_MOUSE_ENTER = "OnMouseEnter";
        NodeEditor.NE_ON_MOUSE_LEAVE = "OnMouseLeave";
        NodeEditor.NE_BEFORE_EDIT = "BeforeEdit";
        NodeEditor.NE_CANCEL = "CancelEdit";
        NodeEditor.NE_SAVE = "SaveEdit";
        NodeEditor.NE_AFTER_RENDER = "AfterRender";
        
        NodeEditor.ATTRS = {
          value: {
            value: null,
            setter: function( val ) {
              return Y.Lang.trim( val );
            }
          }
        };
        
        Y.extend( NodeEditor, Y.Plugin.Base, {
          initializer: function( config ) {
            Y.log("NodeEditor::initializer");
            this._bindUIEvents();
            this.set('value',this.get('host').get('innerHTML'));
            //create container for the editor
            this._editorNode = Y.Node.create('<div class="yui-nodeeditor-editor">');
            var host = this.get('host');
            this.get('host').addClass('yui-nodeeditor-content');
            this.get('host').get('parentNode').insertBefore(this._editorNode,this.get('host'));
          },
          destructor: function() {
            Y.log("NodeEditor::destructor");
            this._mouseEnterHandle.detach();
            this._mouseLeaveHandle.detach();
            this._clickHandle.detach();
          },
          _bindUIEvents: function() {
            Y.log("NodeEditor::bindUI");
            this._mouseEnterHandle = this.get('host').on('mouseenter',Y.bind(this._evtOnMouseEnter,this));
            this._mouseLeaveHandle = this.get('host').on('mouseleave',Y.bind(this._evtOnMouseLeave,this));
            this._clickHandle = this.get('host').on('click',Y.bind(this._evtOnClick,this));
            this._renderHandle = this.on(NodeEditor.NE_AFTER_RENDER,this._evtOnRender);
          },
          _evtOnMouseEnter: function( e ) {
            Y.log('NodeEditor::onMouseEnter');
            this.fire(NodeEditor.NE_ON_MOUSE_ENTER, e);
            this.get('host').addClass('yui-nodeeditor-hover');
            this._editflag = true;
          },
          _evtOnMouseLeave: function( e ) {
            Y.log('NodeEditor::onMouseLeave');
            this.fire(NodeEditor.NE_ON_MOUSE_LEAVE, e);
            var that = this;
            window.setTimeout(function() {
              if(!that._editflag) {
                that.get('host').removeClass('yui-nodeeditor-hover');
              }
            },1000);
            this._editflag = false;
          },
          _evtOnClick: function(e) {
            Y.log("NodeEditor::onClick");
            this.fire(NodeEditor.NE_BEFORE_EDIT, e);
            this.showEditor();
          },
          
          /**
           * Cancel editing, ESC key pressed 
           * @method _evtOnCancel
           * @private
           */
          _evtOnCancel: function(e) {
            Y.log("nodeEditor::cancel");
            e.halt();
            this.fire(NodeEditor.NE_CANCEL,this.get('value'));
            this.hideEditor();
            this.showLabel();
          },

          /**
           * Form submit or save button clicked, save the form value, fire save event.
           * @method _evtOnSave
           * @private
           */
          _evtOnSave: function(e) {
            e.halt();
            var val = this._getEditorValue();
            if( Y.Lang.trim(val) !== this.get('value') ) {
              Y.log("nodeEditor::save");
              this.get('host').set('innerHTML',val);
              this.set('value',val);
              this.fire(NodeEditor.NE_SAVE,val);
            }
            this.hideEditor();
            this.showLabel();
          },
          showEditor: function(e) {
            this._renderEditor();
            this.hideLabel();
          },
          showLabel: function() {
            //hide the original label
            this.get('host').removeClass('yui-nodeeditor-hidden');
          },
          hideLabel: function() {
            this.get('host').removeClass('yui-nodeeditor-hover');
            //hide the original label
            this.get('host').addClass('yui-nodeeditor-hidden');
          },
          hideEditor: function(e) {
            Y.log("NodeEditor::hideEditor");
	
						this._detachEditorEvents();

            //destroy the form
            this._editorNode.set('innerHTML','');
          },          
					_detatchEditorEvents: function() {
            //Remove Event Handles from the form
					},


          _renderEditor: function( ) {
              Y.log("NodeEditor::renderEditor");
              //create the form
              var editor = Y.Node.create('<form class="yui-nodeeditor-form">');
            
              //add form events
              this._submitHandle = editor.on('submit',Y.bind(this._evtOnSave,this));
              this._keyESCHandle = editor.on('key',Y.bind(this._evtOnCancel,this),'down:27');
            
              //create additional elements
              this._renderEditorElements( editor );
              editor.appendChild(Y.Node.create('<br>'));
            
              //create buttons and button events
              var saveButton = Y.Node.create('<input type="button" class="yui-nodeeditor-savebutton" value="Save">');
              this._saveHandle = saveButton.on("click",Y.bind(this._evtOnSave,this));
            
              editor.appendChild(saveButton);
              editor.appendChild(Y.Node.create("<span> or </span>"));
            
              var cancelButton = Y.Node.create('<input type="button" class="yui-nodeeditor-cancelbutton" value="Cancel">');
              this._cancelHandle = cancelButton.on("click",Y.bind(this._evtOnCancel,this));
              editor.appendChild(cancelButton);
            
              //add editor to parent div
              this._editorNode.appendChild(editor);
              this.fire(NodeEditor.NE_AFTER_RENDER,editor);
					},
          _renderEditorElements: function(editor) {
            editor.appendChild( Y.Node.create("<span>Abstract: Editor not defined</span>"));
          },
          _evtOnRender: function( e ) {}
          
        });

				Y.NodeEditor = NodeEditor;

         
      },'3.0.0b1',{ requires: ["plugin"] } );

