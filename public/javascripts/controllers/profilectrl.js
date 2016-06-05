/**
 * Created by mark on 27/05/16.
 */

// TODO: More stuff to add here.
// Profile page controller

ProfCtrl.$inject = ['$scope', '$state', 'auth'];

angular.module('webapps')
    .controller('ProfCtrl', ProfCtrl);

function ProfCtrl($scope, $state, auth) {
    $scope.updateProfile = function () {
        // TODO: Find current user.

        if ($scope.firstName !== '') {
            user.firstName = $scope.firstName;
        }
        if ($scope.lastName !== '') {
            user.lastName = $scope.lastName;
        }
        if ($scope.email !== '') {
            user.email = $scope.email;
        }
        if ($scope.description !== '') {
            user.description = $scope.description;
        }
    };
}