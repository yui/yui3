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

	

	// filter: function(k,v) {
	// 		var oRecs = [], i=0, rec, len, host;
	// 		host = this.get('host');
	// 		len = host.get('records').getLength();
	// 		for (; i<len;i++) {
	// 			rec = host.getRecord(i);
	// 			
	// 			if ((Y.Lang.isFunction(k) && v===undefined && k(rec)) || //if only k is supplied, and k is the custom function
	// 				(Y.Lang.isString(k) && Y.Lang.isValue(v) && rec.getValue(k) === v)) { //if key/value pair is provided, and neither are null/undefined/NaN
	// 					oRecs.push(rec);
	// 			}  
	// 		}
	// 
	// 		return new host.constructor({records:oRecs});
	// 	},
	
	filter: function(f,v) {
		var recs = this.get('host').get('records'),
			len = recs.length,
			i = 0,
			oRecs = [];
			
		//If a validator function is passed in, simply pass it through to the filter method on Y.Array (in array-extras submodule)
		if (Y.Lang.isFunction(f) && v===undefined) {
			oRecs = recs.filter(f);
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
		return new Y.Recordset({records:this.get("host").get('records').reject(f)});
	}


});

Y.namespace("Plugin").RecordsetFilter = RecordsetFilter;

