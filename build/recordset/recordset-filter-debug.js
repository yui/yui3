YUI.add('recordset-filter', function(Y) {

var YArray = Y.Array,
	Lang = Y.Lang;
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
        //this.publish("filter", {defaultFn: Y.bind("_defFilterFn", this)});
    },

    destructor: function(config) {
    },

	
	filter: function(f,v) {
		var recs = this.get('host').get('records'),
			len = recs.length,
			i = 0,
			oRecs = [],
			func = f;
			
		//If a key-value pair is passed in, generate a custom function
		if (Lang.isString(f) && Lang.isValue(v)) {

			func = function(item) {
				if (item.getValue(f) === v) {
					return true;
				}
				else {
					return false;
				}
			};
 		}

		oRecs = YArray.filter(recs, func);

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



}, '@VERSION@' ,{requires:['recordset-base','plugin','array-extras']});
