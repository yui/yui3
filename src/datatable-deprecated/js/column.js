// API Doc comments disabled to avoid deprecated class leakage into
// non-deprecated class API docs.  See the 3.4.1 datatable API doc files in the
// download at http://yui.zenfs.com/releases/yui3/yui_3.4.1.zip for reference.
/*
 * The Column class defines and manages attributes of Columns for DataTable.
 *
 * @class Column
 * @extends Widget
 * @constructor
 */
function Column(config) {
    Column.superclass.constructor.apply(this, arguments);
}

/////////////////////////////////////////////////////////////////////////////
//
// STATIC PROPERTIES
//
/////////////////////////////////////////////////////////////////////////////
Y.mix(Column, {
    /*
     * Class name.
     *
     * @property NAME
     * @type {String}
     * @static
     * @final
     * @value "column"
     */
    NAME: "column",

/////////////////////////////////////////////////////////////////////////////
//
// ATTRIBUTES
//
/////////////////////////////////////////////////////////////////////////////
    ATTRS: {
        /*
        Unique internal identifier, used to stamp ID on TH element.
        
        @attribute id
        @type {String}
        @readOnly
        **/
        id: {
            valueFn: "_defaultId",
            readOnly: true
        },
        
        /*
        User-supplied identifier. Defaults to id.
        @attribute key
        @type {String}
        **/
        key: {
            valueFn: "_defaultKey"
        },

        /*
        Points to underlying data field (for sorting or formatting, for
        example). Useful when column doesn't hold any data itself, but is just
        a visual representation of data from another column or record field.
        Defaults to key.

        @attribute field
        @type {String}
        @default (column key)
        **/
        field: {
            valueFn: "_defaultField"
        },

        /*
        Display label for column header. Defaults to key.

        @attribute label
        @type {String}
        **/
        label: {
            valueFn: "_defaultLabel"
        },
        
        /*
        Array of child column definitions (for nested headers).

        @attribute children
        @type {String}
        @default null
        **/
        children: {
            value: null
        },
        
        /*
        TH abbr attribute.

        @attribute abbr
        @type {String}
        @default ""
        **/
        abbr: {
            value: ""
        },

        //TODO: support custom classnames
        // TH CSS classnames
        classnames: {
            readOnly: true,
            getter: "_getClassnames"
        },
        
        /*
        Formating template string or function for cells in this column.

        Function formatters receive a single object (described below) and are
        expected to output the `innerHTML` of the cell.

        String templates can include markup and {placeholder} tokens to be
        filled in from the object passed to function formatters.

        @attribute formatter
        @type {String|Function}
        @param {Object} data Data relevant to the rendering of this cell
            @param {String} data.classnames CSS classes to add to the cell
            @param {Column} data.column This Column instance
            @param {Object} data.data The raw object data from the Record
            @param {String} data.field This Column's "field" attribute value
            @param {String} data.headers TH ids to reference in the cell's
                            "headers" attribute
            @param {Record} data.record The Record instance for this row
            @param {Number} data.rowindex The index for this row
            @param {Node}   data.tbody The TBODY Node that will house the cell
            @param {Node}   data.tr The row TR Node that will house the cell
            @param {Any}    data.value The raw Record data for this cell
        **/
        formatter: {},

        /*
        The default markup to display in cells that have no corresponding record
        data or content from formatters.

        @attribute emptyCellValue
        @type {String}
        @default ''
        **/
        emptyCellValue: {
            value: '',
            validator: Y.Lang.isString
        },

        //requires datatable-sort
        sortable: {
            value: false
        },
        //sortOptions:defaultDir, sortFn, field

        //TODO: support editable columns
        // Column editor
        editor: {},

        //TODO: support resizeable columns
        //TODO: support setting widths
        // requires datatable-colresize
        width: {},
        resizeable: {},
        minimized: {},
        minWidth: {},
        maxAutoWidth: {}
    }
});

