var mxSdk = require('matrix-js-sdk')
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
    this.initsyncDone = false;
    this.client.startClient(this._listenForEvents.bind(this));
};

MatrixSession.prototype = {
    _processEvent: function (event) {
        this._events.push(event);
    },
    _listenForEvents: function (err, events) {
        if(!this.initsyncDone) {
            //chmsg.send('events.initsync_done');
            this.initsyncDone = true;
        }
        events.forEach(this._processEvent.bind(this));
    }
};

module.exports = MatrixSession;