package com.yahoo.infographics.series
{
	import com.yahoo.util.GraphicsUtil;
	import com.yahoo.infographics.data.AxisData;
	import com.yahoo.infographics.data.events.DataEvent;
	import com.yahoo.infographics.styles.LineStyles;
	import com.yahoo.renderers.events.RendererEvent;
	import flash.display.Graphics;

	/**
	 * Class used for drawing a line graph.
	 */
	public class LineSeries extends PlotSeries
	{
		/**
		 * Constructor
		 */
		public function LineSeries(series:Object)
		{
			super(series);
		}
		
		/**
		 * @private
		 * Style class for the graph.
		 */
		private static var _styleClass:Class = LineStyles;
		
		/**
		 * @private (protected)
		 */
		private var _type:String = "line";
		
		/**
		 * Indicates the type of graph.
		 */
		override public function get type():String
		{
			return this._type;
		}

		/**
		 * @private (setter)
		 */
		override public function set type(value:String):void
		{
			this._type = value;
		}
		/**
		 * @private (override)
		 */
		override protected function initializeStyleProps():void
		{
			super.initializeStyleProps();
			this._weight = Number(this.getStyle("weight"));
			this._color = uint(this.getStyle("color"));
			this._alpha = Number(this.getStyle("alpha")); 
			this._showMarkers = this.getStyle("showMarkers");
			this._showLines = this.getStyle("showLines");
			this.setDimensions();
		}
		
		/**
		 * @inheritDoc
		 */
		override public function getStyleClass():Class
		{
			return _styleClass;
		}		

		/**
		 * @private (protected)
		 */
		protected var _weight:Number;
		
		/**
		 * @private (protected)
		 */
		protected var _color:uint;
		
		/**
		 * @private (protected)
		 */
		protected var _alpha:Number;

		/**
		 * @private (protected)
		 */
		protected var _showMarkers:Boolean;

		/**
		 * @private (protected)
		 */
		protected var _showLines:Boolean;
		
		/**
		 * @private (override)
		 */
		override public function checkStyleFlags():Boolean  
		{
			return this.checkFlags({
				color:true,
				weight:true,
				alpha:true,	
				type:true,
				dashLength:true,
				gapLength:true,
				connectDiscontinuousPoints:true,
				discontinuousType:true,
				discontinuousDashLength:true,
				discontinuousGapLength:true
			});
		}

		/**
		 * @private (override)
		 */
		override protected function updateStyleProps():void
		{
			super.updateStyleProps();
			if(this.checkFlag("weight")) this._weight = Number(this.getStyle("weight"));
			if(this.checkFlag("color")) this._color = uint(this.getStyle("color"));
			if(this.checkFlag("alpha")) this._alpha = Number(this.getStyle("alpha"));
			if(this.checkFlag("showMarkers")) this._showMarkers = this.getStyle("showMarkers");
			if(this.checkFlag("showLines")) this._showLines = this.getStyle("showLine");
		}

		/**
		 * @private
		 */
		override protected function drawGraph():void
		{
			if(this._showLines) this.drawLines();
			if(this._showMarkers) this.drawMarkers();
		}

		/**
		 * @protected
		 */
		protected function drawLines():void
		{
			if(this._xcoords.length < 1) return;
			var	xcoords:Vector.<int> = this._xcoords,
				ycoords:Vector.<int> = this._ycoords,
				len:int = xcoords.length,
				lastValidX:int,
				lastValidY:int,
				lastX:int = xcoords[0] as int,
				lastY:int = ycoords[0] as int,
				nextX:int,
				nextY:int,
				i:int,
				styles:Object = this.getStyles(),
				lineType:String = styles.type as String,
				dashLength:Number = Number(styles.dashLength),
				gapSpace:Number = Number(styles.gapSpace),
				connectDiscontinuousPoints:Boolean = styles.connectDiscontinuousPoints as Boolean,
				discontinuousType:String = String(styles.discontinuousType),
				discontinuousDashLength:Number = Number(styles.discontinuousDashLength),
				discontinuousGapSpace:Number = Number(styles.discontinuousGapSpace),
				graphics:Graphics = this.graphics;
			graphics.clear();
			lastValidX = lastX;
			lastValidY = lastY;

			graphics.lineStyle (this._weight, this._color, this._alpha);
			graphics.moveTo (lastX, lastY);
			for(i = 1; i < len; i = ++i)
			{
				nextX = xcoords[i] as int;
				nextY = ycoords[i] as int;
				if(isNaN(nextY))
				{
					lastValidX = nextX;
					lastValidY = nextY;
					continue;
				}
				if(lastValidX == lastX)
				{
					if(lineType != "dashed")
					{
						graphics.lineTo(nextX, nextY);
					}
					else
					{
						GraphicsUtil.drawDashedLine(graphics, lastValidX, lastValidY, nextX, nextY, 
													dashLength, 
													gapSpace);
					}
				}
				else if(!connectDiscontinuousPoints)
				{
					graphics.moveTo(nextX, nextY);
				}
				else
				{
					if(discontinuousType != "solid")
					{
						GraphicsUtil.drawDashedLine(graphics, lastValidX, lastValidY, nextX, nextY, 
													discontinuousDashLength, 
													discontinuousGapSpace);
					}
					else
					{
						graphics.lineTo(nextX, nextY);
					}
				}
			
				lastX = lastValidX = nextX;
				lastY = lastValidY = nextY;
			}
		}
	}
}
