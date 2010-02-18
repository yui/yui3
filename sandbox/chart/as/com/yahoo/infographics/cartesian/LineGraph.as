package com.yahoo.infographics.cartesian
{
	import com.yahoo.util.GraphicsUtil;
	import com.yahoo.infographics.data.AxisData;
	import com.yahoo.infographics.data.events.DataEvent;
	import com.yahoo.infographics.constants.ScaleTypes;
	import com.yahoo.infographics.styles.LineStyles;
	import com.yahoo.renderers.events.RendererEvent;
	import flash.geom.Point;
	/**
	 * Class used for drawing a line graph.
	 */
	public class LineGraph extends Cartesian
	{
		/**
		 * Constructor
		 */
		public function LineGraph(xAxisData:AxisData, yAxisData:AxisData, xKey:String, yKey:String)
		{
			super();
			this.xAxisData = xAxisData;
			this.yAxisData = yAxisData;
			this.xKey = xKey;
			this.yKey = yKey;
		}
		
		/**
		 * @private
		 * Style class for the graph.
		 */
		private static var _styleClass:Class = LineStyles;
		
		/**
		 * @private (override)
		 */
		override protected function initializeRenderer():void
		{
			super.initializeRenderer();
			this._weight = Number(this.getStyle("weight"));
			this._color = uint(this.getStyle("color"));
			this._alpha = Number(this.getStyle("alpha")); 
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
		 * Clears the graphics for the LineGraph
		 */
		public function clear () : void
		{
			this.graphics.clear();
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
		protected var _xMin:Number;
		
		/**
		 * @private (protected)
		 */
		protected var _xMax:Number;
		
		/**
		 * @private (protected)
		 */
		protected var _yMin:Number;
		
		/**
		 * @private (protected)
		 */
		protected var _yMax:Number;

		/**
		 * @private (protected)
		 */
		protected var _pointValues:Vector.<Point>;

		/**
		 * @private (override)
		 */
		override protected function render():void
		{
			var dataChange:Boolean = this.checkFlags(
			{
				axisDataChange:true,
				xKeyChange:true,
				yKeyChange:true
			});
			var resize:Boolean = this.checkFlags(
			{
				padding:true,
				resize:true
			});
			
			var styleChange:Boolean = this.checkFlags({
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
			
			if(this.checkFlag("weight")) this._weight = Number(this.getStyle("weight"));
			if(this.checkFlag("color")) this._color = uint(this.getStyle("color"));
			if(this.checkFlag("alpha")) this._alpha = Number(this.getStyle("alpha"));
			
			if(dataChange)
			{
				this._xMin = xAxisData.minimum as Number;
				this._xMax = xAxisData.maximum as Number;
				this._yMin = yAxisData.minimum as Number;
				this._yMax = yAxisData.maximum as Number;
			}
			
			if(resize)
			{
				this.setDimensions();
			}

			if (resize || dataChange)
			{
				this.setAreaData();
				this.setLaterFlag("drawGraph");
				return;
			}
			
			if(this.checkFlag("drawGraph") || styleChange) this.drawLines();
		}

		/**
		 * @private (protected)
		 */
		protected function setDimensions():void
		{
			var padding:Object = this.getStyle("padding");
			this._topPadding = Number(padding.top);
			this._rightPadding = Number(padding.right);
			this._bottomPadding = Number(padding.bottom);
			this._leftPadding = Number(padding.left);
			this._dataWidth = this.width - (this._leftPadding + this._rightPadding);
			this._dataHeight = this.height - (this._topPadding + this._bottomPadding);
		}

		/**
		 * @private
		 */
		private function setAreaData():void
		{
			var pointValues:Vector.<Point> = new Vector.<Point>();
			var xScaleFactor:Number = this._dataWidth / (this._xMax - this._xMin);
			var yScaleFactor:Number = this._dataHeight / (this._yMax - this._yMin);
			var xData:Array = xAxisData.keys[xKey] as Array;
			var yData:Array = yAxisData.keys[yKey] as Array;
			
			var dataLength:int = xData.length;
			var nextX:int = Math.round((this.xAxisData.getKeyValueAt(this.xKey, 0) - this._xMin) * xScaleFactor);
			nextX = Math.round(nextX + this._leftPadding);
			var nextY:int = Math.round(this._dataHeight - (this.yAxisData.getKeyValueAt(this.yKey, 0) - this._yMin) * yScaleFactor);
			nextY = Math.round(nextY + this._topPadding);
			var midY:Number = this._dataHeight/2;
			pointValues.push(new Point(nextX, nextY));

			var numHolder:Number;
			for (var i:int = 1; i < dataLength; i++) 
			{
				numHolder = (this.xAxisData.getKeyValueAt(this.xKey, i) - this._xMin) * xScaleFactor;
				numHolder += this._leftPadding;
				nextX = Math.round(numHolder);
				numHolder = this._dataHeight - (this.yAxisData.getKeyValueAt(this.yKey, i) - this._yMin) * yScaleFactor;
				numHolder += this._topPadding;
				nextY = Math.round(numHolder);

				pointValues.push(new Point(nextX, nextY));
			}
			this._pointValues = pointValues;
		}
		
		/**
		 * @private
		 */
		private function drawLines():void
		{
			var values:Vector.<Point> = this._pointValues;
			var lastValidX:int;
			var lastValidY:int;
			var lastX:int = Point(values[0]).x as int;
			var lastY:int = Point(values[0]).y as int;
			var nextX:int;
			var nextY:int;

			clear();
			lastValidX = lastX;
			lastValidY = lastY;
			this.graphics.lineStyle (this._weight, this._color, this._alpha);
			this.graphics.moveTo (lastX, lastY);
			var len:int = values.length;
			for(var i:int = 1; i < len; i++)
			{
				nextX = Point(values[i]).x as int;
				nextY = Point(values[i]).y as int;
				if(isNaN(nextY))
				{
					lastValidX = nextX;
					lastValidY = nextY;
					continue;
				}
				if(lastValidX == lastX)
				{
					if(this.getStyle("type") != "dashed")
					{
						this.graphics.lineTo(nextX, nextY);
					}
					else
					{
						GraphicsUtil.drawDashedLine(this.graphics, lastValidX, lastValidY, nextX, nextY, 
													this.getStyle("dashLength") as Number, 
													this.getStyle("gapSpace") as Number);
					}
				}
				else if(!(this.getStyle("connectDiscontinuousPoints") as Boolean))
				{
					this.graphics.moveTo(nextX, nextY);
				}
				else
				{
					if(this.getStyle("discontinuousType") != "solid")
					{
						GraphicsUtil.drawDashedLine(this.graphics, lastValidX, lastValidY, nextX, nextY, 
													this.getStyle("discontinuousDashLength") as Number, 
													this.getStyle("discontinuousGapSpace") as Number);
					}
					else
					{
						this.graphics.lineTo(nextX, nextY);
					}

				}
				lastX = lastValidX = nextX;
				lastY = lastValidY = nextY;
			}
		}
	}
}
