const React = require('react');

module.exports = {
  handleChildClick: (item) => {
    if (this.currentFocus) {
      this.currentFocus.setState({ ...this.state, selected: undefined });
      delete this.currentFocus;
    }
    this.currentFocus = item;
  },
  childOnClick: () => {
    this.props.onClick(this);
    this.setState({ ...this.state, selected: true });
  }
}