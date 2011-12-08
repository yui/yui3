# YUI Button

## Goal
To introduce a new Button component for YUI 3 that addresses the following user stories

* "I want buttons on my site to look consistent & attractive."
* "I want to be able to programmatically control buttons in my application."
* "I want to my buttons to be intelligent and interact with one another in groups."
* "I want my application to be able to dynamically generate buttons."

## Requirements
* [ARIA](http://www.w3.org/TR/wai-aria/states_and_properties) / Accessibility
* Modern styles (using CSS3), but degrades well to legacy browsers
* Customizable colors with minimal fuss
* Something lighter than Y.Widget, but similar in features to YUI2 buttons

## Modules
* [cssbuttons](https://github.com/derek/yui3-1/blob/master/src/button/css/cssbuttons.css) (CSS) - Some lite CSS skins to give the buttons a nice look & feel. This is ideal for someone who just wants a nice looking button, without needing programatic control.
* [button-base](https://github.com/derek/yui3-1/blob/master/src/button/js/base.js) (JS) - A `Y.Attribute`-driven wrapper around a button-like DOM node, and some helper utilities
* [button-group](https://github.com/derek/yui3-1/blob/master/src/button/js/group.js) (JS) - A manager that listens for Y.Button events and can fire notifications when the selection has changed

## Design
Buttons can be used in many different ways.  Some users just want the buttons to be aesthetically pleasing, others want to listen for clicks/events, others want to programmatically control them, and some will use them for core navigation groups.  Because of these variety of use cases, it's important to have functionality logically and modularly separate, while keeping them simple to use & control.  

The lightest possible implementation is just including the button stylesheet and adding the `yui3-button` class to any element you would like to be a button.  As requirements start to increase, you can start adding on JS modules to provide the required functionality.  The JS portion of Button is very `Y.Attribute`-driven.  The idea is that it that `Y.Button` is basically a wrapper around a DOM node that fills in missing functionality and keeps the UI in sync with the button state.  `Y.ButtonGroup` is also `Y.Attribute` driven that knows about groups of `Y.Button` instances and manages them as a whole.

## Module Exports
### button-base.js
* `Y.Button` - The Y.Attribute-driven Button object
* `Y.Buttons` - A way to generate an array of Y.Button instances given a NodeList
* `Y.ButtonGenerator` - A way to dynamically generate a Y.Button instance with an unattached DOM node

### button-group.js
* `Y.ButtonGroup` - A way to connect Y.Button instances together and has a memory of selection states

## Y.Button
### public methods:
- onClick
- getDOMNode

### private methods:
- _colorToHex (static)
- _getContrastYIQ (static)

### attributes
- type - specifies the type of button (push/toggle)
- disabled - a setter for the node's 'disabled' attribute
- selected - a setter that handles the node's 'selected' state
- backgroundColor - The background color for the button

### events:
- typeChange
- selectedChange
- backgroundColorChange
- disabledChange

### CSS classes
- yui3-button
- yui3-button:hover
- yui3-button:active
- yui3-button-selected
- yui3-button-focused
- yui3-button-disabled

## Y.ButtonGroup
### attributes
* type - The type of group (default:push/radio/checkbox)
* buttons - An array of `Y.Button `instances that are in this group
* selection - The array of `Y.Button` instances that are currently selected

### ARIA support
- role=button
- aria-pressed
- aria-selected

I haven't come up with a good reason for making ARIA support optional (like YUI 2 Button), so it's just baked in for the time being.

## Examples / Demos
You can find some demos [here](http://derek.io/~/yui/yui3/src/button/tests/manual/index.html).

## To Do / Notes
* `Y.Button` - Add sugar & properties to not require users to use .get() & .set() all the time. This will improve usability & performance.
* `Y.Button` - Support aria-label/aria-labeledby
* `Y.Button` - Support icons & image buttons
* `Y.Button` - Determine if the color contrast calculation should belong in `Y.Button`, or elsewhere
* `Y.Buttons` - Combine with Y.Button?
* `Y.ButtonGenerator` - Allow an optional `container` element that the node is appended to?
* `Y.ButtonGroup` - Support aria-multiselectable for radio groups
* `Y.ButtonGroup` - Possibly support aria-owns if `Y.Button` instance relationship is not parent-children
* `Y.ButtonGroup` - 'selection' is probably inefficient.
* `cssbuttons` - Add basic Sam & Night skins
* Allow using selector strings as opposed to requiring a Node/NodeList to instantiate.
* Investigate state on legacy browsers
* Investigate state on tablets
* Investigate lazy attributes
* Use the `event-touch` module to be more responsive on touchscreen devices

        Y.all('.yui3-button').on(['touchstart' /* <- if applicable */, 'click'], function (e) {
            e.halt(); // Stop event propagation
            // do something
        });