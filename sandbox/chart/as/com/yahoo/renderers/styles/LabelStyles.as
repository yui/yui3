package com.yahoo.renderers.styles
{	
	import flash.text.engine.TextBlock;
	import flash.text.engine.TextBaseline;
	import flash.text.engine.TextElement;
	import flash.text.engine.TextLine;
	import flash.text.engine.FontDescription;
	import flash.text.engine.ElementFormat;
	import flash.text.engine.FontPosture;
	import flash.text.engine.ElementFormat;
	
	/**
	 * Styles for <code>Label</code> class.
	 */
	public class LabelStyles extends RendererStyles implements IStyle
	{
		/**
		 * @inheritDoc
		 */
		public static var styleMap:Object = 
		{
			rotation:"rotation",
			elementFormat:"elementFormat",
			fontDescription:"fontDescription",
			fontLookup:"fontLookup",
			fontName:"fontName",
			fontWeight:"fontWeight",
			fontSize:"fontSize",
			color:"color"
		};
		
		/**
		 * Constructor
		 */
		public function LabelStyles()
		{
			super();
		}
		
	//--------------------------------------
	//  Properties
	//--------------------------------------
		/**
		 * @private 
		 * Storage for rotation
		 */
		private var _rotation:Number = 0;

		/**
		 * The rotation of the text
		 */
		public function get rotation():Number
		{
			return this._rotation;
		}

		/**
		 * @private (setter)
		 */
		public function set rotation(value:Number):void
		{
			if(value !== this._rotation) this._rotation = value;
		}
		
		/**
		 * Storage for elementFormat
		 */
		private var _elementFormat:ElementFormat = new ElementFormat(new FontDescription("_sans", "normal", "normal", "device", "normal", "none"), 9, 0x000000, 1.0, "auto", TextBaseline.ROMAN);

		/**
		 * The <code>ElementFormat</code> instance.
		 *
		 * @see flash.text.engine.ElementFormat
		 */
		public function get elementFormat():ElementFormat
		{
			return this._elementFormat;
		}

		/**
		 * @private (setter)
		 */
		public function set elementFormat(value:ElementFormat):void
		{
			this._elementFormat = value;
		}
	
		/**
		 * The size of the text in pixels.
		 *
		 * @see flash.text.engine.ElementFormat
		 */
		public function get fontSize():Number
		{
			return this.elementFormat.fontSize;
		}

		/**
		 * @private (setter)
		 */
		public function set fontSize(value:Number):void
		{
			if(value === this.elementFormat.fontSize) return;
			var ef:ElementFormat = this.elementFormat.clone();
			ef.fontSize = value;
			this.elementFormat = ef;
		}

		/**
		 * Indicates the color of the text.
		 *
		 * @see flash.text.engine.ElementFormat
		 */
		public function get color():uint
		{
			return this.elementFormat.color;
		}

		/**
		 * @private (setter)
		 */
		public function set color(value:uint):void
		{
			if(value === this.elementFormat.color) return;
			var ef:ElementFormat = this.elementFormat.clone();
			ef.color = value;
			this.elementFormat = ef;
		}
	
		/**
		 * Indicates the kerning for the text.
		 *
		 * @see flash.text.engine.ElementFormat
		 */
		public function get kerning():String
		{
			return this.elementFormat.kerning;
		}

		/**
		 * @private (setter)
		 */
		public function set kerning(value:String):void
		{
			if(value === this.elementFormat.kerning) return;
			var ef:ElementFormat = this.elementFormat.clone();
			ef.kerning = value;
			this.elementFormat = ef;
		}

		/**
		 * The fontDescription used
		 */
		public function get fontDescription():FontDescription
		{
			return this.elementFormat.fontDescription;
		}

		/**
		 * @private (setter)
		 */
		public function set fontDescription(value:FontDescription):void
		{
			if(value === this.fontDescription) return;
			var ef:ElementFormat = this.elementFormat.clone();
			ef.fontDescription = value;
			this.elementFormat = ef;
		}
		
		/**
		 * The name of the font to use, or a comma-separated list of font names.
		 *
		 * @see flash.text.engine.FontDescription
		 */
		public function get fontName():String
		{
			return this.fontDescription.fontName;
		}

		/**
		 * @private (setter)
		 */
		public function set fontName(value:String):void
		{
			if(value !== this.fontName)
			{
				var fd:FontDescription  = this.fontDescription.clone();
				fd.fontName = value;
				this.fontDescription = fd;
			}
		}
		
		/**
		 * Specifies the font weight.
		 *
		 * @see flash.text.engine.FontDescription
		 */
		public function get fontWeight():String
		{
			return this.fontDescription.fontWeight;
		}

		/**
		 * @private (setter)
		 */
		public function set fontWeight(value:String):void
		{
			if(value !== this.fontWeight) 
			{
				var fd:FontDescription = this.fontDescription.clone();
				fd.fontWeight = value;
				this.fontDescription = fd;
			}
		}
		
		/**
		 * Specifies how the font should be looked up.
		 *
		 * @see flash.text.engine.FontDescription
		 */
		public function get fontLookup():String
		{
			return this.fontDescription.fontLookup;
		}

		/**
		 * @private (setter)
		 */
		public function set fontLookup(value:String):void
		{
			if(value == this.fontLookup) return;
			var fd:FontDescription  = this.fontDescription.clone();
			fd.fontLookup = value;
			this.fontDescription = fd;
		}	
	}
}
