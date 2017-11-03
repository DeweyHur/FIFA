const Papa = require('papaparse');
const React = require('react');
const userProxy = require('../proxies/user');
const squadProxy = require('../proxies/squad');
const nav = require('../components/nav.jsx');

class Slot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { addible, index, slot, onClick } = this.props;
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

    const squad = squadProxy.cache.data[userProxy.cache.myid];
    this.state = {
      selectedIndex: 0,
      formations: squad.formations || Array(4).fill(Array(25))
    };
  }

  handleChildClick(item) {
    if (this.currentFocus) {
      this.currentFocus.setState({ ...this.state, selected: undefined });
      delete this.currentFocus;
    }
    this.currentFocus = item;
  }

  render() {
    const { selectedIndex, formations } = this.state;
    const formation = formations[selectedIndex];
    const addible = formation.filter(slot => slot).length < 11;
    return (
      <section id="formation">
        {formation.map((slot, index) => {
          return <Slot key={selectedIndex + '.' + index} addible={formation} index={index} slot={slot} onClick={this.handleChildClick} />;
        })}
      </section>
    );
  }
};