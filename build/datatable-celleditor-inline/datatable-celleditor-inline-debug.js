YUI.add('datatable-celleditor-inline', function (Y, NAME) {

/**
 Provides cell editors that appear to make the cell itself editable by occupying the same region.

 @module datatable
 @submodule datatable-celleditor-inline
*/

/**
 Serves as the base class for a cell inline editor, i.e. an editor that
 completely overlies the cell being edited.  This editor is intended to replicate
 the familiar "spreadsheet" type of input.

 @class DataTable.BaseCellInlineEditor
 @extends DataTable.BaseCellEditor
 **/

var YNumber = Y.Number,
    YDate = Y.Date,
    Editors = {},
    IEd =  Y.Base.create('celleditor',Y.DataTable.BaseCellEditor,[],{



    initializer: function (config) {
        Y.log('DataTable.BaseCellInlineEditor.initializer','info','celleditor-inline');
        config = config || {};
        this._subscr.push(
            this.after('hideMouseLeaveChange', this._afterHideMouseLeaveChange)
        );
        this._afterHideMouseLeaveChange({newVal:config.hideMouseLeave});
    },



    /**
    Listener for changes in the  [hideMouseLeave](#attr_hideMouseLeave)
    attribute, subscribes to the `mouseleave` event if set,
    unsubscribes when false.

    @method _afterHideMouseLeaveChange
    @param ev {EventFacade}  Event facade for the attribute change event
    @private
    */
    _afterHideMouseLeaveChange: function (ev) {
        Y.log('DataTable.BaseCellInlineEditor._afterHideMouseLeaveChange','info','celleditor-inline');
        if (ev.newVal) {
            this._subscrMouseLeave = this.get('container').on('mouseleave', this._onMouseLeave, this);
        } else if (this._subscrMouseLeave) {
            this._subscrMouseLeave.detach();
        }
    },

    /**
    Listener to mouseleave event that will hide the editor if attribute
    [hideMouseLeave](#attr_hideMouseLeave) is true.

    @method _onMouseLeave
    @private
    */
    _onMouseLeave : function () {
        Y.log('DataTable.BaseCellInlineEditor._onMouseLeave','info','celleditor-inline');

        this.cancelEditor();
    }


},{
    ATTRS:{
        template: {
            value:'<input class="{classInput}" type="text"  />'
        },
        popup: {
            value: false
        },
        /**
         * This flag dictates whether the View container is hidden when the mouse leaves
         * the focus of the inline container.
         *
         * @attribute hideMouseLeave
         * @type Boolean
         * @default true
         */
        hideMouseLeave : {
            value:      false,
            validator:  Y.Lang.isBoolean
        }

    }
});


Y.DataTable.BaseCellInlineEditor = IEd;

/**
Produces a simple simple inline-type cell editor.

@example
    // Column definition
    { key:'surName', editor:"inline" }

Since the `defaultEditor` attribute defaults to `"inline"`, any cell that
doesn't have editing disable will use this editor.

For a complete list of configuration attributes, see the
[DataTable.BaseCellInlineEditor](DataTable.BaseCellInlineEditor.html) class.

@property inline
@type DataTable.BaseCellEditor
@for DataTable.Editors
@public
**/
Editors.inline = IEd;


/**
This cell editor is identical to the [inline](#property_inline) textual editor but incorporates
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
[DataTable.BaseCellInlineEditor](DataTable.BaseCellInlineEditor.html) class.

@property inlineNumber
@type DataTable.BaseCellEditor
@for DataTable.Editors
@public
**/
Editors.inlineNumber = Y.Base.create('celleditor', IEd, [],
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
            @for DataTable.BaseCellInlineEditor
             */
            numberFormat: {
                value: null
            },

            hideMouseLeave: {
                value: false
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
                    if (Y.Lang.isValue(value)) {
                        return value;
                    }
                    return Y.Attribute.INVALID_VALUE;
                }
            }

        }
    }
);

/**
This cell editor is identical to the [inline](#property_inline) textual editor but incorporates date
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
[DataTable.BaseCellInlineEditor](DataTable.BaseCellInlineEditor.html) class.

@property inlineDate
@type DataTable.BaseCellEditor
@for DataTable.Editors
@public
**/
Editors.inlineDate = Y.Base.create('celleditor', IEd, [],
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
            @for DataTable.BaseCellInlineEditor
             */
            dateFormat: {
                value:"%x"
            },

            keyFiltering: {
                    value: /^(\/|\d|\-)*$/
            },

            formatter: {
                value: function (value) {
                    Y.log('Editors.inlineDate.formatter: ' + value,'info','celleditor-popup');

                    return (
                        YDate ?
                        YDate.format(value, this.get('dateFormat')) :
                        value.toString()
                    );
                }
            },

            parser: {
                value: function(value){
                    Y.log('Editors.inlineDate.parser: ' + value,'info','celleditor-popup');

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
[DataTable.BaseCellInlineEditor](DataTable.BaseCellInlineEditor.html) class.

@property inlineAC
@type DataTable.BaseCellEditor
@for DataTable.Editors
@public
**/
Editors.inlineAC = Y.Base.create('celleditor', IEd, [],
    {
        _defRenderFn: function () {
            Y.log('inlineAC._defRenderFn','info','celleditor-inline');

            Editors.inlineAC.superclass._defRenderFn.apply(this, arguments);
            var inputNode = this.get('container'),
                acConfig = this.get('autocompleteConfig') || {},
                lookupTable = this.get('lookupTable') || acConfig.source;

            if(inputNode && Y.Plugin.AutoComplete) {

                inputNode.plug(Y.Plugin.AutoComplete,
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
        _afterACSelect:function (e) {
            Y.log('inlineAC._afterACSelect','info','celleditor-inline');
            this.saveEditor(e.result.raw.value);
       }
    },
    {
        ATTRS: {

            hideMouseLeave: {
                value: false
            },
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
            @for DataTable.BaseCellInlineEditor
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
            @for DataTable.BaseCellInlineEditor
             */
            autocompleteConfig: {
                value: {}
            }
        }
    }

);
Y.mix(Y.DataTable.Editors, Editors);

}, '@VERSION@', {"skinnable": "true", "requires": ["datatable-editable", "view", "base-build", "event-mouseenter"]});
