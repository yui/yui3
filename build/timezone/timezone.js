YUI.add('timezone', function (Y, NAME) {

/*
 *  Copyright 2012 Yahoo! Inc. All Rights Reserved. Based on code owned by VMWare, Inc. 
 */
TimezoneData = {};

TimezoneData.TRANSITION_YEAR = 2011;

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
 * Y.TimeZone performs operations on a given timezone string represented in Olson tz database 
 * This module uses parts of zimbra AjxTimezone to handle time-zones
 * @module yTimezone
 * @requires tzoneData, tzoneLinks, yDateFormatData
 */

var MODULE_NAME = "timezone";
    
AjxTimezone = function() {
    this.localeData = Y.Intl.get(MODULE_NAME);
};

//
// Static methods
//

AjxTimezone.getTransition = function(onset, year) {
    var trans = [ year || new Date().getFullYear(), onset.mon, 1 ];
    if (onset.mday) {
        trans[2] = onset.mday;
    }
    else if (onset.wkday) {
        var date = new Date(year, onset.mon - 1, 1, onset.hour, onset.min, onset.sec);

        // last wkday of month
        var wkday, adjust;
        if (onset.week == -1) {
            // NOTE: This creates a date of the *last* day of specified month by
            //       setting the month to *next* month and setting day of month
            //       to zero (i.e. the day *before* the first day).
            var last = new Date(new Date(date.getTime()).setMonth(onset.mon, 0));
            var count = last.getDate();
            wkday = last.getDay() + 1;
            adjust = wkday >= onset.wkday ? wkday - onset.wkday : 7 - onset.wkday - wkday;
            trans[2] = count - adjust;
        }

        // Nth wkday of month
        else {
            wkday = date.getDay() + 1;
            adjust = onset.wkday == wkday ? 1 :0;
            trans[2] = onset.wkday + 7 * (onset.week - adjust) - wkday + 1;
        }
    }
    return trans;
};

AjxTimezone.addWkDayTransition = function(onset) {
    var trans = onset.trans;
    var mon = trans[1];
    var monDay = trans[2];
    var week = Math.floor((monDay - 1) / 7);
    var date = new Date(trans[0], trans[1] - 1, trans[2], 12, 0, 0);

    // NOTE: This creates a date of the *last* day of specified month by
    //       setting the month to *next* month and setting day of month
    //       to zero (i.e. the day *before* the first day).
    var count = new Date(new Date(date.getTime()).setMonth(mon - 1, 0)).getDate();
    var last = count - monDay < 7;

    // set onset values
    onset.mon =  mon;
    onset.week = last ? -1 : week + 1;
    onset.wkday = date.getDay() + 1;
    onset.hour = trans[3];
    onset.min = trans[4];
    onset.sec = trans[5];
    return onset;
};

AjxTimezone.createTransitionDate = function(onset) {
    var date = new Date(TimezoneData.TRANSITION_YEAR, onset.mon - 1, 1, 12, 0, 0);
    if (onset.mday) {
        date.setDate(onset.mday);
    }
    else if (onset.week == -1) {
        date.setMonth(date.getMonth() + 1, 0);
        for (var i = 0; i < 7; i++) {
            if (date.getDay() + 1 == onset.wkday) {
                break;
            }
            date.setDate(date.getDate() - 1);
        }
    }
    else {
        for (i = 0; i < 7; i++) {
            if (date.getDay() + 1 == onset.wkday) {
                break;
            }
            date.setDate(date.getDate() + 1);
        }
        date.setDate(date.getDate() + 7 * (onset.week - 1));
    }
    var trans = [ date.getFullYear(), date.getMonth() + 1, date.getDate() ];
    return trans;
};

AjxTimezone.prototype.getShortName = function(tzId) {
    var shortName = this.localeData[tzId + "_Z_short"] || ["GMT",AjxTimezone._SHORT_NAMES[tzId]].join("");
    return shortName;
};
AjxTimezone.prototype.getMediumName = function(tzId) {
    var mediumName = this.localeData[tzId + "_Z_abbreviated"] || ['(',this.getShortName(tzId),') ',tzId].join("");
    return mediumName;
};
AjxTimezone.prototype.getLongName = AjxTimezone.prototype.getMediumName;

AjxTimezone.addRule = function(rule) {
    var tzId = rule.tzId;

    AjxTimezone._SHORT_NAMES[tzId] = AjxTimezone._generateShortName(rule.standard.offset);
    AjxTimezone._CLIENT2RULE[tzId] = rule;

    var array = rule.daylight ? AjxTimezone.DAYLIGHT_RULES : AjxTimezone.STANDARD_RULES;
    array.push(rule);
};

AjxTimezone.getRule = function(tzId, tz) {
    var rule = AjxTimezone._CLIENT2RULE[tzId];
    if (!rule && tz) {
        var names = [ "standard", "daylight" ];
        var rules = tz.daylight ? AjxTimezone.DAYLIGHT_RULES : AjxTimezone.STANDARD_RULES;
        for (var i = 0; i < rules.length; i++) {
            rule = rules[i];

            var found = true;
            for (var j = 0; j < names.length; j++) {
                var name = names[j];
                var onset = rule[name];
                if (!onset) continue;
			
                var breakOuter = false;

                for (var p in tz[name]) {
                    if (tz[name][p] != onset[p]) {
                        found = false;
                        breakOuter = true;
                        break;
                    }
                }
                
                if(breakOuter){
                    break;
                }
            }
            if (found) {
                return rule;
            }
        }
        return null;
    }

    return rule;
};

AjxTimezone.getOffset = function(tzId, date) {
    var rule = AjxTimezone.getRule(tzId);
    if (rule && rule.daylight) {
        var year = date.getFullYear();

        var standard = rule.standard, daylight  = rule.daylight;
        var stdTrans = AjxTimezone.getTransition(standard, year);
        var dstTrans = AjxTimezone.getTransition(daylight, year);

        var month    = date.getMonth()+1, day = date.getDate();
        var stdMonth = stdTrans[1], stdDay = stdTrans[2];
        var dstMonth = dstTrans[1], dstDay = dstTrans[2];

        // northern hemisphere
        var isDST = false;
        if (dstMonth < stdMonth) {
            isDST = month > dstMonth && month < stdMonth;
            isDST = isDST || (month == dstMonth && day >= dstDay);
            isDST = isDST || (month == stdMonth && day <  stdDay);
        }

        // sorthern hemisphere
        else {
            isDST = month < dstMonth || month > stdMonth;
            isDST = isDST || (month == dstMonth && day <  dstDay);
            isDST = isDST || (month == stdMonth && day >= stdDay);
        }

        return isDST ? daylight.offset : standard.offset;
    }
    return rule ? rule.standard.offset : -(new Date().getTimezoneOffset());
};

AjxTimezone._BY_OFFSET = function(arule, brule) {
    // sort by offset and then by name
    var delta = arule.standard.offset - brule.standard.offset;
    if (delta == 0) {
        var aname = arule.tzId;
        var bname = brule.tzId;
        if (aname < bname) delta = -1;
        else if (aname > bname) delta = 1;
    }
    return delta;
};

// Constants

AjxTimezone._SHORT_NAMES = {};
AjxTimezone._CLIENT2RULE = {};

/** 
 * The data is specified using the server identifiers for historical
 * reasons. Perhaps in the future we'll use the client (i.e. Java)
 * identifiers on the server as well.
 */
AjxTimezone.STANDARD_RULES = [];
AjxTimezone.DAYLIGHT_RULES = [];
(function() {
    for (var i = 0; i < TimezoneData.TIMEZONE_RULES.length; i++) {
        var rule = TimezoneData.TIMEZONE_RULES[i];
        var array = rule.daylight ? AjxTimezone.DAYLIGHT_RULES : AjxTimezone.STANDARD_RULES;
        array.push(rule);
    }
})();

AjxTimezone._generateShortName = function(offset, period) {
    if (offset == 0) return "";
    var sign = offset < 0 ? "-" : "+";
    var stdOffset = Math.abs(offset);
    var hours = Math.floor(stdOffset / 60);
    var minutes = stdOffset % 60;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return [sign,hours,period?".":"",minutes].join("");
};

(function() {
    TimezoneData.TIMEZONE_RULES.sort(AjxTimezone._BY_OFFSET);
    for (var j = 0; j < TimezoneData.TIMEZONE_RULES.length; j++) {
        var rule = TimezoneData.TIMEZONE_RULES[j];
        AjxTimezone.addRule(rule);
    }
})();

Array.prototype.indexOf = function(obj) {
    for(var i=0; i<this.length; i++) {
        if(this[i] == obj) {
            return i;
        }
    }
    return -1;
}

AjxTimezone.getCurrentTimezoneIds = function(rawOffset) {
    rawOffset = rawOffset/60;	//Need offset in minutes
    var result = [];
    var today = new Date();
    for(tzId in AjxTimezone._CLIENT2RULE) {
        if(rawOffset == 0 || AjxTimezone.getOffset(tzId, today) == rawOffset) {
            result.push(tzId);
        }
    }

    for(link in TimezoneLinks) {
        if(result.indexOf(TimezoneLinks[link]) != -1) {
            result.push(link);
        }
    }
    return result;
}

AjxTimezone.getTimezoneIdForOffset = function(rawOffset) {
    rawOffset = rawOffset/60;	//Need offset in minutes

    if(rawOffset % 60 == 0) {
        var etcGMTId = "Etc/GMT";
        if(rawOffset != 0) {
            etcGMTId += (rawOffset > 0? "-": "+") + rawOffset/60;
        }

        if(AjxTimezone._CLIENT2RULE[etcGMTId] != null) {
            return etcGMTId;
        } 
    }
	
    var today = new Date();
    for(tzId in AjxTimezone._CLIENT2RULE) {
        if(AjxTimezone.getOffset(tzId, today) == rawOffset) {
            return tzId;
        }
    }

    return "";
}

AjxTimezone.isDST = function(tzId, date) {
    var rule = AjxTimezone.getRule(tzId);
    if (rule && rule.daylight) {
        var year = date.getFullYear();

        var standard = rule.standard, daylight  = rule.daylight;
        var stdTrans = AjxTimezone.getTransition(standard, year);
        var dstTrans = AjxTimezone.getTransition(daylight, year);

        var month    = date.getMonth()+1, day = date.getDate();
        var stdMonth = stdTrans[1], stdDay = stdTrans[2];
        var dstMonth = dstTrans[1], dstDay = dstTrans[2];

        // northern hemisphere
        var isDSTActive = false;
        if (dstMonth < stdMonth) {
            isDSTActive = month > dstMonth && month < stdMonth;
            isDSTActive = isDSTActive || (month == dstMonth && day >= dstDay);
            isDSTActive = isDSTActive || (month == stdMonth && day <  stdDay);
        }

        // sorthern hemisphere
        else {
            isDSTActive = month < dstMonth || month > stdMonth;
            isDSTActive = isDSTActive || (month == dstMonth && day <  dstDay);
            isDSTActive = isDSTActive || (month == stdMonth && day >= stdDay);
        }

        return isDSTActive? 1:0;
    }
    return -1;
}

AjxTimezone.isValidTimezoneId = function(tzId) {
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
function zeroPad(num, length) {
    length = length || 2;
    var str = num + "";
    for(var i=str.length; i<length; i++) {
        str = "0" + str;
    }
    return str;
}

/**
 * Get Day of Year(0-365) for the date passed
 * @param {Date} date
 * @return {Number} Day of Year
 */
function getDOY(date) {
    var oneJan = new Date(date.getFullYear(),0,1);
    return Math.ceil((date - oneJan) / 86400000);
}
    
/**
 * Get integer part of floating point argument
 * @param floatNum A real number
 * @return Integer part of floatNum
 */
function floatToInt(floatNum) {
    return (floatNum < 0) ? Math.ceil(floatNum) : Math.floor(floatNum);
}

/**
 * Y.TimeZone constructor. locale is optional, if not specified, defaults to root locale
 * @class Y.TimeZone
 * @constructor
 * @param {String} tzId TimeZone ID as in Olson tz database
 */
Y.TimeZone = function(tzId) {
    var normalizedId = Y.TimeZone.getNormalizedTimezoneId(tzId);
    if(normalizedId == "") {
        throw new Y.TimeZone.UnknownTimeZoneException("Could not find timezone: " + tzId);
    }
    this.tzId = normalizedId;
        
    this._ajxTimeZoneInstance = new AjxTimezone();
}

//Exception Handling
Y.TimeZone.UnknownTimeZoneException = function (message) {
    this.message = message;
}
Y.TimeZone.UnknownTimeZoneException.prototype.toString = function () {
    return 'UnknownTimeZoneException: ' + this.message;
}

//Static methods

/**
 * Returns list of timezone Id's that have the same rawOffSet as passed in
 * @param {Number} rawOffset Raw offset (in seconds) from GMT.
 * @return {Array} array of timezone Id's that match rawOffset passed in to the API. 
 */
Y.TimeZone.getCurrentTimezoneIds = function(rawOffset) {
    return AjxTimezone.getCurrentTimezoneIds(rawOffset);
}

/**
 * Given a raw offset in seconds, get the tz database ID that reflects the given raw offset, or empty string if there is no such ID. Where available, the function will return an ID 
 * starting with "Etc/GMT"; for offsets where no such ID exists but that are used by actual time zones, the ID of one of those time zones is returned.
 * Note that the offset shown in an "Etc/GMT" ID is opposite to the value of rawOffset
 * @param {Number} rawOffset Offset from GMT in seconds
 * @return {String} timezone id
 */
Y.TimeZone.getTimezoneIdForOffset = function(rawOffset) {
    return AjxTimezone.getTimezoneIdForOffset(rawOffset);
}

/**
 * Given a wall time reference, convert it to UNIX time - seconds since Epoch
 * @param {Object} walltime Walltime that needs conversion. Missing properties will be treat as 0.
 * @return {Number} UNIX time - time in seconds since Epoch
 */
Y.TimeZone.getUnixTimeFromWallTime = function(walltime) {
    /*
	 * Initialize any missing properties.
	 */
    if(walltime.year == null) {
        walltime.year = new Date().getFullYear();	//Default to current year
    }
    if(walltime.mon == null) {
        walltime.mon = 0;				//Default to January
    }
    if(walltime.mday == null) {
        walltime.mday = 1;				//Default to first of month
    }
    if(walltime.hour == null) {			//Default to 12 midnight
        walltime.hour = 0;
    }
    if(walltime.min == null) {
        walltime.min = 0;
    }
    if(walltime.sec == null) {
        walltime.sec = 0;
    }
    if(walltime.gmtoff == null) {			//Default to UTC
        walltime.gmtoff = 0;
    }

    var utcTime = Date.UTC(walltime.year, walltime.mon, walltime.mday, walltime.hour, walltime.min, walltime.sec);
    utcTime -= walltime.gmtoff*1000;

    return floatToInt(utcTime/1000);	//Unix time: count from midnight Jan 1 1970 UTC
}

/**
 * Checks if the timestamp passed in is a valid timestamp for this timezone and offset.
 * @param {String} timeStamp Time value in UTC RFC3339 format - yyyy-mm-ddThh:mm:ssZ or yyyy-mm-ddThh:mm:ss+/-HH:MM
 * @param {Number} rawOffset An offset from UTC in seconds. 
 * @return {Boolean} true if valid timestamp, false otherwise
 */
Y.TimeZone.isValidTimestamp = function(timeStamp, rawOffset) {
    var regex = /^(\d\d\d\d)-([0-1][0-9])-([0-3][0-9])([T ])([0-2][0-9]):([0-6][0-9]):([0-6][0-9])(Z|[+-][0-1][0-9]:[0-3][0-9])?$/
    var matches = (new RegExp(regex)).exec(timeStamp);

    //No match
    if(matches == null) {
        return false;
    }

    var year = parseInt(matches[1]),
    month = parseInt(matches[2]),
    day = parseInt(matches[3]),
    dateTimeSeparator = matches[4],
    hours = parseInt(matches[5]),
    minutes = parseInt(matches[6]),
    seconds = parseInt(matches[7]),
    tZone = matches[8];
    //Month should be in 1-12
    if(month < 1 || month > 12) {
        return false;
    }

    //Months with 31 days
    var m31 = [1,3,5,7,8,10,12];
    var maxDays = 30;
    if(m31.indexOf(month) != -1) {
        maxDays = 31;
    } else if(month == 2) {
        if(year%4 == 0) {
            maxDays = 29;
        } else {
            maxDays = 28;
        }
    }

    //Day should be valid day for month
    if(day < 1 || day > maxDays) {	
        return false;
    }

    //Hours should be in 0-23
    if(hours < 0 || hours > 23) {
        return false;
    }

    //Minutes and Seconds should in 0-59
    if(minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
        return false;
    }

    //Now verify timezone
    if(dateTimeSeparator == " " && tZone == null) {
        //SQL Format
        return true;
    } else if(dateTimeSeparator == "T" && tZone != null) {
        //RFC3339 Format
        var offset = 0;
        if(tZone != "Z") {
            //Not UTC TimeZone
            offset = parseInt(tZone.substr(1,3))*60 + parseInt(tZone.substr(4));
            offset = offset*60;	//To seconds

            offset = offset * (tZone.charAt(0) == "+" ? 1 : -1);
        }
        //Check offset in timeStamp with passed rawOffset
        if(offset == rawOffset) {
            return true;
        }
    }

    //If reached here, wrong format
    return false;
}

/**
 * Checks if tzId passed in is a valid Timezone id in tz database.
 * @param {String} tzId timezoneId to be checked for validity
 * @return {Boolean} true if tzId is a valid timezone id in tz database. tzId could be a "zone" id or a "link" id to be a valid tz Id. False otherwise
 */
Y.TimeZone.isValidTimezoneId = function(tzId) {
    return AjxTimezone.isValidTimezoneId(tzId);
}

/**
 * Returns the normalized version of the time zone ID, or empty string if tzId is not a valid time zone ID.
 * If tzId is a link Id, the standard name will be returned.
 * @param {String} tzId The timezone ID whose normalized form is requested.
 * @return {String} The normalized version of the timezone Id, or empty string if tzId is not a valid time zone Id.
 */
Y.TimeZone.getNormalizedTimezoneId = function(tzId) {
    if(!Y.TimeZone.isValidTimezoneId(tzId)) {
        return "";
    }
    var normalizedId;       
    var next = tzId;
        
    do {
        normalizedId = next;
        next = TimezoneLinks[normalizedId];
    } while( next != null );
        
    return normalizedId;
}
    
//Private methods

/**
 * Parse RFC3339 date format and return the Date
 * Format: yyyy-mm-ddThh:mm:ssZ
 * @param {String} dString The date string to be parsed
 * @return {Date} The date represented by dString
 */
Y.TimeZone.prototype._parseRFC3339 = function(dString){
    var regexp = /(\d+)(-)?(\d+)(-)?(\d+)(T)?(\d+)(:)?(\d+)(:)?(\d+)(\.\d+)?(Z|([+-])(\d+)(:)?(\d+))/; 

    var result = new Date();

    var d = dString.match(regexp);
    var offset = 0;

    result.setUTCDate(1);
    result.setUTCFullYear(parseInt(d[1],10));
    result.setUTCMonth(parseInt(d[3],10) - 1);
    result.setUTCDate(parseInt(d[5],10));
    result.setUTCHours(parseInt(d[7],10));
    result.setUTCMinutes(parseInt(d[9],10));
    result.setUTCSeconds(parseInt(d[11],10));
    if (d[12]) {
        result.setUTCMilliseconds(parseFloat(d[12]) * 1000);
    } else {
        result.setUTCMilliseconds(0);
    }
    if (d[13] != 'Z') {
        offset = (d[15] * 60) + parseInt(d[17],10);
        offset *= ((d[14] == '-') ? -1 : 1);
        result.setTime(result.getTime() - offset * 60 * 1000);
    }
    return result;
}

/**
 * Parse SQL date format and return the Date
 * Format: yyyy-mm-dd hh:mm:ss
 * @param {String} dString The date string to be parsed
 * @return {Date} The date represented by dString
 */
Y.TimeZone.prototype._parseSQLFormat = function(dString) {
    var dateTime = dString.split(" ");
    var date = dateTime[0].split("-");
    var time = dateTime[1].split(":");

    var offset = AjxTimezone.getOffset(this.tzId, new Date(date[0], date[1] - 1, date[2]));
    return new Date(Date.UTC(date[0], date[1] - 1, date[2], time[0], time[1], time[2]) - offset*60*1000);
}

//Public methods

//For use in Y.DateFormat.
Y.TimeZone.prototype.getShortName = function() {
    return this._ajxTimeZoneInstance.getShortName(this.tzId);
}

//For use in Y.DateFormat.
Y.TimeZone.prototype.getMediumName = function() {
    return this._ajxTimeZoneInstance.getMediumName(this.tzId);
}

//For use in Y.DateFormat.
Y.TimeZone.prototype.getLongName = function() {
    return this._ajxTimeZoneInstance.getLongName(this.tzId);
}
    
/**
 * Given a timevalue representation in RFC 3339 or SQL format, convert to UNIX time - seconds since Epoch ie., since 1970-01-01T00:00:00Z
 * @param {String} timeValue TimeValue representation in RFC 3339 or SQL format.
 * @return {Number} UNIX time - time in seconds since Epoch
 */
Y.TimeZone.prototype.convertToIncrementalUTC = function(timeValue) {
    if(timeValue.indexOf("T") != -1) {
        //RFC3339
        return this._parseRFC3339(timeValue).getTime() / 1000;
    } else {
        //SQL
        return this._parseSQLFormat(timeValue).getTime() / 1000;
    }
}

/**
 * Given UNIX time - seconds since Epoch ie., 1970-01-01T00:00:00Z, convert the timevalue to RFC3339 format - "yyyy-mm-ddThh:mm:ssZ"
 * @param {Number} timeValue time value in seconds since Epoch.
 * @return {String} RFC3339 format timevalue - "yyyy-mm-ddThh:mm:ssZ"
 */
Y.TimeZone.prototype.convertUTCToRFC3339Format = function(timeValue) {
    var uTime = new Date(timeValue * 1000);
    var offset = AjxTimezone.getOffset(this.tzId, uTime);

    var offsetString = "Z";
    if(offset != 0) {
        var offsetSign = (offset > 0 ? "+": "-");
        offsetString = offsetSign + zeroPad(Math.abs(floatToInt(offset/60))) + ":" + zeroPad(offset % 60);
    }

    uTime.setTime(timeValue*1000 + offset*60*1000);

    var rfc3339 = zeroPad(uTime.getUTCFullYear(), 4) + "-" + zeroPad((uTime.getUTCMonth() + 1)) + "-" + zeroPad(uTime.getUTCDate()) 
    + "T" + zeroPad(uTime.getUTCHours()) + ":" + zeroPad(uTime.getUTCMinutes()) + ":" + zeroPad(uTime.getUTCSeconds()) + offsetString;

    return rfc3339;
}

/**
 * Given UNIX Time - seconds since Epoch ie., 1970-01-01T00:00:00Z, convert the timevalue to SQL Format - "yyyy-mm-dd hh:mm:ss"
 * @param {Number} timeValue time value in seconds since Epoch.
 * @return {String} SQL Format timevalue - "yyyy-mm-dd hh:mm:ss"
 */
Y.TimeZone.prototype.convertUTCToSQLFormat = function(timeValue) {
    var uTime = new Date(timeValue * 1000);
    var offset = AjxTimezone.getOffset(this.tzId, uTime);
    uTime.setTime(timeValue*1000 + offset*60*1000);

    var sqlDate = zeroPad(uTime.getUTCFullYear(), 4) + "-" + zeroPad((uTime.getUTCMonth() + 1)) + "-" + zeroPad(uTime.getUTCDate()) 
    + " " + zeroPad(uTime.getUTCHours()) + ":" + zeroPad(uTime.getUTCMinutes()) + ":" + zeroPad(uTime.getUTCSeconds());

    return sqlDate;
}

/**
 * Gets the offset of this timezone in seconds from UTC
 * @return {Number} offset of this timezone in seconds from UTC
 */
Y.TimeZone.prototype.getRawOffset = function() {
    return AjxTimezone.getOffset(this.tzId, new Date()) * 60;
}

/**
 * Given a unix time, convert it to wall time for this timezone.
 * @param {Number} timeValue value in seconds from Epoch.
 * @return {Object} an object with the properties: sec, min, hour, mday, mon, year, wday, yday, isdst, gmtoff, zone. All of these are integers except for zone, which is a string. isdst is 1 if DST is active, and 0 if DST is inactive.
 */
Y.TimeZone.prototype.getWallTimeFromUnixTime = function(timeValue) {
    var offset = AjxTimezone.getOffset(this.tzId, new Date(timeValue*1000)) * 60;
    var localTimeValue = timeValue + offset;
    var date = new Date(localTimeValue*1000);

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

    return walltime;
}


}, '@VERSION@', {"lang": ["af-NA", "af", "af-ZA", "am-ET", "am", "ar-AE", "ar-BH", "ar-DZ", "ar-EG", "ar-IQ", "ar-JO", "ar-KW", "ar-LB", "ar-LY", "ar-MA", "ar-OM", "ar-QA", "ar-SA", "ar-SD", "ar-SY", "ar-TN", "ar", "ar-YE", "as-IN", "as", "az-AZ", "az-Cyrl-AZ", "az-Cyrl", "az-Latn-AZ", "az-Latn", "az", "be-BY", "be", "bg-BG", "bg", "bn-BD", "bn-IN", "bn", "bo-CN", "bo-IN", "bo", "ca-ES", "ca", "cs-CZ", "cs", "cy-GB", "cy", "da-DK", "da", "de-AT", "de-BE", "de-CH", "de-DE", "de-LI", "de-LU", "de", "el-CY", "el-GR", "el", "en-AU", "en-BE", "en-BW", "en-BZ", "en-CA", "en-GB", "en-HK", "en-IE", "en-IN", "en-JM", "en-JO", "en-MH", "en-MT", "en-MY", "en-NA", "en-NZ", "en-PH", "en-PK", "en-SG", "en-TT", "en", "en-US-POSIX", "en-US", "en-VI", "en-ZA", "en-ZW", "eo", "es-AR", "es-BO", "es-CL", "es-CO", "es-CR", "es-DO", "es-EC", "es-ES", "es-GT", "es-HN", "es-MX", "es-NI", "es-PA", "es-PE", "es-PR", "es-PY", "es-SV", "es", "es-US", "es-UY", "es-VE", "et-EE", "et", "eu-ES", "eu", "fa-AF", "fa-IR", "fa", "fi-FI", "fi", "fil-PH", "fil", "fo-FO", "fo", "fr-BE", "fr-CA", "fr-CH", "fr-FR", "fr-LU", "fr-MC", "fr-SN", "fr", "ga-IE", "ga", "gl-ES", "gl", "gsw-CH", "gsw", "gu-IN", "gu", "gv-GB", "gv", "ha-GH", "ha-Latn-GH", "ha-Latn-NE", "ha-Latn-NG", "ha-Latn", "ha-NE", "ha-NG", "ha", "haw", "haw-US", "he-IL", "he", "hi-IN", "hi", "hr-HR", "hr", "hu-HU", "hu", "hy-AM-REVISED", "hy-AM", "hy", "id-ID", "id", "ii-CN", "ii", "in-ID", "in", "is-IS", "is", "it-CH", "it-IT", "it", "iw-IL", "iw", "ja-JP", "ja", "ka-GE", "ka", "kk-Cyrl-KZ", "kk-Cyrl", "kk-KZ", "kk", "kl-GL", "kl", "km-KH", "km", "kn-IN", "kn", "kok-IN", "kok", "ko-KR", "ko", "kw-GB", "kw", "lt-LT", "lt", "lv-LV", "lv", "mk-MK", "mk", "ml-IN", "ml", "mr-IN", "mr", "ms-BN", "ms-MY", "ms", "mt-MT", "mt", "nb-NO", "nb", "ne-IN", "ne-NP", "ne", "nl-BE", "nl-NL", "nl", "nn-NO", "nn", "no-NO", "no", "om-ET", "om-KE", "om", "or-IN", "or", "pa-Arab-PK", "pa-Arab", "pa-Guru-IN", "pa-Guru", "pa-IN", "pa-PK", "pa", "pl-PL", "pl", "ps-AF", "ps", "pt-BR", "pt-PT", "pt", "ro-MD", "ro-RO", "ro", "ru-RU", "ru", "ru-UA", "sh-BA", "sh-CS", "sh", "sh-YU", "si-LK", "si", "sk-SK", "sk", "sl-SI", "sl", "so-DJ", "so-ET", "so-KE", "so-SO", "so", "sq-AL", "sq", "sr-BA", "sr-CS", "sr-Cyrl-BA", "sr-Cyrl-CS", "sr-Cyrl-ME", "sr-Cyrl-RS", "sr-Cyrl", "sr-Cyrl-YU", "sr-Latn-BA", "sr-Latn-CS", "sr-Latn-ME", "sr-Latn-RS", "sr-Latn", "sr-Latn-YU", "sr-ME", "sr-RS", "sr", "sr-YU", "sv-FI", "sv-SE", "sv", "sw-KE", "sw", "sw-TZ", "ta-IN", "ta", "te-IN", "te", "th-TH", "th", "ti-ER", "ti-ET", "ti", "tl-PH", "tl", "tr-TR", "tr", "uk", "uk-UA", "ur-IN", "ur-PK", "ur", "uz-AF", "uz-Arab-AF", "uz-Arab", "uz-Cyrl", "uz-Cyrl-UZ", "uz-Latn", "uz-Latn-UZ", "uz", "uz-UZ", "vi", "vi-VN", "zh-CN", "zh-Hans-CN", "zh-Hans-HK", "zh-Hans-MO", "zh-Hans-SG", "zh-Hans", "zh-Hant-HK", "zh-Hant-MO", "zh-Hant-TW", "zh-Hant", "zh-HK", "zh-MO", "zh-SG", "zh-TW", "zh", "zu", "zu-ZA"]});
