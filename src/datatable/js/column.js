/**
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
    /**
     * Class name.
     *
     * @property NAME
     * @type String
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
        /**
        * @attribute id
        * @description Unique internal identifier, used to stamp ID on TH element.
        * @type String
        * @readOnly
        */
        id: {
            valueFn: "_defaultId",
            readOnly: true
        },
        
        /**
        * @attribute key
        * @description User-supplied identifier. Defaults to id.
        * @type String
        */
        key: {
            valueFn: "_defaultKey"
        },

        /**
        * @attribute field
        * @description Points to underlying data field (for sorting or formatting,
        * for example). Useful when column doesn't hold any data itself, but is
        * just a visual representation of data from another column or record field.
        * Defaults to key.
        * @type String
        */
        field: {
            valueFn: "_defaultField"
        },

        /**
        * @attribute label
        * @description Display label for column header. Defaults to key.
        * @type String
        */
        label: {
            valueFn: "_defaultLabel"
        },
        
        /**
        * @attribute children
        * @description Array of child column definitions (for nested headers).
        * @type String
        */
        children: {
            value: null
        },
        
        /**
        * @attribute abbr
        * @description TH abbr attribute.
        * @type String
        */
        abbr: {
            value: ""
        },

        //TODO: support custom classnames
        // TH CSS classnames
        classnames: {
            readOnly: true,
            getter: "_getClassnames"
        },
        
        // Column formatter
        formatter: {},

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
    /**
    * @method _defaultId
    * @description Return ID for instance.
    * @returns String
    * @private
    */
    _defaultId: function() {
        return Y.guid();
    },

    /**
    * @method _defaultKey
    * @description Return key for instance. Defaults to ID if one was not
    * provided.
    * @returns String
    * @private
    */
    _defaultKey: function(key) {
        return key || Y.guid();
    },

    /**
    * @method _defaultField
    * @description Return field for instance. Defaults to key if one was not
    * provided.
    * @returns String
    * @private
    */
    _defaultField: function(field) {
        return field || this.get("key");
    },

    /**
    * @method _defaultLabel
    * @description Return label for instance. Defaults to key if one was not
    * provided.
    * @returns String
    * @private
    */
    _defaultLabel: function(label) {
        return label || this.get("key");
    },

    /**
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
    /**
     * Reference to Column's current position index within its Columnset's keys
     * array, if applicable. This property only applies to non-nested and bottom-
     * level child Columns. Value is set by Columnset code.
     *
     * @property keyIndex
     * @type Number
     */
    keyIndex: null,
    
    /**
    * @property headers
    * @description Array of TH IDs associated with this column, for TD "headers"
    * attribute. Value is set by Columnset code
    * @type String[]
    */
    headers: null,

    /**
     * Number of cells the header spans. Value is set by Columnset code.
     *
     * @property colSpan
     * @type Number
     * @default 1
     */
    colSpan: 1,
    
    /**
     * Number of rows the header spans. Value is set by Columnset code.
     *
     * @property rowSpan
     * @type Number
     * @default 1
     */
    rowSpan: 1,

    /**
     * Column's parent Column instance, if applicable. Value is set by Columnset
     * code.
     *
     * @property parent
     * @type Y.Column
     */
    parent: null,

    /**
     * The Node reference to the associated TH element.
     *
     * @property thNode
     * @type Y.Node
     */
     
    thNode: null,

    /*TODO
     * The Node reference to the associated liner element.
     *
     * @property thLinerNode
     * @type Y.Node
     
    thLinerNode: null,*/
    
    /////////////////////////////////////////////////////////////////////////////
    //
    // METHODS
    //
    /////////////////////////////////////////////////////////////////////////////
    /**
    * Initializer.
    *
    * @method initializer
    * @param config {Object} Config object.
    * @private
    */
    initializer: function(config) {
    },

    /**
    * Destructor.
    *
    * @method destructor
    * @private
    */
    destructor: function() {
    },

    /**
     * Returns classnames for Column.
     *
     * @method _getClassnames
     * @private
     */
    _getClassnames: function () {
        return Y.ClassNameManager.getClassName(COLUMN, this.get("id"));
        /*var allClasses;

        // Add CSS classes
        if(lang.isString(oColumn.className)) {
            // Single custom class
            allClasses = [oColumn.className];
        }
        else if(lang.isArray(oColumn.className)) {
            // Array of custom classes
            allClasses = oColumn.className;
        }
        else {
            // no custom classes
            allClasses = [];
        }

        // Hook for setting width with via dynamic style uses key since ID is too disposable
        allClasses[allClasses.length] = this.getId() + "-col-" +oColumn.getSanitizedKey();

        // Column key - minus any chars other than "A-Z", "a-z", "0-9", "_", "-", ".", or ":"
        allClasses[allClasses.length] = "yui-dt-col-" +oColumn.getSanitizedKey();

        var isSortedBy = this.get("sortedBy") || {};
        // Sorted
        if(oColumn.key === isSortedBy.key) {
            allClasses[allClasses.length] = isSortedBy.dir || '';
        }
        // Hidden
        if(oColumn.hidden) {
            allClasses[allClasses.length] = DT.CLASS_HIDDEN;
        }
        // Selected
        if(oColumn.selected) {
            allClasses[allClasses.length] = DT.CLASS_SELECTED;
        }
        // Sortable
        if(oColumn.sortable) {
            allClasses[allClasses.length] = DT.CLASS_SORTABLE;
        }
        // Resizeable
        if(oColumn.resizeable) {
            allClasses[allClasses.length] = DT.CLASS_RESIZEABLE;
        }
        // Editable
        if(oColumn.editor) {
            allClasses[allClasses.length] = DT.CLASS_EDITABLE;
        }

        // Addtnl classes, including First/Last
        if(aAddClasses) {
            allClasses = allClasses.concat(aAddClasses);
        }

        return allClasses.join(' ');*/
    },

    ////////////////////////////////////////////////////////////////////////////
    //
    // SYNC
    //
    ////////////////////////////////////////////////////////////////////////////
    /**
    * Syncs UI to intial state.
    *
    * @method syncUI
    * @private
    */
    syncUI: function() {
        this._uiSetAbbr(this.get("abbr"));
    },

    /**
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
