YUI.add('datatable-celleditor-popup', function (Y, NAME) {

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
    Plugins = Y.Plugin || {},
    baseCreate = Y.Base.create,

    Editors = {},
    BCE =  Y.DataTable.BaseCellEditor;


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
PlainText = baseCreate('celleditor', BCE, [],
    {},
    {
        ATTRS: {
            template: {
                value: '<input type="text" class="{classInput}" />'
            },
            popup: {
                value: true
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
            template: {
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
            template:{
                value: '<input type="text" class="{classInput}"  />'
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
Editors.radio = baseCreate('celleditor', BCE, [],
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
                value:'<div class="yui3-datatable-celleditor-radio"><input type="radio" name="{name}" value="{value}"/>{text}</div>'
            },
            popup: {
                value: true
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
Editors.dropdown = baseCreate('celleditor', BCE, [],
    {
        _defRenderFn:function () {
            Y.log('Editors.dropdown._defRenderFn','info','celleditor-popup');

            Editors.dropdown.superclass._defRenderFn.apply(this, arguments);
            var tmpl = this.get('optionTemplate'),
                dropdown = this._inputNode,
                options = arrMap(this.get('lookupTable'), function (item) {
                    return substitute(tmpl, item);
                }, this);

            dropdown.setHTML(options.join('\n'));
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
            this._inputNode.set('value',  e.initialValue ).focus();
        }
    },
    {
        ATTRS: {
            template: {
                value: '<select class="{classInput}">{options}</select>'
            },
            popup: {
                value: true
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
Editors.checkbox = baseCreate('celleditor', BCE, [],
    {
        _defRenderFn: function () {
            Y.log('Editors.checkbox._defRenderFn','info','celleditor-popup');

            Editors.checkbox.superclass._defRenderFn.apply(this, arguments);

            this._subscr.push(
                this._inputNode.on('click', this._afterCheckboxClick, this)
            );
        },
        _afterCheckboxClick:function () {
            Y.log('Editors.checkbox._afterCheckboxClick','info','celleditor-popup');

            this.saveEditor(!!this._inputNode.get('checked'));
        },

        _defShowFn: function (e) {
            Y.log('Editors.checkbox._defRenderFn','info','celleditor-popup');

            Editors.checkbox.superclass._defShowFn.apply(this, arguments);
            this._inputNode.set('checked', !!e.formattedValue).focus();
        }
    },
    {
        ATTRS: {
            template: {
                value: '<input type="checkbox" class="{classInput}" />'
            },
            popup: {
                value: true
            },
            buttons: {
                value: [
                    {cancel:true}
                ]
            }
        }

    }
);

Y.DataTable.BaseCellPopupEditor = BCE;
Y.mix(Y.DataTable.Editors, Editors);

}, '@VERSION@', {
    "skinnable": "true",
    "requires": [
        "datatable-editable",
        "base-build",
        "view",
        "cssbutton",
        "event-outside",
        "overlay",
        "dd-plugin",
        "template",
        "array-extras"
    ]
});
