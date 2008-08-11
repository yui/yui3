	<h3 id="custom_page_width">Customizing the Page Width</h3>

	<p>We've made it easy to customize the page width. <code>pixels/13 = ems</code> for all non-IE browsers. For IE, pixels/13.3333 = ems. (I find it useful to preserve up to four decimal places (1.2345) before rounding.)</p>
	
	<h4 class="note">Notes on Customizing Page Widths</h4>

	<p>Here are some other things to keep in mind.</p>
 		<ol>
 			<li>The width is set in <code>em</code>s because <code>em</code>s scale with user-initiated font-size adjustment.</li>
 			<li>YUI Fonts does a good job of normalizing the width of an <code>em</code>, but we're still obliged to provide a slightly different value for IE.</li>
			<li>Be sure the <code>width</code> value for IE comes <em>after</em> the value for everybody else.</li>
			<li>Setting the <code>min-width</code> is optional, but helps the grid maintain integrity as the viewport shrinks.</li>
			<li>The <code>text-align</code> and <code>margin</code> are used to help center the page, and should not generally be modified.</li>
		</ol>
	
	