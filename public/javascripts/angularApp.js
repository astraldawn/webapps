/**
 * Created by mark on 12/05/16.
 */

var app = angular.module('webapps', ['ui.router']);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider) {
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

        $stateProvider.state('profile', {
            url: '/users/{uid}',
            views: {
                'main': {
                    templateUrl: 'templates/profile.ejs',
                    controller: 'ProfCtrl',
                    onEnter: ['$state', 'auth', function ($state, auth) {
                        if (!auth.isLoggedIn()) {
                            $state.go('home');
                            // TODO: Show error?
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
