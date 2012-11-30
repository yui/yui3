if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/datatype-date-timezone/datatype-date-timezone.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/datatype-date-timezone/datatype-date-timezone.js",
    code: []
};
_yuitest_coverage["build/datatype-date-timezone/datatype-date-timezone.js"].code=["YUI.add('datatype-date-timezone', function (Y, NAME) {","","/*"," *  Copyright 2012 Yahoo! Inc. All Rights Reserved. Based on code owned by VMWare, Inc. "," */","TimezoneData = {};","","TimezoneData.TRANSITION_YEAR = 2011;","","TimezoneData.TIMEZONE_RULES = [","{","    tzId: \"Asia/Riyadh88\", ","    standard: {","        offset: 187","    }","},","{","    tzId: \"Asia/Kabul\", ","    standard: {","        offset: 270","    }","},","{","    tzId: \"Asia/Yerevan\", ","    standard: {","        offset: 240","    }","},","{","    tzId: \"Asia/Baku\", ","    standard: {","        offset: 240, ","        mon: 10, ","        week: -1, ","        wkday: 1, ","        hour: 5, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: 300, ","        mon: 3, ","        week: -1, ","        wkday: 1, ","        hour: 4, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"Asia/Bahrain\", ","    standard: {","        offset: 180","    }","},","{","    tzId: \"Asia/Dhaka\", ","    standard: {","        offset: 360","    }","},","{","    tzId: \"Asia/Thimphu\", ","    standard: {","        offset: 360","    }","},","{","    tzId: \"Indian/Chagos\", ","    standard: {","        offset: 360","    }","},","{","    tzId: \"Asia/Brunei\", ","    standard: {","        offset: 480","    }","},","{","    tzId: \"Asia/Rangoon\", ","    standard: {","        offset: 390","    }","},","{","    tzId: \"Asia/Phnom_Penh\", ","    standard: {","        offset: 420","    }","},","{","    tzId: \"Asia/Harbin\", ","    standard: {","        offset: 480","    }","},","{","    tzId: \"Asia/Shanghai\", ","    standard: {","        offset: 480","    }","},","{","    tzId: \"Asia/Chongqing\", ","    standard: {","        offset: 480","    }","},","{","    tzId: \"Asia/Urumqi\", ","    standard: {","        offset: 480","    }","},","{","    tzId: \"Asia/Kashgar\", ","    standard: {","        offset: 480","    }","},","{","    tzId: \"Asia/Hong_Kong\", ","    standard: {","        offset: 480","    }","},","{","    tzId: \"Asia/Taipei\", ","    standard: {","        offset: 480","    }","},","{","    tzId: \"Asia/Macau\", ","    standard: {","        offset: 480","    }","},","{","    tzId: \"Asia/Nicosia\", ","    standard: {","        offset: 120","    }","},","{","    tzId: \"Asia/Tbilisi\", ","    standard: {","        offset: 240","    }","},","{","    tzId: \"Asia/Dili\", ","    standard: {","        offset: 540","    }","},","{","    tzId: \"Asia/Kolkata\", ","    standard: {","        offset: 330","    }","},","{","    tzId: \"Asia/Jakarta\", ","    standard: {","        offset: 427","    }","},","{","    tzId: \"Asia/Pontianak\", ","    standard: {","        offset: 540","    }","},","{","    tzId: \"Asia/Tehran\", ","    standard: {","        offset: 210","    }","},","{","    tzId: \"Asia/Baghdad\", ","    standard: {","        offset: 180","    }","},","{","    tzId: \"Asia/Jerusalem\", ","    standard: {","        offset: 120","    }","},","{","    tzId: \"Asia/Tokyo\", ","    standard: {","        offset: 540","    }","},","{","    tzId: \"Asia/Amman\", ","    standard: {","        offset: 120","    }","},","{","    tzId: \"Asia/Almaty\", ","    standard: {","        offset: 360","    }","},","{","    tzId: \"Asia/Qyzylorda\", ","    standard: {","        offset: 360","    }","},","{","    tzId: \"Asia/Aqtobe\", ","    standard: {","        offset: 300","    }","},","{","    tzId: \"Asia/Aqtau\", ","    standard: {","        offset: 300","    }","},","{","    tzId: \"Asia/Oral\", ","    standard: {","        offset: 300","    }","},","{","    tzId: \"Asia/Bishkek\", ","    standard: {","        offset: 360","    }","},","{","    tzId: \"Asia/Seoul\", ","    standard: {","        offset: 540","    }","},","{","    tzId: \"Asia/Kuwait\", ","    standard: {","        offset: 180","    }","},","{","    tzId: \"Asia/Vientiane\", ","    standard: {","        offset: 420","    }","},","{","    tzId: \"Asia/Beirut\", ","    standard: {","        offset: 120","    }","},","{","    tzId: \"Asia/Kuala_Lumpur\", ","    standard: {","        offset: 480","    }","},","{","    tzId: \"Asia/Kuching\", ","    standard: {","        offset: 480","    }","},","{","    tzId: \"Indian/Maldives\", ","    standard: {","        offset: 300","    }","},","{","    tzId: \"Asia/Hovd\", ","    standard: {","        offset: 420","    }","},","{","    tzId: \"Asia/Ulaanbaatar\", ","    standard: {","        offset: 480","    }","},","{","    tzId: \"Asia/Choibalsan\", ","    standard: {","        offset: 480","    }","},","{","    tzId: \"Asia/Kathmandu\", ","    standard: {","        offset: 345","    }","},","{","    tzId: \"Asia/Muscat\", ","    standard: {","        offset: 240","    }","},","{","    tzId: \"Asia/Karachi\", ","    standard: {","        offset: 300","    }","},","{","    tzId: \"Asia/Gaza\", ","    standard: {","        offset: 120","    }","},","{","    tzId: \"Asia/Hebron\", ","    standard: {","        offset: 120","    }","},","{","    tzId: \"Asia/Manila\", ","    standard: {","        offset: 480","    }","},","{","    tzId: \"Asia/Qatar\", ","    standard: {","        offset: 180","    }","},","{","    tzId: \"Asia/Riyadh\", ","    standard: {","        offset: 180","    }","},","{","    tzId: \"Asia/Singapore\", ","    standard: {","        offset: 480","    }","},","{","    tzId: \"Asia/Colombo\", ","    standard: {","        offset: 330","    }","},","{","    tzId: \"Asia/Damascus\", ","    standard: {","        offset: 120, ","        mon: 10, ","        week: -1, ","        wkday: 6, ","        hour: 0, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: 180, ","        mon: 3, ","        week: -1, ","        wkday: 6, ","        hour: 0, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"Asia/Dushanbe\", ","    standard: {","        offset: 300","    }","},","{","    tzId: \"Asia/Bangkok\", ","    standard: {","        offset: 420","    }","},","{","    tzId: \"Asia/Ashgabat\", ","    standard: {","        offset: 300","    }","},","{","    tzId: \"Asia/Dubai\", ","    standard: {","        offset: 240","    }","},","{","    tzId: \"Asia/Samarkand\", ","    standard: {","        offset: 300","    }","},","{","    tzId: \"Asia/Ho_Chi_Minh\", ","    standard: {","        offset: 420","    }","},","{","    tzId: \"Asia/Aden\", ","    standard: {","        offset: 180","    }","},","{","    tzId: \"Australia/Darwin\", ","    standard: {","        offset: 570","    }","},","{","    tzId: \"Australia/Perth\", ","    standard: {","        offset: 525","    }","},","{","    tzId: \"Australia/Brisbane\", ","    standard: {","        offset: 600","    }","},","{","    tzId: \"Australia/Adelaide\", ","    standard: {","        offset: 570, ","        mon: 4, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: 630, ","        mon: 10, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"Australia/Hobart\", ","    standard: {","        offset: 600","    }","},","{","    tzId: \"Australia/Melbourne\", ","    standard: {","        offset: 600, ","        mon: 4, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: 660, ","        mon: 10, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"Australia/Sydney\", ","    standard: {","        offset: 570, ","        mon: 4, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: 630, ","        mon: 10, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"Australia/Lord_Howe\", ","    standard: {","        offset: 630, ","        mon: 4, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: 660, ","        mon: 10, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"Indian/Christmas\", ","    standard: {","        offset: 420","    }","},","{","    tzId: \"Pacific/Rarotonga\", ","    standard: {","        offset: -600","    }","},","{","    tzId: \"Indian/Cocos\", ","    standard: {","        offset: 390","    }","},","{","    tzId: \"Pacific/Fiji\", ","    standard: {","        offset: 720","    }","},","{","    tzId: \"Pacific/Gambier\", ","    standard: {","        offset: -600","    }","},","{","    tzId: \"Pacific/Guam\", ","    standard: {","        offset: 600","    }","},","{","    tzId: \"Pacific/Tarawa\", ","    standard: {","        offset: 840","    }","},","{","    tzId: \"Pacific/Saipan\", ","    standard: {","        offset: 600","    }","},","{","    tzId: \"Pacific/Majuro\", ","    standard: {","        offset: 720","    }","},","{","    tzId: \"Pacific/Chuuk\", ","    standard: {","        offset: 660","    }","},","{","    tzId: \"Pacific/Nauru\", ","    standard: {","        offset: 720","    }","},","{","    tzId: \"Pacific/Noumea\", ","    standard: {","        offset: 660","    }","},","{","    tzId: \"Pacific/Auckland\", ","    standard: {","        offset: 765","    }","},","{","    tzId: \"Pacific/Niue\", ","    standard: {","        offset: -660","    }","},","{","    tzId: \"Pacific/Norfolk\", ","    standard: {","        offset: 690","    }","},","{","    tzId: \"Pacific/Palau\", ","    standard: {","        offset: 540","    }","},","{","    tzId: \"Pacific/Port_Moresby\", ","    standard: {","        offset: 600","    }","},","{","    tzId: \"Pacific/Pitcairn\", ","    standard: {","        offset: -480","    }","},","{","    tzId: \"Pacific/Pago_Pago\", ","    standard: {","        offset: -660","    }","},","{","    tzId: \"Pacific/Apia\", ","    standard: {","        offset: 780","    }","},","{","    tzId: \"Pacific/Guadalcanal\", ","    standard: {","        offset: 660","    }","},","{","    tzId: \"Pacific/Fakaofo\", ","    standard: {","        offset: 840","    }","},","{","    tzId: \"Pacific/Tongatapu\", ","    standard: {","        offset: 780","    }","},","{","    tzId: \"Pacific/Funafuti\", ","    standard: {","        offset: 720","    }","},","{","    tzId: \"Pacific/Johnston\", ","    standard: {","        offset: -600","    }","},","{","    tzId: \"Pacific/Midway\", ","    standard: {","        offset: -660","    }","},","{","    tzId: \"Pacific/Wake\", ","    standard: {","        offset: 720","    }","},","{","    tzId: \"Pacific/Efate\", ","    standard: {","        offset: 660","    }","},","{","    tzId: \"Pacific/Wallis\", ","    standard: {","        offset: 720","    }","},","{","    tzId: \"Etc/GMT\", ","    standard: {","        offset: 0","    }","},","{","    tzId: \"Etc/GMT-14\", ","    standard: {","        offset: 0","    }","},","{","    tzId: \"Asia/Riyadh87\", ","    standard: {","        offset: 187","    }","},","{","    tzId: \"America/Argentina/Buenos_Aires\", ","    standard: {","        offset: -180","    }","},","{","    tzId: \"America/Argentina/Cordoba\", ","    standard: {","        offset: -180","    }","},","{","    tzId: \"America/Argentina/Salta\", ","    standard: {","        offset: -180","    }","},","{","    tzId: \"America/Argentina/Tucuman\", ","    standard: {","        offset: -180","    }","},","{","    tzId: \"America/Argentina/La_Rioja\", ","    standard: {","        offset: -180","    }","},","{","    tzId: \"America/Argentina/San_Juan\", ","    standard: {","        offset: -180","    }","},","{","    tzId: \"America/Argentina/Jujuy\", ","    standard: {","        offset: -180","    }","},","{","    tzId: \"America/Argentina/Catamarca\", ","    standard: {","        offset: -180","    }","},","{","    tzId: \"America/Argentina/Mendoza\", ","    standard: {","        offset: -180","    }","},","{","    tzId: \"America/Argentina/San_Luis\", ","    standard: {","        offset: -240","    }","},","{","    tzId: \"America/Argentina/Rio_Gallegos\", ","    standard: {","        offset: -180","    }","},","{","    tzId: \"America/Argentina/Ushuaia\", ","    standard: {","        offset: -180","    }","},","{","    tzId: \"America/Aruba\", ","    standard: {","        offset: -240","    }","},","{","    tzId: \"America/La_Paz\", ","    standard: {","        offset: -240","    }","},","{","    tzId: \"America/Noronha\", ","    standard: {","        offset: -120","    }","},","{","    tzId: \"America/Belem\", ","    standard: {","        offset: -180","    }","},","{","    tzId: \"America/Santarem\", ","    standard: {","        offset: -180","    }","},","{","    tzId: \"America/Fortaleza\", ","    standard: {","        offset: -180","    }","},","{","    tzId: \"America/Recife\", ","    standard: {","        offset: -180","    }","},","{","    tzId: \"America/Araguaina\", ","    standard: {","        offset: -180","    }","},","{","    tzId: \"America/Maceio\", ","    standard: {","        offset: -180","    }","},","{","    tzId: \"America/Bahia\", ","    standard: {","        offset: -180","    }","},","{","    tzId: \"America/Sao_Paulo\", ","    standard: {","        offset: -180","    }","},","{","    tzId: \"America/Campo_Grande\", ","    standard: {","        offset: -240","    }","},","{","    tzId: \"America/Cuiaba\", ","    standard: {","        offset: -240","    }","},","{","    tzId: \"America/Porto_Velho\", ","    standard: {","        offset: -240","    }","},","{","    tzId: \"America/Boa_Vista\", ","    standard: {","        offset: -240","    }","},","{","    tzId: \"America/Manaus\", ","    standard: {","        offset: -240","    }","},","{","    tzId: \"America/Eirunepe\", ","    standard: {","        offset: -240","    }","},","{","    tzId: \"America/Rio_Branco\", ","    standard: {","        offset: -240","    }","},","{","    tzId: \"America/Santiago\", ","    standard: {","        offset: -360","    }","},","{","    tzId: \"America/Bogota\", ","    standard: {","        offset: -300","    }","},","{","    tzId: \"America/Curacao\", ","    standard: {","        offset: -240","    }","},","{","    tzId: \"America/Guayaquil\", ","    standard: {","        offset: -360","    }","},","{","    tzId: \"Atlantic/Stanley\", ","    standard: {","        offset: -180","    }","},","{","    tzId: \"America/Cayenne\", ","    standard: {","        offset: -180","    }","},","{","    tzId: \"America/Guyana\", ","    standard: {","        offset: -180","    }","},","{","    tzId: \"America/Asuncion\", ","    standard: {","        offset: -240, ","        mon: 4, ","        week: 2, ","        wkday: 1, ","        hour: 0, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -180, ","        mon: 10, ","        week: 2, ","        wkday: 1, ","        hour: 0, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Lima\", ","    standard: {","        offset: -300","    }","},","{","    tzId: \"Atlantic/South_Georgia\", ","    standard: {","        offset: -120","    }","},","{","    tzId: \"America/Paramaribo\", ","    standard: {","        offset: -180","    }","},","{","    tzId: \"America/Port_of_Spain\", ","    standard: {","        offset: -240","    }","},","{","    tzId: \"America/Montevideo\", ","    standard: {","        offset: -180","    }","},","{","    tzId: \"America/Caracas\", ","    standard: {","        offset: -210","    }","},","{","    tzId: \"Antarctica/Casey\", ","    standard: {","        offset: 480","    }","},","{","    tzId: \"Antarctica/Davis\", ","    standard: {","        offset: 360","    }","},","{","    tzId: \"Antarctica/Macquarie\", ","    standard: {","        offset: 660","    }","},","{","    tzId: \"Indian/Kerguelen\", ","    standard: {","        offset: 300","    }","},","{","    tzId: \"Antarctica/DumontDUrville\", ","    standard: {","        offset: 600","    }","},","{","    tzId: \"Antarctica/Syowa\", ","    standard: {","        offset: 180","    }","},","{","    tzId: \"Antarctica/Vostok\", ","    standard: {","        offset: 360","    }","},","{","    tzId: \"Antarctica/Rothera\", ","    standard: {","        offset: -180","    }","},","{","    tzId: \"Antarctica/Palmer\", ","    standard: {","        offset: -240","    }","},","{","    tzId: \"Antarctica/McMurdo\", ","    standard: {","        offset: 720","    }","},","{","    tzId: \"Asia/Riyadh89\", ","    standard: {","        offset: 187","    }","},","{","    tzId: \"Africa/Algiers\", ","    standard: {","        offset: 60","    }","},","{","    tzId: \"Africa/Luanda\", ","    standard: {","        offset: 60","    }","},","{","    tzId: \"Africa/Porto-Novo\", ","    standard: {","        offset: 60","    }","},","{","    tzId: \"Africa/Gaborone\", ","    standard: {","        offset: 120","    }","},","{","    tzId: \"Africa/Ouagadougou\", ","    standard: {","        offset: 0","    }","},","{","    tzId: \"Africa/Bujumbura\", ","    standard: {","        offset: 120","    }","},","{","    tzId: \"Africa/Douala\", ","    standard: {","        offset: 60","    }","},","{","    tzId: \"Atlantic/Cape_Verde\", ","    standard: {","        offset: -60","    }","},","{","    tzId: \"Africa/Bangui\", ","    standard: {","        offset: 60","    }","},","{","    tzId: \"Africa/Ndjamena\", ","    standard: {","        offset: 60","    }","},","{","    tzId: \"Indian/Comoro\", ","    standard: {","        offset: 180","    }","},","{","    tzId: \"Africa/Kinshasa\", ","    standard: {","        offset: 120","    }","},","{","    tzId: \"Africa/Brazzaville\", ","    standard: {","        offset: 60","    }","},","{","    tzId: \"Africa/Abidjan\", ","    standard: {","        offset: 0","    }","},","{","    tzId: \"Africa/Djibouti\", ","    standard: {","        offset: 180","    }","},","{","    tzId: \"Africa/Cairo\", ","    standard: {","        offset: 120","    }","},","{","    tzId: \"Africa/Malabo\", ","    standard: {","        offset: 60","    }","},","{","    tzId: \"Africa/Asmara\", ","    standard: {","        offset: 180","    }","},","{","    tzId: \"Africa/Addis_Ababa\", ","    standard: {","        offset: 180","    }","},","{","    tzId: \"Africa/Libreville\", ","    standard: {","        offset: 60","    }","},","{","    tzId: \"Africa/Banjul\", ","    standard: {","        offset: 0","    }","},","{","    tzId: \"Africa/Accra\", ","    standard: {","        offset: 0","    }","},","{","    tzId: \"Africa/Conakry\", ","    standard: {","        offset: 0","    }","},","{","    tzId: \"Africa/Bissau\", ","    standard: {","        offset: 0","    }","},","{","    tzId: \"Africa/Nairobi\", ","    standard: {","        offset: 180","    }","},","{","    tzId: \"Africa/Maseru\", ","    standard: {","        offset: 120","    }","},","{","    tzId: \"Africa/Monrovia\", ","    standard: {","        offset: 0","    }","},","{","    tzId: \"Africa/Tripoli\", ","    standard: {","        offset: 60","    }","},","{","    tzId: \"Indian/Antananarivo\", ","    standard: {","        offset: 180","    }","},","{","    tzId: \"Africa/Blantyre\", ","    standard: {","        offset: 120","    }","},","{","    tzId: \"Africa/Bamako\", ","    standard: {","        offset: 0","    }","},","{","    tzId: \"Africa/Nouakchott\", ","    standard: {","        offset: 0","    }","},","{","    tzId: \"Indian/Mauritius\", ","    standard: {","        offset: 240","    }","},","{","    tzId: \"Indian/Mayotte\", ","    standard: {","        offset: 180","    }","},","{","    tzId: \"Africa/Casablanca\", ","    standard: {","        offset: 0, ","        mon: 9, ","        week: -1, ","        wkday: 1, ","        hour: 3, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: 60, ","        mon: 4, ","        week: -1, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"Africa/El_Aaiun\", ","    standard: {","        offset: 0","    }","},","{","    tzId: \"Africa/Maputo\", ","    standard: {","        offset: 120","    }","},","{","    tzId: \"Africa/Windhoek\", ","    standard: {","        offset: 60","    }","},","{","    tzId: \"Africa/Niamey\", ","    standard: {","        offset: 60","    }","},","{","    tzId: \"Africa/Lagos\", ","    standard: {","        offset: 60","    }","},","{","    tzId: \"Indian/Reunion\", ","    standard: {","        offset: 240","    }","},","{","    tzId: \"Africa/Kigali\", ","    standard: {","        offset: 120","    }","},","{","    tzId: \"Atlantic/St_Helena\", ","    standard: {","        offset: 0","    }","},","{","    tzId: \"Africa/Sao_Tome\", ","    standard: {","        offset: 0","    }","},","{","    tzId: \"Africa/Dakar\", ","    standard: {","        offset: 0","    }","},","{","    tzId: \"Indian/Mahe\", ","    standard: {","        offset: 240","    }","},","{","    tzId: \"Africa/Freetown\", ","    standard: {","        offset: 0","    }","},","{","    tzId: \"Africa/Mogadishu\", ","    standard: {","        offset: 180","    }","},","{","    tzId: \"Africa/Johannesburg\", ","    standard: {","        offset: 120","    }","},","{","    tzId: \"Africa/Khartoum\", ","    standard: {","        offset: 180","    }","},","{","    tzId: \"Africa/Juba\", ","    standard: {","        offset: 180","    }","},","{","    tzId: \"Africa/Mbabane\", ","    standard: {","        offset: 120","    }","},","{","    tzId: \"Africa/Dar_es_Salaam\", ","    standard: {","        offset: 180","    }","},","{","    tzId: \"Africa/Lome\", ","    standard: {","        offset: 0","    }","},","{","    tzId: \"Africa/Tunis\", ","    standard: {","        offset: 60","    }","},","{","    tzId: \"Africa/Kampala\", ","    standard: {","        offset: 180","    }","},","{","    tzId: \"Africa/Lusaka\", ","    standard: {","        offset: 120","    }","},","{","    tzId: \"Africa/Harare\", ","    standard: {","        offset: 120","    }","},","{","    tzId: \"Europe/London\", ","    standard: {","        offset: 0","    }","},","{","    tzId: \"WET\", ","    standard: {","        offset: 0","    }","},","{","    tzId: \"Europe/Tirane\", ","    standard: {","        offset: 60","    }","},","{","    tzId: \"Europe/Andorra\", ","    standard: {","        offset: 60","    }","},","{","    tzId: \"Europe/Vienna\", ","    standard: {","        offset: 60","    }","},","{","    tzId: \"Europe/Minsk\", ","    standard: {","        offset: 180","    }","},","{","    tzId: \"Europe/Brussels\", ","    standard: {","        offset: 60","    }","},","{","    tzId: \"Europe/Sofia\", ","    standard: {","        offset: 120","    }","},","{","    tzId: \"Europe/Prague\", ","    standard: {","        offset: 60","    }","},","{","    tzId: \"Europe/Copenhagen\", ","    standard: {","        offset: 0","    }","},","{","    tzId: \"America/Danmarkshavn\", ","    standard: {","        offset: -240, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -180, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"Europe/Tallinn\", ","    standard: {","        offset: 120","    }","},","{","    tzId: \"Europe/Helsinki\", ","    standard: {","        offset: 120","    }","},","{","    tzId: \"Europe/Paris\", ","    standard: {","        offset: 9","    }","},","{","    tzId: \"Europe/Berlin\", ","    standard: {","        offset: 60","    }","},","{","    tzId: \"Europe/Gibraltar\", ","    standard: {","        offset: 60","    }","},","{","    tzId: \"Europe/Athens\", ","    standard: {","        offset: 120","    }","},","{","    tzId: \"Europe/Budapest\", ","    standard: {","        offset: 60","    }","},","{","    tzId: \"Atlantic/Reykjavik\", ","    standard: {","        offset: 0","    }","},","{","    tzId: \"Europe/Rome\", ","    standard: {","        offset: 60","    }","},","{","    tzId: \"Europe/Riga\", ","    standard: {","        offset: 120","    }","},","{","    tzId: \"Europe/Vaduz\", ","    standard: {","        offset: 60","    }","},","{","    tzId: \"Europe/Vilnius\", ","    standard: {","        offset: 120","    }","},","{","    tzId: \"Europe/Luxembourg\", ","    standard: {","        offset: 60","    }","},","{","    tzId: \"Europe/Malta\", ","    standard: {","        offset: 60","    }","},","{","    tzId: \"Europe/Chisinau\", ","    standard: {","        offset: 120","    }","},","{","    tzId: \"Europe/Monaco\", ","    standard: {","        offset: 60","    }","},","{","    tzId: \"Europe/Amsterdam\", ","    standard: {","        offset: 60","    }","},","{","    tzId: \"Europe/Oslo\", ","    standard: {","        offset: 60","    }","},","{","    tzId: \"Europe/Warsaw\", ","    standard: {","        offset: 60","    }","},","{","    tzId: \"Europe/Lisbon\", ","    standard: {","        offset: 0","    }","},","{","    tzId: \"Europe/Bucharest\", ","    standard: {","        offset: 120","    }","},","{","    tzId: \"Europe/Kaliningrad\", ","    standard: {","        offset: 180","    }","},","{","    tzId: \"Europe/Moscow\", ","    standard: {","        offset: 240","    }","},","{","    tzId: \"Europe/Volgograd\", ","    standard: {","        offset: 240","    }","},","{","    tzId: \"Europe/Samara\", ","    standard: {","        offset: 240","    }","},","{","    tzId: \"Asia/Yekaterinburg\", ","    standard: {","        offset: 360","    }","},","{","    tzId: \"Asia/Omsk\", ","    standard: {","        offset: 420","    }","},","{","    tzId: \"Asia/Novosibirsk\", ","    standard: {","        offset: 420","    }","},","{","    tzId: \"Asia/Novokuznetsk\", ","    standard: {","        offset: 420","    }","},","{","    tzId: \"Asia/Krasnoyarsk\", ","    standard: {","        offset: 480","    }","},","{","    tzId: \"Asia/Irkutsk\", ","    standard: {","        offset: 540","    }","},","{","    tzId: \"Asia/Yakutsk\", ","    standard: {","        offset: 600","    }","},","{","    tzId: \"Asia/Vladivostok\", ","    standard: {","        offset: 660","    }","},","{","    tzId: \"Asia/Sakhalin\", ","    standard: {","        offset: 660","    }","},","{","    tzId: \"Asia/Magadan\", ","    standard: {","        offset: 720","    }","},","{","    tzId: \"Asia/Kamchatka\", ","    standard: {","        offset: 720","    }","},","{","    tzId: \"Asia/Anadyr\", ","    standard: {","        offset: 720","    }","},","{","    tzId: \"Europe/Belgrade\", ","    standard: {","        offset: 60","    }","},","{","    tzId: \"Europe/Madrid\", ","    standard: {","        offset: 0","    }","},","{","    tzId: \"Europe/Stockholm\", ","    standard: {","        offset: 60","    }","},","{","    tzId: \"Europe/Zurich\", ","    standard: {","        offset: 60","    }","},","{","    tzId: \"Europe/Istanbul\", ","    standard: {","        offset: 0","    }","},","{","    tzId: \"Europe/Kiev\", ","    standard: {","        offset: 120","    }","},","{","    tzId: \"Europe/Uzhgorod\", ","    standard: {","        offset: 120","    }","},","{","    tzId: \"Europe/Zaporozhye\", ","    standard: {","        offset: 120","    }","},","{","    tzId: \"Europe/Simferopol\", ","    standard: {","        offset: 120","    }","},","{","    tzId: \"EST\", ","    standard: {","        offset: 0","    }","},","{","    tzId: \"America/New_York\", ","    standard: {","        offset: -300, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -240, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Chicago\", ","    standard: {","        offset: -360, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -300, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/North_Dakota/Center\", ","    standard: {","        offset: -360, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -300, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/North_Dakota/New_Salem\", ","    standard: {","        offset: -360, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -300, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/North_Dakota/Beulah\", ","    standard: {","        offset: -360, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -300, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Denver\", ","    standard: {","        offset: -420, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -360, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Los_Angeles\", ","    standard: {","        offset: -480, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -420, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Juneau\", ","    standard: {","        offset: -600, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -540, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"Pacific/Honolulu\", ","    standard: {","        offset: -600","    }","},","{","    tzId: \"America/Phoenix\", ","    standard: {","        offset: -420","    }","},","{","    tzId: \"America/Boise\", ","    standard: {","        offset: -420, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -360, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Indiana/Indianapolis\", ","    standard: {","        offset: -300, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -240, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Indiana/Marengo\", ","    standard: {","        offset: -300, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -240, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Indiana/Vincennes\", ","    standard: {","        offset: -300, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -240, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Indiana/Tell_City\", ","    standard: {","        offset: -360, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -300, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Indiana/Petersburg\", ","    standard: {","        offset: -300, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -240, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Indiana/Knox\", ","    standard: {","        offset: -360, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -300, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Indiana/Winamac\", ","    standard: {","        offset: -300, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -240, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Indiana/Vevay\", ","    standard: {","        offset: -300, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -240, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Kentucky/Louisville\", ","    standard: {","        offset: -300, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -240, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Kentucky/Monticello\", ","    standard: {","        offset: -300, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -240, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Detroit\", ","    standard: {","        offset: -300, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -240, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Menominee\", ","    standard: {","        offset: -360, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -300, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/St_Johns\", ","    standard: {","        offset: -150, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -90, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Goose_Bay\", ","    standard: {","        offset: -240, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -180, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Halifax\", ","    standard: {","        offset: -240, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -180, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Moncton\", ","    standard: {","        offset: -240, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -180, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Blanc-Sablon\", ","    standard: {","        offset: -300, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -240, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Toronto\", ","    standard: {","        offset: -300","    }","},","{","    tzId: \"America/Winnipeg\", ","    standard: {","        offset: -360, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -300, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Regina\", ","    standard: {","        offset: -360","    }","},","{","    tzId: \"America/Edmonton\", ","    standard: {","        offset: -420, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -360, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Vancouver\", ","    standard: {","        offset: -420","    }","},","{","    tzId: \"America/Pangnirtung\", ","    standard: {","        offset: -300, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -240, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Iqaluit\", ","    standard: {","        offset: -300, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -240, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Resolute\", ","    standard: {","        offset: -360, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -300, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Rankin_Inlet\", ","    standard: {","        offset: -360, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -300, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Cambridge_Bay\", ","    standard: {","        offset: -480, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -420, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Cancun\", ","    standard: {","        offset: -360, ","        mon: 10, ","        week: -1, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -300, ","        mon: 4, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Merida\", ","    standard: {","        offset: -360, ","        mon: 10, ","        week: -1, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -300, ","        mon: 4, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Matamoros\", ","    standard: {","        offset: -360, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -300, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Monterrey\", ","    standard: {","        offset: -360, ","        mon: 10, ","        week: -1, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -300, ","        mon: 4, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Mexico_City\", ","    standard: {","        offset: -360, ","        mon: 10, ","        week: -1, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -300, ","        mon: 4, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Ojinaga\", ","    standard: {","        offset: -420, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -360, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Chihuahua\", ","    standard: {","        offset: -420, ","        mon: 10, ","        week: -1, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -360, ","        mon: 4, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Hermosillo\", ","    standard: {","        offset: -420","    }","},","{","    tzId: \"America/Mazatlan\", ","    standard: {","        offset: -420, ","        mon: 10, ","        week: -1, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -360, ","        mon: 4, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Bahia_Banderas\", ","    standard: {","        offset: -360, ","        mon: 10, ","        week: -1, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -300, ","        mon: 4, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Tijuana\", ","    standard: {","        offset: -480, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -420, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Santa_Isabel\", ","    standard: {","        offset: -480, ","        mon: 10, ","        week: -1, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -420, ","        mon: 4, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Anguilla\", ","    standard: {","        offset: -240","    }","},","{","    tzId: \"America/Antigua\", ","    standard: {","        offset: -240","    }","},","{","    tzId: \"America/Nassau\", ","    standard: {","        offset: -300, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -240, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Barbados\", ","    standard: {","        offset: -240","    }","},","{","    tzId: \"America/Belize\", ","    standard: {","        offset: -360","    }","},","{","    tzId: \"Atlantic/Bermuda\", ","    standard: {","        offset: -240, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -180, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Cayman\", ","    standard: {","        offset: -300","    }","},","{","    tzId: \"America/Costa_Rica\", ","    standard: {","        offset: -360","    }","},","{","    tzId: \"America/Havana\", ","    standard: {","        offset: -300","    }","},","{","    tzId: \"America/Dominica\", ","    standard: {","        offset: -240","    }","},","{","    tzId: \"America/Santo_Domingo\", ","    standard: {","        offset: -240","    }","},","{","    tzId: \"America/El_Salvador\", ","    standard: {","        offset: -360","    }","},","{","    tzId: \"America/Grenada\", ","    standard: {","        offset: -240","    }","},","{","    tzId: \"America/Guadeloupe\", ","    standard: {","        offset: -240","    }","},","{","    tzId: \"America/Guatemala\", ","    standard: {","        offset: -360","    }","},","{","    tzId: \"America/Port-au-Prince\", ","    standard: {","        offset: -300","    }","},","{","    tzId: \"America/Tegucigalpa\", ","    standard: {","        offset: -360","    }","},","{","    tzId: \"America/Jamaica\", ","    standard: {","        offset: -300","    }","},","{","    tzId: \"America/Martinique\", ","    standard: {","        offset: -240","    }","},","{","    tzId: \"America/Montserrat\", ","    standard: {","        offset: -240","    }","},","{","    tzId: \"America/Managua\", ","    standard: {","        offset: -360","    }","},","{","    tzId: \"America/Panama\", ","    standard: {","        offset: -300","    }","},","{","    tzId: \"America/Puerto_Rico\", ","    standard: {","        offset: -240","    }","},","{","    tzId: \"America/St_Kitts\", ","    standard: {","        offset: -240","    }","},","{","    tzId: \"America/St_Lucia\", ","    standard: {","        offset: -240","    }","},","{","    tzId: \"America/Miquelon\", ","    standard: {","        offset: -180, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -120, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/St_Vincent\", ","    standard: {","        offset: -240","    }","},","{","    tzId: \"America/Grand_Turk\", ","    standard: {","        offset: -300, ","        mon: 11, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    },","    daylight: {","        offset: -240, ","        mon: 3, ","        week: 2, ","        wkday: 1, ","        hour: 2, ","        min: 0, ","        sec: 0","    }","},","{","    tzId: \"America/Tortola\", ","    standard: {","        offset: -240","    }","},","{","    tzId: \"America/St_Thomas\", ","    standard: {","        offset: -240","    }","}","];","TimezoneLinks = {","    \"Mideast/Riyadh88\": \"Asia/Riyadh88\",","    \"Europe/Nicosia\": \"Asia/Nicosia\",","    \"US/Pacific-New\": \"America/Los_Angeles\",","    \"GMT\": \"Etc/GMT\",","    \"Etc/UTC\": \"Etc/GMT\",","    \"Etc/Universal\": \"Etc/UTC\",","    \"Etc/Zulu\": \"Etc/UTC\",","    \"Etc/Greenwich\": \"Etc/GMT\",","    \"Etc/GMT-0\": \"Etc/GMT\",","    \"Etc/GMT+0\": \"Etc/GMT\",","    \"Etc/GMT0\": \"Etc/GMT\",","    \"Mideast/Riyadh87\": \"Asia/Riyadh87\",","    \"America/Lower_Princes\": \"America/Curacao\",","    \"America/Kralendijk\": \"America/Curacao\",","    \"Antarctica/South_Pole\": \"Antarctica/McMurdo\",","    \"Mideast/Riyadh89\": \"Asia/Riyadh89\",","    \"Africa/Asmera\": \"Africa/Asmara\",","    \"Africa/Timbuktu\": \"Africa/Bamako\",","    \"America/Argentina/ComodRivadavia\": \"America/Argentina/Catamarca\",","    \"America/Atka\": \"America/Adak\",","    \"America/Buenos_Aires\": \"America/Argentina/Buenos_Aires\",","    \"America/Catamarca\": \"America/Argentina/Catamarca\",","    \"America/Coral_Harbour\": \"America/Atikokan\",","    \"America/Cordoba\": \"America/Argentina/Cordoba\",","    \"America/Ensenada\": \"America/Tijuana\",","    \"America/Fort_Wayne\": \"America/Indiana/Indianapolis\",","    \"America/Indianapolis\": \"America/Indiana/Indianapolis\",","    \"America/Jujuy\": \"America/Argentina/Jujuy\",","    \"America/Knox_IN\": \"America/Indiana/Knox\",","    \"America/Louisville\": \"America/Kentucky/Louisville\",","    \"America/Mendoza\": \"America/Argentina/Mendoza\",","    \"America/Porto_Acre\": \"America/Rio_Branco\",","    \"America/Rosario\": \"America/Argentina/Cordoba\",","    \"America/Virgin\": \"America/St_Thomas\",","    \"Asia/Ashkhabad\": \"Asia/Ashgabat\",","    \"Asia/Chungking\": \"Asia/Chongqing\",","    \"Asia/Dacca\": \"Asia/Dhaka\",","    \"Asia/Katmandu\": \"Asia/Kathmandu\",","    \"Asia/Calcutta\": \"Asia/Kolkata\",","    \"Asia/Macao\": \"Asia/Macau\",","    \"Asia/Tel_Aviv\": \"Asia/Jerusalem\",","    \"Asia/Saigon\": \"Asia/Ho_Chi_Minh\",","    \"Asia/Thimbu\": \"Asia/Thimphu\",","    \"Asia/Ujung_Pandang\": \"Asia/Makassar\",","    \"Asia/Ulan_Bator\": \"Asia/Ulaanbaatar\",","    \"Atlantic/Faeroe\": \"Atlantic/Faroe\",","    \"Atlantic/Jan_Mayen\": \"Europe/Oslo\",","    \"Australia/ACT\": \"Australia/Sydney\",","    \"Australia/Canberra\": \"Australia/Sydney\",","    \"Australia/LHI\": \"Australia/Lord_Howe\",","    \"Australia/NSW\": \"Australia/Sydney\",","    \"Australia/North\": \"Australia/Darwin\",","    \"Australia/Queensland\": \"Australia/Brisbane\",","    \"Australia/South\": \"Australia/Adelaide\",","    \"Australia/Tasmania\": \"Australia/Hobart\",","    \"Australia/Victoria\": \"Australia/Melbourne\",","    \"Australia/West\": \"Australia/Perth\",","    \"Australia/Yancowinna\": \"Australia/Broken_Hill\",","    \"Brazil/Acre\": \"America/Rio_Branco\",","    \"Brazil/DeNoronha\": \"America/Noronha\",","    \"Brazil/East\": \"America/Sao_Paulo\",","    \"Brazil/West\": \"America/Manaus\",","    \"Canada/Atlantic\": \"America/Halifax\",","    \"Canada/Central\": \"America/Winnipeg\",","    \"Canada/East-Saskatchewan\": \"America/Regina\",","    \"Canada/Eastern\": \"America/Toronto\",","    \"Canada/Mountain\": \"America/Edmonton\",","    \"Canada/Newfoundland\": \"America/St_Johns\",","    \"Canada/Pacific\": \"America/Vancouver\",","    \"Canada/Saskatchewan\": \"America/Regina\",","    \"Canada/Yukon\": \"America/Whitehorse\",","    \"Chile/Continental\": \"America/Santiago\",","    \"Chile/EasterIsland\": \"Pacific/Easter\",","    \"Cuba\": \"America/Havana\",","    \"Egypt\": \"Africa/Cairo\",","    \"Eire\": \"Europe/Dublin\",","    \"Europe/Belfast\": \"Europe/London\",","    \"Europe/Tiraspol\": \"Europe/Chisinau\",","    \"GB\": \"Europe/London\",","    \"GB-Eire\": \"Europe/London\",","    \"GMT+0\": \"Etc/GMT\",","    \"GMT-0\": \"Etc/GMT\",","    \"GMT0\": \"Etc/GMT\",","    \"Greenwich\": \"Etc/GMT\",","    \"Hongkong\": \"Asia/Hong_Kong\",","    \"Iceland\": \"Atlantic/Reykjavik\",","    \"Iran\": \"Asia/Tehran\",","    \"Israel\": \"Asia/Jerusalem\",","    \"Jamaica\": \"America/Jamaica\",","    \"Japan\": \"Asia/Tokyo\",","    \"Kwajalein\": \"Pacific/Kwajalein\",","    \"Libya\": \"Africa/Tripoli\",","    \"Mexico/BajaNorte\": \"America/Tijuana\",","    \"Mexico/BajaSur\": \"America/Mazatlan\",","    \"Mexico/General\": \"America/Mexico_City\",","    \"NZ\": \"Pacific/Auckland\",","    \"NZ-CHAT\": \"Pacific/Chatham\",","    \"Navajo\": \"America/Denver\",","    \"PRC\": \"Asia/Shanghai\",","    \"Pacific/Samoa\": \"Pacific/Pago_Pago\",","    \"Pacific/Yap\": \"Pacific/Chuuk\",","    \"Pacific/Truk\": \"Pacific/Chuuk\",","    \"Pacific/Ponape\": \"Pacific/Pohnpei\",","    \"Poland\": \"Europe/Warsaw\",","    \"Portugal\": \"Europe/Lisbon\",","    \"ROC\": \"Asia/Taipei\",","    \"ROK\": \"Asia/Seoul\",","    \"Singapore\": \"Asia/Singapore\",","    \"Turkey\": \"Europe/Istanbul\",","    \"UCT\": \"Etc/UCT\",","    \"US/Alaska\": \"America/Anchorage\",","    \"US/Aleutian\": \"America/Adak\",","    \"US/Arizona\": \"America/Phoenix\",","    \"US/Central\": \"America/Chicago\",","    \"US/East-Indiana\": \"America/Indiana/Indianapolis\",","    \"US/Eastern\": \"America/New_York\",","    \"US/Hawaii\": \"Pacific/Honolulu\",","    \"US/Indiana-Starke\": \"America/Indiana/Knox\",","    \"US/Michigan\": \"America/Detroit\",","    \"US/Mountain\": \"America/Denver\",","    \"US/Pacific\": \"America/Los_Angeles\",","    \"US/Samoa\": \"Pacific/Pago_Pago\",","    \"UTC\": \"Etc/UTC\",","    \"Universal\": \"Etc/UTC\",","    \"W-SU\": \"Europe/Moscow\",","    \"Zulu\": \"Etc/UTC\",","    \"Europe/Mariehamn\": \"Europe/Helsinki\",","    \"Europe/Vatican\": \"Europe/Rome\",","    \"Europe/San_Marino\": \"Europe/Rome\",","    \"Arctic/Longyearbyen\": \"Europe/Oslo\",","    \"Europe/Ljubljana\": \"Europe/Belgrade\",","    \"Europe/Podgorica\": \"Europe/Belgrade\",","    \"Europe/Sarajevo\": \"Europe/Belgrade\",","    \"Europe/Skopje\": \"Europe/Belgrade\",","    \"Europe/Zagreb\": \"Europe/Belgrade\",","    \"Europe/Bratislava\": \"Europe/Prague\",","    \"America/Shiprock\": \"America/Denver\",","    \"America/St_Barthelemy\": \"America/Guadeloupe\",","    \"America/Marigot\": \"America/Guadeloupe\"","};","/**"," * Timezone performs operations on a given timezone string represented in Olson tz database "," * This module uses parts of zimbra AjxTimezone to handle time-zones"," * @module yTimezone"," * @requires tzoneData, tzoneLinks, yDateFormatData"," */","","var MODULE_NAME = \"datatype-date-timezone\";","    ","AjxTimezone = function() {","    this.localeData = Y.Intl.get(MODULE_NAME);","};","","//","// Static methods","//","","AjxTimezone.getTransition = function(onset, year) {","    var trans = [ year || new Date().getFullYear(), onset.mon, 1 ];","    if (onset.mday) {","        trans[2] = onset.mday;","    }","    else if (onset.wkday) {","        var date = new Date(year, onset.mon - 1, 1, onset.hour, onset.min, onset.sec);","","        // last wkday of month","        var wkday, adjust;","        if (onset.week == -1) {","            // NOTE: This creates a date of the *last* day of specified month by","            //       setting the month to *next* month and setting day of month","            //       to zero (i.e. the day *before* the first day).","            var last = new Date(new Date(date.getTime()).setMonth(onset.mon, 0));","            var count = last.getDate();","            wkday = last.getDay() + 1;","            adjust = wkday >= onset.wkday ? wkday - onset.wkday : 7 - onset.wkday - wkday;","            trans[2] = count - adjust;","        }","","        // Nth wkday of month","        else {","            wkday = date.getDay() + 1;","            adjust = onset.wkday == wkday ? 1 :0;","            trans[2] = onset.wkday + 7 * (onset.week - adjust) - wkday + 1;","        }","    }","    return trans;","};","","AjxTimezone.addWkDayTransition = function(onset) {","    var trans = onset.trans;","    var mon = trans[1];","    var monDay = trans[2];","    var week = Math.floor((monDay - 1) / 7);","    var date = new Date(trans[0], trans[1] - 1, trans[2], 12, 0, 0);","","    // NOTE: This creates a date of the *last* day of specified month by","    //       setting the month to *next* month and setting day of month","    //       to zero (i.e. the day *before* the first day).","    var count = new Date(new Date(date.getTime()).setMonth(mon - 1, 0)).getDate();","    var last = count - monDay < 7;","","    // set onset values","    onset.mon =  mon;","    onset.week = last ? -1 : week + 1;","    onset.wkday = date.getDay() + 1;","    onset.hour = trans[3];","    onset.min = trans[4];","    onset.sec = trans[5];","    return onset;","};","","AjxTimezone.createTransitionDate = function(onset) {","    var date = new Date(TimezoneData.TRANSITION_YEAR, onset.mon - 1, 1, 12, 0, 0);","    if (onset.mday) {","        date.setDate(onset.mday);","    }","    else if (onset.week == -1) {","        date.setMonth(date.getMonth() + 1, 0);","        for (var i = 0; i < 7; i++) {","            if (date.getDay() + 1 == onset.wkday) {","                break;","            }","            date.setDate(date.getDate() - 1);","        }","    }","    else {","        for (i = 0; i < 7; i++) {","            if (date.getDay() + 1 == onset.wkday) {","                break;","            }","            date.setDate(date.getDate() + 1);","        }","        date.setDate(date.getDate() + 7 * (onset.week - 1));","    }","    var trans = [ date.getFullYear(), date.getMonth() + 1, date.getDate() ];","    return trans;","};","","AjxTimezone.prototype.getShortName = function(tzId) {","    var shortName = this.localeData[tzId + \"_Z_short\"] || [\"GMT\",AjxTimezone._SHORT_NAMES[tzId]].join(\"\");","    return shortName;","};","AjxTimezone.prototype.getMediumName = function(tzId) {","    var mediumName = this.localeData[tzId + \"_Z_abbreviated\"] || ['(',this.getShortName(tzId),') ',tzId].join(\"\");","    return mediumName;","};","AjxTimezone.prototype.getLongName = AjxTimezone.prototype.getMediumName;","","AjxTimezone.addRule = function(rule) {","    var tzId = rule.tzId;","","    AjxTimezone._SHORT_NAMES[tzId] = AjxTimezone._generateShortName(rule.standard.offset);","    AjxTimezone._CLIENT2RULE[tzId] = rule;","","    var array = rule.daylight ? AjxTimezone.DAYLIGHT_RULES : AjxTimezone.STANDARD_RULES;","    array.push(rule);","};","","AjxTimezone.getRule = function(tzId, tz) {","    var rule = AjxTimezone._CLIENT2RULE[tzId];","    if (!rule && tz) {","        var names = [ \"standard\", \"daylight\" ];","        var rules = tz.daylight ? AjxTimezone.DAYLIGHT_RULES : AjxTimezone.STANDARD_RULES;","        for (var i = 0; i < rules.length; i++) {","            rule = rules[i];","","            var found = true;","            for (var j = 0; j < names.length; j++) {","                var name = names[j];","                var onset = rule[name];","                if (!onset) continue;","			","                var breakOuter = false;","","                for (var p in tz[name]) {","                    if (tz[name][p] != onset[p]) {","                        found = false;","                        breakOuter = true;","                        break;","                    }","                }","                ","                if(breakOuter){","                    break;","                }","            }","            if (found) {","                return rule;","            }","        }","        return null;","    }","","    return rule;","};","","AjxTimezone.getOffset = function(tzId, date) {","    var rule = AjxTimezone.getRule(tzId);","    if (rule && rule.daylight) {","        var year = date.getFullYear();","","        var standard = rule.standard, daylight  = rule.daylight;","        var stdTrans = AjxTimezone.getTransition(standard, year);","        var dstTrans = AjxTimezone.getTransition(daylight, year);","","        var month    = date.getMonth()+1, day = date.getDate();","        var stdMonth = stdTrans[1], stdDay = stdTrans[2];","        var dstMonth = dstTrans[1], dstDay = dstTrans[2];","","        // northern hemisphere","        var isDST = false;","        if (dstMonth < stdMonth) {","            isDST = month > dstMonth && month < stdMonth;","            isDST = isDST || (month == dstMonth && day >= dstDay);","            isDST = isDST || (month == stdMonth && day <  stdDay);","        }","","        // sorthern hemisphere","        else {","            isDST = month < dstMonth || month > stdMonth;","            isDST = isDST || (month == dstMonth && day <  dstDay);","            isDST = isDST || (month == stdMonth && day >= stdDay);","        }","","        return isDST ? daylight.offset : standard.offset;","    }","    return rule ? rule.standard.offset : -(new Date().getTimezoneOffset());","};","","AjxTimezone._BY_OFFSET = function(arule, brule) {","    // sort by offset and then by name","    var delta = arule.standard.offset - brule.standard.offset;","    if (delta == 0) {","        var aname = arule.tzId;","        var bname = brule.tzId;","        if (aname < bname) delta = -1;","        else if (aname > bname) delta = 1;","    }","    return delta;","};","","// Constants","","AjxTimezone._SHORT_NAMES = {};","AjxTimezone._CLIENT2RULE = {};","","/** "," * The data is specified using the server identifiers for historical"," * reasons. Perhaps in the future we'll use the client (i.e. Java)"," * identifiers on the server as well."," */","AjxTimezone.STANDARD_RULES = [];","AjxTimezone.DAYLIGHT_RULES = [];","(function() {","    for (var i = 0; i < TimezoneData.TIMEZONE_RULES.length; i++) {","        var rule = TimezoneData.TIMEZONE_RULES[i];","        var array = rule.daylight ? AjxTimezone.DAYLIGHT_RULES : AjxTimezone.STANDARD_RULES;","        array.push(rule);","    }","})();","","AjxTimezone._generateShortName = function(offset, period) {","    if (offset == 0) return \"\";","    var sign = offset < 0 ? \"-\" : \"+\";","    var stdOffset = Math.abs(offset);","    var hours = Math.floor(stdOffset / 60);","    var minutes = stdOffset % 60;","    hours = hours < 10 ? '0' + hours : hours;","    minutes = minutes < 10 ? '0' + minutes : minutes;","    return [sign,hours,period?\".\":\"\",minutes].join(\"\");","};","","(function() {","    TimezoneData.TIMEZONE_RULES.sort(AjxTimezone._BY_OFFSET);","    for (var j = 0; j < TimezoneData.TIMEZONE_RULES.length; j++) {","        var rule = TimezoneData.TIMEZONE_RULES[j];","        AjxTimezone.addRule(rule);","    }","})();","","Array.prototype.indexOf = function(obj) {","    for(var i=0; i<this.length; i++) {","        if(this[i] == obj) {","            return i;","        }","    }","    return -1;","}","","AjxTimezone.getCurrentTimezoneIds = function(rawOffset) {","    rawOffset = rawOffset/60;	//Need offset in minutes","    var result = [];","    var today = new Date();","    for(tzId in AjxTimezone._CLIENT2RULE) {","        if(rawOffset == 0 || AjxTimezone.getOffset(tzId, today) == rawOffset) {","            result.push(tzId);","        }","    }","","    for(link in TimezoneLinks) {","        if(result.indexOf(TimezoneLinks[link]) != -1) {","            result.push(link);","        }","    }","    return result;","}","","AjxTimezone.getTimezoneIdForOffset = function(rawOffset) {","    rawOffset = rawOffset/60;	//Need offset in minutes","","    if(rawOffset % 60 == 0) {","        var etcGMTId = \"Etc/GMT\";","        if(rawOffset != 0) {","            etcGMTId += (rawOffset > 0? \"-\": \"+\") + rawOffset/60;","        }","","        if(AjxTimezone._CLIENT2RULE[etcGMTId] != null) {","            return etcGMTId;","        } ","    }","	","    var today = new Date();","    for(tzId in AjxTimezone._CLIENT2RULE) {","        if(AjxTimezone.getOffset(tzId, today) == rawOffset) {","            return tzId;","        }","    }","","    return \"\";","}","","AjxTimezone.isDST = function(tzId, date) {","    var rule = AjxTimezone.getRule(tzId);","    if (rule && rule.daylight) {","        var year = date.getFullYear();","","        var standard = rule.standard, daylight  = rule.daylight;","        var stdTrans = AjxTimezone.getTransition(standard, year);","        var dstTrans = AjxTimezone.getTransition(daylight, year);","","        var month    = date.getMonth()+1, day = date.getDate();","        var stdMonth = stdTrans[1], stdDay = stdTrans[2];","        var dstMonth = dstTrans[1], dstDay = dstTrans[2];","","        // northern hemisphere","        var isDSTActive = false;","        if (dstMonth < stdMonth) {","            isDSTActive = month > dstMonth && month < stdMonth;","            isDSTActive = isDSTActive || (month == dstMonth && day >= dstDay);","            isDSTActive = isDSTActive || (month == stdMonth && day <  stdDay);","        }","","        // sorthern hemisphere","        else {","            isDSTActive = month < dstMonth || month > stdMonth;","            isDSTActive = isDSTActive || (month == dstMonth && day <  dstDay);","            isDSTActive = isDSTActive || (month == stdMonth && day >= stdDay);","        }","","        return isDSTActive? 1:0;","    }","    return -1;","}","","AjxTimezone.isValidTimezoneId = function(tzId) {","    return (AjxTimezone._CLIENT2RULE[tzId] != null || TimezoneLinks[tzId] != null);","}","","//","// Start YUI Code","//","    ","//Support methods first","","/**"," * Pad number so that it is atleast num characters long"," * @param {String} num String to be padded"," * @param {Number} length (Optional) Minimum number of characters the string should have after padding. If omitted, defaults to 2"," * @return {String} The padded string"," */","function zeroPad(num, length) {","    length = length || 2;","    var str = num + \"\";","    for(var i=str.length; i<length; i++) {","        str = \"0\" + str;","    }","    return str;","}","","/**"," * Get Day of Year(0-365) for the date passed"," * @param {Date} date"," * @return {Number} Day of Year"," */","function getDOY(date) {","    var oneJan = new Date(date.getFullYear(),0,1);","    return Math.ceil((date - oneJan) / 86400000);","}","    ","/**"," * Get integer part of floating point argument"," * @param floatNum A real number"," * @return Integer part of floatNum"," */","function floatToInt(floatNum) {","    return (floatNum < 0) ? Math.ceil(floatNum) : Math.floor(floatNum);","}","","/**"," * Timezone constructor. locale is optional, if not specified, defaults to root locale"," * @class Timezone"," * @constructor"," * @param {String} tzId TimeZone ID as in Olson tz database"," */","Timezone = function(tzId) {","    var normalizedId = Timezone.getNormalizedTimezoneId(tzId);","    if(normalizedId == \"\") {","        throw new Timezone.UnknownTimeZoneException(\"Could not find timezone: \" + tzId);","    }","    this.tzId = normalizedId;","        ","    this._ajxTimeZoneInstance = new AjxTimezone();","}","","//Exception Handling","Timezone.UnknownTimeZoneException = function (message) {","    this.message = message;","}","Timezone.UnknownTimeZoneException.prototype.toString = function () {","    return 'UnknownTimeZoneException: ' + this.message;","}","","//Static methods","","/**"," * Returns list of timezone Id's that have the same rawOffSet as passed in"," * @param {Number} rawOffset Raw offset (in seconds) from GMT."," * @return {Array} array of timezone Id's that match rawOffset passed in to the API. "," */","Timezone.getCurrentTimezoneIds = function(rawOffset) {","    return AjxTimezone.getCurrentTimezoneIds(rawOffset);","}","","/**"," * Given a raw offset in seconds, get the tz database ID that reflects the given raw offset, or empty string if there is no such ID. Where available, the function will return an ID "," * starting with \"Etc/GMT\"; for offsets where no such ID exists but that are used by actual time zones, the ID of one of those time zones is returned."," * Note that the offset shown in an \"Etc/GMT\" ID is opposite to the value of rawOffset"," * @param {Number} rawOffset Offset from GMT in seconds"," * @return {String} timezone id"," */","Timezone.getTimezoneIdForOffset = function(rawOffset) {","    return AjxTimezone.getTimezoneIdForOffset(rawOffset);","}","","/**"," * Given a wall time reference, convert it to UNIX time - seconds since Epoch"," * @param {Object} walltime Walltime that needs conversion. Missing properties will be treat as 0."," * @return {Number} UNIX time - time in seconds since Epoch"," */","Timezone.getUnixTimeFromWallTime = function(walltime) {","    /*","	 * Initialize any missing properties.","	 */","    if(walltime.year == null) {","        walltime.year = new Date().getFullYear();	//Default to current year","    }","    if(walltime.mon == null) {","        walltime.mon = 0;				//Default to January","    }","    if(walltime.mday == null) {","        walltime.mday = 1;				//Default to first of month","    }","    if(walltime.hour == null) {			//Default to 12 midnight","        walltime.hour = 0;","    }","    if(walltime.min == null) {","        walltime.min = 0;","    }","    if(walltime.sec == null) {","        walltime.sec = 0;","    }","    if(walltime.gmtoff == null) {			//Default to UTC","        walltime.gmtoff = 0;","    }","","    var utcTime = Date.UTC(walltime.year, walltime.mon, walltime.mday, walltime.hour, walltime.min, walltime.sec);","    utcTime -= walltime.gmtoff*1000;","","    return floatToInt(utcTime/1000);	//Unix time: count from midnight Jan 1 1970 UTC","}","","/**"," * Checks if the timestamp passed in is a valid timestamp for this timezone and offset."," * @param {String} timeStamp Time value in UTC RFC3339 format - yyyy-mm-ddThh:mm:ssZ or yyyy-mm-ddThh:mm:ss+/-HH:MM"," * @param {Number} rawOffset An offset from UTC in seconds. "," * @return {Boolean} true if valid timestamp, false otherwise"," */","Timezone.isValidTimestamp = function(timeStamp, rawOffset) {","    var regex = /^(\\d\\d\\d\\d)-([0-1][0-9])-([0-3][0-9])([T ])([0-2][0-9]):([0-6][0-9]):([0-6][0-9])(Z|[+-][0-1][0-9]:[0-3][0-9])?$/","    var matches = (new RegExp(regex)).exec(timeStamp);","","    //No match","    if(matches == null) {","        return false;","    }","","    var year = parseInt(matches[1]),","    month = parseInt(matches[2]),","    day = parseInt(matches[3]),","    dateTimeSeparator = matches[4],","    hours = parseInt(matches[5]),","    minutes = parseInt(matches[6]),","    seconds = parseInt(matches[7]),","    tZone = matches[8];","    //Month should be in 1-12","    if(month < 1 || month > 12) {","        return false;","    }","","    //Months with 31 days","    var m31 = [1,3,5,7,8,10,12];","    var maxDays = 30;","    if(m31.indexOf(month) != -1) {","        maxDays = 31;","    } else if(month == 2) {","        if(year % 400 == 0) {","            maxDays = 29;","        } else if(year % 100 == 0) {","            maxDays = 28;","        } else if(year % 4 == 0) {","            maxDays = 29;","        } else {","            maxDays = 28;","        }","    }","","    //Day should be valid day for month","    if(day < 1 || day > maxDays) {	","        return false;","    }","","    //Hours should be in 0-23","    if(hours < 0 || hours > 23) {","        return false;","    }","","    //Minutes and Seconds should in 0-59","    if(minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {","        return false;","    }","","    //Now verify timezone","    if(dateTimeSeparator == \" \" && tZone == null) {","        //SQL Format","        return true;","    } else if(dateTimeSeparator == \"T\" && tZone != null) {","        //RFC3339 Format","        var offset = 0;","        if(tZone != \"Z\") {","            //Not UTC TimeZone","            offset = parseInt(tZone.substr(1,3))*60 + parseInt(tZone.substr(4));","            offset = offset*60;	//To seconds","","            offset = offset * (tZone.charAt(0) == \"+\" ? 1 : -1);","        }","        //Check offset in timeStamp with passed rawOffset","        if(offset == rawOffset) {","            return true;","        }","    }","","    //If reached here, wrong format","    return false;","}","","/**"," * Checks if tzId passed in is a valid Timezone id in tz database."," * @param {String} tzId timezoneId to be checked for validity"," * @return {Boolean} true if tzId is a valid timezone id in tz database. tzId could be a \"zone\" id or a \"link\" id to be a valid tz Id. False otherwise"," */","Timezone.isValidTimezoneId = function(tzId) {","    return AjxTimezone.isValidTimezoneId(tzId);","}","","/**"," * Returns the normalized version of the time zone ID, or empty string if tzId is not a valid time zone ID."," * If tzId is a link Id, the standard name will be returned."," * @param {String} tzId The timezone ID whose normalized form is requested."," * @return {String} The normalized version of the timezone Id, or empty string if tzId is not a valid time zone Id."," */","Timezone.getNormalizedTimezoneId = function(tzId) {","    if(!Timezone.isValidTimezoneId(tzId)) {","        return \"\";","    }","    var normalizedId;       ","    var next = tzId;","        ","    do {","        normalizedId = next;","        next = TimezoneLinks[normalizedId];","    } while( next != null );","        ","    return normalizedId;","}","    ","//Private methods","","/**"," * Parse RFC3339 date format and return the Date"," * Format: yyyy-mm-ddThh:mm:ssZ"," * @param {String} dString The date string to be parsed"," * @return {Date} The date represented by dString"," */","Timezone.prototype._parseRFC3339 = function(dString){","    var regexp = /(\\d+)(-)?(\\d+)(-)?(\\d+)(T)?(\\d+)(:)?(\\d+)(:)?(\\d+)(\\.\\d+)?(Z|([+-])(\\d+)(:)?(\\d+))/; ","","    var result = new Date();","","    var d = dString.match(regexp);","    var offset = 0;","","    result.setUTCDate(1);","    result.setUTCFullYear(parseInt(d[1],10));","    result.setUTCMonth(parseInt(d[3],10) - 1);","    result.setUTCDate(parseInt(d[5],10));","    result.setUTCHours(parseInt(d[7],10));","    result.setUTCMinutes(parseInt(d[9],10));","    result.setUTCSeconds(parseInt(d[11],10));","    if (d[12]) {","        result.setUTCMilliseconds(parseFloat(d[12]) * 1000);","    } else {","        result.setUTCMilliseconds(0);","    }","    if (d[13] != 'Z') {","        offset = (d[15] * 60) + parseInt(d[17],10);","        offset *= ((d[14] == '-') ? -1 : 1);","        result.setTime(result.getTime() - offset * 60 * 1000);","    }","    return result;","}","","/**"," * Parse SQL date format and return the Date"," * Format: yyyy-mm-dd hh:mm:ss"," * @param {String} dString The date string to be parsed"," * @return {Date} The date represented by dString"," */","Timezone.prototype._parseSQLFormat = function(dString) {","    var dateTime = dString.split(\" \");","    var date = dateTime[0].split(\"-\");","    var time = dateTime[1].split(\":\");","","    var offset = AjxTimezone.getOffset(this.tzId, new Date(date[0], date[1] - 1, date[2]));","    return new Date(Date.UTC(date[0], date[1] - 1, date[2], time[0], time[1], time[2]) - offset*60*1000);","}","","//Public methods","","//For use in Y.DateFormat.","Timezone.prototype.getShortName = function() {","    return this._ajxTimeZoneInstance.getShortName(this.tzId);","}","","//For use in Y.DateFormat.","Timezone.prototype.getMediumName = function() {","    return this._ajxTimeZoneInstance.getMediumName(this.tzId);","}","","//For use in Y.DateFormat.","Timezone.prototype.getLongName = function() {","    return this._ajxTimeZoneInstance.getLongName(this.tzId);","}","    ","/**"," * Given a timevalue representation in RFC 3339 or SQL format, convert to UNIX time - seconds since Epoch ie., since 1970-01-01T00:00:00Z"," * @param {String} timeValue TimeValue representation in RFC 3339 or SQL format."," * @return {Number} UNIX time - time in seconds since Epoch"," */","Timezone.prototype.convertToIncrementalUTC = function(timeValue) {","    if(timeValue.indexOf(\"T\") != -1) {","        //RFC3339","        return this._parseRFC3339(timeValue).getTime() / 1000;","    } else {","        //SQL","        return this._parseSQLFormat(timeValue).getTime() / 1000;","    }","}","","/**"," * Given UNIX time - seconds since Epoch ie., 1970-01-01T00:00:00Z, convert the timevalue to RFC3339 format - \"yyyy-mm-ddThh:mm:ssZ\""," * @param {Number} timeValue time value in seconds since Epoch."," * @return {String} RFC3339 format timevalue - \"yyyy-mm-ddThh:mm:ssZ\""," */","Timezone.prototype.convertUTCToRFC3339Format = function(timeValue) {","    var uTime = new Date(timeValue * 1000);","    var offset = AjxTimezone.getOffset(this.tzId, uTime);","","    var offsetString = \"Z\";","    if(offset != 0) {","        var offsetSign = (offset > 0 ? \"+\": \"-\");","        offsetString = offsetSign + zeroPad(Math.abs(floatToInt(offset/60))) + \":\" + zeroPad(offset % 60);","    }","","    uTime.setTime(timeValue*1000 + offset*60*1000);","","    var rfc3339 = zeroPad(uTime.getUTCFullYear(), 4) + \"-\" + zeroPad((uTime.getUTCMonth() + 1)) + \"-\" + zeroPad(uTime.getUTCDate()) ","    + \"T\" + zeroPad(uTime.getUTCHours()) + \":\" + zeroPad(uTime.getUTCMinutes()) + \":\" + zeroPad(uTime.getUTCSeconds()) + offsetString;","","    return rfc3339;","}","","/**"," * Given UNIX Time - seconds since Epoch ie., 1970-01-01T00:00:00Z, convert the timevalue to SQL Format - \"yyyy-mm-dd hh:mm:ss\""," * @param {Number} timeValue time value in seconds since Epoch."," * @return {String} SQL Format timevalue - \"yyyy-mm-dd hh:mm:ss\""," */","Timezone.prototype.convertUTCToSQLFormat = function(timeValue) {","    var uTime = new Date(timeValue * 1000);","    var offset = AjxTimezone.getOffset(this.tzId, uTime);","    uTime.setTime(timeValue*1000 + offset*60*1000);","","    var sqlDate = zeroPad(uTime.getUTCFullYear(), 4) + \"-\" + zeroPad((uTime.getUTCMonth() + 1)) + \"-\" + zeroPad(uTime.getUTCDate()) ","    + \" \" + zeroPad(uTime.getUTCHours()) + \":\" + zeroPad(uTime.getUTCMinutes()) + \":\" + zeroPad(uTime.getUTCSeconds());","","    return sqlDate;","}","","/**"," * Gets the offset of this timezone in seconds from UTC"," * @return {Number} offset of this timezone in seconds from UTC"," */","Timezone.prototype.getRawOffset = function() {","    return AjxTimezone.getOffset(this.tzId, new Date()) * 60;","}","","/**"," * Given a unix time, convert it to wall time for this timezone."," * @param {Number} timeValue value in seconds from Epoch."," * @return {Object} an object with the properties: sec, min, hour, mday, mon, year, wday, yday, isdst, gmtoff, zone. All of these are integers except for zone, which is a string. isdst is 1 if DST is active, and 0 if DST is inactive."," */","Timezone.prototype.getWallTimeFromUnixTime = function(timeValue) {","    var offset = AjxTimezone.getOffset(this.tzId, new Date(timeValue*1000)) * 60;","    var localTimeValue = timeValue + offset;","    var date = new Date(localTimeValue*1000);","","    var walltime = {","        sec: date.getUTCSeconds(),","        min: date.getUTCMinutes(),","        hour: date.getUTCHours(),","        mday: date.getUTCDate(),","        mon: date.getUTCMonth(),","        year: date.getUTCFullYear(),","        wday: date.getUTCDay(),","        yday: getDOY(date),","        isdst: AjxTimezone.isDST(this.tzId, new Date(timeValue)),","        gmtoff: offset,","        zone: this.tzId","    };","","    return walltime;","}","","Y.Date.Timezone = Timezone;","","}, '@VERSION@', {\"lang\": [], \"requires\": [\"datatype-date-format\"]});"];
_yuitest_coverage["build/datatype-date-timezone/datatype-date-timezone.js"].lines = {"1":0,"6":0,"8":0,"10":0,"2997":0,"3145":0,"3147":0,"3148":0,"3155":0,"3156":0,"3157":0,"3158":0,"3160":0,"3161":0,"3164":0,"3165":0,"3169":0,"3170":0,"3171":0,"3172":0,"3173":0,"3178":0,"3179":0,"3180":0,"3183":0,"3186":0,"3187":0,"3188":0,"3189":0,"3190":0,"3191":0,"3196":0,"3197":0,"3200":0,"3201":0,"3202":0,"3203":0,"3204":0,"3205":0,"3206":0,"3209":0,"3210":0,"3211":0,"3212":0,"3214":0,"3215":0,"3216":0,"3217":0,"3218":0,"3220":0,"3224":0,"3225":0,"3226":0,"3228":0,"3230":0,"3232":0,"3233":0,"3236":0,"3237":0,"3238":0,"3240":0,"3241":0,"3242":0,"3244":0,"3246":0,"3247":0,"3249":0,"3250":0,"3252":0,"3253":0,"3256":0,"3257":0,"3258":0,"3259":0,"3260":0,"3261":0,"3262":0,"3264":0,"3265":0,"3266":0,"3267":0,"3268":0,"3270":0,"3272":0,"3273":0,"3274":0,"3275":0,"3276":0,"3280":0,"3281":0,"3284":0,"3285":0,"3288":0,"3291":0,"3294":0,"3295":0,"3296":0,"3297":0,"3299":0,"3300":0,"3301":0,"3303":0,"3304":0,"3305":0,"3308":0,"3309":0,"3310":0,"3311":0,"3312":0,"3317":0,"3318":0,"3319":0,"3322":0,"3324":0,"3327":0,"3329":0,"3330":0,"3331":0,"3332":0,"3333":0,"3334":0,"3336":0,"3341":0,"3342":0,"3349":0,"3350":0,"3351":0,"3352":0,"3353":0,"3354":0,"3355":0,"3359":0,"3360":0,"3361":0,"3362":0,"3363":0,"3364":0,"3365":0,"3366":0,"3367":0,"3370":0,"3371":0,"3372":0,"3373":0,"3374":0,"3378":0,"3379":0,"3380":0,"3381":0,"3384":0,"3387":0,"3388":0,"3389":0,"3390":0,"3391":0,"3392":0,"3393":0,"3397":0,"3398":0,"3399":0,"3402":0,"3405":0,"3406":0,"3408":0,"3409":0,"3410":0,"3411":0,"3414":0,"3415":0,"3419":0,"3420":0,"3421":0,"3422":0,"3426":0,"3429":0,"3430":0,"3431":0,"3432":0,"3434":0,"3435":0,"3436":0,"3438":0,"3439":0,"3440":0,"3443":0,"3444":0,"3445":0,"3446":0,"3447":0,"3452":0,"3453":0,"3454":0,"3457":0,"3459":0,"3462":0,"3463":0,"3478":0,"3479":0,"3480":0,"3481":0,"3482":0,"3484":0,"3492":0,"3493":0,"3494":0,"3502":0,"3503":0,"3512":0,"3513":0,"3514":0,"3515":0,"3517":0,"3519":0,"3523":0,"3524":0,"3526":0,"3527":0,"3537":0,"3538":0,"3548":0,"3549":0,"3557":0,"3561":0,"3562":0,"3564":0,"3565":0,"3567":0,"3568":0,"3570":0,"3571":0,"3573":0,"3574":0,"3576":0,"3577":0,"3579":0,"3580":0,"3583":0,"3584":0,"3586":0,"3595":0,"3596":0,"3597":0,"3600":0,"3601":0,"3604":0,"3613":0,"3614":0,"3618":0,"3619":0,"3620":0,"3621":0,"3622":0,"3623":0,"3624":0,"3625":0,"3626":0,"3627":0,"3628":0,"3630":0,"3635":0,"3636":0,"3640":0,"3641":0,"3645":0,"3646":0,"3650":0,"3652":0,"3653":0,"3655":0,"3656":0,"3658":0,"3659":0,"3661":0,"3664":0,"3665":0,"3670":0,"3678":0,"3679":0,"3688":0,"3689":0,"3690":0,"3692":0,"3693":0,"3695":0,"3696":0,"3697":0,"3700":0,"3711":0,"3712":0,"3714":0,"3716":0,"3717":0,"3719":0,"3720":0,"3721":0,"3722":0,"3723":0,"3724":0,"3725":0,"3726":0,"3727":0,"3729":0,"3731":0,"3732":0,"3733":0,"3734":0,"3736":0,"3745":0,"3746":0,"3747":0,"3748":0,"3750":0,"3751":0,"3757":0,"3758":0,"3762":0,"3763":0,"3767":0,"3768":0,"3776":0,"3777":0,"3779":0,"3782":0,"3791":0,"3792":0,"3793":0,"3795":0,"3796":0,"3797":0,"3798":0,"3801":0,"3803":0,"3806":0,"3814":0,"3815":0,"3816":0,"3817":0,"3819":0,"3822":0,"3829":0,"3830":0,"3838":0,"3839":0,"3840":0,"3841":0,"3843":0,"3857":0,"3860":0};
_yuitest_coverage["build/datatype-date-timezone/datatype-date-timezone.js"].functions = {"AjxTimezone:3147":0,"getTransition:3155":0,"addWkDayTransition:3186":0,"createTransitionDate:3209":0,"getShortName:3236":0,"getMediumName:3240":0,"addRule:3246":0,"getRule:3256":0,"getOffset:3294":0,"_BY_OFFSET:3327":0,"(anonymous 2):3351":0,"_generateShortName:3359":0,"(anonymous 3):3370":0,"indexOf:3378":0,"getCurrentTimezoneIds:3387":0,"getTimezoneIdForOffset:3405":0,"isDST:3429":0,"isValidTimezoneId:3462":0,"zeroPad:3478":0,"getDOY:3492":0,"floatToInt:3502":0,"Timezone:3512":0,"UnknownTimeZoneException:3523":0,"toString:3526":0,"getCurrentTimezoneIds:3537":0,"getTimezoneIdForOffset:3548":0,"getUnixTimeFromWallTime:3557":0,"isValidTimestamp:3595":0,"isValidTimezoneId:3678":0,"getNormalizedTimezoneId:3688":0,"_parseRFC3339:3711":0,"_parseSQLFormat:3745":0,"getShortName:3757":0,"getMediumName:3762":0,"getLongName:3767":0,"convertToIncrementalUTC:3776":0,"convertUTCToRFC3339Format:3791":0,"convertUTCToSQLFormat:3814":0,"getRawOffset:3829":0,"getWallTimeFromUnixTime:3838":0,"(anonymous 1):1":0};
_yuitest_coverage["build/datatype-date-timezone/datatype-date-timezone.js"].coveredLines = 348;
_yuitest_coverage["build/datatype-date-timezone/datatype-date-timezone.js"].coveredFunctions = 41;
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 1);
YUI.add('datatype-date-timezone', function (Y, NAME) {

/*
 *  Copyright 2012 Yahoo! Inc. All Rights Reserved. Based on code owned by VMWare, Inc. 
 */
_yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "(anonymous 1)", 1);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 6);
TimezoneData = {};

