package com.yahoo.infographics.data
{
	/**
	 * Data class for category data.
	 */
	public class CategoryData extends AxisData
	{
		/**
		 * Constructor
		 */
		public function CategoryData(dataProvider:ChartDataProvider = null)
		{
			super(dataProvider);
			this._dataType = "category";
		}
		
		/**
		 * @private (override)
		 * Returns a numeric value based of a key value and an index.
		 */
		override public function getKeyValueAt(key:String, index:int):Number
		{
			var value:Number = NaN;
			if(this.keys[key]) value = index as Number;
			return value;
		}

		/**
		 * @private
		 */
		override protected function updateMinAndMax():void
		{
			this._dataMaximum = Object(Math.max(this.data.length - 1, 0));
			this._dataMinimum = Object(0);
		}

		override protected function setDataByKey(key:String):void
		{
			var obj:Object, arr:Array = [], labels:Array = [], dv:Array = this._dataClone.concat(), len:int = dv.length;
			for(var i:int = 0; i < len; i++)
			{
				obj = dv[i];
				arr[i] = i;
				labels[i] = obj[key];
			}
			this._keys[key] = arr;
			this._data = this._data.concat(labels);
		}
	}
}
