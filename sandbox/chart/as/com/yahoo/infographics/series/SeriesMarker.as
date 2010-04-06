package com.yahoo.infographics.series
{
	import flash.display.Sprite;

	public class SeriesMarker extends Sprite
	{
		function SeriesMarker()
		{
			super();
		}

		protected var _width:Number = 0;

		override public function set width(value:Number):void
		{
			this._width = value;
		}

		override public function get width():Number
		{
			return this._width;
		}
	
		protected var _height:Number = 0;

		override public function set height(value:Number):void
		{
			this._height = value;
		}

		override public function get height():Number
		{
			return this._height;
		}

		public var drawSkinFunction:Function = _defaultDrawSkinFunction;

		protected var _styles:Object =
		{
			fillColor:0x000000,
			fillAlpha:1,
			borderWidth:1,
			borderColor:0x000000
		};

		public function get styles():Object
		{
			var styles:Object = {},
				i:String;
			for(i in this._styles)
			{
				if(this._styles.hasOwnProperty(i))
				{
					styles[i] = this._styles[i];
				}
			}
			return styles;
		}

		public function set styles(value:Object):void
		{
			var i:String;
			for(i in value)
			{
				if(value.hasOwnProperty(i) && this._styles.hasOwnProperty(i))
				{
					this._styles[i] = value[i];
				}
			}
		}

		protected function _defaultDrawSkinFunction(styles:Object):void
		{
			this.graphics.beginFill(styles.fillColor);
			this.graphics.drawRect(0, 0, this._width, this._height);
			this.graphics.endFill();
		}

		public function drawSkin():void
		{
			if(this.width == 0 || this.height == 0 || isNaN(this.width) || isNaN(this.height))
			{
				return;
			}
			this.graphics.clear();
			this.drawSkinFunction(this._styles);
		}
	}

}
