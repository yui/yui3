package com.yahoo.infographics.data
{
	/**
	 * Data class for time data.
	 */
	public class TimeData extends AxisData
	{
		/**
		 * Constructor
		 */
		public function TimeData(dataProvider:ChartDataProvider = null)
		{
			super(dataProvider);
			this._dataType = "time";
		}
		
		/**
		 * @private (override)
		 */
		override protected function setDataByKey(key:String):void
		{
			var obj:Object, arr:Array = [], len:int, dv:Array = this._dataClone.concat(), i:int, val:Number;
			len = dv.length;
			for(i = 0; i < len; i = i + 1)
			{
				obj = dv[i][key];
				if(obj is Date)
				{
					val = (obj as Date).valueOf();
				}
				else if(!(obj is Number))
				{
					val = new Date(String(obj)).valueOf();
				}
				else
				{
					val = obj as Number;
				}
				arr[i] = val;
			}
			this._keys[key] = arr;
			this._data = this._data.concat(arr);
		}
	}
}
