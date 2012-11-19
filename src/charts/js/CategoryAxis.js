/**
 * CategoryAxis draws a category axis for a chart. 
 *
 * @submodule charts-base
 * @class CategoryAxis
 * @constructor
 * @param {Object} config (optional) Configuration parameters for the Axis.
 * @extends Axis
 * @uses CategoryData
 */
Y.CategoryAxis = Y.Base.create("categoryAxis", Y.Axis, [Y.CategoryData]);

