'use strict';

angular.module('mxSessionService', [])
    .factory('mxSessionService', [
        '$window', 'chmsg',
        function ($window, chmsg) {

            var mxSdk = $window.matrixcs;

            var MatrixSession = function (credentials) {
                var _this = this;
                _this.credentials = credentials;
                _this._events = [];
                _this.client = mxSdk.createClient({
                    "baseUrl": "https://matrix.org",
                    "accessToken": _this.credentials.access_token,
                    "home_server": _this.credentials.home_server,
                    "userId": _this.credentials.user_id
                }, {
                    noUserAgent: true
                });
                _this.user_id = credentials.user_id;
                _this.client.startClient(_this.listenForEvents.bind(_this));
            };

            MatrixSession.prototype = {
                _processEvent: function (event) {
                    var _this = this;
                    _this._events.push(event);

                    if (event.getType() == 'm.room.member') {
                        //TODO fill member lists
                    }
                },
                listenForEvents: function (err, events) {
                    var _this = this;
                    angular.forEach(events, _this._processEvent.bind(_this));
                },

                getUserId: function () {
                    return this.user_id;
                }
            };


            var sessions = [];

            function startSessions(accounts) {
                angular.forEach(accounts, createSession);
                return sessions;
            }

            function createSession(account) {
                sessions.push(new MatrixSession(account));
            }

            return {
                startSessions: startSessions
            }
        }
    ]
)
;