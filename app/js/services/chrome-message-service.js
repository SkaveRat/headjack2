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

            function on(type, callback) {
                chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
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