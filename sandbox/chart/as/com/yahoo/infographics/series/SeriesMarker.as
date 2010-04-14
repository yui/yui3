package com.yahoo.infographics.series
{
	import flash.display.Sprite;
	import flash.display.DisplayObject;

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
	}
}
