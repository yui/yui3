package com.yahoo.infographics.events
{
	import flash.events.Event;
	import com.yahoo.infographics.series.ISeries;
	import com.yahoo.infographics.series.SeriesMarker;

	public class GraphEvent extends Event
	{
		/**
		 * Defines the value of the <code>type</code> property of a <code>seriesAdded</code>
		 * event object.
		 * 
		 * <p>This event has the following properties:</p>
		 *  <table class="innertable" width="100%">
		 * 		<tr><th>Property</th><th>Value</th></tr>
		 * 		<tr><td><code>bubbles</code></td><td><code>false</code></td></tr>
		 * 		<tr><td><code>cancelable</code></td><td><code>true</code></td></tr>
		 * 		<tr><td><code>currentTarget</code></td><td>The object that is actively processing
		 * 			 the event object with and event listener.</td></tr>
		 * 	  <tr><td><code>index</code></td><td>The zero-based index in the <code>Series</code>
		 * 			that contains the marker.</td></tr>
		 * 	  <tr><td><code>marker</code></td><td>A reference to the properties that belong to the marker.
		 * 	  <tr><td><code>target</code></td><td>The object that dispatched the event. The target is 
         *           not always the object listening for the event. Use the <code>currentTarget</code>
		 * 			property to access the object that is listening for the event.</td></tr>
		 * 	  		</td></tr>
		 *  </table>
         *
         * @eventType seriesAdded
         *
         * @langversion 3.0
         * @playerversion Flash 9.0.28.0
		 */		
		public static const SERIES_ADDED:String = "seriesAdded";

		/**
		 * Defines the value of the <code>type</code> property of a <code>markerEvent</code>
		 * event object.
		 * 
		 * <p>This event has the following properties:</p>
		 *  <table class="innertable" width="100%">
		 * 		<tr><th>Property</th><th>Value</th></tr>
		 * 		<tr><td><code>bubbles</code></td><td><code>false</code></td></tr>
		 * 		<tr><td><code>cancelable</code></td><td><code>true</code></td></tr>
		 * 		<tr><td><code>currentTarget</code></td><td>The object that is actively processing
		 * 			 the event object with and event listener.</td></tr>
		 * 	  <tr><td><code>index</code></td><td>The zero-based index in the <code>Series</code>
		 * 			that contains the marker.</td></tr>
		 * 	  <tr><td><code>marker</code></td><td>A reference to the properties that belong to the marker.
		 * 	  <tr><td><code>target</code></td><td>The object that dispatched the event. The target is 
         *           not always the object listening for the event. Use the <code>currentTarget</code>
		 * 			property to access the object that is listening for the event.</td></tr>
		 * 	  		</td></tr>
		 *  </table>
         *
         * @eventType markerEvent
         *
         * @langversion 3.0
         * @playerversion Flash 9.0.28.0
		 */		
		public static const MARKER_EVENT:String = "markerEvent";

	//--------------------------------------
	//  Constructor
	//--------------------------------------

		/**
		 * Constructor. Creates a new GraphEvent object with the specified parameters.
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
		public function GraphEvent(type:String, displayData:Object = null, bubbles:Boolean = false, cancelable:Boolean = false)
		{
			super(type, bubbles, cancelable);
			this.displayData = displayData;
		}
		
	//--------------------------------------
	// Public Properties
	//--------------------------------------		

		/**
		 * Referenced to the displayData containing to the selected portion of the graph.
		 */
		public var displayData:Object;

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
			return new GraphEvent(this.type, this.displayData, this.bubbles, this.cancelable);
		}
	}
}
