package com.yahoo.infographics.series
{
	import flash.display.Sprite;
	import flash.display.DisplayObject;
	import flash.events.MouseEvent;

	public class SeriesMarker extends Sprite
	{
		function SeriesMarker()
		{
			super();
		}

		/**
		 * @private (protected)
		 * Storage for <code>series</code>
		 */
		protected var _series:ISeries;

		/**
		 * Reference to the <code>ISeries</code> instance.
		 */
		public function get series():ISeries
		{
			return this._series as ISeries;
		}

		/**
		 * @private (setter)
		 */
		public function set series(value:ISeries):void
		{
			this._series = value;
		}

		/**
		 * @private (protected)
		 * Storage for <code>index</code>
		 */
		protected var _index:int;

		/**
		 * Series index of marker
		 */
		public function get index():int
		{
			return this._index;
		}

		/**
		 * @private (setter)
		 */
		public function set index(value:int):void
		{
			this._index = value;
		}

		/**
		 * @private 
		 * Storage for the <code>width</code> property.
		 */
		protected var _width:Number = 0;

		/**
		 * @private (override)
		 */
		override public function set width(value:Number):void
		{
			if(this._skin) this._skin.width = value;
			this._width = value;
		}

		/**
		 * @private (setter)
		 */
		override public function get width():Number
		{
			if(this._skin) return this._skin.width;
			return this._width;
		}
	
		/**
		 * @private 
		 * Storage for <code>height</code> property.
		 */
		protected var _height:Number = 0;

		/**
		 * @private (override)
		 */
		override public function set height(value:Number):void
		{
			if(this._skin) this._skin.height = value;
			this._height = value;
		}

		/**
		 * @private (setter)
		 */
		override public function get height():Number
		{
			if(this._skin) return this._skin.height;
			return this._height;
		}

		/**
		 * @private (protected)
		 * Storage for <code>skin</code> property.
		 */
		protected var _skin:DisplayObject;

		/**
		 * Reference to background skin for the marker.
		 */
		public function get skin():DisplayObject
		{
			return this._skin;
		}

		/**
		 * @private (setter)
		 */
		public function set skin(value:DisplayObject):void
		{
			if(this._skin && this.contains(this._skin)) this.removeChild(this._skin);
			this._skin = value;
			this.addChild(this._skin);
		}
		
		/**
		 * @private (protected)
		 * Indicates the current hover state of the mouse in relation to the marker.
		 */
		protected var _mouseOutside:Boolean = true;
		
		/**
		 * @private
		 * Indicates what test to use for determining a <code>rollOver</code> event.
		 */
		protected var _rollOverTest:Function = _overHitTest;

		/**
		 * @private (protected)
		 * Indicates what test to use to determine a <code>rollOut</code> event.
		 */
		protected var _rollOutTest:Function = _offHitTest;
		
		/**
		 * Allows for mouse events to be determined by an external click layer. 
		 * @param delegate Click layer that listens to events.
		 * @param intersectionTest Specifies what algorithm will be used for determining 
		 * <code>rollOver</code> and <code>rollOut</code> events. 
		 *	<ul>
		 * 		<li><code>marker</code>: events will be dispatched if the mouse intersects the marker.</li>
		 * 		<li><code>horizontal</code>: events will be dispatched if the mouse intersects the horizontal plane
		 * of the marker.</li>
		 * 		<li><code>vertical</code>: events will be dispatched if the mouse intersects the vertical plane
		 * of the marker.</li>
		 * 	</ul>
		 */
		public function delegateListener(delegate:Sprite, intersectionTest:String = "marker"):void
		{
			switch(intersectionTest)
			{
				case "horizontal" :
					this._rollOverTest = _horizontalOverHitTest;
					this._rollOutTest = _horizontalOffHitTest;
					break;
				case "vertical" :
					this._rollOverTest = _verticalOverHitTest;
					this._rollOutTest = _verticalOffHitTest;
					break;
				default :
					this._rollOverTest = _overHitTest;
					this._rollOutTest = _offHitTest;
					break;
			}
			delegate.addEventListener(MouseEvent.MOUSE_MOVE, handleMouseMove);
			delegate.addEventListener(MouseEvent.CLICK, handleMouseClick);
			delegate.addEventListener(MouseEvent.DOUBLE_CLICK, handleMouseDoubleClick);
		}

		/**
		 * Handles <code>mouseMove</code> events when the <code>listener</code> is delegated to another class.
		 */
		public function handleMouseMove(event:MouseEvent):void
		{
			if(this._mouseOutside)
			{
				if(this._rollOverTest(event))
				{
					this._mouseOutside = false;
					this.dispatchEvent(new MouseEvent(MouseEvent.ROLL_OVER));
				}
			}
			else
			{
				if(this._rollOutTest(event))
				{
					this._mouseOutside = true;
					this.dispatchEvent(new MouseEvent(MouseEvent.ROLL_OUT));
				}
			}
		}
	
		/**
		 * Handles <code>click</code> events when the <code>listener</code> is delegated to another class.
		 */
		protected function handleMouseClick(event:MouseEvent):void
		{
			if(event.localX >= this.x && event.localX <= (this.x + this.width) && event.localY >= this.y && event.localY <= (this.y + this.height))
			{
				this.dispatchEvent(new MouseEvent(MouseEvent.CLICK));
			}
		}

		/**
		 * Handles <code>doubleClick</code> events when the <code>listener</code> is delegated to another class.
		 */
		protected function handleMouseDoubleClick(event:MouseEvent):void
		{
			if(event.localX >= this.x && event.localX <= (this.x + this.width) && event.localY >= this.y && event.localY <= (this.y + this.height))
			{
				this.dispatchEvent(new MouseEvent(MouseEvent.DOUBLE_CLICK));
			}
		}

		/**
		 * @private (protected)
		 * Checks to see if cursor rolls over the marker.
		 */
		protected function _overHitTest(event:MouseEvent):Boolean
		{
			return (event.localX >= this.x && event.localX <= (this.x + this.width) && event.localY >= this.y && event.localY <= (this.y + this.height))
		}

		/**
		 * @private (protected)
		 * Checks to see if the cursor rolls out of the marker.
		 */
		protected function _offHitTest(event:MouseEvent):Boolean
		{
			return (event.localX < this.x || event.localX > (this.x + this.width) || event.localY < this.y || event.localY > (this.y + this.height))
		}
		
		/**
		 * @private (protected)
		 * Checks to see if cursor rolls over the marker.
		 */
		protected function _verticalOverHitTest(event:MouseEvent):Boolean
		{
			return (event.localY >= this.y && event.localY <= (this.y + this.height))
		}

		/**
		 * @private (protected)
		 * Checks to see if the cursor rolls out of the marker.
		 */
		protected function _verticalOffHitTest(event:MouseEvent):Boolean
		{
			return (event.localY < this.y || event.localY > (this.y + this.height))
		}
		
		/**
		 * @private (protected)
		 * Checks to see if cursor rolls over the marker.
		 */
		protected function _horizontalOverHitTest(event:MouseEvent):Boolean
		{
			return (event.localX >= this.x && event.localX <= (this.x + this.width))
		}

		/**
		 * @private (protected)
		 * Checks to see if the cursor rolls out of the marker.
		 */
		protected function _horizontalOffHitTest(event:MouseEvent):Boolean
		{
			return (event.localX < this.x || event.localX > (this.x + this.width))
		}

	}
}
