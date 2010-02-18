package com.yahoo.datatype
{
	/**
	 * Hash of STRF Locales
	 */
	public class STRFLocales
	{
		/**
		 * @private
		 */
		private static var instance:STRFLocales = new STRFLocales();

		/**
		 * @private
		 */
		public function STRFLocales()
		{
			if(instance) 
			{
				throw new Error("This is a singleton class and should be instantiated using the getInstance method.");
				return;
			}
			this.initializeLocales();
		}

		/**
		 * @private 
		 */
		private var _defaultLocale:Object = 
		{
			a: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
			A: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
			b: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			B: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			c: "%a %d %b %Y %T %Z",
			p: ["AM", "PM"],
			P: ["am", "pm"],
			r: "%I:%M:%S %p",
			x: "%d/%m/%y",
			X: "%T"
		};

		/**
		 * @private
		 * Storage for locales
		 */
		private var _locales:Object =
		{
			en:_defaultLocale
		};

		/**
		 * A hash of locales.
		 */
		public function get locales():Object
		{
			return this._locales;
		}

		/**
		 * Constructor
		 */
		public static function getInstance():STRFLocales
		{
			return instance;
		}

		/**
		 * Adds a locale to the locales hash.
		 */
		public function addLocale(locale:String, value:Object):void
		{
			this._locales[locale] = value;
		}
		
  		/**
		 * Gets a locale based on a key value
		 */
		public function getLocale(value:String):Object
		{
			if(this._locales.hasOwnProperty(value)) return this._locales[value];
			throw new Error("The locale you have requested does not exist.");
		}

		/**
		 * @private
		 */
		private function initializeLocales():void
		{
			this._locales["en-US"] = this.merge(this._defaultLocale,
								{ 
									c: "%a %d %b %Y %I:%M:%S %p %Z",
									x: "%m/%d/%Y",
									X: "%I:%M:%S %p"
								});
			this._locales["en-GB"] = this.merge(this._defaultLocale, {r: "%l:%M:%S %P %Z"});
			this._locales["en-AU"] = this.merge(this._defaultLocale);
		}
		
		/**
		 * @private
		 * Should be a utility function
		 */
		private function merge(value:Object, addValue:Object = null):Object
		{
			var merged:Object = {};
			for(var i:String in value) merged[i] = value[i];
			if(addValue) for(i in addValue) merged[i] = addValue[i];
			return merged;
		}
	}
}
