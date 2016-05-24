/**
 * Created by mark on 12/05/16.
 */

var app = angular.module('flapperNews', ['ui.router']);

app.controller('MainCtrl', [
    '$scope',
    'posts', // injection of the post service
    function ($scope, posts) {
        $scope.test = 'Hello world!';

        $scope.posts = posts.posts;

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
    function ($scope, posts, post) {
        $scope.post = post;

        $scope.addComment = function () {
            if ($scope.body === '') {
                return;
            }
            // $scope.post.comments.push({
            //     body: $scope.body,
            //     author: 'user',
            //     upvotes: 0
            // });

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
    function ($http) {
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
            return $http.post('/posts', post)
                .success(function (data) {
                    o.posts.push(data);
                });
        };

        // Upvote a post
        o.upvote = function (post) {
            return $http.put('/posts/' + post._id + '/upvote')
                .success(function (data) {
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
            return $http.post('/posts/' + id + '/comments', comment);
        };

        // Upvote a comment
        o.upvoteComment = function (post, comment) {
            return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote')
                .success(function (data) {
                    comment.upvotes += 1;
                });
        };


        return o;
    }
]);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('home', {
            url: '/home',
            templateUrl: '/home.html',
            controller: 'MainCtrl',
            resolve: {
                postPromise: ['posts', function (posts) {
                    return posts.getAll();
                }]
            }
        });

        $stateProvider.state('posts', {
            url: '/posts/{id}',
            templateUrl: '/posts.html',
            controller: 'PostsCtrl',
            resolve: {
                post: ['$stateParams', 'posts', function ($stateParams, posts) {
                    return posts.get($stateParams.id);
                }]
            }
        });

        $urlRouterProvider.otherwise('home');
    }
]);