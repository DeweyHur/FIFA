const React = require('react');
const Player = require('./player.jsx');
const staticdata = require('../staticdata');
const { MaxSlotPerPhase } = require('../../game');

class Slot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { user, ball, slot, playerid, onClick } = this.props;
    const image = `https://cdn.sofifa.org/18/players/${playerid}.png`;
    const classes = ["slot"];
    if (playerid) {
      const player = staticdata.players[playerid];
      classes.push("occupied");
      if (ball) classes.push("ball");
      return (
        <div className={classes.join(' ')} onMouseOver={() => {
          // nav.go('playerlist', { slot, index });
        }}>
          <div key="ovr" className="ovr">{player.ovr}</div>
          <div key="portrait"><img src={image} /></div>
          <Player key="name" user={user} player={playerid} />
        </div>
      );

    } else {
      classes.push("empty");
      return (
        <div className={classes.join(" ")}>
        </div>
      );
    }
  }
}

const NonSlot = (props) => {
  return (
    <div className="slot none">
    </div>
  );
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
    let { phase, user, ball, formation, keeper } = this.props;
    if (user === 1) {
      formation = _.reverse(formation);
    }

    let children = [
      formation.map((playerid, index) => {
        const slot = (user === 1) ? (phase + 1) * MaxSlotPerPhase - 1 - index : phase * MaxSlotPerPhase + index;
        return <Slot key={index} user={user} ball={slot === ball} slot={slot} playerid={playerid} onClick={this.handleChildClick} />;
      })
    ];
    const GKSlot = <Slot key="GK" user={user} ball={!ball} playerid={keeper} onClick={this.handleChildClick} />;
    if (user === 1) {
      children = [ 
        <NonSlot />, <NonSlot />, GKSlot, <NonSlot />, <NonSlot />,
        ...children 
      ];
    } else {
      children = [
        ...children,
        <NonSlot />, <NonSlot />, GKSlot, <NonSlot />, <NonSlot />
      ];
    }

    return (
      <div className="formation">
        {children}
      </div>
    );
  }
};