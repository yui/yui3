/**
 * CategoryAxisBase is an abstract class that manages numeric data for an axis.
 *
 * @class CategoryAxisBase
 * @constructor
 * @extends AxisBase
 * @uses CategoryImpl 
 * @param {Object} config (optional) Configuration parameters.
 * @submodule axis-base 
 */
Y.CategoryAxisBase = Y.Base.create("categoryAxisBase", Y.AxisBase, [Y.CategoryImpl]);
