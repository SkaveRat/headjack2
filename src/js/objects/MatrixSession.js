'use strict';

var mxSdk = require('matrix-js-sdk')
    , ChromeMessageService = require('../services/ChromeMessageService')
    ;


var MatrixSession = function (credentials) {
    var _this = this;
    this.credentials = credentials;
    this._events = [];

    this.client = mxSdk.createClient({
        "baseUrl": "https://matrix.org",
        "accessToken": this.credentials.access_token,
        "userId": this.credentials.user_id
    });
    this.client.startClient();

    this.client.on("syncComplete", function() {
        ChromeMessageService.send('rooms.list', _this.client.getRooms());
    });

    this.user_id = credentials.user_id;

};

MatrixSession.prototype = {

};

module.exports = MatrixSession;