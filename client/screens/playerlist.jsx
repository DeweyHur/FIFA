const React = require('react');
const nav = require('../components/nav.jsx');

class Slot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { addible, index, slot } = this.props;
    if (slot) {
      return (
        <div className="slot occupied" onMouseOver={() => {
          nav.go('playerlist', { slot, index });
        }}>
        </div>
      );

    } else if (addible) {
      return (
        <div className="slot addible" onMouseOver={() => {
          nav.go('playerlist', { slot, index });
        }}>
        </div>
      );
    } else {
      return (
        <div className="slot empty">
        </div>
      );
    }
  }
}

module.exports = class extends React.Component {
  constructor(props) {
    super(props);
    this.handleChildClick = this.handleChildClick.bind(this);
    this.state = { };
  }

  handleChildClick(item) {
    if (this.currentFocus) {
      this.currentFocus.setState({ ...this.state, selected: undefined });
      Reflect.deleteProperty(this.currentFocus);
    }
    this.currentFocus = item;
  }

  render() {
    const { selectedIndex, formations } = this.state;
    const formation = formations[selectedIndex];
    const addible = formation.filter(slot => slot).length < 11;
    return (
      <section id="formation">
        {formation[selectedIndex].map((slot, index) => {
          return <Slot key={`${selectedIndex}.${index}`} addible={addible} index={index} slot={slot} onClick={this.handleChildClick} />;
        })}
      </section>
    );
  }
};