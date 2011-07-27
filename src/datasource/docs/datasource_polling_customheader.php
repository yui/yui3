<style scoped>
/* custom styles for this example */
#demo .output {margin-bottom:1em; padding:10px; border:1px solid #D9D9D9;}
</style>

<div class="intro">
    <p>DataSource's Pollable extension enables polling functionality on all your DataSource instances.</p>
</div>

<div class="example">
    {{>datasource-polling-source}}
</div>

<p>Include the `datasource-pollable` extension in your `Y.use()` statement to add the `setInterval()`, `clearInterval()`, and `clearAllInterval()` methods to all your DataSource instances.</p>

```
YUI().use("datasource-function", "datasource-polling", function(Y) {
});
```