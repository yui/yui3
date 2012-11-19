/**
 * TimeAxis draws a time-based axis for a chart.
 *
 * @submodule charts-base
 * @class TimeAxis
 * @constructor
 * @param {Object} config (optional) Configuration parameters for the Axis. 
 * @extends Axis
 * @uses TimeData
 */
Y.TimeAxis = Y.Base.create("timeAxis", Y.Axis, [Y.TimeData]);

