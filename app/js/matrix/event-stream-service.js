/*
Copyright 2014 OpenMarket Ltd

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

'use strict';

/*
This service manages where in the event stream the web client currently is,
repolling the event stream, and provides methods to resume/pause/stop the event 
stream. This service is not responsible for parsing event data. For that, see 
the eventHandlerService.
*/
angular.module('eventStreamService', [])
.factory('eventStreamService', ['$q', '$timeout', '$rootScope', 'matrixService', 'eventHandlerService', function($q, $timeout, $rootScope, matrixService, eventHandlerService) {
    var BROADCAST_BAD_CONNECTION = "eventStreamService.BROADCAST_BAD_CONNECTION(isBad)";
    var END = "END";
    var SERVER_TIMEOUT_MS = 30000;
    var ERR_TIMEOUT_MS = 5000;
    
    var badConnection = false;
    var failedAttempts = 0;
    var MAX_FAILED_ATTEMPTS = 4;
    
    var settings = {
        from: "END",
        to: undefined,
        limit: undefined,
        shouldPoll: true,
        isActive: false
    };
    
    var setBadConnection = function(isBad) {
        if (badConnection != isBad) {
            badConnection = isBad;
            console.log("[EventStream] BROADCAST setBadConnection -> "+isBad);
            $rootScope.$emit(BROADCAST_BAD_CONNECTION, badConnection);
        }
    };
    
    var timeout = $q.defer();
    
    var killConnection = function(reason) {
        console.log("[EventStream] killConnection -> "+reason);
        timeout.resolve(reason);
        timeout = $q.defer();
    };
    
    // we need to monitor the specified timeout client-side (SYWEB-219) as we
    // cannot trust that the connection will in fact be ended remotely after 
    // SERVER_TIMEOUT_MS
    var startConnectionTimer = function() {
        return $timeout(function() {
            killConnection("timed out");
        }, SERVER_TIMEOUT_MS + (1000 * 2)); // buffer period
    };
    
    
    // interrupts the stream. Only valid if there is a stream conneciton 
    // open. This is typically used when logging out, to kill the stream immediately
    // and stop retrying.
    var interrupt = function(shouldPoll) {
        console.log("[EventStream] interrupt("+shouldPoll+") "+
                    JSON.stringify(settings));
        settings.shouldPoll = shouldPoll;
        settings.isActive = false;
        killConnection("interrupted");
    };

    var doEventStream = function(deferred) {
        settings.shouldPoll = true;
        settings.isActive = true;
        deferred = deferred || $q.defer();

        
        // monitors if the connection is *still ongoing* after X time then knifes it
        // as we cannot trust the server side timeout.
        var connTimer = startConnectionTimer(); 
        // monitors if there has been a *successful* response, and if not, says 
        // you're on a bad connection.
        
        
        // run the stream from the latest token
        matrixService.getEventStream(settings.from, SERVER_TIMEOUT_MS, timeout.promise).then(
            function(response) {
                failedAttempts = 0;
                setBadConnection(false);
                
                $timeout.cancel(connTimer);
                if (!settings.isActive) {
                    console.log("[EventStream] Got response but now inactive. Dropping data.");
                    return;
                }
                
                console.log(
                    "[EventStream] Got response from "+settings.from+
                    " to "+response.data.end
                );
                
                settings.from = response.data.end;
                
                
                eventHandlerService.handleEvents(response.data.chunk, true);
                
                deferred.resolve(response);
                
                if (settings.shouldPoll) {
                    $timeout(doEventStream, 0);
                }
                else {
                    console.log("[EventStream] Stopping poll.");
                }
            },
            function(error) {
                console.error("[EventStream] failed /events request, retrying...");
                $timeout.cancel(connTimer);
                failedAttempts += 1;
                if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
                    setBadConnection(true);
                }
                
                if (error.status === 403) {
                    settings.shouldPoll = false;
                }
                
                deferred.reject(error);
                
                if (settings.shouldPoll) {
                    // up to 3s jittering
                    var jitter = Math.floor(Math.random() * 3000);
                    $timeout(doEventStream, (ERR_TIMEOUT_MS + jitter));
                }
                else {
                    console.log("[EventStream] Stopping polling.");
                }
            }
        );

        return deferred.promise;
    }; 

    var startEventStream = function(deferred) {
        settings.shouldPoll = true;
        settings.isActive = true;
        if (!deferred) {
            deferred = $q.defer();
        }

        // Initial sync: get all information and the last 8 messages of all rooms of the user
        // 8 messages isn't enough for a full page, but we'll do another request if they view
        // that room. 8 is required though: any less and some rooms may not give any messages
        // to display (e.g. if only 5, you may get room alias / room create / power level 
        // / join rules / room member join, which contains no messages for the recents list..
        matrixService.initialSync(8, false).then(
            function(response) {
                eventHandlerService.handleInitialSyncDone(response);

                // Start event streaming from that point
                settings.from = response.data.end;
                console.log("[EventStream] initialSync complete. Using token "+settings.from);
                doEventStream(deferred);        
            },
            function(error) {
                console.error("[EventStream] initialSync failed, retrying...");
                $timeout(function() {
                    startEventStream(deferred);
                }, ERR_TIMEOUT_MS);
            }
        );

        return deferred.promise;
    };
    
    return {
        // expose these values for testing
        SERVER_TIMEOUT: SERVER_TIMEOUT_MS,
        MAX_FAILED_ATTEMPTS: MAX_FAILED_ATTEMPTS,
        BROADCAST_BAD_CONNECTION: BROADCAST_BAD_CONNECTION,
    
        // resume the stream from whereever it last got up to. Typically used
        // when the page is opened.
        resume: function() {
            if (settings.isActive) {
                console.log("[EventStream] Already active, ignoring resume()");
                return;
            }
        
            console.log("[EventStream] resume "+JSON.stringify(settings));
            return startEventStream();
        },
        
        // pause the stream. Resuming it will continue from the current position
        pause: function() {
            console.log("[EventStream] pause "+JSON.stringify(settings));
            // kill any running stream
            interrupt(false);
        },
        
        // stop the stream and wipe the position in the stream. Typically used
        // when logging out / logged out.
        stop: function() {
            console.log("[EventStream] stop "+JSON.stringify(settings));
            // kill any running stream
            interrupt(false);
            // clear the latest token
            settings.from = END;
        }
    };

}]);
