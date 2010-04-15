package com.yahoo.infographics.axes
{
	import com.yahoo.infographics.data.AxisData;
	import com.yahoo.datatype.STRFTimeFormat;

	/**
	 * Algorithms for creating label text for a Numeric axis.
	 */
	public class TimeMode extends BaseAxisMode implements IAxisMode
	{
		/**
		 * Constructor
		 */
		public function TimeMode(value:AxisData, props:Object)
		{
			super(value, props);
		}
		
		/**
		 * @private (override)
		 */
		override public function set props(value:Object):void
		{
			if(value.hasOwnProperty("locale")) this._format.setLocale(String(value.locale));
			if(value.hasOwnProperty("pattern")) this._format.pattern = String(value.pattern);
			super.props = value;
		}

		/**
		 * @private
		 */
		private var _format:STRFTimeFormat = new STRFTimeFormat();

		/**
		 * @copy com.yahoo.infographics.axes.IAxisMode#getLabelAtPosition()
		 */
		public function getLabelAtPosition(position:Number, length:Number):String
		{
			var min:Number = Number(this._data.minimum);
			position = (position/length * (Number(this._data.maximum) - min)) + min;
			return this._format.parse(new Date(position));
		}

		/**
		 * @copy com.yahoo.infographics.axes.IAxisMode#getLabelByKey()
		 */
		public function getLabelByIndex(key:String, index:int):String
		{
			var dataCollection:Array = this._data.getDataByKey(key),
				value:Object = dataCollection[index];
			return this._format.parse(new Date(value));
		}
	}
}
