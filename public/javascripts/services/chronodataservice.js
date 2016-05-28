// pwned data service
app.factory('chronodatas', [
    '$http', // injection of http service
    'auth', // inject the auth service
    function ($http, auth) {
        var o = {
            chronodatas: []
        };

        // Get all posts
        o.getAll = function () {
            return $http.get('/chronodatas')
                .success(function (data) {
                    angular.copy(data, o.chronodatas);
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