'use strict';

angular.module('chmsg', [])
    .factory('chmsg', [
        function () {

            function send(type, message, responseCallback) {
                chrome.runtime.sendMessage(
                    {
                        type: type,
                        message: message
                    },
                    responseCallback
                );
            }

            function on(type, callback, sendResponse) {
                chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
                    console.debug("Chrome message");
                    console.debug(message);
                    if (message.type == type) {
                        callback(message.message, sendResponse)
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