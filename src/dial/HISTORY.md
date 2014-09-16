Dial Change History
===================

3.17.2
------

* No changes.

3.17.1
------

* No changes.

3.17.0
------

* No changes.

3.16.0
------

* No changes.

3.15.0
------

* No changes.

3.14.1
------

* No changes.

3.14.0
------

* No changes.

3.13.0
------

* No changes.

3.12.0
------

* No changes.

3.11.0
------

* No changes.

3.10.3
------

* No changes.

3.10.2
------
* Fixed GitHub Issue #591: Dial was intermittently sticking at min when
  drag below min, and then back above min. This was only happenening when
  min/max was at a position of North on the dial.
* Added Hungarian language support [Gábor Kovács]

3.10.1
------

* No changes.

3.10.0
------

* No changes.

3.9.1
-----

* No changes.

3.9.0
-----

* No changes.

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

  * No changes.

3.6.0
-----

  * No changes.

3.5.1
-----

  * No changes.

3.5.0
-----

  * Changed method name from _recalculateDialCenter to _calculateDialCenter

  * Changed property name from _centerXOnPage to _dialCenterX
    and from _centerYOnPage to _dialCenterY

  * Known issue: On IE7, when browser is zoomed, clicking on dial gives the
    wrong value.

  * Multiple instances of Dial all had the same ARIA label.
    They are now unique. Screenreaders now read both the label and the value.
    [Ticket #2531505]

3.4.1
-----

  * Changed method name from _getNewValueFromMousedown to _handleMousedown

  * Improved mousedown on ring handling [Ticket #2530597]

  * Improved handling of dragging the handle past max/min and around multiple
    revolutions. [Ticket #2530766]

  * Fixed problem with Dial having incorrect center X and Y following a browser
    resize. [Ticket #2531111]

3.4.0
-----

  * Names of 3 configuration attributes have changed:
    stepsPerRev       ->   stepsPerRevolution
    handleDist        ->   handleDistance
    centerButtonDia   ->   centerButtonDiameter

  * New configuration attributes:
    markerDiameter
    handleDiameter

  * Enhancement:
    In addition to setting the Dial by dragging the handle as it was in 3.3.0,
    Dial now supports setting the value by clicking on the Ring.
    This does not cross value "wrapping" boundries.
    For example: If a Dial has 0 degrees = value 0,
    and the Dial's current handle position is 10 degrees with a value = 10,
    then a mousedown at 355 degrees will result in a value of 355 not -10.
    In this case all mousedown events will result in values between 0 and 355.
    This is within current value "wrapping" boundries.
    Moving across value wrapping boundaries, must be done by dragging the handle
    or using the keyboard.

  * Changed the name of class
    marker-max-min
    - to -
    yui3-dial-marker-max-min

  * Enhancement:
    In 3.3.0, when the user dragged the handle past the min or max, the Marker
    displayed as red to indicate min/max.
    When the cursor was released, the marker was no longer displayed.
    There remained no user feedback indicating max/min.
    When the keyboard was used to change the value, no min/max indication was
    displayed, except that the handle stopped moving.
    In this release, the Marker display state of red remains as long as the
    Dial is at min/max, regardless of mouse or keyboard use.
    If you don't want min/max feedback, CSS class yui3-dial-marker-max-min
    can be overridden.

  * When mousedown is used to set its value, Dial now has intuitive handling of
    different configurations of min, max where stepsPerRevolution is
    greater than or less than one revolution. [Ticket #2530306]

3.3.0
-----

  * New Beta Component
    Deprecated _setLabelString, _setTooltipString, _setResetString.
    Instead, use DialObjName.set('strings',{'label':'My new label',
    'resetStr';'My New Reset'});   before DialObjName.render();
    One or more strings can be changed at a time.
    Removed _setXYResetString. Now done through CSS.
    Not called by Dial.js anymore.

