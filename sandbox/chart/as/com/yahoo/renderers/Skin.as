package com.yahoo.renderers
{
	import com.yahoo.renderers.styles.IStyle;
	import com.yahoo.renderers.styles.SkinStyles;
	import flash.display.DisplayObject;
	
	/**
	 * Rendering class responsible for programatic fills
	 */
	public class Skin extends Renderer
	{	
		/**
		 * @inheritDoc
		 */
		private static var _styleClass:Class = SkinStyles;
		
		/**
		 * Constructor
		 */
		public function Skin():void
		{
			super();
		}
		
		/**
		 * @inheritDoc
		 */
		override public function getStyleClass():Class
		{
			return _styleClass;
		}		
		
		/**
		 * @private
		 * Storage for drawSkinFunction
		 */
		private var _drawSkinFunction:Function = skinAll;
	
		/**
		 * Algorithm for drawing skin
		 */
		public function get drawSkinFunction():Function
		{
			return this._drawSkinFunction;
		}
		
		/**
		 * @private (setter)
		 */
		public function set drawSkinFunction(value:Function):void
		{
			this._drawSkinFunction = value;
		}
		
	//--------------------------------------
	//  Public Methods
	//--------------------------------------		
		/**
		 * @inheritDoc
		 */
		override protected function render():void
		{
			this.drawSkin();
		}

		/**
		 * @private
		 */
		public function drawSkin():void
		{	
			this.graphics.clear();
			var props:Object = this.getStyles();

			if(this.width == 0 || this.height == 0 || isNaN(this.width) || isNaN(this.height))
			{
				return;
			}
			
			if(props.fillType != "linear" && props.fillType != "radial")
			{
				this.graphics.beginFill(props.fillColor, props.fillAlpha);
			}
			else
			{
				this.graphics.beginGradientFill(props.fillType, props.colors, props.alphas, props.ratios, props.matrix, props.spreadMethod, props.interpolationMethod, props.focalPointRatio);
			}
			if(props.borderColor == props.fillColor)
			{
				this.graphics.lineStyle(0, 0, 0);
			}
			else
			{
				this.graphics.lineStyle(props.borderWidth, props.borderColor, props.borderAlpha);
			}
			props.width = this.width;
			props.height = this.height;
			props.x = this.x;
			props.y = this.y;
			if(this._drawSkinFunction is Function)
			{
				props.width = this.width;
				props.height = this.height;
				this._drawSkinFunction.call(this, this, props);
			}
			this.graphics.endFill();			
		}

		protected function skinAll(target:DisplayObject, props:Object):void
		{
			this.graphics.drawRect(props.borderWidth * 0.5, props.borderWidth * 0.5, this.width - Number(props.borderWidth), this.height - Number(props.borderWidth));
		}
	}
}
