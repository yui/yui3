package com.yahoo.infographics.styles
{	
	import com.yahoo.renderers.styles.LabelStyles;

	/**
	 * Styles used for <code>AxisLabels</code>
	 */
	public class AxisLabelStyles extends LabelStyles
	{
		/**
		 * @inheritDoc
		 */
		public static var styleMap:Object = 
		{
			position:"position"
		};
		
		/**
		 * Constructor
		 */
		public function AxisLabelStyles()
		{
			super();
		}
		
	//--------------------------------------
	//  Properties
	//--------------------------------------
		
		/**
		 * @private
		 * Storage for position
		 */
		private var _position:String;

		/**
		 * Describes the position of the axis label in relation to its 
		 * axis. 
		 * <ul>
		 * 	<li><code>top</code>: typical positioning for labels on a top axis.
		 * 	<li><code>right</code>: typical positioning for labels on a right axis.
		 * 	<li><code>bottom</code>: typical positioning for labels on a bottom axis.
		 *  <li><code>left</code>: typical positioning for labels on a left axis.
		 * </ul>
		 */
		public function get position():String
		{
			return this._position;
		}

		/**
		 * @private (setter)
		 */
		public function set position(value:String):void
		{
			this._position = value;
		}
	}
}
