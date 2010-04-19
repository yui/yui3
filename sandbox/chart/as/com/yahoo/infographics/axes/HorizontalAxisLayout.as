package com.yahoo.infographics.axes
{
	import flash.geom.Point;

	/**
	 * Base class for horizontally aligned axis layout classes.
	 * @see com.yahoo.infographics.axes.TopAxisLayout
	 * @see com.yahoo.infographics.axes.BottomAxisLayout
	 */
	public class HorizontalAxisLayout extends BaseAxisLayout
	{
		/**
	     * @private
		 * Storage for sizeMode
		 */
		protected var _sizeMode:String = "vbox";

		/**
		 * @copy com.yahoo.infographics.axes.IAxisLayout#sizeMode
		 */
		public function get sizeMode():String
		{
			return this._sizeMode;
		}
		
		/**
		 * @copy com.yahoo.infographics.axes.IAxisLayout#length
		 */
		public function get length():Number
		{
			return this._specifiedWidth - (this._leftPadding + this._rightPadding);
		}

		/**
		 * @copy com.yahoo.infographics.axes.IAxisLayout#lineEnd
		 */
		public function get lineEnd():Point
		{
			return new Point(this._specifiedWidth, 0);
		}

		/**
		 * @copy com.yahoo.infographics.axes.IAxisLayout#getFirstPoint()
		 */
		public function getFirstPoint():Point
		{
			return new Point(this._leftPadding, this._topPadding);
		}
		
		/**
		 * @copy com.yahoo.infographics.axes.IAxisLayout#getNextPoint()
		 */
		public function getNextPoint(point:Point, majorUnitDistance:Number):Point
		{
			point.x = point.x + majorUnitDistance;		
			return point;
		}
		
		/**
		 * @copy com.yahoo.infographics.axes.IAxisLayout#getLastPoint()
		 */
		public function getLastPoint():Point
		{
			return new Point(this._specifiedWidth - this._rightPadding, this._topPadding);
		}

		/**
		 * @copy com.yahoo.infographics.axes.IAxisLayout#getPosition()
		 */
		public function getPosition(point:Point):Number
		{
			var position:Number = point.x - this._leftPadding;
			return position;
		}
	}
}
