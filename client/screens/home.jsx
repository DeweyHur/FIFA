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
      const player = staticdata.players[slot];
      return (
        <div className="slot occupied" onMouseOver={() => {
          // nav.go('playerlist', { slot, index });
        }}>
          <div><img src={image} /></div>
          <div>{player.lastname[0]}. {player.firstname}</div>
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
    this.state = { phase: 0 };
  }

  handleChildClick(item) {
    if (this.currentFocus) {
      this.currentFocus.setState({ ...this.state, selected: undefined });
      delete this.currentFocus;
    }
    this.currentFocus = item;
  }

  render() {
    const { phase } = this.state;
    const formation = squadProxy.myFormation(phase);
    return (
      <section id="formation">
        {formation.map((slot, index) => {
          return <Slot key={index} index={index} slot={slot} onClick={this.handleChildClick} />;
        })}
      </section>
    );
  }
};

