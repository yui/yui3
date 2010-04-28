package com.yahoo.infographics.axes
{
	import com.yahoo.infographics.data.AxisData;

	/**
	 * Algorithms for creating label text for a Category axis.
	 */
	public class CategoryMode extends BaseAxisMode implements IAxisMode
	{
		/**
		 * Constructor
		 */
		public function CategoryMode(value:AxisData, props:Object)
		{
			super(value, props);
		}

		/**
		 * @copy com.yahoo.infographics.IAxisMode#getLabelAtPosition()
		 */
		public function getLabelAtPosition(position:Number, length:Number):String
		{
			var count:int = int(this._data.data.length) - 1;
			var index:int = int(position/(length/count));
			return this.labelFunction[this.props.func](this._data.data[index]);
		}
	
		/**
		 * @copy com.yahoo.infographics.axes.IAxisMode#getLabelByKey()
		 */
		public function getLabelByIndex(key:String, index:int):String
		{
			return this.labelFunction[this.props.func](this._data.data[index]);
		}
		
		/**
		 * @copy com.yahoo.infographics.IAxisMode#getTotalMajorUnits()
		 */
		override public function getTotalMajorUnits(majorUnit:Object, length:Number):int
		{
			return int(this._data.data.length);
		}

		/**
		 * @private
		 */
		private function augmentText(value:Object):String
		{
			var label:String = this.props.prefix ? String(this.props.prefix) : "";
			label += String(value);
			if(this.props.suffix) label += String(this.props.suffix);
			return label;
		}

		/**
		 * @private
		 * Map of label formatting functions.
		 */
		private var labelFunction:Object = {
			defaultFunction:returnRaw,
			augmentText:augmentText
		}
	}
}
