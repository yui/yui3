function Column(config) {
    Column.superclass.constructor.apply(this, arguments);
}

/**
 * Class name.
 *
 * @property NAME
 * @type String
 * @static
 * @final
 * @value "column"
 */
Column.NAME = "column";

/////////////////////////////////////////////////////////////////////////////
//
// Column Attributes
//
/////////////////////////////////////////////////////////////////////////////
Column.ATTRS = {
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
    colspan: {
        readOnly: true
    },
    rowspan: {
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
    className: {},
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
};

/* Column extends Widget */
Y.extend(Column, Y.Widget, {
    _defaultId: function() {
        return Y.guid();
    },

    _defaultKey: function(key) {
        return key || Y.guid();
    },

    _defaultField: function(field) {
        return field || this.get("key");
    },

    _defaultLabel: function(label) {
        return label || this.get("key");
    },

    initializer: function() {
    },

    destructor: function() {
    },

    syncUI: function() {
        this._uiSetAbbr(this.get("abbr"));
    },

    _afterAbbrChange: function (e) {
        this._uiSetAbbr(e.newVal);
    },
    
    _uiSetAbbr: function(val) {
        this._thNode.set("abbr", val);
    }

});

Y.Column = Column;
