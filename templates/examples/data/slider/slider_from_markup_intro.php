<p>This example illustrates how to create a Slider using existing markup.  The <code>boundingBox</code> and <code>contentBox</code> are included in the markup and passed to the constructor.  Standard class names are assigned to the DOM elemnts inside the <code>contentBox</code> that will result in them being discovered and automatically used.</p>

<p>The visualization of the Slider is based on the volume control in Mac OS X 10.5, with additional controls included for illustration.  <strong>Click on the speaker icon to show the Slider</strong>.</p>

<p>Things to note about this example:</p>
<ul>
    <li>The Slider is rendered into a hidden container, and the <code>syncUI</code> method called when it is made visible</li>
    <li>Some default Sam skin style is overridden to support the implementation</li>
    <li>The image used as the rail background is actually applied to the <code>contentBox</code> to support the effect of the thumb stopping before the edge of the rail</li>
    <li>Absolute positioning is used to place the rail element inside the <code>contentBox</code> in accordance with the background image</li>
    <li>The <code>contentBox</code> contains non-Slider related markup (the speaker icon button), but this does not impact the operation of the Slider</li>
</ul>
