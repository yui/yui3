package com.yahoo.infographics.axes
{
	import flash.geom.Point;

	/**
	 * Algorithms for positioning the contents of a left aligned axis.
	 */
	public class LeftAxisLayout extends VerticalAxisLayout implements IAxisLayout
	{
		/**
		 * Constructor
		 */
		public function LeftAxisLayout()
		{
		}

		/**
		 * @copy com.yahoo.infographics.axes.IAxisLayout#contentPosition
		 */
		override public function get contentPosition():Point
		{
			return new Point(this._maxLabelWidth + this._leftTickOffset, 0);
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
			labelPoint.x -= this._leftTickOffset;
			return labelPoint;
		}
		
		/**
		 * @copy com.yahoo.infographics.axes.IAxisLayout#contentWidth
		 */
		override public function get contentWidth():Number
		{
			var w:Number = this.calculateSizeByTickLength ? this._maxTickLength : this._leftTickOffset;
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
					this._rightTickOffset = tickLength;
				break;
				case "outside" : 
					this._leftTickOffset = tickLength;
				break;
				case "cross":
					this._rightTickOffset = this._leftTickOffset = tickLength * 0.5;
				break;
			}
			this._maxTickLength = this._majorTickLength = tickLength;
		}
	}
}
