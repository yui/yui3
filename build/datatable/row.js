YUI.add('row', function(Y) {

function Row(config) {
    Row.superclass.constructor.apply(this, arguments);
}

/**
 * Class name.
 *
 * @property NAME
 * @type String
 * @static
 * @final
 * @value "row"
 */
Row.NAME = "row";

/////////////////////////////////////////////////////////////////////////////
//
// Row Attributes
//
/////////////////////////////////////////////////////////////////////////////
Row.ATTRS = {
    id: {
        valueFn: "_setId",
        writeOnce: true
    },
    data : {
    }
};

/* Row extends Base */
Y.extend(Row, Y.Base, {
    _setId: function() {
        return Y.guid();
    },

    initializer: function() {
    },

    destructor: function() {
    },
    
    getValue: function(field) {
        return this.get("data")[field];
    }
});

Y.Row = Row;



}, '@VERSION@' ,{requires:['base']});
