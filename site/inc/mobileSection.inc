<h2 id="mobile">YUI on Mobile: Using <?php echo $component; ?> with "A-Grade" Mobile Browsers</h2>

<div class="include-notice"><p><strong>About this Section:</strong> YUI generally works well with mobile browsers that are based on A-Grade browser foundations.  For example, Nokia's N-series phones, including the N95, use a browser based on Webkit &#8212; the same foundation shared by Apple's Safari browser, which is found on the iPhone.  The fundamental challenges in developing for this emerging class of full, A-Grade-derived browsers on handheld devices are:</p>

<ul>
	<li><em>Screen size:</em> You have a much smaller canvas;</li>
	<li><em>Input devices:</em> Mobile devices generally do not have mouse input, and therefore are missing some or all mouse events (like mouseover);
	</li><li><em>Processor power:</em> Mobile devices have slower processors that can more easily be saturated by JavaScript and DOM interactions &#8212; and processor usage affects things like battery life in ways that don't have analogues in desktop browsers;
	</li><li><em>Latency:</em> Most mobile devices have a much higher latency on the network than do terrestrially networked PCs; this can make pages with many script, css or other types of external files load much more slowly.</li>
</ul>
<p>There are other considerations, many of them device/browser specific (for example, current versions of the iPhone's Safari browser do not support Flash).  The goal of these sections on YUI User's Guides is to provide you some preliminary insights about how specific components perform on this emerging class of mobile devices.  Although we have not done exhaustive testing, and although these browsers are revving quickly and present a moving target, our goal is to provide some early, provisional advice to help you get started as you contemplate how your YUI-based application will render in the mobile world.</p>
<p><strong>More Information:</strong></p>

<ul>
	<li><a href="http://yuiblog.com/blog/2007/10/02/challenges-of-interface-design-for-mobile-devices/">Challenges of Interface Design for Mobile Devices</a> - YUI Blog article by Lucas Pettinati, Yahoo! Sr. Interaction Designer.</li>
	<li><a href="http://yuiblog.com/blog/2008/02/06/iphone-cacheability/">Performance Research, Part 5: iPhone Cacheability - Making it Stick</a> - YUI Blog article by Tenni Theurer and Wayne Shea from the Yahoo! Exceptional Performance Team</li>
</ul></div>