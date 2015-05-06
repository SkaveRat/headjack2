'use strict';

angular.module('chmsg', [])
    .factory('chmsg', [
        function () {

            function send(type, message) {
                chrome.runtime.sendMessage(
                    {
                        type: type,
                        message: message
                    }
                );
            }

            function on(type, callback) {
                chrome.runtime.onMessage.addListener(function (message) {
                    console.debug("Chrome message");
                    console.debug(message);
                    if (message.type == type) {
                        callback(message.message)
                    }
                });
            }

            return {
                send: send,
                on: on
            }

        }
    ]
);