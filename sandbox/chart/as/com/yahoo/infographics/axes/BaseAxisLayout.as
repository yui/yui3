package com.yahoo.infographics.axes
{
	import flash.geom.Point;
	import flash.events.EventDispatcher;
	import com.yahoo.renderers.events.RendererEvent;

	/**
	 * Base class for axis layout classes.
	 * @see com.yahoo.infographics.axes.HorizontalAxisLayout
	 * @see com.yahoo.infographics.axes.VerticalAxisLayout
	 * @see com.yahoo.infographics.axes.LeftAxisLayout
	 * @see com.yahoo.infographics.axes.RightAxisLayout
	 * @see com.yahoo.infographics.axes.TopAxisLayout
	 * @see com.yahoo.infographics.axes.BottomAxisLayout
	 */
	public class BaseAxisLayout extends EventDispatcher
	{
		/**	
		 * @copy com.yahoo.infographics.axes.IAxisLayout#contentPosition
		 */
		public function get contentPosition():Point
		{
			return new Point(0, 0);
		}
		
		/**
		 * @private
		 * Storage for maxLabelWidth
		 */
		protected var _maxLabelWidth:Number = 0;

		/**
		 * @copy com.yahoo.infographics.axes.IAxisLayout#maxLabelWidth
		 */
		public function get maxLabelWidth():Number
		{
			return this._maxLabelWidth;
		}

		/**
		 * @copy com.yahoo.infographics.axes.IAxisLayout#contentWidth
		 */
		public function get contentWidth():Number
		{
			//override in subclass
			return 0;
		}

		/**
		 * @copy com.yahoo.infographics.axes.IAxisLayout#contentHeight
		 */
		public function get contentHeight():Number
		{
			//override in subclass
			return 0;
		}

		/**
		 * @private
		 */
		protected var _maxLabelHeight:Number = 0;

		/**
		 * @copy com.yahoo.infographics.axes.IAxisLayout#maxLabelHeight
		 */
		public function get maxLabelHeight():Number
		{
			return this._maxLabelHeight;
		}

		/**
		 * @private 
		 * Storage for calculateSizeByTickLength
		 */
		protected var _calculateSizeByTickLength:Boolean;

		/**
		 * @copy com.yahoo.infographics.axes.IAxisLayout#calculateSizeByTickLength
		 */
		public function get calculateSizeByTickLength():Boolean
		{
			return this._calculateSizeByTickLength;
		}

		/**
		 * @private (setter)
		 */
		public function set calculateSizeByTickLength(value:Boolean):void
		{
			this._calculateSizeByTickLength = value;
		}

		/**
		 * @copy com.yahoo.infographics.axes.IAxisLayout#lineStart
		 */
		public function get lineStart():Point
		{
			return new Point(0, 0);
		}

		/**
		 * @private (protected)
		 */
		protected var _leftPadding:Number = 0;

		/**
		 * @private (protected)
		 */
		protected var _rightPadding:Number = 0;

		/**
		 * @private (protected)
		 */
		protected var _topPadding:Number = 0;

		/**
		 * @private (protected)
		 */
		protected var _bottomPadding:Number = 0;

		/**
		 * @private (protected)
		 */
		protected var _leftTickOffset:Number = 0;

		/**
		 * @private (protected)
		 */
		protected var _topTickOffset:Number = 0;

		/**
	     * @private (protected)
		 */
		protected var _rightTickOffset:Number = 0;

		/**
		 * @private (protected)
		 */
		protected var _bottomTickOffset:Number = 0;

		/**
		 * @private (protected)
		 */
		protected var _specifiedWidth:Number = 0;

		/**
		 * @private (protected)
		 */
		protected var _specifiedHeight:Number = 0;

		/**
		 * @private (protected)
		 */
		protected var _majorTickLength:Number = 0;

		/**
		 * @private (protected)
		 */
		protected var _maxTickLength:Number = 0;
		
		/**
		 * @copy com.yahoo.infographics.axes.IAxisLayout#updateContentPosition()
		 */
		public function updateContentPosition(width:Number, height:Number):void
		{
			this._maxLabelWidth = Math.max(width, this._maxLabelWidth);
			this._maxLabelHeight = Math.max(height, this._maxLabelHeight);
		}

		/**
		 * @copy com.yahoo.infographics.axes.IAxisLayout#reset()
		 */
		public function reset(ticks:Object, dimensions:Object):void
		{
			this._maxLabelHeight = 0;
			this._maxLabelWidth = 0;
			this.setDimensions(dimensions);
			this.setTickOffsets(ticks);
		}

		/**
		 * @private (protected)
		 */
		protected function setDimensions(value:Object):void
		{
			this._leftPadding = value.left;
			this._rightPadding = value.right;
			this._topPadding = value.top;
			this._bottomPadding = value.bottom;
			this._specifiedWidth = value.width;
			this._specifiedHeight = value.height;
		}

		/**
		 * @private (protected)
		 */
		protected function setTickOffsets(value:Object):void
		{
			//override in subclasses
		}
	}
}
