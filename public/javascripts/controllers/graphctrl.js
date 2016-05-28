/**
 * Created by mark on 27/05/16.
 */

 app.controller('GraphCtrl', [
    '$scope',
    '$http',
    function ($scope, $http) {

  
    //Search function    
  $scope.user = {};
  $scope.availableUsers = [];
  var url = '/allusers';

  $scope.funcAsync = function (query) {
          $http.get(url).then(
          function (response) {
            $scope.availableUsers = response.data;
            console.log(response);
          },
          function () {
            console.log('Error');
          }
        );
  }

  $scope.reloadGraph = function () {
      var graphUrl = "/userdata/logon/" + $scope.user.selected;
      $http.get(graphUrl).then(
        function(response) {
          generateData(response.data);
        },
        function() {
          console.log('Error');
        }
      );
  }


    //Sample JSON input
    //   var sampleJSON = [
    //   {
    //     "id": "{F3X8-Y2GT43DR-4906OHBL}",
    //     "date": "02/02/2010 02:19:18",
    //     "user_id": "DNS1759",
    //     "pc": "PC-0414",
    //     "activity": "Logon"
    // },
    // {
    //     "id": "{F3X8-Y2GT43DR-4906OHBL}",
    //     "date": "02/02/2010 20:53:18",
    //     "user_id": "DNS1759",
    //     "pc": "PC-0414",
    //     "activity": "Logoff"
    // }
    // ];

    // generateData(sampleJSON);

    function formatDate(d) {
    //assume MM/DD/YYYY HH:MM:SS
    var date = new Date(d);

    return date.getFullYear() + "-" 
    + ("0" + (date.getMonth() + 1)).slice(-2) + "-"
    + ("0" + date.getDate()).slice(-2)
    + " " + date.getHours()
    + ":" + date.getMinutes()
    + ":" + date.getSeconds();
}

function generateData(arr) {
    var logon_x = [];
    var logon_text = [];
    var logon_y = [];
    //TODO: Add the different types of activities
    //var y_axis = ["Logon/Logoff", "Device Access", "HTTP Activities", 
    //"Email Access", "File Access"];
    
    var logoff_x = [];
    var logoff_y = [];
    var logoff_text = [];


    for(var i = 0; i < arr.length; i++) {
        if(arr[i].activity == 'Logon') {
          var date = formatDate(arr[i].date);
          logon_x.push(date);
          logon_y.push("Logon/Logoff");
          logon_text.push('User ' + arr[i].user_id + 
            ' <br>on '+ arr[i].pc+ 
            ' <br>@ ' + date);

      }else if(arr[i].activity == 'Logoff'){
          var date = formatDate(arr[i].date);
          logoff_x.push(formatDate(arr[i].date));
          logoff_y.push("Logon/Logoff");
          logoff_text.push('User ' + arr[i].user_id + 
            ' <br>on '+ arr[i].pc+ 
            ' <br>@ ' + date);
      }

        //Implement the rest of the activities
    }

    var trace1 = 
    {
      x: logon_x,
      y: logon_y,
      name: 'Logon', 
      mode: 'markers', 
      marker: { color: 'rgb(0, 255, 0)' },
      text: logon_text,
      hoverinfo: 'text+name',
      type: 'scatter'
  };

  var trace2 = 
  {
      x: logoff_x,
      y: logoff_y,
      name: 'Logoff',
      mode: 'markers', 
      marker: { color: 'rgb(255, 0, 0)' },
      text: logoff_text,
      hoverinfo: 'text+name',
      type: 'scatter'
  };

  var layout = {
    title: "Activity chart",
    hodemode: 'closest'
};

var data = [trace1,trace2];


Plotly.newPlot('logon', data, layout, {displayModeBar: false});

  // var myPlot = document.getElementById('logon');
  // myPlot.on('plotly_hover', function(data){

  // });

}
}
]);