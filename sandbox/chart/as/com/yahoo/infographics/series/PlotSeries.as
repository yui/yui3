package com.yahoo.infographics.series
{
	import com.yahoo.infographics.data.AxisData;
	import flash.display.DisplayObject;
	import com.yahoo.renderers.Renderer;
	import com.yahoo.infographics.styles.PlotStyles;
	import flash.display.Sprite;
	import flash.display.DisplayObject;
	import flash.display.InteractiveObject;
	import flash.events.MouseEvent;
	import com.yahoo.display.*;

	public class PlotSeries extends Cartesian
	{
		/**
		 * Constructor
		 */
		public function PlotSeries(series:Object)
		{
			super(series);
		}

		/**
		 * @private
		 * Style class for the graph.
		 */
		private static var _styleClass:Class = PlotStyles;
		
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
		private var _type:String = "plot";
		
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
		 * @private (protected)
		 * Collection or markers to be displayed.
		 */
		protected var _markers:Vector.<SeriesMarker> = new Vector.<SeriesMarker>();

		public function get markers():Vector.<SeriesMarker>
		{
			return this._markers;
		}
		/**
		 * @private (protected)
		 * Collection of markers to be displayed.
		 */
		protected var _markerCache:Vector.<SeriesMarker> = new Vector.<SeriesMarker>();

		/**
		 * @private
		 */
		protected var _markerClass:Class;
		
		/**
		 * @private
		 */
		protected var _markerStyles:Object;

		/**
		 * @private (protected)
		 * Factory for creating <code>SeriesMarker</code> instances.
		 */
		protected var _markerFactory:ISkinFactory;
		
		/**
		 * @private (protected)
		 * Hash ISkinFactory classes.
		 */
		protected var _skinFactoryHash:Object = {
			bitmap:BitmapSkinFactory
		};

		/**
		 * @private (protected)
		 */
		protected function getSkinFactoryClass(value:String):Class
		{
			return this._skinFactoryHash[value] as Class;
		}

		/**
		 * @private
		 */
		override protected function initializeStyleProps():void
		{
			super.initializeStyleProps();
			this.updateMarker();
		}

		/**
		 * @private (override)
		 */
		override protected function drawGraph():void
		{
			this.drawMarkers();
		}

		/**
		 * @private (override)
		 */
		override protected function updateStyleProps():void
		{
			if(this.checkFlag("marker"))
			{
				this.updateMarker();
			}
		}
		
		/**
		 * @private (protected)
		 * Creates a <code>InstanceFactory</code> for creating markers.
		 */
		protected function updateMarker():void
		{
			var i:int,
				len:int = this._markers.length,
				marker:Object = this.getStyle("marker"),
				markerClass:Class = this.getSkinFactoryClass(marker.skin);
			this.removeMarkers();
			if(!(this._markerClass is markerClass))
			{
				this._markerFactory = new markerClass(marker.props, marker.styles);
				this._markerClass = markerClass;
			}
			else
			{
				this._markerFactory.createTemplate(marker.props, marker.styles);
			}
		}

		/**
		 * @private (protected)
		 * Creates and positions markers for the series.
		 */
		protected function drawMarkers():void
		{
			var xcoords:Vector.<int> = this._xcoords,
				ycoords:Vector.<int> = this._ycoords,
				len:int = xcoords.length,
				i:int,
				marker:SeriesMarker;
			this.createMarkerCache();
			for(i = 0;i < len; i = ++i)
			{
				marker = this.getMarker();
				marker.x = Number(xcoords[i] - marker.width/2);
				marker.y = Number(ycoords[i] - marker.height/2);
				marker.x = Number(xcoords[i] - marker.width/2);
				marker.y = Number(ycoords[i] - marker.height/2);
				this._markers.push(marker);		
			}
			this.clearMarkerCache();
		}

		/**
		 * @private (protected)
		 * Movers markers from the marker collection to the cache collection
		 * and clears the marker collection.
		 */
		protected function createMarkerCache():void
		{
			this._markerCache = this._markers.concat();
			this._markers = new Vector.<SeriesMarker>();
		}

		/**
		 * @private (protected)
		 * Removes markers in the cache from the cache collection and 
		 * the display list.
		 */
		protected function clearMarkerCache():void
		{
			var cache:Vector.<SeriesMarker> = this._markerCache,
				len:int = cache.length,
				marker:SeriesMarker;
			while(len > 0)
			{
				marker = SeriesMarker(cache.shift());
				marker.removeEventListener(MouseEvent.ROLL_OVER, markerRollOverHandler);
				marker.removeEventListener(MouseEvent.ROLL_OUT, markerRollOutHandler);
				marker.removeEventListener(MouseEvent.CLICK, markerClickHandler);
				marker.removeEventListener(MouseEvent.DOUBLE_CLICK, markerDoubleClickHandler);
				this.removeChild(marker);
				--len;
			}
		}

		/**
		 * @private (protected)
		 * Returns a marker. If one does not exist in the cache
		 * collection, one is created.
		 */
		protected function getMarker():SeriesMarker
		{
			var marker:SeriesMarker,
				cache:Vector.<SeriesMarker> = this._markerCache,
				len:int = cache.length,
				styles:Object = this._markerStyles;
			if(len > 0)
			{
				marker = SeriesMarker(cache.shift());
			}
			else
			{
				marker = new SeriesMarker();
				marker.series = this;
				marker.skin = this._markerFactory.getSkinInstance(); 
				InteractiveObject(marker).doubleClickEnabled = true;
				marker.addEventListener(MouseEvent.ROLL_OVER, markerRollOverHandler, false, 0, true);
				marker.addEventListener(MouseEvent.ROLL_OUT, markerRollOutHandler, false, 0, true);
				marker.addEventListener(MouseEvent.CLICK, markerClickHandler, false, 0, true);
				marker.addEventListener(MouseEvent.DOUBLE_CLICK, markerDoubleClickHandler, false, 0, true);
			}
			this.addChild(marker);	
			return marker;
		}

		/**
		 * @private (protected)
		 * Removes all markers from the display list and clears the marker and cache
		 * collections.
		 */
		protected function removeMarkers():void
		{
			var cache:Vector.<SeriesMarker> = this._markers,
				len:int = cache.length,
				marker:SeriesMarker;
			while(len > 0)
			{
				marker = SeriesMarker(cache.shift());
				marker.removeEventListener(MouseEvent.ROLL_OVER, markerRollOverHandler);
				marker.removeEventListener(MouseEvent.ROLL_OUT, markerRollOutHandler);
				marker.removeEventListener(MouseEvent.CLICK, markerClickHandler);
				marker.removeEventListener(MouseEvent.DOUBLE_CLICK, markerDoubleClickHandler);
				this.removeChild(marker);
				--len;
			}
			this.clearMarkerCache();
		}

		/**
		 * @private (protected)
		 */
		protected function markerRollOverHandler(event:MouseEvent):void
		{
		}

		/**
		 * @private (protected)
		 */
		protected function markerRollOutHandler(event:MouseEvent):void
		{
		}
		
		/**
		 * @private (protected)
		 */
		protected function markerClickHandler(event:MouseEvent):void
		{
		}
		
		/**
		 * @private (protected)
		 */
		protected function markerDoubleClickHandler(event:MouseEvent):void
		{
		}
	}
}
