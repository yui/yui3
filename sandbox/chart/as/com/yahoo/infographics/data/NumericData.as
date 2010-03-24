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
	}
}
