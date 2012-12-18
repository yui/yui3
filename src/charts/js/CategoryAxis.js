/**
 * CategoryAxis draws a category axis for a chart. 
 *
 * @submodule axis-display 
 * @class CategoryAxis
 * @constructor
 * @param {Object} config (optional) Configuration parameters for the Axis.
 * @extends Axis
 * @uses CategoryImpl
 */
Y.CategoryAxis = Y.Base.create("categoryAxis", Y.Axis, [Y.CategoryImpl]);

