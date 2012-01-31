ScrollView Change History
=========================

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
