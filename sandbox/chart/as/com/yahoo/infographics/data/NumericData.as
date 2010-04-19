package com.yahoo.infographics.data
{
	import com.yahoo.util.NumberUtil;

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
			this._dataType = "numeric";
			super(dataProvider);
		}

		override protected function updateMinAndMax():void
		{
			super.updateMinAndMax();
			if(this.roundMinAndMax && !isNaN(this._roundingUnit))
			{
				var max:Number = Number(this._dataMaximum),
					min:Number = Number(this._dataMinimum);
				this._dataMaximum = NumberUtil.roundUpToNearest(max, this._roundingUnit);
				this._dataMinimum = NumberUtil.roundDownToNearest(min, this._roundingUnit);
			}
			if(this._alwaysShowZero)
			{
				this._dataMinimum = Math.min(0, Number(this._dataMinimum));
			}

		}

		/**
		 * @private
		 * Storage for alwaysShowZero
		 */
		private var _alwaysShowZero:Boolean = true;

		/**
		 * Indicates whether 0 should always be displayed.
		 */
		public function get alwaysShowZero():Boolean
		{
			return this._alwaysShowZero;
		}

		/**
		 * @private (setter)
		 */
		public function set alwaysShowZero(value:Boolean):void
		{
			if(value == this._alwaysShowZero) 
			{
				return;
			}
			this._alwaysShowZero = value;
			this.updateMinAndMax();
		}
	}
}
