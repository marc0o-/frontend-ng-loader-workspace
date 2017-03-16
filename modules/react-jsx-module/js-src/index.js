var React = require('react');
var ReactDOM = require('react-dom');
var Component = require('./component');

function render(config, wrapper) {
	return ReactDOM.render(
		React.createElement(Component, config),
		document.getElementById(wrapper));
}

module.exports = {render: render};