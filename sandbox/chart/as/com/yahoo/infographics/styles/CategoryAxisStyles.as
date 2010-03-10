package com.yahoo.infographics.styles
{
	import com.yahoo.renderers.styles.IStyle;

	/**
	 * Style class used when the data type of an axis is category
	 */
	public class CategoryAxisStyles extends AxisStyles implements IStyle
	{
		/**
		 * Constructor
		 */
		public function CategoryAxisStyles()
		{
			super();
		}
		
		/**
		 * @inheritDoc
		 */
		public static var styleMap:Object = 
		{
			dataFormat:"dataFormat"
		};

		/**
		 * @private
		 * Storage for dataFormat
		 */
		private var _dataFormat:Object = {
			external:false,
			func:"defaultFunction"
		};

		/**
		 * Contains data for formatting axis labels.
		 *	<ul>
		 * 		<li><code>external</code>: Indicates whether to use an external js function.</li>
		 * 		<li><code>function</code>: String reference to the function that is to be used.</li>
		 * 		<li><code>props</code>: hash of properties that might be used in the formatting function.</li>
		 * 	</ul>
		 */
		public function get dataFormat():Object
		{
			return this._dataFormat;
		}

		/**
		 * @private (setter)
		 */
		public function set dataFormat(value:Object):void
		{
			for(var i:String in value)
			{
				this._dataFormat[i] = value[i];
			}
		}
	}
}
