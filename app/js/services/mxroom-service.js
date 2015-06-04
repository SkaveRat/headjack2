'use strict';

angular.module('mxRoomService', [])
    .factory('mxRoomService', [
        'chmsg',
        function (chmsg) {
            var MatrixRoom = function (room_id) {
                this.events = [];
                this.members = [];
                this.room_id = room_id;
                this.aliases = [];
            };

            /**
             * @returns String
             */
            MatrixRoom.prototype = {
                getId: function() {
                    return this.room_id
                },

                addAlias: function(alias) {
                    this.aliases.push(alias);
                }
            };

            ///**
            // * @param event MatrixEvent
            // */
            //MatrixRoom.prototype.addEvent = function (event) {
            //    this.events.push(event);
            //
            //    if (event.getType() == 'm.room.member' && event.getContent().membership == 'join') {
            //        this.members.push(event.getSender());
            //    }
            //    if (event.getType() == 'm.room.member' && event.getContent().membership == 'leave') {
            //        this.members = this.members.filter(function (member) {
            //            return member !== event.getSender()
            //        })
            //    }
            //    if (event.getType() == 'm.room.aliases') {
            //        this.aliases.push(event.content.name);
            //        this._call
            //    }
            //
            //    //this.broadcastRoom(); //TODO broadcast members/messages etc seperately only on change
            //};

            var MatrixRoomManager = function (eventCallback) {
                this._eventCallback = eventCallback;
                this.rooms = [];
            };

            MatrixRoomManager.prototype = {
                getRoomById: function (room_id) {
                    var room_list = this.rooms.filter(function (room) {
                        return room.getId() == room_id;
                    });
                    return room_list[0] || this.createRoom(room_id);
                },

                createRoom: function (room_id) {
                    this._eventCallback('room.listing', room_id);
                    var room = new MatrixRoom(room_id);
                    this.rooms.push(room);
                    return room;
                },

                /**
                 * @param event MatrixEvent
                 */
                processEvent: function (event) {
                    var room = this.getRoomById(event.getRoomId());
                    switch (event.getType()) {
                        case 'm.room.aliases':
                            var alias = event.getContent().aliases[0]; //TODO take the first one for now
                            room.addAlias(alias);
                            this._eventCallback('room.alias', {
                                room_id: event.getRoomId(),
                                alias: alias
                            });
                            break;
                    }

                }
            };


            function createManager(eventCallback) {
                return new MatrixRoomManager(eventCallback);
            }

            return {
                createManager: createManager
            }
        }
    ]
);