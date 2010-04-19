package com.yahoo.infographics.styles
{
	import com.yahoo.renderers.styles.RendererStyles;

	/**
	 * Styles used by a line graph.
	 */
	public class LineStyles extends PlotStyles
	{

		/**
		 * @inheritDoc
		 */
		public static var styleMap:Object = 
		{
			color:"color",
			alpha:"alpha",
			weight:"weight",
			type:"type",
			dashLength:"dashLength",
			gapSpace:"gapSpace",
			connectDiscontinuousPoints:"connectDiscontinuousPoints",
			discontinuousType:"discontinuousType",
			discontinuousDashLength:"discontinuousDashLength",
			discontinuousGapSpace:"discontinuousGapSpace",
			showLines:"showLines",
			showMarkers:"showMarkers"
		};

	//--------------------------------------
	//  Constructor
	//--------------------------------------		
		/**
	 	 * Constructor
	 	 */
		public function LineStyles()
		{	
			super();
		}

		/**
		 * @private
		 * Storage for color.
		 */
		private var _color:uint = 0x000000;

		/**
		 * The color of the line.
		 */
		public function get color():uint
		{
			return this._color;
		}

		/**
		 * @private (setter)
		 */
		public function set color(value:uint):void
		{
			if(value === this._color) return;
			this._color = value;
		}

		/**
		 * @private
		 * Storage for alpha
		 */
		private var _alpha:Number = 1;

		/**
		 * The alpha value of the line. Value between 0 and 1.0
		 */
		public function get alpha():Number
		{
			return this._alpha;
		}

		/**
		 * @private (setter)
		 */
		public function set alpha(value:Number):void
		{
			if(value === this._alpha) return;
			this._alpha = value;
		}

		/**
		 * @private
		 * Storage for weight
		 */
		private var _weight:Number = 1;

		/**
		 * The width of the line.
		 */
		public function get weight():Number
		{
			return this._weight;
		}

		/**
		 * @private (setter)
		 */
		public function set weight(value:Number):void
		{
			if(value === this._weight) return;
			this._weight = value;
		}

		/**
		 * @private
		 * Storage for type
		 */
		private var _type:String = "solid";

		/**
		 * The type of line to be drawn. 
		 * <ul>
		 * 	<li><code>solid</code>: solid line</li>
		 * 	<li><code>dashed</code>: dashed line</li>
		 * </ul>
		 *
		 * @default solid
		 */
		public function get type():String
		{
			return this._type;
		}

		/**
		 * @private (setter)
		 */
		public function set type(value:String):void
		{
			this._type = value;
		}

		/**
		 * @private
		 * Storage for dashLength
		 */
		private var _dashLength:Number = 10;

		/**
		 * Length of dash for line when the line type is
		 * <code>dashed</code>.
		 */
		public function get dashLength():Number
		{	
			return this._dashLength;
		}

		/**
		 * @private (setter)
		 */
		public function set dashLength(value:Number):void
		{
			this._dashLength = value;
		}

		/**
		 * @private
		 * Storage for gapSpace
		 */
		private var _gapSpace:Number = 10;

		/**
		 * Space between dashes when <code>type</code> is 
		 * <code>dashed</code>.
		 */
		public function get gapSpace():Number
		{
			return this._gapSpace;
		}

		/**
		 * @private (setter)
		 */
		public function set gapSpace(value:Number):void
		{
			this._gapSpace = value;
		}

		/**
		 * @private
		 * Storage for connectDiscontinuousPoints
		 */
		private var _connectDiscontinuousPoints:Boolean = true;

		/**
		 * Indicates whether to connect discontinuous points on a 
		 * line graph.
		 */
		public function get connectDiscontinuousPoints():Boolean
		{
			return this._connectDiscontinuousPoints;
		}

		/**
		 * @private (setter)
		 */
		public function set connectDiscontinuousPoints(value:Boolean):void
		{
			this._connectDiscontinuousPoints = value;
		}

		/**
		 * @private
		 * Storage for discontinuousType
		 */
		private var _discontinuousType:String = "dashed";

		/**
		 * The type of line to be drawn between discontinuous points of
		 * data when <code>connectDiscontinuousPoints</code> is true. 
		 * <ul>
		 * 	<li><code>solid</code>: solid line</li>
		 * 	<li><code>dashed</code>: dashed line</li>
		 * </ul>
		 *
		 * @default "dashed"
		 */
		public function get discontinuousType():String
		{
			return this._discontinuousType;
		}

		/**
		 * @private (setter)
		 */
		public function set discontinuousType(value:String):void
		{
			this._discontinuousType = value;
		}
		
		/**
		 * @private
		 * Storage for discontinuosDashLength
		 */
		private var _discontinuousDashLength:Number = 10;

		/**
		 * Length of dash for the line between discontinuous points when <code>connectDiscontuousPoints</code>
		 * is true and the <code>discontinuousType</code> is <code>dashed</code>.
		 */
		public function get discontinuousDashLength():Number
		{	
			return this._discontinuousDashLength;
		}

		/**
		 * @private (setter)
		 */
		public function set discontinuousDashLength(value:Number):void
		{
			this._discontinuousDashLength = value;
		}

		/**
		 * @private
		 * Storage for discontinousGapSpace
		 */
		private var _discontinuousGapSpace:Number = 10;

		/**
		 * Space between dashes for the line between discontinuous points when <code>connectDiscontuousPoints</code>
		 * is true and the <code>discontinuousType</code> is <code>dashed</code>.
		 */
		public function get discontinuousGapSpace():Number
		{
			return this._discontinuousGapSpace;
		}

		/**
		 * @private (setter)
		 */
		public function set discontinuousGapSpace(value:Number):void
		{
			this._discontinuousGapSpace = value;
		}

		/**
		 * @private (protected)
		 * Storage for <code>showLines</code>
		 */
		protected var _showLines:Boolean = true;

		/**
		 * Indicates whether to show lines.
		 */
		public function get showLines():Boolean
		{
			return this._showLines;
		}

		/**
		 * @private (setter)
		 */
		public function set showLines(value:Boolean):void
		{
			this._showLines = value;
		}

		/**
		 * @private (protected)
		 * Storage for <code>showMarkers</code>
		 */
		protected var _showMarkers:Boolean = true;

		/**
		 * Indicates whether to show markers
		 */
		public function get showMarkers():Boolean
		{
			return this._showMarkers;
		}

		/**
		 * @private (setter)
		 */
		public function set showMarkers(value:Boolean):void
		{
			this._showMarkers = value;
		}
	}
}
