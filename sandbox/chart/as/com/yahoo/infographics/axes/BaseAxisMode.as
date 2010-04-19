package com.yahoo.infographics.axes
{
	import com.yahoo.infographics.data.AxisData;

	/**
	 * Base class for creating label data for an axis.
	 */
	public class BaseAxisMode
	{
		/**
		 * Constructor
		 */
		public function BaseAxisMode(value:AxisData, props:Object):void
		{
			this._data = value;
			this.props = props;
		}

		/**
		 * @private (protected)
		 */
		protected var _data:AxisData;

		/**
		 * @private
		 * Storag for props
		 */
		private var _props:Object;
		
		/**
		 * Styles used for formatting labels.
		 */
		public function get props():Object
		{
			return this._props;
		}

		/**
		 * @private (setter)
		 */
		public function set props(value:Object):void
		{
			this._props = value;
		}

		/**
		 * @copy com.yahoo.infographics.IAxisMode#getTotalMajorUnits()
		 */
		public function getTotalMajorUnits(majorUnit:Object, length:Number):int
		{
			if(majorUnit.determinant == "count") return int(majorUnit.count);
			if(majorUnit.determinant == "distance") return int(length/Number(majorUnit.distance)) + 1;
			return 1;
		}
		/**
		 * @private
		 * Converts value to string
		 */
		protected function returnRaw(value:Object):String
		{
			return String(value);
		}
	}

}
