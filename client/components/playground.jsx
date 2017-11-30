const _ = require('lodash');
const React = require('react');
const staticdata = require('../staticdata');
const { Columns, Rows, MaxPhase, isWithinPhase, getSlotInfo } = require('../../game');

const AspectRatio = 1.5;
const HeightModifier = 2;

const calcPositions = (turn, formations) => {
  const { boundary } = turn;
  const district = { w: boundary.h * 2 / Columns, h: boundary.v * 2 / Rows };
  if (/kickoff/.test(turn.status)) {
    return _.flatMap([0, 1], user => _(formations[user])
      .keys()
      .map(slot => Number.parseInt(slot, 10))
      .filter(slot => isWithinPhase(1, slot))
      .map(slot => {
        const src = getSlotInfo(slot, user);
        const x = turn.slot === slot ? 0 : boundary.x + Math.floor((src.x - (Columns - 1) * 0.5) * district.w) + (Math.random() - 0.5) * district.w * 0.5;
        const y = turn.slot === slot ? 0 : boundary.y + Math.floor(src.y * district.h / Rows * 0.5) * -Math.sign(user - 0.5) + (Math.random() - 0.5) * district.h * 0.5;
        const player = staticdata.players[formations[user][slot]];
        return { x, y, slot, user, player };
      })
      .value()
    );

  } else {
    const calcCoord = (slot, user) => {
      const src = getSlotInfo(slot, user);
      const x = boundary.x + Math.floor((src.x - (Columns - 1) * 0.5) * district.w) + (Math.random() - 0.5) * district.w * 0.5;
      const y = boundary.y + Math.floor((src.y - (Rows - 1) * 0.5) * district.h + HeightModifier * -Math.sign(user - 0.5)) + (Math.random() - 0.5) * district.h * 0.5;
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

    // if (turn.markman) {
    //   const user = (turn.user + 1) % 2;
    //   const markmanIndex = _.findIndex(positions, { user, slot: turn.markman });
    //   if (markmanIndex !== -1) {
    //     const markee = _.find(positions, { user: turn.user, slot: turn.slot });
    //     positions[markmanIndex] = {
    //       ...positions[markmanIndex],
    //       x: markee.x,
    //       y: markee.y + HeightModifier * 2 * Math.sign(user - 0.5)
    //     };
    //   }
    // }

    return positions;
  }
}

module.exports = class extends React.Component {
  render() {
    const { turn, formations } = this.props;

    const positions = calcPositions(turn, formations);
    const children = positions.map(props => {
      const { x, y, user, player } = props;
      return (
        <g id={`${user}_${player.playerid}`}>
          <circle className={user === 1 ? 'awayteam' : 'hometeam'} cx={x} cy={y * AspectRatio} r="5" />
          <text x={x} y={y * AspectRatio} textAnchor="middle">{player.number}</text>
        </g>
      );
    });


    return (
      <svg className="playground" viewBox="-100 -150 200 300">
        <rect id="boundary"
          x={turn.boundary.x - turn.boundary.h}
          y={(turn.boundary.y - turn.boundary.h) * 2}
          width={turn.boundary.h * 2}
          height={turn.boundary.v * 2 * 2}
        />
        {children}
      </svg>
    );
  }
}