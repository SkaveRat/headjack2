headjackApp.controller('LoginCtrl', ['$scope', 'chmsg', function ($scope, chmsg) {

    $scope.loginform = {
        disabled: false,
        type: 'm.login.password'
    };

    $scope.login = function() {
        $scope.loginform.disabled = true;

        chmsg.send('login', $scope.loginform );
    };

}]);