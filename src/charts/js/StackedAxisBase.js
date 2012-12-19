/**
 * StackedAxisBase manages time data for an axis.
 *
 * @class StackedAxisBase
 * @constructor
 * @extends AxisBase
 * @uses StackedImpl 
 * @param {Object} config (optional) Configuration parameters.
 * @submodule axis-stacked 
 */
Y.StackedAxisBase = Y.Base.create("stackedAxisBase", Y.AxisBase, [Y.StackedImpl]);
