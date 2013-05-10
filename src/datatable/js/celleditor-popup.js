/**
 Provides cell editors contained in an overlay that pops on top of the cell to be edited.
 @module datatable
 @submodule datatable-celleditor-popup
*/
/**
 Base implementation for all popup editors.
 Includes an editor with HTML inserted into an Overlay widget directly over the TD cell.
 Positioning, event management, creation/destruction and attribute changes are managed by this class.

 @class DataTable.BaseCellPopupEditor
 @extends DataTable.BaseCellEditor
 @author Todd Smith
 @since 3.8.0
 **/

var Editors = {},
    PEd =  Y.Base.create('celleditor', Y.DataTable.BaseCellEditor, [], {

    /**
    Defines the HTML content "template" for BUTTON elements that are added to the Overlay
    via the overlayButtons attribute.

    @property btnTemplate
    @type String
    @default See Code
    */
    btnTemplate:    '<button class="yui3-button {classButton}">{label}</button>',

    /**
    Placeholder property for the Overlay created by this class.

    @property overlay
    @type Widget
    @default null
    @private
    */
    _overlay:        null,

//--------------------  CSS class names  ---------------------------


    /**
    Creates this View's container, including instantiating the Overlay widget within
    the container, incorporating user-supplied overlay configs, creating buttons and
    creating the internal HTML content within the Overlay (using a Template-based
    method)

    @method _defRenderFn
    @return {Y.Overlay} Overlay instance for this View
    @private
    */
    _defRenderFn: function () {
       var overlay;

        //
        //  Create containing Overlay
        //
        overlay = this._createOverlay();

        //
        //  Add buttons in the Overlay footer section
        //  (we aren't using overlay, so have to add these manually ...)
        //
        if( this.get('buttons')) {
            this._createOverlayButtons(overlay);
        }

        overlay.set('bodyContent', Y.Lang.sub(this.get('template'), {classInput: this._classInput}));

        overlay.render(this.get('container'));

        this._overlay = overlay;

    },


    /**
    Detaches the listeners that were set on this view, any widgets that were created
    and on the View's Overlay instance.

    @method _unbindUI
    @private
    */
    _unbindUI: function () {

        PEd.superclass._unbindUI.apply(this, arguments);


        if(this._overlay) {
            this._overlay.destroy({remove:true});
            this._overlay = null;
        }

    },



//======================   PUBLIC METHODS   ===========================

    /**
    The default action for the `show` event which should make the editor visible.


    @method _defShowFn
    @protected
   */
    _defShowFn: function () {
        this._overlay.show();

        // clear up browser "selected" stuff
        this._clearDOMSelection();

        PEd.superclass._defShowFn.apply(this, arguments);

    },



//======================   PRIVATE METHODS   ===========================

    /**
    Method that creates the Editor's Overlay instance and populates the base content.

    @method _createOverlay
    @return {Y.Overlay}
    @private
    */
    _createOverlay: function () {
        var ocfg  = this.get('overlayConfig'),
            overlay;


        ocfg = Y.merge(ocfg, {
            bodyContent: ' ',
            zIndex:     99,
            visible:    false
        });

        overlay = new Y.Overlay(ocfg);

        if(Y.Plugin.Drag) {
            overlay.plug(Y.Plugin.Drag);
        }

        return overlay;
    },


    /**
    Creates a footer section within the Overlay and adds the buttons entered
    as the [buttons](#attr_buttons) config property of `editorConfig`
    column definition.
    Sets the listeners for the actions to be dispatched when clicked.

    @method _createOverlayButtons
    @param {Widget} overlay
    @private
    */
    _createOverlayButtons: function (overlay) {
        var buttons = Y.Array.map(this.get('buttons'), function (btn) {

                return Y.Lang.sub(this.btnTemplate,{
                    classButton: (btn.className || '')  + (btn.save ? ' yui3-button-primary' : ''),
                    label:       btn.label ||
                                (btn.save ? Y.DataTable.BaseCellEditor.localizedStrings.save :
                                (btn.cancel ? Y.DataTable.BaseCellEditor.localizedStrings.cancel : 'unknown label'))
                });

            }, this);
        if (buttons.length) {
            overlay.set('footerContent', buttons.join('\n'));
            this._subscr.push(this.get('container').delegate('click', this._afterButtonClick, 'button.yui3-button', this));
        }

    },
    /**
    Listener for clicks on the buttons defined in the [buttons](#attr_buttons) attribute.

    @method _afterButtonClick
    @param ev {EventFacade} Event facade for the click event
    @private
     */

    _afterButtonClick: function (ev) {
        var btnCfg = null,
            action;

        if (ev.target.ancestor().get('children').some(function(button, index) {
            if (button === ev.target) {
                btnCfg = this.get('buttons')[index];
                return true;
            }
        }, this)) {
            if (btnCfg.save) {
                this.saveEditor();
            }
            if (btnCfg.cancel) {
                this.cancelEditor();
            }
            action = btnCfg.action;
            switch (Y.Lang.type(action)) {
                case 'string':
                    this.fire(action, btnCfg, this._cellInfo);
                    break;
                case 'function':
                    action(btnCfg, this._cellInfo);
                    break;
            }
        }
    },


    /**
    Moves and resizes the editor container to fit on top of the cell being edited.
    It aligns the top-left corner of the pop up window to the cell and makes
    the input element the same size as the cell.  The frame of the pop up window
    as well as any [buttons](#attr_buttons) added will make the overall popup window
    cover neighboring cells.


    @method _attach
    @param td {Node} cell to attach this editor to
    @protected
    */
    _attach: function (td) {
         if (this.get('visible')) {
            var region = td.get('region');

            this._overlay.set('xy', [region.left, region.top]);
            this._resize(region.width, region.height);
         }
    },
    _resize: function (/* width, height */) {

    },

    /**
    Helper method to clear DOM "selected" text or ranges
    NOTE: could probably do this with CSS `user-select: none;`, but anyway ...

    @method _clearDOMSelection
    @private
    */
    _clearDOMSelection: function () {
        var sel = (Y.config.win.getSelection) ? Y.config.win.getSelection()
            : (Y.config.doc.selection) ? Y.config.doc.selection : null;

        if ( sel && sel.empty ) {
            sel.empty();
        }    // works on chrome

        if ( sel && sel.removeAllRanges ) {
            sel.removeAllRanges();
        }    // works on FireFox
    }

},{
    ATTRS:{

        /**
        Defines the template for the input element in the body of the popup window.

        @attribute template
        @type String
        @default '' (to be defined by the subclass)
        */
        template:{
            value: '-- none --',
            validator:  Y.Lang.isString
        },

        /**
        Additional config parameters for the Overlay to be used in constructing the Editor.
        These configs are merged with the defaults required by the Editor.

        @attribute overlayConfig
        @type Object
        @default {}
        */
        overlayConfig:{
            value:      {},
            validator:  Y.Lang.isObject
        },

        /**
        Array of buttons to be added to the popup window below the input element.
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
        <code>"celleditor:<i>&lt;action string&gt;</i>"</code> as the event type
        and it will receive the button configuration and the cell info object.

        The cell information object contains:
        <ul>
            <li>td {Node} Reference to the table cell.</li>
            <li>record {Model} Reference to the model containing the underlying data.</li>
            <li>colKey {String} Key of the column for the cell to be edited.</li>
            <li>initialValue {Any} The underlying value of the cell to be edited.</li>
        </ul>

        @attribute buttons
        @type Array|null
        @default null
        */
        buttons: {
            value: null
        }

    }
}),


