<h3 id="start">Getting Started</h3>

<h4 id="dependencies">Include Dependencies</h4>

<p>The easiest way to include the source files for <?php echo $componentShort; ?> and its dependencies 
is to add the YUI seed file to your page, using the following script tag, and 
allow the YUI instance to download any additional files which may be required:</p>

<textarea name="code" class="HTML" cols="60" rows="1">
&lt;!-- YUI Seed --&gt;
&lt;script src=&quot;http://yui.yahooapis.com/<?php echo($yuiCurrentVersion);?>/build/yui/yui-min.js&quot; type="text/javascript"&gt;&lt;/script&gt;
</textarea>

<p>The YUI instance will automatically pull down <?php echo $componentShort; ?>'s source files, along 
with any dependent files missing from the page, when the <code><?php echo $section; ?></code> 
module is used in your code. This helps you avoid having to manually manage the 
list of files which needs to be included on your page to support multiple components  
while also optimizing your initial page weight by loading files only when they are 
required.</p>

<p>If you do want to include file dependencies manually on your page, the <a href="/3/configurator/">YUI Dependency Configurator</a> can be used to determine the list of files you need 
to include in order to use <?php echo $componentShort; ?>.</p>

<h4 id="yui">The YUI Instance</h4>

<p>Once you have the YUI seed file on your page (<code>yui-min.js</code>), you can 
create a new YUI instance for your application to use and populate it
with the modules you need, specified as the first set of arguments to the 
<code>use</code> method:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
    // Create new YUI instance, and populate it with the required modules
    YUI().use("<?php echo join("\", \"", $requiredModules); ?>", function(Y) {

        // <?php echo $componentShort; ?> available, and ready for use.

    });
</textarea>

<p>The last argument passed to <code>use</code> is a callback function. The callback function will be invoked as soon as the YUI instance is done downloading any required files missing from your page.  Once those files are loaded, your local YUI instance will be supplemented with the classes which make up the <code><?php echo $section; ?></code> module and any modules it depends on. A reference to the populated YUI instance (<code>Y</code>) is passed back to your callback function. Within your callback, then, you can start writing your application code based on your own custom instance of <code>YUI</code>.</p>

<p>For more information on creating instances of YUI and the 
<a href="../yui/index.html#use"><code>use</code> method</a>, see the 
<a href="../yui/index.html">YUI Global</a> object documentation.</p>
