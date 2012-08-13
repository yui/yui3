ImageCropper
============

ImageCropper is a widget that lets the user select a section of an image. 
It doesn't provide the tools to generate a new image with the selected 
dimensions, it only returns the coordinates selected by the user.

`ImageCropper` is built by extending `Widget` and using the `Plugin.Drag` and
`Plugin.Resize` plugins, and their own `Plugin.DDConstrained` and 
`Plugin.ResizeConstrained` plugins. It also uses the `gallery-event-arrow` 
module for detecting the arrow keys and providing keyboard support.