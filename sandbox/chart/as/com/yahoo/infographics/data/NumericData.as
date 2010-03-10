package com.yahoo.infographics.data
{
	/**
	 * Data class for Numeric data.
	 */
	public class NumericData extends AxisData
	{
		/**
		 * Constructor
		 */
		public function NumericData(dataProvider:ChartDataProvider = null)
		{
			super(dataProvider);
			this._dataType = "numeric";
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
				var len:int = data.length
				max = min = Number(data[0]);
				if(len > 1)
				{
					for(var i:int = 1; i < len; i++)
					{	
						var num:Number = Number(data[i]);
						if(isNaN(num)) continue;
						max = Math.max(num, max);
						min = Math.min(num, min);
					}
				}
			}
			this._dataMaximum = Object(max);
			this._dataMinimum = Object(min);
		}

	}
}
