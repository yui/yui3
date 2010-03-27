package com.yahoo.infographics.cartesian
{
	import com.yahoo.util.GraphicsUtil;
	import com.yahoo.infographics.data.AxisData;
	import com.yahoo.infographics.data.events.DataEvent;
	import com.yahoo.infographics.constants.ScaleTypes;
	import com.yahoo.infographics.styles.LineStyles;
	import com.yahoo.renderers.events.RendererEvent;
	import com.yahoo.renderers.Skin;
	import flash.display.Graphics;

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
			super(xAxisData, yAxisData, xKey, yKey);
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

		override public function updateStyleProps():void
		{
			if(this.checkFlag("weight")) this._weight = Number(this.getStyle("weight"));
			if(this.checkFlag("color")) this._color = uint(this.getStyle("color"));
			if(this.checkFlag("alpha")) this._alpha = Number(this.getStyle("alpha"));
		}

		/**
		 * @private
		 */
		override protected function drawGraph(values:Vector.<int>):void
		{
			var	len:int = values.length,
				lastValidX:int,
				lastValidY:int,
				lastX:int = values[0] as int,
				lastY:int = values[1] as int,
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
			for(i = 2; i < len; i = i + 2)
			{
				nextX = values[i] as int;
				nextY = values[i + 1] as int;
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
