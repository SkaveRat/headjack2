chrome.app.runtime.onLaunched.addListener(function (launchData) {

    var headjackApp = angular.module('headjackApp', [
        'matrixService',
        'eventStreamService',
        'eventHandlerService',
        'mPresence',
        'notificationService',
        'modelService',
        'commandsService',
        'matrixFilter',
        'chmsg',
    ]);

    angular.element(document).ready(function () {
        angular.bootstrap(document, ['headjackApp']);
    });

    headjackApp.run(['$rootScope', 'matrixService', 'eventStreamService', 'modelService', 'eventHandlerService', 'chmsg',
        function ($rootScope, matrixService, eventStreamService, modelService, eventHandlerService, chmsg) {

            chrome.app.window.create('login.html', {
                id: "Login",
                innerBounds: {
                    width: 300,
                    height: 300,
                    left: 0,
                    top: 0
                }
            });

            chmsg.on('login', function (message) {
                matrixService.setConfig({
                    homeserver: 'https://matrix.org/',
                    identityServer: 'https://matrix.org/'
                });
                matrixService.saveConfig();
                matrixService
                    .login(message.user, message.password)
                    .then(processLogin); //TODO add error handler


                function processLogin(response) {
                    matrixService.setConfig({
                        homeserver: 'https://' + response.data.home_server, // TODO check if we get an https
                        identityServer: 'https://' + response.data.home_server,
                        user_id: response.data.user_id,
                        access_token: response.data.access_token
                    });
                    matrixService.saveConfig();

                    chrome.app.window.get("Login").close();

                    chrome.app.window.create('contactlist.html', {
                        id: "Contactlist",
                        innerBounds: {
                            width: 350,
                            height: 500
                        },
                        left: 0,
                        top: 0
                    });

                    eventStreamService.resume();
                }
            });

            chmsg.on('initsync', function (message) {
                console.log("Fetching rooms");
                var roomData = modelService.getRooms();
                chmsg.send('rooms', {
                    rooms: roomData
                });
            });


            chmsg.on('open_room', function(message) {
                chrome.app.window.create('room.html', {
                        id: message.room_id,
                        innerBounds: {
                            width: 350,
                            height: 350
                        },
                        left: 0,
                        top: 0
                    },
                    function (createdWindow) {
                        createdWindow.contentWindow.room_id = message.room_id;
                    }
                );
            });

            chmsg.on('room_initsync', function (message, answer_callback) {

                var roomdata = modelService.getRoom(message.room_id);

                answer_callback(roomdata);
            });


            chmsg.on('send_msg', function (messagedata) {
                eventHandlerService.sendMessage(messagedata.room_id, messagedata.msg);
            })
        }]);

});
