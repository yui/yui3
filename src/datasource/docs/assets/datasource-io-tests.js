YUI.add('datasource-io-tests', function(Y) {

    var suite = new Y.Test.Suite('datasource-io example test suite'),
        Assert = Y.Assert;

    var cleanStr = function(str) {
        return str.replace(/\s\s/g, ' ');
    }


    suite.add(new Y.Test.Case({
        name: 'Example tests',

        'test json': function() {
            Y.one('.example #demo_json').simulate('click');
            var interval = 10,
                timeout = 20000,
                output = Y.one('.example #demo_output_json'),
                condition = function() {
                    // Return a truthy/falsey result.
                    return (output.getHTML().indexOf('results') > -1);
                    // For example:
                    // return Y.one("#waitForMe") !== null
                },
            success = function() {
                var outputStr = output.getHTML();
                Assert.isTrue((outputStr.indexOf("{results =&gt; [{Title =&gt; Madonna}, {Title =&gt; Madonna - MySpace}, {Title =&gt; YouTube - madonna's Channel}, {Title =&gt; Madonna Music Profile on IMEEM}, {Title =&gt; Madonna | Music Artist | Videos, News, Photos &amp;amp; Ringtones | MTV}, {Title =&gt; Madonnalicious}, {Title =&gt; Madonna on MSN Music}, {Title =&gt; Madonna (I)}, {Title =&gt; Madonna Rehabilitation Hospital}, {Title =&gt; AbsoluteMadonna.com}], meta =&gt; {}}") > -1), ' - Failed to find "Yahoo! Weather for Sunnyvale, CA"');
            },
            failure = function() {
                Y.Assert.fail("Never succeeded in " + timeout + "ms");
            };

            // failure is optional. Will default to "wait() without resume()" error
            this.poll(condition, interval, timeout, success, failure);

        },
        'test xml': function() {
            Y.one('.example #demo_xml').simulate('click');
            var interval = 10,
                timeout = 20000,
                output = Y.one('.example #demo_output_xml'),
                condition = function() {
                    // Return a truthy/falsey result.
                    return (output.getHTML().indexOf('results') > -1);
                    // For example:
                    // return Y.one("#waitForMe") !== null
                },
            success = function() {
                var outputStr = output.getHTML();
//              alert(outputStr);
                Assert.isTrue((outputStr.indexOf("{results =&gt; [{title =&gt; &lt;b&gt;madonna&lt;/b&gt;.com home}, {title =&gt; &lt;b&gt;Madonna&lt;/b&gt; (Entertainer) - Wikipedia}, {title =&gt; &lt;b&gt;Madonna&lt;/b&gt; - MySpace}, {title =&gt; YouTube - &lt;b&gt;madonna's&lt;/b&gt; Channel}, {title =&gt; &lt;b&gt;Madonna&lt;/b&gt; Music Profile on IMEEM}, {title =&gt; &lt;b&gt;Madonna&lt;/b&gt; | Music Artist | Videos, News, Photos &amp;amp; Ringtones | MTV}, {title =&gt; Madonnalicious}, {title =&gt; &lt;b&gt;Madonna&lt;/b&gt; on MSN Music}, {title =&gt; All About &lt;b&gt;Madonna&lt;/b&gt;}, {title =&gt; &lt;b&gt;Madonna&lt;/b&gt; Rehabilitation Hospital}], meta =&gt; {}") > -1), ' - Failed to find expected output');
            },
            failure = function() {
                Y.Assert.fail("Never succeeded in " + timeout + "ms");
            };

            // failure is optional. Will default to "wait() without resume()" error
            this.poll(condition, interval, timeout, success, failure);

        }

}));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
