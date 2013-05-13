/**
 Provides cell editors contained in an overlay that pops on top of the cell to be edited.

 @module datatable
 @submodule datatable-celleditor-popup
*/
/**
 Base implementation for all popup editors.
 It creates an `Overlay` instance containing the editing element,
 allowing for more complex types of editors that would not fit inline.

 @class DataTable.BaseCellPopupEditor
 @extends DataTable.BaseCellEditor
 **/

var arrMap = Y.Array.map,
    Lang = Y.Lang,
    substitute = Lang.sub,
    YDate = Y.Date,
    YNumber = Y.Number,
    Plugins = Y.Plugin,
    baseCreate = Y.Base.create,

    Editors = {},
    PEd =  baseCreate('celleditor', Y.DataTable.BaseCellEditor, [], {

    /**
    Defines the HTML content "template" for BUTTON elements that are added to the Overlay
    via the [buttons](#attr_buttons) attribute.

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
    Creates the Overlay widget within
    the container, incorporating user-supplied overlay configs, creating buttons and
    creating the internal HTML content within the Overlay from the [template](#attr_template)
    attribute.

    @method _defRenderFn
    @protected
    */
    _defRenderFn: function () {
        Y.log('BaseCellPopupEditor._defRenderFn','info','celleditor-popup');

       var overlay = this._createOverlay();


        overlay.set('bodyContent', substitute(this.get('template'), {classInput: this._classInput}));

        overlay.render(this.get('container'));

        if( this.get('buttons')) {
            this._createOverlayButtons(overlay);
        }

        this._overlay = overlay;

    },


    /**
    Detaches the event listeners and destroys the overlay.

    @method _unbindUI
    @private
    */
    _unbindUI: function () {
        Y.log('BaseCellPopupEditor._unbindUI','info','celleditor-popup');

        PEd.superclass._unbindUI.apply(this, arguments);


        if(this._overlay) {
            this._overlay.destroy({remove:true});
            this._overlay = null;
        }

    },


    /**
    The default action for the [show](#event_show) event which should make the editor visible.


    @method _defShowFn
    @protected
   */
    _defShowFn: function () {
        Y.log('BaseCellPopupEditor._defShowFn','info','celleditor-popup');

        this._overlay.show();

        // clear up browser "selected" stuff
        this._clearDOMSelection();

        PEd.superclass._defShowFn.apply(this, arguments);

    },

    /**
    Method that creates the Editor's Overlay instance and attaches the
    drag plugin, if available.

    @method _createOverlay
    @return {Overlay}
    @private
    */
    _createOverlay: function () {
        Y.log('BaseCellPopupEditor._createOverlay','info','celleditor-popup');

        var ocfg  = this.get('overlayConfig'),
            overlay;


        ocfg = Y.merge(ocfg, {
            bodyContent: ' ',
            zIndex:     99,
            visible:    false
        });

        overlay = new Y.Overlay(ocfg);

        if(Plugins.Drag) {
            overlay.plug(Plugins.Drag);
        }

        return overlay;
    },


    /**
    Adds to the footer of the overlay the buttons entered
    as the [buttons](#attr_buttons) config property of `editorConfig`
    column definition.
    Sets the click listener on them.

    @method _createOverlayButtons
    @param {Widget} overlay
    @private
    */
    _createOverlayButtons: function (overlay) {
        Y.log('BaseCellPopupEditor._createOverlayButtons','info','celleditor-popup');

        var strings = Y.DataTable.BaseCellEditor.localizedStrings,
            buttons = arrMap(this.get('buttons'), function (btn) {

                return substitute(this.btnTemplate,{
                    classButton: (btn.className || '')  + (btn.save ? ' yui3-button-primary' : ''),
                    label:       btn.label ||
                                (btn.save ? strings.save :
                                (btn.cancel ? strings.cancel : 'unknown label'))
                });

            }, this);
        if (buttons.length) {
            overlay.set('footerContent', buttons.join('\n'));
            this._subscr.push(overlay.getStdModNode('footer').delegate('click', this._afterButtonClick, 'button.yui3-button', this));
        }

    },
    /**
    Listener for clicks on the buttons defined in the [buttons](#attr_buttons) attribute.

    @method _afterButtonClick
    @param ev {EventFacade} Event facade for the click event
    @private
    */

    _afterButtonClick: function (ev) {
        Y.log('BaseCellPopupEditor._afterButtonClick','info','celleditor-popup');

        var btnCfg = null,
            action,
            cellInfo;

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
            cellInfo = Y.merge(this._cellInfo, {value: this._getValue()});
            switch (Lang.type(action)) {
                case 'string':
                    this.fire(action, btnCfg, cellInfo);
                    break;
                case 'function':
                    action(btnCfg, cellInfo);
                    break;
            }
        }
    },


    /**
    Moves and resizes the editor container to fit on top of the cell being edited.
    It aligns the top-left corner of the pop up window to the cell.
    Since the input elements available for the popup editors are more varied, the
    resizing function is broken apart to the [_resize](#method__resize) method.


    @method _attach
    @param td {Node} cell to attach this editor to
    @protected
    */
    _attach: function (td) {
        Y.log('BaseCellPopupEditor._attach','info','celleditor-popup');

         if (this.get('visible')) {
            var region = td.get('region');

            this._overlay.set('xy', [region.left, region.top]);
            this._resize(region.width, region.height);
         }
    },

    /**
    Resizes the editor based on the size of the cell being edited.

    Must be overriden by the individual editors

    @method _resize
    @param width {Integer}  Width of the cell
    @param height {Integer}  Height of the cell
    @protected
     */
    _resize: function (/* width, height */) {
        Y.log('BaseCellPopupEditor._resize should have been overriden','warn','celleditor-popup');

    },

    /**
    Helper method to clear DOM "selected" text or ranges
    NOTE: could probably do this with CSS `user-select: none;`, but anyway ...

    @method _clearDOMSelection
    @private
    */
    _clearDOMSelection: function () {
        Y.log('BaseCellPopupEditor._clearDOMSelection','info','celleditor-popup');

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
    ATTRS: {

        /**
        Defines the template for the input element in the body of the popup window.

        @attribute template
        @type String
        @default '' (to be defined by the subclass)
        */
        template:{
            value: '-- none --',
            validator:  Lang.isString
        },

        /**
        Additional config parameters for the Overlay to be used in constructing the Editor.
        These configs are merged with the defaults required by the Editor.

        The following would add a text to the header of the popup editor,
        which is otherwise unused by this module.

            {
                key: 'name',
                editor: 'text',
                editorConfig: {
                    overlayConfig: {
                        headerContent: 'Enter name of applicant'
                    }
                }
            }

        @attribute overlayConfig
        @type Object
        @default {}
        */
        overlayConfig:{
            value:      {},
            validator:  Lang.isObject
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
            <li>value {Any} The value from the input element or widget.
                Usually a string, it might be other types for complex widgets such as Calendar.</li>
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

@example
    // Column definition
    { key: 'firstName', editor: "text"}

    // Column definition ... disabling the Save and Cancel buttons
    { key: 'firstName',
        editor: "text", editorConfig: { buttons: null }
    }

For a complete list of configuration attributes, see the
[DataTable.BaseCellPopupEditor](DataTable.BaseCellPopupEditor.html) class.

@property text
@for DataTable.Editors
@type DataTable.BaseCellEditor
@public
*/
// There is an open var declarationcoming from above.
PlainText = baseCreate('celleditor', PEd, [],
    {
        _inputNode: null,

        _defRenderFn: function () {
            Y.log('Editors.text._defRenderFn','info','celleditor-popup');

            PlainText.superclass._defRenderFn.apply(this, arguments);
            this._inputNode = this._overlay.get('contentBox').one('.' + this._classInput);
        },

        _defShowFn: function (e) {
            Y.log('Editors.text._defShowFn','info','celleditor-popup');

            PlainText.superclass._defShowFn.apply(this, arguments);

            var input = this._inputNode;
            input.focus();
            input.set('value', e.formattedValue);
            input.select();
        },

        _resize: function (width, height) {
            Y.log('Editors.text._resize [' + width + ':' + height + ']','info','celleditor-popup');

            this._inputNode.setAttrs({
                offsetWidth: width,
                offsetHeight: height
            });

        },

        _getValue: function () {
            Y.log('Editors.text._getValue','info','celleditor-popup');

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

@example
    // Column definition
    { key:'experience', editor:"textarea"}

    {
        key:'experience',
        editor:"textarea",
        editorConfig:{
             // redefines the buttons to just the Cancel button (drops Save)
             buttons: [{save:true}],
             overlayConfig: {
                headerContent: 'Enter experience'
             }
        }
    }

For a complete list of configuration attributes, see the
[DataTable.BaseCellPopupEditor](DataTable.BaseCellPopupEditor.html) class.


@property textarea
@for DataTable.Editors
@type DataTable.BaseCellEditor
@public
*/
Editors.textarea = baseCreate('celleditor', PlainText, [],
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
It requires the `datatype-number` module to perform the validation,
otherwise it uses `parseFloat` for parsing and regular typecasting to show.

@example
    // Column definition
    { key:'salary', editor:"number" }

    // Column definition ... to use a comma as the decimal separator
    {
        key:'unit_price',
        editor:"number",
        editorConfig: {
            numberFormat: {
                decimalSeparator: ','
            }
        }
    }

For a complete list of configuration attributes, see the
[DataTable.BaseCellPopupEditor](DataTable.BaseCellPopupEditor.html) class.

@property number
@for DataTable.Editors
@type DataTable.BaseCellEditor
@public
*/
Editors.number = baseCreate('celleditor', PlainText, [],
    {},
    {
        ATTRS: {
            /**
            Format specification used both when showing the value in the
            [number](DataTable.Editors.html#property_number) editor and
            when parsing the entered value.
            See [Number.format](Number.html#method_format) for details.

            ##### Used only in the [number](DataTable.Editors.html#property_number) editor.

            @attribute numberFormat
            @type Object
            @default null
            @for DataTable.BaseCellPopupEditor
             */

            numberFormat: {
                value: null
            },
            keyFiltering:   {
                    value : /^(\.\,|\d|\-)*$/
            },

            formatter: {
                value: function (value) {
                    Y.log('number.formatter: ' + v,'info','celleditor-popup');

                    var fmt = this.get('numberFormat');
                    if (fmt && YNumber) {
                        return YNumber.format(value, fmt);
                    }
                    return value;
                }
            },
            parser: {
                value: function (value) {
                    Y.log('number.parser: ' + value,'info','celleditor-popup');

                    var fmt = this.get('numberFormat');
                    if (fmt && YNumber) {
                        value = YNumber.parse(value, fmt);
                    } else {
                        value = parseFloat(value);
                    }
                    return (Lang.isValue(value) ? value : Y.Attribute.INVALID_VALUE);
                }
            }
        }
    }
);


/**
Produces a bare-bones text input for dates.
Configuration is setup with both `formatter` and `parser` to convert the Date object.
It requires the `datatype-date` module to perform the validation,
otherwise it will use the native JavaScript functions `toString()` and `Date.parse()`.
The default date format is `"%x"` which is the prefered date format for the current locale.

@example
    // Column definition
    { key:'firstName', editor:"date"}

    // Column definition with user-specified 'dateFormat' to display Date in text box on display
    {
        key:'date_of_claim',
        editor:"date",
        editorConfig:{ dateFormat:'%Y-%m-%d'}
    }

For a complete list of configuration attributes, see the
[DataTable.BaseCellPopupEditor](DataTable.BaseCellPopupEditor.html) class.

@property date
@for DataTable.Editors
@type DataTable.BaseCellEditor
@public
*/
Editors.date = baseCreate('celleditor', PlainText, [],
    {},
    {
        ATTRS: {
            /**
            Format specification used both to display the date in the
            [date](DataTable.Editors.html#property_date) editor
            and to parse it back.
            See [Date.format](Date.html#method_format) for details.

            ##### Used only in the following editors:<ul>
            <li>[date](DataTable.Editors.html#property_date)</li>
            <li>[calendar](DataTable.Editors.html#property_date)</li>
            </ul>

            @attribute dateFormat
            @type String
            @default "%x"  (prefered local format)
            @for DataTable.BaseCellPopupEditor
             */
            dateFormat: {
                value:"%x"
            },
            // only allow keyboard input of digits or '/' or '-' within the editor ...
            keyFiltering: {
                value:   /^(\/|\d|\-)*$/
            },

            // Function to call prior to displaying editor, to put a human-readable Date into
            //  the INPUT box initially ...
            formatter: {
                value: function (value) {
                    Y.log('Editors.date.formatter: ' + value,'info','celleditor-popup');

                    return (
                        YDate ?
                        YDate.format(value, this.get('dateFormat')) :
                        value.toString()
                    );
                }
            },

            // Function to call after Date editing is complete, prior to saving to DataTable ...
            //  i.e. converts back to "Date" format that DT expects ...
            parser: {
                value: function(value){
                    Y.log('Editors.date.parser: ' + value,'info','celleditor-popup');

                    return (
                        YDate ?
                        YDate.parse(value, this.get('dateFormat')) :
                        Date.parse(value)
                    ) || Y.Attribute.INVALID_VALUE;
                }
            }
        }
    }
);


/**
Produces a "calendar" popup cell editor that
includes a Y.Calendar widget plus a regular textbox for pasting or typing in
the date.

@example
    // Column definition
    { key:'startDate', editor:"calendar" }

    // Column definition ...
    {
        key:'birthdate',
        label:'Employee DOB',
        formatter:"localDate",
        editor:"calendar",
        editorConfig:{ dateFormat:'%Y/%m/%d'}
    }

For a complete list of configuration attributes, see the
[DataTable.BaseCellPopupEditor](DataTable.BaseCellPopupEditor.html) class.

@property calendar
@for DataTable.Editors
@type DataTable.BaseCellEditor
@public
*/
Editors.calendar = baseCreate('celleditor', Editors.date, [],
    {
        _defRenderFn: function () {
            Y.log('Editors.calendar._defRenderFn','info','celleditor-popup');

            Editors.calendar.superclass._defRenderFn.apply(this, arguments);
            var calNode = this.get('container').one('.yui3-datatable-celleditor-calendar'),
                calendar;


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
                            this.get('calendarConfig') || {}
                        )
                ).render();

                if(Plugins.Calendar && Plugins.Calendar.JumpNav) {
                    this.plug( Plugins.Calendar.JumpNav, {
                        yearStart: 1988, yearEnd:   2021
                    });
                }
                this._subscr.push(calendar.on("dateClick", this._afterCalendarClick, this));

                this._calendar = calendar;

            }
        },
        _afterCalendarClick:function (ev) {
            Y.log('Editors.calendar._afterCalendarClick','info','celleditor-popup');

              var value = ev.date;
              this._inputNode.set('value',
                    YDate ?
                    YDate.format(value, this.get('dateFormat') || "%x") :
                    value.toString()
              );
              if (this.get('saveOnSelectDate')) {
                  this.saveEditor();
              }
        },
        destructor: function () {
            Y.log('Editors.calendar.destructor','info','celleditor-popup');

            if(this._calendar) {
                this._calendar.destroy({remove:true});
            }

        },
        _defShowFn: function (ev) {
            Y.log('Editors.calendar._defShowFn','info','celleditor-popup');

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
                        + '<br/><div class="yui3-datatable-celleditor-calendar"></div>'
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
                    Y.log('Editors.calendar.formatter: ' + value,'info','celleditor-popup');

                    return (
                        YDate ?
                        YDate.format(value, this.get('dateFormat') || "%x") :
                        value.toString()
                    );
                }
            },

            // Function to call after Date editing is complete, prior to saving to DataTable ...
            //  i.e. converts back to "Date" format that DT expects ...
            parser: {
                value: function(value){
                    Y.log('Editors.calendar.parser: ' + value,'info','celleditor-popup');

                    return (
                        YDate ?
                        YDate.parse(value, this.get('dateFormat') || "%x") :
                        Date.parse(value)
                    ) || Y.Attribute.INVALID_VALUE;
                }
            },

            /**
            Additional configuration attributes for the Calendar widget,
            used in the [calendar](DataTable.Editors.html#property_calendar)
            editor to be merged along the defaults this editor needs.

            ##### Used only in the [calendar](DataTable.Editors.html#property_calendar) editor.

            @attribute calendarConfig
            @type Object
            @default null
            @for DataTable.BaseCellPopupEditor
             */
            calendarConfig: {
                value: null
            },

            /**
            If true, clicking on a date in the calendar will automatically save
            that date.

            ##### Used only in the [calendar](DataTable.Editors.html#property_calendar) editor.

            @attribute saveOnSelectDate
            @type Boolean
            @default true
            @for DataTable.BaseCellPopupEditor
             */
            saveOnSelectDate: {
                value: true,
                validator: Lang.isBoolean
            }
        }
    }
);
/**
Produces a textbox-type popup cell editor that has an Autocomplete
plugin attached to the INPUT[text] node.

@example
    {
        key: 'degreeProgram',
        editor: "autocomplete",
        editorConfig: {
            lookupTable: [
                {value: 1, text: "Bachelor of Science"},
                {value: 2, text: "Master of Science"},
                {value: 3, text: "PhD"}
             ]
        }
    }

Since the column is likely to use a compatible formatter and the same lookup table
to show the information, if there is a `lookupTable` column property set, the
editor will use it.

    {
        key: 'degreeProgram',
        formatter: "lookup",
        lookupTable: [
            {value: 1, text: "Bachelor of Science"},
            {value: 2, text: "Master of Science"},
            {value: 3, text: "PhD"}
        ],
        editor: "autocomplete"
    }

Both the formatter and the editor will use the same translation table.
The [lookup](DataTable.BodyView.Formatters.html#method_lookup)
formatter accepts two formats for the lookupTable, an object map
and an array of value/text sets, as shown above.
Only the latter is valid for this editor.

Additional configuration attributes for the AutoComplete widget can be passed
through the `autocompleteConfig` property:

    {
        key: 'degreeProgram',
        formatter: "lookup",
        lookupTable: [
            {value: 1, text: "Bachelor of Science"},
            {value: 2, text: "Master of Science"},
            {value: 3, text: "PhD"}
        ],
        editor: "autocomplete",
        editorConfig: {
            autocompleteConfig: {
                resultHighlighter: 'phraseMatch'
            }
        }
    }


For a complete list of configuration attributes, see the
[DataTable.BaseCellPopupEditor](DataTable.BaseCellPopupEditor.html) class.

@property autocomplete
@for DataTable.Editors
@type DataTable.BaseCellEditor
@public
*/
Editors.autocomplete = baseCreate('celleditor', PlainText, [],
    {

        //---------
        //  After the cell editor View is instantiated,
        //    get the INPUT node and plugin the AutoComplete to it
        //---------
        _defRenderFn: function () {
            Y.log('Editors.autocomplete._defRenderFn','info','celleditor-popup');

            Editors.autocomplete.superclass._defRenderFn.apply(this, arguments);
            var inputNode = this._inputNode;

            if(inputNode && Plugins.AutoComplete) {

               inputNode.plug(Plugins.AutoComplete,
                    Y.merge({
                        source: this.get('lookupTable'),
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
            /**
            Source of data for the [AutoComplete](Plugin.AutoComplete.html) plugin.
            If missing the `lookupTable` column attribute, such as it
            is used in the [lookup](DataTable.BodyView.Formatters.html#method_lookup)
            formatter, will be used instead.

            It should be an array of objects containing `value` and `text` properties:

                lookupTable: [
                    {value:0, text: "unknown"},
                    {value:1, text: "requested"},
                    {value:2, text: "approved"},
                    {value:3, text: "delivered"}
                ]}

            ##### Notes:

            Used only in the following editors: <ul>
            <li>[autocomplete](DataTable.Editors.html#property_autocomplete)</li>
            <li>[radio](DataTable.Editors.html#property_radio)</li>
            <li>[dropdown](DataTable.Editors.html#property_dropdown)</li>
           </ul>

            The [lookup](DataTable.BodyView.Formatters.html#method_lookup)
            formatter accepts two formats for the lookupTable, an object map
            and an array of value/text sets, only the latter is valid for this
            editor.

            @attribute lookupTable
            @type Array
            @default null
            @for DataTable.BaseCellPopupEditor
             */
            lookupTable: {
                value: null
            },

            /**
            Configuration parameters to be merged along the default for the
            [AutoComplete](Plugin.AutoComplete.html) plugin.

            ##### Used only in the [autocomplete](DataTable.Editors.html#property_autocomplete) editor.

            @attribute autocompleteConfig
            @type Object
            @default {}
            @for DataTable.BaseCellPopupEditor
             */
            autocompleteConfig: {
                value: null
            }
        }
    }
);

/**
Produces a group of mutually exclusive radio buttons.

@example
    // Column definition via Array options
    {
        key:"size",
        editor:"radio",
        editorConfig:{
            lookupTable:[ {value:0, text:"S"}, {value:1, text:"M"}, {value:2, text:"L"} ]
        }
    }

    // The lookupTable can be shared with the formatter
    {
        key:"size",
        formatter: "lookup",
        lookupTable: [ {value:0, text:"S"}, {value:1, text:"M"}, {value:2, text:"L"} ],
        editor:"radio",
    }


For a complete list of configuration attributes, see the
[DataTable.BaseCellPopupEditor](DataTable.BaseCellPopupEditor.html) class.

@property radio
@for DataTable.Editors
@type DataTable.BaseCellEditor
  @public
 **/
Editors.radio = baseCreate('celleditor', PEd, [],
    {
        _defRenderFn:function () {
            Y.log('Editors.radio._defRenderFn','info','celleditor-popup');

            Editors.radio.superclass._defRenderFn.apply(this, arguments);
            var tmpl = this.get('template').replace('{name}', Y.guid()),
                ov = this._overlay,
                radios = arrMap(this.get('lookupTable'), function (item) {
                    return substitute(tmpl, item);
                }, this);

            ov.set('bodyContent', radios.join('\n'));

            this._subscr.push(
                ov.get('contentBox').delegate('click',this._afterRadioClick , 'input[type="radio"]', this)
            );

        },
        _afterRadioClick: function (e) {
            Y.log('Editors.radio._afterRadioClick','info','celleditor-popup');
            var value = e.target.get('value');

            if (Lang.isValue(value)) {
                this.saveEditor(value);
            }
        },
        _defShowFn:function(e){
            Y.log('Editors.radio._defShowFn','info','celleditor-popup');

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
            lookupTable: {
                value: null
            }
        }
    }
);


/**
Produces a popup cell editor containing a single SELECT control within
the Overlay.
`select` and `combobox` are aliases for this editor.

@example
    // Column definition
    {
        key: "inTheForest",
        editor: "dropdown",
        editorConfig: {lookupTable: [
            {value: "lions",   text: "Lions"},
            {value: "tigers",  text: "Tigers"},
            {value: "bears",   text: "Bears"},
            {value: "unknown", text: "oh my!"}
        ] }
    }

    // Column definition
    // `select` is an alias for `dropdown`
    // The lookup table can be shared with the formatter
    {
        key:"color",
        formatter:"lookup",
        editor:"select",
        lookupTable: [
            { value: 0, text: 'Red'},
            { value: 1, text: 'Green'},
            { value: 2, text: 'Fuschia'},
            { value: 3, text: 'Blue'}
        ]
    }


For a complete list of configuration attributes, see the
[DataTable.BaseCellPopupEditor](DataTable.BaseCellPopupEditor.html) class.

@property dropdown
@for DataTable.Editors
@type DataTable.BaseCellEditor
  @public
 **/
Editors.dropdown = baseCreate('celleditor', PEd, [],
    {
        _dropdownNode: null,
        _defRenderFn:function () {
            Y.log('Editors.dropdown._defRenderFn','info','celleditor-popup');

            Editors.dropdown.superclass._defRenderFn.apply(this, arguments);
            var tmpl = this.get('optionTemplate'),
                ov = this._overlay,
                dropdown,
                options = arrMap(this.get('lookupTable'), function (item) {
                    return substitute(tmpl, item);
                }, this);

            ov.set('bodyContent', substitute(this.get('template'), {
                options: options.join('\n'),
                classInput: this._classInput
            }));
            this._dropdownNode = dropdown = ov.get('contentBox').one('.' + this._classInput);
            this._subscr.push(
                dropdown.on('change', this._afterDropdownChange,  this)
            );

        },
        _afterDropdownChange:function (e) {
            Y.log('Editors.dropdown._afterDropdownChange','info','celleditor-popup');
            var value = e.target.get('value');

            if (Lang.isValue(value)) {
                this.saveEditor(value);
            }
        },
        _defShowFn: function (e) {
            Y.log('Editors.dropdown._defShowFn','info','celleditor-popup');

            Editors.dropdown.superclass._defShowFn.apply(this, arguments);
            this._dropdownNode.set('value',  e.initialValue ).focus();
        }

    },
    {
        ATTRS: {
            template: {
                value: '<select class="{classInput}">{options}</select>'
            },
            /**
            Template for the `option` elements in the dropdown.
            The template for the `select` element is in the
            [template](DataTable.BaseCellPopupEditor#attr_template) attribute.

            ##### Used only in the [dropdown](DataTable.Editors.html#dropdown) editor.

            @attribute optionTemplate
            @type String
            @default (see code)
            @for DataTable.BaseCellPopupEditor
             */
            optionTemplate: {
                value: '<option value="{value}">{text}</option>'
            },
            lookupTable: {
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

Editors.combobox = Editors.select = Editors.dropdown;

/**
Produces a simple checkbox (i.e. on/off, yes/no, true/false) popup cell editor
within the popup Overlay.


@example
    // Column definition
    {key: "arrived", editor: "checkbox"}

    // If the values in the record are not Boolean values,
    // a `formatter` and `parser` can be provided to convert them

    {key: "arrived", editor: "checkbox",
        formatter: function (value) {
            return value.toLowerCase() === 'yes';
        },
        parser: function (value) {
            return value ? 'yes': 'no';
        }
    }

@property checkbox
@for DataTable.Editors
@type DataTable.BaseCellEditor
 **/
Editors.checkbox = baseCreate('celleditor', PEd, [],
    {
        _checkbox: null,
        _defRenderFn: function () {
            Y.log('Editors.checkbox._defRenderFn','info','celleditor-popup');

            Editors.checkbox.superclass._defRenderFn.apply(this, arguments);

            var ov = this._overlay,
                checkbox;
            ov.set('bodyContent', substitute(this.get('template'), { classInput: this._classInput}));

            this._checkbox = checkbox = ov.get('contentBox').one('.' + this._classInput);

            this._subscr.push(
                checkbox.on('click', this._afterCheckboxClick, this)
            );
        },
        _afterCheckboxClick:function () {
            Y.log('Editors.checkbox._afterCheckboxClick','info','celleditor-popup');

            this.saveEditor(!!checkbox.get('checked'));
        },

        _defShowFn: function (e) {
            Y.log('Editors.checkbox._defRenderFn','info','celleditor-popup');

            Editors.checkbox.superclass._defShowFn.apply(this, arguments);
            this._checkbox.set('checked', !!e.formattedValue).focus();
        },
        _resize: function (width) {
            Y.log('Editors.checkbox._resize: ' + width,'info','celleditor-popup');

            this._overlay.set('width', width);
        }
    },
    {
        ATTRS: {
            template: {
                value:'<input type="checkbox" class="{classInput}" />'
            },
            buttons: {
                value: [
                    {cancel:true}
                ]
            }
        }

    }
);

Y.DataTable.BaseCellPopupEditor = PEd;
Y.mix(Y.DataTable.Editors, Editors);