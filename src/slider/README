The Slider widget
    The Slider widget creates an input UI involving a draggable thumb, representing a value, sliding along a rail, representing the finite value range.

3.3.0
    * Default thumbUrl no longer broken when using the seed file from the combo
      service.

3.2.0
    * Leverages touch events when the UA supports them
    * (un)Swapped skin files for audio and audio-light skins

3.1.1
    * No changes

3.1.0
    * Major refactoring.  Broken into SliderBase, ClickableRail, and
      SliderValueRange classes, and Y.Slider is the product of Y.Base.build(..)
      of these.  SliderBase is responsible for rendering the UI and
      broadcasting slideStart, slideEnd, and thumbMove events.  ClickableRail
      adds support for clicking on the rail to move the thumb.
      SliderValueRange adds support for min, max, and value attributes.  Values
      are integers ranging from 0 to 100 by default.  Base.build in different
      value algorithms or extensions to specialize from SliderBase.
    * railSize attribute renamed to length
    * maxGutter and minGutter attributes removed.  Use CSS and/or apply manually
      via slider._dd.con.set('gutter',___);
    * rail, thumb, thumbImg Node attributes removed, as well as HTML_PARSER
      support.  Progressive enhancement stems from a value source, not a markup
      source.  Various progressive enhancement extensions will arrive in future
      versions.
    * Sam skin updated and 7 new skins added (sam-dark, round, round-dark,
      capsule, capsule-dark, audio, audio-light)
    * New markup and CSS structure including separate shadow image (set to same
      image as thumb, positioned via CSS ala sprite.
    * Thumb placement method changed from setXY and DD positioning methods to
      simpler setStyle('left', x) or 'top' for vertical Sliders.  Allows
      rendering and modifying in hidden containers without the need to syncUI()
      when making visible.  Still recommended to call syncUI() if rendered off
      DOM, but may not be necessary if using Sam skin. YMMV.

3.0.0
    * Removed noop _setValueFn and the setter config for the value attribute
    * Renamed static protected AXIS_KEYS to _AXIS_KEYS
    * Renamed _defUpdateValueFromDD to _defThumbDragFn per naming conventions
    * Added _convertOffsetToValue to mirror _convertValueToOffset

3.0.0 beta 1
    * renamed the valueSet custom event to positionThumb and rejiggered the
      logic of the default function and support methods.
    * renamed _defSyncUI to _defSyncFn for library nomenclature consistency
    * Added protected _convertValueToOffset to help position the thumb
    * Set bubble: false on the DD.Drag instance
    * Created a ConsoleFilters plugin to restore the filter checkboxes familiar
      to yui2 users. myConsole.plug(Y.Plugin.ConsoleFilters);
    * Added collapse/expand button to header and changed input[type=button]s to
      button elements
    * silence the logging subsystem during the print cycle
    * major markup and skin css overhaul
    * added support for setting height and width in configuration
    * logLevel filtering now only applies to messages with info|warn|error.
      All other messages pass through.
    * static Console.LOG_LEVEL_INFO etc are now strings
    * added logSource attribute to support a single Console instance listening
      to all YUI instance log statements { logSource: Y.Global }
    * added destructor
    * Renamed _timeout to _printLoop and _clearTimeout to _cancelPrintLoop
    * refactored printLogEntry to call new _createEntry(meta). _addToConsole
      subsumed into printLogEntry.  _createEntry returns an HTML string.
    * print loop scheduled on render to display any previously buffered entries
    * print loop only scheduled if the Console has been rendered
    * entries added to Console via DocumentFragment and Node instance creation
      avoided for performance
    * buffer is spliced at the beginning of a print loop to limit entries that
      would be removed by consoleLimit anyway

3.0.0 PR2
    Initial release
