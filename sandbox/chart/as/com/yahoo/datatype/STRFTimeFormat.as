package com.yahoo.datatype
{

	public class STRFTimeFormat
	{
		/**
		 * Default pattern to use when unspecified.
		 */
		public const DEFAULT_PATTERN:String = "%D";

		/**
		 * Constructor
		 */
		public function STRFTimeFormat(format:Object = null)
		{
			this.initialize();
		}

		/**
		 * @private
		 */
		private var _localeHash:STRFLocales;

		/**
		 * @private
		 */
		private var _date:Date;

		/**
		 * @private
		 */
		private var _locale:Object;


		/**
		 * @private
		 */
		private var _localeKey:String = "en";


		/**
		 * @private
		 */
		private var _tokenReplacements:Object = 
		{
			a: function(d:Date):String { return this._locale.a[d.getDay()]; },
			A: function(d:Date):String { return this._locale.A[d.getDay()]; },
			b: function(d:Date):String { return this._locale.b[d.getMonth()]; },
			B: function(d:Date):String { return this._locale.B[d.getMonth()]; },
			C: function(d:Date):String { return (int(d.getFullYear()/100)) as String; },
			d: function(d:Date):String { return this.addLeading(String(d.getDate()), "0");},
			e: function(d:Date):String { return this.addLeading(String(d.getDate()), " ");},
			H: function(d:Date):String { return this.addLeading(String(d.getHours()), "0");},
			I: function(d:Date):String {
				var dateInt:Number = d.getHours()%12;
				dateInt = dateInt === 0 ? 12 : dateInt;
				return this.addLeading(String(dateInt), "0");
			},
			j: function(d:Date):String {
				var curDate:Date = new Date(d.getFullYear(), d.getMonth(),  d.getDate());
				var startYear:Date = new Date(d.getFullYear(), 0);
				var diff:int = Math.floor((curDate.valueOf() - startYear.valueOf())/(1000 * 60 * 60 * 24));
				var doy:String = String(diff + 1);
				return this.addLeading(doy, "0", 3);
			},
			k: function(d:Date):String { return this.addLeading(String(d.getHours()), " ");},
			l: function(d:Date):String { 
				var dateInt:Number = d.getHours()%12; 
				dateInt = dateInt === 0 ? 12 : dateInt;
				return this.addLeading(String(dateInt), " ");
			},
			m: function(d:Date):String { return this.addLeading(String(d.getMonth() + 1), "0"); },
			M: function(d:Date):String { return this.addLeading(String(d.getMinutes()), "0"); },
			p: function(d:Date):String { return this._locale.p[d.getHours() >= 12 ? 1 : 0 ]; },
			P: function(d:Date):String { return this._locale.P[d.getHours() >= 12 ? 1 : 0 ]; },
			s: function(d:Date):String { return String(d.getTime()/1000); },
			S: function(d:Date):String { return this.addLeading(String(d.getSeconds()), "0"); },
			u: function(d:Date):String { 
				var dow:int = int(d.getDay());
				return String(dow === 0 ? 7 : dow);
			},
			U: function(d:Date):String { 
				var doy:int = int(this._tokenReplacements.j.call(this, d)); 
				var rdow:int = int(d.getDay()); 
				var woy:int = int((doy+rdow)/7);
				return this.addLeading(String(woy), "0");
			},
			V: function(d:Date):String {
				var woy:int = int(this._tokenReplacements.W.call(this, d));
				var dow:int = (new Date(String(d.getFullYear()) + "/1/1")).getDay();
				var idow:int = woy + (dow > 4 || dow <=1 ? 0 : 1);
				if(idow == 53 && (new Date(String(d.getFullYear()) + "/12/31")).getDay() < 4)
				{
					idow = 1;
				}
				else if (idow === 0)
				{
					idow = this._tokenReplacements.V.call(this, new Date(String(d.getFullYear()-1) + "/12/31"));
				}
				return this.addLeading(String(idow), "0");
			},
			w: function(d:Date):String { return String(d.getDay()); },
			W: function(d:Date):String {
				var doy:int = int(this._tokenReplacements.j.call(this, d));
				var rdow:int = 7 - int(this._tokenReplacements.u.call(this, d));
				var woy:int = int((doy+rdow)/7);
				return this.addLeading(woy, "0");
			},
			y: function(d:Date):String { return this.addLeading(String(d.getFullYear()%100), "0"); },
			Y: function(d:Date):String { return String(d.getFullYear()); },
			z: function(d:Date):String { 
				var o:int = d.getTimezoneOffset();
				var H:String = this.addLeading(String(int(Math.abs(o/60))), "0");
				var M:String = this.addLeading(String(int(Math.abs(o%60))), "0");
				return (o>0?"-":"+") + H + M;
			},
			Z: function(d:Date):String {
				var tz:String = String(d).replace(/^.*:\d\d( GMT[+-]\d+)? \(?([A-Za-z ]+)\)?\d*$/, "$2").replace(/[a-z ]/g, "");
			   	if(tz.length > 4) this._tokenReplacements.z.call(this, d);
			   	return tz;
			},
			"%": function(d:Date):String { return "%"; }
		};

		/**
		 * @private
		 */
		private var _complexTokens:Object =
		{
			D: "%m/%d/%y",
			F: "%Y-%m-%d",
			h: "%b",
			n: "\n",
			R: "%H:%M",
			t: "\t",
			T: "%H:%M:%S"
		};

		/**
		 * @private
		 * Storage for pattern
		 */
		private var _pattern:String;

		/**
		 * @private
		 * Unformatted pattern that may contain complex tokens.
		 */
		private var _rawPattern:String;

		/**
		 * The pattern used for formatting.
		 */
		public function get pattern():String
		{
			return this._pattern;
		}

		/**
		 * @private (setter)
		 */
		public function set pattern(value:String):void
		{
			this._rawPattern = value;
			while(value.match(/%[cDFhnrRtTxX]/))
			{
				value = value.replace(/%([cDFhnrRtTxX])/g, this.replaceComplexTokens);
			}
			this._pattern = value;
		}

		public function parse(value:Date):String
		{
			this._date = value;
			return this._pattern.replace(/%([aAbBCdegGHIjklmMpPsSuUVwWyYzZ%])/g, this.replaceTokens);
		}

		/**
		 * Sets the locale by a key value
		 */
		public function setLocale(value:String):void
		{
			if(this._localeKey === value) return;
			this._localeKey = value;
			this._locale = this._localeHash.getLocale(value);
			this.pattern = this._rawPattern;
		}
		
		/**
		 * @private
		 */
		private function replaceTokens():String
		{
			var func:Function = this._tokenReplacements[arguments[1]] as Function;
			return func.call(this, this._date) as String;
		}

		/**
		 * @private
		 */
		private function replaceComplexTokens():String
		{
			if(this._complexTokens.hasOwnProperty(arguments[1])) return this._complexTokens[arguments[1]];
			return this._locale[arguments[1]];
		}

		/**
		 * @private
		 */
		private function addLeading(item:String, char:String, amount:int = 2):String
		{
			var len:int = amount - item.length;
			if(len > 0) for(var i:int = 0; i < len; i++) item = char + item;
			return item;
		}

  		/**
		 * @private
		 */
		private function initialize():void
		{
			this._localeHash = STRFLocales.getInstance();
			this._locale = this._localeHash.getLocale(this._localeKey);
			this.pattern = this.DEFAULT_PATTERN;
		}
	}
}
