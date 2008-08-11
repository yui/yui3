<h3>YUI CSS Grids' Nesting Grids</h3>

<p>By choosing a different class for the grid holder, child units divide space differently. This example shows all of the available Nesting Grids stacked in the same example.</p>

<h4>Basis Markup Structure</h4>

<textarea name="code" class="HTML" cols="60" rows="10">
...
<div class="yui-main">
   <div class="yui-b">
      <div class="yui-g">
         <div class="yui-u first"></div>
         <div class="yui-u"></div>
      </div>
   </div>
</div>
...
</textarea>

<h4>Available Nesting Grid Holders</h4>

<table class="auto">
	<thead>
		<tr class="odd">
			<th>Class</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>.yui-gb</code></td>
			<td>1/3 - 1/3 - 1/3</td>
		</tr>
		<tr class="odd">
			<td><code>.yui-gc</code></td>
			<td>2/3 - 1/3</td>
		</tr>
		<tr>
			<td><code>.yui-gd</code></td>
			<td>1/3 - 2/3</td>
		</tr>
		<tr class="odd">
			<td><code>.yui-ge</code></td>
			<td>3/4 - 1/4</td>
		</tr>
		<tr>
			<td><code>.yui-gf</code></td>
			<td>1/4 - 3/4</td>
		</tr>
	</tbody>
</table>

<h5>Note:</h5>

<p>Because CSS examples are susceptible to other CSS on the page, this example is only available in a new window at the above link.</p>