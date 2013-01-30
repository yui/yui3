/**
Adds predefined cell formatters to `Y.DataTable.BodyView`.

@module datatable
@submodule datatable-formatters
@since 3.8.0
**/
var Lang = Y.Lang,
    isValue = Lang.isValue,
    escape = Y.Escape.html,

    getCName = Y.ClassNameManager.getClassName,
    cName = function (name) {
        return getCName('datatable', name);
    },
    stringValue = function (value, def) {
        return (isValue(value) ? escape(value.toString()) : def || '');
    },
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
    Formatters = {

        /**
        Formats a BUTTON element using the value of the `buttonLabel` column
        definition attribute as its label..

        Applies the CSS className `yui3-datatable-button` to the cell.

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
            o.column.allowHTML = true;
            return '<button>' + (o.column.buttonLabel || 'Click') + '</button>';
        },

        /**
        Assigns the CSS classNames `yui3-datatable-true` or `yui3-datatable-false`
        based on the <i>truthy</i> value of the cell.

        If either a `booleanLabels` configuration object is defined for the column
        or a `booleanLabels` configuration attribute is defined for the datatable,
        the formatter will use the values for the properties `true` or `false`
        of either of those objects as the text to show.
        If none is found, a single whitespace will be put into the cell,
        all visual clues relying on the CSS styling.

            {key:"active", formatter: "boolean", booleanLabels: {
                "true": "yes",
                "false": "no"
            }}


        @method boolean
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
        @return {String} `" "` unless either a `booleanLabels`
            column configuration or datatable configuration is defined.
        @static
        **/
        'boolean' : function(o) {
            var textValue = o.value?'true':'false',
                labels = o.column.booleanLabels || this.get('booleanLabels');
            o.className = cName(textValue);
            return (labels?labels[textValue]:' ');
        },

        /**
        Formats values as currency using the `Y.Number.format` method.
        It looks for the format to apply in the `currencyFormat` property of the column
        or in the `currencyFormat` attribute of the whole table.

            {key: "amount", formatter: "currency", currencyFormat: {
                decimalPlaces:2,
                decimalSeparator: ",",
                thousandsSeparator: ".",
                suffix: "&euro;"
             }}

        See <a href="Number.html#method_format">Y.Number.format</a> for the available format specs.

        Applies the CSS className `yui3-datatable-currency` to the cell.
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
            o.column.allowHTML = true;
            return Y.Number.format(parseFloat(o.value), o.column.currencyFormat || this.get("currencyFormat"));
        },

        /**
        Formats JavaScript Dates.
        It looks for the format to apply in the `dateFormat` property of the column
        or in the `dateFormat` attribute of the whole table.

            {key: "DOB", formatter: "date", dateFormat: "%I:%M:%S %p"}

        See <a href="Date.html#method_format">Y.Date.format</a> for the available format specs.

        Applies the CSS className `yui3-datatable-date` to the cell.
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
        Formats emails links.
        If the column definition contains a property `linkFrom` it will use the value
        in that field for the link, otherwise, the same column value will be used for both
        link and text.

            {key: "contact", formatter: "email", linkFrom: "contactEmail"}

        Applies the CSS className `yui3-datatable-email` to the cell.
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
            var value = stringValue(o.value),
                link = (o.column.linkFrom?stringValue(o.data[o.column.linkFrom]):value);
            o.column.allowHTML = true;
            o.className = cName('email');
            return '<a href="mailto:' + link + '">' + value + '</a>';
        },

        /**
        Formats links.
        If the column definition contains a property `linkFrom` it will use the value
        in that field for the link, otherwise, the same column value will be used for both
        link and text.

            {key: "companyName", formatter: "link", linkFrom: "CompanyWebSite"}

        Applies the CSS className `yui3-datatable-link` to the cell.
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
            var value = stringValue(o.value),
               link = (o.column.linkFrom?stringValue(o.data[o.column.linkFrom]):value);
            o.className = cName('link');
            o.column.allowHTML = true;
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

        See <a href="Number.html#method_format">Y.Number.format</a> for the available format specs.

        Applies the CSS className `yui3-datatable-number` to the cell.
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
            o.column.allowHTML = true;
            return Y.Number.format(parseFloat(o.value), o.column.numberFormat || this.get("numberFormat"));
        }

    };

Y.mix(Y.DataTable.BodyView.Formatters, Formatters);
