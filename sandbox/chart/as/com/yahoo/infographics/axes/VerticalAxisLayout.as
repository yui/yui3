package com.yahoo.infographics.axes
{
	import flash.geom.Point;

	/**
	 * Base class used for vertically aligned axis layout classes.
	 * @see com.yahoo.com.infographics.axes.LeftAxisLayout
	 * @see com.yahoo.com.infographics.axes.RightAxisLayout
	 */
	public class VerticalAxisLayout extends BaseAxisLayout
	{
		/**
		 * @copy com.yahoo.infographics.axes.IAxisLayout#length
		 */
		public function get length():Number
		{
			return this._specifiedHeight - (this._topPadding + this._bottomPadding);
		}

		/**
		 * @private
		 * Storage for sizeMode
		 */
		protected var _sizeMode:String = "hbox";

		/**
		 * @copy com.yahoo.infographics.axes.IAxisLayout#sizeMode
		 */
		public function get sizeMode():String
		{
			return this._sizeMode;
		}

		/**
		 * @copy com.yahoo.infographics.axes.IAxisLayout#lineEnd
		 */
		public function get lineEnd():Point
		{
			return new Point(0, this._specifiedHeight);
		}

		/**
		 * @copy com.yahoo.infographics.axes.IAxisLayout#getFirstPoint()
		 */
		public function getFirstPoint():Point
		{
			return new Point(this._leftPadding, this._specifiedHeight - this._bottomPadding);
		}
		
		/**
		 * @copy com.yahoo.infographics.axes.IAxisLayout#getNextPoint()
		 */
		public function getNextPoint(point:Point, majorUnitDistance:Number):Point
		{
			point.y = point.y - majorUnitDistance;
			return point;
		}

		/**
		 * @copy com.yahoo.infographics.axes.IAxisLayout#getLastPoint()
		 */
		public function getLastPoint():Point
		{
			return new Point(this._leftPadding, this._topPadding);
		}

		/**
		 * @copy com.yahoo.infographics.axes.IAxisLayout#getPosition()
		 */
		public function getPosition(point:Point):Number
		{
			var position:Number = (this._specifiedHeight - (this._topPadding + this._bottomPadding)) - (point.y - this._topPadding);
			return position;
		}
	}
}
