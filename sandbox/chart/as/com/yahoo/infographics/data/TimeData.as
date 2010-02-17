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
		override public function getKeyValueAt(key:String, index:int):Number
		{
			var value:Number = NaN;
			if(this.keys[key]) value = this.dateToNumber((this.keys[key] as Array)[index]);
			return value;
		}
		
		/**
		 * @private
		 */
		override protected function updateMinAndMax():void
		{
			var data:Array = this.data;
			var max:Number = 0;
			var min:Number = 0;
			if(data && data.length > 0)
			{
				var len:int = data.length;
				max = min = this.dateToNumber(data[0]);
				if(len > 1)
				{
					for(var i:int = 0; i < len; i++)
					{
						max = Math.max(max, this.dateToNumber(data[i]));
						min = Math.min(min, this.dateToNumber(data[i]));
					}
				}
			}
			this._dataMaximum = max;
			this._dataMinimum = min;
		}

		/**
		 * @private
		 */
		private function dateToNumber(value:Object):Number
		{
			if(value is Date) return (value as Date).valueOf();
			if(!(value is Number)) return new Date(value.toString()).valueOf();
			return value as Number;
		}
	}
}
