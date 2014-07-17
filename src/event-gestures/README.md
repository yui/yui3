The gestures module provides gesture events such as "flick"
and "gesturemove", which normalize user interactions across
touch and mouse or pointer based input devices.

This layer can be used by application developers to build
input device agnostic components which behave the same in
response to either touch or mouse based interaction.

It rolls up the following submodules:

event-flick

Provides a "flick" event which notifies
users interested in a "flick" gesture, providing distance,
time and velocity information.

event-move

Provides "gesturemovestart", "gesturemove" and "gesturemoveend"
events, which can be used to normalize drag type interactions
across touch and mouse devices.
