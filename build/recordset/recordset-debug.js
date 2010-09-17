YUI.add('recordset', function(Y) {

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
function Recordset(config) {
    Recordset.superclass.constructor.apply(this, arguments);
}

/**
 * TODO: make recordsetChangedEvent fire through bubbling of other events 
 * TODO: figure out what object to send through recordsetChangedEvent when recordset is emptied
 * TODO: finish updateRecord to make it work with indices, specific records, arrays
 * TODO: update getRecord to return array of records
 * TODO: Implement methods: hasRecord(), reverseRecords(), sortRecords(), toString(), getLength()
 */

/**
 * Class name.
 *
 * @property NAME
 * @type String
 * @static
 * @final
 * @value "recordset"
 */
Recordset.NAME = "recordset";

/////////////////////////////////////////////////////////////////////////////
//
// Recordset Attributes
//
/////////////////////////////////////////////////////////////////////////////
Recordset.ATTRS = {
    records: {
        value: null,
        setter: "_setRecords"
    },
    
    length: {
        value: 0,
        readOnly:true
    }
};

/* Recordset extends Base */
Y.extend(Recordset, Y.Base, {
    _setRecords: function(allData) {
        var records = [];

        function initRecord(oneData){
            records.push(new Y.Record({data:oneData}));
        }

        Y.Array.each(allData, initRecord);
        return records;
    },

    initializer: function() {
    },
    
    destructor: function() {
    },
	
	/**
     * Utility method called upon by add() - it is used to create a new record(s) in the recordset
     *
     * @method _add
     * @param aRecord {Y.Record} A Y.Record instance
     * @param index {Number} (optional) Index at which to add the record(s)
     * @return {Y.Record} A Record instance.
     * @private
     */
	_add: function(aRecord, index) {
		index = (Y.Lang.isNumber(index) && (index > -1)) ? index : this.get('records').length;
		this.get('records').splice(index,0,aRecord);
		
		return aRecord;
	},
	
	
	/**
     * Utility method called upon by update() - it has some controller logic built in to update the recordset correctly
     *
     * @method _updateGivenArray
     * @param arr {Array} An array of object literals or Y.Record instances
     * @param index {Number} The index at which to update the records.
     * @param overwriteFlag {boolean} (optional) A boolean to represent whether or not you wish to over-write the existing records with records from your recordset. Default is false. The first record is always overwritten.
     * @private
     */
	_updateGivenArray: function(arr, index, overwriteFlag) {
		var j=0,
		 	rs = this,
			oData;
			
		for (; j < arr.length; j++) {
			oData = arr[j];
			
			//Arrays at the first index will always overwrite the one they are updating.
			switch (j) {
				case 0:
					this.get('records').splice(index, 1, this._changeToRecord(oData));
					break;
				default:
					this._updateGivenObject(oData, index+j, overwriteFlag);
					break;
			}
		}
	}, 
	
	_updateGivenObject: function(obj, index, overwriteFlag) {
		var oRec = this._changeToRecord(obj);
						
		//If overwrite is set to true, splice and remove the record at current entry, otherwise just add it
		if (overwriteFlag) {
			this.get('records').splice(index,1,oRec);
		}
		else {
			this.get('records').splice(index,0,oRec);
		}
	},
	
	//Take an object and create a record out of it, then return it
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
    // Event Firing
    //---------------------------------------------
	
	/**
     * Event that is fired whenever the recordset is changed. Note that multiple simultaneous changes still fires this event once.
	 * (ie: Adding multiple records via an array will only fire this event once at the completion of all the additions)
     *
     * @method _recordSetUpdated
     * @param idx {Number} Index at which the modifications to the recordset were made
     * @private
     */
	_recordsetChanged: function(idx) {
		Y.log('recordsetChangedEvent fired');
		this.fire('recordsetChangedEvent', {index: idx});
	},
	
	/**
     * Event that is fired whenever the a record is added to the recordset. Multiple simultaneous changes still fires this event once.
     *
     * @method _recordAdded
	 * @param oRecord {Array} The record that was added, or an array of records added
     * @param i {Number} Index at which the modifications to the recordset were made
     * @private
     */
	_recordAdded: function(oRecord, i) {
		this.fire('recordsetAddedEvent', {data:oRecord, index: i});
		Y.log('recordsetAdded Event Fired');
	},
	
	/**
     * Event that is fired whenever the a record is removed from the recordset. Multiple simultaneous changes still fires this event once.
     *
     * @method _recordDeleted
	 * @param oRecord {Array} An array of Y.Records that were deleted
     * @param idx {Number} Index at which the modifications to the recordset were made
     * @private
     */
	_recordRemoved: function(oRecord, idx) {
		this.fire('recordsetRemovedEvent', {data:oRecord, index: idx});
		Y.log('recordsetRemoved Event Fired');
	},
	
	/**
     * Event that is fired when the record set is emptied
     *
     * @method _recordsetEmptied
     * @private
     */
	_recordsetEmptied: function() {
		//TODO: What configuration object should be sent here?
		this.fire('recordsetEmptiedEvent', {});
		Y.log('recordsetEmptied Event Fired');
	},
	
	_recordsetUpdated: function(oRecord, record) {
		this.fire('recordsetUpdatedEvent', {oldRecord:oRecord, newRecord:record});
		Y.log('recordsetUpdated Event Fired');
	},
	
	//---------------------------------------------
    // Public Methods
    //---------------------------------------------
	
	/**
     * Returns the record at a particular index
     *
     * @method getRecord
     * @param index {Number} Index at which the required record resides
     * @return {Y.Record} An Y.Record instance
     * @public
     */
    getRecord: function(index) {
        return this.get("records")[index];
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
		
		returnedRecords = this.get('records').splice(index, range);
		return returnedRecords;
	},
		
	/**
     * Returns a string of values for a specified key in the recordset
     *
     * @method getRecord
     * @param index {Number} (optional) Index at which the required record resides
     * @return {Y.Record} An Y.Record instance
     * @public
     */
	getValuesByKey: function(key) {
		var i = 0, len = this.get('records').length, retVals = [];
		for( ; i < len; i++) {
			retVals.push(this.getRecord(i).getValue(key));
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
		
		var oRecord, newRecords=[], idx, i;		
		
		//Passing in array of object literals for oData
		if (Y.Lang.isArray(oData)) {
			newRecords = [];
			idx = (Y.Lang.isNumber(index) && (index > -1)) ? index : this.get('records').length;
			
			for(i=0; i < oData.length; i++) {
					oRecord = new Y.Record({data:oData[i]});
					newRecords[i] = this._add(oRecord, idx);
					delete oRecord;
					idx++;
			}

		}
		//If it is an object literal of data
		else if (Y.Lang.isObject(oData) && !(oData instanceof Y.Record)) {
			oRecord = new Y.Record({data:oData});
			newRecords[0] = this._add(oRecord, index);
		}
		
		//it is an instance of Y.Record - checking explicitly here so nothing weird gets through
		else if (oData instanceof Y.Record){
			 newRecords[0] = this._add(oRecord, index);
		}
		this._recordAdded(newRecords, index);
		this._recordsetChanged(index);
		
		//return an object literal, containing array of new Y.Record instances
		return ({data: newRecords, index:index});
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
		index = (Y.Lang.isNumber(index) && (index > -1)) ? index : this.get('records').length-1;
		range = (Y.Lang.isNumber(range) && (range > 0)) ? range : 1;

		//Remove records and store them in remRecords
		remRecords = this.get('records').splice(index,range);
		
		//Fire events
		this._recordRemoved(remRecords, index);
		this._recordsetChanged(index);
		
		return ({data: remRecords, index:index}); 
		

	},
	
	/**
     * Empties the recordset
     *
     * @method empty
     * @public
     */
	empty: function() {
		this.set('records').value = [];
		this._recordsetEmptied();
		
		//TODO: What index should be sent to recordSetUpdatedEvent when the recordset is emptied?
		this._recordsetChanged(0);
		
		return null
	},
	
	update: function(oData, index, overwriteFlag) {
		 
		//var rs = this, oRec;
		
		//If passing in an array
		if (Y.Lang.isArray(oData)) {
			this._updateGivenArray(oData, index, overwriteFlag);			
		}
		
		else if (Y.Lang.isObject(oData)) {
			
			//If its just an object, it will overwrite the existing one, so passing in true
			this._updateGivenObject(oData, index, true);
		}
		
		//this._recordsetUpdated(oRecord, oData);
		//console.log(this.get('records'));
		
		return null;
	}
	
	
});

Y.Recordset = Recordset;


}, '@VERSION@' ,{requires:['base','record']});
