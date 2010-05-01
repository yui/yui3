package com.yahoo.infographics.series
{
	import com.yahoo.renderers.Renderer;
	import com.yahoo.infographics.styles.HistogramStyles;
	import com.yahoo.infographics.series.ISeries;
	
	public class ColumnSeries extends PlotSeries
	{
		public function ColumnSeries(series:Object)
		{
			super(series);
		}
		
		/**
		 * @private
		 * Style class for the graph.
		 */
		private static var _styleClass:Class = HistogramStyles;
		
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
		private var _type:String = "column";

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
		override protected function drawMarkers():void
		{
			if(this._xcoords.length < 1) return;
			var xcoords:Vector.<int> = this._xcoords,
				ycoords:Vector.<int> = this._ycoords,
				len:int = xcoords.length,
				i:int,
				marker:SeriesMarker,
				seriesCollection:Vector.<ISeries> = this._graph.seriesTypes[this._type] as Vector.<ISeries>,
				seriesLen:int = seriesCollection.length,
				seriesWidth:Number = 0,
				totalWidth:Number = 0,
				offset:Number = 0,
				ratio:Number,
				markerWidth:Number = this.getStyle("marker").props.width,
				renderer:Renderer,
				topPadding:Number = this._topPadding,
				dataHeight:Number = this.height - (topPadding + this._bottomPadding),
				yScaleFactor:Number = dataHeight / (this._yMax - this._yMin),
				ymin:Number = this._yMin,
				origin:Number = int(0.5 +((dataHeight + topPadding) - (0 - ymin) * yScaleFactor));
			for(i = 0; i < seriesLen; ++i)
			{
				renderer = Renderer(seriesCollection[i]);
				seriesWidth += renderer.getStyle("marker").props.width;
				if(this._order > i) 
				{
					offset = seriesWidth;
				}
			}
			totalWidth = len * seriesWidth;
			if(totalWidth > this.width)
			{
				ratio = this.width/totalWidth;
				seriesWidth *= ratio;
				offset *= ratio;
				markerWidth *= ratio;
				markerWidth = Math.max(markerWidth, 1);
			}
			offset -= seriesWidth/2;
			origin = Math.min(this.height, origin);
			this.createMarkerCache();
			for(i = 0;i < len; ++i)
			{
				marker = this.getMarker();
				marker.index = i;
				marker.x = Number(xcoords[i]) + offset;
				marker.y = Number(ycoords[i]);
				marker.height = origin - marker.y;
				this._markers.push(marker);
			}
			this.clearMarkerCache();
		}
	}
}
