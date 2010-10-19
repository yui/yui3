YUI.add('recordset', function(Y) {

function Recordset(config) {
    Recordset.superclass.constructor.apply(this, arguments);
}

/**
 * Class name.
 *
 * @property NAME
 * @type String
 * @static
 * @final
 * @value "recordset"
 */
Recordset.NAME = "recordset";

/////////////////////////////////////////////////////////////////////////////
//
// Recordset Attributes
//
/////////////////////////////////////////////////////////////////////////////
Recordset.ATTRS = {
    records: {
        value: null,
        setter: "_setRecords"
    },
    
    length: {
        value: 0,
        readOnly:true
    }
};

/* Recordset extends Base */
Y.extend(Recordset, Y.Base, {
    _setRecords: function(allData) {
        var records = [];

        function initRecord(oneData){
            records.push(new Y.Record({data:oneData}));
        }

        Y.Array.each(allData, initRecord);
        return records;
    },

    initializer: function() {
    },
    
    destructor: function() {
    },
    
    getRecord: function(i) {
        return this.get("records")[i];
    }
});

Y.Recordset = Recordset;



}, '@VERSION@' ,{requires:['base','record']});
