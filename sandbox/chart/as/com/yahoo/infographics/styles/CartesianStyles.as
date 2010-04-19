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
		
		/**
		 * @private
		 * Storage for xAxisDataFormat
		 */
		private var _xAxisDataFormat:Object = {
			func:"defaultFunction"
		};

		/**
		 * Contains data for formatting x axis labels.
		 *	<ul>
		 * 		<li><code>external</code>: Indicates whether to use an external js function.</li>
		 * 		<li><code>function</code>: String reference to the function that is to be used.</li>
		 * 		<li><code>props</code>: hash of properties that might be used in the formatting function.</li>
		 * 	</ul>
		 */
		public function get xAxisDataFormat():Object
		{
			return this._xAxisDataFormat;
		}

		/**
		 * @private (setter)
		 */
		public function set xAxisDataFormat(value:Object):void
		{
			for(var i:String in value)
			{
				this._xAxisDataFormat[i] = value[i];
			}
		}
		
		/**
		 * @private
		 * Storage for xAxisDataFormat
		 */
		private var _yAxisDataFormat:Object = {
			func:"defaultFunction"
		};

		/**
		 * Contains data for formatting y axis labels.
		 *	<ul>
		 * 		<li><code>external</code>: Indicates whether to use an external js function.</li>
		 * 		<li><code>function</code>: String reference to the function that is to be used.</li>
		 * 		<li><code>props</code>: hash of properties that might be used in the formatting function.</li>
		 * 	</ul>
		 */
		public function get yAxisDataFormat():Object
		{
			return this._yAxisDataFormat;
		}

		/**
		 * @private (setter)
		 */
		public function set yAxisDataFormat(value:Object):void
		{
			for(var i:String in value)
			{
				this._yAxisDataFormat[i] = value[i];
			}
		}
	}
}
