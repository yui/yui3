// This file gets chained after others that already have var declarations
/*jshint onevar:false */
//var substitute = Y.Lang.sub,
//    Plugins = Y.Plugins || {},
//    arrMap = Y.Array.map;
/* jshint onevar:true*/

/**
 The row editor is basically an overlay whose body section overlaps the row being
 edited and is filled with the inline cell editors, with buttons added in the
 footer section and optionally a title.

 @class DataTable.RowEditor
 @extends Overlay
 */
Y.DataTable.RowEditor = Y.Base.create('roweditor', Y.Overlay, [],
    {
        /**
        Defines the template for BUTTON elements that are added to the Overlay
        via the [buttons](#attr_buttons) attribute.

        @property btnTemplate
        @type String
        @default See Code
        */
       // the `yui3-button` className is there to benefit from the CSSButton module.
        btnTemplate:    '<button class="yui3-button {classButton}">{label}</button>',

        /**
        Reference to the datatable whose editors this overlay is hosting.

        @property _dt
        @type Datatable
        @default null
        @private
         */
        _dt: null,

        /**
        Offset from the left edge of the element to be positioned to the left
        edge of this overlay.

        @property _offsetX
        @type Number
        @default 0
        @private
         */
        _offsetX: null,

        /**
        Offset from the top edge of the element to be positioned to the top
        edge of this overlay.

        @property _offsetY
        @type Number
        @default 0
        @private
         */
        _offsetY: null,
        
        /**
        Information passed on to the editor about what is being edited.
        It has properties:
    
        * tr: TR node for the row being edited
        * record: Model instance containing the data being edited  

        @property _rowInfo {Object} 
        @private
         */

        _rowInfo: null,

        /**
        Lifecycle method.  Sets the title and buttons.

        @method initializer
        @param config {Object} Initial configuration options coming from the
                [rowEditorOptions](DataTable.html#attr_rowEditorOptions)
                attribute plus a reference to the hosting datatable.
        @protected
         */
        initializer: function (config) {
            Y.log('RowEditor.initializer','info','RowEditor');
            this._subscr = [];
            var title = config.title;

            this._dt = config.dt;
            if (title) {
                this.set('headerContent', title);
            }
            this._createOverlayButtons(config.buttons);
            this.publish({
                /**
                Event fired when the row editor is displayed and becomes visible.
                @event show
                @param ev {EventFacade} Event Facade including:
                @param ev.tr {Node} The TR Node that will be edited
                @param ev.record {Model} Model instance of the record data for the edited row
                @param ev.focusOn {Node} Column whose cell had the focus or first editable column.
                */

                show: {
                    defaultFn: this._defShowFn
                },
                /**
                Event that is fired when the user has finished editing the View's cell contents

                @event save
                @param ev {Object} Event facade, including:
                @param ev.tr {Node} The TR Node that was edited
                @param ev.record {Model} Model instance of the record data for the edited row
                @param ev.values {Object} Hash of cell information indexed by column name or key, including:
                @param ev.values.td {Node} The TD Node that was edited
                @param ev.values.initialValue {Any} The original value of the underlying data for the cell
                @param ev.values.newValue {Any} Parsed value ready to be saved
                @param ev.values.recordKey {String} Key to the record field
                */
                save: {
                    defaultFn: this._defSaveFn
                },

                /**
                Fired when editing is cancelled (without saving) on this cell editor.

                @event cancel
                @param ev {Object}  Event facade, including:
                @param ev.tr {Node} The TR Node that was edited
                @param ev.record {Model} Model instance of the record data for the edited row
                */
                cancel: {
                    defaultFn: this._defCancelFn
                }
            });
        },
        /**
        Lifecycle method.  Detaches all subscriptions.
        
        @method destructor
        @protected
         */
        destructor: function () {
            arrEach(this._subscr, function (subscr) {
                if (subscr.detach) {
                    subscr.detach();
                }
            });
        },
        /**
        Shows the row editor.  It simply fires the [show](#event_show) event. 
        
        @method showEditor
        @param config {Object} Including:
        @param config.tr {Node} TR Node of the row to be edited.
        @param config.record {Model} Record to be edited.
        @param config.focusOn {Column Definition} Column that had the focus 
            when the editor was requested, or first column in the row
        @return False if the event was stopped.
        */
        showEditor: function (config) {

            return this.fire('show', config);
        },
        /**
        Default action for the [show](#event_show) event.
        
        @method _defShowFn
        @param ev {EventFacade} Including:
        @param ev.tr {Node} TR Node of the row to be edited.
        @param ev.record {Model} Record to be edited.
        @param ev.focusOn {Column Definition} Column that had the focus 
            when the editor was requested, or first column in the row
         */
        _defShowFn: function (ev) {
            var dt = this._dt,
                tr = ev.tr,
                colPrefix = '.' + dt.getClassName('col') + '-',
                record = ev.record,
                focusOn = ev.focusOn.name || ev.focusOn.key;

            this._rowInfo = {
                tr: tr,
                record: record
            };
            this.show();
            this._set('active', true);
            this._attach(tr);
            objEach(dt._columnEditors, function (editor, colName) {
                var recordKey = dt._columnMap[colName].key;
                if (focusOn === colName) {
                    focusOn = editor;
                }
                editor.showEditor({
                    colName: colName,
                    td: tr.one(colPrefix + colName),
                    recordKey: recordKey,
                    initialValue: record.get(recordKey),
                    record: record
                });
            }, this);
            if (focusOn._inputNode) {
                focusOn._inputNode.focus();
            }

        },

        /**
        Adds to the footer of the overlay the buttons entered
        as the [buttons](#attr_buttons) config property of the 
        [rowEditorOptions](DataTable.html#attr_rowEditorOptions)
        datatable attribute.
        Sets the click listener on them.

        @method _createOverlayButtons
        @param btnCfg {Array}  Array of button definition objects
        @private
        */
        _createOverlayButtons: function (btnCfg) {
            Y.log('RowEditor._createOverlayButtons','info','RowEditor');

            var strings = Y.DataTable.BaseCellEditor.localizedStrings,
                footer,
                buttons;
            if (btnCfg) {
                buttons = arrMap(btnCfg, function (btn) {

                    return substitute(this.btnTemplate,{
                        classButton: (btn.className || '')  + (btn.save ? ' yui3-button-primary' : ''),
                        label:       btn.label ||
                                    (btn.save ? strings.save :
                                    (btn.cancel ? strings.cancel : 'unknown label'))
                    });

                }, this);
                this.set('footerContent', buttons.join('\n'));
                footer = this.getStdModNode('footer', true);
                this._subscr.push(footer.delegate('click', this._afterButtonClick, 'button.yui3-button', this));
            }
        },

        /**
        Listener for clicks on the buttons defined in the [buttons](#attr_buttons) attribute.

        @method _afterButtonClick
        @param ev {EventFacade} Event facade for the click event
        @private
        */
        _afterButtonClick: function (ev) {
            Y.log('RowEditor._afterButtonClick','info','RowEditor');

            var btnCfg = null,
                action,
                rowInfo,
                values = {},
                dt = this._dt;

            if (ev.target.ancestor().get('children').some(function(button, index) {
                if (button === ev.target) {
                    btnCfg = this.get('buttons')[index];
                    return true;
                }
            }, this)) {
                if (btnCfg.save) {
                    this.saveEditor();
                    return;
                }
                if (btnCfg.cancel) {
                    this.cancelEditor();
                    return;
                }
                action = btnCfg.action;
                
                objEach(this._dt._columnEditors, function (editor, colName) {
                    var info = editor._cellInfo,
                        value = {
                            td: info.td,
                            initialValue: info.initialValue,
                            recordKey: info.recordKey,
                            value: editor._getValue()
                        };
                    values[colName] = value;
                });
                rowInfo = Y.merge(this._rowInfo, {values: values});
                
                switch (Lang.type(action)) {
                    case 'string':
                        if (dt[action]) {
                            dt[action].call(dt, btnCfg, rowInfo);
                        } else {
                            dt.fire(action, btnCfg, rowInfo);
                        }
                        break;
                    case 'function':
                        action.call(dt, btnCfg, rowInfo);
                        break;
                }
            }
        },
                
        /**
        Calls the (saveEditor)[DataTable.BaseCellEditor.html#method_saveEditor]
        to validate and parse each of the fields (quietly, without firing each
        cell `save` event) and if it passes all validations, it fires the
        [save](#event_save) to do the actual saving all at once.
                
        @method saveEditor
        @return {Boolean} True if all fields validated.        
        */
        saveEditor: function () {
            var success = true,
                values = {};
            objEach(this._dt._columnEditors, function (editor, colName) {
                var info = editor._cellInfo,
                    value = {
                        td: info.td,
                        initialValue: info.initialValue,
                        recordKey: info.recordKey
                    };
                success = success && editor.saveEditor(undefined, true);
                value.newValue= editor.get('value');
                values[colName] = value;
            });
            if (success) {
                this.fire('save',  Y.merge(this._rowInfo, {values: values}));
            }
            return success;
        },
                
        /**
        Default action for the [save](#event_save) event.  
        It simply hides the editor since the actual saving is done 
        [elsewhere}(DataTable.html#method__afterRowEditorSave).
        
        @method _defSaveFn
        @param ev {EventFacade} Event facade for the save event.
        @protected
        */
        _defSaveFn: function (/* ev */) {
            this._hideEditor();
        },
                
        /**
        Closes the editor. Fires the [cancel](#event_cancel) event.
        
        @method cancelEditor
        @return False if the event was stopped.
         */        
        cancelEditor: function () {
            return this.fire('cancel', this._rowInfo);
        },
                
        /**
        Default action for the [cancel](#event_cancel) event.  
        It simply hides the editor.
        
        @method _defCancelFn
        @param ev {EventFacade} Event facade for the cancel event.
        @protected
        */
        _defCancelFn: function (/* ev */) {
            this._hideEditor();
        },
                
        /**
        Does the actual hiding of the editor and the cell editors contained within.
        
        @method _hideEditor
        @private
         */
        _hideEditor: function () {
            objEach(this._dt._columnEditors, function (editor) {
                editor._hideEditor();
            });
            this._set('active',false);
            this.hide();
        },

        /**
        Resizes and moves the body section
        to fit on top of the row being edited.

        The default implementation reads the `region` the row occupies and
        calls [_resize](#method__resize) and [_move](#method__move).

        @method _attach
        @param tr {Node} row to attach this editor to
        @protected
        */
        _attach: function (tr) {
            Y.log('DataTable.RowEditor._attach', 'info', 'celleditor-base');
            if (this.get('visible')) {
                var region = tr.get('region');
                this._resize(region.width, region.height);
                this._move(region.left, region.top);
            }
        },

        /**
        Resizes the  body section to fit on top of the row being edited.

        @method _resize
        @param width {Number} width of the row being edited
        @param height {Number} height of the row being edited
        @protected
         */
        _resize: function (width, height) {
            Y.log('DataTable.RowEditor._resize [' + width + ':' + height + ']','info','celleditor-base');

            var node = this.getStdModNode('body',true);
            node.set('offsetWidth', width + 1);
            node.set('offsetHeight', height);
        },

        /**
        Moves the overlay so that the body section fits on top of the row being edited.

        @method _move
        @param left {Number} left edge of the row being edited.
        @param top {Number} top edge of the row being edited.
        @protected
         */
        _move: function (left, top) {
            Y.log('DataTable.RowEditor._move: [' + left + ':' + top + ']', 'info', 'celleditor-base');

            var offsetX = this._offsetX,
                bbxy, contentxy;
            if (offsetX === null) {
                bbxy = this.get('boundingBox').getXY();
                contentxy = this.getStdModNode('body',true).getXY();
                offsetX = this._offsetX = bbxy[0] - contentxy[0];
                this._offsetY = bbxy[1] - contentxy[1];
            }
            this.set('xy', [left + offsetX, top + this._offsetY]);
        }
    },
    {
        ATTRS: {
            /**
            Overrides the value of Overlay's `zIndex` attribute

            @attribute zIndex
            @type Integer
            @default 99
             */
            zIndex: {
                value: 97
            },

            /**
            Overrides the value of Overlay's `visible` attribute.

            @attribute visible
            @type Boolean
            @default false
             */
            visible: {
                value: false
            },
                    
            /**
            Array of buttons to be added to the footer of the overlay.
            Each entry is an object containing the configuration options for the buttons:

            <ul>
                <li>`label`: The label shown to the user.</li>
                <li>`className`: An optional css class name to assign to the button.</li>
                <li>`save`: A non-null value indicates this is the save button,
                    equivalent to pressing the `Enter` key.
                    It will be highlighted accordingly.
                    If no `label` was explicitly assigned,
                    'Save' or its localized equivalent will be shown</li>
                <li>`cancel`: A non-null value indicates this is cancel button,
                    equivalent to pressing the `Esc` key.</li>
                    If no `label` was explicitly assigned,
                    'Cancel' or its localized equivalent will be shown</li>
                <li>`action`: An action to be associated with this button.
                    No `action` is required for `save` or `cancel` buttons.</li>
            </ul>

            The `action` property can be a string or a function.
            If a function, it will be called when the button is clicked.  The function will
            receive the button configuration entry as its first argument and an object containing
            information about the cell being edited.
            If `action` is a string, an event will be fired using that string as its name.  The event
            can be listened to by subscribing from the datatable using
            <code>"roweditor:<i>&lt;action string&gt;</i>"</code> as the event type
            and it will receive the button configuration and the row info object.

            The row information object contains:
            <ul>
                <li>tr {Node} The TR Node being edited</li>
                <li>record {Model} Model instance of the record data for the edited row</li>
                <li>values {Object} Hash of cell information indexed by column name or key, including:<ul>
                    <li>td {Node} The TD Node that was edited</li>
                    <li>initialValue {Any} The original value of the underlying data for the cell</li>
                    <li>newValue {Any} Parsed value ready to be saved</li>
                    <li>recordKey {String} Key to the record field</li>
                </ul></li>
            </ul>

            @attribute buttons
            @type Array|null
            @default null
            */
                    
            buttons: {

            },
            /**
            Signals whether the editor is open and active, however it might not be
            [visible](#attr_visible) as it might have scrolled off the visible area
            of the datatable.

            @attribute active
            @type Boolean
            @default false
            @readOnly
            */
            active: {
                value:      false,
                readOnly:   true,
                validator:  Lang.isBoolean
            }
        }

    }
);
