/**
 * Created by mark on 27/05/16.
 */

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