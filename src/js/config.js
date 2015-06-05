app.config(['$mdThemingProvider', function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey')
        .accentPalette('lime')
}]);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/settings', {
            templateUrl: 'templates/settings.html',
            controller: 'SettingsCtrl'
        }).
        when('/contacts', {
            templateUrl: 'templates/contactlist.html',
            controller: 'ContactlistCtrl'
        }).
        otherwise({
            redirectTo: '/contacts'
        });
}]);