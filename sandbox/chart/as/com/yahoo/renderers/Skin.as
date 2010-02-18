package com.yahoo.renderers
{
	import com.yahoo.renderers.styles.IStyle;
	import com.yahoo.renderers.styles.SkinStyles;
	
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
		private var _drawSkinFunction:Function = defaultDrawSkinFunction;
	
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
			this.drawSkinFunction();
		}

		/**
		 * @private
		 */
		public function defaultDrawSkinFunction():void
		{	
			this.graphics.clear();
			var props:Object = this.getStyles();

			if(this.width == 0 || this.height == 0 || isNaN(this.width) || isNaN(this.height))
			{
				return;
			}
			
			if(props.borderColor == props.fillColor)
			{
				this.graphics.lineStyle(0, 0, 0);
			}
			else
			{
				this.graphics.lineStyle(props.borderWidth, props.borderColor, props.borderAlpha);
			}
			if(props.fillType != "linear" && props.fillType != "radial")
			{
				this.graphics.beginFill(props.fillColor, props.fillAlpha);
			}
			else
			{
				this.graphics.beginGradientFill(props.fillType, props.colors, props.alphas, props.ratios, props.matrix, props.spreadMethod, props.interpolationMethod, props.focalPointRatio);
			}
			this.graphics.drawRect(props.borderWidth * 0.5, props.borderWidth * 0.5, this.width - Number(props.borderWidth), this.height - Number(props.borderWidth));
			this.graphics.endFill();			
		}			
	}
}
