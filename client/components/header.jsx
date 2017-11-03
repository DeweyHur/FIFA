const React = require('react');

module.exports = class extends React.Component {
  render() {
    return (
      <header>
        {this.props.title}
      </header>
    );
  }
}