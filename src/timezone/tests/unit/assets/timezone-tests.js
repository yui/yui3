YUI.add('timezone-tests', function(Y) {
    var timeZoneTests = new Y.Test.Case({
    
        name : "TimeZone Tests",
        
        setUp : function () {
            this.tZone = new Y.TimeZone("Asia/Kolkata");
        },
        
        //---------------------------------------------------------------------
        // Test methods
        //---------------------------------------------------------------------
        
        "Test conversion between Incremental UTC, RFC3339 Format and SQL Format" : function () {
            var rfc3339 = "2012-5-29T15:23:00+5:30";
            var sql = "2012-05-29 15:23:00";
                        
            var uTime1 = this.tZone.convertToIncrementalUTC(rfc3339);    //Get UTC Seconds
            var uTime2 = this.tZone.convertToIncrementalUTC(sql);
                    
            var Assert = Y.Assert;
                        
            //Verify that both rfc3339 and sql represent the same date
            Assert.areEqual(uTime1, uTime2, "Both rfc3339 and sql here represent the same date, hence UTC time obtained should be equal.");
                        
            //Convert uTime back to rfc3339 and SQL Format and verify result.
            Assert.areEqual("2012-05-29T15:23:00+05:30", this.tZone.convertUTCToRFC3339Format(uTime1), "RFC3339 obtained is different");
            Assert.areEqual("2012-05-29 15:23:00", this.tZone.convertUTCToSQLFormat(uTime2), "SQL Date obtained is different");
        },        
        
        testGetCurrentTimeZoneIds : function () {
            var tzIdsFor330 = Y.TimeZone.getCurrentTimezoneIds(330*60);
            var tzIdsFor330Set = {};    //Convert array to set to check existence of each expected value
            for(var i=0; i<tzIdsFor330.length; i++) {
                tzIdsFor330Set[tzIdsFor330[i]] = true;
            }
                        
            var Assert = Y.Assert;
                        
            //Verify that all the expected time zones were returned
            Assert.isNotNull(tzIdsFor330Set["Asia/Kolkata"], "Asia/Kolkata not found");
            Assert.isNotNull(tzIdsFor330Set["Asia/Calcutta"], "Asia/Calcutta not found");
            Assert.isNotNull(tzIdsFor330Set["Asia/Colombo"], "Asia/Colombo not found");
                        
            //Verify that only the expected time zones were returned
            Assert.areEqual(3, tzIdsFor330.length, "More timezones than expected returned");
        },
        
        testGetRawOffset : function () {
            Y.Assert.areEqual(330, this.tZone.getRawOffset()/60, "Got wrong offset");
        },
                    
        testGetTimeZoneIdForOffset: function() {
            var tzIdFor330 = Y.TimeZone.getTimezoneIdForOffset(330*60);
            Y.assert(tzIdFor330 == "Asia/Kolkata" || tzIdFor330 == "Asia/Colombo", "Did not get expected time zone id for offset 330");
        },
                    
        "Test conversion between WallTime and UnixTime": function() {
            var now = new Date();
            var wallTime = this.tZone.getWallTimeFromUnixTime(now.getTime()/1000);
            var unixTime = Y.TimeZone.getUnixTimeFromWallTime(wallTime);
            var expectedUnixTime = ~~(now.getTime()/1000);
            Y.Assert.areEqual(expectedUnixTime, unixTime);
        },
                    
        testIsValidTimeZoneId: function() {
            var Assert = Y.Assert;
            Assert.isFalse(Y.TimeZone.isValidTimezoneId("abc"), "abc is not a valid timezone");
            Assert.isTrue(Y.TimeZone.isValidTimezoneId("Asia/Kolkata"), "Asia/Kolkata is a valid timezone");
            Assert.isTrue(Y.TimeZone.isValidTimezoneId("Asia/Calcutta"), "Asia/Calcutta is a valid timezone");
        },
                    
        testGetNormalizedTimezoneId: function() {
            var Assert = Y.Assert;
            Assert.areEqual("", Y.TimeZone.getNormalizedTimezoneId("abc"), "abc is not a valid timezone");
            Assert.areEqual("Asia/Kolkata", Y.TimeZone.getNormalizedTimezoneId("Asia/Kolkata"), "Asia/Kolkata is not a valid timezone");
            Assert.areEqual("Asia/Kolkata", Y.TimeZone.getNormalizedTimezoneId("Asia/Calcutta"), "Asia/Kolkata is the normalized form of Asia/Calcutta");
        },
                    
        testIsValidTimestamp: function() {
            var Assert = Y.Assert;
                        
            Assert.isTrue(Y.TimeZone.isValidTimestamp("2012-05-29T15:23:00+05:30", (5*60+30)*60), "2012-05-29T15:23:00+05:30 is a valid timeStamp");
            Assert.isTrue(Y.TimeZone.isValidTimestamp("2012-05-29 15:23:00", (5*60+30)*60), "2012-05-29 15:23:00 is a valid timeStamp");
                        
            Assert.isFalse(Y.TimeZone.isValidTimestamp("2012-05-29 15:23:00+05:30", (5*60+30)*60), "2012-05-29 15:23:00+05:30 is not a valid timeStamp");
            Assert.isFalse(Y.TimeZone.isValidTimestamp("2012-05-29T15:23:00", (5*60+30)*60), "2012-05-29T15:23:00 is not a valid timeStamp");
            Assert.isFalse(Y.TimeZone.isValidTimestamp("2012-05-29T15:23:00+05:30", (5*60)*60), "2012-05-29 15:23:00+05:30 is not a valid timeStamp");
        }
    
    });
    
    Y.Test.Runner.add(timeZoneTests);
});
