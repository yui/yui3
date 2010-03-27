package com.yahoo.infographics.cartesian
{
	import com.yahoo.infographics.data.AxisData;
	import com.yahoo.infographics.data.events.DataEvent;
	import com.yahoo.renderers.Renderer;
	import com.yahoo.infographics.styles.CartesianStyles;

	/**
	 * Cartesian is the base class for Cartesian Graphs. The Cartesian class is an abstract 
	 * base class; therefore, you cannot call Cartesian directly.
	 */
	public class Cartesian extends Renderer
	{
		/**
		 * @private
		 * Reference to style class used.
		 */
		private static var _styleClass:Class = CartesianStyles;
	
		/**
		 * Constructor
		 */
		public function Cartesian(xAxisData:AxisData, yAxisData:AxisData, xKey:String, yKey:String) 
		{
			super();
			this.xAxisData = xAxisData;
			this.yAxisData = yAxisData;
			this.xKey = xKey;
			this.yKey = yKey;
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
		 * Storage for xAxisData
		 */
		private var _xAxisData:AxisData;
		
		/**
		 * Reference to the <code>AxisData</code> instance used for assigning 
		 * x-values to the graph.
		 */
		public function get xAxisData():AxisData
		{ 
			return _xAxisData;
		}

		/**
		 * @private (setter)
		 */
		public function set xAxisData(value:AxisData):void
		{
			if (value !== _xAxisData)
			{
				if(this.xAxisData) 
				{
					this.xAxisData.removeEventListener(DataEvent.NEW_DATA, this.xAxisDataChangeHandler);
					this.xAxisData.removeEventListener(DataEvent.DATA_CHANGE, this.xAxisDataChangeHandler);
				}
				_xAxisData = value;			
				this.xAxisData.addEventListener(DataEvent.NEW_DATA, this.xAxisDataChangeHandler);
				this.xAxisData.addEventListener(DataEvent.DATA_CHANGE, this.xAxisDataChangeHandler);
				this.setFlag("axisDataChange");
			}
		}
		
		/**
		 * @private
		 * Storage for yAxisData
		 */
		private var _yAxisData:AxisData;
		
		/**
		 * Reference to the <code>AxisData</code> instance used for assigning 
		 * y-values to the graph.
		 */
		public function get yAxisData():AxisData
		{ 
			return _yAxisData;
			
		}

		/**
		 * @private (setter)
		 */
		public function set yAxisData(value:AxisData):void
		{
			if (value !== _yAxisData)
			{
				if(this.yAxisData) 
				{
					this.yAxisData.removeEventListener(DataEvent.NEW_DATA, this.yAxisDataChangeHandler);
					this.yAxisData.removeEventListener(DataEvent.DATA_CHANGE, this.yAxisDataChangeHandler);
				}
				_yAxisData = value;
				this.yAxisData.addEventListener(DataEvent.NEW_DATA, this.yAxisDataChangeHandler);
				this.yAxisData.addEventListener(DataEvent.DATA_CHANGE, this.yAxisDataChangeHandler);
				this.setFlag("axisDataChange");
			}
		}
		
		/**
		 * @private
		 * Storage for xKey
		 */
		private var _xKey:String;
		
		/**
		 * Indicates which array to from the hash of value arrays in 
		 * the x-axis <code>AxisData</code> instance.
		 */
		public function get xKey():String
		{ 
			return _xKey; 
		}

		/**
		 * @private (setter)
		 */
		public function set xKey(value:String):void
		{
			if (value !== _xKey)
			{
				_xKey = value;
				this.setFlag("xKeyChange");
			}
		}
		
		/**
		 * @private
		 * Storage for yKey
		 */
		private var _yKey:String;
		
		/**
		 * Indicates which array to from the hash of value arrays in 
		 * the y-axis <code>AxisData</code> instance.
		 */
		public function get yKey():String
		{ 
			return _yKey; 
		}

		/**
		 * @private (setter)
		 */
		public function set yKey(value:String):void
		{
			if (value !== _yKey)
			{
				_yKey = value;
				this.setFlag("yKeyChange");
			}
		}

		/**
		 * @private (protected)
		 */
		protected var _topPadding:Number = 0;

		/**
		 * @private (protected)
		 */
		
		protected var _rightPadding:Number = 0;
		/**
		 * @private (protected)
		 */
		
		protected var _bottomPadding:Number = 0;
		/**
		 * @private (protected)
		 */
		
		protected var _leftPadding:Number = 0;
		
		/**
		 * @private (protected)
		 */
		protected var _dataWidth:Number = 0;
		
		/**
		 * @private (protected)
		 */
		protected var _dataHeight:Number = 0;
		
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
		protected var _pointValues:Vector.<int>;
		
		/**
		 * @private (protected)
		 * Handles updating the graph when the x < code>AxisData</code> values
		 * change.
		 */
		protected function xAxisDataChangeHandler(event:DataEvent):void
		{
			if(this.xKey) this.setFlag("axisDataChange");
		}

		/**
		 * @private (protected)
		 * Handles updating the chart when the y <code>AxisData</code> values
		 * change.
		 */
		protected function yAxisDataChangeHandler(event:DataEvent):void
		{
			if(this.yKey) this.setFlag("axisDataChange");
		}
		
		/**
		 * @private
		 */
		protected function setAreaData():void
		{
			var nextX:int, nextY:int,
				pointValues:Vector.<int> = new Vector.<int>(), 
				xScaleFactor:Number = this._dataWidth / (this._xMax - this._xMin),
				yScaleFactor:Number = this._dataHeight / (this._yMax - this._yMin),
				xData:Array = xAxisData.keys[xKey] as Array,
				yData:Array = yAxisData.keys[yKey] as Array,
				dataLength:int = xData.length, 	
				midY:Number = this._dataHeight/2,
				xmax:Number = this._xMax,
				xmin:Number = this._xMin,
				ymax:Number = this._yMax,
				ymin:Number = this._yMin,
				leftPadding:Number = this._leftPadding,
				topPadding:Number = this._topPadding,
				dataHeight:Number = this._dataHeight;
			
			for (var i:int = 0; i < dataLength; ++i) 
			{
				//Math.round hack. gain 1 to 2 ms on loops of 10000. needs more testing.
				nextX = int(0.5 + (((Number(xData[i]) - xmin) * xScaleFactor) + leftPadding)),
				nextY = int(0.5 +((dataHeight + topPadding) - (Number(yData[i]) - ymin) * yScaleFactor)),
				pointValues.push(nextX);
				pointValues.push(nextY);
			}
			this._pointValues = pointValues;
		}

		/**
		 * @private (protected)
		 */
		protected function setDimensions():void
		{
			var padding:Object = this.getStyle("padding"),
				w:Number = this.width,
				h:Number = this.height;
			this._topPadding = Number(padding.top);
			this._rightPadding = Number(padding.right);
			this._bottomPadding = Number(padding.bottom);
			this._leftPadding = Number(padding.left);
			this._dataWidth = w - (this._leftPadding + this._rightPadding);
			this._dataHeight = h - (this._topPadding + this._bottomPadding);
		}

		/**
		 * @private
		 */
		protected function drawGraph(values:Vector.<int>):void
		{
		};
		
		/**
		 * @private (override)
		 */
		override protected function render():void
		{
			var dataChange:Boolean = this.checkDataFlags(),
				resize:Boolean = this.checkResizeFlags(),
				styleChange:Boolean = this.checkStyleFlags(),
				w:Number = this.width,
				h:Number = this.height;
			
			this.updateStyleProps();

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

			if ((resize || dataChange) && (!isNaN(w) && !isNaN(h) && w > 0 && h > 0))
			{
				this.setAreaData();
				if(this._pointValues) 
				{
					this.setLaterFlag("drawGraph");
				}
				return;
			}
			
			if(this.checkFlag("drawGraph") || (styleChange && this._pointValues)) this.drawGraph(this._pointValues);
		}

		public function checkDataFlags():Boolean 
		{
			return this.checkFlags({
				axisDataChange:true,
				xKeyChange:true,
				yKeyChange:true
			});
		}

		public function checkResizeFlags():Boolean
		{
			return this.checkFlags({
				padding:true,
				resize:true
			});
		}

		public function checkStyleFlags():Boolean 
		{
			return false;
		}
		
		public function updateStyleProps():void
		{
		}
	}
}
