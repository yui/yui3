package com.yahoo.infographics.styles
{
	import com.yahoo.renderers.styles.RendererStyles;
	import com.yahoo.infographics.constants.ScaleTypes;
	/**
	 * Styles used by a layout strategy and its container
	 * class.
	 */
	public class CartesianStyles extends RendererStyles
	{

		/**
		 * @inheritDoc
		 */
		public static var styleMap:Object = 
		{
			scaleType:"scaleType",
			animate:"animate",
			animationDuration:"animationDuration"
		};

	//--------------------------------------
	//  Constructor
	//--------------------------------------		
		/**
	 	 * Constructor
	 	 */
		public function CartesianStyles()
		{	
			super();
		}

		/**
		 * @private
		 * Storage for scaleType
		 */
		private var _scaleType:String = ScaleTypes.LINEAR;

		/**
		 * The type of graph's scale: linear, logarithmic, or percent.
		 */
		public function get scaleType():String
		{
			return this._scaleType;
		}

		/**
		 * @private (setter)
		 */
		public function set scaleType(value:String):void
		{
			if(value == this._scaleType) return;
			this._scaleType = value;
			// Check for correctness ehre.
		}

		/**
		 * @private
		 * Storage for animate
		 */
		private var _animate:Boolean = false;

		/**
		 * Indicates whether the graph contents will animate at start
		 * and change.
		 */
		public function get animate():Boolean
		{
			return this._animate;
		}

		/**
		 * @private (setter)
		 */
		public function set animate(value:Boolean):void
		{
			this._animate = value;
		}

		/**
		 * @private
		 * Storage for animationDuration
		 */
		private var _animationDuration:int = 100;

		/**
		 * The interval, in milliseconds, in which an animation updates.
		 */
		public function get animationDuration():int
		{
			return this._animationDuration;
		}
		
		/**
		 * @private (setter)
		 */
		public function set animationDuration(value:int):void
		{
			this._animationDuration = value;
		}
	}
}
