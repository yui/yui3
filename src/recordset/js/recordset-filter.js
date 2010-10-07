var YArray = Y.Array;
function RecordsetFilter(config) {
    RecordsetFilter.superclass.constructor.apply(this, arguments);
}

Y.mix(RecordsetFilter, {
    NS: "filter",

    NAME: "recordsetFilter",

    ATTRS: {

    }

});


Y.extend(RecordsetFilter, Y.Plugin.Base, {

	
    initializer: function(config) {
        //this.publish("sort", {defaultFn: Y.bind("_defSortFn", this)});
    },

    destructor: function(config) {
    },
	
	filter: function(f,v) {
		var recs = this.get('host').get('records'),
			len = recs.length,
			i = 0,
			oRecs = [];
			
		//If a validator function is passed in, simply pass it through to the filter method on Y.Array (in array-extras submodule)
		if (Y.Lang.isFunction(f) && v===undefined) {
			oRecs = YArray.filter(recs, f);
		}
		
		//If a key-value pair is passed in, loop through the records to see if records match the k-v pair
		else if (Y.Lang.isString(f) && Y.Lang.isValue(v)) {
			for (; i<len;i++) {
				
				if (recs[i].getValue(f) === v) {
					oRecs.push(recs[i]);
				}
			}
 		}
		return new Y.Recordset({records:oRecs});
		//return new host.constructor({records:arr});
	},
	
	reject: function(f) {
		return new Y.Recordset({records:YArray.reject(this.get('host').get('records'),f)});
	},
	
	grep: function(pattern) {
		return new Y.Recordset({records:YArray.grep(this.get('host').get('records'),pattern)});
	}

});

Y.namespace("Plugin").RecordsetFilter = RecordsetFilter;

