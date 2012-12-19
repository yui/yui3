/**
 * TimeAxisBase manages time data for an axis.
 *
 * @class TimeAxisBase
 * @extends AxisBase
 * @uses TimeImpl
 * @constructor
 * @param {Object} config (optional) Configuration parameters.
 * @submodule axis-base
 */
Y.TimeAxisBase = Y.Base.create("timeAxisBase", Y.AxisBase, [Y.TimeImpl]);