_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 8);
TimezoneData.TRANSITION_YEAR = 2011;

_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 10);
TimezoneData.TIMEZONE_RULES = [
{
    tzId: "Asia/Riyadh88", 
    standard: {
        offset: 187
    }
},
{
    tzId: "Asia/Kabul", 
    standard: {
        offset: 270
    }
},
{
    tzId: "Asia/Yerevan", 
    standard: {
        offset: 240
    }
},
{
    tzId: "Asia/Baku", 
    standard: {
        offset: 240, 
        mon: 10, 
        week: -1, 
        wkday: 1, 
        hour: 5, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: 300, 
        mon: 3, 
        week: -1, 
        wkday: 1, 
        hour: 4, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "Asia/Bahrain", 
    standard: {
        offset: 180
    }
},
{
    tzId: "Asia/Dhaka", 
    standard: {
        offset: 360
    }
},
{
    tzId: "Asia/Thimphu", 
    standard: {
        offset: 360
    }
},
{
    tzId: "Indian/Chagos", 
    standard: {
        offset: 360
    }
},
{
    tzId: "Asia/Brunei", 
    standard: {
        offset: 480
    }
},
{
    tzId: "Asia/Rangoon", 
    standard: {
        offset: 390
    }
},
{
    tzId: "Asia/Phnom_Penh", 
    standard: {
        offset: 420
    }
},
{
    tzId: "Asia/Harbin", 
    standard: {
        offset: 480
    }
},
{
    tzId: "Asia/Shanghai", 
    standard: {
        offset: 480
    }
},
{
    tzId: "Asia/Chongqing", 
    standard: {
        offset: 480
    }
},
{
    tzId: "Asia/Urumqi", 
    standard: {
        offset: 480
    }
},
{
    tzId: "Asia/Kashgar", 
    standard: {
        offset: 480
    }
},
{
    tzId: "Asia/Hong_Kong", 
    standard: {
        offset: 480
    }
},
{
    tzId: "Asia/Taipei", 
    standard: {
        offset: 480
    }
},
{
    tzId: "Asia/Macau", 
    standard: {
        offset: 480
    }
},
{
    tzId: "Asia/Nicosia", 
    standard: {
        offset: 120
    }
},
{
    tzId: "Asia/Tbilisi", 
    standard: {
        offset: 240
    }
},
{
    tzId: "Asia/Dili", 
    standard: {
        offset: 540
    }
},
{
    tzId: "Asia/Kolkata", 
    standard: {
        offset: 330
    }
},
{
    tzId: "Asia/Jakarta", 
    standard: {
        offset: 427
    }
},
{
    tzId: "Asia/Pontianak", 
    standard: {
        offset: 540
    }
},
{
    tzId: "Asia/Tehran", 
    standard: {
        offset: 210
    }
},
{
    tzId: "Asia/Baghdad", 
    standard: {
        offset: 180
    }
},
{
    tzId: "Asia/Jerusalem", 
    standard: {
        offset: 120
    }
},
{
    tzId: "Asia/Tokyo", 
    standard: {
        offset: 540
    }
},
{
    tzId: "Asia/Amman", 
    standard: {
        offset: 120
    }
},
{
    tzId: "Asia/Almaty", 
    standard: {
        offset: 360
    }
},
{
    tzId: "Asia/Qyzylorda", 
    standard: {
        offset: 360
    }
},
{
    tzId: "Asia/Aqtobe", 
    standard: {
        offset: 300
    }
},
{
    tzId: "Asia/Aqtau", 
    standard: {
        offset: 300
    }
},
{
    tzId: "Asia/Oral", 
    standard: {
        offset: 300
    }
},
{
    tzId: "Asia/Bishkek", 
    standard: {
        offset: 360
    }
},
{
    tzId: "Asia/Seoul", 
    standard: {
        offset: 540
    }
},
{
    tzId: "Asia/Kuwait", 
    standard: {
        offset: 180
    }
},
{
    tzId: "Asia/Vientiane", 
    standard: {
        offset: 420
    }
},
{
    tzId: "Asia/Beirut", 
    standard: {
        offset: 120
    }
},
{
    tzId: "Asia/Kuala_Lumpur", 
    standard: {
        offset: 480
    }
},
{
    tzId: "Asia/Kuching", 
    standard: {
        offset: 480
    }
},
{
    tzId: "Indian/Maldives", 
    standard: {
        offset: 300
    }
},
{
    tzId: "Asia/Hovd", 
    standard: {
        offset: 420
    }
},
{
    tzId: "Asia/Ulaanbaatar", 
    standard: {
        offset: 480
    }
},
{
    tzId: "Asia/Choibalsan", 
    standard: {
        offset: 480
    }
},
{
    tzId: "Asia/Kathmandu", 
    standard: {
        offset: 345
    }
},
{
    tzId: "Asia/Muscat", 
    standard: {
        offset: 240
    }
},
{
    tzId: "Asia/Karachi", 
    standard: {
        offset: 300
    }
},
{
    tzId: "Asia/Gaza", 
    standard: {
        offset: 120
    }
},
{
    tzId: "Asia/Hebron", 
    standard: {
        offset: 120
    }
},
{
    tzId: "Asia/Manila", 
    standard: {
        offset: 480
    }
},
{
    tzId: "Asia/Qatar", 
    standard: {
        offset: 180
    }
},
{
    tzId: "Asia/Riyadh", 
    standard: {
        offset: 180
    }
},
{
    tzId: "Asia/Singapore", 
    standard: {
        offset: 480
    }
},
{
    tzId: "Asia/Colombo", 
    standard: {
        offset: 330
    }
},
{
    tzId: "Asia/Damascus", 
    standard: {
        offset: 120, 
        mon: 10, 
        week: -1, 
        wkday: 6, 
        hour: 0, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: 180, 
        mon: 3, 
        week: -1, 
        wkday: 6, 
        hour: 0, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "Asia/Dushanbe", 
    standard: {
        offset: 300
    }
},
{
    tzId: "Asia/Bangkok", 
    standard: {
        offset: 420
    }
},
{
    tzId: "Asia/Ashgabat", 
    standard: {
        offset: 300
    }
},
{
    tzId: "Asia/Dubai", 
    standard: {
        offset: 240
    }
},
{
    tzId: "Asia/Samarkand", 
    standard: {
        offset: 300
    }
},
{
    tzId: "Asia/Ho_Chi_Minh", 
    standard: {
        offset: 420
    }
},
{
    tzId: "Asia/Aden", 
    standard: {
        offset: 180
    }
},
{
    tzId: "Australia/Darwin", 
    standard: {
        offset: 570
    }
},
{
    tzId: "Australia/Perth", 
    standard: {
        offset: 525
    }
},
{
    tzId: "Australia/Brisbane", 
    standard: {
        offset: 600
    }
},
{
    tzId: "Australia/Adelaide", 
    standard: {
        offset: 570, 
        mon: 4, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: 630, 
        mon: 10, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "Australia/Hobart", 
    standard: {
        offset: 600
    }
},
{
    tzId: "Australia/Melbourne", 
    standard: {
        offset: 600, 
        mon: 4, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: 660, 
        mon: 10, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "Australia/Sydney", 
    standard: {
        offset: 570, 
        mon: 4, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: 630, 
        mon: 10, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "Australia/Lord_Howe", 
    standard: {
        offset: 630, 
        mon: 4, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: 660, 
        mon: 10, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "Indian/Christmas", 
    standard: {
        offset: 420
    }
},
{
    tzId: "Pacific/Rarotonga", 
    standard: {
        offset: -600
    }
},
{
    tzId: "Indian/Cocos", 
    standard: {
        offset: 390
    }
},
{
    tzId: "Pacific/Fiji", 
    standard: {
        offset: 720
    }
},
{
    tzId: "Pacific/Gambier", 
    standard: {
        offset: -600
    }
},
{
    tzId: "Pacific/Guam", 
    standard: {
        offset: 600
    }
},
{
    tzId: "Pacific/Tarawa", 
    standard: {
        offset: 840
    }
},
{
    tzId: "Pacific/Saipan", 
    standard: {
        offset: 600
    }
},
{
    tzId: "Pacific/Majuro", 
    standard: {
        offset: 720
    }
},
{
    tzId: "Pacific/Chuuk", 
    standard: {
        offset: 660
    }
},
{
    tzId: "Pacific/Nauru", 
    standard: {
        offset: 720
    }
},
{
    tzId: "Pacific/Noumea", 
    standard: {
        offset: 660
    }
},
{
    tzId: "Pacific/Auckland", 
    standard: {
        offset: 765
    }
},
{
    tzId: "Pacific/Niue", 
    standard: {
        offset: -660
    }
},
{
    tzId: "Pacific/Norfolk", 
    standard: {
        offset: 690
    }
},
{
    tzId: "Pacific/Palau", 
    standard: {
        offset: 540
    }
},
{
    tzId: "Pacific/Port_Moresby", 
    standard: {
        offset: 600
    }
},
{
    tzId: "Pacific/Pitcairn", 
    standard: {
        offset: -480
    }
},
{
    tzId: "Pacific/Pago_Pago", 
    standard: {
        offset: -660
    }
},
{
    tzId: "Pacific/Apia", 
    standard: {
        offset: 780
    }
},
{
    tzId: "Pacific/Guadalcanal", 
    standard: {
        offset: 660
    }
},
{
    tzId: "Pacific/Fakaofo", 
    standard: {
        offset: 840
    }
},
{
    tzId: "Pacific/Tongatapu", 
    standard: {
        offset: 780
    }
},
{
    tzId: "Pacific/Funafuti", 
    standard: {
        offset: 720
    }
},
{
    tzId: "Pacific/Johnston", 
    standard: {
        offset: -600
    }
},
{
    tzId: "Pacific/Midway", 
    standard: {
        offset: -660
    }
},
{
    tzId: "Pacific/Wake", 
    standard: {
        offset: 720
    }
},
{
    tzId: "Pacific/Efate", 
    standard: {
        offset: 660
    }
},
{
    tzId: "Pacific/Wallis", 
    standard: {
        offset: 720
    }
},
{
    tzId: "Etc/GMT", 
    standard: {
        offset: 0
    }
},
{
    tzId: "Etc/GMT-14", 
    standard: {
        offset: 0
    }
},
{
    tzId: "Asia/Riyadh87", 
    standard: {
        offset: 187
    }
},
{
    tzId: "America/Argentina/Buenos_Aires", 
    standard: {
        offset: -180
    }
},
{
    tzId: "America/Argentina/Cordoba", 
    standard: {
        offset: -180
    }
},
{
    tzId: "America/Argentina/Salta", 
    standard: {
        offset: -180
    }
},
{
    tzId: "America/Argentina/Tucuman", 
    standard: {
        offset: -180
    }
},
{
    tzId: "America/Argentina/La_Rioja", 
    standard: {
        offset: -180
    }
},
{
    tzId: "America/Argentina/San_Juan", 
    standard: {
        offset: -180
    }
},
{
    tzId: "America/Argentina/Jujuy", 
    standard: {
        offset: -180
    }
},
{
    tzId: "America/Argentina/Catamarca", 
    standard: {
        offset: -180
    }
},
{
    tzId: "America/Argentina/Mendoza", 
    standard: {
        offset: -180
    }
},
{
    tzId: "America/Argentina/San_Luis", 
    standard: {
        offset: -240
    }
},
{
    tzId: "America/Argentina/Rio_Gallegos", 
    standard: {
        offset: -180
    }
},
{
    tzId: "America/Argentina/Ushuaia", 
    standard: {
        offset: -180
    }
},
{
    tzId: "America/Aruba", 
    standard: {
        offset: -240
    }
},
{
    tzId: "America/La_Paz", 
    standard: {
        offset: -240
    }
},
{
    tzId: "America/Noronha", 
    standard: {
        offset: -120
    }
},
{
    tzId: "America/Belem", 
    standard: {
        offset: -180
    }
},
{
    tzId: "America/Santarem", 
    standard: {
        offset: -180
    }
},
{
    tzId: "America/Fortaleza", 
    standard: {
        offset: -180
    }
},
{
    tzId: "America/Recife", 
    standard: {
        offset: -180
    }
},
{
    tzId: "America/Araguaina", 
    standard: {
        offset: -180
    }
},
{
    tzId: "America/Maceio", 
    standard: {
        offset: -180
    }
},
{
    tzId: "America/Bahia", 
    standard: {
        offset: -180
    }
},
{
    tzId: "America/Sao_Paulo", 
    standard: {
        offset: -180
    }
},
{
    tzId: "America/Campo_Grande", 
    standard: {
        offset: -240
    }
},
{
    tzId: "America/Cuiaba", 
    standard: {
        offset: -240
    }
},
{
    tzId: "America/Porto_Velho", 
    standard: {
        offset: -240
    }
},
{
    tzId: "America/Boa_Vista", 
    standard: {
        offset: -240
    }
},
{
    tzId: "America/Manaus", 
    standard: {
        offset: -240
    }
},
{
    tzId: "America/Eirunepe", 
    standard: {
        offset: -240
    }
},
{
    tzId: "America/Rio_Branco", 
    standard: {
        offset: -240
    }
},
{
    tzId: "America/Santiago", 
    standard: {
        offset: -360
    }
},
{
    tzId: "America/Bogota", 
    standard: {
        offset: -300
    }
},
{
    tzId: "America/Curacao", 
    standard: {
        offset: -240
    }
},
{
    tzId: "America/Guayaquil", 
    standard: {
        offset: -360
    }
},
{
    tzId: "Atlantic/Stanley", 
    standard: {
        offset: -180
    }
},
{
    tzId: "America/Cayenne", 
    standard: {
        offset: -180
    }
},
{
    tzId: "America/Guyana", 
    standard: {
        offset: -180
    }
},
{
    tzId: "America/Asuncion", 
    standard: {
        offset: -240, 
        mon: 4, 
        week: 2, 
        wkday: 1, 
        hour: 0, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -180, 
        mon: 10, 
        week: 2, 
        wkday: 1, 
        hour: 0, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Lima", 
    standard: {
        offset: -300
    }
},
{
    tzId: "Atlantic/South_Georgia", 
    standard: {
        offset: -120
    }
},
{
    tzId: "America/Paramaribo", 
    standard: {
        offset: -180
    }
},
{
    tzId: "America/Port_of_Spain", 
    standard: {
        offset: -240
    }
},
{
    tzId: "America/Montevideo", 
    standard: {
        offset: -180
    }
},
{
    tzId: "America/Caracas", 
    standard: {
        offset: -210
    }
},
{
    tzId: "Antarctica/Casey", 
    standard: {
        offset: 480
    }
},
{
    tzId: "Antarctica/Davis", 
    standard: {
        offset: 360
    }
},
{
    tzId: "Antarctica/Macquarie", 
    standard: {
        offset: 660
    }
},
{
    tzId: "Indian/Kerguelen", 
    standard: {
        offset: 300
    }
},
{
    tzId: "Antarctica/DumontDUrville", 
    standard: {
        offset: 600
    }
},
{
    tzId: "Antarctica/Syowa", 
    standard: {
        offset: 180
    }
},
{
    tzId: "Antarctica/Vostok", 
    standard: {
        offset: 360
    }
},
{
    tzId: "Antarctica/Rothera", 
    standard: {
        offset: -180
    }
},
{
    tzId: "Antarctica/Palmer", 
    standard: {
        offset: -240
    }
},
{
    tzId: "Antarctica/McMurdo", 
    standard: {
        offset: 720
    }
},
{
    tzId: "Asia/Riyadh89", 
    standard: {
        offset: 187
    }
},
{
    tzId: "Africa/Algiers", 
    standard: {
        offset: 60
    }
},
{
    tzId: "Africa/Luanda", 
    standard: {
        offset: 60
    }
},
{
    tzId: "Africa/Porto-Novo", 
    standard: {
        offset: 60
    }
},
{
    tzId: "Africa/Gaborone", 
    standard: {
        offset: 120
    }
},
{
    tzId: "Africa/Ouagadougou", 
    standard: {
        offset: 0
    }
},
{
    tzId: "Africa/Bujumbura", 
    standard: {
        offset: 120
    }
},
{
    tzId: "Africa/Douala", 
    standard: {
        offset: 60
    }
},
{
    tzId: "Atlantic/Cape_Verde", 
    standard: {
        offset: -60
    }
},
{
    tzId: "Africa/Bangui", 
    standard: {
        offset: 60
    }
},
{
    tzId: "Africa/Ndjamena", 
    standard: {
        offset: 60
    }
},
{
    tzId: "Indian/Comoro", 
    standard: {
        offset: 180
    }
},
{
    tzId: "Africa/Kinshasa", 
    standard: {
        offset: 120
    }
},
{
    tzId: "Africa/Brazzaville", 
    standard: {
        offset: 60
    }
},
{
    tzId: "Africa/Abidjan", 
    standard: {
        offset: 0
    }
},
{
    tzId: "Africa/Djibouti", 
    standard: {
        offset: 180
    }
},
{
    tzId: "Africa/Cairo", 
    standard: {
        offset: 120
    }
},
{
    tzId: "Africa/Malabo", 
    standard: {
        offset: 60
    }
},
{
    tzId: "Africa/Asmara", 
    standard: {
        offset: 180
    }
},
{
    tzId: "Africa/Addis_Ababa", 
    standard: {
        offset: 180
    }
},
{
    tzId: "Africa/Libreville", 
    standard: {
        offset: 60
    }
},
{
    tzId: "Africa/Banjul", 
    standard: {
        offset: 0
    }
},
{
    tzId: "Africa/Accra", 
    standard: {
        offset: 0
    }
},
{
    tzId: "Africa/Conakry", 
    standard: {
        offset: 0
    }
},
{
    tzId: "Africa/Bissau", 
    standard: {
        offset: 0
    }
},
{
    tzId: "Africa/Nairobi", 
    standard: {
        offset: 180
    }
},
{
    tzId: "Africa/Maseru", 
    standard: {
        offset: 120
    }
},
{
    tzId: "Africa/Monrovia", 
    standard: {
        offset: 0
    }
},
{
    tzId: "Africa/Tripoli", 
    standard: {
        offset: 60
    }
},
{
    tzId: "Indian/Antananarivo", 
    standard: {
        offset: 180
    }
},
{
    tzId: "Africa/Blantyre", 
    standard: {
        offset: 120
    }
},
{
    tzId: "Africa/Bamako", 
    standard: {
        offset: 0
    }
},
{
    tzId: "Africa/Nouakchott", 
    standard: {
        offset: 0
    }
},
{
    tzId: "Indian/Mauritius", 
    standard: {
        offset: 240
    }
},
{
    tzId: "Indian/Mayotte", 
    standard: {
        offset: 180
    }
},
{
    tzId: "Africa/Casablanca", 
    standard: {
        offset: 0, 
        mon: 9, 
        week: -1, 
        wkday: 1, 
        hour: 3, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: 60, 
        mon: 4, 
        week: -1, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "Africa/El_Aaiun", 
    standard: {
        offset: 0
    }
},
{
    tzId: "Africa/Maputo", 
    standard: {
        offset: 120
    }
},
{
    tzId: "Africa/Windhoek", 
    standard: {
        offset: 60
    }
},
{
    tzId: "Africa/Niamey", 
    standard: {
        offset: 60
    }
},
{
    tzId: "Africa/Lagos", 
    standard: {
        offset: 60
    }
},
{
    tzId: "Indian/Reunion", 
    standard: {
        offset: 240
    }
},
{
    tzId: "Africa/Kigali", 
    standard: {
        offset: 120
    }
},
{
    tzId: "Atlantic/St_Helena", 
    standard: {
        offset: 0
    }
},
{
    tzId: "Africa/Sao_Tome", 
    standard: {
        offset: 0
    }
},
{
    tzId: "Africa/Dakar", 
    standard: {
        offset: 0
    }
},
{
    tzId: "Indian/Mahe", 
    standard: {
        offset: 240
    }
},
{
    tzId: "Africa/Freetown", 
    standard: {
        offset: 0
    }
},
{
    tzId: "Africa/Mogadishu", 
    standard: {
        offset: 180
    }
},
{
    tzId: "Africa/Johannesburg", 
    standard: {
        offset: 120
    }
},
{
    tzId: "Africa/Khartoum", 
    standard: {
        offset: 180
    }
},
{
    tzId: "Africa/Juba", 
    standard: {
        offset: 180
    }
},
{
    tzId: "Africa/Mbabane", 
    standard: {
        offset: 120
    }
},
{
    tzId: "Africa/Dar_es_Salaam", 
    standard: {
        offset: 180
    }
},
{
    tzId: "Africa/Lome", 
    standard: {
        offset: 0
    }
},
{
    tzId: "Africa/Tunis", 
    standard: {
        offset: 60
    }
},
{
    tzId: "Africa/Kampala", 
    standard: {
        offset: 180
    }
},
{
    tzId: "Africa/Lusaka", 
    standard: {
        offset: 120
    }
},
{
    tzId: "Africa/Harare", 
    standard: {
        offset: 120
    }
},
{
    tzId: "Europe/London", 
    standard: {
        offset: 0
    }
},
{
    tzId: "WET", 
    standard: {
        offset: 0
    }
},
{
    tzId: "Europe/Tirane", 
    standard: {
        offset: 60
    }
},
{
    tzId: "Europe/Andorra", 
    standard: {
        offset: 60
    }
},
{
    tzId: "Europe/Vienna", 
    standard: {
        offset: 60
    }
},
{
    tzId: "Europe/Minsk", 
    standard: {
        offset: 180
    }
},
{
    tzId: "Europe/Brussels", 
    standard: {
        offset: 60
    }
},
{
    tzId: "Europe/Sofia", 
    standard: {
        offset: 120
    }
},
{
    tzId: "Europe/Prague", 
    standard: {
        offset: 60
    }
},
{
    tzId: "Europe/Copenhagen", 
    standard: {
        offset: 0
    }
},
{
    tzId: "America/Danmarkshavn", 
    standard: {
        offset: -240, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -180, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "Europe/Tallinn", 
    standard: {
        offset: 120
    }
},
{
    tzId: "Europe/Helsinki", 
    standard: {
        offset: 120
    }
},
{
    tzId: "Europe/Paris", 
    standard: {
        offset: 9
    }
},
{
    tzId: "Europe/Berlin", 
    standard: {
        offset: 60
    }
},
{
    tzId: "Europe/Gibraltar", 
    standard: {
        offset: 60
    }
},
{
    tzId: "Europe/Athens", 
    standard: {
        offset: 120
    }
},
{
    tzId: "Europe/Budapest", 
    standard: {
        offset: 60
    }
},
{
    tzId: "Atlantic/Reykjavik", 
    standard: {
        offset: 0
    }
},
{
    tzId: "Europe/Rome", 
    standard: {
        offset: 60
    }
},
{
    tzId: "Europe/Riga", 
    standard: {
        offset: 120
    }
},
{
    tzId: "Europe/Vaduz", 
    standard: {
        offset: 60
    }
},
{
    tzId: "Europe/Vilnius", 
    standard: {
        offset: 120
    }
},
{
    tzId: "Europe/Luxembourg", 
    standard: {
        offset: 60
    }
},
{
    tzId: "Europe/Malta", 
    standard: {
        offset: 60
    }
},
{
    tzId: "Europe/Chisinau", 
    standard: {
        offset: 120
    }
},
{
    tzId: "Europe/Monaco", 
    standard: {
        offset: 60
    }
},
{
    tzId: "Europe/Amsterdam", 
    standard: {
        offset: 60
    }
},
{
    tzId: "Europe/Oslo", 
    standard: {
        offset: 60
    }
},
{
    tzId: "Europe/Warsaw", 
    standard: {
        offset: 60
    }
},
{
    tzId: "Europe/Lisbon", 
    standard: {
        offset: 0
    }
},
{
    tzId: "Europe/Bucharest", 
    standard: {
        offset: 120
    }
},
{
    tzId: "Europe/Kaliningrad", 
    standard: {
        offset: 180
    }
},
{
    tzId: "Europe/Moscow", 
    standard: {
        offset: 240
    }
},
{
    tzId: "Europe/Volgograd", 
    standard: {
        offset: 240
    }
},
{
    tzId: "Europe/Samara", 
    standard: {
        offset: 240
    }
},
{
    tzId: "Asia/Yekaterinburg", 
    standard: {
        offset: 360
    }
},
{
    tzId: "Asia/Omsk", 
    standard: {
        offset: 420
    }
},
{
    tzId: "Asia/Novosibirsk", 
    standard: {
        offset: 420
    }
},
{
    tzId: "Asia/Novokuznetsk", 
    standard: {
        offset: 420
    }
},
{
    tzId: "Asia/Krasnoyarsk", 
    standard: {
        offset: 480
    }
},
{
    tzId: "Asia/Irkutsk", 
    standard: {
        offset: 540
    }
},
{
    tzId: "Asia/Yakutsk", 
    standard: {
        offset: 600
    }
},
{
    tzId: "Asia/Vladivostok", 
    standard: {
        offset: 660
    }
},
{
    tzId: "Asia/Sakhalin", 
    standard: {
        offset: 660
    }
},
{
    tzId: "Asia/Magadan", 
    standard: {
        offset: 720
    }
},
{
    tzId: "Asia/Kamchatka", 
    standard: {
        offset: 720
    }
},
{
    tzId: "Asia/Anadyr", 
    standard: {
        offset: 720
    }
},
{
    tzId: "Europe/Belgrade", 
    standard: {
        offset: 60
    }
},
{
    tzId: "Europe/Madrid", 
    standard: {
        offset: 0
    }
},
{
    tzId: "Europe/Stockholm", 
    standard: {
        offset: 60
    }
},
{
    tzId: "Europe/Zurich", 
    standard: {
        offset: 60
    }
},
{
    tzId: "Europe/Istanbul", 
    standard: {
        offset: 0
    }
},
{
    tzId: "Europe/Kiev", 
    standard: {
        offset: 120
    }
},
{
    tzId: "Europe/Uzhgorod", 
    standard: {
        offset: 120
    }
},
{
    tzId: "Europe/Zaporozhye", 
    standard: {
        offset: 120
    }
},
{
    tzId: "Europe/Simferopol", 
    standard: {
        offset: 120
    }
},
{
    tzId: "EST", 
    standard: {
        offset: 0
    }
},
{
    tzId: "America/New_York", 
    standard: {
        offset: -300, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -240, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Chicago", 
    standard: {
        offset: -360, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -300, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/North_Dakota/Center", 
    standard: {
        offset: -360, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -300, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/North_Dakota/New_Salem", 
    standard: {
        offset: -360, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -300, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/North_Dakota/Beulah", 
    standard: {
        offset: -360, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -300, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Denver", 
    standard: {
        offset: -420, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -360, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Los_Angeles", 
    standard: {
        offset: -480, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -420, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Juneau", 
    standard: {
        offset: -600, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -540, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "Pacific/Honolulu", 
    standard: {
        offset: -600
    }
},
{
    tzId: "America/Phoenix", 
    standard: {
        offset: -420
    }
},
{
    tzId: "America/Boise", 
    standard: {
        offset: -420, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -360, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Indiana/Indianapolis", 
    standard: {
        offset: -300, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -240, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Indiana/Marengo", 
    standard: {
        offset: -300, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -240, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Indiana/Vincennes", 
    standard: {
        offset: -300, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -240, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Indiana/Tell_City", 
    standard: {
        offset: -360, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -300, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Indiana/Petersburg", 
    standard: {
        offset: -300, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -240, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Indiana/Knox", 
    standard: {
        offset: -360, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -300, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Indiana/Winamac", 
    standard: {
        offset: -300, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -240, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Indiana/Vevay", 
    standard: {
        offset: -300, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -240, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Kentucky/Louisville", 
    standard: {
        offset: -300, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -240, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Kentucky/Monticello", 
    standard: {
        offset: -300, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -240, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Detroit", 
    standard: {
        offset: -300, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -240, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Menominee", 
    standard: {
        offset: -360, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -300, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/St_Johns", 
    standard: {
        offset: -150, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -90, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Goose_Bay", 
    standard: {
        offset: -240, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -180, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Halifax", 
    standard: {
        offset: -240, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -180, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Moncton", 
    standard: {
        offset: -240, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -180, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Blanc-Sablon", 
    standard: {
        offset: -300, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -240, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Toronto", 
    standard: {
        offset: -300
    }
},
{
    tzId: "America/Winnipeg", 
    standard: {
        offset: -360, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -300, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Regina", 
    standard: {
        offset: -360
    }
},
{
    tzId: "America/Edmonton", 
    standard: {
        offset: -420, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -360, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Vancouver", 
    standard: {
        offset: -420
    }
},
{
    tzId: "America/Pangnirtung", 
    standard: {
        offset: -300, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -240, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Iqaluit", 
    standard: {
        offset: -300, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -240, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Resolute", 
    standard: {
        offset: -360, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -300, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Rankin_Inlet", 
    standard: {
        offset: -360, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -300, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Cambridge_Bay", 
    standard: {
        offset: -480, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -420, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Cancun", 
    standard: {
        offset: -360, 
        mon: 10, 
        week: -1, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -300, 
        mon: 4, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Merida", 
    standard: {
        offset: -360, 
        mon: 10, 
        week: -1, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -300, 
        mon: 4, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Matamoros", 
    standard: {
        offset: -360, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -300, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Monterrey", 
    standard: {
        offset: -360, 
        mon: 10, 
        week: -1, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -300, 
        mon: 4, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Mexico_City", 
    standard: {
        offset: -360, 
        mon: 10, 
        week: -1, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -300, 
        mon: 4, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Ojinaga", 
    standard: {
        offset: -420, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -360, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Chihuahua", 
    standard: {
        offset: -420, 
        mon: 10, 
        week: -1, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -360, 
        mon: 4, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Hermosillo", 
    standard: {
        offset: -420
    }
},
{
    tzId: "America/Mazatlan", 
    standard: {
        offset: -420, 
        mon: 10, 
        week: -1, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -360, 
        mon: 4, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Bahia_Banderas", 
    standard: {
        offset: -360, 
        mon: 10, 
        week: -1, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -300, 
        mon: 4, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Tijuana", 
    standard: {
        offset: -480, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -420, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Santa_Isabel", 
    standard: {
        offset: -480, 
        mon: 10, 
        week: -1, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -420, 
        mon: 4, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Anguilla", 
    standard: {
        offset: -240
    }
},
{
    tzId: "America/Antigua", 
    standard: {
        offset: -240
    }
},
{
    tzId: "America/Nassau", 
    standard: {
        offset: -300, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -240, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Barbados", 
    standard: {
        offset: -240
    }
},
{
    tzId: "America/Belize", 
    standard: {
        offset: -360
    }
},
{
    tzId: "Atlantic/Bermuda", 
    standard: {
        offset: -240, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -180, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Cayman", 
    standard: {
        offset: -300
    }
},
{
    tzId: "America/Costa_Rica", 
    standard: {
        offset: -360
    }
},
{
    tzId: "America/Havana", 
    standard: {
        offset: -300
    }
},
{
    tzId: "America/Dominica", 
    standard: {
        offset: -240
    }
},
{
    tzId: "America/Santo_Domingo", 
    standard: {
        offset: -240
    }
},
{
    tzId: "America/El_Salvador", 
    standard: {
        offset: -360
    }
},
{
    tzId: "America/Grenada", 
    standard: {
        offset: -240
    }
},
{
    tzId: "America/Guadeloupe", 
    standard: {
        offset: -240
    }
},
{
    tzId: "America/Guatemala", 
    standard: {
        offset: -360
    }
},
{
    tzId: "America/Port-au-Prince", 
    standard: {
        offset: -300
    }
},
{
    tzId: "America/Tegucigalpa", 
    standard: {
        offset: -360
    }
},
{
    tzId: "America/Jamaica", 
    standard: {
        offset: -300
    }
},
{
    tzId: "America/Martinique", 
    standard: {
        offset: -240
    }
},
{
    tzId: "America/Montserrat", 
    standard: {
        offset: -240
    }
},
{
    tzId: "America/Managua", 
    standard: {
        offset: -360
    }
},
{
    tzId: "America/Panama", 
    standard: {
        offset: -300
    }
},
{
    tzId: "America/Puerto_Rico", 
    standard: {
        offset: -240
    }
},
{
    tzId: "America/St_Kitts", 
    standard: {
        offset: -240
    }
},
{
    tzId: "America/St_Lucia", 
    standard: {
        offset: -240
    }
},
{
    tzId: "America/Miquelon", 
    standard: {
        offset: -180, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -120, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/St_Vincent", 
    standard: {
        offset: -240
    }
},
{
    tzId: "America/Grand_Turk", 
    standard: {
        offset: -300, 
        mon: 11, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    },
    daylight: {
        offset: -240, 
        mon: 3, 
        week: 2, 
        wkday: 1, 
        hour: 2, 
        min: 0, 
        sec: 0
    }
},
{
    tzId: "America/Tortola", 
    standard: {
        offset: -240
    }
},
{
    tzId: "America/St_Thomas", 
    standard: {
        offset: -240
    }
}
];
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 2997);
TimezoneLinks = {
    "Mideast/Riyadh88": "Asia/Riyadh88",
    "Europe/Nicosia": "Asia/Nicosia",
    "US/Pacific-New": "America/Los_Angeles",
    "GMT": "Etc/GMT",
    "Etc/UTC": "Etc/GMT",
    "Etc/Universal": "Etc/UTC",
    "Etc/Zulu": "Etc/UTC",
    "Etc/Greenwich": "Etc/GMT",
    "Etc/GMT-0": "Etc/GMT",
    "Etc/GMT+0": "Etc/GMT",
    "Etc/GMT0": "Etc/GMT",
    "Mideast/Riyadh87": "Asia/Riyadh87",
    "America/Lower_Princes": "America/Curacao",
    "America/Kralendijk": "America/Curacao",
    "Antarctica/South_Pole": "Antarctica/McMurdo",
    "Mideast/Riyadh89": "Asia/Riyadh89",
    "Africa/Asmera": "Africa/Asmara",
    "Africa/Timbuktu": "Africa/Bamako",
    "America/Argentina/ComodRivadavia": "America/Argentina/Catamarca",
    "America/Atka": "America/Adak",
    "America/Buenos_Aires": "America/Argentina/Buenos_Aires",
    "America/Catamarca": "America/Argentina/Catamarca",
    "America/Coral_Harbour": "America/Atikokan",
    "America/Cordoba": "America/Argentina/Cordoba",
    "America/Ensenada": "America/Tijuana",
    "America/Fort_Wayne": "America/Indiana/Indianapolis",
    "America/Indianapolis": "America/Indiana/Indianapolis",
    "America/Jujuy": "America/Argentina/Jujuy",
    "America/Knox_IN": "America/Indiana/Knox",
    "America/Louisville": "America/Kentucky/Louisville",
    "America/Mendoza": "America/Argentina/Mendoza",
    "America/Porto_Acre": "America/Rio_Branco",
    "America/Rosario": "America/Argentina/Cordoba",
    "America/Virgin": "America/St_Thomas",
    "Asia/Ashkhabad": "Asia/Ashgabat",
    "Asia/Chungking": "Asia/Chongqing",
    "Asia/Dacca": "Asia/Dhaka",
    "Asia/Katmandu": "Asia/Kathmandu",
    "Asia/Calcutta": "Asia/Kolkata",
    "Asia/Macao": "Asia/Macau",
    "Asia/Tel_Aviv": "Asia/Jerusalem",
    "Asia/Saigon": "Asia/Ho_Chi_Minh",
    "Asia/Thimbu": "Asia/Thimphu",
    "Asia/Ujung_Pandang": "Asia/Makassar",
    "Asia/Ulan_Bator": "Asia/Ulaanbaatar",
    "Atlantic/Faeroe": "Atlantic/Faroe",
    "Atlantic/Jan_Mayen": "Europe/Oslo",
    "Australia/ACT": "Australia/Sydney",
    "Australia/Canberra": "Australia/Sydney",
    "Australia/LHI": "Australia/Lord_Howe",
    "Australia/NSW": "Australia/Sydney",
    "Australia/North": "Australia/Darwin",
    "Australia/Queensland": "Australia/Brisbane",
    "Australia/South": "Australia/Adelaide",
    "Australia/Tasmania": "Australia/Hobart",
    "Australia/Victoria": "Australia/Melbourne",
    "Australia/West": "Australia/Perth",
    "Australia/Yancowinna": "Australia/Broken_Hill",
    "Brazil/Acre": "America/Rio_Branco",
    "Brazil/DeNoronha": "America/Noronha",
    "Brazil/East": "America/Sao_Paulo",
    "Brazil/West": "America/Manaus",
    "Canada/Atlantic": "America/Halifax",
    "Canada/Central": "America/Winnipeg",
    "Canada/East-Saskatchewan": "America/Regina",
    "Canada/Eastern": "America/Toronto",
    "Canada/Mountain": "America/Edmonton",
    "Canada/Newfoundland": "America/St_Johns",
    "Canada/Pacific": "America/Vancouver",
    "Canada/Saskatchewan": "America/Regina",
    "Canada/Yukon": "America/Whitehorse",
    "Chile/Continental": "America/Santiago",
    "Chile/EasterIsland": "Pacific/Easter",
    "Cuba": "America/Havana",
    "Egypt": "Africa/Cairo",
    "Eire": "Europe/Dublin",
    "Europe/Belfast": "Europe/London",
    "Europe/Tiraspol": "Europe/Chisinau",
    "GB": "Europe/London",
    "GB-Eire": "Europe/London",
    "GMT+0": "Etc/GMT",
    "GMT-0": "Etc/GMT",
    "GMT0": "Etc/GMT",
    "Greenwich": "Etc/GMT",
    "Hongkong": "Asia/Hong_Kong",
    "Iceland": "Atlantic/Reykjavik",
    "Iran": "Asia/Tehran",
    "Israel": "Asia/Jerusalem",
    "Jamaica": "America/Jamaica",
    "Japan": "Asia/Tokyo",
    "Kwajalein": "Pacific/Kwajalein",
    "Libya": "Africa/Tripoli",
    "Mexico/BajaNorte": "America/Tijuana",
    "Mexico/BajaSur": "America/Mazatlan",
    "Mexico/General": "America/Mexico_City",
    "NZ": "Pacific/Auckland",
    "NZ-CHAT": "Pacific/Chatham",
    "Navajo": "America/Denver",
    "PRC": "Asia/Shanghai",
    "Pacific/Samoa": "Pacific/Pago_Pago",
    "Pacific/Yap": "Pacific/Chuuk",
    "Pacific/Truk": "Pacific/Chuuk",
    "Pacific/Ponape": "Pacific/Pohnpei",
    "Poland": "Europe/Warsaw",
    "Portugal": "Europe/Lisbon",
    "ROC": "Asia/Taipei",
    "ROK": "Asia/Seoul",
    "Singapore": "Asia/Singapore",
    "Turkey": "Europe/Istanbul",
    "UCT": "Etc/UCT",
    "US/Alaska": "America/Anchorage",
    "US/Aleutian": "America/Adak",
    "US/Arizona": "America/Phoenix",
    "US/Central": "America/Chicago",
    "US/East-Indiana": "America/Indiana/Indianapolis",
    "US/Eastern": "America/New_York",
    "US/Hawaii": "Pacific/Honolulu",
    "US/Indiana-Starke": "America/Indiana/Knox",
    "US/Michigan": "America/Detroit",
    "US/Mountain": "America/Denver",
    "US/Pacific": "America/Los_Angeles",
    "US/Samoa": "Pacific/Pago_Pago",
    "UTC": "Etc/UTC",
    "Universal": "Etc/UTC",
    "W-SU": "Europe/Moscow",
    "Zulu": "Etc/UTC",
    "Europe/Mariehamn": "Europe/Helsinki",
    "Europe/Vatican": "Europe/Rome",
    "Europe/San_Marino": "Europe/Rome",
    "Arctic/Longyearbyen": "Europe/Oslo",
    "Europe/Ljubljana": "Europe/Belgrade",
    "Europe/Podgorica": "Europe/Belgrade",
    "Europe/Sarajevo": "Europe/Belgrade",
    "Europe/Skopje": "Europe/Belgrade",
    "Europe/Zagreb": "Europe/Belgrade",
    "Europe/Bratislava": "Europe/Prague",
    "America/Shiprock": "America/Denver",
    "America/St_Barthelemy": "America/Guadeloupe",
    "America/Marigot": "America/Guadeloupe"
};
/**
 * Timezone performs operations on a given timezone string represented in Olson tz database 
 * This module uses parts of zimbra AjxTimezone to handle time-zones
 * @module yTimezone
 * @requires tzoneData, tzoneLinks, yDateFormatData
 */

_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3145);
var MODULE_NAME = "datatype-date-timezone";
    
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3147);
AjxTimezone = function() {
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "AjxTimezone", 3147);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3148);
this.localeData = Y.Intl.get(MODULE_NAME);
};

//
// Static methods
//

_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3155);
AjxTimezone.getTransition = function(onset, year) {
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "getTransition", 3155);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3156);
var trans = [ year || new Date().getFullYear(), onset.mon, 1 ];
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3157);
if (onset.mday) {
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3158);
trans[2] = onset.mday;
    }
    else {_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3160);
if (onset.wkday) {
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3161);
var date = new Date(year, onset.mon - 1, 1, onset.hour, onset.min, onset.sec);

        // last wkday of month
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3164);
var wkday, adjust;
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3165);
if (onset.week == -1) {
            // NOTE: This creates a date of the *last* day of specified month by
            //       setting the month to *next* month and setting day of month
            //       to zero (i.e. the day *before* the first day).
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3169);
var last = new Date(new Date(date.getTime()).setMonth(onset.mon, 0));
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3170);
var count = last.getDate();
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3171);
wkday = last.getDay() + 1;
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3172);
adjust = wkday >= onset.wkday ? wkday - onset.wkday : 7 - onset.wkday - wkday;
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3173);
trans[2] = count - adjust;
        }

        // Nth wkday of month
        else {
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3178);
wkday = date.getDay() + 1;
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3179);
adjust = onset.wkday == wkday ? 1 :0;
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3180);
trans[2] = onset.wkday + 7 * (onset.week - adjust) - wkday + 1;
        }
    }}
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3183);
return trans;
};

_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3186);
AjxTimezone.addWkDayTransition = function(onset) {
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "addWkDayTransition", 3186);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3187);
var trans = onset.trans;
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3188);
var mon = trans[1];
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3189);
var monDay = trans[2];
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3190);
var week = Math.floor((monDay - 1) / 7);
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3191);
var date = new Date(trans[0], trans[1] - 1, trans[2], 12, 0, 0);

    // NOTE: This creates a date of the *last* day of specified month by
    //       setting the month to *next* month and setting day of month
    //       to zero (i.e. the day *before* the first day).
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3196);
var count = new Date(new Date(date.getTime()).setMonth(mon - 1, 0)).getDate();
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3197);
var last = count - monDay < 7;

    // set onset values
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3200);
onset.mon =  mon;
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3201);
onset.week = last ? -1 : week + 1;
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3202);
onset.wkday = date.getDay() + 1;
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3203);
onset.hour = trans[3];
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3204);
onset.min = trans[4];
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3205);
onset.sec = trans[5];
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3206);
return onset;
};

_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3209);
AjxTimezone.createTransitionDate = function(onset) {
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "createTransitionDate", 3209);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3210);
var date = new Date(TimezoneData.TRANSITION_YEAR, onset.mon - 1, 1, 12, 0, 0);
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3211);
if (onset.mday) {
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3212);
date.setDate(onset.mday);
    }
    else {_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3214);
if (onset.week == -1) {
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3215);
date.setMonth(date.getMonth() + 1, 0);
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3216);
for (var i = 0; i < 7; i++) {
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3217);
if (date.getDay() + 1 == onset.wkday) {
                _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3218);
break;
            }
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3220);
date.setDate(date.getDate() - 1);
        }
    }
    else {
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3224);
for (i = 0; i < 7; i++) {
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3225);
if (date.getDay() + 1 == onset.wkday) {
                _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3226);
break;
            }
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3228);
date.setDate(date.getDate() + 1);
        }
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3230);
date.setDate(date.getDate() + 7 * (onset.week - 1));
    }}
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3232);
var trans = [ date.getFullYear(), date.getMonth() + 1, date.getDate() ];
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3233);
return trans;
};

