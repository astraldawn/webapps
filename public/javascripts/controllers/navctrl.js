/**
 * Created by mark on 27/05/16.
 */

NavCtrl.$inject = ['$scope', '$state', 'auth'];

angular.module('webapps')
    .controller('NavCtrl', NavCtrl);

// Navigation controller
function NavCtrl($scope, $state, auth) {
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.currentUser = auth.currentUser;
    $scope.logOut = auth.logOut;
}