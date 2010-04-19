package com.yahoo.infographics.axes
{
	import com.yahoo.renderers.Label;
	import com.yahoo.infographics.styles.AxisLabelStyles;
	import com.yahoo.renderers.styles.IStyle;
	import com.yahoo.renderers.events.RendererEvent;
	import flash.display.DisplayObject;

	/**
	 * Class for rendering labels for an axis. Labels are positioned
	 * based on their alignment to an axis.
	 */
	public class AxisLabel extends Label
	{
		/**
		 * @private
		 */
		private const PI:Number = Math.PI;

		/**
		 * @inheritDoc
		 */
		private static var _styleClass:Class = AxisLabelStyles;
		
		/**
		 * Constructor
		 */
		public function AxisLabel(styles:IStyle = null):void
		{
			super(styles);
		}
		
		/**
		 * @private
		 */
		private var _width:Number = 0;

		/**
		 * @private (override)
		 */
		override public function get width():Number
		{
			return this._width;
		}

		/**
		 * @private
		 */
		private var _height:Number = 0;

		/**
		 * @private
		 */
		override public function get height():Number
		{
			return this._height;
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
			elementFormat:true,	
			position:true,
			margin:true
		}

		/**
		 * @private
		 */
		private var _sinRadians:Number;

		/**
		 * @private
		 */
		private var _cosRadians:Number;

		/**
		 * @private
		 */
		private var _baselineOffset:Number;

	//--------------------------------------
	//  Public Methods
	//--------------------------------------		
		/**
		 * @inheritDoc
		 */
		override public function getStyleClass():Class
		{
			return _styleClass;
		}		

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
		 * @private (override)
		 */
		override protected function rotate():void
		{
			var rotation:Number = this.getStyle("rotation") as Number,
				margin:Object = this.getStyle("margin"),
				absRotation:Number = rotation < 0 ? -rotation : rotation,
				radConverter:Number = PI/180;
			this.textLine.rotation = rotation;
			this._baselineOffset = (this.textLine.ascent - this.textLine.descent)/2;
			this._sinRadians = Math.sin(absRotation * radConverter);
			this._cosRadians = Math.cos(absRotation * radConverter);
			this._width = int(0.5 + ((this._cosRadians * this.textLine.textWidth) + (this._sinRadians * this.textLine.textHeight)));
			this._height = int(0.5 + ((this._sinRadians * this.textLine.textWidth) + (this._cosRadians * this.textLine.textHeight)));
			
			switch(this.getStyle("position") as String)
			{
				case "top" :
					this.positionTop(rotation);
				break
				case "right" :
					this.positionRight(rotation);
				break;
				case "bottom" :
					this.positionBottom(rotation);
				break;
				case "left" :
					this.positionLeft(rotation);
				break;
			}

			this._width += Number(margin.left) + Number(margin.right);
			this._height += Number(margin.top) + Number(margin.bottom);
			this.textLine.y = int(0.5 + this.textLine.y);
			this.textLine.x = int(0.5 + this.textLine.x);
		}

		/**
		 * @private
		 */
		private function positionTop(rotation:Number):void
		{
			if(rotation == 90)
			{
				this.textLine.y -= this.textLine.textWidth;
				this.textLine.x -= this.textLine.ascent/2;
				this.textLine.x += this.textLine.descent;
				this._width = this.textLine.textHeight;
				this._height = this.textLine.textWidth;
			}
			else if(rotation == -90)
			{
				this.textLine.x += this._baselineOffset;
				this._width = this.textLine.textHeight;
				this._height = this.textLine.textWidth;
			}
			else if(rotation < 0)
			{
				this.textLine.x += this._sinRadians * this.textLine.ascent/2;
			}
			else if(rotation > 0)
			{
				this.textLine.x -= (this._sinRadians * this._baselineOffset) + (this._cosRadians * this.textLine.textWidth);
				this.textLine.y -= this._sinRadians * this.textLine.textWidth;
			}
			else
			{
				this.textLine.x -= this.textLine.textWidth/2;
				this.textLine.y -= this.textLine.descent;
				this._height = this.textLine.textHeight;
				this._width = this.textLine.textWidth;
			}
			this.textLine.y -= Number(this.getStyle("margin").bottom);
		}

		/**
		 * @private
		 */
		private function positionRight(rotation:Number):void
		{
			if(rotation == 90)
			{
				this.textLine.y -= this.textLine.textWidth/2;
				this.textLine.x += this.textLine.descent * 1.3;
				this._width = this.textLine.textHeight;
				this._height = this.textLine.textWidth;
			}
			else if(rotation == -90)
			{
				this.textLine.y += this.textLine.textWidth/2;
				this.textLine.x += this.textLine.ascent;
				this._width = this.textLine.textHeight;
				this._height = this.textLine.textWidth;
			}
			else if(rotation < 0)
			{
				this.textLine.x += this._sinRadians * (this.textLine.ascent - this.textLine.descent);	
				this.textLine.y += this._cosRadians * this.textLine.ascent/2;
			}
			else if(rotation > 0)
			{
				this.textLine.y += this._cosRadians * this._baselineOffset;
				this.textLine.x += rotation/90;
			}
			else
			{
				this.textLine.y += this._baselineOffset;
				this._height = this.textLine.textHeight;
				this._width = this.textLine.textWidth;
			}

			this.textLine.x += Number(this.getStyle("margin").left);
		}

		/**
		 * @private
		 */
		private function positionBottom(rotation:Number):void
		{
			if(rotation == -90)
			{
				this.textLine.x += this._baselineOffset;
				this.textLine.y += this.textLine.textWidth;
				this._width = this.textLine.textHeight;
				this._height = this.textLine.textWidth;
			}
			else if(rotation == 90)
			{
				this.textLine.x -= this.textLine.ascent/2;
				this.textLine.x += this.textLine.descent;
				this._width = this.textLine.textHeight;
				this._height = this.textLine.textWidth;
			}
			else if(rotation < 0)
			{
				this.textLine.x += this._sinRadians * this.textLine.ascent/2;
				this.textLine.x -= this._cosRadians * this.textLine.textWidth;
				this.textLine.y += (this._sinRadians * this.textLine.textWidth) + (this._cosRadians * this.textLine.ascent);
			}
			else if(rotation > 0)
			{
				this.textLine.x -= this._sinRadians * this._baselineOffset;
				this.textLine.y += this._cosRadians * (this.textLine.ascent - this.textLine.descent);
			}
			else
			{
				this.textLine.x -= this.textLine.textWidth/2;
				this.textLine.y += this.textLine.ascent;
				this._height = this.textLine.textHeight;
				this._width = this.textLine.textWidth;
			}

			this.textLine.y += Number(this.getStyle("margin").top);
		}
		
		/**
		 * @private
		 */
		private function positionLeft(rotation:Number):void
		{
			if(rotation == 90)
			{
				this.textLine.x -= this.textLine.ascent;
				this.textLine.y -= this.textLine.textWidth/2;
				this._width = this.textLine.textHeight;
				this._height = this.textLine.textWidth;
			}
			else if(rotation == -90)
			{
				this.textLine.x -= this.textLine.descent;
				this.textLine.y += this.textLine.textWidth/2;
				this._width = this.textLine.textHeight;
				this._height = this.textLine.textWidth;
			}
			else if(rotation > 0)
			{
				this.textLine.y -= this._sinRadians * this.textLine.textWidth;
				this.textLine.y += this._cosRadians * this.textLine.ascent/2;
				this.textLine.x -= this._cosRadians * this.textLine.textWidth;
				this.textLine.x -= this._sinRadians * (this.textLine.ascent - this.textLine.descent);
			}
			else if(rotation < 0)
			{
				this.textLine.x -= this._cosRadians * this.textLine.textWidth;
				this.textLine.y += this._sinRadians * this.textLine.textWidth;
				this.textLine.y += this._cosRadians * this._baselineOffset;
			}
			else
			{
				this.textLine.x -= this.textLine.textWidth;
				this.textLine.y += this.textLine.textHeight/2;
				this.textLine.y -= this.textLine.descent;
				this._height = this.textLine.textHeight;
				this._width = this.textLine.textWidth;
			}

			this.textLine.x -= Number(this.getStyle("margin").right);
		}
	}
}
