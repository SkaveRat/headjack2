/** @jsx React.DOM */

    var React = require('react')
    , mui = require('material-ui')
    , FlatButton = mui.FlatButton
    , ContactListActions = require('../actions/ContactListActions')
    , ChromeMessageActions = require('../actions/ChromeMessageActions')
    , ContactListStore = require('../stores/ContactListStore')
    ;

var ContactList = React.createClass({

    getInitialState: function () {
        return ContactListStore.getState();
    },

    componentDidMount: function () {
        ContactListStore.addChangeListener(this._onChange);
        ContactListActions.fetchContactlist();
    },

    render: function () {
        var liststyles = {
            display: "block",
            width: "100%"
        };

        return (
            <div>
            {this.state.rooms.map(function (room) {
                return <FlatButton onClick={this.handleClick.bind(null, room.roomId)} style={liststyles} label={room.name} />
                }, this)}
            </div>
        );
    },

    handleClick: function (room_id) {
        ChromeMessageActions.openRoom(room_id);
    },

    _onChange: function() {
        this.setState(ContactListStore.getState());
    }
});

module.exports = ContactList;