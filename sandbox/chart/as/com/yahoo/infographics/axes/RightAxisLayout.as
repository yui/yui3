package com.yahoo.infographics.axes
{
	import flash.geom.Point;

	/**
	 * Algorithms for positioning contents of a right aligned axis.
	 */
	public class RightAxisLayout extends VerticalAxisLayout implements IAxisLayout
	{
		/**
		 * Constructor
		 */
		public function RightAxisLayout()
		{
		}

		/**
		 * @copy com.yahoo.infographics.axes.IAxisLayout#contentPosition
		 */
		override public function get contentPosition():Point
		{
			return new Point(this._calculateSizeByTickLength ? this._leftTickOffset : 0, 0);
		}
		
		/**
		 * @copy com.yahoo.infographics.axes.IAxisLayout#getTickCoords()
		 */
		public function getTickCoords(point:Point):Object
		{
			var startPoint:Point = point.clone();
			startPoint.x -= this._leftTickOffset;
			var endPoint:Point = point.clone();
			endPoint.x += this._rightTickOffset;
			
			return {startPoint:startPoint, endPoint:endPoint};
		}

		/**
		 * @copy com.yahoo.infographics.axes.IAxisLayout#getLabelPoint()
		 */
		public function getLabelPoint(point:Point):Point
		{
			var labelPoint:Point = point.clone();
			labelPoint.x += this._rightTickOffset;
			return labelPoint;
		}

		/**
		 * @copy com.yahoo.infographics.axes.IAxisLayout#contentWidth
		 */
		override public function get contentWidth():Number
		{
			var w:Number = this._calculateSizeByTickLength ? this._maxTickLength : this._rightTickOffset;
			w += this._maxLabelWidth;
			return w;
		}

		/**
		 * @private (override)
		 */
		override protected function setTickOffsets(value:Object):void
		{
			this._leftTickOffset = 0;
			this._rightTickOffset = 0;
			var tickLength:Number = Number(value.length);
			switch(value.display)
			{
				case "inside" :
					this._leftTickOffset = tickLength;
				break;
				case "outside" : 
					this._rightTickOffset = tickLength;
				break;
				case "cross":
					this._rightTickOffset = this._leftTickOffset = tickLength * 0.5;
				break;
			}
			this._maxTickLength = this._majorTickLength = tickLength;
		}
	}
}
