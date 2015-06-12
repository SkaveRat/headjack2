/** @jsx React.DOM */

    var React = require('react')
    , mui = require('material-ui')
    , Menu = mui.Menu
    , ContactListActions = require('../actions/ContactListActions')
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
        var contactlist = this.state.rooms.map(function (room, i) {
            return {
                payload: i,
                text: room.name,
                icon: 'home'
            };
        });

        return (
            <Menu autoWidth={false} menuItems={contactlist} onItemClick={this.handleClick} />
        );
    },

    handleClick: function () {
        ContactListActions.fetchContactlist();
    },

    _onChange: function() {
        this.setState(ContactListStore.getState());
    }
});

module.exports = ContactList;