<p>
This example illustrates Connection Manager's built-in transaction timeout functionality.
</p>

<p>Click the "Create Two Transactions" button below.  Two requests will be made to a PHP script that is designed to respond slowly, waiting between 0 and 10 seconds to respond.  If the response takes longer than 5 seconds, the request will abort (resulting in a "transaction aborted" message).</p>