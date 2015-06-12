var mxSdk = require('matrix-js-sdk')
    , ChromeMessageService = require('../services/ChromeMessageService')
    ;


var MatrixSession = function (credentials) {
    this.credentials = credentials;
    this._events = [];
    this.client = mxSdk.createClient({
        "baseUrl": "https://matrix.org",
        "accessToken": this.credentials.access_token,
        "home_server": this.credentials.home_server,
        "userId": this.credentials.user_id
    }, {
        debug: true,
        noUserAgent: true
    });

    this.user_id = credentials.user_id;
    this.client.startClient(this._listenForEvents.bind(this));
};

MatrixSession.prototype = {
    _listenForEvents: function (err, events) {
        var _this = this;
        events.forEach(function (event) {
            _this._events.push(event);
            ChromeMessageService.send('event', event);
        });
    }
};

module.exports = MatrixSession;