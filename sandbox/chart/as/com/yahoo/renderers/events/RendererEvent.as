package com.yahoo.renderers.events
{
	import flash.events.Event;	
	
	/**
	 * The <code>RendererEvent</code> class defines events for Renderer objects.
	 * 
	 * These events include the following:
	 * <ul>
	 * <li><code>RendererEvent.PROPERTY_CHANGED</code>: Fired after a property is changed on the class instance.</li>
	 * <li><code>RendererEvent.RENDER_COMPLETE</code>: Fired after the render method is completed.</li>
	 * </ul>
	 *
	 * @see com.yahoo.ui.renderers.Renderer Renderer
	 *
	 * @langversion 3.0
	 * @playerversion Flash 9.0.28.0
	 */
	public class RendererEvent extends Event
	{
	 //--------------------------------------	
	 //  Constants
	 //--------------------------------------	
		
		/**
		 * Defines the value of the <code>type</code> property of a <code>propertyChanged</code>
		 * event object.
		 * 
		 * <p>This event has the following properties:</p>
		 *  <table class="innertable" width="100%">
		 * 		<tr><th>Property</th><th>Value</th></tr>
		 * 		<tr><td><code>bubbles</code></td><td><code>false</code></td></tr>
		 * 		<tr><td><code>cancelable</code></td><td><code>true</code></td></tr>
		 * 		<tr><td><code>currentTarget</code></td><td>The object that is actively processing
		 * 			 the event object with and event listener.</td></tr>
		 * 	  <tr><td><code>index</code></td><td>The zero-based index in the DataProvider
		 * 			that contains the renderer.</td></tr>
		 * 	  <tr><td><code>item</code></td><td>A reference to the data that belongs to the renderer.
		 * 	  <tr><td><code>target</code></td><td>The object that dispatched the event. The target is 
         *           not always the object listening for the event. Use the <code>currentTarget</code>
		 * 			property to access the object that is listening for the event.</td></tr>
		 * 	  		</td></tr>
		 *  </table>
         *
         * @eventType resize
         *
         * @langversion 3.0
         * @playerversion Flash 9.0.28.0
		 */
		public static const RESIZE:String = "resize";

		/**
		 * Defines the value of the <code>type</code> property of a <code>renderComplete</code>
		 * event object.
		 * 
		 * <p>This event has the following properties:</p>
		 *  <table class="innertable" width="100%">
		 * 		<tr><th>Property</th><th>Value</th></tr>
		 * 		<tr><td><code>bubbles</code></td><td><code>false</code></td></tr>
		 * 		<tr><td><code>cancelable</code></td><td><code>true</code></td></tr>
		 * 		<tr><td><code>currentTarget</code></td><td>The object that is actively processing
		 * 			 the event object with and event listener.</td></tr>
		 * 	  <tr><td><code>index</code></td><td>The zero-based index in the DataProvider
		 * 			that contains the renderer.</td></tr>
		 * 	  <tr><td><code>item</code></td><td>A reference to the data that belongs to the renderer.
		 * 	  <tr><td><code>target</code></td><td>The object that dispatched the event. The target is 
         *           not always the object listening for the event. Use the <code>currentTarget</code>
		 * 			property to access the object that is listening for the event.</td></tr>
		 * 	  		</td></tr>
		 *  </table>
         *
         * @eventType renderComplete
         *
         * @langversion 3.0
         * @playerversion Flash 9.0.28.0
		 */		
		public static const RENDER_COMPLETE:String = "renderComplete";
		
		/**
		 * Defines the value of the <code>type</code> property of a <code>toggleAutoRender</code>
		 * event object.
		 * 
		 * <p>This event has the following properties:</p>
		 *  <table class="innertable" width="100%">
		 * 		<tr><th>Property</th><th>Value</th></tr>
		 * 		<tr><td><code>bubbles</code></td><td><code>false</code></td></tr>
		 * 		<tr><td><code>cancelable</code></td><td><code>true</code></td></tr>
		 * 		<tr><td><code>currentTarget</code></td><td>The object that is actively processing
		 * 			 the event object with and event listener.</td></tr>
		 * 	  <tr><td><code>index</code></td><td>The zero-based index in the DataProvider
		 * 			that contains the renderer.</td></tr>
		 * 	  <tr><td><code>item</code></td><td>A reference to the data that belongs to the renderer.
		 * 	  <tr><td><code>target</code></td><td>The object that dispatched the event. The target is 
         *           not always the object listening for the event. Use the <code>currentTarget</code>
		 * 			property to access the object that is listening for the event.</td></tr>
		 * 	  		</td></tr>
		 *  </table>
         *
         * @eventType renderComplete
         *
         * @langversion 3.0
         * @playerversion Flash 9.0.28.0
		 */		
		public static const TOGGLE_AUTO_RENDER:String = "toggleAutoRender";
	//--------------------------------------
	//  Constructor
	//--------------------------------------

		/**
		 * Constructor. Creates a new RendererEvent object with the specified parameters.
		 * 
         * @param type The event type; this value identifies the action that caused the event.
         *
         * @param bubbles Indicates whether the event can bubble up the display list hierarchy.
         *
         * @param cancelable Indicates whether the behavior associated with the event can be
		 *        prevented.
         *
		 * @param property Indicates the property that has changed. Has old and new attributes
		 * 		  to reflect the old and new values.
		 *
		 * @param styles Indicates the styles that have been changed. Has an object for each 
		 * 		  property that has changed which includes an old and new attribute to reflect
		 *		  the old and new values.
		 *
		 * @langversion 3.0
		 * @playerversion Flash 9.0.28.0
		 */
		public function RendererEvent(type:String, bubbles:Boolean = false, cancelable:Boolean = false)
		{
			super(type, bubbles, cancelable);
		}
		
	//--------------------------------------
	// Public Properties
	//--------------------------------------		
	
		/**
		 * Hash of values that have been updated during the render process.
		 */
		public var changeFlags:Object;

		/**
		 * Indicates whether or not the width of an object has changed
		 */
		public var widthChange:Boolean = false;

		/**
		 * Indicates whether or not the height of an object has changed.
		 */
		public var heightChange:Boolean = false;

	//--------------------------------------
	// Public Methods
	//--------------------------------------		
		
		/**
		 * Creates a copy of the RendererEvent object and sets the value of each parameter to match
		 * the original.
		 *
		 * @return A new RendererEvent object with parameter values that match those of the original.
		 *
		 * @langversion 3.0
		 * @playerversion Flash 9.0.28.0
		 */
		override public function clone():Event
		{
			return new RendererEvent(this.type, this.bubbles, this.cancelable);
		}
	}
}
