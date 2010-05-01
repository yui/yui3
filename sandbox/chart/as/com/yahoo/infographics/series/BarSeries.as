package com.yahoo.infographics.series
{
	import com.yahoo.renderers.Renderer;
	import com.yahoo.infographics.styles.HistogramStyles;
	import com.yahoo.infographics.series.ISeries;

	public class BarSeries extends ColumnSeries
	{
		public function BarSeries(series:Object)
		{
			super(series);
		}
		
		/**
		 * @private 
		 * Storage for direction
		 */
		private var _direction:String = "vertical";

		/**
		 * @private (override)
		 */
		override public function get direction():String
		{
			return this._direction;
		}

		/**
		 * @private (protected)
		 */
		private var _type:String = "bar";

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
				seriesHeight:Number = 0,
				totalHeight:Number = 0,
				offset:Number = 0,
				ratio:Number,
				markerHeight:Number = this.getStyle("marker").props.height,
				renderer:Renderer,
				leftPadding:Number = this._leftPadding,
				dataWidth:Number = this.width - (leftPadding + this._rightPadding),
				xmin:Number = this._xMin,
				xScaleFactor:Number = dataWidth / (this._xMax - xmin),
				origin:Number = int(0.5 + (((0 - xmin) * xScaleFactor) + leftPadding));
			for(i = 0; i < seriesLen; ++i)
			{
				renderer = Renderer(seriesCollection[i]);
				seriesHeight += renderer.getStyle("marker").props.height;
				if(this._order > i) 
				{
					offset = seriesHeight;
				}
			}
			totalHeight = len * seriesHeight;
			if(totalHeight > this.height)
			{
				ratio = this.height/totalHeight;
				seriesHeight *= ratio;
				offset *= ratio;
				markerHeight *= ratio;
				markerHeight = Math.max(markerHeight, 1);
			}
			offset -= seriesHeight/2;
			origin = Math.max(0, origin);
			this.createMarkerCache();
			for(i = 0;i < len; ++i)
			{
				marker = this.getMarker();
				marker.index = i;
				marker.x = origin;
				marker.y = Number(ycoords[i]) + offset;
				marker.width = Number(xcoords[i]) - origin;
				this._markers.push(marker);
			}
			this.clearMarkerCache();
		}
	}
}
