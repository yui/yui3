package com.yahoo.renderers.styles
{

	/**
	 * Styles used by a layout strategy and its container
	 * class.
	 */
	public class LayoutStyles extends RendererStyles
	{

		/**
		 * @inheritDoc
		 */
		public static var styleMap:Object = 
		{
			horizontalGap:"horizontalGap",
			verticalGap:"verticalGap",
			horizontalAlign:"horizontalAlign",
			verticalAlign:"verticalAlign"
		};

	//--------------------------------------
	//  Constructor
	//--------------------------------------		
		/**
	 	 * Constructor
	 	 */
		public function LayoutStyles()
		{	
			super();
		}

		/**
		 * @private
		 * Storage for horizontalGap
		 */
		private var _horizontalGap:Number = 0;

		/**
		 * Horizontal spacing between layout children.
		 */
		public function get horizontalGap():Number
		{
			return this._horizontalGap;
		}

		/**
		 * @private (setter)
		 */
		public function set horizontalGap(value:Number):void
		{
			if(value == this._horizontalGap) return;
			this._horizontalGap = value;
		}

		/**
		 * @private
		 * Storage for verticalGap
		 */
		private var _verticalGap:Number = 0;

		/**
		 * VerticalSpacing between layout children.
		 */
		public function get verticalGap():Number
		{
			return this._verticalGap;
		}

		/**
		 * @private (setter)
		 */
		public function set verticalGap(value:Number):void
		{
			if(value == this._verticalGap) return;
			this._verticalGap = value;
		}

		/**
		 * @private
		 * Storage for horizontalAlign
		 */
		private var _horizontalAlign:String = "left";

		/**
		 * Indicates how to align the layout content.
		 * <ul>
		 * 	<li><code>left</code>: content will align from left to right</li>
		 * 	<li><code>right</code>: content will align from right to left</li>
		 * 	<li><code>center</code>: content will center align</li>
		 * </ul>
		 */
		public function get horizontalAlign():String
		{
			return this._horizontalAlign;
		}

		/**
		 * @private (setter)
		 */
		public function set horizontalAlign(value:String):void
		{
			if(value == this._horizontalAlign) return;
			this._horizontalAlign = value;
		}

		/**
		 * @private
		 * Storage for verticalAlign
		 */
		private var _verticalAlign:String = "top";

		/**
		 * Indicates how to vertically align the layout content.
		 * <ul>
		 * 	<li><code>top</code>: content will align from top to bottom</li>
		 * 	<li><code>bottom</code>: content will align from bottom to top</li>
		 * 	<li><code>middle</code>: content will middle align</li>
		 * </ul>
		 */
		public function get verticalAlign():String
		{
			return this._verticalAlign;
		}

		/**
		 * @private (setter)
		 */
		public function set verticalAlign(value:String):void
		{
			if(value == this._verticalAlign) return;
			this._verticalAlign = value;
		}
	}
}
