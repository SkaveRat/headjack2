app.controller('SettingsCtrl', ['$scope', '$location', 'chmsg', function ($scope, $location, chmsg) {

    $scope.checkLogin = function () {
        $scope.loginform.disabled = true;
        chmsg.send('account.login', $scope.loginform);
    };

    chmsg.on('contacts.refresh', function () {
        $location.path('contacts');
        $scope.$apply();
    });

}]);