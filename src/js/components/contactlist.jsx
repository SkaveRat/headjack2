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
        //];
        var contactlist = this.state.contacts.map(function (entry) {
            return entry;
        });

        console.log(contactlist);

        return (
            <Menu autoWidth={false} menuItems={contactlist} onItemClick={this.handleClick} />
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