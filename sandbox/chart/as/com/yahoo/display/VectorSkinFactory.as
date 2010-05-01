package com.yahoo.display
{
	import flash.display.DisplayObject;
	import flash.display.Sprite;

	/**
	 * Creates a template for returning multiple instances of a <code>DisplayObject</code>
	 * with defined styles.
	 */
	public class VectorSkinFactory implements ISkinFactory
	{
		function VectorSkinFactory(props:Object, styles:Object)
		{
			this.createTemplate(props, styles);
		}

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
		 * Storage for styles.
		 */
		private var _styles:Object = {};

		/**
		 * @copy com.yahoo.display.styles
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
		}

		/**
		 * @copy com.yahoo.display.ISkinFactory#getSkinInstance()
		 */
		public function getSkinInstance():DisplayObject
		{
			var skin:Sprite = new Sprite(),
				drawSkinFunction:Function = this.props.drawSkinFunction as Function;
			drawSkinFunction.call(skin, this.props, this.styles);
			return skin as DisplayObject;
		}	
	}
}
