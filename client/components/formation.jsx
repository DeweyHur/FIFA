const React = require('react');
const Player = require('./player.jsx');
const staticdata = require('../staticdata');

class Slot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { user, index, playerid, onClick } = this.props;
    const image = `https://cdn.sofifa.org/18/players/${playerid}.png`;
    if (playerid) {
      const player = staticdata.players[playerid];
      return (
        <div className="slot occupied" onMouseOver={() => {
          // nav.go('playerlist', { slot, index });
        }}>
          <div key="ovr" className="ovr">{player.ovr}</div>
          <div key="portrait"><img src={image} /></div>
          <Player key="name" user={user} player={playerid} />
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
  }

  handleChildClick(item) {
    if (this.currentFocus) {
      this.currentFocus.setState({ ...this.state, selected: undefined });
      delete this.currentFocus;
    }
    this.currentFocus = item;
  }

  render() {
    let { user, slot, formation, flip } = this.props;
    if (flip) {
      formation = _.reverse(formation);
    }

    return (
      <div className="formation">
        {formation.map((playerid, index) => {
          return <Slot key={index} user={user} index={index} playerid={playerid} onClick={this.handleChildClick} />;
        })}
      </div>
    );
  }  
};