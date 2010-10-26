YUI.add('recordset-base', function(Y) {


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
		else if (field === 'id') {
			return this.get('id');
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
var ArrayList = Y.ArrayList,
	Bind = Y.bind,
	Recordset = Y.Base.create('recordset', Y.Base, [], {

    initializer: function() {
	
		//set up event listener to fire events when recordset is modified in anyway
		this.publish('add', {defaultFn: this._defAddFn});
		this.publish('remove', {defaultFn: this._defRemoveFn});
		this.publish('empty', {defaultFn: this._defEmptyFn});
		this.publish('update', {defaultFn: this._defUpdateFn});
		
		this._recordsetChanged();
		this._syncHashTable();
    },
    
    destructor: function() {
    },
	
	/**
     * Helper method called upon by add() - it is used to create a new record(s) in the recordset
     *
     * @method _defAddFn
     * @param aRecord {Y.Record} A Y.Record instance
     * @param index {Number} (optional) Index at which to add the record(s)
     * @return {Y.Record} A Record instance.
     * @private
     */
	_defAddFn: function(e) {
		var len = this._items.length,
			recs = e.added,
			index = e.index,
			i=0;
		//index = (Y.Lang.isNumber(index) && (index > -1)) ? index : len;
		
		for (; i < recs.length; i++) {
			//if records are to be added one at a time, push them in one at a time
			if (index === len) {
				this._items.push(recs[i]);
			}
			else {
				this._items.splice(index,0,recs[i]);
				index++;
			}
		}
		
		
	},
	
	_defRemoveFn: function(e) {
		if (e.index === 0) {
			this._items.pop();
		}
		else {
			this._items.splice(e.index,e.range);
		}
		
		//this._defRemoveHash(e);
		
	},
	
	_defEmptyFn: function(e) {
		this._items = [];
		//this._defEmptyHash();
	},
	
	_defUpdateFn: function(e) {
		
		for (var i=0; i<e.updated.length; i++) {
			this._items[e.index + i] = this._changeToRecord(e.updated[i]);
		}
		//this._defUpdateHash(e);
	},
	
	
	//---------------------------------------------
    // Hash Table Methods
    //---------------------------------------------
	
	
	
	_defAddHash: function(e) {
		var obj = this.get('table'), key = this.get('key'), i=0;
		for (; i<e.added.length; i++) {
			obj[e.added[i].getValue(key)] = e.added[i];			
		}
		this.set('table', obj);
	},
	
	_defRemoveHash: function(e) {
		var obj = this.get('table'), key = this.get('key'), i=0;
		for (; i<e.removed.length; i++) {
			delete obj[e.removed[i].getValue(key)];
		}
		this.set('table', obj);
	},
	
	_defUpdateHash: function(e) {
		var obj = this.get('table'), key = this.get('key'), i=0;
		
		//deletes the object key that held on to an overwritten record and
		//creates an object key to hold on to the updated record
		for (; i < e.updated.length; i++) {
			if (e.overwritten[i]) {
				delete obj[e.overwritten[i].getValue(key)];
			}
			obj[e.updated[i].getValue(key)] = e.updated[i]; 
		}
		this.set('table', obj);
	},
	
	_defEmptyHash: function() {
		this.set('table', {});
	},
	
	_setHashTable: function() {
		var obj = {}, key=this.get('key'), i=0, len = this._items.length;
		for (; i<len; i++) {
			obj[this._items[i].getValue(key)] = this._items[i];
		}
		return obj;
	},
	
	
	/**
     * Helper method - it takes an object bag and converts it to a Y.Record
     *
     * @method _changeToRecord
     * @param obj {Object || Y.Record} Any objet literal or Y.Record instance
     * @return {Y.Record} A Record instance.
     * @private
     */
	_changeToRecord: function(obj) {
		var oRec;
		if (obj instanceof Y.Record) {
			oRec = obj;
		}
		else {
			oRec = new Y.Record({data:obj});
		}
		
		return oRec;
	},
	
	//---------------------------------------------
    // Events
    //---------------------------------------------
	
	/**
     * Event that is fired whenever the recordset is changed. Note that multiple simultaneous changes still fires this event once.
	 * (ie: Adding multiple records via an array will only fire this event once at the completion of all the additions)
     *
     * @method _recordSetUpdated
     * @private
     */
	_recordsetChanged: function() {
		
		this.on(['update', 'add', 'remove', 'empty'], function() {
			this.fire('change', {});
		});
	},

	_syncHashTable: function() {
		
		this.after('add', function(e) {
			this._defAddHash(e);
		});
		this.after('remove', function(e) {
			this._defRemoveHash(e);
		});
		this.after('update', function(e) {
			this._defUpdateHash(e);
		});
		this.after('update', function(e) {
			this._defEmptyHash();
		});
		
	},
	
	//---------------------------------------------
    // Public Methods
    //---------------------------------------------
	
	/**
     * Returns the record with particular ID
     *
     * @method getRecord
     * @param i {id} The ID of the record
     * @return {Y.Record} An Y.Record instance
     * @public
     */
	getRecord: function(i) {
		
		if (Y.Lang.isString(i)) {
			return this.get('table')[i];
		}
		else if (Y.Lang.isNumber(i)) {
			return this._items[i];
		}
		return null;
	},
	
	
	/**
     * Returns the record at a particular index
     *
     * @method getRecordByIndex
     * @param i {Number} Index at which the required record resides
     * @return {Y.Record} An Y.Record instance
     * @public
     */
    getRecordByIndex: function(i) {
        return this._items[i];
    },
	
	/**
     * Returns a range of records beginning at particular index
     *
     * @method getRecordsByIndex
     * @param index {Number} Index at which the required record resides
	 * @param range {Number} (Optional) Number of records to retrieve. The default is 1
     * @return {Array} An array of Y.Record instances
     * @public
     */
	getRecordsByIndex: function(index, range) {
		var i=0, returnedRecords = [];
		//Range cannot take on negative values
		range = (Y.Lang.isNumber(range) && (range > 0)) ? range : 1;
		
		for(; i<range; i++) {
			returnedRecords.push(this._items[index+i]);
		}
		return returnedRecords;
	},
	
	getLength: function() {
		return this.size();
	},
		
	/**
     * Returns an array of values for a specified key in the recordset
     *
     * @method getRecord
     * @param index {Number} (optional) Index at which the required record resides
     * @return {Array} An array of values for the given key
     * @public
     */
	getValuesByKey: function(key) {
		var i = 0, len = this._items.length, retVals = [];
		for( ; i < len; i++) {
			retVals.push(this._items[i].getValue(key));
		}
		return retVals;
	},
	

    /**
     * Adds one or more Records to the RecordSet at the given index. If index is null,
     * then adds the Records to the end of the RecordSet.
     *
     * @method add
     * @param oData {Y.Record, Object Literal, Array} A Y.Record instance, An object literal of data or an array of object literals
     * @param index {Number} (optional) Index at which to add the record(s)
     * @return {object} An object literal with two properties: "data" which contains array of Y.Record(s) and "index" which contains the index where the Y.Record(s) were added
     * @public
     */
	add: function(oData, index) {
		
		var newRecords=[], idx, i=0;		
		idx = (Y.Lang.isNumber(index) && (index > -1)) ? index : this._items.length;
		

		
		//Passing in array of object literals for oData
		if (Y.Lang.isArray(oData)) {
			for(; i < oData.length; i++) {
				newRecords[i] = this._changeToRecord(oData[i]);
			}

		}
		else if (Y.Lang.isObject(oData)) {
			newRecords[0] = this._changeToRecord(oData);
		}
		
		this.fire('add', {added:newRecords, index:idx});
		return this;
	},
	
	/**
     * Removes one or more Records to the RecordSet at the given index. If index is null,
     * then removes a single Record from the end of the RecordSet.
     *
     * @method remove
     * @param index {Number} (optional) Index at which to remove the record(s) from
     * @param range {Number} (optional) Number of records to remove (including the one at the index)
     * @return {object} An object literal with two properties: "data" which contains the removed set {Y.Record or Y.Recordset} and "index" which contains the index where the Y.Record(s) were removed from
     * @public
     */
	remove: function(index, range) {
		var remRecords=[];
		
		//Default is to only remove the last record - the length is always 1 greater than the last index
		index = (index > -1) ? index : (this.size()-1);
		range = (range > 0) ? range : 1;
		
		remRecords = this._items.slice(index,(index+range));

		this.fire('remove', {removed: remRecords, range:range, index:index});
		//this._recordRemoved(remRecords, index);
		
		//return ({data: remRecords, index:index}); 
		return this;
	},
	
	/**
     * Empties the recordset
     *
     * @method empty
     * @public
     */
	empty: function() {
		this.fire('empty', {});
		return this;
	},
	
	
	update: function(data, index) {
		var rec, arr, i=0;
		
		//Whatever is passed in, we are changing it to an array so that it can be easily iterated in the _defUpdateFn method
		arr = (!(Y.Lang.isArray(data))) ? [data] : data;
		rec = this._items.slice(index, index+arr.length);
		
		for (; i<arr.length; i++) {
			arr[i] = this._changeToRecord(arr[i]);
		}
		
		this.fire('update', {updated:arr, overwritten:rec, index:index});
		
		return this;		
	}
	

},
{
    ATTRS: {
        records: {
            validator: Y.Lang.isArray,
            getter: function () {
                // give them a copy, not the internal object
                return Y.Array(this._items);
            },
            setter: function (allData) {
				var records = [];
				function initRecord(oneData) {
					var o;
					
					if (oneData instanceof Y.Record) {
						records.push(oneData);
					}
					else {
						o = new Y.Record({data:oneData});
						records.push(o);
					}
				}
				Y.Array.each(allData, initRecord);
                this._items = Y.Array(records);
            },
			//initialization of the attribute must be done before the first call is made.
			//see http://developer.yahoo.com/yui/3/api/Attribute.html#method_addAttr for details on this
			lazyAdd: false
        },
	
	table: {
		valueFn: '_setHashTable'
		},
		
	key: {
		value:'id'
	}
		
    }
});
Y.augment(Recordset, ArrayList);
Y.Recordset = Recordset;



}, '@VERSION@' ,{requires:['base','record','arraylist']});
YUI.add('recordset-sort', function(Y) {

var Compare = Y.ArraySort.compare,
	isValue = Y.Lang.isValue;

function RecordsetSort(field, desc, sorter) {
    RecordsetSort.superclass.constructor.apply(this, arguments);
}

Y.mix(RecordsetSort, {
    NS: "sort",

    NAME: "recordsetSort",

    ATTRS: {
		lastSortProperties: {
			value: {
				field:undefined,
				desc:true,
				sorter:undefined
			},
			validator: function(v) {
				return (isValue(v.field) && isValue(v.desc) && isValue(v.sorter));
			}
		},

        defaultSorter: {
            value: function(recA, recB, field, desc) {
                var sorted = Compare(recA.getValue(field), recB.getValue(field), desc);
                if(sorted === 0) {
                    return Compare(recA.get("id"), recB.get("id"), desc);
                }
                else {
                    return sorted;
                }
            }
        },

		isSorted: {
			value: false,
			valueFn: "_getState"
		}
    }
});

Y.extend(RecordsetSort, Y.Plugin.Base, {
    initializer: function(config) {
        this.publish("sort", {defaultFn: Y.bind("_defSortFn", this)});
    },

    destructor: function(config) {
    },

	_getState: function() {
		var host = this.get('host'),
			checker = Y.bind(function() {
				this.set('isSorted',false);
			}, this);
		
		this.on("sort", function() {
		 	this.set('isSorted', true);
		});
		
		this.onHostEvent('add', checker, host);
		this.onHostEvent('update', checker, host);
	},

    _defSortFn: function(e) {
		this.set('lastSortProperties', e);
		
		//have to work directly with _items here - changing the recordset.
        this.get("host")._items.sort(function(a, b) {
			return (e.sorter)(a, b, e.field, e.desc);
		});
    },

    sort: function(field, desc, sorter) {
		this.fire("sort", {field:field, desc: desc, sorter: sorter || this.get("defaultSorter")});
    },

	resort: function() {
		var p = this.get('lastSortProperties');
		this.fire("sort", {field:p.field, desc: p.desc, sorter: p.sorter || this.get("defaultSorter")});
	},

    reverse: function() {
		this.get('host')._items.reverse();
    },

	//flips the recordset based on the same sort method that user had defined
	flip: function() {
		var p = this.get('lastSortProperties');
		
		//If a predefined field is not provided by which to sort by, throw an error
		if (isValue(p.field)) {
			this.fire("sort", {field:p.field, desc: !p.desc, sorter: p.sorter || this.get("defaultSorter")});
		}
		else {
		}
	}
});

Y.namespace("Plugin").RecordsetSort = RecordsetSort;



}, '@VERSION@' ,{requires:['recordset-base','arraysort','plugin']});
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
		
		
		//TODO: PARENT CHILD RELATIONSHIP
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
YUI.add('recordset-indexer', function(Y) {


function RecordsetIndexer(config) {
    RecordsetIndexer.superclass.constructor.apply(this, arguments);
}

Y.mix(RecordsetIndexer, {
    NS: "indexer",

    NAME: "recordsetIndexer",

    ATTRS: {
		hashTables: {
				value: {
					
				}
			},
			
			keys: {
				value: {
					
				}
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
       	//this.publish('hashKeyUpdate', {defaultFn:Y.bind('_defUpdateHashTable', this)});
       		
       	//create initial hash
       	//this.set('key', config.key || 'id');
    },

    destructor: function(config) {
    },

	_setHashTable: function(key) {
		var host = this.get('host'), obj = {}, i=0, len = host.getLength();
		
		for (; i<len; i++) {
			obj[host._items[i].getValue(key)] = host._items[i];
		}
		return obj;
	},

	createTable: function(key) {
		var tbls = this.get('hashTables');
		tbls[key] = this._setHashTable(key);
		this.set('hashTables', tbls);
		
		return tbls[key];
	},
	
	getTable: function(key) {
		return this.get('hashTables')[key];
	},
	
	_defAddHash: function(e) {
		var tbl = this.get('hashTables');
		
		
		//Go through every hashtable that is stored.
		//in each hashtable, look to see if the key is represented in the object being added.
		Y.each(tbl, function(v,key) {
			Y.each(e.added || e.updated, function(o) {
				//if the object being added has a key which is being stored by hashtable v, add it into the table.
				if (o.getValue(key)) {
					v[o.getValue(key)] = o;
				}
			});
		});
		
	},
	
	_defRemoveHash: function(e) {
		var tbl = this.get('hashTables'), reckey;
		
		//Go through every hashtable that is stored.
		//in each hashtable, look to see if the key is represented in the object being deleted.
		Y.each(tbl, function(v,key){
			Y.each(e.removed || e.overwritten, function(o) {
				reckey = o.getValue(key);

				//if the hashtable has a key storing a record, and the key and the record both match the record being deleted, delete that row from the hashtable
				if (reckey && v[reckey] === o) {
					delete v[reckey];
				}
			});
		}); 
	},
	
	_defUpdateHash: function(e) {
			e.added = e.updated;
			e.removed = e.overwritten;
			this._defAddHash(e);
			this._defRemoveHash(e);		// 
	// 				// 
	// 				// var tbl = this.get('hashTables'), reckey;
	// 				// 
	// 				// Y.each(tbl, function(v, key) {
	// 				// 	Y.each(e.updated, function(o, i) {
	// 				// 		
	// 				// 		//delete record from hashtable if it has been overwritten
	// 				// 		reckey = o.getValue(key);
	// 				// 		
	// 				// 		if (reckey) {
	// 				// 			v[reckey] = o;
	// 				// 		}
	// 				// 		
	// 				// 		//the undefined case is if more records are updated than currently exist in the recordset. 
	// 				// 		if (e.overwritten[i] && (v[e.overwritten[i].getValue(key)] === e.overwritten[i])) {
	// 				// 			delete v[e.overwritten[i].getValue(key)];
	// 				// 		}
	// 				// 		
	// 				// 		// if (v[reckey] === o) {
	// 				// 		// 	delete v[reckey];
	// 				// 		// }
	// 				// 		// 				
	// 				// 		// //add the new updated record if it has a key that corresponds to a hash table
	// 				// 		// if (o.getValue(key)) {
	// 				// 		// 	v[o.getValue(key)] = o;
	// 				// 		// }
	// 				// 										
	// 				// 	});
	// 				// });
	}
	

	// _setHashKey: function(k) {
	// 	this.fire('hashKeyUpdate', {key:k});
	// 	return k;
	// },
	// 
	// _defUpdateHashTable: function(e) {
	// 	var host = this.get('host'), obj = {}, key=e.key, i=0, len=host.getLength();
	// 	
	// 	for (; i<len; i++) {
	// 		obj[host._items[i].getValue(key)] = host._items[i];
	// 	}
	// 	this.set('table', obj);
	// },
	// 
	// _defAddHash: function(e) {
	// 	var obj = this.get('table'), key = this.get('key'), i=0;
	// 	for (; i<e.added.length; i++) {
	// 		obj[e.added[i].getValue(key)] = e.added[i];			
	// 	}
	// 	this.set('table', obj);
	// },
	// 
	// _defRemoveHash: function(e) {
	// 	var obj = this.get('table'), key = this.get('key'), i=0;
	// 	for (; i<e.removed.length; i++) {
	// 		delete obj[e.removed[i].getValue(key)];
	// 	}
	// 	this.set('table', obj);
	// },
	// 
	// _defUpdateHash: function(e) {
	// 	var obj = this.get('table'), key = this.get('key'), i=0;
	// 	
	// 	//deletes the object key that held on to an overwritten record and
	// 	//creates an object key to hold on to the updated record
	// 	for (; i < e.updated.length; i++) {
	// 		delete obj[e.overwritten[i].get(key)];
	// 		obj[e.updated[i].getValue(key)] = e.updated[i]; 
	// 	}
	// 	this.set('table', obj);
	//}
	
	
});
Y.namespace("Plugin").RecordsetIndexer = RecordsetIndexer;



}, '@VERSION@' ,{requires:['recordset-base','plugin']});


YUI.add('recordset', function(Y){}, '@VERSION@' ,{use:['recordset-base','recordset-sort','recordset-filter','recordset-indexer']});

