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

	alert: function() {
		alert('im working!!');
	},
	
	

	filter: function(k,v) {
		var oRecs = [], i=0, rec, len, host;
		host = this.get('host');
		len = host.get('records').getLength();
		for (; i<len;i++) {
			rec = host.getRecord(i);
			
			if ((Y.Lang.isFunction(k) && v===undefined && k(rec)) || //if only k is supplied, and k is the custom function
				(Y.Lang.isString(k) && Y.Lang.isValue(v) && rec.getValue(k) === v)) { //if key/value pair is provided, and neither are null/undefined/NaN
					oRecs.push(rec);
			}  
		}

		return new host.constructor({records:oRecs});
	}


});

Y.namespace("Plugin").RecordsetFilter = RecordsetFilter;

