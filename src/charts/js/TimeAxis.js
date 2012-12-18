/**
 * TimeAxis draws a time-based axis for a chart.
 *
 * @submodule axis-display 
 * @class TimeAxis
 * @constructor
 * @param {Object} config (optional) Configuration parameters for the Axis. 
 * @extends Axis
 * @uses TimeImpl
 */
Y.TimeAxis = Y.Base.create("timeAxis", Y.Axis, [Y.TimeImpl]);

