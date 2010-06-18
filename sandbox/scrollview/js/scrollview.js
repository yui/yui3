/**
 * Create a scrollable container of fixed height or width for devices which
 * do not support overflow: hidden
 * 
 * @module scrollview
 */

/**
 * ScrollView provides a scrollable container for devices which do not 
 * support overflow: hidden
 *
 * @class ScrollView
 * @constructor
 * @extends ScrollViewBase
 * @uses Y.ScrollbarsPlugin
 * @param config {Object} Configuration object
 */ 
Y.Base.plug(Y.ScrollView, Y.ScrollbarsPlugin);