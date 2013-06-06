Charts Change History
=====================

3.10.3
------

* No changes.

3.10.2
------

  * #743 Addressed issue in which styles don't map correctly to a legend when series are styled using a global style object. 
  * #706 Addressed issue in which the legend did not honor specified series marker style for shape. 

3.10.0
------

  * #2533184 Addressed issue in which Axis.getEdgeOffset was returning an incorrect value.
  * #2533130 Added hideFirstMajorUnit and hideLastMajorUnit attributes to axis classes allowing for suppression of rendering the first/last label and tick on an axis.
  * #2533128 Add ability for axis to generate labels and their position from an array of values.  

3.9.1
-----

  * #2533120 Removed all lint warnings.

3.9.0
-----

  * #2533050 Addressed issue in which stacked histograms failed to render properly when there was less available space than specified dimensions.
  * #2533052 Addressed issue in which CartesianSeries.getTotalValues threw an error.
  * #2533053 Addressed issue in which CartesianSeries._getDefaultColor threw an error when the type argument was not given.
  * #2532883 Refactored code to be more modular.
  * #2533101 Addressed issue in which the area attribute of the combo series was clobbered by the Fills class.
  * #2532025 Addressed issue in which the pie chart slices were not clickable in Canvas implementations.
  * #2528811 Created Candlestick series. (not yet integrated into Charts application)
  * #2528812 Created OHLC series. (not yet integrated into Charts application)
  * #2533079 Created SeriesBase class to allow for more modularity of different series types.
  * #2530500 Added ability for Time and Numeric axes to calculate an edgeOffset similar to CategoryAxis.
  * #2533066 Allow for standalone axes to draw automatically.

3.8.1
-----

  * #2533048 Addressed issue in which styles.majorUnit.determinant was not honored when set to distance.

3.8.0
-----

  * #2532955 Addressed issue in which click events were not firing on elements outside of chart in ios.

3.7.3
-----

  * No changes.

3.7.2
-----

  * No changes.

3.7.1
-----

  * No changes.

3.7.0
-----

  * #2532713 Addressed issue in which updating the dataProvider on a chart with a legend threw an error.

3.6.0
-----

  * #2532336 Addressed issue in which tooltip was referenced before it was set.
  * #2532078 Addressed issue in which setting a dataProvider with a different structure failed to update a chart.
  * #2532103 Addressed issues with null values in stacked area charts.
  * #2532115 Addressed issue in which stacked area charts did not close correctly when a series had null values at the beginning or end.
  * #2531796 Addressed issue in which a combo series with discontinuous data and discontinuousType set to dashed broke the chart.
  * #2532102 Addressed issue in which Area Charts with null values at the start or beginning do not close accurately.
  * #2532186 Addressed issue in which categoryDisplayName and valueDisplayName in seriesCollection were not accepted on init.
  * #2532234 Addressed issue in which axis appendTitleFunction and appendLabelFunction attributes were not being set properly.
  * #2532284 Addressed issue in which legend item text with spaces wrapped.
  * #2532285 Cleaned up legend destructor method.
  * #2532327 Addressed issue in which negative values in a column series displayed incorrectly.
  * #2532348 Addressed issue in which AreaSpline style object returned null.
  * #2532353 Addressed issue in which vertical attribute was not being set properly on non-histogram cartesian series.
  * #2532292 Filled out testing coverage
  * #2531688 Fixed rounding bug in pie chart.

3.5.1
-----

  * #2532138 Fixed min/max issues with NumericAxis.
  * #2532195 Fixed issues with tooltip when numeric values are used in a CategoryAxis.

