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
    ;
    //
//var AppActions = require('../actions/AppActions');
//var AppStore = require('../stores/AppStore');

injectTapEventPlugin();
var Index = React.createClass({
    getChildContext: function() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    },
    //componentDidMount: function() {
    //    EntityStore.addChangeListener(this._onChange);
    //    this.getEntityDataIfNeeded(this.props);
    //},
    //componentWillUnmount: function() {
    //    EntityStore.removeChangeListener(this._onChange);
    //},
    handleClick: function(){
        //AppActions.addItem('this is the item');
        console.log("foobar");
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
