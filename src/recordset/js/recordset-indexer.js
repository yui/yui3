function RecordsetIndexer(config) {
    RecordsetIndexer.superclass.constructor.apply(this, arguments);
}

Y.mix(RecordsetIndexer, {
    NS: "indexer",

    NAME: "recordsetIndexer",

    ATTRS: {
		hash: {
			valueFn: "_setDefaultHash",
			lazyAdd: false
		},
		
		defaultKey: {
			value: "id",
			setter: "_setDefaultKey"
		}
    }
});


Y.extend(RecordsetIndexer, Y.Plugin.Base, {
    initializer: function(config) {
       var host = this.get('host');

		//setup listeners on recordset events
		this.onHostEvent('add', Y.bind("_defAddHash", this), host);
		this.onHostEvent('remove', Y.bind('_defRemoveHash', this), host);
		this.onHostEvent('update', Y.bind('_defUpdateHash', this), host);
    },

    destructor: function(config) {
    },

	_setDefaultHash: function() {
		var host = this.get('host'), obj = {}, key = this.get('defaultKey');
		host.each(function() {
			obj[this.get(key)] = this;
		});
		return obj;
	},
	
	_setDefaultKey: function(key) {
	},
	
	_defAddHash: function(e) {
		console.log('e');
		console.log(e);
		var obj = this.get('hash'), key = this.get('defaultKey');
		obj[e.added.get(key)] = e.added;
	},
	
	_defRemoveHash: function(e) {
		
	},
	
	_defUpdateHash: function(e) {
		
	}
	
	
});

Y.namespace("Plugin").RecordsetIndexer = RecordsetIndexer;

