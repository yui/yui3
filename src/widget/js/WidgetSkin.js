/**
 * Provides skin related utlility methods.
 *
 * @module widget
 * @submodule widget-skin
 */

var BOUNDING_BOX = "boundingBox",
    CONTENT_BOX = "contentBox",
    SKIN = "skin",
    CLASS_NAME_PREFIX = 'classNamePrefix',
    CLASS_NAME_DELIMITER = 'classNameDelimiter',
    CONFIG = Y.config;

/**
 * Returns the name of the skin that's currently applied to the widget.
 * This is only really useful after the widget's DOM structure is in the
 * document, either by render or by progressive enhancement.
 *
 * Searches up the Widget's ancestor axis for a class [prefix][delim]skin[delim]name
 * and returns the <name> portion.  Otherwise, returns null.
 *
 * @method getSkinName
 * @for Widget
 * @param {String} prefix The prefix of the skin to look for (default is yui3)
 * @param {String} delim  The delimiter of the skin to look for (default is -)
 * @return {String} the name of the skin, or null (yui3-skin-sam => sam)
 */

Y.Widget.prototype.getSkinName = function (prefix, delimiter) {
    var root = this.get( CONTENT_BOX ) || this.get( BOUNDING_BOX ),
      sPrefix = prefix || CONFIG[CLASS_NAME_PREFIX],
      sDelimiter = delimiter || CONFIG[CLASS_NAME_DELIMITER],
      className = sPrefix + sDelimiter + SKIN + sDelimiter,
      search = new RegExp( '\\b' + className + '(\\S+)' ),
      match;

    if ( root ) {
        root.ancestor( function ( node ) {
            match = node.get( 'className' ).match( search );
            return match;
        } );
    }

    return ( match ) ? match[1] : null;
};
