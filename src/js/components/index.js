/** @jsx React.DOM */
var React = require('react'),
    mui = require('material-ui'),
    injectTapEventPlugin = require("react-tap-event-plugin"),
    ThemeManager = new mui.Styles.ThemeManager(),
    RaisedButton = mui.RaisedButton,
    AppCanvas = mui.AppCanvas,
    AppBar = mui.AppBar;
    //ContactList = require('./contactlist');
//var AppActions = require('../actions/AppActions');
//var AppStore = require('../stores/AppStore');

injectTapEventPlugin();
var Index = React.createClass({
    getChildContext: function() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    },
    handleClick: function(){
        //AppActions.addItem('this is the item');
        console.log("foobar");
    },
    render: function(){
        return (
            <AppCanvas predefinedLayout={1}>
                <AppBar title="Matrix" showMenuIconButton='false' zDepth='1' iconClassNameRight="muidocs-icon-navigation-expand-more"/>
                <RaisedButton label="Foobar" onClick={this.handleClick} />
                <h3 onClick={this.handleClick}>Click this Title, then check console</h3>
            </AppCanvas>
        )

    }
});

Index.childContextTypes = {
    muiTheme: React.PropTypes.object
};

module.exports = Index;
