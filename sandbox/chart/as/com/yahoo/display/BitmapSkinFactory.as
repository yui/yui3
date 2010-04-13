package com.yahoo.display
{
	import flash.display.DisplayObject;
	import flash.display.Sprite;
	import flash.display.Bitmap;
	import flash.display.BitmapData;

	/**
	 * Creates a template for returning multiple instances of a <code>DisplayObject</code>
	 * with defined styles.
	 */
	public class BitmapSkinFactory implements ISkinFactory
	{
		function BitmapSkinFactory(props:Object, styles:Object)
		{
			this.createTemplate(props, styles);
		}

		/**
		 * @private
		 * BitmapData object used for creating skins.
		 */
		private var _backgroundSkin:BitmapData;

		/**
		 * @private
		 * Storage for props.
		 */
		private var _props:Object = {
			drawSkinFunction:function(props:Object, styles:Object):void
			{
				this.graphics.beginFill(styles.fillColor);
				this.graphics.drawEllipse(0, 0, props.width, props.height);
				this.graphics.endFill();
			}
		};

		/**
		 * @copy com.yahoo.display.ISkinFactory#props
		 */
		public function get props():Object
		{
			return this._props;
		}

		/**
		 * @private (setter)
		 */
		public function set props(value:Object):void
		{
			var i:String;
			for(i in value)
			{
				if(value.hasOwnProperty(i))
				{
					this._props[i] = value[i];
				}
			}
		}
		
		/**
		 * @private
		 */
		private var _styles:Object = {};

		/**
		 * @copy com.yahoo.display.ISkinFactory#styles
		 */
		public function get styles():Object
		{
			var hash:Object = {},
				key:String,
				styles:Object = this._styles;
			for(key in styles)
			{
				if(styles.hasOwnProperty(key))
				{
					hash[key] = styles[key];
				}
			}
			return hash;
		}

		/**
		 * @private (setter)
		 */
		public function set styles(value:Object):void
		{
			var i:String;
			for(i in value)
			{
				if(value.hasOwnProperty(i))
				{
					this._styles[i] = value[i];
				}
			}
		}

		/**
		 * @copy com.yahoo.display.ISkinFactory#createTemplate()
		 */
		public function createTemplate(props:Object, styles:Object):void
		{
			this.props = props;
			this.styles = styles;
			this.drawSkin();
		}

		/**
		 * @private
		 */
		private function drawSkin():void
		{
			var skin:Sprite = new Sprite();
			var drawSkinFunction:Function = this.props.drawSkinFunction as Function;
			drawSkinFunction.call(skin, this.props, this.styles);
			
			this._backgroundSkin = new BitmapData(this.props.width, this.props.height, true, 0x000000);
			this._backgroundSkin.draw(skin, null, null, null, null, true);
		}

		/**
	 	 * @copy com.yahoo.display.ISkinFactory#getSkinInstance()
		 */
		public function getSkinInstance():DisplayObject
		{
			return new Bitmap(this._backgroundSkin.clone()) as DisplayObject;
		}	
	}
}
