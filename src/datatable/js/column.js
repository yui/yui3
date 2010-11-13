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
        id: {
            valueFn: "_defaultId",
            writeOnce: true
        },
        key: {
            valueFn: "_defaultKey"
        },
        field: {
            valueFn: "_defaultField"
        },
        label: {
            valueFn: "_defaultLabel"
        },
        keyIndex: {
            readOnly: true
        },
        parent: {
            readOnly: true
        },
        children: {
        },
        colSpan: {
            readOnly: true
        },
        rowSpan: {
            readOnly: true
        },
        thNode: {
            readOnly: true
        },
        thLinerNode: {
            readOnly: true
        },
        thLabelNode: {
            readOnly: true
        },
        abbr: {
            value: null
        },
        headers: {}, // set by Columnset code
        classnames: {
            readOnly: true,
            getter: "_getClassnames"
        },
        editor: {},
        formatter: {},

        // requires datatable-colresize
        resizeable: {},

        //requires datatable-sort
        sortable: {},
        hidden: {},
        width: {},
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
        this._thNode.set("abbr", val);
    }
});

Y.Column = Column;
