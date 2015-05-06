headjackApp.controller('ContactlistCtrl', function ($scope, $http, matrixService) {

    chrome.runtime.onMessage.addListener(function(message) {
        if(message.type == 'rooms') {
            $scope.rooms = message.rooms;
            $scope.$apply();
        }

    });

    /**
     * Window loaded, request an initial sync
     */
    chrome.runtime.sendMessage({
        'type': 'initsync'
    });

});