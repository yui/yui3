YUI.add('recordset-indexer', function(Y) {

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
		var obj = this.get('hash'), key = this.get('defaultKey'), i=0;
		for (; i<e.added.length; i++) {
			obj[e.added[i].get(key)] = e.added[i];			
		}
	},
	
	_defRemoveHash: function(e) {
		var obj = this.get('hash'), key = this.get('defaultKey'), i=0;
		for (; i<e.removed.length; i++) {
			delete obj[e.removed[i].get(key)];
		}
	},
	
	_defUpdateHash: function(e) {
		var obj = {}, key = this.get('defaultKey'), i=0;
		
		//deletes the object key that held on to an overwritten record and
		//creates an object key to hold on to the updated record
		for (; i < e.updated.length; i++) {
			delete obj[e.overwritten[i].get(key)];
			obj[e.updated[i].get(key)] = e.updated[i]; 
		}
	}
	
	
});

Y.namespace("Plugin").RecordsetIndexer = RecordsetIndexer;



}, '@VERSION@' ,{requires:['recordset-base','plugin']});
