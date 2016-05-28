/**
 * Created by mark on 27/05/16.
 */

// var app = angular.module('webapps', ['ui.router']);

app.controller('GraphCtrl', [
    '$scope',
    function ($scope) {
        //JSON Input
        /*
         var xmlhttp = new XMLHttpRequest();
         var url = "URL";

         xmlhttp.onreadystatechange = function() {
         if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
         var myArr = JSON.parse(xmlhttp.responseText);
         generateData(myArr);
         }
         };

         xmlhttp.open("GET", url, true);
         xmlhttp.send();
         */

        //Sample JSON input
        var sampleJSON = [
            {
                "id": "{F3X8-Y2GT43DR-4906OHBL}",
                "date": "01/02/2010 02:19:18",
                "user": "DNS1758",
                "pc": "PC-0414",
                "activity": "Logon"
            },
            {
                "id": "{F3X8-Y2GT43DR-4906OHBL}",
                "date": "02/02/2010 02:19:18",
                "user": "DNS1759",
                "pc": "PC-0414",
                "activity": "Logon"
            },
            {
                "id": "{F3X8-Y2GT43DR-4906OHBL}",
                "date": "03/02/2010 02:19:18",
                "user": "DNS1759",
                "pc": "PC-0414",
                "activity": "Logoff"
            },
            {
                "id": "{F3X8-Y2GT43DR-4906OHBL}",
                "date": "05/02/2010 02:19:18",
                "user": "DNS1790",
                "pc": "PC-0414",
                "activity": "Logon"
            },
            {
                "id": "{F3X8-Y2GT43DR-4906OHBL}",
                "date": "05/02/2010 16:19:18",
                "user": "DNS1790",
                "pc": "PC-0414",
                "activity": "Logoff"
            },
            {
                "id": "{F3X8-Y2GT43DR-4906OHBL}",
                "date": "06/02/2010 02:19:18",
                "user": "DNS1880",
                "pc": "PC-0414",
                "activity": "Logon"
            },
            {
                "id": "{F3X8-Y2GT43DR-4906OHBL}",
                "date": "06/02/2010 20:19:18",
                "user": "DNS1880",
                "pc": "PC-0414",
                "activity": "Logoff"
            },
            {
                "id": "{F3X8-Y2GT43DR-4906OHBL}",
                "date": "07/02/2010 22:19:18",
                "user": "DNS1880",
                "pc": "PC-0414",
                "activity": "Logon"
            },
            {
                "id": "{B4Q0-D0GM24KN-3704MAII}",
                "date": "01/03/2010 02:31:12",
                "user": "DNS1758",
                "pc": "PC-0414",
                "activity": "Logoff"
            },
            {
                "id": "{T7J1-D4HK34KV-5476TCIJ}",
                "date": "01/04/2010 02:34:02",
                "user": "DNS1758",
                "pc": "PC-5313",
                "activity": "Logon"
            }
        ];

        generateData(sampleJSON);

        function formatDate(d) {
            //assume MM/DD/YYYY HH:MM:SS
            var date = new Date(d);

            return date.getFullYear() + "-"
                + ("0" + (date.getMonth() + 1)).slice(-2) + "-"
                + ("0" + date.getDate()).slice(-2);
        }

        function generateData(arr) {
            var logon_x = [];
            var logon_y = [];

            var logoff_x = [];
            var logoff_y = [];

            var i;
            for(i = 0; i < arr.length; i++) {
                if(arr[i].activity == "Logon") {
                    logon_x.push(formatDate(arr[i].date));
                    logon_y.push(arr[i].user);
                }else {
                    //assume Logoff
                    logoff_x.push(formatDate(arr[i].date));
                    logoff_y.push(arr[i].user);
                }
            }

            var trace1 =
            {
                x: logon_x,
                y: logon_y,
                name: 'Logon',
                mode: 'markers',
                marker: { color: 'rgb(0, 255, 0)' },
                type: 'scatter'
            };

            var trace2 =
            {
                x: logoff_x,
                y: logoff_y,
                name: 'Logoff',
                mode: 'markers',
                marker: { color: 'rgb(255, 0, 0)' },
                type: 'scatter'
            };

            var layout = {
                title: "Activity chart"
            };

            var data = [trace1,trace2];


            Plotly.newPlot('logon', data, layout, {displayModeBar: false});

        }
    }
]);