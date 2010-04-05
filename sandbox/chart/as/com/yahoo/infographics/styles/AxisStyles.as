package com.yahoo.infographics.styles
{
	import com.yahoo.renderers.styles.IStyle;
	import com.yahoo.renderers.styles.RendererStyles;

	/**
	 * Base style class for Axes
	 */
	public class AxisStyles extends RendererStyles
	{
		/**
		 * Constructor
		 */
		public function AxisStyles()
		{
			super();
		}
		
		/**
		 * @inheritDoc
		 */
		public static var styleMap:Object = 
		{
			majorTicks:"majorTicks",
			minorTicks:"minorTicks",
			position:"position",
			label:"label",
			hideOverlappingLabels:"hideOverlappingLabels",
			hideOverlappingLabelTicks:"hideOverlappingLabelTicks",	
			line:"line",
			majorUnit:"majorUnit",
			calculateSizeByTickLength:"calculateSizeByTickLength",
			dataFormat:"dataFormat"
		};

		/**
		 * @private
		 * Storage for majorTicks
		 */
		private var _majorTicks:Object = {
			display:"inside",
			length:4,
			color:0x000000,
			weight:1,
			alpha:1
		};

		/**
		 * Properties for the majorTicks:
		 * <ul>
		 * 	<li><code>display</code>:position of ticks in relation to the axis:
		 * 		<ul>
		 *			<li><code>inside</code></li>
		 *			<li><code>outside</code></li>
		 *			<li><code>cross</code></li>
		 * 			<li><code>none</code></li>
		 * 		</ul>
		 * 	</li>
		 * 	<li><code>length</code>: length of the ticks</li>
		 * 	<li><code>weight</code>: thickness of the ticks</li>
		 * 	<li><code>color</code>: color of the ticks</li>
		 * </ul>
		 */
		public function get majorTicks():Object
		{
			return this._majorTicks;
		}

		/**
		 * @private (setter)
		 */
		public function set majorTicks(value:Object):void
		{
			if(value === this.majorTicks) return;
			for(var i:String in this.majorTicks)
			{
				if(value[i]) this._majorTicks[i] = value[i];
			}
		}
		
		/**
		 * @private
		 * Storage for minorTicks
		 */
		private var _minorTicks:Object = {
			display:"none",
			length:2,
			color:0x000000,
			weight:1
		};

		/**
		 * Properties for the minorTicks:
		 * <ul>
		 * 	<li><code>display</code>:position of ticks in relation to the axis:
		 * 		<ul>
		 *			<li><code>inside</code></li>
		 *			<li><code>outside</code></li>
		 *			<li><code>cross</code></li>
		 * 			<li><code>none</code></li>
		 * 		</ul>
		 * 	</li>
		 * 	<li><code>length</code>:length of the ticks</li>
		 * 	<li><code>weight</code>:thickness of the ticks</li>
		 * 	<li><code>color</code>: color of the ticks</li>
		 * </ul>
		 */
		public function get minorTicks():Object
		{
			return this._minorTicks;
		}

		/**
		 * @private (setter)
		 */
		public function set minorTicks(value:Object):void
		{
			if(value === this.minorTicks) return;
			for(var i:String in this.minorTicks)
			{
				if(value[i]) this._minorTicks[i] = value[i];
			}
		}

		/**
		 * @private
		 * Storage for label
		 */
		private var _label:AxisLabelStyles = new AxisLabelStyles();

		/**
		 * Styles to be set on the <code>AxisLabel</code> instances.
		 */
		public function get label():Object
		{
			return this._label as Object;
		}

		/**
		 * @private (setter)
		 */
		public function set label(value:Object):void
		{
			for(var i:String in value)
			{
				if(this.label.hasOwnProperty(i))
				{
					this._label[i] = value[i];
				}
			}
		}

		/**
		 * @private
		 * Storage for position
		 */
		private var _position:String;

		/**
		 * Gets or sets the position of the axis in relation to a graph. Used to determine 
		 * positioning of ticks and labels.
		 * <ul>
		 * 	<li><code>top</code></li>
		 * 	<li><code>right</code></li>
		 * 	<li><code>bottom</code></li>
		 *  <li><code>left</code></li>
		 * </ul>
		 */
		public function get position():String
		{
			return this.label.position;
		}

		/**
		 * @private (setter)
		 */
		public function set position(value:String):void
		{
			this.label = {position:value};
		}

		/**
		 * @private
		 * Storage for hideOverlappingLabels
		 */
		private var _hideOverlappingLabels:Boolean = true;

		/**
		 * Indicates whether or not to hide labels that overlap
		 */
		public function get hideOverlappingLabels():Boolean
		{
			return this._hideOverlappingLabels;
		}

		/**
		 * @private (setter)
		 */
		public function set hideOverlappingLabels(value:Boolean):void
		{
			if(this._hideOverlappingLabels === value) return;
			this._hideOverlappingLabels = value;
		}

		/**
		 * @private
		 * Storage for hideOverlappingLabelTicks
		 */
		private var _hideOverlappingLabelTicks:Boolean = false;

		/**
		 * Indicates whether or not to hide ticks when their corresponding labels overlap
		 */
		public function get hideOverlappingLabelTicks():Boolean
		{
			return this._hideOverlappingLabelTicks;
		}

		/**
		 * @private (setter)
		 */
		public function set hideOverlappingLabelTicks(value:Boolean):void
		{
			if(this._hideOverlappingLabelTicks === value) return;
			this._hideOverlappingLabelTicks = value;
		}

		/**
		 * @private 
		 * Storage for the line style object
		 */
		private var _line:Object = {
			weight:1,
			color:0x000000,
			alpha:1
		};

		/**
		 * Properties for <code>line</code>:
		 * <ul>
		 * 	<li><code>weight</code>: thickness of the line</li>
		 * 	<li><code>color</code>: weight of the line</li>
		 * 	<li><code>alpha</code>: alpha of the line</li>
		 * </ul>
		 */
		public function get line():Object
		{
			return this._line;
		}	

		/**
		 * @private (setter)
		 */
		public function set line(value:Object):void
		{
			if(this._line === value) return;
			for(var i:String in this._line)
			{
				if(value[i]) this._line[i] = value[i];
			}
		}

		/**
		 * @private
		 * Storage for majorUnit
		 */
		private var _majorUnit:Object = {
			determinant:"count",
			count:5,
			distance:75
		};

		/**
		 * Hash of properties used to determine a <code>majorUnit</code>.
		 * <ul>
		 * 	<li><code>determinant</code>: Indicate how the major unit will be determined
		 * 		<ul>
		 * 			<li><code>distance</code>: the majorUnit will correspond to a specified distance on the axis</li>
		 * 			<li><code>count</code>: the majorUnit will correspond to a percentage of the axis length derived by a specified count</li>
		 * 			<li><code>userSpecified</code>: no calculate will occur, the majorUnit is specified by the developer</li>
		 * 			<li><code>roundingUnit</code>: calculates the majorUnit based on the <code>roundingUnit</code> of the <code>AxisData</code> class. </li>
		 * 		</ul>
		 * 	</li>
		 * 	<li><code>count</code>: Indicates the number of major units on an axis when <code>majorUnitDeterminant</code> is set to <code>count</code>.</li>
		 * 	<li><code>distance</code>: The distance between major units when <code>majorUnit.determinant</code> is set to <code>distance</code>.</li>
		 * </ul>
		 */
		public function get majorUnit():Object
		{
			return this._majorUnit;
		}

		/**
		 * @private (setter)
		 */
		public function set majorUnit(value:Object):void
		{
			for(var i:String in value)
			{
				if(this._majorUnit.hasOwnProperty(i)) this._majorUnit[i] = value[i];
			}
		}

		/**
		 * @private
		 * Storage for calculateSizeByTickLength
		 */
		private var _calculateSizeByTickLength:Boolean = false;

		/**
		 * Indicates how to include tick length in the size calculation of the axis. Typically an 
		 * axis that touches the edge of a graph, would exclude the length of a tick with a display
		 * property of <code>inside</code> and exclude  1/2 the length of a tick with a display
		 * property of <code>cross</code>. This style should be explicitly defined in the application 
		 * that uses the axis class.
		 */
		public function get calculateSizeByTickLength():Boolean
		{
			return this._calculateSizeByTickLength;
		}

		/**
		 * @private (setter)
		 */
		public function set calculateSizeByTickLength(value:Boolean):void
		{
			this._calculateSizeByTickLength = value;
		}
		
		/**
		 * @private
		 * Storage for dataFormat
		 */
		private var _dataFormat:Object = {
			func:"defaultFunction"
		};

		/**
		 * Contains data for formatting axis labels.
		 *	<ul>
		 * 		<li><code>external</code>: Indicates whether to use an external js function.</li>
		 * 		<li><code>function</code>: String reference to the function that is to be used.</li>
		 * 		<li><code>props</code>: hash of properties that might be used in the formatting function.</li>
		 * 	</ul>
		 */
		public function get dataFormat():Object
		{
			return this._dataFormat;
		}

		/**
		 * @private (setter)
		 */
		public function set dataFormat(value:Object):void
		{
			for(var i:String in value)
			{
				this._dataFormat[i] = value[i];
			}
		}
	}
}
