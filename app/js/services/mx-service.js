'use strict';

angular.module('mxService', [])
    .factory('mxService', [
        '$window',
        '$http',
        function ($window, $http) {

            //TODO abstract for multiple accounts
            var mxSdk = $window.matrixcs;
            var mxClient = mxSdk.createClient("https://matrix.org"); //TODO custom homeserver

            function login(logindata) {
                return mxClient.login('m.login.password', logindata);
            }

            function startClient(credentials, callback) {
                var mxClient = clientFromCredentials(credentials);
                mxClient.startClient(function (err, events) {
                    callback(err, events)
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
                    "baseUrl": "https://matrix.org",
                    "accessToken": credentials.access_token,
                    "home_server": credentials.home_server,
                    "userId": credentials.user_id
                }, {
                    noUserAgent: true
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

            /**
             * @param event
             * @returns {mxService.MatrixEvent}
             * @private
             */
            function _MatrixEvent(event) {
                return new mxSdk.MatrixEvent(event.event);
            }

            return {
                login: login,
                events: events,
                sendMessage: sendMessage,
                startClient: startClient,
                getRoomInitSync: getRoomInitSync,
                MatrixEvent: _MatrixEvent
            }
        }
    ]
);