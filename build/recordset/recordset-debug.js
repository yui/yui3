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
		else {
			return this.get("data")[field];
		}
		return null;
    }
},
{
	ATTRS: {
	    id: {
	        valueFn: "_setId",
	        writeOnce: true
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
		this.publish('add', {defaultFn: Bind("_defAddFn", this)});
		this.publish('remove', {defaultFn: Bind("_defRemoveFn", this)});
		this.publish('empty', {defaultFn: Bind("_defEmptyFn", this)});
		this.publish('update', {defaultFn: Bind("_defUpdateFn", this)});
		
		this._recordsetChanged();
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
			rec = e.added,
			index = e.index;
		//index = (Y.Lang.isNumber(index) && (index > -1)) ? index : len;
		
		if (index === len) {
			this._items.push(rec);
		}
		else {
			this._items.splice(index,0,rec);
		}
		Y.log('add Fired');
	},
	
	_defRemoveFn: function(e) {
		if (e.index === 0) {
			this._items.pop();
		}
		else {
			this._items.splice(e.index,e.range);
		}
		
		Y.log('remove fired');
	},
	
	_defEmptyFn: function(e) {
		this._items = [];
		Y.log('empty fired');
	},
	
	_defUpdateFn: function(e) {
		
		for (var i=0; i<e.updated.length; i++) {
			this._items[e.index + i] = this._changeToRecord(e.updated[i]);
		}
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
			Y.log('change fire');
			this.fire('change', {});
		});
	},


	
	//---------------------------------------------
    // Public Methods
    //---------------------------------------------
	
	/**
     * Returns the record at a particular index
     *
     * @method getRecord
     * @param i {Number} Index at which the required record resides
     * @return {Y.Record} An Y.Record instance
     * @public
     */
    getRecord: function(i) {
        return this._items[i];
    },
	
	/**
     * Returns a range of records beginning at particular index
     *
     * @method getRecord
     * @param index {Number} Index at which the required record resides
	 * @param range {Number} (Optional) Number of records to retrieve. The default is 1
     * @return {Array} An array of Y.Record instances
     * @public
     */
	getRecords: function(index, range) {
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
		
		var newRecords=[], idx, i;		
		idx = (Y.Lang.isNumber(index) && (index > -1)) ? index : this._items.length;
		//Passing in array of object literals for oData
		if (Y.Lang.isArray(oData)) {
			newRecords = [];

			for(i=0; i < oData.length; i++) {
				newRecords[i] = this._changeToRecord(oData[i]);
				this.fire('add', {added:newRecords[i], index:idx+i});
			}

		}
		//If it is an object literal of data or a Y.Record
		else if (Y.Lang.isObject(oData)) {
			this.fire('add', {added:this._changeToRecord(oData), index:idx});
		}
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
		var rec, arr;
		
		//Whatever is passed in, we are changing it to an array so that it can be easily iterated in the _defUpdateFn method
		arr = (!(Y.Lang.isArray(data))) ? [data] : data;
		rec = this._items.slice(index, index+arr.length);
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
                // ...unless we don't care about live object references
                this._items = Y.Array(records);
            },
			//initialization of the attribute must be done before the first call is made.
			//see http://developer.yahoo.com/yui/3/api/Attribute.html#method_addAttr for details on this
			lazyAdd: false
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
		Y.log('sort fired');
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
			Y.log('You called flip before setting a field by which to sort by. Maybe you meant to call reverse().');
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
		hash: {
			valueFn: "_setDefaultHash",
			lazyAdd: false
		},
		
		defaultKey: {
			value: "id"
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



}, '@VERSION@' ,{requires:['recordset-base','plugin']});


YUI.add('recordset', function(Y){}, '@VERSION@' ,{use:['recordset-base','recordset-sort','recordset-filter','recordset-indexer']});

