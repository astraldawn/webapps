// pwned data service

chronodatas.$inject = ['$http', 'auth'];

angular.module('webapps')
    .factory('chronodatas', chronodatas);

function chronodatas($http, auth) {
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