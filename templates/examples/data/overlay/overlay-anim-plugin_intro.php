<p>This example shows how you can use Widget's plugin infrastructure to customize the behavior of an existing widget.</p>

<p>We create an Animation plugin class (<code>AnimPlugin</code>) for Overlay which changes the way Overlay instances are shown/hidden by fading them in/out. The Overlay is initially constructed with the <code>AnimPlugin</code> plugged in <em>(with the duration set to 2 seconds)</em>.
Clicking the "Unplug AnimPlugin" button, will restore the original non-Animated Overlay show/hide behavior and clicking on the "Plug AnimPlugin" button will plug in the <code>AnimPlugin</code> again, but with a shorter duration.</p>