_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3236);
AjxTimezone.prototype.getShortName = function(tzId) {
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "getShortName", 3236);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3237);
var shortName = this.localeData[tzId + "_Z_short"] || ["GMT",AjxTimezone._SHORT_NAMES[tzId]].join("");
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3238);
return shortName;
};
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3240);
AjxTimezone.prototype.getMediumName = function(tzId) {
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "getMediumName", 3240);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3241);
var mediumName = this.localeData[tzId + "_Z_abbreviated"] || ['(',this.getShortName(tzId),') ',tzId].join("");
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3242);
return mediumName;
};
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3244);
AjxTimezone.prototype.getLongName = AjxTimezone.prototype.getMediumName;

_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3246);
AjxTimezone.addRule = function(rule) {
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "addRule", 3246);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3247);
var tzId = rule.tzId;

    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3249);
AjxTimezone._SHORT_NAMES[tzId] = AjxTimezone._generateShortName(rule.standard.offset);
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3250);
AjxTimezone._CLIENT2RULE[tzId] = rule;

    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3252);
var array = rule.daylight ? AjxTimezone.DAYLIGHT_RULES : AjxTimezone.STANDARD_RULES;
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3253);
array.push(rule);
};

_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3256);
AjxTimezone.getRule = function(tzId, tz) {
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "getRule", 3256);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3257);
var rule = AjxTimezone._CLIENT2RULE[tzId];
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3258);
if (!rule && tz) {
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3259);
var names = [ "standard", "daylight" ];
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3260);
var rules = tz.daylight ? AjxTimezone.DAYLIGHT_RULES : AjxTimezone.STANDARD_RULES;
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3261);
for (var i = 0; i < rules.length; i++) {
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3262);
rule = rules[i];

            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3264);
