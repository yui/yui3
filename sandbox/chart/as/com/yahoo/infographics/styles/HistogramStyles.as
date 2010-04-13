package com.yahoo.infographics.styles
{
	import com.yahoo.renderers.Skin;
	import flash.display.Graphics;
	/**
	 * Styles used by a line graph.
	 */
	public class HistogramStyles extends PlotStyles
	{

	//--------------------------------------
	//  Constructor
	//--------------------------------------		
		/**
	 	 * Constructor
	 	 */
		public function HistogramStyles()
		{	
			super();
		}

		/**
		 * @private (protected)
		 * Storage for marker
		 */
		private var _marker:Object = 
		{
			skin:"bitmap",
			styles:
			{
				borderColor:0xff0000,
				borderWidth:0,
				borderAlpha:1,
				fillColor:0xff0000,
				fillAlpha:1
			},
			props:
			{
				width:6,
				height:6,
				drawSkinFunction:function(props:Object, styles:Object):void
				{
					this.graphics.lineStyle(styles.borderWidth, styles.borderColor, styles.borderAlpha);
					this.graphics.beginFill(styles.fillColor, styles.fillAlpha);
					this.graphics.drawRect(0, 0, props.width, props.height);
					this.graphics.endFill();
				}
			}
		};
		/**
		 * Hash of data used to create a marker instance.
		 *	<ul>
		 *		<li><code>className</code>: class to be used</li>
		 *		<li><code>styles</code>: styles to be applied to class instance</li>
		 *		<li><code>props</code>: properties to be applied to class instance</li>
		 *	</ul>
		 */
		override public function get marker():Object
		{
			return this._marker;
		}

		/**
	 	 * @private (setter)
		 */
		override public function set marker(value:Object):void
		{
			var i:String,
				styles:Object,
				props:Object;
			if(value.className && value.className is Class) this._marker.className = value.className;
			for(i in this._marker.styles)
			{
				if(value.hasOwnProperty(i))
				{
					this._marker.styles[i] = value[i];
				}
			}
			for(i in this._marker.props)
			{
				if(value.hasOwnProperty(i))
				{
					this._marker.props[i] = value[i];
				}
			}
		}
	}
}
