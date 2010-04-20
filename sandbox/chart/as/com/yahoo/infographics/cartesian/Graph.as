package com.yahoo.infographics.cartesian
{
	import com.yahoo.renderers.Renderer;
	import com.yahoo.infographics.series.*;
	import com.yahoo.infographics.data.AxisData;
	import flash.utils.Dictionary;
	import flash.display.DisplayObject;
	import com.yahoo.renderers.layout.Container;
	import com.yahoo.renderers.layout.LayerStack;
	import com.yahoo.renderers.Skin;

	public class Graph extends Container
	{
	
	//--------------------------------------
	//  Constructor
	//--------------------------------------		
		/**
		 * Constructor
		 */
		public function Graph(seriesCollection:Array = null, handleEventListening:Boolean = false)
		{
			this._handleEventListening = handleEventListening;
			super(new LayerStack());
			this.parseSeriesCollection(seriesCollection);
		}

	//--------------------------------------
	//  Properties
	//--------------------------------------		
		/**
		 * @private (protected)
		 */
		protected var _handleEventListening:Boolean = false;

		/**
		 * @private
		 * Storage for hotSpot
		 */
		private var _hotSpot:Skin;

		/**
		 * Overlay that acts as a hot spot for graph related events.
		 */
		public function get hotSpot():Skin
		{
			return this._hotSpot;
		}

		/**
		 * @private (protected)
		 * Storage for <code>markers</code>
		 */
		protected var _markers:Vector.<SeriesMarker> = new Vector.<SeriesMarker>();

		/**
		 * Collection of all <code>SeriesMarker</code> instances that exist in
		 * the graph.
		 */
		public function get markers():Vector.<SeriesMarker>
		{
			return this._markers;
		}

		/**
		 * @private (setter)
		 */
		public function set markers(value:Vector.<SeriesMarker>):void
		{
			this._markers = value;
		}

		/**
		 * @private (protected) 
		 * Returns type from key value.
		 */
		protected var _seriesClasses:Object = {
			line:LineSeries,
			plot:PlotSeries,
			column:ColumnSeries,
			bar:BarSeries
		};

		/**
		 * @private
		 * Storage for <code>xcoords</code>
		 */
		private var _xcoords:Dictionary = new Dictionary();

		/**
		 * Look up table for x coordinates. This <code>Dictionary</code> instance
		 * is indexed by <code>AxisData</code> instances. Each index containers a
		 * key indexed hash that contains a <code>Vector</code> of x coordinates. Each
		 * horizontally aligned series will reference the <code>xcoords</code> for its
		 * category data coordinates. Typically, multiple series will share the same 
		 * category axis positioning data while maintaining its own value axis positioning
		 * data. This allows the category coordinates to be calculated once for all series.
		 */
		//Need to test performance here. Having to lookup the data in a dictionary may offset
		//any gain accomplished from eliminating duplicate calculations.
		public function get xcoords():Dictionary
		{
			return this._xcoords;
		}

		/**
		 * @private
		 * Storage for <code>ycoords</code>
		 */
		private var _ycoords:Dictionary = new Dictionary();

		/**
		 * Look up table for y coordinates. This <code>Dictionary</code> instance
		 * is indexed by <code>AxisData</code> instances. Each index containers a
		 * key indexed hash that contains a <code>Vector</code> of x coordinates. Each
		 * vertically aligned series will reference the <code>ycoords</code> for its
		 * category data coordinates. Typically, multiple series will share the same 
		 * category axis positioning data while maintaining its own value axis positioning
		 * data. This allows the category coordinates to be calculated once for all series.
		 */
		//Need to test performance here. Having to lookup the data in a dictionary may offset
		//any gain accomplished from eliminating duplicate calculations.
		public function get ycoords():Dictionary
		{
			return this._ycoords;
		}

		/**
		 * @private
		 * Storage for seriesTypes
		 */
		private var _seriesTypes:Object = {};

		/**
		 * Key indexed hash containing arrays of series by type.
		 */
		public function get seriesTypes():Object
		{
			return this._seriesTypes;
		}

		/**
	     * @private (protected)
		 * Collection of all series instances.
		 */
		protected var _seriesCollection:Vector.<ISeries> = new Vector.<ISeries>();

		public function get seriesCollection():Vector.<ISeries>
		{
			return this._seriesCollection;
		}

		public function set seriesCollection(value:Vector.<ISeries>):void
		{
			this._seriesCollection = value;
		}

	//--------------------------------------
	//  Public Methods
	//--------------------------------------		
		/**
		 * Factory method that creates and adds a series instance to the graph from
		 * series data.
		 * @param seriesData Hash of values associated with the series.
		 * @return Boolean
		 */
		public function createSeries(seriesData:Object):Boolean
		{
			var seriesType:Class,
				series:ISeries;
				seriesData.graph = this;
			if(seriesData.hasOwnProperty("type"))
			{
				seriesType = this.getSeries(seriesData.type);
				series = new seriesType(seriesData) as ISeries;
				this.addSeries(series);
				return true;
			}
			return false;
		}
	
	//--------------------------------------
	//  Protected Methods
	//--------------------------------------		
		/**
		 * @private (override)
		 */
		override protected function initializeRenderer():void
		{
			super.initializeRenderer();
			if(this._handleEventListening)
			{
				this._hotSpot = new Skin();
				this._hotSpot.setStyle("fillAlpha", 0);
				this.addItem(this._hotSpot);
			}
		}
		
		/**
		 * @private (protected)
		 */
		protected function getSeries(key:String):Class
		{
			if(this._seriesClasses.hasOwnProperty(key))
			{
				return this._seriesClasses[key] as Class;
			}
			return null;
		}

		/**
		 * @private (protected)
		 * Adds a series to the graph.
		 */
		protected function setCategoryCoordsReference(series:ISeries):void
		{
			var categoryData:AxisData,
				categoryKey:String,
				categoryAxis:String = "x",
				xcoords:Dictionary = this._xcoords,
				ycoords:Dictionary = this._ycoords;
			if(categoryAxis == "x")
			{
				categoryData = series.xAxisData as AxisData;
				categoryKey = series.xKey;
				if(!xcoords.hasOwnProperty(categoryData))
				{
					xcoords[categoryData] = {};
				}
				if(!xcoords[categoryData].hasOwnProperty(categoryKey))
				{
					xcoords[categoryData][categoryKey] = new Vector.<int>();
				}
				series.xcoords = xcoords[categoryData][categoryKey]; 
			}
			else if(categoryAxis == "y")
			{
				categoryData = series.yAxisData as AxisData;
				categoryKey = series.yKey;
				if(!ycoords.hasOwnProperty(categoryData))
				{
					ycoords[categoryData] = {};
				}
				if(!ycoords[categoryData].hasOwnProperty(categoryKey))
				{
					ycoords[categoryData][categoryKey] = new Vector.<int>();
				}
				series.ycoords = ycoords[categoryData][categoryKey]; 
			}
		}

		/**
		 * @private (protected)
		 * Adds series to the graph.
		 */
		protected function addSeries(series:ISeries):void
		{
			var type:String = series.type,
				seriesCollection:Vector.<ISeries> = this._seriesCollection,
				graphSeriesLength:int = seriesCollection.length,
				seriesTypes:Object = this._seriesTypes,
				typeSeriesCollection:Vector.<ISeries>,
				index:int;	
			this.setCategoryCoordsReference(series);
			if(!series.graph) series.graph = this;
			series.graphOrder = graphSeriesLength;
			seriesCollection.push(series);
			if(!seriesTypes.hasOwnProperty(type))
			{
				this._seriesTypes[type] = new Vector.<ISeries>();
			}
			typeSeriesCollection = this._seriesTypes[type];
			series.order = typeSeriesCollection.length;
			typeSeriesCollection.push(series);
			index = this.numChildren > 0 ? this.numChildren - 1 : 0;
			this.addItem(Renderer(series), {index:index});
		}

		/**
		 * @private (protected)
		 * Creates series instances from an array of either <code>ISeries</code> instances or
		 * hashes containing series data.
		 * @param seriesCollection Collection of <code>ISeries</code> instance and/or hashes of
		 * series data.
		 */
		protected function parseSeriesCollection(seriesCollection:Array = null):void
		{
			if(!seriesCollection)
			{
				return;
			}	
			var len:int = seriesCollection.length,
				i:int = 0,
				series:Object;
			for(i = 0; i < len; ++i)
			{	
				series = seriesCollection[i];
				if(!(series is ISeries))
				{
					this.createSeries(series);
					continue;
				}
				this.addSeries(series as ISeries);
			}
		}
		
		public function getSeriesLengthByType(value:String):int
		{
			var len:int = 0;
			if(this._seriesTypes.hasOwnProperty(value))
			{
				len = (this._seriesTypes as Vector.<ISeries>).length;
			}
			return len;
		}
	}
}
