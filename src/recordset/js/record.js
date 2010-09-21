function Record(config) {
    Record.superclass.constructor.apply(this, arguments);
}

/**
 * Class name.
 *
 * @property NAME
 * @type String
 * @static
 * @final
 * @value "record"
 */
Record.NAME = "record";

/////////////////////////////////////////////////////////////////////////////
//
// Record Attributes
//
/////////////////////////////////////////////////////////////////////////////
Record.ATTRS = {
    id: {
        valueFn: "_setId",
        writeOnce: true
    },
    data : {
    }
};

/* Record extends Base */
Y.extend(Record, Y.Base, {
    _setId: function() {
        return Y.guid();
    },

    initializer: function(data) {
    },

    destructor: function() {
    },
    
    getValue: function(field) {
		if (field === undefined) {
        	return this.get("data");
		}
		else {
			return this.get("data")[field];
		}
		return null;
    }

});

Y.Record = Record;
