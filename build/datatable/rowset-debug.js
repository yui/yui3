YUI.add('rowset', function(Y) {

function Rowset(config) {
    Rowset.superclass.constructor.apply(this, arguments);
}

/**
 * Class name.
 *
 * @property NAME
 * @type String
 * @static
 * @final
 * @value "rowset"
 */
Rowset.NAME = "rowset";

/////////////////////////////////////////////////////////////////////////////
//
// Rowset Attributes
//
/////////////////////////////////////////////////////////////////////////////
Rowset.ATTRS = {
    rows: {
        value: null,
        setter: "_setRows"
    },
    
    length: {
        value: 0,
        readOnly:true
    }
};

/* Rowset extends Base */
Y.extend(Rowset, Y.Base, {
    _setRows: function(allData) {
        var rows = [];

        function initRow(oneData){
            rows.push(new Y.Row({data:oneData}));
        }

        Y.Array.each(allData, initRow);
        return rows;
    },

    initializer: function() {
    },
    
    destructor: function() {
    },
    
    getRow: function(i) {
        return this.get("rows")[i];
    }
});

Y.Rowset = Rowset;



}, '@VERSION@' ,{requires:['base','row']});
