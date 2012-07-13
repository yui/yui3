YUI.add('jsonp-gallery-tests', function(Y) {

    var Assert = Y.Assert,
        suite = new Y.Test.Suite('jsonp-gallery');

    suite.add(new Y.Test.Case({
        name: 'jsonp-gallery',
        setUp: function() {
            this.getTitle = function() {
                var html,
                    header = Y.one('#out h4 a');
                if (header) {
                    html = header.get('innerHTML');
                }
                return html;
            };

            this.fail = function() {
                Assert.fail('Polling failed');
            };

            this.counter = 0;

            this.start = Y.one('#start');
            this.stop = Y.one('#stop');

            this.myPoll = function() {
                this.poll(this.getTitle, 100, 10000, function() {
                    var html = this.getTitle();
                    if (html !== this.lastTitle) {
                        this.counter++;
                        Assert.areNotEqual(html, this.lastTitle);
                        this.lastTitle = html;
                    }
                    if (this.counter < 3) {
                        this.myPoll();
                        return;
                    }

                    this.stop.simulate('click');
                }, this.fail);
            };
        },
        'is rendered': function() {
            Assert.isNotNull(Y.one('#out'));
            Assert.isNotNull(Y.one('#start'));
            Assert.isNotNull(Y.one('#stop'));
        },
        'start polling': function() {
            Y.one('#out').set('innerHTML', '');
            Assert.isUndefined(this.getTitle());
            this.start.simulate('click');

            this.myPoll();
        },
        'polling should be stopped': function() {
            var title = this.getTitle();
            Assert.areEqual(title, this.lastTitle);
            this.wait(function() {
                //Wait longer than the example poll and check again to see if it has changed
                Assert.areEqual(title, this.lastTitle);
            }, 9000);
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: ['node-event-simulate'] });
