package com.yahoo.renderers.styles
{
	import flash.geom.Matrix;
	
	public class SkinStyles extends RendererStyles implements IStyle
	{
		/**
		 * @inheritDoc
		 */
		public static var styleMap:Object = 
		{
			fillColor:"fillColor",
			fillAlpha:"fillAlpha",
			borderColor:"borderColor",
			borderAlpha:"borderAlpha",
			borderWidth:"borderWidth",
			hasBorder:"hasBorder",
			fillType:"fillType",
			colors:"colors",
			alphas:"alphas",
			ratios:"ratios",
			spreadMethod:"spreadMethod",
			interpolationMethod:"interpolationMethod",
			focalPointRatio:"focalPointRatio"
		};
		
		/**
		 * Constructor
		 */
		public function SkinStyles()
		{
			super();
		}
		
		//--------------------------------------
		//  Properties
		//--------------------------------------

			/**
			 * @private
			 * Storage for the fillColor property.
			 */
			private var _fillColor:uint = 0x000000;

			/**
			 * @copy com.yahoo.ui.skins.ISolidSkin#fillColor
			 */
			public function get fillColor():uint
			{
				return this._fillColor;
			}

			/**
			 * @private
			 */
			public function set fillColor(value:uint):void
			{
				this._fillColor = value;
			}

			/**
			 * @private 
			 * Storage for outline color
			 */
			private var _borderColor:uint;

			/**
			 * @copy com.yahoo.ui.skins.ISolidSkin#borderColor
			 */
			public function get borderColor():uint
			{
				return _borderColor;
			}

			/**
			 * @private (setter)
			 */
			public function set borderColor(value:uint):void
			{
				this._borderColor = value;
			}

			/**
			 * @private
			 * Storage for the fill alpha.
			 */
			private var _fillAlpha:Number = 1;

			/**
			 * com.yahoo.ui.skins.ISolidSkin#fillColor
			 */
			public function get fillAlpha():Number
			{
				return _fillAlpha;
			}

			/**
			 * @private (setter)
			 */
			public function set fillAlpha(value:Number):void
			{
				this._fillAlpha = value;
			}

			/**
			 * @private
			 * Storage for the border alpha.
			 */
			private var _borderAlpha:Number = 1;

			/**
			 * com.yahoo.ui.skins.ISolidSkin#borderAlpha
			 */
			public function get borderAlpha():Number
			{
				return _borderAlpha;
			}

			/**
			 * @private (setter)
			 */
			public function set borderAlpha(value:Number):void
			{
				this._borderAlpha = value;
			}	

			/**
			 * @private
			 * Storage for borderWidth
			 */
			private var _borderWidth:Number = 1;

			/**
			 * @copy com.yahoo.ui.skins.ISolidSkin#borderWidth
			 */
			public function get borderWidth():Number
			{
				return this._borderWidth;
			}

			/**
			 * @private (setter)
			 */
			public function set borderWidth(value:Number):void
			{
				this._borderWidth = value;
			}

			/**
			 * @private
			 * Storage for hasBorder
			 */
			private var _hasBorder:Boolean = true;

			/**
			 * @copy com.yahoo.ui.skins.ISolidSkin#hasBorder
			 */
			public function get hasBorder():Boolean
			{
				return this._hasBorder;
			}

			/**
			 * @private (setter)
			 */
			public function set hasBorder(value:Boolean):void
			{
				this._hasBorder = value;
			}
			
			/**
			 * @private
			 * Storage for fillType
			 */
			protected var _fillType:String = "solid";

			/**
			 * Type of fill for skin. 
			 * <ul>
			 *  <li><code>solid</code>: Solid Fill</li>
			 *  <li><code>GradientType.LINEAR</code>: Linear Gradient Fill</li>
			 *  <li><code>GradientType.RADIAL</code>: Radial Gradient Fill</li>
			 * 	<li><code>
			 * </ul>
			 */
			public function get fillType():String
			{
				return this._fillType;
			}

			public function set fillType(value:String):void
			{
				this._fillType = value;
			}
			/**
			 * @private
			 * Storage for colors property
			 */
			private var _colors:Array = [];

			/**
			 * An array of RGB hexadecimal color values to be used in the gradient; for example, red is 
			 * 0xFF0000, blue is 0x0000FF, and so on. You can specify up to 15 colors. For each color, be 
			 * sure you specify a corresponding value in the alphas and ratios properties.
			 */
			public function get colors():Array
			{
				return this._colors;
			} 

			/**
			 * @private (setter)
			 */
			public function set colors(value:Array):void
			{
				if(value === this.colors) return;
				this._colors = value;
			}

			/**
			 * @private
			 * Storage for alphas
			 */
			private var _alphas:Array = [];

			/**
			 * An array of alpha values for the corresponding colors in the colors array; valid values are 0 to 1. 
			 * If the value is less than 0, the default is 0. If the value is greater than 1, the default is 1. 
			 */
			public function get alphas():Array
			{
				return this._alphas;
			}

			/**
			 * @private (setter)
			 */
			public function set alphas(value:Array):void
			{
				if(value === this.alphas) return;
				this._alphas = value;
			}

			/**
			 * Storage for ratios
			 */
			private var _ratios:Array = [];

			/**
			 * An array of color distribution ratios; valid values are 0 to 255. This value defines the 
			 * percentage of the width where the color is sampled at 100%. The value 0 represents the left-hand 
			 * position in the gradient box, and 255 represents the right-hand position in the gradient box. 
			 */
			public function get ratios():Array
			{
			 	return this._ratios;
			}

			/**
			 * @private (setter)
			 */
			public function set ratios(value:Array):void
			{
				if(value === this._ratios) return;
				this._ratios = value;
			}

			/**
			 * @private 
			 * Storage for spreadMethod
			 */
			private var _spreadMethod:String = "pad";

			/**
			 * A value from the <code>SpreadMethod</code> class that specifies which spread method to use, 
			 * either: <code>SpreadMethod.PAD</code>, <code>SpreadMethod.REFLECT</code>, or <code>SpreadMethod.REPEAT</code>.
			 */
			public function get spreadMethod():String
			{
				return this._spreadMethod;
			}

			/**
			 * @private (setter)
			 */
			public function set spreadMethod(value:String):void
			{
				if(this.spreadMethod == value) return;
				this._spreadMethod = value;
			}

			/**
			 * @private
			 * Storage for interpolationMethod
			 */
			private var _interpolationMethod:String = "rgb";

			/**
			 * A value from the <code>InterpolationMethod</code> class that specifies which value to use: 
			 * <code>InterpolationMethod.linearRGB</code> or <code>InterpolationMethod.RGB</code>
			 */
			public function get interpolationMethod():String
			{
				return this._interpolationMethod;
			}

			/**
			 * @private (setter)
			 */
			public function set interpolationMethod(value:String):void
			{
				if(value == this.interpolationMethod) return;
				this._interpolationMethod = value;
			}

			/**
			 * @private
		 	 * Storage for focalPointRatio
			 */
			private var _focalPointRatio:Number = 0;

			/**
			 *
			 */
			public function get focalPointRatio():Number
			{
				return this._focalPointRatio;
			}	

			/**
			 * @private (setter)
			 */
			public function set focalPointRatio(value:Number):void
			{
				if(value == this.focalPointRatio) return;
				this._focalPointRatio = value;
			}

			/**
			 * @private
			 * Storage for the matrix
			 */
			private var _matrix:Matrix = null;

			/**
			 * 
			 */
			public function get matrix():Matrix
			{
				return this._matrix;
			}

			/**
			 * @private (setter)
			 */
			public function set matrix(value:Matrix):void
			{
				if(this.matrix === value) return;
				this._matrix = value;
			}

	}
}