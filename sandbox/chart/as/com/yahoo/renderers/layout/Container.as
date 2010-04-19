package com.yahoo.renderers.layout
{
	import com.yahoo.renderers.Renderer;
	import com.yahoo.renderers.events.RendererEvent;
	import com.yahoo.renderers.styles.LayoutStyles;
	import flash.utils.Dictionary;	
	import flash.display.DisplayObject;
	
	public class Container extends Renderer implements IContainer
	{
		/**
		 * Constructor
		 */
		public function Container(layout:ILayoutStrategy = null)
		{
			if(layout) 
			{
				this.layout = layout; 
			}
			else if(!this.layout)
			{
				this.layout = new this._defaultStrategyClass();
			}
			super();
		}

	//**********************************
	// Properties
	//**********************************	

		/**
		 * @private (override)
		 */
		override public function get sizeMode():String
		{
			if(!this._layout) return super.sizeMode;
			return this._layout.sizeMode;
		}

		/**
		 * @private
		 */
		private var _defaultStrategyClass:Class = LayoutStrategy;

		/**
		 * @inheritDoc
		 */
		override public function get contentWidth():Number
		{
			if(this.layout) return this.layout.contentWidth;	
			return super.contentWidth;
		}

		/**
		 * @inheritDoc
		 */
		override public function get contentHeight():Number
		{
			if(this.layout) return this.layout.contentHeight;
			return super.contentHeight;
		}

		/**
		 * @private
		 * Storage for the layout
		 */
		private var _layout:ILayoutStrategy;

		/**
		 * The <code>ILayoutStrategy</code> used for positioning
		 * child elements.
		 */
		public function get layout():ILayoutStrategy
		{
			return this._layout;
		}

		/**
		 * @private (setter)
		 */
		public function set layout(value:ILayoutStrategy):void
		{
			this._layout = value;
			this._layout.container = this;
			this.setStyleInstance();
		}
		
		/**
		 * @private
		 */
		private var _containerStyleHash:Object = {};

		/**
		 * Returns the number of layout items in the container.
		 */
		public function get length():int
		{
			if(this._layout) return this._layout.items.length;
			return 0;
		}

	//**********************************	
	// Public Methods
	//**********************************	
		/** 
		 * @copy com.yahoo.renderers.layout.ILayoutContainer#addItem()
		 */
		public function addItem(value:Renderer, props:Object = null):void
		{
			value.addEventListener(RendererEvent.RENDER_COMPLETE, this.handleChildResize);
			this.layout.addItem(value, props);
			if(this.layout.layoutFlags.updateItems) this.setFlag("updateItems");
		}
		
		/**
		 * @copy com.yahoo.renderers.layout.ILayoutContainer#removeItem()
		 */
		public function removeItem(value:Renderer):void
		{
		 	value.removeEventListener(RendererEvent.RENDER_COMPLETE, this.handleChildResize);
			this.layout.removeItem(value);
			if(this.layout.layoutFlags.updateItems) this.setFlag("updateItems");
		}
		
		/**
		 * @copy com.yahoo.renderers.layout.ILayoutContainer#removeItemAt()
		 */
		public function removeItemAt(index:int):void
		{
			var item:DisplayObject= this.layout.getItemAt(index);
			
			if(item is Renderer)
			{
				item.removeEventListener(RendererEvent.RENDER_COMPLETE, this.handleChildResize);
			}
			
			this.layout.removeItemAt(index);
			
			if(this.layout.layoutFlags.updateItems) this.setFlag("updateItems");
		}
		
		/**
		 * @copy com.yahoo.renderers.layout.ILayoutContainer#removeAll()
		 */
		public function removeAll():void
		{
			this.layout.removeAll();
		}
		
		/**
		 * @inheritDoc
		 */
		override public function getStyle(style:String):Object
		{
			if(!this._styles) return null;
			return super.getStyle(style);
		}

		/**
		 * @inheritDoc
		 */
		override public function getStyles():Object
		{
			if(!this._styles) return null;
			return super.getStyles();
		}

		/**
		 * @inheritDoc
		 */
		override public function setStyle(style:String, value:Object):Boolean
		{
			this._containerStyleHash[style] = value;
			return super.setStyle(style, value);
		}

		/**
		 * @inheritDoc
		 */
		override public function setStyles(styles:Object):void
		{
			for(var i:String in styles)
			{
				this._containerStyleHash[i] = styles[i];
				super.setStyle(i, styles[i]);
			}
		}

		/**
		 * @private (override)
		 */
		override public function removeChild(child:DisplayObject):DisplayObject
		{
			if(this.layout && this.layout.childData[child])
			{
				this.layout.removeItem(child);
				return child;
			}
			return super.removeChild(child);
		}

		/**
		 * @private (override)
		 */
		override public function removeChildAt(index:int):DisplayObject
		{
			var child:DisplayObject = this.getChildAt(index);
			return this.removeChild(child);
		}
	//**********************************	
	// Protected Methods
	//**********************************	
		/**
		 * @inheritDoc
		 */
		override protected function render():void
		{
			if(this._layout == null) return;
			var redraw:Boolean = false;
			var flagsToCheck:Object = this.layout.layoutFlags;
			for(var flag:String in flagsToCheck)
			{
				if(this.checkFlag(flag))
				{
					redraw = true;
					continue;
				}
			}
			if(redraw) this.layout.layoutChildren();
		}

		/**
		 * @private (protected)
		 */
		override protected function setStyleInstance():void
		{
			if(this.layout)
			{
				this._styles = this.layout.styles;
				this.setStyles(this._containerStyleHash);
				this._containerStyleHash = {};
			}
		}

	//**********************************	
	// Private Methods
	//**********************************	
		/**
		 * @private 
		 */
		protected function handleChildResize(event:RendererEvent):void
		{
			this.updateRenderStatus();
		}
		
		public function update(widthChange:Boolean = false, heightChange:Boolean = false):void
		{
			if(widthChange || heightChange) this.updateRenderStatus();
		}
		
		/**
		 * @private (override)
		 */		 
		override protected function updateRenderStatus():void
		{
			if(this.childRenderingComplete())
			{
				this.layout.measureContent();
				this.dispatchRenderEvents();
			}
		}
		
		/**
		 * @private (protected)
		 * Checks to ensure that all child items have completed their rendering process. Sets the Container's
		 * rendering property.
		 */
		protected function childRenderingComplete():Boolean
		{
			if(!this.layout || ! this.layout.childData)
			{
				return true;
			}

			var renderingComplete:Boolean = true;
			var childData:Dictionary = this.layout.childData;
			for(var i:* in childData)
			{
				if(i is Renderer && i.hasOwnProperty("rendering") && Renderer(i).rendering)
				{
					renderingComplete = false;
					break;
				}
			}
			this.rendering = !renderingComplete;
			return renderingComplete;
		}
	}
}
