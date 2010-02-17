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
		public function Cartesian() 
		{
			super();
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
	}

}
