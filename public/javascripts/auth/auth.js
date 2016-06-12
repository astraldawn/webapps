/**
 * Created by mark on 27/05/16.
 */

// Authentication
auth.$inject = ['$http', '$window'];

angular.module('webapps')
    .factory('auth', auth);

function auth($http, $window) {
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

AuthCtrl.$inject = ['$scope', '$state', 'auth', 'notifications'];

angular.module('webapps')
    .controller('AuthCtrl', AuthCtrl);

// Authentication controller
function AuthCtrl($scope, $state, auth, notifications) {
    $scope.user = {};

    $scope.register = function () {
        auth.register($scope.user).error(function (error) {
            // $scope.error = error;
            notifications.showError({message:error.message});
        }).then(function () {
            notifications.showSuccess({message:"Registration successful"});
            $state.go('home'); // If no error, send to home
        });
    };

    $scope.logIn = function () {
        auth.logIn($scope.user).error(function (error) {
            // $scope.error = error;
            notifications.showError({message:error.message});
        }).then(function () {
            notifications.showSuccess({message:"Login successful"});
            $state.go('home');
        });
    };
}