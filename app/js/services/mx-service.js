'use strict';

angular.module('mxService', [])
    .factory('mxService', [
        '$window',
        '$http',
        function ($window, $http) {

            //TODO abstract for multiple accounts
            var mxSdk = $window.matrixcs;
            mxSdk.request($.ajax);
            var mxClient = mxSdk.createClient("https://matrix.org"); //TODO custom homeserver

            function login(logindata) {
                return mxClient.login('m.login.password', logindata);
            }

            function initialSync(credentials) {
                var mxClient = clientFromCredentials(credentials);
                return mxClient.initialSync(1)
                    .then(function (syncData) {
                        angular.forEach(syncData.rooms, function (room) { //TODO find a better solution to later stateless identify own account
                            room.me = credentials.user_id;
                        });
                        return syncData;
                    });
            }

            function getRoomInitSync(credentials, room_id) {
                var mxClient = clientFromCredentials(credentials);

                return mxClient.roomInitialSync(room_id, 23)
                    .then(function (data) {
                        return data;
                    })
            }

            /**
             * @param credentials
             * @returns MatrixClient
             */
            function clientFromCredentials(credentials) {
                return mxSdk.createClient({
                    "baseUrl":     "https://matrix.org",
                    "accessToken": credentials.access_token,
                    "home_server": credentials.home_server,
                    "userId":      credentials.user_id
                });
            }

            function events(credentials, from) {
                var mxClient = clientFromCredentials(credentials);
                return mxClient.eventStream(from);
            }

            function sendMessage(credentials, data) {
                console.log(data);
                var mxClient = clientFromCredentials(credentials);
                mxClient.sendTextMessage(data.room_id, data.msg);
            }

            return {
                login: login,
                events: events,
                sendMessage: sendMessage,
                initialSync: initialSync,
                getRoomInitSync: getRoomInitSync
            }
        }
    ]
);