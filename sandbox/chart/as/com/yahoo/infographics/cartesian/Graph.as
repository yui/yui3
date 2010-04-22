package com.yahoo.infographics.cartesian
{
	import com.yahoo.renderers.Renderer;
	import com.yahoo.infographics.series.*;
	import com.yahoo.infographics.data.AxisData;
	import flash.display.DisplayObject;
	import com.yahoo.renderers.layout.Container;
	import com.yahoo.renderers.layout.LayerStack;
	import com.yahoo.renderers.Skin;
	import flash.events.Event;
	import com.yahoo.infographics.events.GraphEvent;
	import flash.events.MouseEvent;

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
	     * @private 
		 * Storage for seriesCollection.
		 */
		private var _seriesCollection:Vector.<ISeries> = new Vector.<ISeries>();

		/**
		 * Collection of all series instances.
		 */
		public function get seriesCollection():Vector.<ISeries>
		{
			return this._seriesCollection;
		}

		/**
		 * @private (setter)
		 */
		public function set seriesCollection(value:Vector.<ISeries>):void
		{
			this._seriesCollection = value;
		}

		/**
		 * @private 
		 * Storage for dataTip
		 */
		private var _dataTip:DataTip;

		/**
		 * @private
		 * Collection of <code>SeriesMarker</code> indexed event data.
		 */
		private var _eventMarkers:Array = [];

		/**
		 * @private
		 * Number of overlays in the graph. Overlays are items that should appear above all series.
		 * (e.g. hotSpot and DataTip)
		 */
		private var _overlayCount:int = 0;

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
	
		/**
		 * Returns the length of a series collection by type.
		 */
		public function getSeriesLengthByType(value:String):int
		{
			var len:int = 0;
			if(this._seriesTypes.hasOwnProperty(value))
			{
				len = (this._seriesTypes as Vector.<ISeries>).length;
			}
			return len;
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
				this._hotSpot.addEventListener(MouseEvent.MOUSE_OUT, this.hotSpotRollOutHandler);
				this._overlayCount++;
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
			index = Math.max(this.numChildren - this._overlayCount, 0);
			this.addItem(Renderer(series), {index:index});
			this.dispatchEvent(new GraphEvent(GraphEvent.SERIES_ADDED, series));
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
		
		/**
		 * @private (override)
		 */
		override protected function render():void
		{
			var i:int,
				eventMarkers:Array = this._eventMarkers,
				displayData:Object,
				categoryLabel:String,
				valueLabel:String,
				series:ISeries,
				seriesIndex:int,
				yKey:String,
				xKey:String,
				marker:SeriesMarker,
				len:int = eventMarkers.length;
		
			if(this.checkFlag("markerEvent"))
			{
				for(i = 0; i < len; ++i)
				{
					marker = eventMarkers[i] as SeriesMarker;
					series = marker.series as ISeries;
					xKey = series.xKey;
					yKey = series.yKey;
					seriesIndex = marker.index;
					//Hack for establishing direction of chart. Probably better way to handle. (e.g. Set direction for graph and allow that to 
					//define the direction for all other series. This will allow for vertical plot and line series)
					if(series is BarSeries)
					{
						categoryLabel = series.yAxisMode.getLabelByIndex(yKey, seriesIndex);
						valueLabel = series.xAxisMode.getLabelByIndex(xKey, seriesIndex);
					}
					else
					{
						categoryLabel = series.xAxisMode.getLabelByIndex(xKey, seriesIndex);
						valueLabel = series.yAxisMode.getLabelByIndex(yKey, seriesIndex);
					}
					
					if(!displayData)
					{
						displayData = {};
					}

					if(!displayData.hasOwnProperty(categoryLabel))
					{
						displayData[categoryLabel] = [];
					}

					(displayData[categoryLabel] as Array).push({displayName:series.displayName, 
						valueLabel:valueLabel,
						styles:series.getStyle("marker").styles
						});
				}
				this.dispatchEvent(new GraphEvent(GraphEvent.MARKER_EVENT, displayData));
			}
			
			super.render();
		}
		
	//--------------------------------------
	//  Private Methods
	//--------------------------------------		
		/**
		 * @private
		 */
		private function addSeriesItem(marker:SeriesMarker):void
		{
			var eventMarkers:Array = this._eventMarkers,
				markerIndex:int = eventMarkers.indexOf(marker);
			if(markerIndex == -1)
			{
				eventMarkers.push(marker);
				this.setFlag("markerEvent");
			}
		}
		
		/**
		 * @private
		 * Removes an <code>SeriesMarker</code> instance from the eventMarkers collection.
		 */
		private function removeSeriesItem(marker:SeriesMarker):void
		{
			var eventMarkers:Array = this._eventMarkers,
				markerIndex:int = eventMarkers.indexOf(marker);
			if(markerIndex > -1)
			{
				eventMarkers.splice(markerIndex, 1);
				this.setFlag("markerEvent");
			}
		}

	//--------------------------------------
	//  Event Handlers
	//--------------------------------------		
		/**
		 * Event handler for <code>SeriesMarker</code> <code>rollOver</code> events.
		 */
		public function markerRollOverHandler(event:Event):void
		{
			this.addSeriesItem(SeriesMarker(event.target));
		}

		/**
		 * Event handler for <code>SeriesMarker</code> <code>rollOut</code> events.
		 */
		public function markerRollOutHandler(event:Event):void
		{
			this.removeSeriesItem(SeriesMarker(event.target));
		}
		
		/**
		 * Event handler for <code>SeriesMarker</code> <code>click</code> events.
		 */
		public function markerClickHandler(event:Event):void
		{
			var marker:SeriesMarker = SeriesMarker(event.target);
			if(!this.visible)
			{
				this.addSeriesItem(marker);
			}
			else
			{
				this._eventMarkers.splice(this._eventMarkers.indexOf(marker), 1);
				this.setFlag("markerEvent");
			}
		}

		/**
		 * Event handler for <code>SeriesMarker</code> <code>doubleClick</code> events.
		 */
		public function markerDoubleClickHandler(event:Event):void
		{
			this.markerClickHandler(event);
		}

		/**
		 * @private
		 */
		private function hotSpotRollOutHandler(event:MouseEvent):void
		{
			this.dispatchEvent(new GraphEvent(GraphEvent.MARKER_EVENT, null));
		}
	}
}
