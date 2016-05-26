/**
 * Created by mark on 12/05/16.
 */

var app = angular.module('webapps', ['ui.router']);

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

app.controller('MainCtrl', [
    '$scope',
    'posts', // injection of the post service
    'pwneddatas', // injection of pwned data
    'auth',
    function ($scope, posts, pwneddatas, auth) {
        $scope.posts = posts.posts;
        $scope.pwneddatas = pwneddatas.pwneddatas;
        $scope.isLoggedIn = auth.isLoggedIn;

        $scope.addPost = function () {
            // Prevent user from creating a blank post
            if (!$scope.title || $scope.title === '') {
                return;
            }

            posts.create({
                title: $scope.title,
                link: $scope.link
            });

            // Clearing variables
            $scope.title = '';
            $scope.link = '';
        };

        // Pass by instance
        $scope.incrementUpvotes = function (post) {
            posts.upvote(post);
        }

    }
]);

app.controller('PostsCtrl', [
    '$scope',
    'posts', // injection of the post service, kept for comment manipulation
    'post', // injection of post object
    'auth',
    function ($scope, posts, post, auth) {
        $scope.post = post;
        $scope.isLoggedIn = auth.isLoggedIn;

        $scope.addComment = function () {
            if ($scope.body === '') {
                return;
            }

            posts.addComment(post._id, {
                body: $scope.body,
                author: 'user'
            }).success(function (comment) {
                $scope.post.comments.push(comment);
            });

            $scope.body = '';
        };

        $scope.incrementUpvotes = function (comment) {
            posts.upvoteComment(post, comment);
        }
    }
]);


// Posts service
app.factory('posts', [
    '$http', // injection of http service
    'auth', // inject the auth service
    function ($http, auth) {
        var o = {
            posts: []
        };

        // Get all posts
        o.getAll = function () {
            return $http.get('/posts')
                .success(function (data) {
                    angular.copy(data, o.posts);
                });
        };

        // Create a new post
        o.create = function (post) {
            return $http.post('/posts', post, {
                headers: {Authorization: 'Bearer ' + auth.getToken()}
            }).success(function (data) {
                o.posts.push(data);
            });
        };

        // Upvote a post
        o.upvote = function (post) {
            return $http.put('/posts/' + post._id + '/upvote', null, {
                headers: {Authorization: 'Bearer ' + auth.getToken()}
            }).success(function (data) {
                post.upvotes += 1;
            });
        };

        // Get a single post
        o.get = function (id) {
            return $http.get('/posts/' + id)
                .then(function (res) { // promise
                    return res.data;
                });
        };

        // Add a comment
        o.addComment = function (id, comment) {
            return $http.post('/posts/' + id + '/comments', comment, {
                headers: {Authorization: 'Bearer ' + auth.getToken()}
            });
        };

        // Upvote a comment
        o.upvoteComment = function (post, comment) {
            return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote', null, {
                headers: {Authorization: 'Bearer ' + auth.getToken()}
            }).success(function (data) {
                comment.upvotes += 1;
            });
        };

        return o;
    }
]);

// pwned data service
app.factory('pwneddatas', [
    '$http', // injection of http service
    'auth', // inject the auth service
    function ($http, auth) {
        var o = {
            pwneddatas: []
        };

        // Get all posts
        o.getAll = function () {
            return $http.get('/pwneddatas')
                .success(function (data) {
                    angular.copy(data, o.pwneddatas);
                });
        };

        // // Get a single post
        // o.get = function (id) {
        //     return $http.get('/posts/' + id)
        //         .then(function (res) { // promise
        //             return res.data;
        //         });
        // };

        return o;
    }
]);

// Authentication
app.factory('auth', [
    '$http',
    '$window', // For interfacing with local storage
    function ($http, $window) {
        var auth = {};
        var tokenName = 'webapp-token';

        auth.saveToken = function (token) {
            $window.localStorage[tokenName] = token;
        };

        auth.getToken = function () {
            return $window.localStorage[tokenName];
        };

        auth.isLoggedIn = function () {
            var token = auth.getToken();

            if (token) {
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };

        auth.currentUser = function () {
            if (auth.isLoggedIn()) {
                var token = auth.getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.username;
            }
        };

        auth.register = function (user) {
            return $http.post('/register', user)
                .success(function (data) {
                    auth.saveToken(data.token);
                });
        };

        auth.logIn = function (user) {
            return $http.post('/login', user)
                .success(function (data) {
                    auth.saveToken(data.token);
                });
        };

        auth.logOut = function () {
            $window.localStorage.removeItem(tokenName);
        };

        return auth;
    }
]);

// Authentication controller
app.controller('AuthCtrl', [
    '$scope',
    '$state',
    'auth',
    function ($scope, $state, auth) {
        $scope.user = {};

        $scope.register = function () {
            auth.register($scope.user).error(function (error) {
                $scope.error = error;
            }).then(function () {
                $state.go('home'); // If no error, send to home
            });
        };

        $scope.logIn = function () {
            auth.logIn($scope.user).error(function (error) {
                $scope.error = error;
            }).then(function () {
                $state.go('home');
            });
        };
    }
]);

// Navigation controller
app.controller('NavCtrl', [
    '$scope',
    'auth',
    function ($scope, auth) {
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.currentUser = auth.currentUser;
        $scope.logOut = auth.logOut;
    }
]);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider) {
        // $locationProvider.html5Mode(true);

        $stateProvider.state('home', {
            url: '/home',
            views: {
                'main': {
                    templateUrl: '/templates/home.ejs',
                    controller: 'MainCtrl',
                    resolve: {
                        postPromise: ['posts', function (posts) {
                            return posts.getAll();
                        }]
                    }
                }
            }
        });

        $stateProvider.state('posts', {
            url: '/posts/{id}',
            views: {
                'main': {
                    templateUrl: 'templates/posts.ejs',
                    controller: 'PostsCtrl',
                    resolve: {
                        post: ['$stateParams', 'posts', function ($stateParams, posts) {
                            return posts.get($stateParams.id);
                        }]
                    }
                }
            }
        });

        $stateProvider.state('login', {
            url: '/login',
            views: {
                'main': {
                    templateUrl: 'templates/login.ejs',
                    controller: 'AuthCtrl',
                    onEnter: ['$state', 'auth', function ($state, auth) {
                        // Allows a check if the user is already logged in
                        if (auth.isLoggedIn()) {
                            $state.go('home');
                        }
                    }]
                }
            }
        });

        $stateProvider.state('register', {
            url: '/register',
            views: {
                'main': {
                    templateUrl: 'templates/register.ejs',
                    controller: 'AuthCtrl',
                    onEnter: ['$state', 'auth', function ($state, auth) {
                        if (auth.isLoggedIn()) {
                            $state.go('home');
                        }
                    }]
                }
            }
        });

        $stateProvider.state('pwneddata', {
            url: '/pwneddata',
            views: {
                'main': {
                    templateUrl: 'templates/pwneddata.ejs',
                    controller: 'MainCtrl',
                    resolve: {
                        pwneddataPromise: ['pwneddatas', function (pwneddatas) {
                            return pwneddatas.getAll();
                        }]
                    }
                }
            }
        });

        $stateProvider.state('testgraph', {
            url: '/testgraph',
            views: {
                'main': {
                    templateUrl: 'pages/graph.ejs',
                    controller: 'GraphCtrl'
                }
            }
        });

        $urlRouterProvider.otherwise('home');
    }
]);