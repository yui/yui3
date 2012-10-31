YUI.add('generate-dataprovider', function (Y) {
    var GeneratePerfTestDataProvider = {
		getData: function() {
            var bigArray = new Array(),
                tempObj = new Object(),
                i = (Math.floor(Math.random()*12)) + 1,
                end = i + 72,
                month,
                year,
                expensesValue = 8000;
            for(;i <= end; i++)
            {
                month = i;
                year = 2009;
                expensesValue = Math.floor(expensesValue * .9);
                if (i > 360)
                {
                    month = i - 360;
                    year += 30;
                }
                else if (i > 348)
                {
                    month = i - 348;
                    year += 29;
                }
                else if (i > 336)
                {
                    month = i - 336;
                    year += 28;
                }
                else if (i > 324)
                {
                    month = i - 324;
                    year += 27;
                }
                else if (i > 312)
                {
                    month = i - 312;
                    year += 26;
                }
                else if (i > 300)
                {
                    month = i - 300;
                    year += 25;
                }
                else if (i > 288)
                {
                    month = i - 288;
                    year += 24;
                }
                else if (i > 276)
                {
                    month = i - 276;
                    year += 23;
                }
                else if (i > 264)
                {
                    month = i - 264;
                    year += 22;
                }
                else if (i > 252)
                {
                    month = i - 252;
                    year += 21;
                }
                else if (i > 240)
                {
                    month = i - 240;
                    year += 20;
                }
                else if (i > 228)
                {
                    month = i - 228;
                    year += 19;
                }
                else if (i > 216)
                {
                    month = i - 216;
                    year += 18;
                }
                else if (i > 204)
                {
                    month = i - 204;
                    year += 17;
                }
                else if (i > 192)
                {
                    month = i - 192;
                    year += 16;
                }
                else if (i > 180)
                {
                    month = i - 180;
                    year += 15;
                }
                else if (i > 168)
                {
                    month = i - 168;
                    year += 14;
                }
                else if(i > 156)
                {
                    month = i - 156;
                    year += 13;
                }
                else if(i > 144)
                {
                    month = i - 144;
                    year += 12;
                }
                else if(i > 132)
                {
                    month = i - 132;
                    year += 11;
                }
                else if(i > 120)
                {
                    month = i - 120;
                    year += 10;
                }
                else if(i > 108)
                {
                    month = i - 108;
                    year += 9;
                }
                else if(i > 96)
                {
                    month = i - 96;
                    year += 8;
                }
                else if(i > 84)
                {
                    month = i - 84;
                    year += 7;
                }
                else if(i > 72)
                {
                    month = i - 72;
                    year += 6;
                }
                else if(i > 60)
                {
                    month = i - 60;
                    year += 5;
                }
                else if(i > 48)
                {
                    month = i - 48;
                    year += 4;
                }
                else if(i > 36)
                {
                    month = i - 36;
                    year += 3;
                }
                else if(i > 24)
                {
                    month = i -24;
                    year +=2;
                }
                else if(i > 12)
                {
                    month = i - 12;
                    year +=1;
                }
                bigArray  = bigArray.concat(GeneratePerfTestDataProvider.getMonthOfDates(month, GeneratePerfTestDataProvider.getNumberOfDays(month, year), year, expensesValue))
            }
            return bigArray;
        },

        getNumberOfDays: function(mon, year) {
            if(mon == 4 || mon == 6 || mon == 9 || mon ==11)
            {
                return 30;
            }
            if(mon == 2)
            {
                return year%4==0?29:28;
            }
            return 31;
        },

        getMonthOfDates: function(mon, max, year, value) {
            var month = new Array();
            dValue = value;
            for(var i = 1; i <= max; i++)
            {
                var obj = new Object();
                obj.date = new Date(mon + "/" + i + "/" + year).valueOf();
                obj.date = obj.date.toString();	
                obj.date = parseInt(obj.date, 10);
                var div = ((Math.random()*5))
                var cont = (Math.random() * 101) * div;
                obj.revenue = parseFloat((cont + Math.floor((Math.random() * 101))).toFixed(2));
                dValue = dValue - 1;
                obj.expenses = parseFloat((cont + Math.floor((Math.random() * 101))).toFixed(2));
                month[month.length] = obj;
            }
            return month;
        }
    }
    Y.GeneratePerfTestDataProvider = GeneratePerfTestDataProvider;
}, '@VERSION@');
