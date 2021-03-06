/**
 * Created by mark on 12/05/16.
 */

var app = angular.module('webapps', ['ui.router', 'ui.select', 'ngSanitize', 'fullPage.js', 'ngMaterial', 'ngNotificationsBar']);

config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', 'notificationsConfigProvider'];

angular.module('webapps')
    .config(config);

function config($stateProvider, $urlRouterProvider, $locationProvider, notificationsConfigProvider) {
    // auto hide
    notificationsConfigProvider.setAutoHide(true);

    // delay before hide
    notificationsConfigProvider.setHideDelay(1000);

    // support HTML
    notificationsConfigProvider.setAcceptHTML(false);

    // Set an animation for hiding the notification
    notificationsConfigProvider.setAutoHideAnimation('fadeOutNotifications');

    // delay between animation and removing the nofitication
    notificationsConfigProvider.setAutoHideAnimationDelay(1000);

    $stateProvider.state('home', {
        url: '/home',
        views: {
            'main': {
                templateUrl: '/templates/home.ejs',
                controller: 'MainCtrl',
                controllerAs: 'main'
                // resolve: {
                //     postPromise: ['posts', function (posts) {
                //         return posts.getAll();
                //     }]
                // }
            }
        }
    });

    $stateProvider.state('postview', {
        url: '/view',
        views: {
            'main': {
                templateUrl: '/templates/postview.ejs',
                controller: 'MainCtrl',
                controllerAs: 'main',
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

    $stateProvider.state('chronodata', {
        url: '/chronology',
        views: {
            'main': {
                templateUrl: 'pages/chronology.ejs',
                controller: 'ChronoCtrl',
                resolve: {
                    chronodataPromise: ['chronodatas', function (chronodatas) {
                        return chronodatas.getAll();
                    }]
                }
            }
        }
    });

    $stateProvider.state('department', {
        url: '/department',
        views: {
            'main': {
                templateUrl: 'pages/dept.ejs',
                controller: 'DeptCtrl'
            },
            'footer': {
                templateUrl: 'templates/graphfooter.ejs',
                controller: 'MainCtrl'
            }
        }
    });

    $stateProvider.state('role', {
        url: '/role',
        views: {
            'main': {
                templateUrl: 'pages/role.ejs',
                controller: 'RoleCtrl'
            },
            'footer': {
                templateUrl: 'templates/graphfooter.ejs',
                controller: 'MainCtrl'
            }
        }
    });

    $urlRouterProvider.otherwise('home');
}
