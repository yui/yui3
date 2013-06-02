/**
 Provides cell editors for DataTable

 @module datatable
 @submodule datatable-celleditors
*/
/**
Collection of cell editors for DataTable.

This class contains subclasses of [DataTable.BaseCellEditor](DataTable.BaseCellEditor.html)
keyed by the name of the editor.

See [DataTable.BaseCellEditor](DataTable.BaseCellEditor.html) for the API of the classes
contained as properties in this class.

@class DataTable.Editors
@type {Object}
@static
*/
var arrMap = Y.Array.map,
    Lang = Y.Lang,
    substitute = Lang.sub,
    YNumber = Y.Number,
    YDate = Y.Date,
    Plugins = Y.Plugin || {},
    baseCreate = Y.Base.create,
    Editors = {},
    BCE =  Y.DataTable.BaseCellEditor;

/**
Produces a simple simple inline-type cell editor.

@example
    // Column definition
    { key: 'surName', editor: "inline" }

Since the [defaultEditor](DataTable.html#attr_defaultEditor) attribute defaults to `"inline"`, any cell that
doesn't have editing disabled and has no `editor` explicitly declared will use this editor.

For a complete list of configuration attributes, see the
[DataTable.BaseCellEditor](DataTable.BaseCellEditor.html) class.

@property inline
@type DataTable.BaseCellEditor
@for DataTable.Editors
@public
**/
Editors.inline = BCE;


/**
This cell editor is identical to the [inline](#property_inline) text editor but incorporates
numeric formatting and validation prior to saving.
It requires the `datatype-number` module to perform the validation,
otherwise it uses `parseFloat` for parsing and regular typecasting to show.

@example
    // Column definition
    { key:'unit_price', editor:"inlineNumber" }

    // Column definition ... to use a comma as the decimal separator
    {
        key:'unit_price',
        editor:"inlineNumber",
        editorConfig: {
            numberFormat: {
                decimalSeparator: ',',
            }
        }
    }


For a complete list of configuration attributes, see the
[DataTable.BaseCellEditor](DataTable.BaseCellEditor.html) class.

@property inlineNumber
@type DataTable.BaseCellEditor
@for DataTable.Editors
@public
**/
Editors.inlineNumber = baseCreate('celleditor', BCE, [],
    {},
    {
        ATTRS: {
            /**
            Format specification used both when showing the value in the
            [inlineNumber](DataTable.Editors.html#property_inlineNumber) editor and
            when parsing the entered value.
            See [Number.format](Number.html#method_format) for details.

            ##### Used only in the [inlineNumber](DataTable.Editors.html#property_inlineNumber) editor.

            @attribute numberFormat
            @type Object
            @default null
            @for DataTable.BaseCellEditor
             */
            numberFormat: {
                value: null
            },
            keyFiltering:   {
                    value : /^(\.\,|\d|\-)*$/
            },

            formatter: {
                value: function (value) {
                    Y.log('inlineNumber.formatter: ' + value,'info','celleditor-inline');

                    var fmt = this.get('numberFormat');
                    if (fmt && YNumber) {
                        return YNumber.format(value, fmt);
                    }
                    return value;
                }
            },
            parser: {
                value: function (value) {
                    Y.log('inlineNumber.parser: ' + value,'info','celleditor-inline');

                    var fmt = this.get('numberFormat');
                    if (fmt && YNumber) {
                        value = YNumber.parse(value, fmt);
                    } else {
                        value = parseFloat(value);
                    }
                    if (Lang.isValue(value)) {
                        return value;
                    }
                    return Y.Attribute.INVALID_VALUE;
                }
            }

        }
    }
);

