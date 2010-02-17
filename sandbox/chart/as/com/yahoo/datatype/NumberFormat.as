package com.yahoo.datatype
{

	public class NumberFormat
	{
		/**
		 * Formats numeric strings
		 */
		public function NumberFormat()
		{
		}

		/**
		 * String that proceeds formatted number
		 */
		public var prefix:String = "";

		/**
		 * String that follows formatted number
		 */
		public var suffix:String = "";

		/**
		 * Character(s) used to separate thousands
		 * @default ,
		 */
		public var thousandsSeparator:String = ",";

		/**
		 * Character used to separate decimals
		 * @default .
		 */
		public var decimalSeparator:String = ".";

		/**
		 * Number of decimal places to display
		 * @default 2
		 */
		public var decimalPlaces:int = 2;

		/**
		 * Indicates how to round decimals when <code>decimalPlaces</code> is set 
		 * to zero. Possible values are round, floor and ceil.
		 * @default round
		 */
		public var rounding:String = "round";

		/**
		 * Accepts a number and returns a formatted string
		 */
		public function parse(value:Number, format:Object = null):String
		{
			var label:String = "";
			if(this.decimalPlaces == 0)
			{
				if(this.rounding == "floor")
				{
					value = Math.floor(value);
				}
				else if(this.rounding == "ceiling")
				{
					value = Math.ceil(value);
				}
				else 
				{
					value = Math.round(value);
				}
				label += String(value);	
			}
			else if(this.decimalPlaces > 0) label += value.toFixed(this.decimalPlaces);
			if(this.decimalSeparator && this.decimalSeparator != ".")
			{
				label = label.replace(/\./, ",");
			}
			if(this.thousandsSeparator)
			{
				var regEx:RegExp  = /(-?\d+)(\d{3})/;
				while(regEx.test(label)) 
				{
				   label = label.replace(regEx, "$1" + this.thousandsSeparator + "$2");
				}
			}
			if(this.prefix) label = this.prefix + label;
			if(this.suffix) label += this.suffix;
			return label;
		}
	}
}
