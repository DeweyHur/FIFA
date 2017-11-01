const React = require('react');

module.exports = class extends React.Component {
  render() {
    return (
      <header>
        <h1>{this.props.title}</h1>
      </header>
    );
  }
}