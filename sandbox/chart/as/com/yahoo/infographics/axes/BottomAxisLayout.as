package com.yahoo.infographics.axes
{
	import flash.geom.Point;

	/**
	 * Algorithms for positioning contents for a bottom aligned axis.
	 */
	public class BottomAxisLayout extends HorizontalAxisLayout implements IAxisLayout
	{
		/**
		 * Constructor
		 */
		public function BottomAxisLayout()
		{
		}

		/**
		 * @copy com.yahoo.infographics.axes.IAxisLayout#contentPosition
		 */
		override public function get contentPosition():Point
		{
			return new Point(0, this._calculateSizeByTickLength ? this._topTickOffset : 0);
		}
		
		/**
		 * @copy com.yahoo.infographics.axes.IAxisLayout#getTickCoords()
		 */
		public function getTickCoords(point:Point):Object
		{
			var startPoint:Point = point.clone();
			startPoint.y -= this._topTickOffset;
			var endPoint:Point = point.clone();
			endPoint.y += this._bottomTickOffset;
			return {startPoint:startPoint, endPoint:endPoint};
		}

		/**
		 * @copy com.yahoo.infographics.axes.IAxisLayout#getLabelPoint()
		 */
		public function getLabelPoint(point:Point):Point
		{
			var labelPoint:Point = point.clone();
			labelPoint.y += this._bottomTickOffset;
			return labelPoint;
		}
		
		/**
		 * @copy com.yahoo.infographics.axes.IAxisLayout#contentHeight
		 */
		override public function get contentHeight():Number
		{
			var ht:Number = this._calculateSizeByTickLength ? this._maxTickLength : this._bottomTickOffset;
			ht += this._maxLabelHeight;
			return ht;
		}

		/**
		 * @private (override)
		 */
		override protected function setTickOffsets(value:Object):void
		{
			this._topTickOffset = 0;
			this._bottomTickOffset = 0;
			var tickLength:Number = Number(value.length);
			switch(value.display)
			{
				case "inside" :
					this._topTickOffset = tickLength;
				break;
				case "outside" : 
					this._bottomTickOffset = tickLength;
				break;
				case "cross":
					this._topTickOffset = this._bottomTickOffset = tickLength * 0.5;
				break;
			}
			this._maxTickLength = this._majorTickLength = tickLength;
		}
	}
}