var found = true;
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3265);
for (var j = 0; j < names.length; j++) {
                _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3266);
var name = names[j];
                _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3267);
var onset = rule[name];
                _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3268);
if (!onset) {continue;}
			
                _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3270);
var breakOuter = false;

                _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3272);
for (var p in tz[name]) {
                    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3273);
if (tz[name][p] != onset[p]) {
                        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3274);
found = false;
                        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3275);
breakOuter = true;
                        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3276);
break;
                    }
                }
                
                _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3280);
if(breakOuter){
                    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3281);
break;
                }
            }
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3284);
if (found) {
                _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3285);
return rule;
            }
        }
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3288);
return null;
    }

    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3291);
return rule;
};

_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3294);
AjxTimezone.getOffset = function(tzId, date) {
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "getOffset", 3294);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3295);
var rule = AjxTimezone.getRule(tzId);
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3296);
if (rule && rule.daylight) {
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3297);
var year = date.getFullYear();

        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3299);
var standard = rule.standard, daylight  = rule.daylight;
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3300);
var stdTrans = AjxTimezone.getTransition(standard, year);
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3301);
var dstTrans = AjxTimezone.getTransition(daylight, year);

        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3303);
var month    = date.getMonth()+1, day = date.getDate();
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3304);
var stdMonth = stdTrans[1], stdDay = stdTrans[2];
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3305);
var dstMonth = dstTrans[1], dstDay = dstTrans[2];

        // northern hemisphere
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3308);
var isDST = false;
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3309);
if (dstMonth < stdMonth) {
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3310);
isDST = month > dstMonth && month < stdMonth;
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3311);
isDST = isDST || (month == dstMonth && day >= dstDay);
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3312);
isDST = isDST || (month == stdMonth && day <  stdDay);
        }

        // sorthern hemisphere
        else {
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3317);
isDST = month < dstMonth || month > stdMonth;
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3318);
isDST = isDST || (month == dstMonth && day <  dstDay);
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3319);
isDST = isDST || (month == stdMonth && day >= stdDay);
        }

        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3322);
