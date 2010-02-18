package com.yahoo.infographics.axes
{
	import flash.display.DisplayObject;
	import flash.display.Sprite;
	import com.yahoo.renderers.events.RendererEvent;
	import com.yahoo.renderers.layout.ContainerType;
	import com.yahoo.infographics.data.AxisData;
	import com.yahoo.renderers.Renderer;
	import com.yahoo.renderers.styles.IStyle;
	import com.yahoo.infographics.styles.AxisStyles;
	import com.yahoo.infographics.data.events.DataEvent;
	import flash.geom.Point;
	
	/**
	 * Draws an axis for a cartesian graph.
	 */
	public class Axis extends Renderer
	{
	//--------------------------------------
	//  Static Properties
	//--------------------------------------		
		/**
		 * Reference to the style class.
		 */
		private static var _styleClass:Class = AxisStyles;

	//--------------------------------------
	//  Constructor
	//--------------------------------------		
		/**
		 * Constructor
		 */
		public function Axis(axisData:AxisData)
		{
			this.data = axisData;
			var axisModeClass:Class = this.getAxisMode(axisData.dataType);
			this._axisMode = new axisModeClass(axisData, this.getStyle("dataFormat"));
			this.addChild(this._content);
		}

	//--------------------------------------
	//  Properties
	//--------------------------------------		
		/**
		 * @private 
		 * Storage for the axisMode
		 */
		private var _axisMode:IAxisMode;

		/**
		 * Algorithm for calculating values based on the axis type.
		 */
		public function get axisMode():IAxisMode
		{
			return this._axisMode;
		}

		/**
		 * @private 
		 * Hash of axis type classes
		 */
		protected var _modeSelector:Object = {
			time:TimeMode,
			numeric:NumericMode,
			category:CategoryMode
		};

		/**
		 * @private
		 * Hash of axis layouts
		 */
		protected var _layoutClasses:Object = {
			top:TopAxisLayout,
			right:RightAxisLayout,
			bottom:BottomAxisLayout,
			left:LeftAxisLayout
		};
		
		/**
		 * @private
		 */
		private var _layout:IAxisLayout;

		/**
		 * @private
		 * Storage for data
		 */
		private var _data:AxisData;

		/**
		 * <code>AxisData</code> instance.
		 */
		public function get data():AxisData
		{
			return this._data;
		}

		/**
		 * @private (setter)
		 */
		public function set data(value:AxisData):void
		{
			if(this._data === value) return;
			this._data = value;
			this._data.addEventListener(DataEvent.DATA_CHANGE, handleDataChange);
			this.setFlag("data");
		}

		/**
		 * @private
		 * Axis labels on the axis.
		 */
		private var _labels:Array = [];
		
		/**
		 * @private
		 * Collection of labels used to be re-used when creating
		 * labels.
		 */
		private var _labelCache:Array = [];

		/**
		 * @private (override)
		 */
		override public function get contentWidth():Number
		{
			if(this._layout) return this._layout.contentWidth;
			return super.contentWidth;
		}

		/**
		 * @private (override)
		 */
		override public function get contentHeight():Number
		{
			if(this._layout) return this._layout.contentHeight;
			return super.contentHeight;
		}

		/**
		 * @private
		 * Contains contents: line, ticks and labels.
		 */
		private var _content:Sprite = new Sprite();

	//--------------------------------------
	//  Public Methods
	//--------------------------------------		
		/**
		 * @private (override)
		 */
		override public function getStyleClass():Class
		{
			return _styleClass;
		}
	
	
	//--------------------------------------
	//  Protected Methods
	//--------------------------------------		
		/**
		 * @private (override)
		 */
		override protected function render():void
		{
			if(this.checkFlag("position"))
			{
				var layoutClass:Class = this.getAxisLayout(this.getStyle("position") as String) as Class;
				this._layout = new layoutClass();
				this._layout.addEventListener(RendererEvent.RESIZE, this.handleContentResize);
			}

			if(this.checkFlag("dataFormat")) this._axisMode.props = this.getStyle("dataFormat");
			if(this.checkFlag("calculateSizeByTickLength")) this._layout.calculateSizeByTickLength = this.getStyle("calculateSizeByTickLength") as Boolean;

			if(this.checkFlag("dataFormat") || 
				this.checkFlag("majorTicks") || 
				this.checkFlag("position") || 
				this.checkFlag("padding") || 
				this.checkFlag("data") || 
				this.checkFlag("resize") ||
				this.checkFlag("majorUnit") ||
				this.checkFlag("label") ||
				this.checkFlag("calculateSizeByTickLength")) this.drawAxis();
		}
		
		/**
		 * @private
		 * Basic logic for drawing an axis.
		 */
		protected function drawAxis():void
		{
			this._content.graphics.clear();
			this.createLabelCache();
			var majorTickStyles:Object = this.getStyle("majorTicks") as Object;
			var labelStyles:Object = this.getStyle("label");
			
			var dimensions:Object = this.getStyle("padding");
			dimensions.width = this.width;
			dimensions.height = this.height;
			var drawTicks:Boolean = majorTickStyles.display != "none";
			this._layout.reset(majorTickStyles, dimensions);
			var tickPoint:Point = this._layout.getFirstPoint();
			this.drawLine(this._layout.lineStart, this._layout.lineEnd, this.getStyle("line") as Object);
			
			if(drawTicks) this.drawTick(tickPoint, majorTickStyles);
			this.drawLabel(tickPoint, labelStyles);
			var majorUnit:Object = this.getStyle("majorUnit");
			var len:int = this._axisMode.getTotalMajorUnits(majorUnit, this._layout.length);
			if(len < 2) return;
			var majorUnitDistance:Number = this._layout.length/(len - 1);
			for(var i:int = 1; i < len; i ++)
			{	
				tickPoint = this._layout.getNextPoint(tickPoint, majorUnitDistance);
				if(drawTicks) this.drawTick(tickPoint, majorTickStyles);
				this.drawLabel(tickPoint, labelStyles);
			}
			
			this.clearLabelCache();
		}

		/**
		 * @private (protected)
		 * Returns the appropriate axis layout class.
		 */
		protected function getAxisLayout(value:String):Class
		{
			return this._layoutClasses[value] as Class
		}
		
		/**
		 * @private (protected)
		 * Returns the appropriate axis type class.
		 */
		protected function getAxisMode(type:String):Class
		{
			return this._modeSelector[type] as Class;
		}

	//--------------------------------------
	//  Private Methods
	//--------------------------------------		
		/**
		 * @private
		 * Draws a tick
		 */
		private function drawTick(point:Point, styles:Object):void
		{
			var tickCoords:Object = this._layout.getTickCoords(point);
			this.drawLine(tickCoords.startPoint, tickCoords.endPoint, styles);
		}

		/**
		 * @private
		 * Draws line based on start point, end point and line object.
		 */
		private function drawLine(startPoint:Point, endPoint:Point, line:Object):void
		{
			this._content.graphics.lineStyle(line.weight, line.color, line.alpha, true, "normal", "none");
			this._content.graphics.moveTo(startPoint.x, startPoint.y);
			this._content.graphics.lineTo(endPoint.x, endPoint.y);
		}
		
		/**
		 * @private
		 * Places a label on the axis.
		 */
		private function drawLabel(tickPoint:Point, labelStyles:Object):void
		{
			var position:Number = this._layout.getPosition(tickPoint);
			
			var labelText:String = this._axisMode.getLabelAtPosition(position, this._layout.length);
			var label:AxisLabel;

			if(this._labelCache.length > 0)
			{
				label = this._labelCache.shift() as AxisLabel;
			}
			else
			{
				label = new AxisLabel();
				this._content.addChild(label);
				label.addEventListener(RendererEvent.RENDER_COMPLETE, this._layout.handleLabelResize);
			}
			this._labels.push(label);
			label.text = labelText;
			label.setStyles(IStyle(labelStyles).getStyles());
			var labelPoint:Point = this._layout.getLabelPoint(tickPoint);
			label.y = labelPoint.y;
			label.x = labelPoint.x;
		}

		/**
		 * @private
		 * Creates a cache of labels for reuse.
		 */
		private function createLabelCache():void
		{
			this._labelCache = this._labels.concat();
			this._labels = [];
		}
		
		/**
		 * @private
		 * Removes unused labels from the label cache
		 */
		private function clearLabelCache():void
		{
			var len:int = this._labelCache.length;
			for(var i:int = 0; i < len; i++)
			{
				var label:AxisLabel = this._labelCache[i] as AxisLabel;
				label.removeEventListener(RendererEvent.RENDER_COMPLETE, this._layout.handleLabelResize);
				this.removeChild(label);
			}
			this._labelCache = [];
		}
		
		/**
		 * @private
		 * Event handler for data updates.
		 */
		private function handleDataChange(event:DataEvent):void
		{
			this.setFlag("data");
		}

		/**
		 * @private
		 * Event handler for content resizing
		 */
		private function handleContentResize(event:RendererEvent):void
		{
			this.updateRenderStatus();
		}
		
		/**
		 * @private
		 */
		protected function childRenderingComplete():Boolean
		{
			var renderingComplete:Boolean = true;
			var labels:Array = this._labels;
			var len:int = labels.length;
			for(var i:int = 0; i < len; i++)
			{
				var item:Renderer = Renderer(labels[i]);
				if(item is Renderer && item.hasOwnProperty("rendering") && item.rendering)
				{
					renderingComplete = false;
					break;
				}
			}
			this.rendering = !renderingComplete;
			return renderingComplete;
		}
		
		/**
		 * @private (override)
		 */
		override protected function updateRenderStatus():void
		{
			if(this.childRenderingComplete())
			{
				var contentPosition:Point = this._layout.contentPosition;
				this._content.x = contentPosition.x;
				this._content.y = contentPosition.y;
				this.dispatchRenderEvents();
			}
		}
	}
}
