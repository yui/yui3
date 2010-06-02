package
{
	import com.adobe.serialization.json.JSON;
	import com.yahoo.renderers.*;
	import com.yahoo.renderers.events.RendererEvent;
	import com.yahoo.renderers.layout.*;
	import com.yahoo.infographics.data.*;
	import com.yahoo.infographics.series.*;
	import com.yahoo.infographics.cartesian.*;
	import com.yahoo.infographics.axes.*;
	import com.yahoo.infographics.styles.*;
	import com.yahoo.util.YUIBridge;
	import flash.events.Event;

	public class CartesianCanvas extends Application
	{
		/**
		 * Constructor
		 */
		public function CartesianCanvas()
		{
			super();
			this.setFlag("initBridge");
		}
		
		/**
		 * @private
		 * Hash of class to be compiled into the swf.
		 * This also allows for the YUIBridge to create a
		 * class instance based on a one word string descriptor.
		 */
		private var _compiledClasses:Object =
		{
			DataTip:DataTip as Class,
			ChartDataProvider:ChartDataProvider,
			NumericData:NumericData,
			CategoryData:CategoryData,
			TimeData:TimeData,
			Axis:Axis,
			LineSeries:function(arg:Object):LineSeries
			{
				arg = this.parseHash(arg);
				return new LineSeries(arg);
			},
			Container:Container,
			BorderLayout:BorderLayout,
			ILayoutStrategy:ILayoutStrategy,
			HLayout:HLayout,
			VLayout:VLayout,
			HFlowLayout:HFlowLayout,
			VFlowLayout:VFlowLayout,
			LayerStack:LayerStack,
			Skin:Skin,
			ImageSkin:ImageSkin,
			BorderContainer:BorderContainer,
			Graph:function(collection:Array, handleEventListening:Boolean = false):Graph
			{
				collection = this.parseCollections(collection);
				return new Graph(collection, handleEventListening);
			},
            Button:Button
		};

		/**
		 * @private
		 */
		private var _defaultLayout:Class = LayerStack;

		/**
		 * @private (override)
		 */
		override protected function getCompiledClasses():Object
		{
			return this._compiledClasses;
		}

		/**
		 * @private (override)
		 */
		override protected function render():void
		{
			if(this.checkFlag("initBridge"))
			{
				this._yuiBridge.addCallbacks({setStyle:this.setStyle});
			}
			super.render();
		}

		/**
		 * @private (override)
		 */
		override protected function parseFlashVars():void
		{
			super.parseFlashVars();
			var inputLayout:String = "";
			if(this.flashvars && this.flashvars.layout) inputLayout = this.flashvars.layout as String;
			this.setAppLayout(inputLayout);
		}

		/**
		 * @private
		 */
		private function setAppLayout(value:String):void
		{
			var layoutClass:Class = this._compiledClasses.hasOwnProperty(value) ? this._compiledClasses[value] as Class : this._defaultLayout;
			var layout:Object = new layoutClass();
			if(layout is ILayoutStrategy) this.layout = layout as ILayoutStrategy;
		}
	}
}
