/** @jsx React.DOM */
var React = require('react');
var Index = require('./components/index.js');

//var injectTapEventPlugin = require("react-tap-event-plugin");
//injectTapEventPlugin();


React.render(
    <Index />,
    document.getElementById('container')
);
