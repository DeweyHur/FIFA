const React = require('react');
const staticdata = require('../staticdata');

const AspectRatio = 1.5;

module.exports = class extends React.Component {
  render() {
    const { matchend, turn, prevTurn, formations } = this.props;
    const children = [];
    for (const user of [0, 1]) {
      for (const playerid in turn.positions[user]) {
        const player = staticdata.players[playerid];
        const { x, y } = turn.positions[user][playerid];
        const style = { transform: `translate(${x / 2.5}vw, ${y / 2.5 * AspectRatio}vw)` };
        children.push(
          <g id={user + "_" + playerid} style={style}>
            <circle className={user === 1 ? "awayteam" : "hometeam"} cx={0} cy={0} r="7" />
            <text x={0} y={0} textAnchor="middle">{player.number}</text>
          </g>
        ); 
      }
    }
    return (
      <svg className="playground" viewBox="-100 -150 200 300">
        {children}
      </svg>
    );
  }
}