//====================================================================================================================
//                   P O P U P    C E L L    E D I T O R    D E F I N I T I O N S
//====================================================================================================================


/**
Produces a basic textbox type popup cell editor.

##### Basic Usage

    // Column definition
    { key:'firstName', editor:"text"}

    // Column definition ... disabling inputKeys navigation and setting offsetXY
    { key:'firstName',
      editor:"text", editorConfig:{ inputKeys:false, offsetXY: [5,7] }
    }

@property text
@for DataTable.Editors
@type DataTable.BaseCellEditor
@since 3.8.0
@public
*/
// There is an open var declarationcoming from above.
PlainText = Y.Base.create('celleditor', PEd, [],
    {
        _inputNode: null,
        _defRenderFn: function () {
            PlainText.superclass._defRenderFn.apply(this, arguments);
            this._inputNode = this._overlay.get('contentBox').one('.' + this._classInput);
        },
        /**
        The default action for the `show` event which should make the editor visible.


        @method _defShowFn
        @param e {EventFacade}
        @protected
        */
        _defShowFn: function (e) {
            PlainText.superclass._defShowFn.apply(this, arguments);

            var input = this._inputNode;
            input.focus();
            input.set('value', e.formattedValue);
            input.select();
        },
        _resize: function (width, height) {
            this._inputNode.setAttrs({
                offsetWidth: width,
                offsetHeight: height
            });

        },

        /**
        Returns the raw value as entered into the editor.

        @method _getValue
        @return value {mixed} Value as entered in the editor
        @protected
         */
        _getValue: function () {
            Y.log('DataTable.BaseCellInlineEditor._getValue');
            return this._inputNode.get('value');
        }

    },
    {
        ATTRS: {
            template:{
                value: '<input type="text" class="{classInput}" />'
            },

            buttons: {
                value:[
                    {save: true},
                    {cancel: true}
                ]
            }
        }
    }
);
Editors.text = PlainText;
/**
Produces a "textarea"  popup  cell editor.

 ##### Basic Usage:

    // Column definition
    { key:'experience', editor:"textarea"}

    // Column definition ... disabling inputKeys navigation and setting offsetXY
    {
        key:'firstName',
        editor:"JobDescription",
        editorConfig:{
             // disables the buttons below the TEXTAREA
             overlayConfig:{ buttons: null }
        }
    }


@property textarea
@for DataTable.Editors
@type DataTable.BaseCellEditor
@since 3.8.0
@public
*/
Editors.textarea = Y.Base.create('celleditor', PlainText, [],
    {},
    {
        ATTRS: {
            template:{
                value: '<textarea class="{classInput}"></textarea>'
            },

            saveOnEnterKey: {
                value:false
            },

            buttons: {
                value:[
                    {save: true},
                    {cancel: true}
                ]
            }
        }
    }
);


