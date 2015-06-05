'use strict';

angular.module('mxSessionService', [])
    .factory('mxSessionService', [
        '$window', 'chmsg', 'mxRoomService',
        function ($window, chmsg, mxRoomService) {

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
                _this._roomManager = mxRoomService.createManager(_this._onRoomManagerEvent.bind(_this));
                _this.user_id = credentials.user_id;
                _this.initsyncDone = false;
                _this.client.startClient(_this._listenForEvents.bind(_this));


                chmsg.on('room.listing.get', function () {
                    _this._roomManager.getRooms();
                });

            };

            MatrixSession.prototype = {
                _processEvent: function (event) {
                    this._events.push(event);
                    this._roomManager.processEvent(event);
                },
                _listenForEvents: function (err, events) {
                    if(!this.initsyncDone) {
                        chmsg.send('events.initsync_done');
                        this.initsyncDone = true;
                    }
                    angular.forEach(events, this._processEvent.bind(this));
                },
                _onRoomManagerEvent: function(eventname, data) {
                    switch (eventname) {
                        case 'room.listing':
                            chmsg.send('room.listing', {
                                room: data,
                                user_id: this.user_id
                            });
                            break;
                        case 'room.alias':
                            chmsg.send('room.alias', {
                                user_id: this.user_id,
                                room_id: data.room_id,
                                alias: data.alias
                            });
                            break;
                    }
                }
            };

            var sessions = [];

            function startSessions(accounts) {
                angular.forEach(accounts, _createSession);
                return sessions;
            }

            function _createSession(account) {
                sessions.push(new MatrixSession(account));
            }

            return {
                startSessions: startSessions
            }
        }
    ]
)
;