<p>This example employs the <a href="http://developer.yahoo.com/yui/get/">YUI
Get Utility</a> in a simple use case: retrieving JSON data from a cross-domain
web service. While this is a relatively common usage, it's important to
understand the security ramifications of this technique. Scripts loaded via the
Get Utility (or any other &quot;script node&quot; solution) execute immediately
once they are loaded. If you do not fully control (or fully trust) the script's
source, this is not a safe technique and it can put the security of your users'
data at risk. (For more information on the dangers of cross-site scripting
[XSS] exploits, <a
href="http://en.wikipedia.org/wiki/Cross-site_scripting">check out the
Wikipedia entry on this subject</a>.)</p> <p>Here, we will use a trusted Yahoo!
Search web service called <a
href="http://developer.yahoo.com/search/siteexplorer/V1/inlinkData.html">Site
Explorer</a> to return a list of inbound links for a given URL. The principal
difference between this example and similar examples using <a
href="http://developer.yahoo.com/yui/connection/">YUI IO Utility</a> is
that this technique does not require a server-side proxy. The browser connects
directly to the third-party web service without bouncing through a proxy page
as is required when using the XMLHttpRequest object (on which IO Utility
relies).</p>
