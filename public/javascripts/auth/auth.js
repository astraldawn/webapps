/**
 * Created by mark on 27/05/16.
 */

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