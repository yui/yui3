package com.yahoo.infographics.styles
{
	import com.yahoo.renderers.Skin;
	/**
	 * Styles used by a line graph.
	 */
	public class PlotStyles extends CartesianStyles
	{

		/**
		 * @inheritDoc
		 */
		public static var styleMap:Object = 
		{
			marker:"marker"
		};

	//--------------------------------------
	//  Constructor
	//--------------------------------------		
		/**
	 	 * Constructor
	 	 */
		public function PlotStyles()
		{	
			super();
		}

		/**
		 * @private (protected)
		 * Storage for marker
		 */
		private var _marker:Object = 
		{
			className:Skin,
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
				drawSkinFunction:function(styles:Object):void
				{
					this.graphics.beginFill(styles.fillColor);
					this.graphics.drawEllipse(0, 0, this.width, this.height);
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
		public function get marker():Object
		{
			return this._marker;
		}

		/**
	 	 * @private (setter)
		 */
		public function set marker(value:Object):void
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
