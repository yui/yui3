ScrollView Change History
=========================

3.10.3
------

* No changes.

3.10.2
-----

  * Paginator API methods now respect the widget's `disabled` ATTR

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

  * Improved accuracy of 'scrollEnd' event. (#2533030 & #2532323)

  * Scrollbars now accurately represent the current offset within a dual-axis paginated instance. (#2532751)

  * Paginator now blocks flick events on disabled instances. (#2533078)

  * Paginator now prevents the host's flick listener from being executed (it should only listen for gesturemove events), as opposed to unbinding the listener. (SHA 42885f5)

3.8.1
-----

  * Linting cleanup.

  * Improvements to ScrollView's unit tests. PR #361

3.8.0
-----

  * Paging is now only triggered when a swipe crosses a mid-point threshold, to match the < 3.7.0 behavior (#2532745)

  * Fixed issue where Mousewheel could prevent next()/prev() API interaction on horizontally paginated instances (#2532815)

  * scrollToIndex now sets correct default value for easing (#2532895)

  * ScrollViewPaginator#scrollToIndex now properly respects animation duration and easing arguments (thanks juandopazo)

  * General cleanup

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

  * Added Forced-Axis and Dual-Axis Support. ScrollView now has an (optional) `axis`
    property that can be declared with values: `x`, `y`, or `xy`. (#2532631)

  * Added: Initial support for RTL (Right-To-Left) layouts (#2531874).

  * Added: Unit test coverage for scrollview-base and scrollview-paginator (#2532288, #2532287)

  * Moved: Paginator’s scrollTo() method has been deprecated and replaced with scrollToIndex. (##2530145)

  * Moved the following ScrollView static properties (now deprecated) to instance attributes for more control
    SNAP_DURATION to 'snapDuration'
    SNAP_EASING to 'snapEasing'
    EASING to 'easing'
    FRAME_STEP to 'frameDuration'
    BOUNCE_RANGE to 'bounceRange'

  * Fix: Mousewheel events on a horizontally scrolling instance no longer prevent page scrolling (#2532739)

  * Fix: Mousewheel events now properly update the `scrollY` attribute.

  * Fix: Improved reliability of the scrollEnd event. Now it now only fires
    once per scrolling sequence, instead of sometimes twice.

  * Fix: Resolved issue where multiple listeners could sometimes be added for drag and flick events.

  * Fix: Improved gesture event detachment

  * Fix: Refactored _flickFrame to do less attribute lookups, helpful for performance reasons

  * Fix: Resolved issue where scrollview.pages.scrollTo may not actually scroll to the desired page, or may cause a lock-up of the widget.

3.6.0
-----

  * Fixed issue with mousewheel not working when multiple scrollviews are present (#2532377)

3.5.1
-----

  * Fixed issue with scrollview capturing all mousewheel events on a page (#2532214)

3.5.0
-----

  * Allow scrollbar to work with non-px width scrollviews

  * Added mousewheel support (#2529136)

3.4.1
-----

  * Fixed incorrect scroll width/height calculations to account for
    translate (for real this time) on Chrome, and now Safari.

    translateZ applied for h/w acceleration was resulting in the incorrect
    scroll values.

  * Removed fallback to cb.scrollWidth/Height, when determining scroll dimensions.
    This was masking the real problem with translate impacting boundingBox scroll
    width/height calcs mentioned above.

  * Fixed scrollbar racing ahead of scroll position on FF 5+ with native transition
    support enabled.

  * Added ability to disable scrollview completely, disable flick or disable drag

    // Stops SV from moving through flick/drag or the API.
    sv.set("disabled", true);

    // Stops SV from reacting to flick. Can still drag/scroll through API
    sv.set("flick", false);

    // Stops SV from reacting to drag. Can still flick, scroll through API
    sv.set("drag", false);

  * Resync UI on scrollview-list class application.

3.4.0
-----

  * Fixed _uiDimensionsChange code which was looking explicitly for
    the "width" attribute. Just plain wrong.

  * Added vertical paging support.

  * Removed DOMSubtreeModified event listening which was only really kicking
    in for Webkit and was too heavy handed. User now needs to call syncUI()
    manually on all browsers, if the content of the scrollview is changed,
    and may potentially result in dimension changes.

  * Broke out use of transform3d into a seperate method, and added a protected
    flag, _forceHWTransforms, to allow for customization if required
    (H/W acceleration related glitches or changing the set of browsers for
    which we attempt to force it).

  * Created Scrollview-List plugin to provide out-of-the-box handling of
    List (LI) content inside horizontal and vertical ScrollViews.

  * Fixed incorrect scroll width/height calculations on Chrome 9+, FF
    when syncUI() [ or _uiDimensionsChange() ] was called when the ScrollView
    was scrolled over.

  * Protected state flags are now reset if _uiDimensionsChange results in
    flipped orientation.

  * Use the larger of bb.scrollWidth/Height or cb.scrollWidth/Height, to calculate
    scroll dimensions to account for FF (which clips cb.scrollWidth) and
    Chrome/MacOS (which clips bb.scrollWidth when translated even after
    incorrect scroll calcs above).

3.3.0
-----

  * Fixed shared scrollbar node across multiple instances.

  * Changed async call to _uiDimensionsChange after render, to a sync call.

  * Corrected skin prefix to be yui3-skin-sam instead yui-skin-sam.

  * Refactored for kweight, and broke out scrollview-base-ie conditional module.

  * Don't prevent default on gesturemoveend, so that click listeners on
    elements inside the scrollview respond reliably. Panning is still prevented
    by preventing gesturemousemove.

  * Removed generic CSS in scrollview-base.css targeting UL/LI content. The
    rules were added to support the common use case, but were too broad, and in
    general, scrollview is content agnostic.

  * The same support can be achieved by adding cssreset to the page (to remove
    LI bullets, padding, margin), and adding inline block rules, when providing
    horizontal scrollview content as a list. These rules are provided below:

    /* To layout horizontal LIs */
    #my-horiz-scrollview-content li {
      display: inline-block;
       *display: inline;
       *zoom:1;
    }

    /* For IE - needs a non-transparent background to pick up events */
    #my-scrollview-content li {
      *zoom:1;
      background-color:#fff;
    }

  * Added prefix-less border radius scrollbar styles for IE9.

  * Made scrollbar-paginator skinnable:false. It has no CSS which is applied,
    out of the box currently. The paginator CSS shipped in 3.2.0, was not actively
    applied.

3.2.0
-----

  * New beta component
