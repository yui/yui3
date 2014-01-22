YUI.add('datasource-api-mock', function (Y) {
    (Y.DataSource.Get || Y.DataSource.IO).prototype.sendRequest = function (e) {
        var response = {
            meta: {}
        };

        switch (e.request) {
            case 'davglass':
                response.results = [
                    {name: 'abstract-leveldown'},
                    {name: 'alloy-build'},
                    {name: 'ansispan'},
                    {name: 'async'},
                    {name: 'aws-sign'},
                    {name: 'bp-apache'},
                    {name: 'bp-jslint'},
                    {name: 'bp-pastebuffer'},
                    {name: 'bp-profiler'},
                    {name: 'bp-sreader'},
                    {name: 'browser-launcher'},
                    {name: 'builder'},
                    {name: 'checkip'},
                    {name: 'check_couchdb'},
                    {name: 'complete'},
                    {name: 'connect'},
                    {name: 'cookie-jar'},
                    {name: 'cpr'},
                    {name: 'createnpmpackage'},
                    {name: 'cssproc'},
                    {name: 'davargs'},
                    {name: 'davglass.github.com'},
                    {name: 'davlog'},
                    {name: 'dotvim'},
                    {name: 'echoecho'},
                    {name: 'everyauth'},
                    {name: 'everyjs.com'},
                    {name: 'express'},
                    {name: 'express-dust'},
                    {name: 'express-extras'}
                ];
                break;
            case 'lsmith':
                response.results = [
                    {name: 'a11y-css-highlight'},
                    {name: 'addBusinessDays'},
                    {name: 'article--javascript-this'},
                    {name: 'dotfiles'},
                    {name: 'dpsyntaxhighlightexample'},
                    {name: 'javascript-stack-trace'},
                    {name: 'jslint.vim'},
                    {name: 'JSON-test-suite'},
                    {name: 'lsmith.github.com'},
                    {name: 'node-jslint'},
                    {name: 'open-marriage'},
                    {name: 'promises-spec'},
                    {name: 'script2style'},
                    {name: 'taskspeed'},
                    {name: 'upstage'},
                    {name: 'YUI-3-Events-lightning-talk'},
                    {name: 'yui2'},
                    {name: 'yui2-examples'},
                    {name: 'yui3'},
                    {name: 'yui3-auto-delegate'},
                    {name: 'yui3-custom-events-lightning-talk'},
                    {name: 'yui3-eventx'},
                    {name: 'yui3-gallery'},
                    {name: 'YUI3-Introduction'},
                    {name: 'yui3-jsonp'},
                    {name: 'yui3-konami'},
                    {name: 'yui3-sugar'},
                    {name: 'yui3-torelativetime'},
                    {name: 'yui3-twitterfeed'},
                    {name: 'yuibot'}
                ];
                break;
            case 'rgrove':
                response.results = [
                    {name: 'cachetest'},
                    {name: 'cocktails_for_programmers'},
                    {name: 'combohandler'},
                    {name: 'crackup'},
                    {name: 'crass'},
                    {name: 'cssmin'},
                    {name: 'denyspam'},
                    {name: 'denyssh'},
                    {name: 'dotfiles'},
                    {name: 'emergencykitten'},
                    {name: 'express'},
                    {name: 'gollum'},
                    {name: 'handlebars.js'},
                    {name: 'javascript-yui3.tmbundle'},
                    {name: 'jetpants'},
                    {name: 'jquery-yui3-rosetta-stone'},
                    {name: 'jsbin'},
                    {name: 'jsconfus2014'},
                    {name: 'jsconsole'},
                    {name: 'jshint'},
                    {name: 'jslib-stats'},
                    {name: 'jsmin'},
                    {name: 'jsmin-php'},
                    {name: 'larch'},
                    {name: 'lazyload'},
                    {name: 'lectroid'},
                    {name: 'microjs.com'},
                    {name: 'node-elastical'},
                    {name: 'node-tokeninput'},
                    {name: 'pact'}
                ];
                break;
            case '?output=json':
                response = '{results =&gt; [{Title =&gt; Madonna}, {Title =&gt; Madonna - MySpace}, {Title =&gt; YouTube - madonna\'s Channel}, {Title =&gt; Madonna Music Profile on IMEEM}, {Title =&gt; Madonna | Music Artist | Videos, News, Photos &amp;amp; Ringtones | MTV}, {Title =&gt; Madonnalicious}, {Title =&gt; Madonna on MSN Music}, {Title =&gt; Madonna (I)}, {Title =&gt; Madonna Rehabilitation Hospital}, {Title =&gt; AbsoluteMadonna.com}], meta =&gt; {}}';
                break;
            case '?output=xml':
                response = '{results => [{title => <b>madonna</b>.com home}, {title => <b>Madonna</b> (Entertainer) - Wikipedia}, {title => <b>Madonna</b> - MySpace}, {title => YouTube - <b>madonna\'s</b> Channel}, {title => <b>Madonna</b> Music Profile on IMEEM}, {title => <b>Madonna</b> | Music Artist | Videos, News, Photos &amp; Ringtones | MTV}, {title => Madonnalicious}, {title => <b>Madonna</b> on MSN Music}, {title => All About <b>Madonna</b>}, {title => <b>Madonna</b> Rehabilitation Hospital}], meta => {}}';
                break;
            default:
                response.results = [
                    {name: 'Kansas'},
                    {name: 'Oklahoma'},
                    {name: 'Missouri'},
                    {name: 'Arkansas'},
                    {name: 'Iowa'},
                    {name: 'Nebraska'},
                    {name: 'Illinois'},
                    {name: 'Mississippi'},
                    {name: 'Texas'},
                    {name: 'Louisiana'},
                    {name: 'Kentucky'},
                    {name: 'Colorado'},
                    {name: 'South Dakota'},
                    {name: 'Indiana'},
                    {name: 'Tennessee'},
                    {name: 'Wisconsin'},
                    {name: 'Alabama'},
                    {name: 'New Mexico'},
                    {name: 'Minnesota'},
                    {name: 'Michigan'},
                    {name: 'Wyoming'},
                    {name: 'Ohio'},
                    {name: 'North Dakota'},
                    {name: 'Georgia'},
                    {name: 'West Virginia'},
                    {name: 'Virginia'},
                    {name: 'Utah'},
                    {name: 'North Carolina'},
                    {name: 'South Carolina'},
                    {name: 'Arizona'},
                    {name: 'Montana'},
                    {name: 'District of Columbia'},
                    {name: 'Pennsylvania'},
                    {name: 'Florida'},
                    {name: 'Maryland'},
                    {name: 'Delaware'},
                    {name: 'New York'},
                    {name: 'Idaho'},
                    {name: 'Nevada'},
                    {name: 'New Jersey'},
                    {name: 'California'},
                    {name: 'Connecticut'},
                    {name: 'Vermont'},
                    {name: 'Rhode Island'},
                    {name: 'Massachusetts'},
                    {name: 'New Hampshire'},
                    {name: 'Oregon'},
                    {name: 'Washington'},
                    {name: 'Maine'},
                    {name: 'Alaska'},
                    {name: 'Hawaii'}
                ];
        }

        e.callback.success({
            response: response
        });
    };
});