3.5.0
-----

  * #2531748 Added aria keyboard navigation.
  * #2530195 Tooltip display toggles on touchend event for mobile implementations.
  * #2531410 Fixed issue in which specifying color arrays for marker borders of some series type broke in canvas implementation.
  * #2528814 Added charts-legend submodule to allow chart legends.
  * #2531456 Fixed issue in which loading a chart with an empty data provider throw an error and not load.
  * #2530559 Added ability to explicitly set the width/height for vertical/horizontal axes
  * #2531003 Fixed issue in which axis labels flowed outside the chart's bounding box. Added allowContentOverflow attribute to allow for the overflow if desired.
  * #2531390 Addressed performance issues with IE
  * #2530151 Fixed issue in which charts will load large data sets loaded slowly. Added the notion of group markers to limit the number of dom nodes.
  * #2531468 Changed axis title attribute to use appendChild. NOTE: This may break backward compatibility if the value for your title attribute was dependent on innerHTML to format text.
  * #2531469 Changed axis label to use appendChild. NOTE: This may break backward compatibility with custom label functions if they were dependent on innerHTML to format text.
  * #2531472 Changed tooltip to use appendChild.  NOTE: This may break backward compatibility with custom tooltip functions if they were dependent on innerHTML to format text.
  * Removed memory leaks caused by orphaned dom elements.
  * Axes performance enhancements.
  * #2529859 Fixed issue in which Chart with timeAxis was not correctly initialized when setting dataProvider.
  * #2529922 Fixed issue in which updates to axes config after chart render did not take affect.
  * #2530032 Fixed issue in which changing dataProvider after instantiation but pre-render resulted in the original dataProvider being used by the chart.
  * #2531245 Fixed issue in which the alwaysShowZero attribute was ignored by the NumericAxis.
  * #2531277 Fixed issue in which the area charts bled outside of content bounds when minimum was higher than zero.
  * #2531283 Fixed issue in which stacked historgrams did not accept an array for marker color values.
  * #2531314 Fixed issue in which a series failed to show if its value was missing from the first index of the dataProvider.
  * #2529878 Added a percentage of whole value to the tooltip for PieChart.
  * #2529916 Added ability to distinguish between zero and null values in histograms.
  * #2531515 Fixed issue in which PieChart was not handling numbers of type string.
  * #2531459 Fixed issue with histogram marker size irregularity on mouseover when specified width/height values are larger than the area available on the graph.


3.4.1
-----

  * #2531234 Fixed issue in which axis titles were not positioned properly in IE 6 and 7.
  * #2531233 Fixed issue in which axis line and tick styles were overriding each other.
  * #2531232 Fixed issue in which inner axis ticks did not display.
  * #2531231 Fixed issue in which the top axis line was not positioned properly.
  * #2530109 Fixed issue in which the NumericAxis roundingMethod was not always being respected when a number was specified.
  * #2531100 Fixed issue in which the NumericAxis was not correctly calculating its data range when a minimum or maximum was explicitly set.
  * #2530127 Added originEvent, pageX and pageY properties to the event facade for marker and planar events.
  * #2530591 Added ability to accept custom series classes.
  * #2530592 Fixed errors resulting from empty series.
  * #2530810 Removed hard-coded class prefixes.
  * #2530908 Fixed issue in which the NumericAxis was not respecting explicitly set minimum and maximum values in some cases.
  * #2530969 Ensure underlying dom nodes of markers have unique ids.
  * #2530984 Fixed issue in which PieChart was not resizing properly.
  * #2531024 Fixed issue in which PieChart did not draw from center when width and height were not equal.
  * #2530985 Fixed issue in which PieChart failed to always render in MSIE 8.
  * #2531020 Fixed issue in which gridlines could be hidden by other elements.
  * #2531040 Fixed issue in which missing data broke stacked histograms.
  * #2531071 Fixed issue in which charts would not render if one of the series was empty.

3.4.0
-----

  * Charts only requires datatype-number and datatype-date instead of the datatype rollup.
  * #2530413 Position axis labels with transform instead of css styles.
  * #2530533 Fixed issue in which stacked bar/column displayed inaccurated data on mouseover when zero values appeared in the series.
  * #2530404 Fix issue in which markers were incorrectly omitted from graphs.
  * #2530395 SplineSeries extends LineSeries instead of CartesianSeries.
  * #2529841 Add axis title.
  * #2530143 Refactor to use Graphics API
  * #2530223 Fixed bug in which negative value markers were not displayed in column/bar series.
  * #2529849 Fixed styles documentation bug
  * #2530115 Fixed bug preventing tooltip's node from being overwritten.
  * #2529972 Fixed issue in which zero/null values were falsely creating markers in stacked bar and column series.
  * #2529926 Fixed issue in which null values were being treated as zero.
  * #2529925 Fixed bug in which dashed line was not drawn in combo and line series.
  * #2529926 Fixed issue in which null values in data provider are treated as 0.
  * #2529927 Addressed issue in which primitive value strings were not being parsed correctly in the TimeAxis.
  * #2529971 Force range on a NumericAxis when all values are zero.
  * #2529842 Ensure Numeric axis has at least on negative and positive tick when minimum is less than zero and maximum is greater than zero.
  * #2529840 Changed stacked bar and column series to handle cases in which the item value is at or rounded to zero.

3.3.0
-----

  * Initial release.
