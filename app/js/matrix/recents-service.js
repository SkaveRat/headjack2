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
This service manages shared state between *instances* of recent lists. The
recents controller will hook into this central service to get things like:
- which rooms should be highlighted
- which rooms have been binged
- which room is currently selected
- etc.
This is preferable to polluting the $rootScope with recents specific info, and
makes the dependency on this shared state *explicit*.
*/
angular.module('recentsService', [])
.factory('recentsService', ['$rootScope', '$document', 'eventHandlerService', 'matrixService', 'modelService',
function($rootScope, $document, eventHandlerService, matrixService, modelService) {
    // notify listeners when variables in the service are updated. We need to do
    // this since we do not tie them to any scope.
    var BROADCAST_SELECTED_ROOM_ID = "recentsService:BROADCAST_SELECTED_ROOM_ID(room_id)";
    var selectedRoomId = undefined;
    
    var showCountInTitle = true;
    var titleCount = 0;
    var originalTitle = $document[0].title;
    
    var BROADCAST_UNREAD_MESSAGES = "recentsService:BROADCAST_UNREAD_MESSAGES(room_id, unreadCount)";
    var unreadMessages = {
        // room_id: <number>
    };
    
    var BROADCAST_UNREAD_BING_MESSAGES = "recentsService:BROADCAST_UNREAD_BING_MESSAGES(room_id, event)";
    var unreadBingMessages = {
        // room_id: bingEvent
    };
    
    var addUnreadBing = function(event) {
        if (!unreadBingMessages[event.room_id]) {
            unreadBingMessages[event.room_id] = {};
        }
        unreadBingMessages[event.room_id] = event;
        $rootScope.$broadcast(BROADCAST_UNREAD_BING_MESSAGES, event.room_id, event);
    };
    
    // listen for new unread messages
    $rootScope.$on(eventHandlerService.MSG_EVENT, function(ngEvent, event, isLive) {
        if (isLive && event.room_id !== selectedRoomId && matrixService.config().user_id !== event.user_id) {
            if (eventHandlerService.eventContainsBingWord(event)) {
                addUnreadBing(event);
            }
        
            if (!unreadMessages[event.room_id]) {
                unreadMessages[event.room_id] = 0;
            }
            unreadMessages[event.room_id] += 1;
            titleCount += 1;
            updateTitleCount();
            $rootScope.$broadcast(BROADCAST_UNREAD_MESSAGES, event.room_id, unreadMessages[event.room_id]);
        }
    });
    
    // bing for new invites
    $rootScope.$on(eventHandlerService.MEMBER_EVENT, function(ngEvent, event, isLive) {
        if (isLive && event.room_id !== selectedRoomId) {
            if (matrixService.config().user_id === event.state_key && 
                    event.content.membership === "invite") {
                addUnreadBing(event);
            }
        }
    });
    // bing for invites from initialsync
    eventHandlerService.waitForInitialSyncCompletion().then(function() {
        var rooms = modelService.getRooms();
        var me = matrixService.config().user_id;
        Object.keys(rooms).forEach(function (room_id) {
            var room = rooms[room_id];
            if (room.getMembershipState(me) === "invite") {
                addUnreadBing(room.now.state("m.room.member", me));
            }
        });
    });
    
    var updateTitleCount = function() {
        if (!showCountInTitle) {
            return;
        }
        
        if (titleCount <= 0) {
            $document[0].title = originalTitle;
        }
        else {
            $document[0].title = "("+titleCount+") " + originalTitle;
        }
    };
    
    return {
        BROADCAST_SELECTED_ROOM_ID: BROADCAST_SELECTED_ROOM_ID,
        BROADCAST_UNREAD_MESSAGES: BROADCAST_UNREAD_MESSAGES,
        
        showUnreadMessagesInTitle: function(showMessages) {
            showCountInTitle = showMessages;
        },
    
        getSelectedRoomId: function() {
            return selectedRoomId;
        },
        
        setSelectedRoomId: function(room_id) {
            selectedRoomId = room_id;
            $rootScope.$broadcast(BROADCAST_SELECTED_ROOM_ID, room_id);
        },
        
        getUnreadMessages: function() {
            return unreadMessages;
        },
        
        getUnreadBingMessages: function() {
            return unreadBingMessages;
        },
        
        markAsRead: function(room_id) {
            if (unreadMessages[room_id]) {
                titleCount -= unreadMessages[room_id];
                unreadMessages[room_id] = 0;
            }
            if (unreadBingMessages[room_id]) {
                unreadBingMessages[room_id] = undefined;
            }
            $rootScope.$broadcast(BROADCAST_UNREAD_MESSAGES, room_id, 0);
            $rootScope.$broadcast(BROADCAST_UNREAD_BING_MESSAGES, room_id, undefined);
            updateTitleCount();
        }
    
    };

}]);