/////////////////////////////////////////////////////////////////////////////
//
// PROTOTYPE
//
/////////////////////////////////////////////////////////////////////////////
Y.extend(Column, Y.Widget, {
    /////////////////////////////////////////////////////////////////////////////
    //
    // ATTRIBUTE HELPERS
    //
    /////////////////////////////////////////////////////////////////////////////
    /*
    * Return ID for instance.
    *
    * @method _defaultId
    * @return {String}
    * @private
    */
    _defaultId: function() {
        return Y.guid();
    },

    /*
    * Return key for instance. Defaults to ID if one was not provided.
    *
    * @method _defaultKey
    * @return {String}
    * @private
    */
    _defaultKey: function() {
        return Y.guid();
    },

    /*
    * Return field for instance. Defaults to key if one was not provided.
    *
    * @method _defaultField
    * @return {String}
    * @private
    */
    _defaultField: function() {
        return this.get("key");
    },

    /*
    * Return label for instance. Defaults to key if one was not provided.
    *
    * @method _defaultLabel
    * @return {String}
    * @private
    */
    _defaultLabel: function() {
        return this.get("key");
    },

    /*
     * Updates the UI if changes are made to abbr.
     *
     * @method _afterAbbrChange
     * @param e {Event} Custom event for the attribute change.
     * @private
     */
    _afterAbbrChange: function (e) {
        this._uiSetAbbr(e.newVal);
    },

    /////////////////////////////////////////////////////////////////////////////
    //
    // PROPERTIES
    //
    /////////////////////////////////////////////////////////////////////////////
    /*
     * Reference to Column's current position index within its Columnset's keys
     * array, if applicable. This property only applies to non-nested and bottom-
     * level child Columns. Value is set by Columnset code.
     *
     * @property keyIndex
     * @type {Number}
     */
    keyIndex: null,
    
    /*
    * Array of TH IDs associated with this column, for TD "headers" attribute.
    * Value is set by Columnset code
    *
    * @property headers
    * @type {String[]}
    */
    headers: null,

    /*
     * Number of cells the header spans. Value is set by Columnset code.
     *
     * @property colSpan
     * @type {Number}
     * @default 1
     */
    colSpan: 1,
    
    /*
     * Number of rows the header spans. Value is set by Columnset code.
     *
     * @property rowSpan
     * @type {Number}
     * @default 1
     */
    rowSpan: 1,

    /*
     * Column's parent Column instance, if applicable. Value is set by Columnset
     * code.
     *
     * @property parent
     * @type {Column}
     */
    parent: null,

    /*
     * The Node reference to the associated TH element.
     *
     * @property thNode
     * @type {Node}
     */
     
    thNode: null,

    /*TODO
     * The Node reference to the associated liner element.
     *
     * @property thLinerNode
     * @type {Node}
     
    thLinerNode: null,*/
    
    /////////////////////////////////////////////////////////////////////////////
    //
    // METHODS
    //
    /////////////////////////////////////////////////////////////////////////////
    /*
    * Initializer.
    *
    * @method initializer
    * @param config {Object} Config object.
    * @private
    */
    initializer: function(config) {
    },

    /*
    * Destructor.
    *
    * @method destructor
    * @private
    */
    destructor: function() {
    },

    /*
     * Returns classnames for Column.
     *
     * @method _getClassnames
     * @private
     */
    _getClassnames: function () {
        return Y.ClassNameManager.getClassName(COLUMN, this.get("key").replace(/[^\w\-]/g,""));
    },

    ////////////////////////////////////////////////////////////////////////////
    //
    // SYNC
    //
    ////////////////////////////////////////////////////////////////////////////
    /*
    * Syncs UI to intial state.
    *
    * @method syncUI
    * @private
    */
    syncUI: function() {
        this._uiSetAbbr(this.get("abbr"));
    },

    /*
     * Updates abbr.
     *
     * @method _uiSetAbbr
     * @param val {String} New abbr.
     * @protected
     */
    _uiSetAbbr: function(val) {
        this.thNode.set("abbr", val);
    }
});

Y.Column = Column;