return isDST ? daylight.offset : standard.offset;
    }
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3324);
return rule ? rule.standard.offset : -(new Date().getTimezoneOffset());
};

_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3327);
AjxTimezone._BY_OFFSET = function(arule, brule) {
    // sort by offset and then by name
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "_BY_OFFSET", 3327);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3329);
var delta = arule.standard.offset - brule.standard.offset;
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3330);
if (delta == 0) {
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3331);
var aname = arule.tzId;
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3332);
var bname = brule.tzId;
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3333);
if (aname < bname) {delta = -1;}
        else {_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3334);
if (aname > bname) {delta = 1;}}
    }
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3336);
return delta;
};

// Constants

_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3341);
AjxTimezone._SHORT_NAMES = {};
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3342);
AjxTimezone._CLIENT2RULE = {};

/** 
 * The data is specified using the server identifiers for historical
 * reasons. Perhaps in the future we'll use the client (i.e. Java)
 * identifiers on the server as well.
 */
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3349);
AjxTimezone.STANDARD_RULES = [];
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3350);
AjxTimezone.DAYLIGHT_RULES = [];
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3351);
(function() {
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "(anonymous 2)", 3351);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3352);
for (var i = 0; i < TimezoneData.TIMEZONE_RULES.length; i++) {
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3353);
var rule = TimezoneData.TIMEZONE_RULES[i];
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3354);
var array = rule.daylight ? AjxTimezone.DAYLIGHT_RULES : AjxTimezone.STANDARD_RULES;
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3355);
array.push(rule);
    }
})();

