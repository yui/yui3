/*
Adobe Systems Incorporated(r) Source Code License Agreement
Copyright(c) 2007 Adobe Systems Incorporated. All rights reserved.

Please read this Source Code License Agreement carefully before using
the source code.

Adobe Systems Incorporated grants to you a perpetual, worldwide, non-exclusive,
no-charge, royalty-free, irrevocable copyright license, to reproduce,
prepare derivative works of, publicly display, publicly perform, and
distribute this source code and such derivative works in source or
object code form without any attribution requirements.

The name "Adobe Systems Incorporated" must not be used to endorse or promote products
derived from the source code without prior written permission.

You agree to indemnify, hold harmless and defend Adobe Systems Incorporated from and
against any loss, damage, claims or lawsuits, including attorney's
fees that arise or result from your use or distribution of the source
code.

THIS SOURCE CODE IS PROVIDED "AS IS" AND "WITH ALL FAULTS", WITHOUT
ANY TECHNICAL SUPPORT OR ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING,
BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
FOR A PARTICULAR PURPOSE ARE DISCLAIMED. ALSO, THERE IS NO WARRANTY OF
NON-INFRINGEMENT, TITLE OR QUIET ENJOYMENT. IN NO EVENT SHALL MACROMEDIA
OR ITS SUPPLIERS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOURCE CODE, EVEN IF
ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

package com.adobe.as3Validators{
	
	public class as3DataValidation {

		/**
		 *  @private
		 */
		private static  var DECIMAL_DIGITS:String = "01234567890";

		/**
		 *  @private
		 */
		private static  var LC_ROMAN_LETTERS:String = "abcdefghijklmnopqrstuvwxyz";

		/**
		 * Compare a string against a list of characters to determine if the string does not
		 * contain those characters.  This comparison is not case-senstive and it does not
		 * validate that the characters are in a particular order.
		 *
		 * @param str The string that needs to be validated
		 * @param chars The list of valid characters for that string
		 * @return A Boolean true value if the data is valid
		 */
		public function hasInValidChars(str:String, chars:String):Boolean {
			for (var i:int = 0; i<str.length; i++) {
				if (chars.indexOf(str.charAt(i))) {
					return true;
				}
			}
			return false;
		}


		/**
		 * Compare a string against a list of characters to determine if the string contains
		 * only those characters.  This comparison is not case-sensitive and does not validate
		 * the order of the characters.
		 *
		 * @param str The string that needs to be validated
		 * @param chars The list of valid characters for that string
		 * @return A Boolean true value if the data is valid
		 */
		public function hasValidChars(str:String, chars:String):Boolean {
			var str = str.toLowerCase();
			if (str.length == 0) {
				return false;
			}

			var chars = chars.toLowerCase();
			var cArr = str.split("");
			var len = cArr.length;

			for (var i = 0; i<len; i++) {
				var valid = (chars.indexOf(cArr[i]) != -1);
				if (!valid) {
					return false;
				}
			}
			return true;
		}


		/**
		 * Determine whether a string is a valid IP address
		 *
		 * @param ip The string containing the IP address
		 * @return An as3ValidationResult.result true value if the data is valid.  If the data is invalid, then
		 * as3Validation.result is set to false and the errorStr provides a brief description.
		 */
		public function isIP(ip:String):as3ValidationResult {
			var vResult = new as3ValidationResult();

			if (!this.hasValidChars(ip, DECIMAL_DIGITS+".")) {
				vResult.errorStr = "The string contains invalid characters.";
				return vResult;
			}
			//Does the IP contain four sections 
			var parts = ip.split(".");
			if (parts.length != 4) {
				vResult.errorStr = "Too many periods are in the string.";
				return vResult;
			}
			//Make sure the first number is not zero 
			if (parseInt(parts[0]) == 0) {
				vResult.errorStr = "The first value can not be zero.";
				return vResult;
			}
			//Validate that each part exists and is in the correct range 
			for (var i = 0; i<parts.length; i++) {
				if ((parts[i].length == 0) || (parseInt(parts[i])>255 || parseInt(parts[i])<0)) {
					vResult.errorStr = "The value " + parts[i] + " is not a valid number.";
					return vResult;
				}
			}
			vResult.result = true;
			return vResult;
		}
		
		
		/**
		 * Determine whether a string is a Windows file URL
		 *
		 * @param fileURL The string containing the IP address
		 * @return An as3ValidationResult.result true value if the data is valid.  If the data is invalid, then
		 * as3Validation.result is set to false and the errorStr provides a brief description.
		 */
		public function isFileURL(fileURL:String):as3ValidationResult {
			var vResult = new as3ValidationResult();
			
			//Does it start with file://
			if (fileURL.indexOf("file://") != 0){
				vResult.errorStr = "Does not begin with file://."; 
				return (vResult);
			}
			
			var lastSlash:int = fileURL.lastIndexOf("/");
			
			//On windows systems paths can not be longer than 248 characters
			if (lastSlash -7 >= 248) { return (vResult); }
			
			//On Windows machines filenames can not be longer than 260 characters
			if (fileURL.length - lastSlash >= 260) {
				vResult.errorStr = "The filename is too long for Windows systems.";
				return (vResult);
			}
			
			//Just in case the slash is encoded or something
			if (fileURL.length >= 260 + 248 + 7) {
				vResult.errorStr = "The string is too long for Windows systems.";
				return (vResult);
			}
			
			vResult.result = true;
			return (vResult);
		}
		
		
		/**
		 * This is an example of how to do the isHttpURL and isHttpsURL checks using a RegEx instead
		 * using string functions.
		 * It assumes the domain is sent in the call and that the URL contains at least one "/" after the domain.
		 *
		 * @param str The string containing the http(s) URL
		 * @param domain The string containing expected domain for the URL
		 * @return An as3ValidationResult.result true value if the url is an http or https protocol URL for the
		 * given domain.
		 */
		 /*
		 function checkHttpProtocol (str:String, domain:String):as3ValidationResult {
			var vResult = new as3ValidationResult();
			
			// Build the RegEx
			// This RegEx assumes that there is at least one "/" after the
			// domain. http://www.mysite.com will not match.
			var pattern:RegExp = new RegExp("^http[s]?\:\\/\\/([^\\/]+)\\/");
			var result:Object = pattern.exec(flashVarURL);
			
			if (result == null || result[1] != domain || flashVarURL.length >= 4096) {
				vResult.errorStr = "The URL is invalid";
				return (vResult);
			}
			
			vResult.result = true;
			return (vResult);
		}
		*/
		
		
		/**
		 * Performs basic checks to determine if a string is a valid HTTPS URL
		 *
		 * @param str The string containing the HTTPS URL
		 * @param domain The expected domain for the URL (optional)
		 * @return An as3ValidationResult.result true value if the data is valid. If the data is invalid, then
		 * as3Validation.result is set to false and the errorStr provides a brief description.
		 */
		public function isHttpsURL(str:String, domain:String = ""):as3ValidationResult {
			return this.isHttpURL(str,domain,true);
		}
		
		
		/**
		 * Performs basic checks to determine if a string is a valid HTTP or HTTPS URL
		 *
		 * @param str The string containing the URL
		 * @param domain The expected domain for the URL (optional)
		 * @param isSSL A boolean value that is set to true for HTTPS URLs (optional)
		 * @return An as3ValidationResult.result true value if the data is valid. If the data is invalid, then
		 * as3Validation.result is set to false and the errorStr provides a brief description.
		 */
		public function isHttpURL(str:String, domain:String = "", isSSL:Boolean = false):as3ValidationResult {
			var vResult = new as3ValidationResult();
			var str = str.toLowerCase();

			//Assuming domain contains at least 4 characters (a.eu)
			if (str.length<9 || str.length>4096) {
				vResult.errorStr = "The string is an invalid length.";
				return vResult;
			}

			var startIndex:int;
			var startLen:int;
			if (isSSL) {
				startIndex = str.indexOf("https://");
				startLen = 8;
			} else {
				startIndex = str.indexOf("http://");
				startLen = 7;
			}

			if (startIndex != 0) {
				vResult.errorStr = "The URL contains an invalid protocol."
				return vResult;
			}

			if (!this.hasValidChars(str, DECIMAL_DIGITS+LC_ROMAN_LETTERS+"-_.:/?&%#=+~")) {
				vResult.errorStr = "The URL contains invalid characters.";
				return vResult;
			}
			var tempDomain:String;
			if (str.indexOf("/", startLen+1)>0) {
				tempDomain = str.substr(startLen, str.indexOf("/", startLen+1)-startLen);
			} else {
				tempDomain = str.substring(startLen, str.length);
			}
			//Does the domain name appear to be valid
			if (!this.hasValidChars(tempDomain, DECIMAL_DIGITS+LC_ROMAN_LETTERS+"-.")) {
				vResult.errorStr = "The URL contans an invalid domain name.";
				return vResult;
			}
			//Domain matches SWF domain 
			if (domain.length>0 && domain != tempDomain) {
				vResult.errorStr = "URLs that are not part of " + domain + " are not permitted.";
				return vResult;
			}
			//Confirm that it has only one ?  
			if ((str.indexOf("?")>startLen+1) && (str.indexOf("?") != str.lastIndexOf("?"))) {
				vResult.errorStr = "The URL can contain only one \"?\" seperator.";
				return vResult;
			}
			vResult.result = true;
			return vResult;
		}


		/**
		 * Determines whether a string is an email address.
		 * Checks for common email address formats but it does not support the full RFC definition
		 *
		 * @param str The string containing the email address
		 * @return An as3ValidationResult.result true value if the data is valid. If the data is invalid, then
		 * as3Validation.result is set to false and the errorStr provides a brief description.
		 */
		public function isEmail(str:String):as3ValidationResult {
			var vResult = new as3ValidationResult();
			str = str.toLowerCase();

			//var invalidChars:String = "()<>,;:\\\"[] `~!#$%^&*+={}|/?'";

			//Should this include underscore?
			if (!this.hasValidChars(str, DECIMAL_DIGITS+LC_ROMAN_LETTERS+"-_.@")) {
				vResult.errorStr = "The email address contains invalid characters.";
				return vResult;
			}
			var parts:Array = str.split("@");

			//Validate there is only one @ in the URL
			if (parts.length != 2) {
				vResult.errorStr = "The email address can contain only one \"@\" character.";
				return vResult;

			}
			//Check to make sure the username looks approximately correct 
			var username:String = parts[0];
			if (username.length == 0) {
				vResult.errorStr = "The username can not be blank.";
				return vResult;
			}
			//Check to make sure it ends in a valid extension  
			var domain:Array = parts[1].split(".");

			//The domain must have at least one dot and a char
			if (domain.length<2 || domain[0].length<1) {
				vResult.errorStr = "Invalid domain name.";
				return vResult;
			}
			//should cover country extensions, .info, .museum, etc. 
			var ext:Object = domain.pop();
			if (ext.toString().length<2 || ext.toString().length == 5 || ext.toString().length>6) {
				vResult.errorStr = "Invalid domain extension.";
				return vResult;

			}
			vResult.result = true;
			return vResult;
		}


		/**
		 * Is a String a valid Social Security Number
		 * Valid examples are 111-11-1111 or 111111111
		 *
		 * @param inStr The string that will be validated
		 * @param dashOpt This boolean is set to true if the dash character is optional? (optional)
		 * @return An as3ValidationResult.result true value if the data is valid. If the data is invalid, then
		 * as3Validation.result is set to false and the errorStr provides a brief description.
		 */
		public function isSSN(inStr:String, dashOpt:Boolean = false):as3ValidationResult {
			var vResult = new as3ValidationResult();
			var str:String = inStr.toString();

			if (!this.hasValidChars(str, DECIMAL_DIGITS+"-")) {
				vResult.errorStr = "The SSN contains invalid characters.  Only 0-9 and \"-\" are allowed.";
				return vResult;
			}
			//if the dash must be there, validate it is in the correct spots 
			if (dashOpt == false) {
				if (str.charAt(3) != "-" || str.charAt(6) != "-") {
					vResult.errorStr = "The SSN does not adhere to a ###-##-#### format.";
					return vResult;
				}
			}
			if (str.indexOf("-")>-1) {
				if (str.charAt(3) != "-" || str.charAt(6) != "-") {
					vResult.errorStr = "The SSN does not adhere to a ###-##-#### format.";
					return vResult;
				}
				var parts:Array = str.split("-");
				if (parts.length != 3) {
					vResult.errorStr = "Too many dashes are in the string.";
					return vResult;
				}
				str = parts.join("");
			}
			if (str.length != 9) {
				vResult.errorStr =  "The SSN is too long.";
				return vResult;
			}
			vResult.result = true;
			return vResult;
		}


		/**
		 * Checks for a valid US Zip code
		 * Valid examples include 12345, 123456789 and 12345-6789 for US
		 * Valid examples for Canada include Z1Z-1Z1 and Z1Z 1Z1
		 *
		 * @param str The string to be validated
		 * @param allowCAN Set this Boolean to true to allow US and Canadian zip codes (optional)
		 * @return Am as3ValidationResult.result true value if the data is valid.  If the data is invalid, then
		 * as3Validation.result is set to false and the errorStr provides a brief description.
		 */
		public function isZip(str:String, allowCAN:Boolean = false):as3ValidationResult {
			var vResult = new as3ValidationResult();
			
			//If the Length is 10, Validate it is a US 5-4 format
			if (str.length == 10) {
				if (!this.hasValidChars(str, DECIMAL_DIGITS+"-")) {
					vResult.errorStr = "The Zip contains invalid characters.  Only 0-9 and \"-\" are allowed.";
					return vResult;
				}
				var parts:Array = str.split("-");
				if (parts.length != 2) {
					vResult.errorStr = "Too many dashes.";
					return vResult;
				}

				if (parts[0].length != 5) {
					vResult.errorStr = "The primary ZIP is not 5 characters.";
					return vResult;
				}
				if (parts[1].length != 4) {
					vResult.errorStr = "The 4 digit extension is not 4 digits."
					return vResult;
				}
				//If the zip is a US 5 digit or 9 digit (no space) zip code 
			} else if (str.length == 5 || str.length == 9) {
				if (!this.hasValidChars(str, DECIMAL_DIGITS)) {
					vResult.errorStr = "The zip code is not the correct length.";
					return vResult;
				}
				//Check to see if the zip code is a LDL-DLD Canadian zip code 
			} else if (allowCAN && (str.length == 6 || str.length == 7)) {
				var i:int = 0;
				str = str.toLowerCase();
				if (LC_ROMAN_LETTERS.indexOf(str.charAt(i++)) == -1 || DECIMAL_DIGITS.indexOf(str.charAt(i++)) == -1 || LC_ROMAN_LETTERS.indexOf(str.charAt(i++)) == -1) {
					vResult.errorStr = "The first half of the Canadian Zip code is invalid.";
					return vResult;
				}
				//Check the seperator (space or dash allowed) 
				if (str.length == 7) {
					if (str.charAt(i) != "-" && str.charAt(i) != " ") {
						vResult.errorStr = "The seperator is not in the correct location for a Canadian zip code.";
						return vResult;
					}
					i++;
				}
				if (DECIMAL_DIGITS.indexOf(str.charAt(i++)) == -1 || LC_ROMAN_LETTERS.indexOf(str.charAt(i++)) == -1 || DECIMAL_DIGITS.indexOf(str.charAt(i++)) == -1) {
					vResult.errorStr = "The second half of the Canadian zip is invalid.";
					return vResult;
				}
			} else {
				vResult.errorStr = "Unknown Zip type.";
				return vResult;
			}
			vResult.result = true;
			return vResult;
		}


		/**
		 * Determines whether the string is a valid US Phone Number with the area code
		 * Examples include (555) 555-5555, 555-555-5555, 555 555-5555, +1 (234) 555-5555
		 *
		 * @param str The string to be validated
		 * @return An as3ValidationResult.result true value if the data is valid.  If the data is invalid, then
		 * as3Validation.result is set to false and the errorStr provides a brief description.
		 */
		public function isUSPhoneNumber(inStr:String):as3ValidationResult {
			var vResult = new as3ValidationResult();
			var str:String = inStr.toString();
			str = str.split(" ").join("");

			//Ignore beginning + sign
			if (str.charAt(0) == "+") {
				//Not a US Number
				if (str.charAt(1) != "1") {
					vResult.errorStr = "Not a US Phone number.";
					return vResult;
				};
				str = str.substr(1,str.length);
			}
			
			//Assume country code for now.
			var hasCountryCode:Boolean = false;
			if (str.charAt(0) == "1" && str.length > 10) {
				hasCountryCode = true;
			}
			
			var paren = str.indexOf("(");
			var tempArray:Array;
			if (paren != -1) {
				//Make sure parenthesis are in the right place :)
				if ((paren != 0 && !hasCountryCode) || (hasCountryCode && paren != 1)) {
					vResult.errorStr = "Left parenthesis is in an unexpected position.";
					return vResult;
				}

				paren = str.indexOf(")");
				if ((paren != 4 && !hasCountryCode) || (hasCountryCode && paren != 5)) {
					vResult.errorStr = "Right Parenthesis is in an unexpected position.";
					return vResult;
				}
				
				tempArray = str.split("(");
				if (tempArray.length != 2) {
					vResult.errorStr = "Too many right parenthesis.";
					return vResult;
				}

				tempArray = tempArray.join("").split(")");
				if (tempArray.length != 2) {
					vResult.errorStr = "Too many left parenthesis.";
					return vResult;
				}

				str = tempArray.join("");
			}
			
			if (str.indexOf("-") != -1) {
				tempArray = str.split("-");
				if (tempArray.length>4) {
					vResult.errorStr = "Too many dashes.";
					return vResult;
				}
				var len:int = tempArray.length;
				//trace (tempArray[len - 2] + ":" + tempArray[len - 1]);
				
				//Make sure dash is in the right place
				if (tempArray[len - 1].length != 4) {
					vResult.errorStr = "The dash is an unexpected position.";
					return vResult;
				}
				
				str = tempArray.join("");
			}
			
			if (!this.hasValidChars(str, DECIMAL_DIGITS)) {
				vResult.errorStr = "Invalid characters."
				return vResult;
			}
			
			//Not the right length
			if (str.length < 10 || str.length > 11) {
				vResult.errorStr = "Incorrect length.";
				return vResult;
			}
			
			//Area Codes do not begin with zero or one
			var char:String;
			if (str.length == 10) {
				char = str.substr(0, 1);
			} else if (str.length == 11) {
				char = str.substr(1, 1);
			} else {
				vResult.errorStr = "Incorrect length.";
				return vResult;
			}
			
			if  ((parseInt(char) != 0) && (parseInt(char) != 1)) {
				vResult.result = "true";
				return (vResult);
			} else {
				vResult.errorStr = "Invalid area code.";
				return (vResult);
			}

		}


		/**
		 * Validate a credit card using the LUHN-10 Method
		 * This function ignores spaces and dashes
		 * Length is checked based on card type
		 *
		 * @param str The credit card number as a String
		 * @return An as3ValidationResult.result true value if the data is valid.  If the data is invalid, then
		 * as3Validation.result is set to false and the errorStr provides a brief description.
		 */
		public function isCreditCard(str:String):as3ValidationResult {
			var vResult = new as3ValidationResult();
			var str = str.toString();
			str = str.split("-").join("");
			str = str.split(" ").join("");

			if (!this.hasValidChars(str, DECIMAL_DIGITS)) {
				vResult.errorStr = "Contains invalid characters.";
				return vResult;
			}
			var twoDigit:int = parseInt(str.substr(0, 2));
			//If Visa
			if (str.charAt(0) == "4") {
				if (str.length != 16 && str.length != 13) {
					vResult.errorStr = "Incorrect length for a Visa card.";
					return vResult;
				}
				//If Discover 
			} else if (str.substr(0, 4) == "6011") {
				if (str.length != 16) {
					vResult.errorStr = "Incorrect length for a Discover card.";
					return vResult;
				}
				//If American Express 
			} else if (twoDigit == 34 || twoDigit == 37) {
				if (str.length != 15) {
					vResult.errorStr = "Incorrect length for an American Express.";
					return vResult;
				}
				//If Mastercard 
			} else if (twoDigit>=51 && twoDigit<=55) {
				if (str.length != 16) {
					vResult.errorStr = "Incorrect length for a Mastercard.";
					return vResult;
				}
				//If Diner's Club 
			} else if ((parseInt(str.substr(0, 3))>=300 && parseInt(str.substr(0, 3))<=305) || twoDigit == 36 || twoDigit == 38) {
				if (str.length != 14) {
					vResult.errorStr = "Incorrect length for a Diner's Club card."
					return vResult;
				}
			} else {
				vResult.errorStr = "Unknown card type.";
				return vResult;
			}
			var numbers:Array = str.split("");
			var len:int = numbers.length;
			var i:int;

			//Perform LUHN-10 Check
			for (i=0; i<len; i++, i++) {
				var num = numbers[i]*2;
				num = num.toString();
				if (num.length == 2) {
					num = parseInt(num.substr(0, 1))+parseInt(num.substr(1));
				}
				numbers[i] = num;
			}
			var mNum:int = 0;
			for (i=0; i<len; i++) {
				mNum += parseInt(numbers[i]);
			}

			if (mNum % 10 == 0) {
				vResult.result = true;
				return vResult;
			} else {
				vResult.errorStr = "Invalid card number.";
				return vResult;
			}
		}


		/** 
		 * Casts a string as a number.  If it fails, returns false.
		 *
		 * @param n The String of the number to validate
		 * @return A Boolean true value if the data is valid
		 */
		public function isDigit(n:String):Boolean {
			if (n == "" || n == null || n.length != 1) {
				return false;
			}
			return ! isNaN(parseInt(n));
		}


		/**
		 * Determines if n is within A-Z or a-z
		 *
		 * @param n The character to validate
		 * @return A Boolean true value if the data is valid
		 */
		public function isLetter(n:String):Boolean {
			if (n == "" || n == null || n.length != 1) {
				return false;
			}
			return LC_ROMAN_LETTERS.indexOf(n.toLowerCase()) != -1;
		}


		/**
		 * Determines whether the string contains only alphabetic and numeric characters
		 *
		 * @param str The string to validate
		 * @return A Boolean true value if the data is valid
		 */
		public function isAlphaNumeric(str:String):Boolean {
			return this.hasValidChars(str,DECIMAL_DIGITS + LC_ROMAN_LETTERS);
		}


		/**
		 * Does the character contain an alphabetic character or number
		 *
		 * @param n The character to validate
		 * @return A Boolean true value if the data is valid
		 */
		public function isLetterOrDigit(n:String):Boolean {
			if (n.length != 1) {return false;}
			var ret:Boolean = (this.isLetter(n) || this.isDigit(n));
			return ret;
		}


		/**
		 * Determines whether the string contains data
		 *
		 * @param str The character to validate
		 * @param white A boolean when set to false will ignore white space (space, newline, tab)
		 * @return A Boolean true value if the string is not empty
		 */
		public function isNotEmpty(str:String, white:Boolean = false):Boolean {
			if (white == false) {
				str = str.split(" ").join("");
				str = str.split("\n").join("");
				str = str.split("\t").join("");
			}
			return str.length > 0;
		}


		/**
		 * Determines whether the integer with a specified range
		 *
		 * @param n The String representing the number to validate
		 * @param min The minimum value as a Number (>= comparison)
		 * @param max The maxium value  as a Number (<= comparison)
		 * @return A Boolean true value if the data is within the range
		 */
		public function isIntegerInRange(nString:String, min:int, max:int):Boolean {
			var n:int = parseInt(nString);
			if (isNaN(n) || isNaN(min) || isNaN(max)) {
				return false;
			}
			
			//Make sure the arguments are in the correct order
			if (min > max) {return false;}
			
			//Make sure the number is an Integer
			if (n != Math.round(n)) {
				return false;
			}

			return (n >= min && n <= max);
		}


		/**
		 * Determines whether the string contains a valid day-first format date
		 *
		 * @param str The string containing a date in a day-first format
		 * @return A Boolean true value if the date is a valid day-first date
		 */
		public function isWorldDate(str:String):as3ValidationResult {
			return this.isDate(str,true);
		}


		/**
		 * Determines if the string contains a valid date.
		 * Valid Examples include 9/30/09, 9-30-09 or 9.30.09
		 *
		 * @param str The String containing the date
		 * @param dayFirst Whether the date is in a day first format
		 * @return An as3ValidationResult.result true value if the data is valid.  If the data is invalid, then
		 * as3Validation.result is set to false and the errorStr provides a brief description.
		 */
		public function isDate(str:String, dayFirst:Boolean = false):as3ValidationResult {
			var vResult = new as3ValidationResult();
			var str = str.split(" ").join("");

			var dash = (str.indexOf("-") != -1);
			var slash = (str.indexOf("/") != -1);
			var period = (str.indexOf(".") != -1);

			var parts;

			//Validate that it used a consistent seperator
			if (dash && !slash && !period) {
				parts = str.split("-");
			} else if (slash && !dash && !period) {
				parts = str.split("/");
			} else if (period && !dash && !slash) {
				parts = str.split(".");
			} else {
				vResult.errorStr = "Incorrect format.";
				return vResult;
			}

			if (parts.length != 3) {
				vResult.errorStr = "Too many seperators.";
				return vResult;
			}
			
			//Obtain the pieces of the date 
			var month:int, day:int;

			if (dayFirst == true) {
				day = parseInt(parts[0]);
				month = parseInt(parts[1]);
			} else {
				month = parseInt(parts[0]);
				day = parseInt(parts[1]);
			}
			var year:int = parseInt(parts[2]);
			var yearLen:int = parts[2].length;

			if (yearLen == 2) {
				year = parseInt("20"+parts[2]);
			} else if (yearLen != 4) {
				vResult.errorStr = "Incorrect year.";
				return vResult;
			}
			
			//Validate that the day and month look reasonable 
			if (!this.isIntegerInRange(month.toString(), 1, 12) || !this.isIntegerInRange(day.toString(), 1, 31)) {
				vResult.errorStr = "The day or month is outside of range.";
				return vResult;
			}
			//Cast as date to determine if the date exists on the calendar 
			var dt = new Date(year, month-1, day);

			if (dt.getMonth() != month-1) {
				vResult.errorStr = "Could not convert to a valid date.";
				return vResult;
			}
			
			vResult.result = true;
			return vResult;
		}


		/**
		 * HTML Encodes characters within a string for use in an HTML Text Field
		 * The characters escaped include: <>'&"
		 *
		 * @param str The String containing the HTML data
		 * @return An HTML encoded version of the original string.
		 */
		public function escapeHTML(str:String):String {

			var safeString:String = str;
			if (safeString.indexOf("&")>=0) {
				safeString = safeString.split("&").join("&amp;");
			}
			if (safeString.indexOf("<")>=0) {
				safeString = safeString.split("<").join("&lt;");
			}

			if (safeString.indexOf(">")>=0) {
				safeString = safeString.split(">").join("&gt;");
			}

			if (safeString.indexOf("\"")>=0) {
				safeString = safeString.split("\"").join("&quot;");
			}
			
			if (safeString.indexOf("'")>=0) {
				safeString = safeString.split("'").join("&apos;");
			}

			return safeString;
		}



		/**
	 	 * Checks to determine if a string contains a possible scripting tags.
		 * This function only checks for javascript:, event:, vbscript: and asfunction: links
		 * It will not check for data:, mailto: or other tags.
		 *
		 * @param str The string that will be checked.
		 * @return A Boolean true value if the string contains the forbidden text
		 */
		public function containsScriptSchemes(htmlString:String):Boolean {
			//Convert to lowercase since certain browsers ignore case
			var str:String = htmlString.toLowerCase();

			//remove spaces, tabs and newlines since different browser and OS combinations
			//occasionally ignore these characters
			str = str.split(" ").join("");
			str = str.split("\t").join("");
			str = str.split("\n").join("");
			str = str.split("\r").join("");

			if (str.indexOf("asfunction:")>=0 || str.indexOf("javascript:")>=0 || str.indexOf("event:")>=0 || str.indexOf("vbscript:")>=0) {
				return true;
			}
			return false;
		}
		
	}//End Class

}//End Package