/**
Produces  a basic numeric editor as a popup-type cell editor.
 A `parser` is prescribed that handles validation and converting the input text to numeric format.

 ##### Basic Usage
    // Column definition
    { key:'salary', editor:"number" }

    // Column definition ... disabling keyfiltering and setting a CSS class
    {
        key:'firstName',
        editor:"text",
        editorConfig:{ className:'align-right', keyFiltering:null }
    }


@property number
@for DataTable.Editors
@type DataTable.BaseCellEditor
@since 3.8.0
@public
*/
Editors.number = Y.Base.create('celleditor', PlainText, [],
    {},
    {
        ATTRS: {

            /**
            A validation regular expression object used to check validity of the input floating point number.
            This can be defined by the user to accept other numeric input, or set to "null" to disable regex checks.

            It assumes the dot to be the decimal separator.

            @attribute validator
            @type RegExp
            @default /^\s*(\+|-)?((\d+(\.\d+)?)|(\.\d+))\s*$/
            */
            validator: {
                value:  /^\s*(\+|-)?((\d+(\.\d+)?)|(\.\d+))\s*$/
            },

            keyFiltering: {
                value:   /^(\.|\d|\-)*$/
            },

            parser: {
                value: function(value){
                    return +value;
                }
            }
        }
    }
);


/**
 Produces a bare-bones date editor as a popup-type cell editor.
 Configuration is setup with both `formatter` and `parser` to convert the Date object.

 ##### Basic Usage

    // Column definition
    { key:'firstName', editor:"date"}

    // Column definition ... with user-defined dateFormat and disabling keyfiltering
    {
        key:'firstName',
        editor:"text",
        editorConfig:{ dateFormat: '%Y-%m-%d', keyFiltering:null }
    }


@property date
@for DataTable.Editors
@type DataTable.BaseCellEditor
@since 3.8.0
@public
*/
Editors.date = Y.Base.create('celleditor', PlainText, [],
    {},
    {
        ATTRS: {
            // only allow keyboard input of digits or '/' or '-' within the editor ...
            keyFiltering: {
                value:   /^(\/|\d|\-)*$/
            },

            // Function to call prior to displaying editor, to put a human-readable Date into
            //  the INPUT box initially ...
            formatter: {
                value: function (value) {
                    return (
                        Y.DataType.Date ?
                        Y.DataType.Date.format(value, this.get('dateFormat') || "%x") :
                        value.toString()
                    );
                }
            },

            // Function to call after Date editing is complete, prior to saving to DataTable ...
            //  i.e. converts back to "Date" format that DT expects ...
            parser: {
                value: function(value){
                    return (
                        Y.DataType.Date ?
                        Y.DataType.Date.parse(value, this.get('dateFormat') || "%x") :
                        Date.parse(value)
                    ) || Y.Attribute.INVALID_VALUE;
                }
            }
        }
    }
);


