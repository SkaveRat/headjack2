'use strict';

angular.module('eventhandlerService', [])
    .factory('eventhandlerService', [
        'chmsg',
        function (chmsg) {

            function parseEvent(event) {
                chmsg.send('event.data', event);
            }

            function parseEvents(eventChunks) {
                angular.forEach(eventChunks, parseEvent);
            }

            return {
                parseEvents: parseEvents
            }
        }
    ]
);