YUI.add('date-ko-tests', function(Y) {


    //Helper function to normalize timezone dependent hours.
    var getHours = function(date, pad, ampm) {
        pad = (pad === false) ? false : true;
        ampm = (ampm === false) ? false : true;
        var h = date.getHours();
        if (h > 12 & ampm) {
            h = (h - 12);
        }
        if (h === 0) {
            h = 12;
        }
        if (h < 10 & pad) {
            h = '0' + h;
        }
        return h;
    };

    var getMidday = function(date, lang) {

        var hour = date.getHours(),
            ampm = {
                "en-US": ["AM", "PM"],
                "fr-FR": ["AM", "PM"],
                "ko-KR": ["오전","오후"],
                "pa-IN": ["ਸਵੇਰੇ", "ਸ਼ਾਮ"]
            };

        return hour < 12 ? ampm[lang][0] : ampm[lang][1];
    };

    var xPad=function(x, pad, r) {
        if (typeof r === "undefined") {
            r = 10;
        }
        pad = pad + "";
        for (; parseInt(x, 10) < r && r > 1; r /= 10) {
            x = pad + x;
        }
        return x.toString();
    };

    // Set up the page
    var LANG = Y.Lang,
        ASSERT = Y.Assert,
        ARRAYASSERT = Y.ArrayAssert;

    var testParse = new Y.Test.Case({
        name: "Date Parse Tests",

        testUndefined: function() {
            var date = Y.Date.parse();
            ASSERT.isNull(date, "Expected null.");
        },

        testNull: function() {
            var date = Y.Date.parse(null);
            ASSERT.isTrue(LANG.isDate(date), "Expected date.");
        },

        testParse: function() {
            var date, parsed;

            date = new Date("December 17, 1995 03:24:00");
            parsed = Y.Date.parse("December 17, 1995 03:24:00");
            ASSERT.isTrue(LANG.isDate(parsed), "Parsing date string. Expected date.");
            ASSERT.areEqual(+date, +parsed, "Parsing date string. Dates should have matched.");

            date = new Date();
            parsed = Y.Date.parse(date);
            ASSERT.isTrue(LANG.isDate(parsed), "Parsing date object. Expected date.");
            ASSERT.areEqual(+date, +parsed, "Parsing date object. Dates should have matched.");

            date = new Date(819199440000);
            parsed = Y.Date.parse(819199440000);
            ASSERT.isTrue(LANG.isDate(parsed), "Parsing numeric timestamp. Expected date.");
            ASSERT.areEqual(+date, +parsed, "Parsing numeric timestamp. Dates should have matched.");

            parsed = Y.Date.parse('819199440000');
            ASSERT.isTrue(LANG.isDate(parsed), "Parsing string timestamp. Expected date.");
            ASSERT.areEqual(+date, +parsed, "Parsing string timestamp. Dates should have matched.");
        }
    });

    var testFormat = new Y.Test.Case({
        name: "Date Format Tests",

        testUndefined: function() {
            var output = Y.Date.format();
            ASSERT.areSame("", output, "Expected empty string.");
        },

        testNull: function() {
            var output = Y.Date.format(null);
            ASSERT.areSame("", output, "Expected empty string.");
        },

        testFormats: function() {
            var date = new Date(819199440000),
                YDate,
                output;

            //Must set this here because other tests are "resetting" the default lang.
            Y.Intl.setLang("datatype-date-format", "en-US");
            YDate = Y.Date;

            output = YDate.format(date);
            ASSERT.areSame("1995-12-17", output, "Expected default format (%F)");

            output = YDate.format(date, {format:"%D"});
            ASSERT.areSame("12/17/95", output, "Expected %D format.");

            output = YDate.format(date, {format:"%R"});
            ASSERT.areSame(getHours(date, true, false) + ":24", output, "Expected %R format.");

            output = YDate.format(date, {format:"%C"});
            ASSERT.areSame(19, parseInt(output, 10), 'Expected %C format.');

            output = YDate.format(date, {format:"%g"});
            ASSERT.areSame(95, parseInt(output, 10), 'Expected %g format.');

            output = YDate.format(date, {format:"%G"});
            ASSERT.areSame(1995, parseInt(output, 10), 'Expected %G format.');

            output = YDate.format(date, {format:"%j"});
            ASSERT.areSame(351, parseInt(output, 10), 'Expected %j format.');

            output = YDate.format(date, {format:"%l"});
            ASSERT.areSame(getHours(date, false), parseInt(output, 10), 'Expected %l format.');


            output = YDate.format(date, {format:"%s"});
            ASSERT.areSame(819199440, parseInt(output, 10), 'Expected %s format.');

            output = YDate.format(date, {format:"%u"});
            ASSERT.areSame(7, parseInt(output, 10), 'Expected %u format.');

            output = YDate.format(date, {format:"%U"});
            ASSERT.areSame(51, parseInt(output, 10), 'Expected %U format.');


            output = YDate.format(date, {format:"%V"});
            ASSERT.areSame(50, parseInt(output, 10), 'Expected %V format.');

            output = YDate.format(date, {format:"%W"});
            ASSERT.areSame(50, parseInt(output, 10), 'Expected %W format.');

            output = YDate.format(date, {format:"%Z"});
            var tz = date.toString().replace(/^.*:\d\d( GMT[+-]\d+)? \(?([A-Za-z ]+)\)?\d*$/, "$2").replace(/[a-z ]/g, "");
            if (tz.length > 4) {
                var o = date.getTimezoneOffset();
                var H = xPad(parseInt(Math.abs(o/60), 10), 0);
                var M = xPad(Math.abs(o%60), 0);
                tz = (o > 0 ? "-" : "+") + H + M;
            }
            ASSERT.areSame(tz, output, 'Expected %Z format.');

            output = YDate.format(date, {format:"%"});
            ASSERT.areSame('%', output, 'Expected % format.');

            output = YDate.format(date, {format:"%a %A"});
            ASSERT.areSame("Sun Sunday", output, "Expected %a %A format.");

            output = YDate.format(date, {format:"%b %B"});
            ASSERT.areSame("Dec December", output, "Expected %b %B format.");

            output = YDate.format(date, {format:"%r"});
            ASSERT.areSame(getHours(date) + ":24:00 " + getMidday(date, "en-US"), output, "Expected %r format.");

            output = YDate.format(date, {format:"%P"});
            ASSERT.areSame(getMidday(date, "en-US").toLowerCase(), output, 'Expected %P format.');

        }
    });

    var testFormatKR = new Y.Test.Case({
        name: "Date Format Korean Tests",

        testKorean: function() {
            if (!dateKR || curLang !== 'ko-KR') {
                return;
            }

            ASSERT.isNotNull(dateKR, "Expected Korean Date to be loaded.");

            var date = new Date("17 Dec 1995 00:24:00"),
                output;

            output = dateKR.format(date);
            ASSERT.areSame("1995-12-17", output, "Expected default format (%F).");

            output = dateKR.format(date, {format:"%a %A"});
            ASSERT.areSame("일 일요일", output, "Expected %a %A format.");

            output = dateKR.format(date, {format:"%b %B"});
            ASSERT.areSame("12월 12월", output, "Expected %b %B format.");

            output = dateKR.format(date, {format:"%x"});
            ASSERT.areSame("95. 12. 17.", output, "Expected %x format.");

            output = dateKR.format(date, {format:"%r"});
            ASSERT.areSame(getHours(date) + ":24:00 " + getMidday(date, "ko-KR"), output, "Expected %r format.");
        }
    });

    var testFormatIN = new Y.Test.Case({
        name: "Date Format Punjabi Tests",

        testPunjabi: function() {

            // provide data in Punjabi for India
            Y.Intl.add("datatype-date-format", "pa-IN", {
                    "a":["ਐਤ.","ਸੋਮ.","ਮੰਗਲ.","ਬੁਧ.","ਵੀਰ.","ਸ਼ੁਕਰ.","ਸ਼ਨੀ."],
                    "A":["ਐਤਵਾਰ","ਸੋਮਵਾਰ","ਮੰਗਲਵਾਰ","ਬੁਧਵਾਰ","ਵੀਰਵਾਰ","ਸ਼ੁੱਕਰਵਾਰ","ਸ਼ਨੀਚਰਵਾਰ"],
                    "b":["ਜਨਵਰੀ","ਫ਼ਰਵਰੀ","ਮਾਰਚ","ਅਪ੍ਰੈਲ","ਮਈ","ਜੂਨ","ਜੁਲਾਈ","ਅਗਸਤ","ਸਤੰਬਰ","ਅਕਤੂਬਰ","ਨਵੰਬਰ","ਦਸੰਬਰ"],
                    "B":["ਜਨਵਰੀ","ਫ਼ਰਵਰੀ","ਮਾਰਚ","ਅਪ੍ਰੈਲ","ਮਈ","ਜੂਨ","ਜੁਲਾਈ","ਅਗਸਤ","ਸਤੰਬਰ","ਅਕਤੂਬਰ","ਨਵੰਬਰ","ਦਸੰਬਰ"],
                    "c":"%a, %Y %b %d %l:%M:%S %p %Z",
                    "p":["ਸਵੇਰੇ","ਸ਼ਾਮ"],
                    "P":["ਸਵੇਰੇ","ਸ਼ਾਮ"],
                    "x":"%d/%m/%Y",
                    "X":"%l:%M:%S %p"
                });
            // switch to Punjabi
            Y.Intl.setLang("datatype-date-format", "pa-IN");

            var dateIN = Y.Date;

            ASSERT.isNotNull(dateIN, "Expected Punjabi Date to be loaded.");

            var date = new Date("17 Dec 1995 00:24:00"),
                output;

                date = new Date("17 Dec 1995 00:24:00");
            output = dateIN.format(date);
            ASSERT.areSame("1995-12-17", output, "Expected default format (%F).");

            output = dateIN.format(date, {format:"%a %A"});
            ASSERT.areSame("ਐਤ. ਐਤਵਾਰ", output, "Expected %a %A format.");

            output = dateIN.format(date, {format:"%b %B"});
            ASSERT.areSame("ਦਸੰਬਰ ਦਸੰਬਰ", output, "Expected %b %B format.");

            output = dateIN.format(date, {format:"%x"});
            ASSERT.areSame("17/12/1995", output, "Expected %x format.");

            output = dateIN.format(date, {format:"%r"});
            ASSERT.areSame(getHours(date) + ":24:00 " + getMidday(date, "pa-IN"), output, "Expected %r format.");
        }
    });

    var testParserWithFormat = new Y.Test.Case({
        testParsing: function () {

            var values = [
                ["01/02/2003","%d/%m/%Y", "1 Feb 2003"],
                ["1/2/3","%d/%m/%Y", "1 Feb 2003"],
                ["20030201","%Y%m%d", "1 Feb 2003"],
                ["1%2%3","%d%%%m%%%Y", "1 Feb 2003"],
                ["01/Mar/2003","%d/%b/%Y","1 Mar 2003"],
                ["01/March/2003","%d/%B/%Y","1 Mar 2003"],
                ["01 - 02 - 2003","%d - %m - %Y","1 Feb 2003"],
                ["01 - Mar - 2003","%d - %b - %Y","1 Mar 2003"],
                ["01 - March - 2003","%d - %B - %Y","1 Mar 2003"],
                ["01 - March - 2003","%d-%B-%Y","1 Mar 2003"],
                ["Sat, March 01, 2003", "%a, %B %d, %Y","1 Mar 2003"],
                ["Saturday, March 01, 2003", "%A, %B %d, %Y","1 Mar 2003"],
                /* Commenting out failing tests in IE due to inconsistancies in
                // returned date format. IE places the YEAR at the END
                [new Date(Date.UTC(2013, 2, 27, 17, 56, 13)).toString(),"%a %b %d %Y %T GMT%z", "27 Mar 2013 17:56:13 GMT+0000"],
                [new Date(Date.UTC(2013, 2, 27, 17, 56, 13)).toString(),"%a %b %d %Y %T %z", "27 Mar 2013 17:56:13 GMT+0000"],
                */
                ["2012-11-10 10:11:12 -0100", "%F %T %z", "10 Nov 2012 10:11:12 -0100"],
                ["2012-11-10 10:11:12 -01:00", "%F %T %z", "10 Nov 2012 10:11:12 -0100"],
                ["2012-11-10 10:11:12 Z", "%F %T %z", "10 Nov 2012 10:11:12 +0000"],
                ["2012-11-10 10:11:12 A", "%F %T %z", "10 Nov 2012 10:11:12 +0100"],
                ["2012-11-10 10:11:12 Y", "%F %T %z", "10 Nov 2012 10:11:12 -1200"],
                ["2012-11-10 10:11:12 N", "%F %T %z", "10 Nov 2012 10:11:12 -0100"],
                ["2012-11-10 10:11:12 M", "%F %T %z", "10 Nov 2012 10:11:12 +1200"],

                // Now I go for the whole alphabet one by one.
                // I'm enclosing in between parenthesis the part that I'm testing
                // the rest is filler

                ["(Mon) 01/02/2003", "(%a) %d/%m/%Y","1 Feb 2003 "],
                ["(Monday) 01/02/2003", "(%A) %d/%m/%Y","1 Feb 2003 "],
                ["1 (Jun) 2013", "%d (%b) %Y", "01 Jun  2013" ],
                ["01 (June) 2013", "%d (%B) %Y", "01 Jun  2013"],
                ["1 Jun (19) 98 ", "%d %b (%C) %y","01 Jun 1998" ],
                ["(Thu, Apr 04, 2013  4:03:31 PM CEST)","(%c)","04 Apr 2013  16:03:31 +0200"],
                ["(01/02/03)", "(%D)","2 Jan 2003" ],
                ["(10) 02 2002", "(%e)%m %Y", "10 Feb 2002" ],
                ["(2012-3-4)", "(%F)", "4 Mar 2012"],
                ["1 2 (12)", "%d %m (%g)","1 Feb 2012" ],
                ["1 2 (2012)", "%d %m (%G)","1 Feb 2012" ],
                ["1 (Jun) 2013", "%d (%h) %Y", "01 Jun  2013" ],
                ["(21)", "(%H)","31 Dec 1999 21:00:00" ],
                ["(10)", "(%I)","31 Dec 1999 10:00:00" ],
                ["(12)", "(%I)","31 Dec 1999 00:00:00" ],
                ["2012 (216)", "%Y(%j)","3 Aug 2012" ],
                ["(9)", "(%k)","31 Dec 1999 09:00:00" ],
                ["(9)", "(%l)","31 Dec 1999 09:00:00" ],
                ["(12)", "(%l)","31 Dec 1999 00:00:00" ],
                ["1(3)2000", "%d(%m)%Y","1 Mar 2000" ],
                ["(25)", "(%M)","31 Dec 1999 00:25:00" ],
                ["10(AM) ", "%H(%p)","31 Dec 1999 10:00:00" ],
                ["10(PM) ", "%H(%p)","31 Dec 1999 22:00:00" ],
                ["10(AM) ", "%H(%P)","31 Dec 1999 10:00:00" ],
                ["10(PM) ", "%H(%P)","31 Dec 1999 22:00:00" ],
                ["(15:30) ", "(%R)","31 Dec 1999 15:30:00" ],
                ["(949359600)", "(%s)",949359600000],
                ["(23)", "(%S)","31 Dec 1999 00:00:23" ],
                ["(12:30:40)", "(%T)","31 Dec 1999 12:30:40" ],
                ["- 1", "-%u","31 Dec 1999 00:00:00" ],
                ["- 2", "-%U","31 Dec 1999 00:00:00" ],
                ["- 3", "-%V","31 Dec 1999 00:00:00" ],
                ["- 4", "-%w","31 Dec 1999 00:00:00" ],
                ["- 5", "-%W","31 Dec 1999 00:00:00" ],
                ["(1/5/20)", "(%x)","5 Jan 2020" ],
                ["(1:30:00pm)", "(%X)","31 Dec 1999 13:30:00" ],

                ["(12:00:00pm)", "(%X)","31 Dec 1999 12:00:00" ],
                ["(12:00:00am)", "(%X)","31 Dec 1999 00:00:00" ],

                ["1 03(20)", "%d %m(%y)","1 mar 2020" ],
                ["1 03(2020)", "%d %m(%Y)","1 mar 2020" ],
                ["1 03 2012 (CEST)", "%d %m %Y (%Z)", "1 mar 2012 00:00:00 +0200"],
                ["1 03 2012 (PDT)", "%d %m %Y (%Z)", "1 mar 2012 00:00:00 -0700"]
            ];
            for (var i = 0; i < values.length; i++) {
                var v = values[i];
                ASSERT.areSame(
                    (new Date(v[2])).toString(),
                    (Y.Date.parse(v[0], v[1]) || new Date(0,0,0,0,0,0,0)).toString(),
                    v.join(' , ')
                );
            }
        },

        testCuttOffYear: function () {
            ASSERT.areSame(new Date(2000,0,1).toString(), Y.Date.parse("00-1-1", "%F").toString(),1);
            ASSERT.areSame(new Date(1940,0,1).toString(), Y.Date.parse("40-1-1", "%F").toString(),2);
            ASSERT.areSame(new Date(40,0,1).toString(), Y.Date.parse("40-1-1", "%F", null).toString(),3);
        },

        testParseErrors: function () {
            ASSERT.isNull(Y.Date.parse("12:60:10", "%T"),'1');
            ASSERT.isNull(Y.Date.parse("25:50:10", "%T"),'2');
            ASSERT.isNull(Y.Date.parse("2:50:70", "%T"),'3');
            ASSERT.isNull(Y.Date.parse("daturdy", "%A"),'4');
            ASSERT.isNull(Y.Date.parse("2003/03/01", "%F"),'5');
            ASSERT.isNull(Y.Date.parse("2003-Mar-01", "%F"),'6');
            ASSERT.isNull(Y.Date.parse("2012-11-10 10:11:12 J", "%F %T %z"),'7');
            ASSERT.isNull(Y.Date.parse("2012-11-10 10:11:12 Ñ", "%F %T %z"),'8');
            ASSERT.isNull(Y.Date.parse("2012-11-10 10:11:12 +lo:oo", "%F %T %z"),'9');
            ASSERT.isNull(Y.Date.parse("2012-11-10 10:11:12 +10:oo", "%F %T %z"),'10');
            ASSERT.isNull(Y.Date.parse("2012-11-10 10:11:12 XXX", "%F %T %Z"),'11');
            ASSERT.isNull(Y.Date.parse("xxxx", "%u"),'12');
            ASSERT.isNull(Y.Date.parse("xxxx", "%&"),'13');
        }
    });

    var testFormatAvailable = new Y.Test.Case({
        name: "Date Format Available Format Tests",

        testAvailable: function() {

            var available = Y.Intl.getAvailableLangs("datatype-date-format");

            ASSERT.isArray(available, "Expected getAvailableLangs to return array.");
            Y.assert(available.length > 30, "Expected at least 30 available languages.");
            Y.assert(Y.Array.indexOf(available, "ar-JO") >= 0, "Expected ar-JO to be available.");
            Y.assert(Y.Array.indexOf(available, "de-DE") >= 0, "Expected de-DE to be available.");
            Y.assert(Y.Array.indexOf(available, "en-US") >= 0, "Expected en-US to be available.");
            Y.assert(Y.Array.indexOf(available, "th-TH") >= 0, "Expected th-TH to be available.");
            Y.assert(Y.Array.indexOf(available, "zh-Hant-TW") >= 0, "Expected zh-Hant-TW to be available.");

        }
    });

    var testFormatSimple = new Y.Test.Case({
        name: "Test second argument as string",

        testFormatString: function() {
            ASSERT.areSame(Y.Date.format("2012-03-01 11:12:13",{format: "%F %T"}), Y.Date.format("2012-03-01 11:12:13", "%F %T"));

        }
    });

    var suite = new Y.Test.Suite("Date");
    suite.add(testParse);
    suite.add(testFormatKR);
    suite.add(testFormatIN);
    suite.add(testFormatAvailable);
    suite.add(testFormat);
    suite.add(testParserWithFormat);
    suite.add(testFormatSimple);

    Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['datatype-date', 'test']});
