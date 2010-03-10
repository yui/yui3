package com.yahoo.infographics.data
{
	import flash.events.EventDispatcher;
	import com.yahoo.infographics.data.events.DataEvent;

	/**
	 * Base class for axis data classes
	 */
	public class AxisData extends EventDispatcher
	{
		/**
		 * Constructor
		 */
		public function AxisData(dataProvider:ChartDataProvider = null)
		{
			super();
			if(dataProvider) this.dataProvider = dataProvider;
		}

		/**
		 * @private (protected)
		 * Storage for dataType
		 */
		protected var _dataType:String;

		/**
		 * Returns the type of axis data
		 * <ul>
		 * 	<li><code>time</code></li>
		 * 	<li><code>numeric</code></li>
		 * 	<li><code>category</code></li>
		 * </ul>
		 */
		public function get dataType():String							   
		{
			return this._dataType;
		}

		/**
		 * @private
		 * Storage for dataProvider
		 */
		protected var _dataProvider:ChartDataProvider;

		/**
		 * Instance of <code>ChartDataProvider</code> that the class uses
		 * to build its own data.
		 */
		public function get dataProvider():ChartDataProvider
		{
			return this._dataProvider;
		}

		/**
		 * @private (setter)
		 */
		public function set dataProvider(value:ChartDataProvider):void
		{
			if(value === this.dataProvider) return;
			if(this.dataProvider) 
			{
				this.dataProvider.removeEventListener(DataEvent.NEW_DATA, this.newDataUpdateHandler);
				this.dataProvider.removeEventListener(DataEvent.DATA_CHANGE, this.keyDataUpdateHandler);
			}
			this._dataProvider = value;
			this.dataProvider.addEventListener(DataEvent.NEW_DATA, this.newDataUpdateHandler);
			this.dataProvider.addEventListener(DataEvent.DATA_CHANGE, this.keyDataUpdateHandler);
		}

		/**
		 * @private
		 * Storage for maximum when autoMax is false.
		 */
		private var _setMaximum:Object;

		/**
		 * @private
		 * Storage for dataMaximum
		 * is true.
		 */
		protected var _dataMaximum:Object;
		
		/**
		 * The maximum value contained in the <code>data</code> array. Used for
		 * <code>maximum</code> when <code>autoMax</code> is true.
		 */
		public function get dataMaximum():Object
		{
			return this._dataMaximum;
		}

		/**
		 * The maximum value that will appear on an axis.
		 */
		public function get maximum():Object
		{
			if(this.autoMax) return this.dataMaximum;
			return this._setMaximum;
		}

		/**
		 * @private (setter)
		 */
		public function set maximum(value:Object):void
		{
			this._setMaximum = value;
		}

		/**
		 * @private
		 * Storage for minimum when autoMin is false.
		 */
		private var _setMinimum:Object;

		/**
		 * @private
		 * Storage for dataMinimum. 
		 */
		protected var _dataMinimum:Object;

		/**
		 * The minimum value contained in the <code>data</code> array. Used for
		 * <code>minimum</code> when <code>autoMin</code> is true.
		 */
		public function dataMinimum():Object
		{
			return this._dataMinimum;
		}

		/**
		 * The minimum value that will appear on an axis.
		 */
		public function get minimum():Object
		{
			if(this.autoMin) return this._dataMinimum;
			return this._setMinimum;
		}

		/**
		 * @private
		 * Storage for autoMax
		 */
		private var _autoMax:Boolean = true;

		/**
		 * Determines whether the maximum is calculated or explicitly 
		 * set by the user.
		 */
		public function get autoMax():Boolean
		{
			return this._autoMax;
		}

		/**
		 * @private (setter)
		 */
		public function set autoMax(value:Boolean):void
		{
			this._autoMax = value;
		}

		/**
		 * @private 
		 * Storage for autoMin.
		 */
		private var _autoMin:Boolean = true;

		/**
		 * Determines whether the minimum is calculated or explicitly
		 * set by the user.
		 */
		public function get autoMin():Boolean
		{
			return this._autoMin;
		}

		/**
		 * @private (setter)
		 */
		public function set autoMin(value:Boolean):void
		{
			this._autoMin = value;
		}

		/**
		 * @private
		 * Storage for data
		 */
		protected var _data:Array = [];

		/**
		 * Array of axis data
		 */
		public function get data():Array
		{
			return this._data;
		}
		
		/**
		 * @private
		 * Storage for keys
		 */
		private var _keys:Object = {};

		/**
		 * Hash of array identifed by a string value.
		 */
		public function get keys():Object
		{
			return this._keys;
		}

		/**
		 * Adds an array to the key hash.
		 *
		 * @param value Indicates what key to use in retrieving
		 * the array.
		 */
		public function addKey(value:String):void
		{
			if(this.keys.hasOwnProperty(value)) return;
			var keyArray:Array  = this.dataProvider.getDataByKey(value);
			this._keys[value] = keyArray;
			var eventKeys:Object = {};
			eventKeys[value] = keyArray;
			this._data = this._data.concat(keyArray);
			this.updateMinAndMax();
			var event:DataEvent = new DataEvent(DataEvent.DATA_CHANGE);
			event.keysAdded = eventKeys; 
			this.dispatchEvent(event);
		}

		/**
		 * Removes an array from the key hash.
		 * 
		 * @param value Indicates what key to use in removing from 
		 * the hash.
		 * @return Boolean
		 */
		public function removeKey(value:String):void
		{
			if(!this.keys.hasOwnProperty(value)) return;
			var newKeys:Object = {};
			var newData:Array = [];
			var removedKeys:Object = {};
			removedKeys[value] = (this.keys[value] as Array).concat();
			for(var key:String in this.keys)
			{
				if(key == value) continue;
				var oldKey:Array = this.keys[key] as Array;
				newData = newData.concat(oldKey);
				newKeys[key] = oldKey;
			}
			this._keys = newKeys;
			this._data = newData;
			this.updateMinAndMax();
			var event:DataEvent = new DataEvent(DataEvent.DATA_CHANGE);
			event.keysRemoved = removedKeys;
			this.dispatchEvent(event);
		}

		/**
		 * Returns a numeric value based of a key value and an index.
		 */
		public function getKeyValueAt(key:String, index:int):Number
		{
			var value:Number = NaN;
			if(this.keys[key] && this.keys[key][index]) 
			{
				value = Number((this.keys[key] as Array)[index]);
			}
			return value;
		}

		/**
		 * @private (protected)
		 * Handles updates axis data properties based on the <code>DataEvent.NEW_DATA</code>
		 * event from the <code>dataProvider</code>.
		 */
		protected function newDataUpdateHandler(event:DataEvent):void
		{
			this._data = [];
			for(var i:String in this.keys)
			{
				this._keys[i] = this.dataProvider.getDataByKey(i);
				this._data = this._data.concat(this.keys[i]);
			}
			this.updateMinAndMax();
			var event:DataEvent = new DataEvent(DataEvent.NEW_DATA);
			event.keysAdded = this._keys;
			this.dispatchEvent(event);
		}

		/**
		 * @private (protected)
		 * Updates axis data properties based on the <code>DataEvent.DATA_CHANGE</code>
		 * event from the <code>dataProvider</code>.
		 */
		protected function keyDataUpdateHandler(event:DataEvent):void
		{
			var hasKey:Boolean = false;
			var keysAdded:Object = event.keysAdded;
			var keysRemoved:Object = event.keysRemoved;
			for(var i:String in this.keys)
			{
				if(keysAdded.hasOwnProperty(i))
				{
					hasKey = true;
					this.keys[i] = keys[i];
				}
				if(keysRemoved.hasOwnProperty(i))
				{
					hasKey = true;
					this.keys[i] = [];
				}
			}
			if(!hasKey) return;
			this._data = [];
			for(i in this.keys) this._data = this._data.concat(this.keys[i]);
			this.updateMinAndMax();
			var event:DataEvent = new DataEvent(DataEvent.DATA_CHANGE);
			event.keysAdded = keysAdded;
			event.keysRemoved = keysRemoved
			this.dispatchEvent(event);
		}

		/**
		 * @private (protected)
		 * Updates the <code>dataMaximum</code> and <code>dataMinimum</code> values.
		 */
		protected function updateMinAndMax():void
		{
			//abstract class
		}
	}
}
