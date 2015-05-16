'use strict';

angular.module('mxService', [])
    .factory('mxService', [
        '$window',
        '$http',
        function ($window, $http) {

            //TODO abstract for multiple accounts
            var mxSdk = $window.matrixcs;
            mxSdk.request($.ajax);
            var mxClient = mxSdk.createClient("https://matrix.org");

            function login(logindata) {
                return mxClient.login('m.login.password', logindata);
            }

            function getRooms(credentials) { //TODO move this into initialsync call
                var mxClient = mxSdk.createClient({
                    "baseUrl":     "https://matrix.org",
                    "accessToken": credentials.access_token,
                    "home_server": credentials.home_server,
                    "userId":      credentials.user_id
                });

                return mxClient.initialSync(1)
                    .then(function (data) {
                        return data.rooms;
                    });
            }

            return {
                login: login,
                getRooms: getRooms
            }
        }
    ]
);