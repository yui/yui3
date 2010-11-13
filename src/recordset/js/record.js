
/**
 * Class name.
 *
 * @property NAME
 * @type String
 * @static
 * @final
 * @value "record"
 */
var Record = Y.Base.create('record', Y.Base, [], {
	_setId: function() {
        return Y.guid();
    },

    initializer: function(o) {

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
},
{
	ATTRS: {
	    id: {
	        valueFn: "_setId"
	    },
	    data : {
			value: null
	    }
	}
});

Y.Record = Record;
