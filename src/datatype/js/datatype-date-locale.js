/**
 * @module datatype
*/

/**
 * The Date.Locale class is a container for all localised date strings
 * used by Y.DataType.Date. It is used internally, but may be extended
 * to provide new date localisations.
 *
 * To create your own Locale, follow these steps:
 * <ol>
 *  <li>Find an existing locale that matches closely with your needs</li>
 *  <li>Use this as your base class.  Use Y.DataType.Date.Locale["en"] if nothing
 *   matches.</li>
 *  <li>Create your own class as an extension of the base class using
 *   Y.merge, and add your own localisations where needed.</li>
 * </ol>
 * See the Y.DataType.Date.Locale["en-US"] and Y.DataType.Date.Locale["en-GB"]
 * classes which extend Y.DataType.Date.Locale["en"].
 *
 * For example, to implement locales for French french and Canadian french,
 * we would do the following:
 * <ol>
 *  <li>For French french, we have no existing similar locale, so use
 *   Y.DataType.Date.Locale["en"] as the base, and extend it:
 *   <pre>
 *      Y.DataType.Date.Locale["fr"] = Y.merge(Y.DataType.Date.Locale, {
 *          a: ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"],
 *          A: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
 *          b: ["jan", "f&eacute;v", "mar", "avr", "mai", "jun", "jui", "ao&ucirc;", "sep", "oct", "nov", "d&eacute;c"],
 *          B: ["janvier", "f&eacute;vrier", "mars", "avril", "mai", "juin", "juillet", "ao&ucirc;t", "septembre", "octobre", "novembre", "d&eacute;cembre"],
 *          c: "%a %d %b %Y %T %Z",
 *          p: ["", ""],
 *          P: ["", ""],
 *          x: "%d.%m.%Y",
 *          X: "%T"
 *      });
 *   </pre>
 *  </li>
 *  <li>For Canadian french, we start with French french and change the meaning of \%x:
 *   <pre>
 *      Y.DataType.Date.Locale["fr-CA"] = Y.merge(Y.DataType.Date.Locale["fr"], {
 *          x: "%Y-%m-%d"
 *      });
 *   </pre>
 *  </li>
 * </ol>
 *
 * With that, you can use your new locales:
 * <pre>
 *    var d = new Date("2008/04/22");
 *    Y.DataType.Date.format(d, { format: "%A, %d %B == %x", locale: "fr" });
 * </pre>
 * will return:
 * <pre>
 *    mardi, 22 avril == 22.04.2008
 * </pre>
 * And
 * <pre>
 *    Y.DataType.Date.format(d, {format: "%A, %d %B == %x", locale: "fr-CA" });
 * </pre>
 * Will return:
 * <pre>
 *   mardi, 22 avril == 2008-04-22
 * </pre>
 * @requires oop
 * @class DataType.Date.Locale
 * @static
 * @deprecated - use Y.config.lang to request one of many built-in languages instead.
 */
var YDateEn = {
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

Y.namespace("DataType.Date.Locale");

Y.DataType.Date.Locale["en"] = YDateEn;

Y.DataType.Date.Locale["en-US"] = Y.merge(YDateEn, {
	c: "%a %d %b %Y %I:%M:%S %p %Z",
	x: "%m/%d/%Y",
	X: "%I:%M:%S %p"
});

Y.DataType.Date.Locale["en-GB"] = Y.merge(YDateEn, {
	r: "%l:%M:%S %P %Z"
});
Y.DataType.Date.Locale["en-AU"] = Y.merge(YDateEn);