_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3359);
AjxTimezone._generateShortName = function(offset, period) {
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "_generateShortName", 3359);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3360);
if (offset == 0) {return "";}
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3361);
var sign = offset < 0 ? "-" : "+";
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3362);
var stdOffset = Math.abs(offset);
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3363);
var hours = Math.floor(stdOffset / 60);
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3364);
var minutes = stdOffset % 60;
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3365);
hours = hours < 10 ? '0' + hours : hours;
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3366);
minutes = minutes < 10 ? '0' + minutes : minutes;
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3367);
return [sign,hours,period?".":"",minutes].join("");
};

_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3370);
(function() {
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "(anonymous 3)", 3370);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3371);
TimezoneData.TIMEZONE_RULES.sort(AjxTimezone._BY_OFFSET);
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3372);
for (var j = 0; j < TimezoneData.TIMEZONE_RULES.length; j++) {
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3373);
var rule = TimezoneData.TIMEZONE_RULES[j];
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3374);
AjxTimezone.addRule(rule);
    }
})();

_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3378);
Array.prototype.indexOf = function(obj) {
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "indexOf", 3378);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3379);
for(var i=0; i<this.length; i++) {
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3380);
if(this[i] == obj) {
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3381);
return i;
        }
    }
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3384);
return -1;
}

