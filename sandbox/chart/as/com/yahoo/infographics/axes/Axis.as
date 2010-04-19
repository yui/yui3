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

		override public function get sizeMode():String
		{
			if(this._layout)
			{
				return this._layout.sizeMode;
			}
			var axisPosition:String = this.getStyle("position") as String;
			return axisPosition == "left" || axisPosition == "right" ? "hbox" : "vbox";
		}
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
		private var _labels:Vector.<AxisLabel> = new Vector.<AxisLabel>();
		
		/**
		 * @private
		 * Collection of labels used to be re-used when creating
		 * labels.
		 */
		private var _labelCache:Vector.<AxisLabel> = new Vector.<AxisLabel>();

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
			var axisPosition:String = this.getStyle("position") as String;
			if(!axisPosition) return;
			if(this.checkFlag("position") || (!this._layout && axisPosition))
			{
				var layoutClass:Class = this.getAxisLayout(axisPosition) as Class;
				this._layout = new layoutClass();
				this._layout.addEventListener(RendererEvent.RESIZE, this.handleContentResize);
			}
			if(!this._layout) return;

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
				this.checkFlag("calculateSizeByTickLength")) 
			{
				this.drawAxis();
			}
		}
		
		/**
		 * @private
		 * Basic logic for drawing an axis.
		 */
		protected function drawAxis():void
		{
			this._content.graphics.clear();
			this.createLabelCache();
			var majorTickStyles:Object = this.getStyle("majorTicks") as Object,
				labelStyles:Object = this.getStyle("label"),
				dimensions:Object = this.getStyle("padding"),
				drawTicks:Boolean = majorTickStyles.display != "none",
				tickPoint:Point,
				majorUnit:Object = this.getStyle("majorUnit"),
				len:int,
				majorUnitDistance:Number,
				i:int,
				layout:IAxisLayout = this._layout,
				layoutLength:Number,
				layoutReset:Function = layout.reset,
				getFirstPoint:Function = layout.getFirstPoint,
				getNextPoint:Function = layout.getNextPoint,
				getLabelPoint:Function = layout.getLabelPoint,
				axisMode:IAxisMode = this._axisMode,
				getTotalMajorUnits:Function = axisMode.getTotalMajorUnits,
				updateContentPosition:Function = layout.updateContentPosition,
				getPosition:Function = layout.getPosition,
				getLabelAtPosition:Function = axisMode.getLabelAtPosition,
				position:Number,
				labelText:String,
				label:AxisLabel,
				labels:Vector.<AxisLabel> = this._labels,
				labelCache:Vector.<AxisLabel> = this._labelCache,
				content:Sprite = this._content,
				labelPoint:Point;
			
			
			dimensions.width = this.width;
			dimensions.height = this.height;
			layoutReset(majorTickStyles, dimensions);
			layoutLength = layout.length;
			tickPoint = getFirstPoint();
			
			this.drawLine(layout.lineStart, layout.lineEnd, this.getStyle("line") as Object);
			
			if(drawTicks) this.drawTick(tickPoint, majorTickStyles);
			len = getTotalMajorUnits(majorUnit, layoutLength);
			if(len < 1) return;
			majorUnitDistance = layoutLength/(len - 1);
			for(i = 0; i < len; ++i)
			{	
				if(drawTicks) this.drawTick(tickPoint, majorTickStyles);
				
				position = getPosition(tickPoint);
				labelText = getLabelAtPosition(position, layoutLength);
				if(labelCache.length > 0)
				{
					label = labelCache.shift() as AxisLabel;
				}
				else
				{
					label = new AxisLabel(IStyle(labelStyles));
					label.autoRender = false;
					content.addChild(label);
				}
				labels.push(label);
				label.text = labelText;
				labelPoint = getLabelPoint(tickPoint);
				label.y = labelPoint.y;
				label.x = labelPoint.x;
				label.forceRender();
				updateContentPosition(Number(label.width), Number(label.height));
				tickPoint = getNextPoint(tickPoint, majorUnitDistance);
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
		 * Creates a cache of labels for reuse.
		 */
		private function createLabelCache():void
		{
			this._labelCache = this._labels.concat();
			this._labels = new Vector.<AxisLabel>();
		}
		
		/**
		 * @private
		 * Removes unused labels from the label cache
		 */
		private function clearLabelCache():void
		{
			var len:int = this._labelCache.length,
				i:int,
				label:AxisLabel,
				labelCache:Vector.<AxisLabel>;
			for(i = 0; i < len; i++)
			{
				label = labelCache[i] as AxisLabel;
				this.removeChild(label);
			}
			this._labelCache = new Vector.<AxisLabel>();
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
			var renderingComplete:Boolean = true,
				labels:Vector.<AxisLabel> = this._labels,
				len:int = labels.length,
				i:int,
				item:Renderer;
			for(i = 0; i < len; ++i)
			{
				item = Renderer(labels[i]);
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
