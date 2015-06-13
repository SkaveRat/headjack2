/** @jsx React.DOM */
var React = require('react')
    , mui = require('material-ui')
    , injectTapEventPlugin = require("react-tap-event-plugin")
    , ThemeManager = new mui.Styles.ThemeManager()
    , RaisedButton = mui.RaisedButton
    , AppCanvas = mui.AppCanvas
    , Menu = mui.Menu
    , AppBar = mui.AppBar
    , ContactList = require('./contactlist.jsx')
    , ChromeMessageActions = require('../actions/ChromeMessageActions')
    ;
    //

ChromeMessageActions.initializeListeners();
injectTapEventPlugin();

var Index = React.createClass({
    getChildContext: function() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    },
    render: function(){
        return (
            <AppCanvas predefinedLayout={1}>
                <AppBar title="Matrix" showMenuIconButton={false} zDepth={1} iconClassNameRight="muidocs-icon-navigation-expand-more"/>
                <ContactList />
            </AppCanvas>
        )

    }
});

Index.childContextTypes = {
    muiTheme: React.PropTypes.object
};

module.exports = Index;
