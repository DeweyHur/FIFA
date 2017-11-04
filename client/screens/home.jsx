const Papa = require('papaparse');
const React = require('react');
const userProxy = require('../proxies/user');
const squadProxy = require('../proxies/squad');
const nav = require('../components/nav.jsx');
const staticdata = require('../staticdata');

class Slot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { index, slot, onClick } = this.props;
    const image = `https://cdn.sofifa.org/18/players/${slot}.png`;
    if (slot) {
      return (
        <div className="slot occupied" onMouseOver={() => {
          // nav.go('playerlist', { slot, index });
        }}>
          <img src={image} />
          staticdata.players[slot]
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

    const squad = squadProxy.mySquad();
    this.state = { phase: 0, formation: squad.formation };
  }

  handleChildClick(item) {
    if (this.currentFocus) {
      this.currentFocus.setState({ ...this.state, selected: undefined });
      delete this.currentFocus;
    }
    this.currentFocus = item;
  }

  render() {
    const { phase, formation } = this.state;
    return (
      <section id="formation">
        {formation.map((slot, index) => {
          return <Slot key={index} index={index} slot={slot} onClick={this.handleChildClick} />;
        })}
      </section>
    );
  }
};