/**
This cell editor is identical to the [inline](#property_inline) text editor but incorporates date
formatting and validation.  By default, it uses the prefered local format for dates.

It requires the `datatype-date` module to perform the validation,
otherwise it will use the native JavaScript functions `toString()` and `Date.parse()`.
The default date format is `"%x"` which is the prefered date format for the current locale.

@example
    // Column definition
    { key:'weddingDate', editor:"inlineDate" }

    // Column definition with user-specified 'dateFormat' to display Date in text box on display
    {
        key:'date_of_claim',
        editor:"inlineDate",
        editorConfig:{ dateformat:'%Y-%m-%d'}
    }

For a complete list of configuration attributes, see the
[DataTable.BaseCellEditor](DataTable.BaseCellEditor.html) class.

@property inlineDate
@type DataTable.BaseCellEditor
@for DataTable.Editors
@public
**/
Editors.inlineDate = baseCreate('celleditor', BCE, [],
    {},
    {
        ATTRS: {
            /**
            Format specification used both to display the date in the
            [inlineDate](DataTable.Editors.html#property_inlineDate) editor
            and to parse it back.
            See [Date.format](Date.html#method_format) for details.

            ##### Used only in the [inlineDate](DataTable.Editors.html#property_inlineDate) editor.

            @attribute dateFormat
            @type String
            @default "%x"  (prefered local format)
            @for DataTable.BaseCellEditor
             */
            dateFormat: {
                value:"%x"
            },

            keyFiltering: {
                    value: /^(\/|\d|\-)*$/
            },

            formatter: {
                value: function (value) {
                    Y.log('Editors.inlineDate.formatter: ' + value,'info','celleditors');

                    return (
                        YDate ?
                        YDate.format(value, this.get('dateFormat')) :
                        value.toString()
                    );
                }
            },

            parser: {
                value: function(value){
                    Y.log('Editors.inlineDate.parser: ' + value,'info','celleditors');

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
This cell editor has the AutoComplete plugin attached to the input node.

@example
    {
        key: 'degreeProgram',
        editor: "inlineAC",
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
        editor: "inlineAC"
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
        editor: "inlineAC",
        editorConfig: {
            autocompleteConfig: {
                resultHighlighter: 'phraseMatch'
            }
        }
    }

For a complete list of configuration attributes, see the
[DataTable.BaseCellEditor](DataTable.BaseCellEditor.html) class.

@property inlineAC
@type DataTable.BaseCellEditor
@for DataTable.Editors
@public
**/
Editors.inlineAC = baseCreate('celleditor', BCE, [],
    {
        _defRenderFn: function () {
            Y.log('inlineAC._defRenderFn','info','celleditor-inline');

            Editors.inlineAC.superclass._defRenderFn.apply(this, arguments);
            var inputNode = this.get('container'),
                acConfig = this.get('autocompleteConfig') || {},
                lookupTable = this.get('lookupTable') || acConfig.source;

            if(inputNode && Plugins.AutoComplete) {

                inputNode.plug(Plugins.AutoComplete,
                    Y.merge({
                        source: lookupTable,
                        resultTextLocator:'text',
                        resultHighlighter: 'startsWith',
                        render: true
                    }, acConfig)
                );

                inputNode.ac.after('select', this._afterACSelect, this);
                this.set('formatter', (function () {
                    var table = {};
                    Y.Array.each(lookupTable, function (item) {
                        table[item.value] = item.text;
                    });
                    return function (value) {
                        return table[value];
                    };

                })());
            }
            return this;

        },
        _afterACSelect:function (ev) {
            Y.log('inlineAC._afterACSelect','info','celleditor-inline');
            this.saveEditor(ev.result.raw.value);
       }
    },
    {
        ATTRS: {
            saveOnEnterKey: {
                value: false
            },

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

            Used only in the [inlineAC](DataTable.Editors.html#property_inlineAC) editor.

            The [lookup](DataTable.BodyView.Formatters.html#method_lookup)
            formatter accepts two formats for the lookupTable, an object map
            and an array of value/text sets, only the latter is valid for this
            editor.

            @attribute lookupTable
            @type Array
            @default null
            @for DataTable.BaseCellEditor
             */
            lookupTable: {
                value: null
            },

            /**
            Configuration parameters to be merged along the default for the
            [AutoComplete](Plugin.AutoComplete.html) plugin.

            ##### Used only in the [inlineAC](DataTable.Editors.html#property_inlineAC) editor.

            Though it is possible to set the `source` attribute in `autocompleteConfig`,
            it is better to use [lookupTable](#attr_lookupTable) instead.

            @attribute autocompleteConfig
            @type Object
            @default {}
            @for DataTable.BaseCellEditor
             */
            autocompleteConfig: {
                value: {}
            }
        }
    }

);
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
[DataTable.BaseCellEditor](DataTable.BaseCellEditor.html) class.

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
[DataTable.BaseCellEditor](DataTable.BaseCellEditor.html) class.


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
[DataTable.BaseCellEditor](DataTable.BaseCellEditor.html) class.

@property number
@for DataTable.Editors
@type DataTable.BaseCellEditor
@public
*/
Editors.number = baseCreate('celleditor', Editors.inlineNumber, [],
    {},
    {
        ATTRS: {
            popup: {
                value: true
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
[DataTable.BaseCellEditor](DataTable.BaseCellEditor.html) class.

@property date
@for DataTable.Editors
@type DataTable.BaseCellEditor
@public
*/
Editors.date = baseCreate('celleditor', Editors.inlineDate, [],
    {},
    {
        ATTRS: {
            popup: {
                value: true
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
[DataTable.BaseCellEditor](DataTable.BaseCellEditor.html) class.

@property calendar
@for DataTable.Editors
@type DataTable.BaseCellEditor
@public
*/
Editors.calendar = baseCreate('celleditor', Editors.date, [],
    {
        _defRenderFn: function () {
            Y.log('Editors.calendar._defRenderFn','info','celleditors');

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
            Y.log('Editors.calendar._afterCalendarClick','info','celleditors');

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
            Y.log('Editors.calendar.destructor','info','celleditors');

            if(this._calendar) {
                this._calendar.destroy({remove:true});
            }

        },
        _defShowFn: function (ev) {
            Y.log('Editors.calendar._defShowFn','info','celleditors');

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
                    Y.log('Editors.calendar.formatter: ' + value,'info','celleditors');

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
                    Y.log('Editors.calendar.parser: ' + value,'info','celleditors');

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
            @for DataTable.BaseCellEditor
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
            @for DataTable.BaseCellEditor
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
[DataTable.BaseCellEditor](DataTable.BaseCellEditor.html) class.

@property autocomplete
@for DataTable.Editors
@type DataTable.BaseCellEditor
@public
*/
Editors.autocomplete = baseCreate('celleditor', Editors.inlineAC, [],
    {},
    {
        ATTRS: {
            popup: {
                value: true
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
[DataTable.BaseCellEditor](DataTable.BaseCellEditor.html) class.

@property radio
@for DataTable.Editors
@type DataTable.BaseCellEditor
  @public
 **/
Editors.radio = baseCreate('celleditor', BCE, [],
    {
        _defRenderFn:function () {
            Y.log('Editors.radio._defRenderFn','info','celleditors');

            Editors.radio.superclass._defRenderFn.apply(this, arguments);
            var tmpl = this.get('template').replace('{name}', Y.guid()),
                container = this.get('container'),
                radios = arrMap(this.get('lookupTable'), function (item) {
                    return substitute(tmpl, item);
                }, this);

            container.setHTML(radios.join('\n'));

            this._subscr.push(
                container.delegate('click',this._afterRadioClick , 'input[type="radio"]', this)
            );

        },
        _afterRadioClick: function (ev) {
            Y.log('Editors.radio._afterRadioClick','info','celleditors');
            var value = ev.target.get('value');

            if (Lang.isValue(value)) {
                this.saveEditor(value);
            }
        },
        _defShowFn:function(ev){
            Y.log('Editors.radio._defShowFn','info','celleditors');

            Editors.radio.superclass._defShowFn.apply(this, arguments);
            var radio  = this.get('container').one('input[type="radio"][value="' + ev.initialValue + '"]');
            if (radio) {

                radio.set('checked', true);
                radio.focus();
            }
        },
        _resize: function () {
            // Just let it adapt to the size of the contents.
        }

    },
    {
        ATTRS: {
            template: {
                value:'<div class="yui3-datatable-celleditor-radio-button"><input type="radio" name="{name}" value="{value}"/>{text}</div>'
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
[DataTable.BaseCellEditor](DataTable.BaseCellEditor.html) class.

@property dropdown
@for DataTable.Editors
@type DataTable.BaseCellEditor
  @public
 **/
Editors.dropdown = baseCreate('celleditor', BCE, [],
    {
        _defRenderFn:function () {
            Y.log('Editors.dropdown._defRenderFn','info','celleditors');

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
        _afterDropdownChange:function (ev) {
            Y.log('Editors.dropdown._afterDropdownChange','info','celleditors');
            var value = ev.target.get('value');

            if (Lang.isValue(value)) {
                this.saveEditor(value);
            }
        },
        _defShowFn: function (ev) {
            Y.log('Editors.dropdown._defShowFn','info','celleditors');

            Editors.dropdown.superclass._defShowFn.apply(this, arguments);
            this._inputNode.set('value',  ev.initialValue ).focus();
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
            [template](DataTable.BaseCellEditor#attr_template) attribute.

            ##### Used only in the [dropdown](DataTable.Editors.html#dropdown) editor.

            @attribute optionTemplate
            @type String
            @default (see code)
            @for DataTable.BaseCellEditor
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
            Y.log('Editors.checkbox._defRenderFn','info','celleditors');

            Editors.checkbox.superclass._defRenderFn.apply(this, arguments);

            this._subscr.push(
                this._inputNode.on('click', this._afterCheckboxClick, this)
            );
            this._xyReference = this.get('container');
        },
        _afterCheckboxClick:function () {
            Y.log('Editors.checkbox._afterCheckboxClick','info','celleditors');

            this.saveEditor(!!this._inputNode.get('checked'));
        },

        _defShowFn: function (ev) {
            Y.log('Editors.checkbox._defRenderFn','info','celleditors');

            Editors.checkbox.superclass._defShowFn.apply(this, arguments);
            this._inputNode.set('checked', !!ev.formattedValue).focus();
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
Y.mix(Y.DataTable.Editors, Editors);