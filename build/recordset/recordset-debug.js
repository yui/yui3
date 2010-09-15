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

    initializer: function() {
    },

    destructor: function() {
    },
    
    getValue: function(field) {
		if (!field) {
        	return this.get("data");
		}
		else {
			
			//This should remain [field] instead of .field, because [field] can handle strings
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
     * Utility method called upon by addRecord() - it is used to create a new record(s) in the recordset
     *
     * @method _addRecord
     * @param aData {Object, Array} An object literal of data or an array of object literals
     * @param index {Number} (optional) Index at which to add the record(s)
     * @return {Y.Record} A Record instance.
     * @private
     */
	_addRecord: function(aData, index) {
		var oRecord = new Y.Record({data:aData});

		index = (Y.Lang.isNumber(index) && (index > -1)) ? index : this.get('records').length;
		this.get('records').splice(index,0,oRecord);
		
		return oRecord;
	},
	
	
	
	//---------------------------------------------
    // Event Firing
    //---------------------------------------------
	
	/**
     * Event that is fired whenever the recordset is changed. Note that multiple simultaneous changes still fires this event once.
	 * (ie: Adding multiple records via an array will only fire this event once at the completion of all the additions)
     *
     * @method _recordSetUpdated
     * @param i {Number} (optional) Index at which the modifications to the recordset were made
     * @private
     */
	_recordsetChanged: function(i) {
		Y.log('recordsetChangedEvent fired');
		this.fire('recordsetChangedEvent', i);
	},
	
	/**
     * Event that is fired whenever the a record is added to the recordset. Multiple simultaneous changes still fires this event once.
     *
     * @method _recordAdded
	 * @param oRecord {Y.Record || Array of Y.Record} The record that was added, or an array of records added
     * @param i {Number} (optional) Index at which the modifications to the recordset were made
     * @private
     */
	_recordAdded: function(oRecord, i) {
		this.fire('recordsetAddedEvent', {data:oRecord, index: i});
		Y.log('recordsetAdded Event Fired');
	},
	
	/**
     * Event that is fired whenever the a record is deleted from the recordset. Multiple simultaneous changes still fires this event once.
     *
     * @method _recordDeleted
	 * @param oRecord {Y.Record || Array of Y.Record} The record that was deleted or an array of records deleted
     * @param i {Number} (optional) Index at which the modifications to the recordset were made
     * @private
     */
	_recordDeleted: function(oRecord, i) {
		this.fire('recordsetDeletedEvent', {data:oRecord, index: i});
		Y.log('recordsetDeleted Event Fired');
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
     * @param index {Number} (optional) Index at which the required record resides
     * @return {Y.Record} An Y.Record instance
     * @public
     */
    getRecord: function(index) {
        return this.get("records")[index];
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
     * @method addRecord
     * @param oData {Object, Array} An object literal of data or an array of object literals
     * @param index {Number} (optional) Index at which to add the record(s)
     * @return {object} An object literal with two properties: "data" which contains {Y.Record or Y.Recordset} and "index" which contains the index where the Y.Record(s) were added
     * @public
     */
	addRecord: function(oData, index) {
		
		var newRecord, newRecords, idx, i;		
		
		//Passing in array for oData
		if (Y.Lang.isArray(oData)) {
			newRecords = [];
			idx = (Y.Lang.isNumber(index) && (index > -1)) ? index : this.get('records').length;
			
			for(i=0; i < oData.length; i++) {
					newRecord = this._addRecord(oData[i], idx);
					newRecords.push(newRecord);
					idx++;
			}
			
			this._recordAdded(newRecords, index);
			this._recordsetChanged(index);
			return ({data:newRecords, index:index});
		}
		
		//If it is not an array
		else {
			newRecord = this._addRecord(oData, index);
			this._recordAdded(newRecord, index);
			this._recordsetChanged(index);
			return ({data:newRecord, index:index});
		}
		return null;
	},
	
	/**
     * Deletes one or more Records to the RecordSet at the given index. If index is null,
     * then deletes a single Record from the end of the RecordSet.
     *
     * @method deleteRecord
     * @param index {Number} (optional) Index at which to remove the record(s) from
     * @param range {Number} (optional) Number of records to remove (including the one at the index)
     * @return {object} An object literal with two properties: "data" which contains the removed set {Y.Record or Y.Recordset} and "index" which contains the index where the Y.Record(s) were removed from
     * @public
     */
	deleteRecord: function(index, range) {
		var i=0, delRecords=[];
		
		//Default is remove only the last record
		index = (Y.Lang.isNumber(index) && (index > -1)) ? index : this.get('records').length;
		range = (Y.Lang.isNumber(range) && (range > 0)) ? range : 1;
		
		for ( ; i < range; i++) {
			
			//Deep clone the records that are going to be deleted, and populate the delRecords array with them
			delRecords.push(Y.clone(this.get('records')[index+i]));
		}
		
		//Remove the cloned records
		this.get('records').splice(index,range);
		
		//If there is only 1 Record object in the array, return the object. Else, return entire array
		if (delRecords.length == 1) {
			this._recordDeleted(delRecords[0], index);
			return ({data: delRecords[0], index:index});
		}
		else {
			this._recordDeleted(delRecords, index);
			return ({data: delRecords, index:index});
		}
		
		this._recordsetChanged(index);
		return null;

	},
	
	/**
     * Deletes one or more Records to the RecordSet at the given index. If index is null,
     * then deletes a single Record from the end of the RecordSet.
     *
     * @method deleteRecord
     * @param index {Number} (optional) Index at which to remove the record(s) from
     * @param range {Number} (optional) Number of records to remove (including the one at the index)
     * @return {object} An object literal with two properties: "data" which contains the removed set {Y.Record or Y.Recordset} and "index" which contains the index where the Y.Record(s) were removed from
     * @public
     */
	empty: function() {
		this.set('records').value = [];
		this._recordsetEmptied();
		
		//TODO: What index should be sent to recordSetUpdatedEvent when the recordset is emptied?
		this._recordsetChanged(0);
	},
	
	updateRecord: function(record, index) {
		oRecord = this.getRecord(index);
		this.get('records').splice(index,1,record);
		
		this._recordsetUpdated(oRecord, record);
		
		return null;
	}
	
	
});

Y.Recordset = Recordset;


}, '@VERSION@' ,{requires:['base','record']});
