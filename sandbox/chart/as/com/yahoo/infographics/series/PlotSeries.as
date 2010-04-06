package com.yahoo.infographics.series
{
	import com.yahoo.infographics.data.AxisData;
	import flash.display.DisplayObject;
	import com.yahoo.renderers.Renderer;
	import com.yahoo.infographics.styles.PlotStyles;
	import flash.display.Sprite;
	import com.yahoo.util.InstanceFactory;

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
		protected var _markers:Vector.<Sprite> = new Vector.<Sprite>();

		/**
		 * @private (protected)
		 * Collection of markers to be displayed.
		 */
		protected var _markerCache:Vector.<Sprite> = new Vector.<Sprite>();

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
		protected var _markerFactory:InstanceFactory;
		
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
			var marker:Object = this.getStyle("marker"),
			markerClass:Class = SeriesMarker;
			marker.props.styles = marker.styles;
			if(markerClass !== this._markerClass)
			{
				this.removeMarkers();
				this._markerFactory = new InstanceFactory(markerClass, marker.props, [{methodName:"drawSkin"}]);
				this._markerClass = markerClass as Class;
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
				marker:Sprite;
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
			this._markers = new Vector.<Sprite>();
		}

		/**
		 * @private (protected)
		 * Removes markers in the cache from the cache collection and 
		 * the display list.
		 */
		protected function clearMarkerCache():void
		{
			var cache:Vector.<Sprite> = this._markerCache,
				len:int = cache.length;
			while(len > 0)
			{
				this.removeChild(DisplayObject(cache.shift()));
				--len;
			}
		}

		/**
		 * @private (protected)
		 * Returns a marker. If one does not exist in the cache
		 * collection, one is created.
		 */
		protected function getMarker():Sprite
		{
			var marker:Sprite,
				cache:Vector.<Sprite> = this._markerCache,
				len:int = cache.length,
				styles:Object = this._markerStyles;
			if(len > 0)
			{
				marker = Sprite(cache.shift());
			}
			else
			{
				marker = this._markerFactory.createInstance() as Sprite;
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
			var cache:Vector.<Sprite> = this._markers,
				len:int = cache.length;
			while(len > 0)
			{
				this.removeChild(DisplayObject(cache.shift()));
				--len;
			}
			this.clearMarkerCache();
		}
	}
}
