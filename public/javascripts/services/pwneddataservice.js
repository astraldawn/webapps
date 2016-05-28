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