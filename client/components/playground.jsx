const _ = require('lodash');
const React = require('react');
const staticdata = require('../staticdata');
const { Columns, Rows, MaxPhase, isWithinPhase, getSlotInfo } = require('../../game');

const AspectRatio = 1.5;
const HeightModifier = 2;

module.exports = class extends React.Component {

  calcPositions(turn, formations) {
    if (/kickoff/.test(turn.status)) {
      const { boundary } = turn;
      return _.flatMap([0, 1], user => _(formations[user])
        .keys()
        .map(slot => Number.parseInt(slot, 10))
        .filter(slot => isWithinPhase(1, slot))
        .map(slot => {
          const src = getSlotInfo(slot, user);
          const x = turn.slot === slot ? 0 : Math.floor((src.x - (Columns - 1) / 2) * boundary.h);
          const y = turn.slot === slot ? 0 : Math.floor(src.y * boundary.v / 2) * -Math.sign(user - 0.5);
          const player = staticdata.players[formations[user][slot]];
          return { x, y, slot, user, player };
        })
        .value()
      );

    } else {
      const { boundary } = turn;
      const calcCoord = (slot, user) => {
        const src = getSlotInfo(slot, user);
        const x = Math.floor((src.x - (Columns - 1) / 2) * boundary.h);
        const y = Math.floor((src.y - (Rows - 1) / 2) * boundary.v + HeightModifier * -Math.sign(user - 0.5));
        return { x, y };
      }

      const positions = _.flatMap([0, 1], user => {
        const phase = turn.user === user ? turn.phase : MaxPhase - turn.phase - 1;
        return _(formations[user])
          .keys()
          .map(slot => Number.parseInt(slot, 10))
          .filter(slot => isWithinPhase(phase, slot))
          .map(slot => ({
            ...calcCoord(slot, user),
            slot,
            user,
            player: staticdata.players[formations[user][slot]]
          }))
          .value();
      });

      if (turn.markman) {
        const user = (turn.user + 1) % 2;
        const markmanIndex = _.findIndex(positions, { user, slot: turn.markman });
        if (markmanIndex !== -1) {
          const markee = _.find(positions, { user: turn.user, slot: turn.slot });
          positions[markmanIndex] = {
            ...positions[markmanIndex],
            x: markee.x,
            y: markee.y + HeightModifier * 2 * Math.sign(this.user - 0.5)
          };
        }
      }

      return positions;
    }
  }

  render() {
    const { turn, formations } = this.props;

    const positions = this.calcPositions(turn, formations);
    const children = positions.map(props => {
      const { x, y, user, player } = props;
      const style = { transform: `translate(${x / 2.5}vw, ${y / 2.5 * AspectRatio}vw)` };
      return (
        <g id={`${user}_${player.playerid}`} style={style}>
          <circle className={user === 1 ? 'awayteam' : 'hometeam'} cx={0} cy={0} r="7" />
          <text x={0} y={0} textAnchor="middle">{player.number}</text>
        </g>
      );
    });


    return (
      <svg className="playground" viewBox="-100 -150 200 300">
        <rect id="boundary"
          x={turn.boundary.x - turn.boundary.h}
          y={(turn.boundary.y - turn.boundary.h) * 2}
          rx={turn.boundary.h * 2}
          ry={turn.boundary.v * 2 * 2}
        />
        {children}
      </svg>
    );
  }
}