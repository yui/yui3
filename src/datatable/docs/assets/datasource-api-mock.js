YUI.add('datasource-api-mock', function (Y) {
    Y.DataSource.Get.prototype.sendRequest = function (e) {
        e.callback.success({
            response:  {
                results: [
                    {Rating: 4.5, Phone: "(408) 734-4221", Title: "Giovanni's Pizzeria"},
                    {Rating: -1, Phone: "(408) 481-3380", Title: "Round Table Pizza"},
                    {Rating: -1, Phone: "(408) 524-5555", Title: "Nizario's Pizza"},
                    {Rating: 4.5, Phone: "(408) 733-1365", Title: "Round Table Pizza"},
                    {Rating: 1, Phone: "(408) 732-3030", Title: "Domino's Pizza"},
                    {Rating: 2, Phone: "(408) 735-1900", Title: "Pizza Hut"},
                    {Rating: 3.5, Phone: "(408) 245-7760", Title: "Pizza Depot"},
                    {Rating: 5, Phone: "(650) 988-0400", Title: "Mario Pizza & Italian Restaurant"},
                    {Rating: 2.5, Phone: "(408) 970-9000", Title: "Round Table Pizza"},
                    {Rating: 4, Phone: "(408) 738-8761", Title:"Tasty Subs & Pizza"}
                ],
                meta: {}
            }
        });
    };
});
