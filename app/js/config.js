headjackApp.config(['$routeProvider',
    function($routeProvider) {
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