_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3387);
AjxTimezone.getCurrentTimezoneIds = function(rawOffset) {
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "getCurrentTimezoneIds", 3387);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3388);
rawOffset = rawOffset/60;	//Need offset in minutes
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3389);
var result = [];
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3390);
var today = new Date();
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3391);
for(tzId in AjxTimezone._CLIENT2RULE) {
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3392);
if(rawOffset == 0 || AjxTimezone.getOffset(tzId, today) == rawOffset) {
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3393);
result.push(tzId);
        }
    }

    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3397);
for(link in TimezoneLinks) {
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3398);
if(result.indexOf(TimezoneLinks[link]) != -1) {
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3399);
result.push(link);
        }
    }
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3402);
return result;
}

_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3405);
AjxTimezone.getTimezoneIdForOffset = function(rawOffset) {
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "getTimezoneIdForOffset", 3405);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3406);
rawOffset = rawOffset/60;	//Need offset in minutes

    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3408);
if(rawOffset % 60 == 0) {
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3409);
var etcGMTId = "Etc/GMT";
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3410);
if(rawOffset != 0) {
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3411);
etcGMTId += (rawOffset > 0? "-": "+") + rawOffset/60;
        }

        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3414);
if(AjxTimezone._CLIENT2RULE[etcGMTId] != null) {
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3415);
return etcGMTId;
        } 
    }
	
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3419);
var today = new Date();
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3420);
for(tzId in AjxTimezone._CLIENT2RULE) {
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3421);
if(AjxTimezone.getOffset(tzId, today) == rawOffset) {
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3422);
return tzId;
        }
    }

    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3426);
return "";
}

_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3429);
AjxTimezone.isDST = function(tzId, date) {
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "isDST", 3429);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3430);
var rule = AjxTimezone.getRule(tzId);
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3431);
if (rule && rule.daylight) {
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3432);
var year = date.getFullYear();

        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3434);
