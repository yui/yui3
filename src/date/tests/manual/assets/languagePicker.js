YUI.add('languagePicker', function(Y) {

    function LanguagePicker() {
    }

    var langNames = {
        "ar": "العربية",
        "ar-AE": "العربية (الامارات العربية المتحدة)",
        "ar-BH": "العربية (البحرين)",
        "ar-DZ": "العربية (الجزائر)",
        "ar-EG": "العربية (مصر)",
        "ar-IQ": "العربية (العراق)",
        "ar-JO": "العربية (الأردن)",
        "ar-KW": "العربية (الكويت)",
        "ar-LB": "العربية (لبنان)",
        "ar-LY": "العربية (ليبيا)",
        "ar-MA": "العربية (المغرب)",
        "ar-OM": "العربية (عُمان)",
        "ar-PS": "العربية (فلسطين)",
        "ar-QA": "العربية (قطر)",
        "ar-SA": "العربية (المملكة العربية السعودية)",
        "ar-SD": "العربية (السودان)",
        "ar-SY": "العربية (سوريا)",
        "ar-TN": "العربية (تونس)",
        "ar-YE": "العربية (اليمن)",
        "bg": "български",
        "bg-BG": "български (България)",
        "bn": "বাংলা",
        "bn-BD": "বাংলা (বাংলাদেশ)",
        "bn-IN": "বাংলা (ভারত)",
        "ca": "català",
        "ca-ES": "català (Espanya)",
        "cs": "čeština",
        "cs-CZ": "čeština (Česká republika)",
        "da": "dansk",
        "da-DK": "dansk (Danmark)",
        "de": "Deutsch",
        "de-AT": "Deutsch (Österreich)",
        "de-CH": "Deutsch (Schweiz)",
        "de-DE": "Deutsch (Deutschland)",
        "el": "ελληνικά",
        "el-GR": "ελληνικά (Ελλάδα)",
        "en": "English",
        "en-AE": "English (U.A.E.)",
        "en-AU": "English (Australia)",
        "en-CA": "English (Canada)",
        "en-EG": "English (Egypt)",
        "en-GB": "English (U.K.)",
        "en-HK": "English (Hong Kong)",
        "en-IE": "English (Ireland)",
        "en-IN": "English (India)",
        "en-JO": "English (Jordan)",
        "en-MA": "English (Morocco)",
        "en-MY": "English (Malaysia)",
        "en-NZ": "English (New Zealand)",
        "en-PH": "English (Philippines)",
        "en-SA": "English (Saudi Arabia)",
        "en-SG": "English (Singapore)",
        "en-TH": "English (Thailand)",
        "en-US": "English (U.S.)",
        "en-ZA": "English (South Africa)",
        "es": "español",
        "es-AR": "español (Argentina)",
        "es-BO": "español (Bolivia)",
        "es-CL": "español (Chile)",
        "es-CO": "español (Colombia)",
        "es-DO": "español (República Dominicana)",
        "es-EC": "español (Ecuador)",
        "es-ES": "español (España)",
        "es-GT": "español (Guatemala)",
        "es-HN": "español (Honduras)",
        "es-MX": "español (México)",
        "es-NI": "español (Nicaragua)",
        "es-PA": "español (Panamá)",
        "es-PE": "español (Perú)",
        "es-PR": "español (Puerto Rico)",
        "es-PY": "español (Paraguay)",
        "es-SV": "español (El Salvador)",
        "es-US": "español (Estados Unidos)",
        "es-UY": "español (Uruguay)",
        "es-VE": "español (Venezuela)",
        "et": "eesti",
        "et-EE": "eesti (Eesti)",
        "fi": "suomi",
        "fi-FI": "suomi (Suomi)",
        "fr": "français",
        "fr-BE": "français (Belgique)",
        "fr-CA": "français (Canada)",
        "fr-CH": "français (Suisse)",
        "fr-FR": "français (France)",
        "gu": "ગુજરાતી",
        "gu-IN": "ગુજરાતી (ભારત)",
        "he": "עברית",
        "he-IL": "עברית (ישראל)",
        "hi": "हिंदी",
        "hi-IN": "हिंदी (भारत)",
        "hr": "hrvatski",
        "hr-HR": "hrvatski (Hrvatska)",
        "hu": "magyar",
        "hu-HU": "magyar (Magyarország)",
        "id": "Bahasa Indonesia",
        "id-ID": "Bahasa Indonesia (Indonesia)",
        "it": "italiano",
        "it-CH": "italiano (Svizzera)",
        "it-IT": "italiano (Italia)",
        "ja": "日本語",
        "ja-JP": "日本語 (日本)",
        "kn": "ಕನ್ನಡ",
        "kn-IN": "ಕನ್ನಡ (ಭಾರತ)",
        "ko": "한국어",
        "ko-KR": "한국어 (대한민국)",
        "lt": "lietuvių",
        "lt-LT": "lietuvių (Lietuva)",
        "lv": "latviešu",
        "lv-LV": "latviešu (Latvija)",
        "mk": "македонски",
        "mk-MK": "македонски (Македонија)",
        "ml": "മലയാളം",
        "ml-IN": "മലയാളം (ഇന്ത്യ)",
        "mr": "मराठी",
        "mr-IN": "मराठी (भारत)",
        "ms": "Bahasa Melayu",
        "ms-MY": "Bahasa Melayu (Malaysia)",
        "nb": "norsk",
        "nb-NO": "norsk (Norge)",
        "nl": "Nederlands",
        "nl-BE": "Nederlands (België)",
        "nl-NL": "Nederlands (Nederland)",
        "pl": "polski",
        "pl-PL": "polski (Polska)",
        "pt": "português",
        "pt-BR": "português (Brasil)",
        "pt-PT": "português (Portugal)",
        "ro": "română",
        "ro-RO": "română (România)",
        "ru": "русский",
        "ru-RU": "русский (Россия)",
        "sk": "slovenčina",
        "sk-SK": "slovenčina (Slovenská republika)",
        "sl": "slovenščina",
        "sl-SI": "slovenščina (Slovenija)",
        "sr-Cyrl": "Српски",
        "sr-Cyrl-RS": "Српски (Србија)",
        "sr-Latn": "Srpski",
        "sr-Latn-ME": "Srpski (Crna Gora)",
        "sv": "svenska",
        "sv-SE": "svenska (Sverige)",
        "ta": "தமிழ்",
        "ta-IN": "தமிழ் (இந்தியா)",
        "te": "తెలుగు",
        "te-IN": "తెలుగు (భారత దేశం)",
        "th": "ไทย",
        "th-TH": "ไทย (ประเทศไทย)",
        "tl": "Filipino",
        "tl-PH": "Filipino (Pilipinas)",
        "tr": "Türkçe",
        "tr-TR": "Türkçe (Türkiye)",
        "uk": "українська",
        "uk-UA": "українська (Україна)",
        "ur": "اردو",
        "ur-PK": "اردو (پاکستان)",
        "vi": "Tiếng Việt",
        "vi-VN": "Tiếng Việt (Việt Nam)",
        "zh-Hans": "中文（简体）",
        "zh-Hans-CN": "中文 (中国)",
        "zh-Hant": "繁體中文",
        "zh-Hant-HK": "中文 (香港)",
        "zh-Hant-TW": "中文 (臺灣)"
    };

    function isRTL(lang) {
        var pos = lang.indexOf("-");
        if (pos >= 0) {
            lang = lang.substring(0, pos);
        }
        // currently Arabic is our only RTL language
        return lang === "ar";
    }

    LanguagePicker.prototype = {

        install: function(nodeId, langs, defaultLang, pageUrl) {
            var node, selectId, select, i, lang, langName, dir, selected;

            selectId = "yui3-languagepicker";
            node = Y.one("#" + nodeId);
            select = "<select id='" + selectId + "'>";
            for (i = 0; i < langs.length; i++) {
                lang = langs[i];
                langName = langNames[lang] || lang;
                dir = isRTL(lang) ? "rtl" : "ltr";
                selected = lang === defaultLang ? " selected='selected'" : "";
                select += "<option value='" + lang + "' dir='" + dir + "'" + selected + ">" + langName + "</option>";
            }
            select += "</select>";
            node.append(select);

            Y.on("change", function (e) {
                var picker = Y.Node.getDOMNode(Y.one("#" + selectId));
                window.location = pageUrl + "?locale=" + picker.options[picker.selectedIndex].value;
            }, "#" + selectId);
        }

    };

    Y.LanguagePicker = LanguagePicker;

});
