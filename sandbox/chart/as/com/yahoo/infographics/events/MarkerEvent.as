package com.yahoo.infographics.events
{
	import flash.events.Event;
	import com.yahoo.infographics.series.ISeries;
	import com.yahoo.infographics.series.SeriesMarker;

	public class MarkerEvent extends Event
	{
		/**
		 * Defines the value of the <code>type</code> property of a <code>itemRollOver</code>
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
         * @eventType itemRollOver
         *
         * @langversion 3.0
         * @playerversion Flash 9.0.28.0
		 */		
		public static const ITEM_ROLL_OVER:String = "itemRollOver";

		/**
		 * Defines the value of the <code>type</code> property of a <code>itemRollOut</code>
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
         * @eventType itemRollOut
         *
         * @langversion 3.0
         * @playerversion Flash 9.0.28.0
		 */		
		public static const ITEM_ROLL_OUT:String = "itemRollOut";
		
		/**
		 * Defines the value of the <code>type</code> property of a <code>itemClick</code>
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
         * @eventType itemClick
         *
         * @langversion 3.0
         * @playerversion Flash 9.0.28.0
		 */		
		public static const ITEM_CLICK:String = "itemClick";

		/**
		 * Defines the value of the <code>type</code> property of a <code>itemDoubleClick</code>
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
         * @eventType itemDoubleClick
         *
         * @langversion 3.0
         * @playerversion Flash 9.0.28.0
		 */		
		public static const ITEM_DOUBLE_CLICK:String = "itemDoubleClick";

	//--------------------------------------
	//  Constructor
	//--------------------------------------

		/**
		 * Constructor. Creates a new MarkerEvent object with the specified parameters.
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
		public function MarkerEvent(type:String, series:ISeries = null, index:int = 0, marker:SeriesMarker = null, bubbles:Boolean = false, cancelable:Boolean = false)
		{
			super(type, bubbles, cancelable);
			this.index = index;
			this.marker = marker;
			this.series = series;
		}
		
	//--------------------------------------
	// Public Properties
	//--------------------------------------		
	
		/**
		 * The zero-based index in the series that contains the marker.
		 */
		public var index:int = 0;

		/**
		 * Reference to the properties that belong to the marker.
		 */
		public var marker:SeriesMarker;

		/**
		 * Reference to the <code>ISeries<code> that dispatched the event.
		 */
		public var series:ISeries;

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
			return new MarkerEvent(this.type, this.series, this.index, this.marker, this.bubbles, this.cancelable);
		}
	}
}
