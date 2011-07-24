ValueChange
===========

Provides a synthetic `valueChange` event that fires when the `value`
property of a text input element or textarea changes as the result of a
keystroke, mouse operation, or input method editor (IME) input event.

The `valueChange` event provides more reliable input notifications than
native events like `oninput` and `textInput`, particularly with changes that
result from multiple-keystroke IME input.
