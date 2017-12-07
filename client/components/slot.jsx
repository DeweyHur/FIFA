const React = require('react');
const Player = require('./player.jsx');
const staticdata = require('../staticdata');

module.exports = class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { user, selected, playerid, onClick } = this.props;
    const image = `https://cdn.sofifa.org/18/players/${playerid}.png`;
    const classes = ['slot'];
    if (playerid) {
      const player = staticdata.players[playerid];
      classes.push('occupied');
      if (selected) classes.push('selected');
      return (
        <div className={classes.join(' ')} onClick={() => onClick(this)}>
          <div key="ovr" className="ovr">{player.ovr}</div>
          <div key="portrait"><img src={image} /></div>
          <Player key="name" user={user} player={playerid} />
        </div>
      );

    } else {
      classes.push('empty');
      return (
        <div className={classes.join(' ')} onClick={() => onClick(this)}>
        </div>
      );
    }
  }
}
