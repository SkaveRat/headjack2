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
        ContactListActions.fetchContactlist();
    },

    render: function () {

        //var foo = [
        //{ payload: '1', text: 'ID', data: '1234567890', icon: 'home' },
        //{ payload: '2', text: 'Type', data: 'Announcement', icon: 'home' },
        //{ payload: '3', text: 'Caller ID', data: '(123) 456-7890', icon: 'home' },
        //{ payload: '4', text: 'Caller ID', data: '(123) 456-7890', icon: 'home' },
        //{ payload: '5', text: 'Caller ID', data: '(123) 456-7890', icon: 'home' },
        //{ payload: '6', text: 'Caller ID', data: '(123) 456-7890', icon: 'home' },
        //{ payload: '7', text: 'Caller ID', data: '(123) 456-7890', icon: 'home' },
        //{ payload: '8', text: 'Caller ID', data: '(123) 456-7890', icon: 'home' },
        //{ payload: '9', text: 'Caller ID', data: '(123) 456-7890', icon: 'home' },
        //{ payload: '10', text: 'Caller ID', data: '(123) 456-7890', icon: 'home' },
        //{ payload: '11', text: 'Caller ID', data: '(123) 456-7890', icon: 'home' },
        //{ payload: '12', text: 'Caller ID', data: '(123) 456-7890', icon: 'home' },
        //{ payload: '13', text: 'Caller ID', data: '(123) 456-7890', icon: 'home' }
        //];
        var foo = [];
        var contactlist = this.state.contacts.map(function (entry) {
            return entry;
        });

        console.log(contactlist);

        return (
            <Menu autoWidth={false} menuItems={foo} onItemClick={this.handleClick} />
        );
    },

    handleClick: function () {
        console.log("clicked");
        ContactListActions.fetchContactlist();
    },

    _onChange: function() {
        this.setState(ContactListStore.getState());
    }
});

module.exports = ContactList;