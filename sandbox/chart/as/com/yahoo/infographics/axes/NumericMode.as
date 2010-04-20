package com.yahoo.infographics.axes
{
	import com.yahoo.infographics.data.AxisData;
	import com.yahoo.datatype.NumberFormat;

	/**
	 * Algorithms for creating label text for a Numeric axis.
	 */
	public class NumericMode extends BaseAxisMode implements IAxisMode
	{
		/**
		 * Constructor
		 */
		public function NumericMode(value:AxisData, props:Object = null)
		{
			this._format = new NumberFormat();
			this.labelFunction = this._format.parse as Function;
			super(value, props);
		}
		
		/**
		 * @private
		 */
		private var _format:NumberFormat;

		/**
		 * @private (override)
		 */
		override public function set props(value:Object):void
		{
			super.props = value;
			if(value.hasOwnProperty("prefix")) this._format.prefix = value.prefix;
			if(value.hasOwnProperty("suffix")) this._format.suffix = value.suffix;
			if(value.hasOwnProperty("thousandsSeparator")) this._format.thousandsSeparator = value.thousandsSeparator;
			if(value.hasOwnProperty("decimalSeparator")) this._format.decimalSeparator = value.decimalSeparator;
			if(value.hasOwnProperty("decimalPlaces")) this._format.decimalPlaces = value.decimalPlaces;
			if(value.hasOwnProperty("rounding")) this._format.rounding = value.rounding; 
		}

		/**
		 * @copy com.yahoo.infographics.IAxisMode#getLabelAtPosition()
		 */
		public function getLabelAtPosition(position:Number, length:Number):String
		{
			var min:Number = Number(this._data.minimum);
			position = (position/length * (Number(this._data.maximum) - min)) + min;
			return this.labelFunction(position);
		}
		
		/**
		 * @copy com.yahoo.infographics.axes.IAxisMode#getLabelByKey()
		 */
		public function getLabelByIndex(key:String, index:int):String
		{
			var dataCollection:Array = this._data.getDataByKey(key),
				value:Object = dataCollection[index];
			return this.labelFunction(value);
		}
		
		public var labelFunction:Function;
	}


}
