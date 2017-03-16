var React = require('react');
var ReactDOM = require('react-dom');

class Component extends React.Component {
	render() {
		return <div>Hello {this.props.name}</div>;
	}
};

module.exports = Component;