/**
 Produces a "calendar" popup cell editor that
 includes a Y.Calendar widget incorporated within the View container.

 ##### Basic Usage

    // Column definition
    { key:'startDate', editor:"calendar" }

    // Column definition ...
    {
        key:'birthdate',
        label:'Employee DOB',
        formatter:"shortDate",
        editor:"calendar",
        editorConfig:{
            inputKeys:false,
        }
    }


@property calendar
@for DataTable.Editors
@type DataTable.BaseCellEditor
@since 3.8.0
@public
*/
Editors.calendar = Y.Base.create('celleditor', PlainText, [],
    {
        _defRenderFn: function () {
            Editors.calendar.superclass._defRenderFn.apply(this, arguments);
            var calNode = this.get('container').one('.yui3-dt-editor-calendar'),
                calendar;

                // Define a basic config object for Y.Calendar ...

            if (calNode && Y.Calendar) {
                calendar = new Y.Calendar(
                        Y.merge(
                            {
                                contentBox: calNode,
                                height: '215px',
                                width:  '200px',
                                showPrevMonth: true,
                                showNextMonth: true
                            },
                            this.get('calendarConfig')
                        )
                ).render();

                // Attach a plugin to the Widget instance, if it is available
                if(Y.Plugin.Calendar && Y.Plugin.Calendar.JumpNav) {
                    this.plug( Y.Plugin.Calendar.JumpNav, {
                        yearStart: 1988, yearEnd:   2021
                    });
                }
                this._subscr.push(calendar.on("dateClick", function (ev) {

                      var value = ev.date;
                      this._inputNode.set('value',
                            Y.DataType.Date ?
                            Y.DataType.Date.format(value, this.get('dateFormat') || "%x") :
                            value.toString()
                      );
                      if (this.get('saveOnSelectDate')) {
                          this.saveEditor();
                      }
                }, this));

                this._calendar = calendar;

            }
        },
        destructor: function () {
            if(this._calendar) {
                this._calendar.destroy({remove:true});
            }

        },
        _defShowFn: function (ev) {
            Editors.calendar.superclass._defShowFn.apply(this, arguments);
            var cal = this._calendar;
            if (cal) {
                cal.set('date', ev.initialValue);
                cal.selectDates(ev.initialValue);
            }
        }

    },
    {
        ATTRS: {
            template: {
                value:'<input type="text" class="{classInput}"  />'
                        + '<br/><div class="yui3-dt-editor-calendar"></div>'
            },

            // setup two buttons "Save" and "Cancel" for the containing overlay
            buttons: {
                value:[
                    {save: true},
                    {cancel: true}
                ]
            },


            // only allow keyboard input of digits or '/' or '-' within the editor ...
            keyFiltering: {
                value:   /^(\/|\d|\-)*$/
            },

            // Function to call prior to displaying editor, to put a human-readable Date into
            //  the INPUT box initially ...
            formatter: {
                value: function (value) {
                    return (
                        Y.DataType.Date ?
                        Y.DataType.Date.format(value, this.get('dateFormat') || "%x") :
                        value.toString()
                    );
                }
            },

            // Function to call after Date editing is complete, prior to saving to DataTable ...
            //  i.e. converts back to "Date" format that DT expects ...
            parser: {
                value: function(value){
                    return (
                        Y.DataType.Date ?
                        Y.DataType.Date.parse(value, this.get('dateFormat') || "%x") :
                        Date.parse(value)
                    ) || Y.Attribute.INVALID_VALUE;
                }
            },
            calendarConfig: {
                value: {}   // I know, it will point to the same static copy, but then, what's wrong with that?
            },
            saveOnSelectDate: {
                value: true,
                validator: Y.Lang.isBoolean
            }
        }
    }
);
/**
Produces a textbox-type popup cell editor that has an Autocomplete
plugin attached to the INPUT[text] node.

 ##### Basic Usage

    // Column definition
    {
        key:'state',
        editor:"autocomplete",
        editorConfig:{
            autocompleteConfig:{
                source:  myStateArray,
                alwaysShowList: true
            }
        }
    }


@property autocomplete
@for DataTable.Editors
@type DataTable.BaseCellEditor
@since 3.8.0
@public
*/
Editors.autocomplete = Y.Base.create('celleditor', PlainText, [],
    {

        //---------
        //  After the cell editor View is instantiated,
        //    get the INPUT node and plugin the AutoComplete to it
        //---------
        _defRenderFn: function () {
            Editors.autocomplete.superclass._defRenderFn.apply(this, arguments);
            var inputNode = this._inputNode;

            if(inputNode && Y.Plugin.AutoComplete) {

               inputNode.plug(Y.Plugin.AutoComplete,
                    Y.merge({
                        resultTextLocator:'text',
                        alwaysShowList: true,
                        resultHighlighter: 'startsWith',
                        render: true
                    }, this.get('autocompleteConfig'))
                );
               //
               inputNode.ac.after('select', function (e) {
                   this.saveEditor(e.result.raw.value);
               }, this);
            }

        }
    },
    {
        ATTRS: {
            autocompleteConfig: {
                value: null
            }
        }
    }
);

