YUI.add('cookie-tests', function(Y) {

    var Assert          = Y.Assert,
        ObjectAssert    = Y.ObjectAssert;
    
    //utility function
    function deleteCookie(name, detail){
        this.stubDoc.cookie = name + "=blah; " + (detail || "") + " expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    
    function setCookie(name, value){
        this.stubDoc.cookie = (name) + "=" + (value);
    }
    
    //-------------------------------------------------------------------------
    // Base Test Suite
    //-------------------------------------------------------------------------
    
    var suite = new Y.Test.Suite("Cookie Tests");
    
    //-------------------------------------------------------------------------
    // Test Case for parsing capabilities
    //-------------------------------------------------------------------------
    
    suite.add(new Y.Test.Case({
    
        name : "Cookie Parsing Tests",

        //---------------------------------------------------------------------
        // Tests
        //---------------------------------------------------------------------
    
        testParseCookieStringEmpty : function(){
            var cookies = Y.Cookie._parseCookieString("");
        },
        
        testParseCookieStringNull : function(){
            var cookies = Y.Cookie._parseCookieString(null);
        },
        
        testParseCookieStringBoolean : function(){
            var cookies = Y.Cookie._parseCookieString(true);
        },
        
        testParseCookieStringBoolean : function(){
            var cookies = Y.Cookie._parseCookieString(true);
        },
        
        testParseCookieStringUndefined : function(){
            var cookies = Y.Cookie._parseCookieString();
        },
        
        testParseCookieStringInvalid : function(){
            var cookies = Y.Cookie._parseCookieString("a");
        },
        
        testParseCookieStringSimple : function(){
        
            var cookieString = "a=b";
            var cookies = Y.Cookie._parseCookieString(cookieString);
            
            ObjectAssert.hasKey("a", cookies, "Cookie 'a' is missing.");
            
            Assert.areEqual("b", cookies.a, "Cookie 'a' should have value 'b'.");        
        },
        
        testParseCookieStringNumber : function(){
        
            var cookieString = "12345=b";
            var cookies = Y.Cookie._parseCookieString(cookieString);
            
            ObjectAssert.hasKey("12345", cookies, "Cookie '12345' is missing.");
            
            Assert.areEqual("b", cookies["12345"], "Cookie '12345' should have value 'b'.");        
        },
        
        testParseCookieStringSimpleMulti : function(){
        
            var cookieString = "a=b; c=d; e=f; g=h";
            var cookies = Y.Cookie._parseCookieString(cookieString);
            
            ObjectAssert.hasKey("a", cookies, "Cookie 'a' is missing.");
            ObjectAssert.hasKey("c", cookies, "Cookie 'c' is missing.");
            ObjectAssert.hasKey("e", cookies, "Cookie 'e' is missing.");
            ObjectAssert.hasKey("g", cookies, "Cookie 'g' is missing.");
            
            Assert.areEqual("b", cookies.a, "Cookie 'a' should have value 'b'.");
            Assert.areEqual("d", cookies.c, "Cookie 'c' should have value 'd'.");
            Assert.areEqual("f", cookies.e, "Cookie 'e' should have value 'f'.");
            Assert.areEqual("h", cookies.g, "Cookie 'g' should have value 'h'.");
        
        },
        
        testParseCookieStringComplex : function(){
        
            var cookieString = "name=Nicholas%20Zakas; title=front%20end%20engineer";
            var cookies = Y.Cookie._parseCookieString(cookieString);
            
            ObjectAssert.hasKey("name", cookies, "Cookie 'name' is missing.");
            ObjectAssert.hasKey("title", cookies, "Cookie 'title' is missing.");
            
            Assert.areEqual("Nicholas Zakas", cookies.name, "Cookie 'name' should have value 'Nicholas Zakas'.");
            Assert.areEqual("front end engineer", cookies.title, "Cookie 'title' should have value 'front end engineer'.");
        },
        
        testParseCookieStringNetwork : function(){
            var cookieString = "B=2nk0a3t3lj7cr&b=3&s=13; LYC=l_v=2&l_lv=10&l_l=94ddoa70d&l_s=qz54t4qwrsqquyv51w0z4xxwtx31x1t0&l_lid=146p1u6&l_r=4q&l_lc=0_0_0_0_0&l_mpr=50_0_0&l_um=0_0_1_0_0;YMRAD=1215072198*0_0_7318647_1_0_40123839_1; l%5FPD3=840";
            var cookies = Y.Cookie._parseCookieString(cookieString);
            
            ObjectAssert.hasKey("B", cookies, "Cookie 'B' is missing.");
            ObjectAssert.hasKey("LYC", cookies, "Cookie 'LYC' is missing.");
            ObjectAssert.hasKey("l_PD3", cookies, "Cookie 'l_PD3' is missing.");                       
        },
        
        testParseCookieStringWithEscapedCharactersInCookieName: function(){
            var cookieName = "something[1]";
            var cookieValue = "123";
            var cookieString = encodeURIComponent(cookieName) + "=" + encodeURIComponent(cookieValue);
            var cookies = Y.Cookie._parseCookieString(cookieString);
            
            ObjectAssert.hasKey(cookieName, cookies, "Cookie '" + cookieName + "' is missing.");
            Assert.areEqual(cookieValue, cookies[cookieName], "Cookie value for '" + cookieName + "' is wrong.");
        },
        
        testParseCookieStringIncorrectFormat: function(){
            var cookieString = "SESSION=27bedbdf3d35252d0db07f34d81dcca6; STATS=OK; SCREEN=1280x1024; undefined; ys-bottom-preview=o%3Aheight%3Dn%253A389";
            var cookies = Y.Cookie._parseCookieString(cookieString);
            
            ObjectAssert.hasKey("SCREEN", cookies, "Cookie 'SCREEN' is missing.");
            ObjectAssert.hasKey("STATS", cookies, "Cookie 'STATS' is missing.");
            ObjectAssert.hasKey("SESSION", cookies, "Cookie 'SESSION' is missing.");
            ObjectAssert.hasKey("ys-bottom-preview", cookies, "Cookie 'ys-bottom-preview' is missing.");
            ObjectAssert.hasKey("undefined", cookies, "Cookie 'undefined' is missing.");
        },
        
        /*
         * Tests that the cookie utility deals with cookies that contain
         * an invalid encoding. It shouldn't error, but should treat the cookie
         * as if it doesn't exist (return null).
         */
        testParseCookieStringInvalidEncoding: function(){
            var cookieString = "DetailInfoList=CPN03022194=@|@=CPN03#|#%B4%EB%C3%B5%C7%D8%BC%F6%BF%E5%C0%E5#|#1016026000#|#%BD%C5%C8%E6%B5%BF#|##|#";
            var cookies = Y.Cookie._parseCookieString(cookieString);
            
            Assert.isNull(cookies["DetailInfoList"], "Cookie 'DetailInfoList' should not have a value.");
        },
        
        /*
         * Tests that a Boolean cookie, one without an equals sign of value,
         * is represented as an empty string.
         */
        testParseCookieStringBooleanCookie: function(){
            var cookieString = "info";
            var cookies = Y.Cookie._parseCookieString(cookieString);
            
            Assert.areEqual("", cookies["info"], "Cookie 'info' should be an empty string.");
        },
        
        testParseCookieStringWithHash : function(){
        
            var cookieString = "name=Nicholas%20Zakas; hash=a=b&c=d&e=f&g=h; title=front%20end%20engineer";
            var cookies = Y.Cookie._parseCookieString(cookieString);
            
            ObjectAssert.hasKey("name", cookies, "Cookie 'name' is missing.");
            ObjectAssert.hasKey("hash", cookies, "Cookie 'hash' is missing.");
            ObjectAssert.hasKey("title", cookies, "Cookie 'title' is missing.");
            
            Assert.areEqual("Nicholas Zakas", cookies.name, "Cookie 'name' should have value 'Nicholas Zakas'.");
            Assert.areEqual("a=b&c=d&e=f&g=h", cookies.hash, "Cookie 'hash' should have value 'a=b&c=d&e=f&g=h'.");
            Assert.areEqual("front end engineer", cookies.title, "Cookie 'title' should have value 'front end engineer'.");
        },
        
        testParseCookieHash : function () {
        
            var cookieHash = "a=b&c=d&e=f&g=h";
            var hash = Y.Cookie._parseCookieHash(cookieHash);
            
            ObjectAssert.hasKey("a", hash, "Hash 'a' is missing.");
            ObjectAssert.hasKey("c", hash, "Hash 'c' is missing.");
            ObjectAssert.hasKey("e", hash, "Hash 'e' is missing.");
            ObjectAssert.hasKey("g", hash, "Hash 'g' is missing.");
            
            Assert.areEqual("b", hash.a, "Hash 'a' should have value 'b'.");
            Assert.areEqual("d", hash.c, "Hash 'c' should have value 'd'.");
            Assert.areEqual("f", hash.e, "Hash 'e' should have value 'f'.");
            Assert.areEqual("h", hash.g, "Hash 'g' should have value 'h'.");                    
        },
        
        testParseCookieHashComplex : function () {
            var cookieName = "something[1]";
            var cookieValue = "123";        
            var cookieHash = encodeURIComponent(cookieName) + "=" + encodeURIComponent(cookieValue);
            var hash = Y.Cookie._parseCookieHash(cookieHash);
            
            ObjectAssert.hasKey(cookieName, hash, "Hash 'something[1]' is missing.");
            
            Assert.areEqual(cookieValue, hash[cookieName], "Hash 'a' should have value 'b'.");
                    
        },
        
        testParseCookieHashEmpty: function(){
            var hash = Y.Cookie._parseCookieHash("");
            
            Assert.isFalse("" in hash, "Hash shouldn't have an empty string property.");
        
        }
        
        
    }));

    //-------------------------------------------------------------------------
    // Test Case for string formatting capabilities
    //-------------------------------------------------------------------------
    
    suite.add(new Y.Test.Case({
    
        name : "Cookie String Creation Tests",

        //---------------------------------------------------------------------
        // Tests
        //---------------------------------------------------------------------
    
        testCreateCookieStringSimple : function(){        
            var text = Y.Cookie._createCookieString("name", "value", true);
            Assert.areEqual("name=value", text, "Cookie string is incorrect.");
        },
        
        testCreateCookieStringSimpleWithPath : function(){        
            var text = Y.Cookie._createCookieString("name", "value", true, { path: "/" });
            Assert.areEqual("name=value; path=/", text, "Cookie string is incorrect.");
        },
        
        testCreateCookieStringSimpleWithInvalidPath1 : function(){        
            var text = Y.Cookie._createCookieString("name", "value", true, { path: 25 });
            Assert.areEqual("name=value", text, "Cookie string is incorrect.");
        },
        
        testCreateCookieStringSimpleWithInvalidPath2 : function(){        
            var text = Y.Cookie._createCookieString("name", "value", true, { path: "" });
            Assert.areEqual("name=value", text, "Cookie string is incorrect.");
        },
        
        testCreateCookieStringSimpleWithDomain : function(){        
            var text = Y.Cookie._createCookieString("name", "value", true, { domain: "yahoo.com" });
            Assert.areEqual("name=value; domain=yahoo.com", text, "Cookie string is incorrect.");
        },
        
        testCreateCookieStringSimpleWithInvalidDomain1 : function(){        
            var text = Y.Cookie._createCookieString("name", "value", true, { domain: true });
            Assert.areEqual("name=value", text, "Cookie string is incorrect.");
        },
        
        testCreateCookieStringSimpleWithInvalidDomain2 : function(){        
            var text = Y.Cookie._createCookieString("name", "value", true, { domain: "" });
            Assert.areEqual("name=value", text, "Cookie string is incorrect.");
        },
        
        testCreateCookieStringSimpleWithSecure : function(){        
            var text = Y.Cookie._createCookieString("name", "value", true, { secure: true });
            Assert.areEqual("name=value; secure", text, "Cookie string is incorrect.");
        },
        
        testCreateCookieStringSimpleWithInvalidSecure1 : function(){        
            var text = Y.Cookie._createCookieString("name", "value", true, { secure: false });
            Assert.areEqual("name=value", text, "Cookie string is incorrect.");
        },
        
        testCreateCookieStringSimpleWithInvalidSecure2 : function(){        
            var text = Y.Cookie._createCookieString("name", "value", true, { secure: "blah" });
            Assert.areEqual("name=value", text, "Cookie string is incorrect.");
        },
        
        testCreateCookieStringSimpleWithExpiry : function(){
            var expires = new Date("Wed, 01 Jan 2070 00:00:00 GMT");
            var text = Y.Cookie._createCookieString("name", "value", true, { expires: expires });
            Assert.areEqual("name=value; expires=" + expires.toUTCString(), text, "Cookie string is incorrect.");
        },

        testCreateCookieStringSimpleWithInvalidExpiry : function(){
            var text = Y.Cookie._createCookieString("name", "value", true, { expires: "blah" });
            Assert.areEqual("name=value", text, "Cookie string is incorrect.");
        },

        testCreateCookieStringSimpleWithAll : function(){
            var expires = new Date("Wed, 01 Jan 2070 00:00:00 GMT");
            var text = Y.Cookie._createCookieString("name", "value", true, { expires: expires, domain : "yahoo.com", path: "/", secure: true });
            Assert.areEqual("name=value; expires=" + expires.toUTCString() + "; path=/; domain=yahoo.com; secure", text, "Cookie string is incorrect.");
        },

        testCreateCookieStringComplex : function(){            
            var name = "c.f name";
            var value = "as.bd ed|ieh,~!!@#$%^*=098345|}{<>?";
            var text = Y.Cookie._createCookieString(name, value, true);
            Assert.areEqual(encodeURIComponent(name) + "=" + encodeURIComponent(value), text, "Cookie string is incorrect.");
        },
        
        testCreateCookieStringComplexWithPath : function(){
            var name = "c.f name";
            var value = "as.bd ed|ieh,~!!@#$%^*=098345|}{<>?";
            var text = Y.Cookie._createCookieString(name, value, true, { path : "/" });
            Assert.areEqual(encodeURIComponent(name) + "=" + encodeURIComponent(value) + "; path=/", text, "Cookie string is incorrect.");
        },
        
        testCreateCookieStringComplexWithDomain : function(){
            var name = "c.f name";
            var value = "as.bd ed|ieh,~!!@#$%^*=098345|}{<>?";
            var text = Y.Cookie._createCookieString(name, value, true, { domain: "yahoo.com" });
            Assert.areEqual(encodeURIComponent(name) + "=" + encodeURIComponent(value) + "; domain=yahoo.com", text, "Cookie string is incorrect.");
        },
        
        testCreateCookieStringComplexWithSecure : function(){
            var name = "c.f name";
            var value = "as.bd ed|ieh,~!!@#$%^*=098345|}{<>?";
            var text = Y.Cookie._createCookieString(name, value, true, { secure: true });
            Assert.areEqual(encodeURIComponent(name) + "=" + encodeURIComponent(value) + "; secure", text, "Cookie string is incorrect.");
        },
        
        testCreateCookieStringComplexWithExpiry : function(){
            var name = "c.f name";
            var value = "as.bd ed|ieh,~!!@#$%^*=098345|}{<>?";
            var expires = new Date("Wed, 01 Jan 2070 00:00:00 GMT");
            var text = Y.Cookie._createCookieString(name, value, true, { expires : expires });
            Assert.areEqual(encodeURIComponent(name) + "=" + encodeURIComponent(value) + "; expires=" + expires.toUTCString(), text, "Cookie string is incorrect.");
        },
        
        testCreateCookieStringComplexWithAll : function(){
            var name = "c.f name";
            var value = "as.bd ed|ieh,~!!@#$%^*=098345|}{<>?";
            var expires = new Date("Wed, 01 Jan 2070 00:00:00 GMT");
            var text = Y.Cookie._createCookieString(name, value, true, { expires: expires, domain : "yahoo.com", path: "/", secure: true });
            Assert.areEqual(encodeURIComponent(name) + "=" + encodeURIComponent(value) + "; expires=" + expires.toUTCString() + "; path=/; domain=yahoo.com; secure", text, "Cookie string is incorrect.");
        },
        
        testCreateCookieHashString1 : function (){
        
            var hash = {
                name: "Nicholas Zakas",
                title: "Front End Engineer",
                "something else" : "hiya"
            };
            
            var text = Y.Cookie._createCookieHashString(hash);
            Assert.areEqual("name=Nicholas%20Zakas&title=Front%20End%20Engineer&something%20else=hiya", text, "Cookie hash string is incorrect.");        
        },
        
        testCreateCookieHashString2 : function (){
        
            var hash = {
                name: "Nicholas Zakas"
            };
            
            var text = Y.Cookie._createCookieHashString(hash);
            Assert.areEqual("name=Nicholas%20Zakas", text, "Cookie hash string is incorrect.");        
        }
        
    }));
        
    //-------------------------------------------------------------------------
    // Test Case for getting cookies
    //-------------------------------------------------------------------------
    
    suite.add(new Y.Test.Case({
    
        name : "Get Cookie Tests",
        
        _should : {
        
            error : {
            
                testGetInvalidName1 : new TypeError("Cookie name must be a non-empty string."),
                testGetInvalidName2 : new TypeError("Cookie name must be a non-empty string."),
                testGetInvalidName3 : new TypeError("Cookie name must be a non-empty string."),
                testGetInvalidName4 : new TypeError("Cookie name must be a non-empty string."),
                testGetInvalidName5 : new TypeError("Cookie name must be a non-empty string.")
            }
        
        },
        
        setUp: function(){
            this.stubDoc = {cookie:""};
            Y.Cookie._setDoc(this.stubDoc);
        },
        
        
        tearDown: function(){
            Y.Cookie._setDoc(Y.config.doc);
            delete this.stubDoc;
        },

        //---------------------------------------------------------------------
        // Tests
        //---------------------------------------------------------------------
    
        testGetSimple : function(){
        
            this.stubDoc.cookie = "name=Nicholas%20Zakas";
            
            var value = Y.Cookie.get("name");
            Assert.areEqual("Nicholas Zakas", value, "Retrieved cookie value is incorrect.");                
        },
        
        testGetUnknown : function(){
        
            this.stubDoc.cookie = "name=Nicholas%20Zakas";
            
            var value = Y.Cookie.get("name2");
            Assert.isNull(value, "Retrieved cookie value is should be null.");
        },
        
        testGetComplex : function(){
        
            this.stubDoc.cookie = "name=Nicholas%20Zakas; title=Front%20End%20Engineer; component=Cookie%20Utility";
            
            var value1 = Y.Cookie.get("name");
            var value2 = Y.Cookie.get("title");
            var value3 = Y.Cookie.get("component");
            var value4 = Y.Cookie.get("nonexistent");
            
            Assert.areEqual("Nicholas Zakas", value1, "Retrieved cookie value is incorrect.");
            Assert.areEqual("Front End Engineer", value2, "Retrieved cookie value is incorrect.");
            Assert.areEqual("Cookie Utility", value3, "Retrieved cookie value is incorrect.");
            Assert.isNull(value4, "Retrieved cookie value should be null.");
        },

        testGetInDefaultOrder: function(){
            this.stubDoc.cookie = "pathOfCookie=/test/supage; pathOfCookie=/test";
            
            var data = Y.Cookie.get("pathOfCookie");
            Assert.areEqual("/test", data, "Cookie of path /test should be loaded");
        },

        testGetInReverseOrder: function() {
            this.stubDoc.cookie = "pathOfCookie=/test/subpage; pathOfCookie=/test";

            var data = Y.Cookie.get("pathOfCookie", {reverseCookieLoading: true});
            Assert.areEqual("/test/subpage", data, "Cookie of path /test/subpage should be loaded");
        },
        
        testGetInvalidName1 : function(){        
            Y.Cookie.get(12);        
        },
        
        testGetInvalidName2 : function(){        
            Y.Cookie.get(true);        
        },
        
        testGetInvalidName3 : function(){        
            Y.Cookie.get("");        
        },
        
        testGetInvalidName4 : function(){        
            Y.Cookie.get();        
        },

        testGetInvalidName5 : function(){        
            Y.Cookie.get(null);        
        },
        
        testGetWithBooleanConverter : function(){
            this.stubDoc.cookie = "found=true";
            
            var value = Y.Cookie.get("found", Boolean);
            Assert.isBoolean(value, "Retrieved value should be a boolean.");
            Assert.isTrue(value, "Retrieved cookie value should be true.");
        
        },
        
        testGetWithNumberConverter : function(){
            this.stubDoc.cookie = "count=11";
            
            var value = Y.Cookie.get("count", Number);
            Assert.isNumber(value, "Retrieved value should be a number.");
            Assert.areEqual(11, value, "Retrieved cookie value should be 11.");
        },
        
        testGetWithCustomConverter : function(){
            this.stubDoc.cookie = "count=11";
            
            var value = Y.Cookie.get("count", function(value){
                if (value === "11"){
                    return true;
                } else {
                    return false;
                }
            });
            Assert.isBoolean(value, "Retrieved value should be a boolean.");
            Assert.isTrue(value, "Retrieved cookie value should be true.");       
        },
                
        testGetWithInvalidConverter : function(){
            this.stubDoc.cookie = "count=11";
            
            var value = Y.Cookie.get("count", true);
            Assert.isString(value, "Retrieved value should be a string.");
            Assert.areEqual("11", value, "Retrieved cookie value should be 11.");       
        },
                
        testGetWithConverterAndUnknownCookie : function(){
            this.stubDoc.cookie = "count=11";
            
            var value = Y.Cookie.get("count2", Number);
            Assert.isNull(value, "Retrieved value should be null.");       
        },
        
        testGetWithBooleanConverterOption : function(){
            this.stubDoc.cookie = "found=true";
            
            var value = Y.Cookie.get("found", { converter: Boolean });
            Assert.isBoolean(value, "Retrieved value should be a boolean.");
            Assert.isTrue(value, "Retrieved cookie value should be true.");
        
        },
        
        testGetWithNumberConverterOption : function(){
            this.stubDoc.cookie = "count=11";
            
            var value = Y.Cookie.get("count", { converter: Number });
            Assert.isNumber(value, "Retrieved value should be a number.");
            Assert.areEqual(11, value, "Retrieved cookie value should be 11.");
        },
        
        testGetWithCustomConverterOption : function(){
            this.stubDoc.cookie = "count=11";
            
            var value = Y.Cookie.get("count", { converter: function(value){
                if (value === "11"){
                    return true;
                } else {
                    return false;
                }
            } });
            Assert.isBoolean(value, "Retrieved value should be a boolean.");
            Assert.isTrue(value, "Retrieved cookie value should be true.");       
        },
                
        testGetWithInvalidConverterOption : function(){
            this.stubDoc.cookie = "count=11";
            
            var value = Y.Cookie.get("count", { converter: true });
            Assert.isString(value, "Retrieved value should be a string.");
            Assert.areEqual("11", value, "Retrieved cookie value should be 11.");       
        },
                
        testGetWithConverterOptionAndUnknownCookie : function(){
            this.stubDoc.cookie = "count=11";
            
            var value = Y.Cookie.get("count2", { converter: Number });
            Assert.isNull(value, "Retrieved value should be null.");      
        },
        
        testGetWithEmptyOptions : function(){
            this.stubDoc.cookie = "name=Nicholas%20Zakas";
            
            var value = Y.Cookie.get("name", {});
            Assert.areEqual("Nicholas Zakas", value, "Retrieved cookie value is incorrect.");
        },
        
        testGetSimpleWithFalseRaw : function(){
            this.stubDoc.cookie = "name=Nicholas%20Zakas";
            
            var value = Y.Cookie.get("name", { raw: false });
            Assert.areEqual("Nicholas Zakas", value, "Retrieved cookie value is incorrect.");
        },
        
        testGetSimpleWithTrueRaw : function(){
            this.stubDoc.cookie = "name=Nicholas%20Zakas";
            
            var value = Y.Cookie.get("name", { raw: true });
            Assert.areEqual("Nicholas%20Zakas", value, "Retrieved cookie value is incorrect.");
        },
        
        testGetComplexWithFalseRaw : function(){
            this.stubDoc.cookie = "name=" + encodeURIComponent("as.bd ed|ieh,~!!@#$%^*=098345|}{<>?");
            
            var value = Y.Cookie.get("name", { raw: false });
            Assert.areEqual("as.bd ed|ieh,~!!@#$%^*=098345|}{<>?", value, "Retrieved cookie value is incorrect.");
        },
        
        testGetComplexWithTrueRaw : function(){
            this.stubDoc.cookie = "name=as.bd ed|ieh,~!!@#$%^*=098345|}{<>?; name2=" + encodeURIComponent("as.bd ed|ieh,~!!@#$%^*=098345|}{<>?");
            
            var value  = Y.Cookie.get("name",  { raw: true }),
                value2 = Y.Cookie.get("name2", { raw: true });
            Assert.areEqual("as.bd ed|ieh,~!!@#$%^*=098345|}{<>?", value, "Retrieved cookie value is incorrect.");
            Assert.areEqual(encodeURIComponent("as.bd ed|ieh,~!!@#$%^*=098345|}{<>?"), value2, "Retrieved cookie value is incorrect.");
        }
        
    }));
    
    //-------------------------------------------------------------------------
    // Test Case for testing cookie existence
    //-------------------------------------------------------------------------
    
    suite.add(new Y.Test.Case({
    
        name : "Cookie Exists Tests",   
        
        setUp: function(){
            this.stubDoc = {cookie:""};
            Y.Cookie._setDoc(this.stubDoc);
        },
        
        
        tearDown: function(){
            Y.Cookie._setDoc(Y.config.doc);
            delete this.stubDoc;
        },            

        //---------------------------------------------------------------------
        // Tests
        //---------------------------------------------------------------------
    
        testExistsSimple : function(){
            this.stubDoc.cookie = "name=Nicholas%20Zakas";
            
            var value = Y.Cookie.exists("name");
            Assert.isTrue(value, "Cookie 'name' should exist.");
        },
        
        testExistsUnknown : function(){
            var value = Y.Cookie.exists("name3");
            Assert.isFalse(value, "Cookie 'name3' should not exist.");
        },
        
        testExistsBooleanCookie : function(){
            this.stubDoc.cookie = "info";
            var value = Y.Cookie.exists("info");
            Assert.isTrue(value, "Cookie 'info' should exist.");
        }
        
    }));
    

    //-------------------------------------------------------------------------
    // Test Case for getting cookie hashes
    //-------------------------------------------------------------------------
    
    suite.add(new Y.Test.Case({
    
        name : "Get Cookie Subs Tests",
        
        setUp: function(){
            this.stubDoc = {cookie:""};
            Y.Cookie._setDoc(this.stubDoc);
        },
        
        tearDown: function(){
            Y.Cookie._setDoc(Y.config.doc);
            delete this.stubDoc;
        },

        //---------------------------------------------------------------------
        // Tests
        //---------------------------------------------------------------------
    
        testGetSubsSimple : function(){
        
            this.stubDoc.cookie = "data=a=b&c=d&e=f&g=h";
        
            var hash = Y.Cookie.getSubs("data");
            
            ObjectAssert.hasKey("a", hash, "Hash 'a' is missing.");
            ObjectAssert.hasKey("c", hash, "Hash 'c' is missing.");
            ObjectAssert.hasKey("e", hash, "Hash 'e' is missing.");
            ObjectAssert.hasKey("g", hash, "Hash 'g' is missing.");
            
            Assert.areEqual("b", hash.a, "Hash 'a' should have value 'b'.");
            Assert.areEqual("d", hash.c, "Hash 'c' should have value 'd'.");
            Assert.areEqual("f", hash.e, "Hash 'e' should have value 'f'.");
            Assert.areEqual("h", hash.g, "Hash 'g' should have value 'h'.");

        },
        
        testGetSubsUnknown : function(){
        
            this.stubDoc.cookie = "name=Nicholas&20Zakas";
            
            var hash = Y.Cookie.getSubs("name2");
            Assert.isNull(hash, "Retrieved cookie value is should be null.");
        },
        
        testGetSubsComplex : function(){
        
            this.stubDoc.cookie = "name=Nicholas&20Zakas; data=age=29&title=f2e&stuff=no%20way; component=Cookie%20Utility";
            
            var hash = Y.Cookie.getSubs("data");
            
            ObjectAssert.hasKey("age", hash, "Hash 'age' is missing.");
            ObjectAssert.hasKey("title", hash, "Hash 'title' is missing.");
            ObjectAssert.hasKey("stuff", hash, "Hash 'stuff' is missing.");

            Assert.areEqual("29", hash.age, "Hash 'a' should have value 'b'.");
            Assert.areEqual("f2e", hash.title, "Hash 'c' should have value 'd'.");
            Assert.areEqual("no way", hash.stuff, "Hash 'e' should have value 'f'.");
        },

        testGetSubsInDefaultOrder: function(){
            this.stubDoc.cookie = "pathOfCookie=path=/test/supage; pathOfCookie=path=/test";
            
            var data = Y.Cookie.getSubs("pathOfCookie");
            Assert.areEqual("/test", data.path, "Cookie of path /test should be loaded");
        },

        testGetSubsInReverseOrder: function() {
            this.stubDoc.cookie = "pathOfCookie=path=/test/subpage; pathOfCookie=path=/test";

            var data = Y.Cookie.getSubs("pathOfCookie", {reverseCookieLoading: true});
            Assert.areEqual("/test/subpage", data.path, "Cookie of path /test/subpage should be loaded");
        }
    }));

    //-------------------------------------------------------------------------
    // Test Case for getting individual cookie sub.
    //-------------------------------------------------------------------------
    
    suite.add(new Y.Test.Case({
    
        name : "Get Cookie Sub Tests",
        
        _should : {
        
            error : {
                testGetSubInvalidName1 : new TypeError("Cookie name must be a non-empty string."),
                testGetSubInvalidName2 : new TypeError("Cookie name must be a non-empty string."),
                testGetSubInvalidName3 : new TypeError("Cookie name must be a non-empty string."),
                testGetSubInvalidName4 : new TypeError("Cookie name must be a non-empty string."),
                testGetSubInvalidName5 : new TypeError("Cookie name must be a non-empty string."),
            
                testGetSubInvalidSubName1 : new TypeError("Subcookie name must be a non-empty string."),
                testGetSubInvalidSubName2 : new TypeError("Subcookie name must be a non-empty string."),
                testGetSubInvalidSubName3 : new TypeError("Subcookie name must be a non-empty string."),
                testGetSubInvalidSubName4 : new TypeError("Subcookie name must be a non-empty string."),
                testGetSubInvalidSubName5 : new TypeError("Subcookie name must be a non-empty string.")
            
            }
        
        
        },
        
        
        setUp: function(){
            this.stubDoc = {cookie:"data=" + "a=b&c=d&e=f&g=h&found=true&count=11&age=29&title=f2e&stuff=no%20way&special=" + encodeURIComponent("Something with & and =") +"; name=Nicholas%20Zakas; component=Cookie%20Utility" };
            Y.Cookie._setDoc(this.stubDoc);
        },
        
        tearDown: function(){
            Y.Cookie._setDoc(Y.config.doc);
            delete this.stubDoc;
        },

        //---------------------------------------------------------------------
        // Tests
        //---------------------------------------------------------------------
    
        testGetSubSimple : function(){
            var value = Y.Cookie.getSub("data", "c");
            Assert.areEqual("d", value, "Subcookie value is incorrect.");
        },
        
        testGetSubUnknown : function(){
            var hash = Y.Cookie.getSub("data", "i");
            Assert.isNull(hash, "Retrieved cookie value should be null.");
        },
        
        testGetSubComplex : function(){
            var value = Y.Cookie.getSub("data", "stuff");
            Assert.areEqual("no way", value, "Subcookie value is wrong.");
        },
        
        testGetSubInvalidName1 : function(){
            Y.Cookie.getSub(12);
        },
        
        testGetSubInvalidName2 : function(){
            Y.Cookie.getSub(true);        
        },
        
        testGetSubInvalidName3 : function(){
            Y.Cookie.getSub("");        
        },
        
        testGetSubInvalidName4 : function(){
            Y.Cookie.getSub();        
        },

        testGetSubInvalidName5 : function(){
            Y.Cookie.getSub(null);        
        },
        
        testGetSubInvalidSubName1 : function(){        
            Y.Cookie.getSub("data", 12);
        },
        
        testGetSubInvalidSubName2 : function(){        
            Y.Cookie.getSub("data", true);
        },
        
        testGetSubInvalidSubName3 : function(){        
            Y.Cookie.getSub("data", "");
        },
        
        testGetSubInvalidSubName4 : function(){        
            Y.Cookie.getSub("data");
        },

        testGetSubInvalidSubName5 : function(){        
            Y.Cookie.getSub("data", null);
        },
        
        testGetSubOnNonExistantCookie : function(){
            var hash = Y.Cookie.getSub("invalid", "i");
            Assert.isNull(hash, "Retrieved cookie value is should be null.");
        },
                
        testGetSubWithBooleanConverter : function(){
            var value = Y.Cookie.getSub("data", "found", Boolean);
            Assert.isBoolean(value, "Retrieved subcookie value should be a boolean.");
            Assert.isTrue(value, "Retrieved subcookie value should be true.");
        },
        
        testGetSubWithNumberConverter : function(){
            var value = Y.Cookie.getSub("data", "count", Number);
            Assert.isNumber(value, "Retrieved subcookie value should be a number.");
            Assert.areEqual(11, value, "Retrieved subcookie value should be 11.");
        },
        
        testGetSubWithCustomConverter : function(){
            var value = Y.Cookie.getSub("data", "count", function(value){
                if (value === "11"){
                    return true;
                } else {
                    return false;
                }
            });
            Assert.isBoolean(value, "Retrieved subcookie value should be a boolean.");
            Assert.isTrue(value, "Retrieved subcookie value should be true.");
        },
                
        testGetSubWithInvalidConverter : function(){
            var value = Y.Cookie.getSub("data", "count", true);
            Assert.isString(value, "Retrieved subcookie value should be a string.");
            Assert.areEqual("11", value, "Retrieved subcookie value should be 11.");
        },
                
        testSubGetWithConverterAndUnknownCookie : function(){
            var value = Y.Cookie.getSub("data", "count2", Number);
            Assert.isNull(value, "Retrieved subcookie value should be null.");
        },
        
        testSubGetSpecial : function(){
            var value = Y.Cookie.getSub("data", "special");
            Assert.areEqual("Something with & and =", value, "Sub cookie string is incorrect.");
        },

        testGetSubInDefaultOrder: function(){
            this.stubDoc.cookie = "data=path=/test/subpage&value=invalid; data=path=/test&value=valid";
            
            var data = Y.Cookie.getSub("data", "value");
            Assert.areEqual("valid", data, "Cookie of path /test should be loaded");
        },

        testGetSubInReverseOrder: function() {
            this.stubDoc.cookie = "data=path=/test/subpage&value=valid; data=path=/test&value=invalid";

            var data = Y.Cookie.getSub("data", "value", null, {reverseCookieLoading: true});
            Assert.areEqual("valid", data, "Cookie of path /test/subpage should be loaded");
        }
    }));

    //-------------------------------------------------------------------------
    // Test Case for removing individual cookie sub.
    //-------------------------------------------------------------------------
    
    suite.add(new Y.Test.Case({
    
        name : "Remove Cookie Sub Tests",
        
        _should : {
        
            error : {
                testRemoveSubInvalidName1 : new TypeError("Cookie name must be a non-empty string."),
                testRemoveSubInvalidName2 : new TypeError("Cookie name must be a non-empty string."),
                testRemoveSubInvalidName3 : new TypeError("Cookie name must be a non-empty string."),
                testRemoveSubInvalidName4 : new TypeError("Cookie name must be a non-empty string."),
                testRemoveSubInvalidName5 : new TypeError("Cookie name must be a non-empty string."),
            
                testRemoveSubInvalidSubName1 : new TypeError("Subcookie name must be a non-empty string."),
                testRemoveSubInvalidSubName2 : new TypeError("Subcookie name must be a non-empty string."),
                testRemoveSubInvalidSubName3 : new TypeError("Subcookie name must be a non-empty string."),
                testRemoveSubInvalidSubName4 : new TypeError("Subcookie name must be a non-empty string."),
                testRemoveSubInvalidSubName5 : new TypeError("Subcookie name must be a non-empty string.")
            
            }                       
        },
        
        setUp: function(){
            this.stubDoc = {cookie:"data=" + "a=b&c=d&e=f&g=h&found=true&count=11&age=29&title=f2e&stuff=no%20way&special=" + encodeURIComponent("Something with & and =") +"; name=Nicholas%20Zakas; component=Cookie%20Utility; info=a=b" };
            Y.Cookie._setDoc(this.stubDoc);
        },            
        
        tearDown: function(){
            Y.Cookie._setDoc(Y.config.doc);
            delete this.stubDoc;
        },             
           
        //---------------------------------------------------------------------
        // Tests
        //---------------------------------------------------------------------
    
        testRemoveSubSimple : function(){
            var value = Y.Cookie.removeSub("data", "c");          
            Assert.areEqual("data=a=b&e=f&g=h&found=true&count=11&age=29&title=f2e&stuff=no%20way&special=" + encodeURIComponent("Something with & and ="), value, "Cookie string is incorrect.");
        },
        
        testRemoveSubUnknown : function(){
            var value = Y.Cookie.removeSub("data", "i");
            Assert.areEqual("", value, "Cookie string is incorrect.");
        },
        
        testRemoveSubInvalidName1 : function(){        
            Y.Cookie.removeSub(12);        
        },
        
        testRemoveSubInvalidName2 : function(){        
            Y.Cookie.removeSub(true);        
        },
        
        testRemoveSubInvalidName3 : function(){        
            Y.Cookie.removeSub("");        
        },
        
        testRemoveSubInvalidName4 : function(){        
            Y.Cookie.removeSub();        
        },

        testRemoveSubInvalidName5 : function(){        
            Y.Cookie.removeSub(null);        
        },
        
        testRemoveSubInvalidSubName1 : function(){        
            Y.Cookie.removeSub("data", 12);
        },
        
        testRemoveSubInvalidSubName2 : function(){        
            Y.Cookie.removeSub("data", true);
        },
        
        testRemoveSubInvalidSubName3 : function(){        
            Y.Cookie.removeSub("data", "");
        },
        
        testRemoveSubInvalidSubName4 : function(){        
            Y.Cookie.removeSub("data");
        },

        testRemoveSubInvalidSubName5 : function(){        
            Y.Cookie.removeSub("data", null);
        },
        
        testRemoveSubOnNonExistantCookie : function(){
            var value = Y.Cookie.removeSub("invalid", "i");
            Assert.areEqual("",value, "Cookie string is incorrect.");
        },
        
        testRemoveLastSub : function(){
            Y.Cookie.removeSub("info", "a");
            var value = Y.Cookie.get("info");
            Assert.areEqual("", value, "Cookie string is incorrect.");
        },
        
        testRemoveLastSubWithTrueRemoveIfEmpty : function(){
            Y.Cookie.removeSub("info", "a", { removeIfEmpty: true });
            
            Assert.areEqual("info=; expires=" + (new Date(0)).toUTCString(),                
                this.stubDoc.cookie,
                "The 'info' cookie should be removed.");
            //var value = Y.Cookie.get("info");
            //Assert.isNull(value, "Cookie value should be null.");
        },
        
        testRemoveLastSubWithFalseRemoveIfEmpty : function() {
            Y.Cookie.removeSub("info", "a", { removeIfEmpty: false });
            var value = Y.Cookie.get("info");
            Assert.areEqual("", value, "Cookie string is incorrect.");
        },
        
        testRemoveNotLastSubWithTrueRemoveIfEmpty : function(){
            var value = Y.Cookie.removeSub("data", "c", { removeIfEmpty: true });
            Assert.areEqual("data=a=b&e=f&g=h&found=true&count=11&age=29&title=f2e&stuff=no%20way&special=" + encodeURIComponent("Something with & and ="), value, "Cookie string is incorrect.");
        },
        
        testRemoveNotLastSubWithFalseRemoveIfEmpty : function() {
            var value = Y.Cookie.removeSub("data", "c", { removeIfEmpty: false });
            Assert.areEqual("data=a=b&e=f&g=h&found=true&count=11&age=29&title=f2e&stuff=no%20way&special=" + encodeURIComponent("Something with & and ="), value, "Cookie string is incorrect.");
        },
        
        testRemoveNotLastSubWithInvalidRemoveIfEmpty : function() {
            var value = Y.Cookie.removeSub("data", "c", { removeIfEmpty: "blah" });
            Assert.areEqual("data=a=b&e=f&g=h&found=true&count=11&age=29&title=f2e&stuff=no%20way&special=" + encodeURIComponent("Something with & and ="), value, "Cookie string is incorrect.");
        }

    }));
    
    //-------------------------------------------------------------------------
    // Test Case for removing cookies
    //-------------------------------------------------------------------------
    
    suite.add(new Y.Test.Case({
    
        name : "Remove Cookie Tests",
        
        _should : {
        
            error : {
                testRemoveInvalidName1 : new TypeError("Cookie name must be a non-empty string."),
                testRemoveInvalidName2 : new TypeError("Cookie name must be a non-empty string."),
                testRemoveInvalidName3 : new TypeError("Cookie name must be a non-empty string."),
                testRemoveInvalidName4 : new TypeError("Cookie name must be a non-empty string."),
                testRemoveInvalidName5 : new TypeError("Cookie name must be a non-empty string.")                        
            }
        
        
        },
        
        setUp: function(){
            this.stubDoc = {cookie:"data=1234"};
            Y.Cookie._setDoc(this.stubDoc);
        },
        
        
        tearDown: function(){
            Y.Cookie._setDoc(Y.config.doc);
            delete this.stubDoc;
        },              

        //---------------------------------------------------------------------
        // Tests
        //---------------------------------------------------------------------
    
        testRemoveSimple : function(){        
            Y.Cookie.remove("data");      

            Assert.areEqual("data=; expires=" + (new Date(0)).toUTCString(), this.stubDoc.cookie, "The 'data' cookie should be removed.");
        },
        
        /*
         * These next five tests pass because they throw an error.
         */
        testRemoveInvalidName1 : function(){        
            Y.Cookie.remove();        
        },
        
        testRemoveInvalidName2 : function(){
            Y.Cookie.remove("");        
        },
        
        testRemoveInvalidName3 : function(){
            Y.Cookie.remove(25);        
        },
        
        testRemoveInvalidName4 : function(){
            Y.Cookie.remove(true);        
        },
        
        testRemoveInvalidName5 : function(){
            Y.Cookie.remove(null);        
        },
        
        /*
         * Tests that remove() doesn't change the options object that was passed in.
         */
        testRemoveWithOptionsIntact: function(){
            var options = {};
            Y.Cookie.remove("name", options);
            Assert.isUndefined(options.expires, "Options should not have an expires property.");
        }
        
    }));

    //-------------------------------------------------------------------------
    // Test Case for setting cookies
    //-------------------------------------------------------------------------
    
    suite.add(new Y.Test.Case({
    
        name : "Set Cookie Tests",
        
        _should : {
        
            error : {
                testRemoveInvalidName1 : new TypeError("Cookie name must be a non-empty string."),
                testRemoveInvalidName2 : new TypeError("Cookie name must be a non-empty string."),
                testRemoveInvalidName3 : new TypeError("Cookie name must be a non-empty string."),
                testRemoveInvalidName4 : new TypeError("Cookie name must be a non-empty string."),
                testRemoveInvalidName5 : new TypeError("Cookie name must be a non-empty string.")                        
            }
        
        
        },
        
        setUp: function(){
            this.stubDoc = {cookie:""};
            Y.Cookie._setDoc(this.stubDoc);
        },
        
        tearDown: function(){
            Y.Cookie._setDoc(Y.config.doc);
            delete this.stubDoc;
        },

        //---------------------------------------------------------------------
        // Tests
        //---------------------------------------------------------------------
    
        testSetSimple : function(){
            var output = Y.Cookie.set("data", "1234");
            Assert.areEqual("data=1234", output, "Cookie string format is wrong.");
            Assert.areEqual("data=1234", this.stubDoc.cookie, "Cookie was not set onto document.");           
        },
        
        testSetSimpleWithFalseRaw : function(){
            var output = Y.Cookie.set("data", "1234", { raw: false });
            Assert.areEqual("data=1234", output, "Cookie string format is wrong.");
            Assert.areEqual("data=1234", this.stubDoc.cookie, "Cookie was not set onto document.");
        },
        
        testSetSimpleWithTrueRaw : function(){
            var output = Y.Cookie.set("data", "1234", { raw: true });
            Assert.areEqual("data=1234", output, "Cookie string format is wrong.");
            Assert.areEqual("data=1234", this.stubDoc.cookie, "Cookie was not set onto document.");
        },
        
        testSetSimpleWithInvalidRaw : function(){
            var output = Y.Cookie.set("data", "1234", { raw: "blah" });
            Assert.areEqual("data=1234", output, "Cookie string format is wrong.");
            Assert.areEqual("data=1234", this.stubDoc.cookie, "Cookie was not set onto document.");
        },
        
        testSetSimpleWithPath : function(){        
            var text = Y.Cookie.set("name", "value", { path: "/" });
            Assert.areEqual("name=value; path=/", text, "Cookie string is incorrect.");
            Assert.areEqual("name=value; path=/", this.stubDoc.cookie, "Cookie was not set to document.");
        },
        
        testSetSimpleWithInvalidPath1 : function(){        
            var text = Y.Cookie.set("name", "value", { path: 25 });
            Assert.areEqual("name=value", text, "Cookie string is incorrect.");
            Assert.areEqual("name=value", this.stubDoc.cookie, "Cookie was not set to document.");
        },
        
        testSetSimpleWithInvalidPath2 : function(){        
            var text = Y.Cookie.set("name", "value", { path: "" });
            Assert.areEqual("name=value", text, "Cookie string is incorrect.");
            Assert.areEqual("name=value", this.stubDoc.cookie, "Cookie was not set to document.");
        },
        
        testSetSimpleWithDomain : function(){        
            var text = Y.Cookie.set("name", "value", { domain: "yahoo.com" });
            Assert.areEqual("name=value; domain=yahoo.com", text, "Cookie string is incorrect.");
            Assert.areEqual("name=value; domain=yahoo.com", this.stubDoc.cookie, "Cookie was not set to document.");
        },
        
        testSetSimpleWithInvalidDomain1 : function(){        
            var text = Y.Cookie.set("name", "value", { domain: true });
            Assert.areEqual("name=value", text, "Cookie string is incorrect.");
            Assert.areEqual("name=value", this.stubDoc.cookie, "Cookie was not set to document.");
        },
        
        testSetSimpleWithInvalidDomain2 : function(){        
            var text = Y.Cookie.set("name", "value",  { domain: "" });
            Assert.areEqual("name=value", text, "Cookie string is incorrect.");
            //won't work unless the page is loaded from that domain
            //Assert.areEqual("name=value", this.stubDoc.cookie, "Cookie was not set to document.");
        },
        
        testSetSimpleWithSecure : function(){        
            var text = Y.Cookie.set("name", "value", { secure: true });
            Assert.areEqual("name=value; secure", text, "Cookie string is incorrect.");
            Assert.areEqual("name=value; secure", this.stubDoc.cookie, "Cookie was not set to document.");
        },
        
        testSetSimpleWithInvalidSecure1 : function(){        
            var text = Y.Cookie.set("name", "value", { secure: false });
            Assert.areEqual("name=value", text, "Cookie string is incorrect.");
            Assert.areEqual("name=value", this.stubDoc.cookie, "Cookie was not set to document.");
        },
        
        testSetSimpleWithInvalidSecure2 : function(){        
            var text = Y.Cookie.set("name", "value", { secure: "blah" });
            Assert.areEqual("name=value", text, "Cookie string is incorrect.");
            Assert.areEqual("name=value", this.stubDoc.cookie, "Cookie was not set to document.");
        },
        
        testSetSimpleWithExpiry : function(){
            var expires = new Date("Wed, 01 Jan 2070 00:00:00 GMT");
            var text = Y.Cookie.set("name", "value", { expires: expires });
            Assert.areEqual("name=value; expires=" + expires.toUTCString(), text, "Cookie string is incorrect.");
            Assert.areEqual("name=value; expires=" + expires.toUTCString(), this.stubDoc.cookie, "Cookie was not set to document.");
        },

        testSetSimpleWithInvalidExpiry : function(){
            var text = Y.Cookie.set("name", "value", { expires: "blah" });
            Assert.areEqual("name=value", text, "Cookie string is incorrect.");
            Assert.areEqual("name=value", this.stubDoc.cookie, "Cookie was not set to document.");
        },

        testSetSimpleWithAll : function(){
            var expires = new Date("Wed, 01 Jan 2070 00:00:00 GMT");
            var text = Y.Cookie.set("name", "value", { expires: expires, domain : "yahoo.com", path: "/", secure: true });
            Assert.areEqual("name=value; expires=" + expires.toUTCString() + "; path=/; domain=yahoo.com; secure", text, "Cookie string is incorrect.");
            Assert.areEqual("name=value; expires=" + expires.toUTCString() + "; path=/; domain=yahoo.com; secure", this.stubDoc.cookie, "Cookie was not set to document.");
        },

        testSetComplex : function(){            
            var name = "c.f name";
            var value = "as.bd ed|ieh,~!!@#$%^*=098345|}{<>?";
            var result = encodeURIComponent(name) + "=" + encodeURIComponent(value);
            var text = Y.Cookie.set(name, value);
            Assert.areEqual(result, text, "Cookie string is incorrect.");
            Assert.areEqual(result, this.stubDoc.cookie, "Cookie was not set to document.");
        },
        
        testSetComplexWithFalseRaw : function(){
            var name = "c.f name";
            var value = "as.bd ed|ieh,~!!@#$%^*=098345|}{<>?";
            var result = encodeURIComponent(name) + "=" + encodeURIComponent(value);
            var text = Y.Cookie.set(name, value, { raw: false });
            Assert.areEqual(result, text, "Cookie string is incorrect.");
            Assert.areEqual(result, this.stubDoc.cookie, "Cookie was not set to document.");
        },
        
        testSetComplexWithTrueRaw : function(){
            var name = "c.f name";
            var value = "as.bd ed|ieh,~!!@#$%^*=098345|}{<>?";
            var result = encodeURIComponent(name) + "=" + value;
            var text = Y.Cookie.set(name, value, { raw: true });
            Assert.areEqual(result, text, "Cookie string is incorrect.");
            Assert.areEqual(result, this.stubDoc.cookie, "Cookie was not set to document.");
        },
        
        testSetComplexWithPath : function(){
            var name = "c.f name";
            var value = "as.bd ed|ieh,~!!@#$%^*=098345|}{<>?";
            var result = encodeURIComponent(name) + "=" + encodeURIComponent(value);
            var text = Y.Cookie.set(name, value, { path : "/" });
            Assert.areEqual(result + "; path=/", text, "Cookie string is incorrect.");
            Assert.areEqual(result + "; path=/", this.stubDoc.cookie, "Cookie was not set to document.");
        },
        
        testSetComplexWithDomain : function(){
            var name = "c.f name";
            var value = "as.bd ed|ieh,~!!@#$%^*=098345|}{<>?";
            var result = encodeURIComponent(name) + "=" + encodeURIComponent(value);
            var text = Y.Cookie.set(name, value, { domain: "yahoo.com" });
            Assert.areEqual(result + "; domain=yahoo.com", text, "Cookie string is incorrect.");
            Assert.areEqual(result + "; domain=yahoo.com", this.stubDoc.cookie, "Cookie was not set to document.");
        },
        
        testSetComplexWithSecure : function(){
            var name = "c.f name";
            var value = "as.bd ed|ieh,~!!@#$%^*=098345|}{<>?";
            var text = Y.Cookie.set(name, value, { secure: true });
            var result = encodeURIComponent(name) + "=" + encodeURIComponent(value);
            Assert.areEqual(result + "; secure", text, "Cookie string is incorrect.");
            Assert.areEqual(result + "; secure", this.stubDoc.cookie, "Cookie was not set to document.");
        },
        
        testSetComplexWithExpiry : function(){
            var name = "c.f name";
            var value = "as.bd ed|ieh,~!!@#$%^*=098345|}{<>?";
            var expires = new Date("Wed, 01 Jan 2070 00:00:00 GMT");
            var text = Y.Cookie.set(name, value, { expires : expires });
            var result = encodeURIComponent(name) + "=" + encodeURIComponent(value);
            Assert.areEqual(result + "; expires=" + expires.toUTCString(), text, "Cookie string is incorrect.");
            Assert.areEqual(result + "; expires=" + expires.toUTCString(), this.stubDoc.cookie, "Cookie was not set to document.");
        },
        
        testSetComplexWithAll : function(){
            var name = "c.f name";
            var value = "as.bd ed|ieh,~!!@#$%^*=098345|}{<>?";
            var expires = new Date("Wed, 01 Jan 2070 00:00:00 GMT");
            var text = Y.Cookie.set(name, value, { expires: expires, domain : "yahoo.com", path: "/", secure: true });
            var result = encodeURIComponent(name) + "=" + encodeURIComponent(value);
            Assert.areEqual(result + "; expires=" + expires.toUTCString() + "; path=/; domain=yahoo.com; secure", text, "Cookie string is incorrect.");
            Assert.areEqual(result + "; expires=" + expires.toUTCString() + "; path=/; domain=yahoo.com; secure", this.stubDoc.cookie, "Cookie was not set to document.");
        }

    }));

    //-------------------------------------------------------------------------
    // Test Case for setting subcookies
    //-------------------------------------------------------------------------
    
    suite.add(new Y.Test.Case({
    
        name : "Set Subcookie Tests",
        
        _should : {
        
            error : {
                testRemoveInvalidName1 : new TypeError("Cookie name must be a non-empty string."),
                testRemoveInvalidName2 : new TypeError("Cookie name must be a non-empty string."),
                testRemoveInvalidName3 : new TypeError("Cookie name must be a non-empty string."),
                testRemoveInvalidName4 : new TypeError("Cookie name must be a non-empty string."),
                testRemoveInvalidName5 : new TypeError("Cookie name must be a non-empty string.")                        
            }
        
        
        },
        
        
        setUp: function(){
            this.stubDoc = {cookie:""};
            Y.Cookie._setDoc(this.stubDoc);
        },
        
        tearDown: function(){
            Y.Cookie._setDoc(Y.config.doc);
            delete this.stubDoc;
        },

        //---------------------------------------------------------------------
        // Tests
        //---------------------------------------------------------------------
    
        testSetSubSimple : function(){
            var output = Y.Cookie.setSub("data", "value", "1234");
            Assert.areEqual("data=value=1234", output, "Cookie string format is wrong.");
            Assert.areEqual("data=value=1234", this.stubDoc.cookie, "Cookie was not set onto document.");           
        },       
        
        testSetSubSimpleWithPath : function(){        
            var text = Y.Cookie.setSub("name", "sub", "value", { path: "/" });
            Assert.areEqual("name=sub=value; path=/", text, "Cookie string is incorrect.");
            Assert.areEqual("name=sub=value; path=/", this.stubDoc.cookie, "Cookie was not set to document.");
        },
        
        testSetSubSimpleWithInvalidPath1 : function(){        
            var text = Y.Cookie.setSub("name", "sub", "value", { path: 25 });
            Assert.areEqual("name=sub=value", text, "Cookie string is incorrect.");
            Assert.areEqual("name=sub=value", this.stubDoc.cookie, "Cookie was not set to document.");
        },
        
        testSetSubSimpleWithInvalidPath2 : function(){        
            var text = Y.Cookie.setSub("name", "sub", "value", { path: "" });
            Assert.areEqual("name=sub=value", text, "Cookie string is incorrect.");
            Assert.areEqual("name=sub=value", this.stubDoc.cookie, "Cookie was not set to document.");
        },
        
        testSetSubSimpleWithDomain : function(){        
            var text = Y.Cookie.setSub("name", "sub", "value", { domain: "yahoo.com" });
            Assert.areEqual("name=sub=value; domain=yahoo.com", text, "Cookie string is incorrect.");
            Assert.areEqual("name=sub=value; domain=yahoo.com", this.stubDoc.cookie, "Cookie was not set to document.");
        },
        
        testSetSubSimpleWithInvalidDomain1 : function(){        
            var text = Y.Cookie.setSub("name", "sub", "value", { domain: true });
            Assert.areEqual("name=sub=value", text, "Cookie string is incorrect.");
            Assert.areEqual("name=sub=value", this.stubDoc.cookie, "Cookie was not set to document.");
        },
        
        testSetSubSimpleWithInvalidDomain2 : function(){        
            var text = Y.Cookie.setSub("name", "sub", "value",  { domain: "" });
            Assert.areEqual("name=sub=value", text, "Cookie string is incorrect.");
            Assert.areEqual("name=sub=value", this.stubDoc.cookie, "Cookie was not set to document.");
        },
        
        testSetSubSimpleWithSecure : function(){        
            var text = Y.Cookie.setSub("name", "sub", "value", { secure: true });
            Assert.areEqual("name=sub=value; secure", text, "Cookie string is incorrect.");
            Assert.areEqual("name=sub=value; secure", this.stubDoc.cookie, "Cookie was not set to document.");
        },
        
        testSetSubSimpleWithInvalidSecure1 : function(){        
            var text = Y.Cookie.setSub("name", "sub", "value", { secure: false });
            Assert.areEqual("name=sub=value", text, "Cookie string is incorrect.");
            Assert.areEqual("name=sub=value", this.stubDoc.cookie, "Cookie was not set to document.");
        },
        
        testSetSubSimpleWithInvalidSecure2 : function(){        
            var text = Y.Cookie.setSub("name", "sub", "value", { secure: "blah" });
            Assert.areEqual("name=sub=value", text, "Cookie string is incorrect.");
            Assert.areEqual("name=sub=value", this.stubDoc.cookie, "Cookie was not set to document.");
        },
        
        testSetSubSimpleWithExpiry : function(){
            var expires = new Date("Wed, 01 Jan 2070 00:00:00 GMT");
            var text = Y.Cookie.setSub("name", "sub", "value", { expires: expires });
            Assert.areEqual("name=sub=value; expires=" + expires.toUTCString(), text, "Cookie string is incorrect.");
            Assert.areEqual("name=sub=value; expires=" + expires.toUTCString(), this.stubDoc.cookie, "Cookie was not set to document.");
        },

        testSetSubSimpleWithInvalidExpiry : function(){
            var text = Y.Cookie.setSub("name", "sub", "value", { expires: "blah" });
            Assert.areEqual("name=sub=value", text, "Cookie string is incorrect.");
            Assert.areEqual("name=sub=value", this.stubDoc.cookie, "Cookie was not set to document.");
        },

        testSetSubSimpleWithAll : function(){
            var expires = new Date("Wed, 01 Jan 2070 00:00:00 GMT");
            var text = Y.Cookie.setSub("name", "sub", "value", { expires: expires, domain : "yahoo.com", path: "/", secure: true });
            Assert.areEqual("name=sub=value; expires=" + expires.toUTCString() + "; path=/; domain=yahoo.com; secure", text, "Cookie string is incorrect.");
            Assert.areEqual("name=sub=value; expires=" + expires.toUTCString() + "; path=/; domain=yahoo.com; secure", this.stubDoc.cookie, "Cookie was not set to document.");
        },
        
        testSetSubSpecial : function(){
            var value = "Something with & and =";
            var cookieText = Y.Cookie.setSub("name", "sub", value);
            Assert.areEqual("name=sub=" + encodeURIComponent(value), cookieText, "Sub cookie string is incorrect.");        
        }

    }));

    //-------------------------------------------------------------------------
    // Test Case for setting complete subcookies
    //-------------------------------------------------------------------------
    
    suite.add(new Y.Test.Case({
    
        name : "Set Complete Subcookie Tests",
        
        _should : {
        
            error : {
            }
        
        
        },
        
        setUp: function(){
            this.stubDoc = {cookie:""};
            Y.Cookie._setDoc(this.stubDoc);
        },
        
        tearDown: function(){
            Y.Cookie._setDoc(Y.config.doc);
            delete this.stubDoc;
        },

        //---------------------------------------------------------------------
        // Tests
        //---------------------------------------------------------------------
    
        testSetSubsSimple : function(){
            var text = Y.Cookie.setSubs("data", {a: "b",c: "d",e: "f",g: "h"});
            Assert.areEqual("data=a=b&c=d&e=f&g=h", text, "Cookie string format is wrong.");
            Assert.areEqual("data=a=b&c=d&e=f&g=h", this.stubDoc.cookie, "Cookie was not set onto document.");           
        },       
        
        testSetSubsSimpleWithPath : function(){        
            var text = Y.Cookie.setSubs("data", {a: "b",c: "d",e: "f",g: "h"}, { path : "/" });
            Assert.areEqual("data=a=b&c=d&e=f&g=h; path=/", text, "Cookie string is incorrect.");
            Assert.areEqual("data=a=b&c=d&e=f&g=h; path=/", this.stubDoc.cookie, "Cookie was not set to document.");
        },
        
        testSetSubsSimpleWithInvalidPath1 : function(){        
            var text = Y.Cookie.setSubs("data", {a: "b",c: "d",e: "f",g: "h"}, { path : 25 });
            Assert.areEqual("data=a=b&c=d&e=f&g=h", text, "Cookie string is incorrect.");
            Assert.areEqual("data=a=b&c=d&e=f&g=h", this.stubDoc.cookie, "Cookie was not set to document.");
        },
        
        testSetSubsSimpleWithInvalidPath2 : function(){        
            var text = Y.Cookie.setSubs("data", {a: "b",c: "d",e: "f",g: "h"}, { path : "" });
            Assert.areEqual("data=a=b&c=d&e=f&g=h", text, "Cookie string is incorrect.");
            Assert.areEqual("data=a=b&c=d&e=f&g=h", this.stubDoc.cookie, "Cookie was not set to document.");
        },
        
        testSetSubsSimpleWithDomain : function(){        
            var text = Y.Cookie.setSubs("data", {a: "b",c: "d",e: "f",g: "h"}, { domain: "yahoo.com" });
            Assert.areEqual("data=a=b&c=d&e=f&g=h; domain=yahoo.com", text, "Cookie string is incorrect.");
            Assert.areEqual("data=a=b&c=d&e=f&g=h; domain=yahoo.com", this.stubDoc.cookie, "Cookie was not set to document.");
        },
        
        testSetSubsSimpleWithInvalidDomain1 : function(){        
            var text = Y.Cookie.setSubs("data", {a: "b",c: "d",e: "f",g: "h"}, { domain: true });
            Assert.areEqual("data=a=b&c=d&e=f&g=h", text, "Cookie string is incorrect.");
            Assert.areEqual("data=a=b&c=d&e=f&g=h", this.stubDoc.cookie, "Cookie was not set to document.");
        },
        
        testSetSubsSimpleWithInvalidDomain2 : function(){        
            var text = Y.Cookie.setSubs("data", {a: "b",c: "d",e: "f",g: "h"}, { domain: "" });
            Assert.areEqual("data=a=b&c=d&e=f&g=h", text, "Cookie string is incorrect.");
            Assert.areEqual("data=a=b&c=d&e=f&g=h", this.stubDoc.cookie, "Cookie was not set to document.");
        },
        
        testSetSubsSimpleWithSecure : function(){        
            var text = Y.Cookie.setSubs("data", {a: "b",c: "d",e: "f",g: "h"}, { secure: true });
            Assert.areEqual("data=a=b&c=d&e=f&g=h; secure", text, "Cookie string is incorrect.");
            Assert.areEqual("data=a=b&c=d&e=f&g=h; secure", this.stubDoc.cookie, "Cookie was not set to document.");
        },
        
        testSetSubsSimpleWithInvalidSecure1 : function(){        
            var text = Y.Cookie.setSubs("data", {a: "b",c: "d",e: "f",g: "h"}, { secure: false });
            Assert.areEqual("data=a=b&c=d&e=f&g=h", text, "Cookie string is incorrect.");
            Assert.areEqual("data=a=b&c=d&e=f&g=h", this.stubDoc.cookie, "Cookie was not set to document.");
        },
        
        testSetSubsSimpleWithInvalidSecure2 : function(){        
            var text = Y.Cookie.setSubs("data", {a: "b",c: "d",e: "f",g: "h"}, { secure: "blah" });
            Assert.areEqual("data=a=b&c=d&e=f&g=h", text, "Cookie string is incorrect.");
            Assert.areEqual("data=a=b&c=d&e=f&g=h", this.stubDoc.cookie, "Cookie was not set to document.");
        },
        
        testSetSubsSimpleWithExpiry : function(){
            var expires = new Date("Wed, 01 Jan 2070 00:00:00 GMT");
            var text = Y.Cookie.setSubs("data", {a: "b",c: "d",e: "f",g: "h"}, { expires: expires });
            Assert.areEqual("data=a=b&c=d&e=f&g=h; expires=" + expires.toUTCString(), text, "Cookie string is incorrect.");
            Assert.areEqual("data=a=b&c=d&e=f&g=h; expires=" + expires.toUTCString(), this.stubDoc.cookie, "Cookie was not set to document.");
        },

        testSetSubsSimpleWithInvalidExpiry : function(){
            var text = Y.Cookie.setSubs("data", {a: "b",c: "d",e: "f",g: "h"}, { expires: "blah" });
            Assert.areEqual("data=a=b&c=d&e=f&g=h", text, "Cookie string is incorrect.");
            Assert.areEqual("data=a=b&c=d&e=f&g=h", this.stubDoc.cookie, "Cookie was not set to document.");
        },

        testSetSubsSimpleWithAll : function(){
            var expires = new Date("Wed, 01 Jan 2070 00:00:00 GMT");
            var text = Y.Cookie.setSubs("data", {a: "b",c: "d",e: "f",g: "h"}, { expires: expires, domain : "yahoo.com", path: "/", secure: true });
            Assert.areEqual("data=a=b&c=d&e=f&g=h; expires=" + expires.toUTCString() + "; path=/; domain=yahoo.com; secure", text, "Cookie string is incorrect.");
            Assert.areEqual("data=a=b&c=d&e=f&g=h; expires=" + expires.toUTCString() + "; path=/; domain=yahoo.com; secure", this.stubDoc.cookie, "Cookie was not set to document.");
        },
        
        testSetSubsValues : function(){
            var text = Y.Cookie.setSubs("data", {a: "b",c: "d",e: "f",g: "h"});
            
            //try to get the values
            var a = Y.Cookie.getSub("data", "a");
            var c = Y.Cookie.getSub("data", "c");
            var e = Y.Cookie.getSub("data", "e");
            var g = Y.Cookie.getSub("data", "g");
            
            Assert.areEqual("b", a, "Value of 'a' subcookie is wrong.");
            Assert.areEqual("d", c, "Value of 'c' subcookie is wrong.");
            Assert.areEqual("f", e, "Value of 'e' subcookie is wrong.");
            Assert.areEqual("h", g, "Value of 'g' subcookie is wrong.");
        }

    }));

    Y.Test.Runner.add(suite);
});
