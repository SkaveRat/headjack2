chrome.app.runtime.onLaunched.addListener(function(launchData) {

    var headjackApp = angular.module('headjackApp', [
        'matrixService',
        'eventStreamService',
        'eventHandlerService',
        'mPresence',
        'notificationService',
        'modelService',
        'commandsService',
        'matrixFilter',
    ]);

    angular.element(document).ready(function() {
        angular.bootstrap(document, ['headjackApp']);
    });

    headjackApp.run( ['$rootScope', 'matrixService', 'eventStreamService', 'modelService',
        function ($rootScope, matrixService, eventStreamService, modelService) {

        chrome.app.window.create('login.html', {
            id: "Login",
            innerBounds: {
                width: 300,
                height: 300
            },
            left: 0,
            top: 0
        });

        chrome.runtime.onMessage.addListener(
            function(message, sender, sendResponse) {
                console.log(message);

                switch(message.type) {

                    case 'login':
                        matrixService.setConfig({
                            homeserver: 'https://matrix.org/',
                            identityServer: 'https://matrix.org/'
                        });
                        matrixService.saveConfig();
                        matrixService
                            .login(message.loginform.user, message.loginform.password)
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
                                    width: 200,
                                    height: 500
                                },
                                left: 0,
                                top: 0
                            });
                        }

                        break;
                    case 'initsync':

                        eventStreamService.resume()
                            .then(loadRoomsInContactlist);


                        function loadRoomsInContactlist() {
                            console.log("Fetching room data");
                            var roomData = modelService.getRooms();
                            chrome.runtime.sendMessage({
                                type: 'rooms',
                                rooms: roomData
                                });
                        }

                        break;
                    default:
                        break;
                }

            });

    }]);

});
