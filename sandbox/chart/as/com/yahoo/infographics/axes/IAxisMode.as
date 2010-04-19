package com.yahoo.infographics.axes
{
	/**
	 * Defines algorithms for managing axis data dependent on the axis type.
	 */
	public interface IAxisMode 
	{
		/**
		 * Styles used to format labels.
		 */
		function get props():Object

		/**
		 * @private (setter)
		 */
		function set props(value:Object):void

		/**
		 *  Returns a text to be used as a label based on position.
		 */
		function getLabelAtPosition(position:Number, length:Number):String
		
		/**
		 *  Returns a text to be used as a label based on index.
		 */
		function getLabelByIndex(key:String, index:int):String

		/**
		 * Returns number of total major units for the axis.
		 */
		function getTotalMajorUnits(majorUnit:Object, length:Number):int
	}
}
