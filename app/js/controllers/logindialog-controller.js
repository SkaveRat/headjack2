app.controller('LoginDialogController',
['$scope', 'chmsg', '$mdDialog', function ($scope, chmsg, $mdDialog) {

    console.log("foobar");

    $scope.checkLogin = function () {
        console.log("check login");
    }


}]
);