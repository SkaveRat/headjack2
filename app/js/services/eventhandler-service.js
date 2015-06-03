'use strict';

angular.module('eventhandlerService', [])
    .factory('eventhandlerService', [
        'chmsg',
        function (chmsg) {

            function parseEvent(event) {
                chmsg.send('event.data', event);
            }

            function parseEvents(err, events) {
                if(err) {
                    console.error(err)
                }else{
                    angular.forEach(events, parseEvent);
                }
            }

            return {
                parseEvents: parseEvents
            }
        }
    ]
);