headjackApp.controller('LoginCtrl', ['$scope', '$http', 'matrixService', function ($scope, $http, matrixService) {

    $scope.loginform = {
        type: 'm.login.password'
    };

    $scope.login = function() {
        chrome.runtime.sendMessage({
            type: 'login',
            loginform: $scope.loginform
        });
    };

}]);