/**
 * Created by mark on 27/05/16.
 */


 // app.factory('JSONService', function($http) {
 //    var getData = function() {
 //      var urls = ["/userdata/logon/" + $scope.user.selected,
 //                  "/userdata/file/" + $scope.user.selected,
 //                  "/userdata/device/" + $scope.user.selected];

 //      var requests = []

 //      for(var i = 0; i < urls.length; i++) {
 //        requests.push($http.get(urls[i]));
 //      }

 //      var data = [];
 //      $q.all(requests).then(function (ret) {
 //        data = data.concat(ret[0],ret[1],ret[2]);
 //      },
 //      function (err) {
 //        console.log("Errors");
 //      });
 //    };

 //    return { getData: getData };
 // });

 app.controller('GraphCtrl', [
    '$scope',
    '$http',
    '$q',
    function ($scope, $http, $q) {

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
      var urls = ["/userdata/logon/" + $scope.user.selected,
                  "/userdata/device/" + $scope.user.selected,
                  "/userdata/file/" + $scope.user.selected];

      var requests = []

      for(var i = 0; i < urls.length; i++) {
        requests.push($http.get(urls[i]));
      }

      var data = [];
      $q.all(requests).then(function (ret) {
        data = data.concat(ret[0].data,ret[1].data,ret[2].data);
        //data = data.concat(ret[0].data, ret[1].data);
        generateData(data);
      },
      function (err) {
        console.log("Errors");
      });

      
  }


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
    var logon_x = [],
        logon_y = [],
        logon_text = [],
        logoff_x = [],
        logoff_y = [],
        logoff_text = [];

    var connect_x = [],
        connect_y = [],
        connect_text = [],
        disconnect_x = [],
        disconnect_y = [],
        disconnect_text = [];

    var fopen_x = [],
        fopen_y = [],
        fopen_text = [],
        fwrite_x = [],
        fwrite_y = [],
        fwrite_text = [],
        fcopy_x = [],
        fcopy_y = [],
        fcopy_text = [],
        fdelete_x = [];
        fdelete_y = [];
        fdelete_text = [];


    for(var i = 0; i < arr.length; i++) {
      var date = formatDate(arr[i].date);

      switch (arr[i].activity) {
        case "Logon":
          logon_x.push(date);
          logon_y.push("Logon/Logoff");
          logon_text.push('User ' + arr[i].user_id + 
            ' <br>on '+ arr[i].pc+ 
            ' <br>@ ' + date);
          break;
        case "Logoff":
          logoff_x.push(date);
          logoff_y.push("Logon/Logoff");
          logoff_text.push('User ' + arr[i].user_id + 
            ' <br>on '+ arr[i].pc+ 
            ' <br>@ ' + date);
          break;

        case "Connect":
          connect_x.push(date);
          connect_y.push("Device Access");
          connect_text.push('User ' + arr[i].user_id +
            ' <br>on ' + arr[i].pc+
            ' <br>' + arr[i].file_tree+
            ' <br>@ ' + date);
          break;
        case "Disconnect":
          disconnect_x.push(date);
          disconnect_y.push("Device Access");
          disconnect_text.push('User ' + arr[i].user_id +
            ' <br>on ' + arr[i].pc+
            ' <br>' + arr[i].file_tree+
            ' <br>@ ' + date);
          break;

        case 'File Open':
          fopen_x.push(date);
          fopen_y.push("File Access");
          fopen_text.push('User ' + arr[i].user_id +
            ' <br>on ' + arr[i].pc+
            ' <br>File: ' + arr[i].filename);
            //' <br>From: ' + arr[i].from_removable_media+
            //' <br>To: ' + arr[i].to_removable_media+
            //' <br>Content: ' + arr[i].content);
          break;

        case 'File Write':
          fwrite_x.push(date);
          fwrite_y.push("File Access");
          fwrite_text.push('User ' + arr[i].user_id +
            ' <br>on ' + arr[i].pc+
            ' <br>File: ' + arr[i].filename);
            //' <br>From: ' + arr[i].from_removable_media+
            //' <br>To: ' + arr[i].to_removable_media+
            //' <br>Content: ' + arr[i].content);
          break;

        case 'File Copy':
          fcopy_x.push(date);
          fcopy_y.push("File Access");
          fcopy_text.push('User ' + arr[i].user_id +
            ' <br>on ' + arr[i].pc+
            ' <br>File: ' + arr[i].filename);
            //' <br>From: ' + arr[i].from_removable_media+
            //' <br>To: ' + arr[i].to_removable_media+
            //' <br>Content: ' + arr[i].content);
          break;

        case 'File Delete':
          fdelete_x.push(date);
          fdelete_y.push("File Access");
          fdelete_text.push('User ' + arr[i].user_id +
            ' <br>on ' + arr[i].pc+
            ' <br>File: ' + arr[i].filename);
            //' <br>From: ' + arr[i].from_removable_media+
            //' <br>To: ' + arr[i].to_removable_media+
            //' <br>Content: ' + arr[i].content);
          break;
      }
      

    }

  //Logoff and logon

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

  //Connect and disconnect

  var trace3 = 
  {
      x: connect_x,
      y: connect_y,
      name: 'Connect',
      mode: 'markers',
      text: connect_text,
      hoverinfo: 'text+name',
      type: 'scatter'
  };

  var trace4 = 
  {
      x: disconnect_x,
      y: disconnect_y,
      name: 'Disconnect',
      mode: 'markers',
      text: disconnect_text,
      hoverinfo: 'text+name',
      type: 'scatter'
  };

  // File Access

  var trace5 =
  {
      x: fopen_x,
      y: fopen_y,
      name: 'File Open',
      mode: 'markers',
      text: fopen_text,
      hoverinfo: 'text+name',
      type: 'scatter'
  };

  var trace6 =
  {
      x: fwrite_x,
      y: fwrite_y,
      name: 'File Write',
      mode: 'markers',
      text: fwrite_text,
      hoverinfo: 'text+name',
      type: 'scatter'
  };

  var trace7 =
  {
      x: fcopy_x,
      y: fcopy_y,
      name: 'File Copy',
      mode: 'markers',
      text: fcopy_text,
      hoverinfo: 'text+name',
      type: 'scatter'
  };

  var trace8 =
  {
      x: fdelete_x,
      y: fdelete_y,
      name: 'File Delete',
      mode: 'markers',
      text: fdelete_text,
      hoverinfo: 'text+name',
      type: 'scatter'
  };

  //Open and write and copy and delete

  var layout = {
    title: "Activity chart",
    hovermode: 'closest'
};

var data = [trace1,trace2,trace3,trace4,trace5,trace6,trace7,trace8];


Plotly.newPlot('logon', data, layout, {displayModeBar: false});

  // var myPlot = document.getElementById('logon');
  // myPlot.on('plotly_hover', function(data){

  // });

}
}
]);