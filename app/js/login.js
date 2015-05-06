headjackApp.controller('LoginCtrl', ['$scope', '$http', 'matrixService', function ($scope, $http, matrixService) {

    $scope.loginform = {
        disabled: false,
        type: 'm.login.password'
    };

    $scope.login = function() {
        $scope.loginform.disabled = true;


        chrome.runtime.sendMessage({
            type: 'login',
            loginform: $scope.loginform
        });
    };

}]);