var standard = rule.standard, daylight  = rule.daylight;
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3435);
var stdTrans = AjxTimezone.getTransition(standard, year);
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3436);
var dstTrans = AjxTimezone.getTransition(daylight, year);

        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3438);
var month    = date.getMonth()+1, day = date.getDate();
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3439);
var stdMonth = stdTrans[1], stdDay = stdTrans[2];
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3440);
var dstMonth = dstTrans[1], dstDay = dstTrans[2];

        // northern hemisphere
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3443);
var isDSTActive = false;
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3444);
if (dstMonth < stdMonth) {
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3445);
isDSTActive = month > dstMonth && month < stdMonth;
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3446);
isDSTActive = isDSTActive || (month == dstMonth && day >= dstDay);
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3447);
isDSTActive = isDSTActive || (month == stdMonth && day <  stdDay);
        }

        // sorthern hemisphere
        else {
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3452);
isDSTActive = month < dstMonth || month > stdMonth;
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3453);
isDSTActive = isDSTActive || (month == dstMonth && day <  dstDay);
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3454);
isDSTActive = isDSTActive || (month == stdMonth && day >= stdDay);
        }

        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3457);
return isDSTActive? 1:0;
    }
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3459);
return -1;
}

_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3462);
AjxTimezone.isValidTimezoneId = function(tzId) {
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "isValidTimezoneId", 3462);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3463);
return (AjxTimezone._CLIENT2RULE[tzId] != null || TimezoneLinks[tzId] != null);
}

//
// Start YUI Code
//
    
//Support methods first

/**
 * Pad number so that it is atleast num characters long
 * @param {String} num String to be padded
 * @param {Number} length (Optional) Minimum number of characters the string should have after padding. If omitted, defaults to 2
 * @return {String} The padded string
 */
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3478);
function zeroPad(num, length) {
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "zeroPad", 3478);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3479);
length = length || 2;
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3480);
var str = num + "";
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3481);
for(var i=str.length; i<length; i++) {
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3482);
str = "0" + str;
    }
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3484);
return str;
}

/**
 * Get Day of Year(0-365) for the date passed
 * @param {Date} date
 * @return {Number} Day of Year
 */
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3492);
function getDOY(date) {
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "getDOY", 3492);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3493);
var oneJan = new Date(date.getFullYear(),0,1);
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3494);
return Math.ceil((date - oneJan) / 86400000);
}
    
/**
 * Get integer part of floating point argument
 * @param floatNum A real number
 * @return Integer part of floatNum
 */
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3502);
function floatToInt(floatNum) {
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "floatToInt", 3502);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3503);
return (floatNum < 0) ? Math.ceil(floatNum) : Math.floor(floatNum);
}

/**
 * Timezone constructor. locale is optional, if not specified, defaults to root locale
 * @class Timezone
 * @constructor
 * @param {String} tzId TimeZone ID as in Olson tz database
 */
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3512);
Timezone = function(tzId) {
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "Timezone", 3512);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3513);
var normalizedId = Timezone.getNormalizedTimezoneId(tzId);
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3514);
if(normalizedId == "") {
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3515);
throw new Timezone.UnknownTimeZoneException("Could not find timezone: " + tzId);
    }
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3517);
this.tzId = normalizedId;
        
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3519);
this._ajxTimeZoneInstance = new AjxTimezone();
}

//Exception Handling
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3523);
Timezone.UnknownTimeZoneException = function (message) {
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "UnknownTimeZoneException", 3523);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3524);
this.message = message;
}
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3526);
Timezone.UnknownTimeZoneException.prototype.toString = function () {
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "toString", 3526);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3527);
return 'UnknownTimeZoneException: ' + this.message;
}

//Static methods

/**
 * Returns list of timezone Id's that have the same rawOffSet as passed in
 * @param {Number} rawOffset Raw offset (in seconds) from GMT.
 * @return {Array} array of timezone Id's that match rawOffset passed in to the API. 
 */
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3537);
Timezone.getCurrentTimezoneIds = function(rawOffset) {
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "getCurrentTimezoneIds", 3537);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3538);
return AjxTimezone.getCurrentTimezoneIds(rawOffset);
}

/**
 * Given a raw offset in seconds, get the tz database ID that reflects the given raw offset, or empty string if there is no such ID. Where available, the function will return an ID 
 * starting with "Etc/GMT"; for offsets where no such ID exists but that are used by actual time zones, the ID of one of those time zones is returned.
 * Note that the offset shown in an "Etc/GMT" ID is opposite to the value of rawOffset
 * @param {Number} rawOffset Offset from GMT in seconds
 * @return {String} timezone id
 */
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3548);
Timezone.getTimezoneIdForOffset = function(rawOffset) {
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "getTimezoneIdForOffset", 3548);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3549);
return AjxTimezone.getTimezoneIdForOffset(rawOffset);
}

/**
 * Given a wall time reference, convert it to UNIX time - seconds since Epoch
 * @param {Object} walltime Walltime that needs conversion. Missing properties will be treat as 0.
 * @return {Number} UNIX time - time in seconds since Epoch
 */
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3557);
Timezone.getUnixTimeFromWallTime = function(walltime) {
    /*
	 * Initialize any missing properties.
	 */
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "getUnixTimeFromWallTime", 3557);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3561);
if(walltime.year == null) {
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3562);
walltime.year = new Date().getFullYear();	//Default to current year
    }
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3564);
if(walltime.mon == null) {
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3565);
walltime.mon = 0;				//Default to January
    }
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3567);
if(walltime.mday == null) {
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3568);
walltime.mday = 1;				//Default to first of month
    }
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3570);
if(walltime.hour == null) {			//Default to 12 midnight
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3571);
walltime.hour = 0;
    }
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3573);
if(walltime.min == null) {
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3574);
walltime.min = 0;
    }
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3576);
if(walltime.sec == null) {
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3577);
walltime.sec = 0;
    }
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3579);
if(walltime.gmtoff == null) {			//Default to UTC
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3580);
walltime.gmtoff = 0;
    }

    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3583);
var utcTime = Date.UTC(walltime.year, walltime.mon, walltime.mday, walltime.hour, walltime.min, walltime.sec);
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3584);
utcTime -= walltime.gmtoff*1000;

    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3586);
return floatToInt(utcTime/1000);	//Unix time: count from midnight Jan 1 1970 UTC
}

/**
 * Checks if the timestamp passed in is a valid timestamp for this timezone and offset.
 * @param {String} timeStamp Time value in UTC RFC3339 format - yyyy-mm-ddThh:mm:ssZ or yyyy-mm-ddThh:mm:ss+/-HH:MM
 * @param {Number} rawOffset An offset from UTC in seconds. 
 * @return {Boolean} true if valid timestamp, false otherwise
 */
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3595);
Timezone.isValidTimestamp = function(timeStamp, rawOffset) {
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "isValidTimestamp", 3595);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3596);
var regex = /^(\d\d\d\d)-([0-1][0-9])-([0-3][0-9])([T ])([0-2][0-9]):([0-6][0-9]):([0-6][0-9])(Z|[+-][0-1][0-9]:[0-3][0-9])?$/
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3597);
var matches = (new RegExp(regex)).exec(timeStamp);

    //No match
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3600);
if(matches == null) {
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3601);
return false;
    }

    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3604);
var year = parseInt(matches[1]),
    month = parseInt(matches[2]),
    day = parseInt(matches[3]),
    dateTimeSeparator = matches[4],
    hours = parseInt(matches[5]),
    minutes = parseInt(matches[6]),
    seconds = parseInt(matches[7]),
    tZone = matches[8];
    //Month should be in 1-12
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3613);
if(month < 1 || month > 12) {
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3614);
return false;
    }

    //Months with 31 days
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3618);
var m31 = [1,3,5,7,8,10,12];
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3619);
var maxDays = 30;
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3620);
if(m31.indexOf(month) != -1) {
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3621);
maxDays = 31;
    } else {_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3622);
if(month == 2) {
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3623);
if(year % 400 == 0) {
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3624);
maxDays = 29;
        } else {_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3625);
if(year % 100 == 0) {
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3626);
maxDays = 28;
        } else {_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3627);
if(year % 4 == 0) {
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3628);
maxDays = 29;
        } else {
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3630);
maxDays = 28;
        }}}
    }}

    //Day should be valid day for month
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3635);
if(day < 1 || day > maxDays) {	
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3636);
return false;
    }

    //Hours should be in 0-23
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3640);
if(hours < 0 || hours > 23) {
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3641);
return false;
    }

    //Minutes and Seconds should in 0-59
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3645);
if(minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3646);
return false;
    }

    //Now verify timezone
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3650);
if(dateTimeSeparator == " " && tZone == null) {
        //SQL Format
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3652);
return true;
    } else {_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3653);
if(dateTimeSeparator == "T" && tZone != null) {
        //RFC3339 Format
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3655);
var offset = 0;
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3656);
if(tZone != "Z") {
            //Not UTC TimeZone
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3658);
offset = parseInt(tZone.substr(1,3))*60 + parseInt(tZone.substr(4));
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3659);
offset = offset*60;	//To seconds

            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3661);
offset = offset * (tZone.charAt(0) == "+" ? 1 : -1);
        }
        //Check offset in timeStamp with passed rawOffset
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3664);
if(offset == rawOffset) {
            _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3665);
return true;
        }
    }}

    //If reached here, wrong format
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3670);
return false;
}

/**
 * Checks if tzId passed in is a valid Timezone id in tz database.
 * @param {String} tzId timezoneId to be checked for validity
 * @return {Boolean} true if tzId is a valid timezone id in tz database. tzId could be a "zone" id or a "link" id to be a valid tz Id. False otherwise
 */
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3678);
Timezone.isValidTimezoneId = function(tzId) {
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "isValidTimezoneId", 3678);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3679);
return AjxTimezone.isValidTimezoneId(tzId);
}

/**
 * Returns the normalized version of the time zone ID, or empty string if tzId is not a valid time zone ID.
 * If tzId is a link Id, the standard name will be returned.
 * @param {String} tzId The timezone ID whose normalized form is requested.
 * @return {String} The normalized version of the timezone Id, or empty string if tzId is not a valid time zone Id.
 */
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3688);
Timezone.getNormalizedTimezoneId = function(tzId) {
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "getNormalizedTimezoneId", 3688);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3689);
if(!Timezone.isValidTimezoneId(tzId)) {
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3690);
return "";
    }
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3692);
var normalizedId;       
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3693);
var next = tzId;
        
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3695);
do {
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3696);
normalizedId = next;
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3697);
next = TimezoneLinks[normalizedId];
    }while( next != null );
        
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3700);
return normalizedId;
}
    
//Private methods

/**
 * Parse RFC3339 date format and return the Date
 * Format: yyyy-mm-ddThh:mm:ssZ
 * @param {String} dString The date string to be parsed
 * @return {Date} The date represented by dString
 */
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3711);
Timezone.prototype._parseRFC3339 = function(dString){
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "_parseRFC3339", 3711);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3712);
var regexp = /(\d+)(-)?(\d+)(-)?(\d+)(T)?(\d+)(:)?(\d+)(:)?(\d+)(\.\d+)?(Z|([+-])(\d+)(:)?(\d+))/; 

    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3714);
var result = new Date();

    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3716);
var d = dString.match(regexp);
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3717);
var offset = 0;

    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3719);
result.setUTCDate(1);
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3720);
result.setUTCFullYear(parseInt(d[1],10));
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3721);
result.setUTCMonth(parseInt(d[3],10) - 1);
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3722);
result.setUTCDate(parseInt(d[5],10));
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3723);
result.setUTCHours(parseInt(d[7],10));
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3724);
result.setUTCMinutes(parseInt(d[9],10));
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3725);
result.setUTCSeconds(parseInt(d[11],10));
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3726);
if (d[12]) {
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3727);
result.setUTCMilliseconds(parseFloat(d[12]) * 1000);
    } else {
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3729);
result.setUTCMilliseconds(0);
    }
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3731);
if (d[13] != 'Z') {
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3732);
offset = (d[15] * 60) + parseInt(d[17],10);
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3733);
offset *= ((d[14] == '-') ? -1 : 1);
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3734);
result.setTime(result.getTime() - offset * 60 * 1000);
    }
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3736);
return result;
}

/**
 * Parse SQL date format and return the Date
 * Format: yyyy-mm-dd hh:mm:ss
 * @param {String} dString The date string to be parsed
 * @return {Date} The date represented by dString
 */
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3745);
Timezone.prototype._parseSQLFormat = function(dString) {
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "_parseSQLFormat", 3745);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3746);
var dateTime = dString.split(" ");
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3747);
var date = dateTime[0].split("-");
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3748);
var time = dateTime[1].split(":");

    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3750);
var offset = AjxTimezone.getOffset(this.tzId, new Date(date[0], date[1] - 1, date[2]));
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3751);
return new Date(Date.UTC(date[0], date[1] - 1, date[2], time[0], time[1], time[2]) - offset*60*1000);
}

//Public methods

//For use in Y.DateFormat.
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3757);
Timezone.prototype.getShortName = function() {
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "getShortName", 3757);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3758);
return this._ajxTimeZoneInstance.getShortName(this.tzId);
}

//For use in Y.DateFormat.
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3762);
Timezone.prototype.getMediumName = function() {
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "getMediumName", 3762);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3763);
return this._ajxTimeZoneInstance.getMediumName(this.tzId);
}

//For use in Y.DateFormat.
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3767);
Timezone.prototype.getLongName = function() {
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "getLongName", 3767);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3768);
return this._ajxTimeZoneInstance.getLongName(this.tzId);
}
    
/**
 * Given a timevalue representation in RFC 3339 or SQL format, convert to UNIX time - seconds since Epoch ie., since 1970-01-01T00:00:00Z
 * @param {String} timeValue TimeValue representation in RFC 3339 or SQL format.
 * @return {Number} UNIX time - time in seconds since Epoch
 */
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3776);
Timezone.prototype.convertToIncrementalUTC = function(timeValue) {
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "convertToIncrementalUTC", 3776);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3777);
if(timeValue.indexOf("T") != -1) {
        //RFC3339
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3779);
return this._parseRFC3339(timeValue).getTime() / 1000;
    } else {
        //SQL
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3782);
return this._parseSQLFormat(timeValue).getTime() / 1000;
    }
}

/**
 * Given UNIX time - seconds since Epoch ie., 1970-01-01T00:00:00Z, convert the timevalue to RFC3339 format - "yyyy-mm-ddThh:mm:ssZ"
 * @param {Number} timeValue time value in seconds since Epoch.
 * @return {String} RFC3339 format timevalue - "yyyy-mm-ddThh:mm:ssZ"
 */
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3791);
Timezone.prototype.convertUTCToRFC3339Format = function(timeValue) {
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "convertUTCToRFC3339Format", 3791);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3792);
var uTime = new Date(timeValue * 1000);
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3793);
var offset = AjxTimezone.getOffset(this.tzId, uTime);

    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3795);
var offsetString = "Z";
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3796);
if(offset != 0) {
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3797);
var offsetSign = (offset > 0 ? "+": "-");
        _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3798);
offsetString = offsetSign + zeroPad(Math.abs(floatToInt(offset/60))) + ":" + zeroPad(offset % 60);
    }

    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3801);
uTime.setTime(timeValue*1000 + offset*60*1000);

    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3803);
var rfc3339 = zeroPad(uTime.getUTCFullYear(), 4) + "-" + zeroPad((uTime.getUTCMonth() + 1)) + "-" + zeroPad(uTime.getUTCDate()) 
    + "T" + zeroPad(uTime.getUTCHours()) + ":" + zeroPad(uTime.getUTCMinutes()) + ":" + zeroPad(uTime.getUTCSeconds()) + offsetString;

    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3806);
return rfc3339;
}

/**
 * Given UNIX Time - seconds since Epoch ie., 1970-01-01T00:00:00Z, convert the timevalue to SQL Format - "yyyy-mm-dd hh:mm:ss"
 * @param {Number} timeValue time value in seconds since Epoch.
 * @return {String} SQL Format timevalue - "yyyy-mm-dd hh:mm:ss"
 */
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3814);
Timezone.prototype.convertUTCToSQLFormat = function(timeValue) {
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "convertUTCToSQLFormat", 3814);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3815);
var uTime = new Date(timeValue * 1000);
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3816);
var offset = AjxTimezone.getOffset(this.tzId, uTime);
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3817);
uTime.setTime(timeValue*1000 + offset*60*1000);

    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3819);
var sqlDate = zeroPad(uTime.getUTCFullYear(), 4) + "-" + zeroPad((uTime.getUTCMonth() + 1)) + "-" + zeroPad(uTime.getUTCDate()) 
    + " " + zeroPad(uTime.getUTCHours()) + ":" + zeroPad(uTime.getUTCMinutes()) + ":" + zeroPad(uTime.getUTCSeconds());

    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3822);
return sqlDate;
}

/**
 * Gets the offset of this timezone in seconds from UTC
 * @return {Number} offset of this timezone in seconds from UTC
 */
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3829);
Timezone.prototype.getRawOffset = function() {
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "getRawOffset", 3829);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3830);
return AjxTimezone.getOffset(this.tzId, new Date()) * 60;
}

/**
 * Given a unix time, convert it to wall time for this timezone.
 * @param {Number} timeValue value in seconds from Epoch.
 * @return {Object} an object with the properties: sec, min, hour, mday, mon, year, wday, yday, isdst, gmtoff, zone. All of these are integers except for zone, which is a string. isdst is 1 if DST is active, and 0 if DST is inactive.
 */
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3838);
Timezone.prototype.getWallTimeFromUnixTime = function(timeValue) {
    _yuitest_coverfunc("build/datatype-date-timezone/datatype-date-timezone.js", "getWallTimeFromUnixTime", 3838);
_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3839);
var offset = AjxTimezone.getOffset(this.tzId, new Date(timeValue*1000)) * 60;
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3840);
var localTimeValue = timeValue + offset;
    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3841);
var date = new Date(localTimeValue*1000);

    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3843);
var walltime = {
        sec: date.getUTCSeconds(),
        min: date.getUTCMinutes(),
        hour: date.getUTCHours(),
        mday: date.getUTCDate(),
        mon: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        wday: date.getUTCDay(),
        yday: getDOY(date),
        isdst: AjxTimezone.isDST(this.tzId, new Date(timeValue)),
        gmtoff: offset,
        zone: this.tzId
    };

    _yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3857);
return walltime;
}

_yuitest_coverline("build/datatype-date-timezone/datatype-date-timezone.js", 3860);
Y.Date.Timezone = Timezone;

}, '@VERSION@', {"lang": [], "requires": ["datatype-date-format"]});
