package com.yahoo.renderers.styles
{	
	public class ImageSkinStyles extends RendererStyles implements IStyle
	{
		/**
		 * @inheritDoc
		 */
		public static var styleMap:Object = 
		{
			imageMode:"imageMode"
		};
		
		/**
		 * Constructor
		 */
		public function ImageSkinStyles()
		{
			super();
		}
		
	//--------------------------------------
	//  Properties
	//--------------------------------------

		/**
		 * @private
		 * Storage for imageMode
		 */
		private var _imageMode:String = "stretch";
		
		/**
		 * Determines the way an image will display in the skin
		 * 	<ul>
		 *		<li><code>stretch</code>: The image will stretch to fill the available area.</li>
		 *		<li><code>stretchAndMaintainAspectRatio</code>: The image will stretch to fill as much of the available area while maintaining aspect ratio.</li>
		 * 		<li><code>repeat</code>: The image will repeat horizontally and vertically to fill the available space.</li>
		 * 		<li><code>repeat-x</code>: The image will repeat horizontally to fill the available space.</li>
		 * 		<li><code>repeat-y</code>: The image will repeat vertically to fill the available space.</li>
		 * 		<li><code>no-repeat</code>: The image will not repeat.</li>
		 * 	</ul>
		 */
		public function get imageMode():String
		{
			return this._imageMode;
		}
		
		/** 
		 * @private (setter)
		 */
		public function set imageMode(value:String):void
		{
			this._imageMode = value;
		}
	}
}