YQL Module
==========

(YQL) is an expressive SQL-like language that lets you query, 
filter, and join data across Web services. With YQL, *apps run
faster with fewer lines of code and a smaller network footprint.* 


    YUI().use('yql', function(Y) {

        Y.YQL('select * from weather.forecast where location=90210', function(r) {
            //r now contains the result of the YQL Query
            //use the YQL Developer console to learn
            //what data is coming back in this object
            //and how that data is structured.
        });

    });

