/**
Adds predefined cell formatters to `Y.DataTable.BodyView`.

@module datatable
@submodule datatable-formatters
@since 3.8.0
**/
var Lang = Y.Lang,
isValue = Lang.isValue,
subs = Lang.sub,
escape = Y.Escape.html,

getCName = Y.ClassNameManager.getClassName,
cName = function (name) {
    return getCName('datatable', name);
},
stringValue = function (value, def) {
    return (isValue(value) ? escape(value.toString()) : def || '');
};
/**
Registry of cell formatting functions, enables names to be used in column
definition `formatter` property:

    {key:"myColumn", formatter:"date"}

These functions are not meant to be used directly.  Instead, they will be
automatically called when their names are used as values for the `formatter`
property in a columnd definition.

The functions provided are simple and with few configurable options.
The developers are encouraged to define and add to this hash the functions
that better suit their needs.
@class DataTable.BodyView.Formatters
@since 3.8.0
**/
Y.namespace('DataTable').Formatters = {

    /**
    Formats a BUTTON element using the value as the label.

    Applies the CSS className `button` to the cell.

    @method button
    @param o {Object} As provided by [BodyView](DataTable.BodyView.html)
    @param o.value {any} The raw value from the record Model to populate this cell.
         Equivalent to `o.record.get(o.column.key)` or `o.data[o.column.key]`.
    @param o.data {Object} The Model data for this row in simple object format.
    @param o.column {Object} The column configuration object.
    @param o.record {Y.Model} The Model for this row.
    @param o.className {String} A string of class names to add `<td class="HERE">`
           in addition to the column class and any classes in the column's className configuration.
    @param o.rowIndex {Number} The index of the current Model in the ModelList.
           Typically correlates to the row index as well.
    @param o.rowClass {String} A string of css classes to add `<tr class="HERE"><td....`
    @return {String} the markup for the button.
    @static
    **/
    button : function(o) {
        o.className = cName('button');
        return '<button>' + stringValue(o.value, 'Click') + '</button>';
    },

    /**
    Formats a CHECKBOX element based on the <i>truthy</i> value of the cell.

    Applies the CSS className `checkbox` to the cell.

    @method checkbox
    @param o {Object} As provided by [BodyView](DataTable.BodyView.html)
    @param o.value {any} The raw value from the record Model to populate this cell.
         Equivalent to `o.record.get(o.column.key)` or `o.data[o.column.key]`.
    @param o.data {Object} The Model data for this row in simple object format.
    @param o.column {Object} The column configuration object.
    @param o.record {Y.Model} The Model for this row.
    @param o.className {String} A string of class names to add `<td class="HERE">`
           in addition to the column class and any classes in the column's className configuration.
    @param o.rowIndex {Number} The index of the current Model in the ModelList.
           Typically correlates to the row index as well.
    @param o.rowClass {String} A string of css classes to add `<tr class="HERE"><td....`
    @return {String} the markup for the checkbox.
    @static
    **/
    checkbox : function(o) {
        o.className = cName('checkbox');
        return '<input type="checkbox"' + (o.value ? ' checked="checked"' : '')  +'/>';
    },

    /**
    Formats values as currency using the `Y.Number.format` method.
    It looks for the format to apply in the `currencyFormat` property of the column
    or in the `currencyFormat` attribute of the whole table.

        {key: "amount", formatter: "currency", currencyFormat: {
            decimalPlaces:2,
            decimalSeparator: ",",
            thousandsSeparator: ",",
            suffix: "&euro;"
         }}

    Applies the CSS className `currency` to the cell.
    @method currency
    @param o {Object} As provided by [BodyView](DataTable.BodyView.html)
    @param o.value {any} The raw value from the record Model to populate this cell.
         Equivalent to `o.record.get(o.column.key)` or `o.data[o.column.key]`.
    @param o.data {Object} The Model data for this row in simple object format.
    @param o.column {Object} The column configuration object.
    @param o.record {Y.Model} The Model for this row.
    @param o.className {String} A string of class names to add `<td class="HERE">`
           in addition to the column class and any classes in the column's className configuration.
    @param o.rowIndex {Number} The index of the current Model in the ModelList.
           Typically correlates to the row index as well.
    @param o.rowClass {String} A string of css classes to add `<tr class="HERE"><td....`
    @return {String} the formatted value.
    @static
    **/
    currency : function(o) {
        o.className = cName('currency');
        return Y.Number.format(o.value, o.column.currencyFormat || this.get("currencyFormat"));
    },

    /**
    Formats JavaScript Dates.
    It looks for the format to apply in the `dateFormat` property of the column
    or in the `dateFormat` attribute of the whole table.

        {key: "DOB", formatter: "date", dateFormat: "%I:%M:%S %p"}

    Applies the CSS className `date` to the cell.
    @method date
    @param o {Object} As provided by [BodyView](DataTable.BodyView.html)
    @param o.value {any} The raw value from the record Model to populate this cell.
         Equivalent to `o.record.get(o.column.key)` or `o.data[o.column.key]`.
    @param o.data {Object} The Model data for this row in simple object format.
    @param o.column {Object} The column configuration object.
    @param o.record {Y.Model} The Model for this row.
    @param o.className {String} A string of class names to add `<td class="HERE">`
           in addition to the column class and any classes in the column's className configuration.
    @param o.rowIndex {Number} The index of the current Model in the ModelList.
           Typically correlates to the row index as well.
    @param o.rowClass {String} A string of css classes to add `<tr class="HERE"><td....`
    @return {String} the formatted date.
    @static
    **/
    'date' : function(o) {
        o.className = cName('date');
        return Y.Date.format(o.value, {
            format: o.column.dateFormat || this.get('dateFormat')
        });
    },

    /**
    Formats SELECT elements.

    It looks for the options to offer in the `dropdownOptions` property of the column.
    The `dropdownOptions` must be an array either of plain values,
    which will be used as both the value and the label or objects with
    `value` and `label` properties.

        {key: "color", formatter: "dropdown", dropdownOptions: [
             {value:"", label:"-none selected"},
             "blue",
             "red",
             "green"
        ]}


    Applies the CSS className `dropdown` to the cell.

    @method dropdown
    @param o {Object} As provided by [BodyView](DataTable.BodyView.html)
    @param o.value {any} The raw value from the record Model to populate this cell.
         Equivalent to `o.record.get(o.column.key)` or `o.data[o.column.key]`.
    @param o.data {Object} The Model data for this row in simple object format.
    @param o.column {Object} The column configuration object.
    @param o.record {Y.Model} The Model for this row.
    @param o.className {String} A string of class names to add `<td class="HERE">`
           in addition to the column class and any classes in the column's className configuration.
    @param o.rowIndex {Number} The index of the current Model in the ModelList.
           Typically correlates to the row index as well.
    @param o.rowClass {String} A string of css classes to add `<tr class="HERE"><td....`
    @return {String} the markup for the dropdown box.
    **/
    dropdown : function(o) {
        var s = '<select>',
        options = o.column.dropdownOptions || [],
        template = '<option {selected} value="{value}">{label}</option>';

        o.className = cName('dropdown');
        Y.Array.each(options, function (option) {
            if (Lang.isObject(option)) {
                o.selected = (option.value === o.value)?'selected':'';
                s.push(subs(template, option));
            } else {
                s.push(subs(template, {
                    value:option,
                    label:option,
                    selected: (option === o.value)?'selected':''
                }));
            }
        });
        return s.join('') + '</select>';
    },

    /**
    Formats emails links.
    If the column definition contains a property `linkFrom` it will use the value
    in that field for the link, otherwise, the same column value will be used for both
    link and text.

        {key: "contact", formatter: "email", linkFrom: "contactEmail"}

    Applies the CSS className `email` to the cell.
    @method email
    @param o {Object} As provided by [BodyView](DataTable.BodyView.html)
    @param o.value {any} The raw value from the record Model to populate this cell.
         Equivalent to `o.record.get(o.column.key)` or `o.data[o.column.key]`.
    @param o.data {Object} The Model data for this row in simple object format.
    @param o.column {Object} The column configuration object.
    @param o.record {Y.Model} The Model for this row.
    @param o.className {String} A string of class names to add `<td class="HERE">`
           in addition to the column class and any classes in the column's className configuration.
    @param o.rowIndex {Number} The index of the current Model in the ModelList.
           Typically correlates to the row index as well.
    @param o.rowClass {String} A string of css classes to add `<tr class="HERE"><td....`
    @return {String} the markup for the address.
    @static
    **/
    email : function(o) {
        o.className = cName('email');
        var value = escape(o.value),
        link = (o.column.linkFrom?escape(o.data[o.column.linkFrom]):value);
        return '<a href="mailto:' + link + '">' + value + '</a>';
    },

    /**
    Formats links.
    If the column definition contains a property `linkFrom` it will use the value
    in that field for the link, otherwise, the same column value will be used for both
    link and text.

        {key: "companyName", formatter: "link", linkFrom: "CompanyWebSite"}

    Applies the CSS className `link` to the cell.
    @method link
    @param o {Object} As provided by [BodyView](DataTable.BodyView.html)
    @param o.value {any} The raw value from the record Model to populate this cell.
         Equivalent to `o.record.get(o.column.key)` or `o.data[o.column.key]`.
    @param o.data {Object} The Model data for this row in simple object format.
    @param o.column {Object} The column configuration object.
    @param o.record {Y.Model} The Model for this row.
    @param o.className {String} A string of class names to add `<td class="HERE">`
           in addition to the column class and any classes in the column's className configuration.
    @param o.rowIndex {Number} The index of the current Model in the ModelList.
           Typically correlates to the row index as well.
    @param o.rowClass {String} A string of css classes to add `<tr class="HERE"><td....`
    @return {String} the markup for the address.
    @static
    **/
    link : function(o) {
        o.className = cName('link');
        var value = escape(o.value),
        link = (o.column.linkFrom?escape(o.data[o.column.linkFrom]):value);
        return '<a href="' + link + '">' + value + '</a>';
    },

    /**
    Formats values as a number using the `Y.Number.format` method.
    It looks for the format to apply in the `numberFormat` property of the column
    or in the `numberFormat` attribute of the whole table.

        {key: "weight", formatter: "number", numberFormat: {
            decimalPlaces:2,
            decimalSeparator: ",",
            thousandsSeparator: ",",
            suffix: "kg"
        }}

    Applies the CSS className `number` to the cell.
    @method number
    @param o {Object} As provided by [BodyView](DataTable.BodyView.html)
    @param o.value {any} The raw value from the record Model to populate this cell.
         Equivalent to `o.record.get(o.column.key)` or `o.data[o.column.key]`.
    @param o.data {Object} The Model data for this row in simple object format.
    @param o.column {Object} The column configuration object.
    @param o.record {Y.Model} The Model for this row.
    @param o.className {String} A string of class names to add `<td class="HERE">`
           in addition to the column class and any classes in the column's className configuration.
    @param o.rowIndex {Number} The index of the current Model in the ModelList.
           Typically correlates to the row index as well.
    @param o.rowClass {String} A string of css classes to add `<tr class="HERE"><td....`
    @return {String} the formatted value.
    @static
    **/
    'number' : function(o) {
        o.className = cName('number');
        return Y.Number.format(o.value, o.column.numberFormat || this.get("numberFormat"));
    },

    /**
    Formats a CHECKBOX element based on the <i>truthy</i> value of the cell.
    All the radios on the same column share a unique name so they are mutually exclusive

    Applies the CSS className `radio` to the cell.
    @method radio
    @param o {Object} As provided by [BodyView](DataTable.BodyView.html)
    @param o.value {any} The raw value from the record Model to populate this cell.
         Equivalent to `o.record.get(o.column.key)` or `o.data[o.column.key]`.
    @param o.data {Object} The Model data for this row in simple object format.
    @param o.column {Object} The column configuration object.
    @param o.record {Y.Model} The Model for this row.
    @param o.className {String} A string of class names to add `<td class="HERE">`
           in addition to the column class and any classes in the column's className configuration.
    @param o.rowIndex {Number} The index of the current Model in the ModelList.
           Typically correlates to the row index as well.
    @param o.rowClass {String} A string of css classes to add `<tr class="HERE"><td....`
    @return {String} the markup for the radio.
    @static
    **/
    radio : function(o) {
        o.className = cName('radio');
        return '<input type="radio"' + (o.value ? ' checked="checked"' : '') +
        ' name="'+ this.get('boundingBox').get('id') + o.column.key + '" />';
    },

    /**
    Formats text strings.
    It escapes HTML reserved values and turns nulls and undefineds into a single blank.

    Applies the CSS className `text` to the cell.
    @method text
    @param o {Object} As provided by [BodyView](DataTable.BodyView.html)
    @param o.value {any} The raw value from the record Model to populate this cell.
         Equivalent to `o.record.get(o.column.key)` or `o.data[o.column.key]`.
    @param o.data {Object} The Model data for this row in simple object format.
    @param o.column {Object} The column configuration object.
    @param o.record {Y.Model} The Model for this row.
    @param o.className {String} A string of class names to add `<td class="HERE">`
           in addition to the column class and any classes in the column's className configuration.
    @param o.rowIndex {Number} The index of the current Model in the ModelList.
           Typically correlates to the row index as well.
    @param o.rowClass {String} A string of css classes to add `<tr class="HERE"><td....`
    @return {String} the escaped string
    @static
    **/
    text : function(o) {
        o.className = cName('text');
        return stringValue(o.value);
    },

    /**
    It produces a TEXTAREA filled with the escaped value of the cell.

    Applies the CSS className `textarea` to the cell.
    @method textarea
    @param o {Object} As provided by [BodyView](DataTable.BodyView.html)
    @param o.value {any} The raw value from the record Model to populate this cell.
         Equivalent to `o.record.get(o.column.key)` or `o.data[o.column.key]`.
    @param o.data {Object} The Model data for this row in simple object format.
    @param o.column {Object} The column configuration object.
    @param o.record {Y.Model} The Model for this row.
    @param o.className {String} A string of class names to add `<td class="HERE">`
           in addition to the column class and any classes in the column's className configuration.
    @param o.rowIndex {Number} The index of the current Model in the ModelList.
           Typically correlates to the row index as well.
    @param o.rowClass {String} A string of css classes to add `<tr class="HERE"><td....`    @return {String} the markup for the textarea
    @static
    **/
    textarea : function(o) {
        o.className = cName('textarea');
        return '<textarea>' + stringValue(o.value) + '</textarea>';
    },

    /**
    It produces a TEXTBOX filled with the escaped value of the cell.

    Applies the CSS className `textbox` to the cell.
    @method textbox
    @param o {Object} As provided by [BodyView](DataTable.BodyView.html)
    @param o.value {any} The raw value from the record Model to populate this cell.
         Equivalent to `o.record.get(o.column.key)` or `o.data[o.column.key]`.
    @param o.data {Object} The Model data for this row in simple object format.
    @param o.column {Object} The column configuration object.
    @param o.record {Y.Model} The Model for this row.
    @param o.className {String} A string of class names to add `<td class="HERE">`
           in addition to the column class and any classes in the column's className configuration.
    @param o.rowIndex {Number} The index of the current Model in the ModelList.
           Typically correlates to the row index as well.
    @param o.rowClass {String} A string of css classes to add `<tr class="HERE"><td....`
    @return {String} the markup for the textbox
    @static
    **/
    textbox : function(o) {
        o.className = cName('text');
        return '<input type="text" value="' + stringValue(o.value) + '"/>';
    }

};

if (Lang.isFunction(Y.DataTable.BodyView)) {
    Y.Base.mix(Y.DataTable.BodyView, [Formatters]);
}
