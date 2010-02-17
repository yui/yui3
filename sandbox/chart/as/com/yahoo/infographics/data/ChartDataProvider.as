package com.yahoo.infographics.data
{
	import flash.events.EventDispatcher;
	import com.yahoo.infographics.data.events.DataEvent;

	/**
	 * DataStructure that provides methods for setting and retrieving data and events
	 * to notify of changes in the data structure.
	 */
	public class ChartDataProvider extends EventDispatcher
	{
		/**
		 * Constructor
		 */
		public function ChartDataProvider(data:Array = null):void
		{
			super();
			this.data = data?data:[];
		}

		/**
		 * @private
		 * Storage for data
		 */
		private var _data:Array;

		/**
		 * Array of objects that contain the same key value structure.
		 *
		 * <code>
		 * [
		 * 	{key1:value, key2:value},
		 * 	{key1:value, key2:value}
		 * ]
		 * </code>
		 */
		public function get data():Array
		{
			return this._data;
		}

		/**
		 * @private (setter)
		 */
		public function set data(value:Array):void
		{
			if(value === this.data) return;
			this._data = value;
			this.dispatchEvent(new DataEvent(DataEvent.NEW_DATA));
		}

		/**
		 * Returns an array of values from the <code>data</code> array
		 * based on a string identifier.
		 *
		 * @param key The value used to determine what values will be 
		 * returned in the array.
		 */
		public function getDataByKey(key:String):Array
		{
			var len:int = this.data.length;
			var returnArray:Array = [];
			for(var i:int = 0; i < len; i++)
			{
				returnArray.push(this._data[i][key]);
			}
			return returnArray.concat();
		}

		/**
		 * Adds key value pairs to each object of the <code>data</code>
		 * array.
		 *
		 * @param key 
		 * @param data
		 */
		public function setDataByKey(key:String, data:Array):void
		{
			this.addArrayOfKeys(key, data);
			var event:DataEvent = new DataEvent(DataEvent.DATA_CHANGE);
			var changedKeys:Object = {};
			changedKeys[key] = data.concat();
			event.keysAdded = changedKeys;
			this.dispatchEvent(event);
		}

		/**
		 * Adds multiple key value pairs to each object of the <code>data</code>
		 * array.
		 *
		 * @param keys Hash of arrays.
		 */
		public function setDataByKeys(keys:Object):void
		{
			var changedKeys:Array = [];
			for(var i:String in keys)
			{
				this.addArrayOfKeys(i, keys[i]);
			}
			var event:DataEvent = new DataEvent(DataEvent.DATA_CHANGE);
			event.keysAdded = keys;
			this.dispatchEvent(event);
		}

		/**
		 * @private
		 */
		private function addArrayOfKeys(key:String, data:Array):void
		{
			var len:int = data.length;
			for(var i:int = 0; i < len; i++)
			{
				if(this._data[i]) 
				{
					this._data[i][key] = data[i];
				}
				else
				{
					var obj:Object = {};
					obj[key] = data[i];
					this._data.push(obj);
				}
			}
		}
	}
}
