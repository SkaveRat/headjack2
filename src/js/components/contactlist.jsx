/** @jsx React.DOM */

    var React = require('react')
    , mui = require('material-ui')
    , List = mui.List
    , ListItem = mui.ListItem
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
            <List>
            {this.state.rooms.map(function (room) {
                return <ListItem onClick={this.handleClick.bind(null, room.roomId)} >{room.name}</ListItem>
                }, this)}
            </List>
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