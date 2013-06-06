Graphics Change History
=======================

3.10.3
------

* No changes.

3.10.2
------

  * #701 Addressed rounding issue in svg implementation. This bug surfaces in edge cases of the PieChart in the charts module.

3.10.1
------

* No changes.

3.10.0
------

* No changes.

3.9.1
-----

  * #2533119 Removed all lint warnings.

3.9.0
-----

  * #2533116 Addressed issue in which relativeMoveTo did not work in the SVG implementation.
  * #2530941 Added chaining to drawing commands.
  * #2532710 Addressed issue in which malformed path data was being created.

3.8.1
-----

  * No changes.

3.8.0
-----

  * No changes.

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

  * #2532682 Addressed issue in which drawing and filling the same shape independently resulted in bad VML rendering.
  * #2531432 Added data attribute to allow for passing svg path strings to a shape.
  * #2532495 Added generic (non-implementation specific) class names to shapes.
  * #2532611 Added toFront and toBack methods to shapes.
  * #2532612 Added ability to animate a shapes stroke and fill attributes when incuding the anim-shape submodule. All shape attributes are animatable.
  * #2532635 Added ability size the contents of a Graphic instance to fit into its parent container.

3.6.0
-----

  * #2532293 Filled out testing coverage.
  * #2532307 Added xRadius and yRadius attributes for ellipses.
  * #2532362 Removed hard-coded "yui3-" from class names.
  * #2532306 Addressed issue in which too large a bounding box was being created for quadratic and cubic bezier curves.
  * #2532305 Addressed issue in which linejoin bevel was not being set.
  * #2532243 Addressed issues caused by setting visible to false on a graphic instance.
  * #2532222 Addressed issue in which a rotated shape did not drag correctly.
  * #2531989 Address issues with invalid gradient values for x1,x2,y1,y2.
  * #2532242 Fixed issue with VMLGraphic.removeShape in which shapes were not removed when an id is passed instead of an instance.
  * #2532255 Fixed bug with shape attribute translateX and translateY.
  * #2532252 Fix issue in which passing null to stroke/fill attributes in CanvasShape threw errors.
  * #2532253 Implement clear method in canvas graphic.
  * #2532272 Fixed issues with VMLGraphic.getXY() in which the wrong values were returned after x and y attributes are updated.
  * #2532243 Fixed issue in which setting the visible attribute of a graphic to false upon instantiation caused errors.
  * #2532114 Add ability to draw subpixel paths in ie.

3.5.1
-----

  * #2531921 Fixed issue in which gradients fills threw an exception in canvas implementations.
  * #2532197 Fixed issue in which updating the transform attribute of a shape caused two redraws.

3.5.0
-----

  * #2531630 Changed BaseGraphic class to GraphicBase.
  * Removed memory leaks from Shape class.
  * Added defaultGraphicEngine config to allow developer to specify canvas as the preferred graphic technology.
  * #2531127 Fixed issue in which transforms were not consistent across different browsers.
  * #2531230 Fixed issue in which setting visible at instantiation would throw an error for a shape.
  * #2531359 Fixed issue in which setting attributes in IE would throw errors.
  * #2531460 Fixed issue in which the clear() method would throw errors in IE.
  * #2531465 Fixed typographic error in SVGGraphic class.
  * #2531049 Added matrix option to the shape's transform attribute.
  * #2531126 Added ability animate transform attribute.
  * #2531552 Change name of Graphics Path Utility to Graphics Path Tool.

3.4.1
-----

  * No changes.


3.4.0
-----

  * Initial release.