/**
Produces a group of INPUT[type=radio] controls within the view's Overlay

 ##### Basic Usage

    // Column definition via Array options
    {
        key:"size",
        editor:"radio",
        editorConfig:{
            radioOptions:[ {value:0, text:"S"}, {value:1, text:"M"}, {value:2, text:"L"} ]
        }
    }
    // Column definition via Object type options
    {
        key:"size",
        editor:"radio",
        editorConfig:{
            radioOptions:{ S:"Small", M:"Medium", L:"Large" }
        }
    }


@property radio
@for DataTable.Editors
@type DataTable.BaseCellEditor
 @since 3.8.0
 @public
 **/
Editors.radio = Y.Base.create('celleditor', PEd, [],
    {
        _defRenderFn:function () {
            Editors.radio.superclass._defRenderFn.apply(this, arguments);
            var tmpl = this.get('template').replace('{name}', Y.guid()),
                ov = this._overlay,
                radios = Y.Array.map(this.get('radioOptions'), function (item) {
                    return Y.Lang.sub(tmpl, item);
                }, this);

            ov.set('bodyContent', radios.join('\n'));

            this._subscr.push(
                ov.get('contentBox').delegate('click', function (e) {
                    var value = e.target.get('value');

                    if (Y.Lang.isValue(value)) {
                        this.saveEditor(value);
                    }
                }, 'input[type="radio"]', this)
            );

        },
        _defShowFn:function(e){
            Editors.radio.superclass._defShowFn.apply(this, arguments);
            var radio  = this._overlay.get('contentBox').one('input[type="radio"][value="' + e.initialValue + '"]');
            if (radio) {

                radio.set('checked', true);
                radio.focus();
            }
        }

    },
    {
        ATTRS: {
            template: {
                value: '<div class="yui3-datatable-celleditor-radio"><input type="radio" name="{name}" value="{value}"/>{text}</div>'
            },
            radioOptions: {
                value: null
            }
        }
    }
);


/**
 Produces a popup cell editor containing a single SELECT control within
 the Overlay.

 ##### Basic Usage
// Column definition ... simple Array data
{
    key:"inTheForest",
    editor:"dropdown",
    editorConfig: { dropdownOptions:[ "lions", "tigers", "bears", "oh my!" ] }
}

// Column definition ... options via Object type data
{
    key:"color",
    formatter:"custom",
    formatConfig:stypesObj,
    editor:"select",
    editorConfig:{
        selectOptions:{ 0:'Red', 1:'Green', 2:'Fuschia', 3:'Blue' }
    }
}

// Column definition ... options via Array of Objects, non-trivial!
{
    key:"firstTopping",
    editor:"dropdown",
    editorConfig:{
        dropdownOptions:[
           {controlUnit:'a7',  descr:'Pepperoni'},    {controlUnit:'f3', descr:'Anchovies'},
           {controlUnit:'b114',descr:'Extra Cheese'}, {controlUnit:'7', descr:'Mushrooms'}
        ],
        template:{ propValue:'controlUnit', propText:'descr' }
    }
}


@property dropdown
@for DataTable.Editors
@type DataTable.BaseCellEditor
 @since 3.8.0
 @public
 **/
