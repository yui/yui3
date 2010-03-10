/*
  Copyright (c) 2008, Adobe Systems Incorporated
  All rights reserved.

  Redistribution and use in source and binary forms, with or without 
  modification, are permitted provided that the following conditions are
  met:

  * Redistributions of source code must retain the above copyright notice, 
    this list of conditions and the following disclaimer.
  
  * Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the 
    documentation and/or other materials provided with the distribution.
  
  * Neither the name of Adobe Systems Incorporated nor the names of its 
    contributors may be used to endorse or promote products derived from 
    this software without specific prior written permission.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
  IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
  THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
  PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR 
  CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
  PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
  PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

package com.adobe.serialization.json {

	public class JSONTokenizer {
		
		/** 
		 * Flag indicating if the tokenizer should only recognize
		 * standard JSON tokens.  Setting to <code>false</code> allows
		 * tokens such as NaN and allows numbers to be formatted as
		 * hex, etc.
		 */
		private var strict:Boolean;
	
		/** The object that will get parsed from the JSON string */
		private var obj:Object;
		
		/** The JSON string to be parsed */
		private var jsonString:String;
		
		/** The current parsing location in the JSON string */
		private var loc:int;
		
		/** The current character in the JSON string during parsing */
		private var ch:String;
		
		/**
		 * Constructs a new JSONDecoder to parse a JSON string 
		 * into a native object.
		 *
		 * @param s The JSON string to be converted
		 *		into a native object
		 */
		public function JSONTokenizer( s:String, strict:Boolean )
		{
			jsonString = s;
			this.strict = strict;
			loc = 0;
			
			// prime the pump by getting the first character
			nextChar();
		}
		
		/**
		 * Gets the next token in the input sting and advances
		* the character to the next character after the token
		 */
		public function getNextToken():JSONToken
		{
			var token:JSONToken = new JSONToken();
			
			// skip any whitespace / comments since the last 
			// token was read
			skipIgnored();
						
			// examine the new character and see what we have...
			switch ( ch )
			{	
				case '{':
					token.type = JSONTokenType.LEFT_BRACE;
					token.value = '{';
					nextChar();
					break
					
				case '}':
					token.type = JSONTokenType.RIGHT_BRACE;
					token.value = '}';
					nextChar();
					break
					
				case '[':
					token.type = JSONTokenType.LEFT_BRACKET;
					token.value = '[';
					nextChar();
					break
					
				case ']':
					token.type = JSONTokenType.RIGHT_BRACKET;
					token.value = ']';
					nextChar();
					break
				
				case ',':
					token.type = JSONTokenType.COMMA;
					token.value = ',';
					nextChar();
					break
					
				case ':':
					token.type = JSONTokenType.COLON;
					token.value = ':';
					nextChar();
					break;
					
				case 't': // attempt to read true
					var possibleTrue:String = "t" + nextChar() + nextChar() + nextChar();
					
					if ( possibleTrue == "true" )
					{
						token.type = JSONTokenType.TRUE;
						token.value = true;
						nextChar();
					}
					else
					{
						parseError( "Expecting 'true' but found " + possibleTrue );
					}
					
					break;
					
				case 'f': // attempt to read false
					var possibleFalse:String = "f" + nextChar() + nextChar() + nextChar() + nextChar();
					
					if ( possibleFalse == "false" )
					{
						token.type = JSONTokenType.FALSE;
						token.value = false;
						nextChar();
					}
					else
					{
						parseError( "Expecting 'false' but found " + possibleFalse );
					}
					
					break;
					
				case 'n': // attempt to read null
					var possibleNull:String = "n" + nextChar() + nextChar() + nextChar();
					
					if ( possibleNull == "null" )
					{
						token.type = JSONTokenType.NULL;
						token.value = null;
						nextChar();
					}
					else
					{
						parseError( "Expecting 'null' but found " + possibleNull );
					}
					
					break;
					
				case 'N': // attempt to read NaN
					var possibleNaN:String = "N" + nextChar() + nextChar();
					
					if ( possibleNaN == "NaN" )
					{
						token.type = JSONTokenType.NAN;
						token.value = NaN;
						nextChar();
					}
					else
					{
						parseError( "Expecting 'NaN' but found " + possibleNaN );
					}
					
					break;
					
				case '"': // the start of a string
					token = readString();
					break;
					
				default: 
					// see if we can read a number
					if ( isDigit( ch ) || ch == '-' )
					{
						token = readNumber();
					}
					else if ( ch == '' )
					{
						// check for reading past the end of the string
						return null;
					}
					else
					{						
						// not sure what was in the input string - it's not
						// anything we expected
						parseError( "Unexpected " + ch + " encountered" );
					}
			}
			
			return token;
		}
		
		/**
		 * Attempts to read a string from the input string.  Places
		 * the character location at the first character after the
		 * string.  It is assumed that ch is " before this method is called.
		 *
		 * @return the JSONToken with the string value if a string could
		 *		be read.  Throws an error otherwise.
		 */
		private function readString():JSONToken
		{
			// the string to store the string we'll try to read
			var string:String = "";
			
			// advance past the first "
			nextChar();
			
			while ( ch != '"' && ch != '' )
			{					
				// unescape the escape sequences in the string
				if ( ch == '\\' )
				{	
					// get the next character so we know what
					// to unescape
					nextChar();
					
					switch ( ch )
					{	
						case '"': // quotation mark
							string += '"';
							break;
						
						case '/':	// solidus
							string += "/";
							break;
							
						case '\\':	// reverse solidus
							string += '\\';
							break;
							
						case 'b':	// bell
							string += '\b';
							break;
							
						case 'f':	// form feed
							string += '\f';
							break;
							
						case 'n':	// newline
							string += '\n';
							break;
							
						case 'r':	// carriage return
							string += '\r';
							break;
							
						case 't':	// horizontal tab
							string += '\t'
							break;
						
						case 'u':
							// convert a unicode escape sequence
							// to it's character value - expecting
							// 4 hex digits
							
							// save the characters as a string we'll convert to an int
							var hexValue:String = "";
							
							// try to find 4 hex characters
							for ( var i:int = 0; i < 4; i++ )
							{
								// get the next character and determine
								// if it's a valid hex digit or not
								if ( !isHexDigit( nextChar() ) )
								{
									parseError( " Excepted a hex digit, but found: " + ch );
								}
								// valid, add it to the value
								hexValue += ch;
							}
							
							// convert hexValue to an integer, and use that
							// integrer value to create a character to add
							// to our string.
							string += String.fromCharCode( parseInt( hexValue, 16 ) );
							
							break;
					
						default:
							// couldn't unescape the sequence, so just
							// pass it through
							string += '\\' + ch;
						
					}
					
				}
				else
				{
					// didn't have to unescape, so add the character to the string
					string += ch;
					
				}
				
				// move to the next character
				nextChar();
			}
			
			// we read past the end of the string without closing it, which
			// is a parse error
			if ( ch == '' )
			{
				parseError( "Unterminated string literal" );
			}
			
			// move past the closing " in the input string
			nextChar();
			
			// the token for the string we've just read
			var token:JSONToken = new JSONToken();
			token.type = JSONTokenType.STRING;
			// attach to the string to the token so we can return it
			token.value = string;
			
			return token;
		}
		
		/**
		 * Attempts to read a number from the input string.  Places
		 * the character location at the first character after the
		 * number.
		 * 
		 * @return The JSONToken with the number value if a number could
		 * 		be read.  Throws an error otherwise.
		 */
		private function readNumber():JSONToken
		{
			// the string to accumulate the number characters
			// into that we'll convert to a number at the end
			var input:String = "";
			
			// check for a negative number
			if ( ch == '-' )
			{
				input += '-';
				nextChar();
			}
			
			// the number must start with a digit
			if ( !isDigit( ch ) )
			{
				parseError( "Expecting a digit" );
			}
			
			// 0 can only be the first digit if it
			// is followed by a decimal point
			if ( ch == '0' )
			{
				input += ch;
				nextChar();
				
				// make sure no other digits come after 0
				if ( isDigit( ch ) )
				{
					parseError( "A digit cannot immediately follow 0" );
				}
				// unless we have 0x which starts a hex number, but this
				// doesn't match JSON spec so check for not strict mode.
				else if ( !strict && ch == 'x' )
				{
					// include the x in the input
					input += ch;
					nextChar();
					
					// need at least one hex digit after 0x to
					// be valid
					if ( isHexDigit( ch ) )
					{
						input += ch;
						nextChar();
					}
					else
					{
						parseError( "Number in hex format require at least one hex digit after \"0x\"" );	
					}
					
					// consume all of the hex values
					while ( isHexDigit( ch ) )
					{
						input += ch;
						nextChar();
					}
				}
			}
			else
			{
				// read numbers while we can
				while ( isDigit( ch ) )
				{
					input += ch;
					nextChar();
				}
			}
			
			// check for a decimal value
			if ( ch == '.' )
			{
				input += '.';
				nextChar();
				
				// after the decimal there has to be a digit
				if ( !isDigit( ch ) )
				{
					parseError( "Expecting a digit" );
				}
				
				// read more numbers to get the decimal value
				while ( isDigit( ch ) )
				{
					input += ch;
					nextChar();
				}
			}
			
			// check for scientific notation
			if ( ch == 'e' || ch == 'E' )
			{
				input += "e"
				nextChar();
				// check for sign
				if ( ch == '+' || ch == '-' )
				{
					input += ch;
					nextChar();
				}
				
				// require at least one number for the exponent
				// in this case
				if ( !isDigit( ch ) )
				{
					parseError( "Scientific notation number needs exponent value" );
				}
							
				// read in the exponent
				while ( isDigit( ch ) )
				{
					input += ch;
					nextChar();
				}
			}
			
			// convert the string to a number value
			var num:Number = Number( input );
			
			if ( isFinite( num ) && !isNaN( num ) )
			{
				// the token for the number that we've read
				var token:JSONToken = new JSONToken();
				token.type = JSONTokenType.NUMBER;
				token.value = num;
				return token;
			}
			else
			{
				parseError( "Number " + num + " is not valid!" );
			}
			
            return null;
		}

		/**
		 * Reads the next character in the input
		 * string and advances the character location.
		 *
		 * @return The next character in the input string, or
		 *		null if we've read past the end.
		 */
		private function nextChar():String
		{
			return ch = jsonString.charAt( loc++ );
		}
		
		/**
		 * Advances the character location past any
		 * sort of white space and comments
		 */
		private function skipIgnored():void
		{
			var originalLoc:int;
			
			// keep trying to skip whitespace and comments as long
			// as we keep advancing past the original location 
			do
			{
				originalLoc = loc;
				skipWhite();
				skipComments();
			}
			while ( originalLoc != loc );
		}
		
		/**
		 * Skips comments in the input string, either
		 * single-line or multi-line.  Advances the character
		 * to the first position after the end of the comment.
		 */
		private function skipComments():void
		{
			if ( ch == '/' )
			{
				// Advance past the first / to find out what type of comment
				nextChar();
				switch ( ch )
				{
					case '/': // single-line comment, read through end of line
						
						// Loop over the characters until we find
						// a newline or until there's no more characters left
						do
						{
							nextChar();
						}
						while ( ch != '\n' && ch != '' )
						
						// move past the \n
						nextChar();
						
						break;
					
					case '*': // multi-line comment, read until closing */

						// move past the opening *
						nextChar();
						
						// try to find a trailing */
						while ( true )
						{
							if ( ch == '*' )
							{
								// check to see if we have a closing /
								nextChar();
								if ( ch == '/')
								{
									// move past the end of the closing */
									nextChar();
									break;
								}
							}
							else
							{
								// move along, looking if the next character is a *
								nextChar();
							}
							
							// when we're here we've read past the end of 
							// the string without finding a closing */, so error
							if ( ch == '' )
							{
								parseError( "Multi-line comment not closed" );
							}
						}

						break;
					
					// Can't match a comment after a /, so it's a parsing error
					default:
						parseError( "Unexpected " + ch + " encountered (expecting '/' or '*' )" );
				}
			}
			
		}
		
		
		/**
		 * Skip any whitespace in the input string and advances
		 * the character to the first character after any possible
		 * whitespace.
		 */
		private function skipWhite():void
		{	
			// As long as there are spaces in the input 
			// stream, advance the current location pointer
			// past them
			while ( isWhiteSpace( ch ) )
			{
				nextChar();
			}
			
		}
		
		/**
		 * Determines if a character is whitespace or not.
		 *
		 * @return True if the character passed in is a whitespace
		 *	character
		 */
		private function isWhiteSpace( ch:String ):Boolean
		{
			return ( ch == ' ' || ch == '\t' || ch == '\n' || ch == '\r' );
		}
		
		/**
		 * Determines if a character is a digit [0-9].
		 *
		 * @return True if the character passed in is a digit
		 */
		private function isDigit( ch:String ):Boolean
		{
			return ( ch >= '0' && ch <= '9' );
		}
		
		/**
		 * Determines if a character is a digit [0-9].
		 *
		 * @return True if the character passed in is a digit
		 */
		private function isHexDigit( ch:String ):Boolean
		{
			// get the uppercase value of ch so we only have
			// to compare the value between 'A' and 'F'
			var uc:String = ch.toUpperCase();
			
			// a hex digit is a digit of A-F, inclusive ( using
			// our uppercase constraint )
			return ( isDigit( ch ) || ( uc >= 'A' && uc <= 'F' ) );
		}
	
		/**
		 * Raises a parsing error with a specified message, tacking
		 * on the error location and the original string.
		 *
		 * @param message The message indicating why the error occurred
		 */
		public function parseError( message:String ):void
		{
			throw new JSONParseError( message, loc, jsonString );
		}
	}
	
}
