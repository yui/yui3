package com.yahoo.infographics.cartesian
{
	import com.yahoo.renderers.layout.*;
	import com.yahoo.renderers.Skin;
	import com.yahoo.infographics.events.GraphEvent;
	import com.yahoo.infographics.series.*;
	import com.yahoo.infographics.axes.IAxisMode;
	import flash.events.MouseEvent;
	import flash.geom.Point;
	import flash.display.Sprite;
	import flash.text.TextField;
	import flash.text.TextFormat;

	/**
     * Text based display of a selected section of a graph or series. Can be 
	 * triggered by a mouse event.
	 */
	public class DataTip extends Container
	{
		/**
		 * Constructor
		 */
		public function DataTip(graph:Graph)
		{
			this.graph = graph;
			super(new LayerStack());
		}

	//--------------------------------------
	//  Properties
	//--------------------------------------
		/**
		 * @private
		 * Background for the <code>DataTip</code> instance.
		 */
		protected var _skin:Skin;

		/**
		 * @private
		 * Storage for graph
		 */
		private var _graph:Graph;

		/**
		 * The graph associated with the <code>DataTip</code> instance.
		 */
		public function get graph():Graph
		{
			return this._graph;
		}

		/**
		 * @private (setter)
		 */
		public function set graph(value:Graph):void
		{
			if(this._graph)
			{
				this.removeGraph();
			}
			this._graph = value;
			value.addEventListener(GraphEvent.MARKER_EVENT, this.markerEventHandler);
		}

		/**
		 * @private
		 * Collection of series to display in the dataTip.
		 */
		private var _seriesCollection:Object;

		/**
		 * @private 
		 * Container for text fields.
		 */
		private var _textSprite:Sprite = new Sprite();

		/**
		 * @private
		 * Collection of labels used for the dataTip.
		 */
		private var _labels:Vector.<TextField> = new Vector.<TextField>();

		/**
		 * @private
		 * Collection of labels used for dataTip.
		 */
		private var _labelCache:Vector.<TextField> = new Vector.<TextField>();

		/**
		 * @private
		 * Data to display in dataTip
		 */
		private var _displayData:Object;

	//--------------------------------------
	//  Protected Methods
	//--------------------------------------
		/**
		 * @private (override)
		 */
		override protected function initializeRenderer():void
		{
			super.initializeRenderer();
			this._skin = new Skin();
			this.addChild(this._skin);
			this._skin.setStyle("fillColor", 0xffffff);
			this.addChild(this._textSprite);
		}

		/**
		 * @private (override)
		 */
		override protected function render():void
		{
			if(this.checkFlag("newdata")) 
			{
				this.parseAndDisplay(this._displayData);
			}
			super.render();
		}

	//--------------------------------------
	//  Private Methods
	//--------------------------------------
		/**
		 * @private
		 * Creates a cache of labels for reuse.
		 */
		private function createLabelCache():void
		{
			this._labelCache = this._labels.concat();
			this._labels = new Vector.<TextField>();
		}
		
		/**
		 * @private
		 * Removes unused labels from the label cache
		 */
		private function clearLabelCache():void
		{
			var len:int = this._labelCache.length,
				i:int,
				label:TextField,
				spr:Sprite = this._textSprite;
			for(i = 0; i < len; i++)
			{
				label = this._labelCache[i] as TextField;
				spr.removeChild(label);
			}
			this._labelCache = new Vector.<TextField>();
		}
		
		/**
		 * @private 
		 */
		private function removeGraph():void
		{
			this._graph.removeEventListener(GraphEvent.MARKER_EVENT, this.markerEventHandler);
			this._graph = null;
		}

		/**
		 * @private 
		 * Handler fro marker events.
		 */
		private function markerEventHandler(event:GraphEvent):void
		{
			this._displayData = event.displayData;
			this.setFlag("newdata");
		}

		/**
		 * @private
		 * Returns a TextField
		 */
		private function getLabel():TextField
		{
			var labelCache:Vector.<TextField> = this._labelCache,
				len:int = labelCache.length,
				textField:TextField;
			if(len > 0)
			{
				textField = labelCache.shift() as TextField;
				textField.text = "";
			}
			else
			{
				textField = new TextField();
				textField.autoSize = "left";
				textField.defaultTextFormat = new TextFormat("Verdana", 9);
			}
			this._labels.push(textField);
			textField.visible = true;
			return textField;
		}

		/**
		 * @private
		 */
		private function parseAndDisplay(displayData:Object):void
		{
			var key:String,
				i:int,
				len:int,
				seriesData:Array,
				item:Object,
				label:TextField,
				format:TextFormat,
				spr:Sprite = this._textSprite,
				x:Number = 0,
				y:Number = 0,
				w:Number = 0,
				h:Number = 0,
				column:Object = {x:0, y:0, w:0, h:0},
				columns:Array = [];
			if(this.stage) this.stage.removeEventListener(MouseEvent.MOUSE_MOVE, this.mouseMoveHandler);
			if(!displayData)
			{
				this.visible = false;
				return;
			}
			this.createLabelCache();
			for(key in displayData)
			{
				//pull this from styles
				y = 0;
				seriesData = displayData[key] as Array;
				len = seriesData.length;
				label = this.getLabel();
				label.x = x;
				label.y = y;
				label.text = key;
				spr.addChild(label);
				column = {w:0, h:0};
				column.w = label.width;
				column.h = y + label.height;
				for(i = 0; i < len; ++i)
				{
					item = seriesData[i];
					label = this.getLabel();
					format = new TextFormat();
					format.color = item.styles.fillColor;
					label.text = item.displayName;
					label.setTextFormat(format);
					label.y = column.h;
					label.x = x;
					spr.addChild(label);
					column.h += label.height;
					column.w = Math.max(column.w, label.width);
					label = this.getLabel();
					label.text = item.valueLabel;
					label.y = column.h;
					label.x = x;
					spr.addChild(label);
					column.h += label.height;
					column.w = Math.max(column.w, label.width);
				}
				w += column.w;
				x = w;
				h = Math.max(h, column.h);
				columns.push(column);
			}
			this.clearLabelCache();
			this._skin.width = w;
			this._skin.height = h;
			var position:Point = this.mousePositionToDataTipPosition();
			this.x = position.x;
			this.y = position.y;
			this.visible = true;
			if(this.stage) this.stage.addEventListener(MouseEvent.MOUSE_MOVE, this.mouseMoveHandler, false, 0 ,true);
		}
		
		/**
		 * @private
		 * Determines the position for the data tip based on the mouse position
		 * and the bounds of the chart. Attempts to keep the data tip within the
		 * chart bounds so that it isn't hidden by any other display objects.
		 */
		private function mousePositionToDataTipPosition():Point
		{
			var position:Point = new Point();
			if(!this.stage)
			{
				return position;
			}
			
			position.x = this.stage.mouseX + 2;
			if(position.x > this.stage.stageWidth - this._skin.width)
			{
				position.x = this.stage.mouseX - (2 + this._skin.width);
			}
			position.y = this.stage.mouseY - this._skin.height - 2;
			if(position.y < 0)
			{
				position.y = this.stage.mouseY + 2;
			}
			return position;
		}

		/**
		 * @private
		 * Updates dataTip position based on mouse movement.
		 */
		private function mouseMoveHandler(event:MouseEvent):void
		{
			var position:Point = this.mousePositionToDataTipPosition();
			this.x = position.x;
			this.y = position.y;
		}
	}
}
