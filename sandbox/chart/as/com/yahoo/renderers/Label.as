package com.yahoo.renderers
{	
	import flash.text.engine.TextBlock;
	import flash.text.engine.TextElement;
	import flash.text.engine.TextLine;
	import flash.text.engine.FontDescription;
	import flash.text.engine.ElementFormat;
	import flash.text.engine.FontPosture;
	import flash.text.engine.ElementFormat;
	import com.yahoo.renderers.styles.IStyle;
	import com.yahoo.renderers.styles.LabelStyles;
	import com.yahoo.renderers.layout.ContainerType;

	/**
	 * Class that allows for rotation of text.
	 */
	public class Label extends Renderer
	{	
		/**
		 * @inheritDoc
		 */
		private static var _styleClass:Class = LabelStyles;
		
		/**
		 * Constructor
		 */
		public function Label(styles:IStyle = null):void
		{
			super(styles);
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
		 * Storage for text
		 */
		private var _text:String;

		/**
		 * The text that appears in the label.
		 *
		 * @type String
		 */
		public function get text():String
		{
			return this._text;
		}

		/**
		 * @private (setter)
		 */
		public function set text(value:String):void
		{
			if(this.text === value) return;
			this._text = value;
			this.setFlag("textUpdate");
		}

		/**
		 * @private
		 * Storage for textLine
		 */
		private var _textLine:TextLine;

		/**
		 * Reference to the <code>TextLine</code> instance.
		 */
		public function get textLine():TextLine
		{
			return this._textLine;
		}

		/**
		 * @private 
		 * Storage for format.
		 */
		private var _format:ElementFormat = new ElementFormat();

		/**
		 * Reference to the <code>ElementFormat</code> instance.
		 */
		public function get format():ElementFormat
		{
			return this._format;
		}

		/**
		 * @private
		 * Flags for rendering
		 */
		private var _textFlags:Object =
		{
			resize:true,
			textUpdate:true,
			rotation:true,
			fontSize:true,
			fontDescription:true,
			elementFormat:true
		}

	//--------------------------------------
	//  Public Methods
	//--------------------------------------		
		/**
		 * @inheritDoc
		 */
		override protected function render():void
		{
			if(!this.checkFlags(this._textFlags)) return;
			this.createText();
			this.rotate();
		}

		/**
		 * @private (protected)
		 */
		protected function createText():void
		{
			this._format = this.getStyle("elementFormat") as ElementFormat;
			var textElement:TextElement = new TextElement(this.text, this._format);
			var textBlock:TextBlock = new TextBlock();
			textBlock.content = textElement; 
			textBlock.applyNonLinearFontScaling = false;
			if(this.textLine && this.contains(this.textLine)) this.removeChild(this.textLine);
			this._textLine = textBlock.createTextLine(null, 300); 
			this.addChild(this.textLine);
		}

		/**
		 * @private (protected)
		 */
		protected function rotate():void
		{
			this.textLine.rotation = this.getStyle("rotation") as Number;
		}
	}
}
