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

	}
}