Editors.dropdown = Y.Base.create('celleditor', PEd, [],
    {
        _dropdownNode: null,
        _defRenderFn:function () {
            Editors.dropdown.superclass._defRenderFn.apply(this, arguments);
            var tmpl = this.get('optionTemplate'),
                ov = this._overlay,
                dropdown,
                options = Y.Array.map(this.get('dropdownOptions'), function (item) {
                    return Y.Lang.sub(tmpl, item);
                }, this);

            ov.set('bodyContent', Y.Lang.sub(this.get('template'), {
                options: options.join('\n'),
                classInput: this._classInput
            }));
            this._dropdownNode = dropdown = ov.get('contentBox').one('.' + this._classInput);
            this._subscr.push(
                dropdown.on('change', function (e) {
                    var value = e.target.get('value');

                    if (Y.Lang.isValue(value)) {
                        this.saveEditor(value);
                    }
                },  this)
            );

        },
        _defShowFn:function(e){
            Editors.dropdown.superclass._defShowFn.apply(this, arguments);
            this._dropdownNode.set('value',  e.initialValue ).focus();
        }

    },
    {
        ATTRS: {
            template: {
                value: '<select class="{classInput}">{options}</select>'
            },
            optionTemplate: {
                value: '<option value="{value}">{text}</option>'
            },
            dropdownOptions: {
                value: null
            },
            buttons: {
                value: [
                    {cancel:true}
                ]
            }
        }
    }
);

Y.DataTable.Editors.select = Y.DataTable.Editors.dropdown;
Y.DataTable.Editors.combobox = Y.DataTable.Editors.dropdown;


/**
Produces a simple checkbox (i.e. on/off, yes/no, true/false) popup cell editor
 within the popup Overlay.

 ##### Basic Usage
    // Column definition
    {
        key:'arrived',
        editor:"checkbox",
        editorConfig:{ checkboxHash:{ 'true':'Y', 'false':'N' } }
    }


@property checkbox
@for DataTable.Editors
@type DataTable.BaseCellEditor
 @since 3.8.0
 @public
 **/
Editors.checkbox = Y.Base.create('celleditor', PEd, [],
    {
        _checkbox: null,
        _defRenderFn: function () {
            Editors.checkbox.superclass._defRenderFn.apply(this, arguments);

            var ov = this._overlay,
                checkbox;
            ov.set('bodyContent', Y.Lang.sub(this.get('template'), { classInput: this._classInput}));

            this._checkbox = checkbox = ov.get('contentBox').one('.' + this._classInput);

            this._subscr.push(
                checkbox.on('click',function () {
                    this.saveEditor(!!checkbox.get('checked'));
                }, this)
            );
        },

            //---------
            // After this editor is displayed,
            //   update the "checked" status based on the underlying o.value
            //---------
         _defShowFn: function (e) {
            Editors.checkbox.superclass._defShowFn.apply(this, arguments);
            this._checkbox.set('checked', e.formattedValue);
        },
        _resize: function (width) {
            this._overlay.set('width', width);
        }
    },
    {
        ATTRS: {
            template: {
                value:'<input type="checkbox" class="{classInput}" />'
            },
            formatter: {
                value: function (value) {
                    var opts = this.get('checkboxOptions');
                    if (opts) {
                        return !!opts.indexOf(value);
                    }
                    return value;
                }
            },
            parser: {
                value: function (value) {
                    var opts = this.get('checkboxOptions');
                    if (opts) {
                        return opts[value ? 1 : 0];
                    }
                    return value;
                }
            },
            checkboxOptions: {
                value: null
            },
            buttons: {
                value: [
                    {cancel:true}
                ]
            }
        }

    // Define listeners to this View instance ...
    }
);
Y.DataTable.BaseCellPopupEditor = PEd;
Y.mix(Y.DataTable.Editors, Editors);