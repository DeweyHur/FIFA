const _ = require('lodash');
const React = require('react');
const staticdata = require('../staticdata');
const { Columns, Rows, MaxPhase, isWithinPhase, getSlotInfo, BoundaryLength } = require('../../game');

const AspectRatio = 1.5;
const HeightModifier = 2;
const SlideShowSeconds = 2;

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
        const x = turn.slot === slot ? 0 : boundary.x + Math.floor((src.x - (Columns - 1) * 0.5) * district.w);
        const y = turn.slot === slot ? 0 : boundary.y + Math.floor(src.y * district.h * 0.5) * -Math.sign(user - 0.5);
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
    let children = [
      <rect key="boundary" className="boundary"
        x={turn.boundary.x - turn.boundary.h}
        y={(turn.boundary.y - turn.boundary.v) * 2}
        width={turn.boundary.h * 2}
        height={turn.boundary.v * 2 * 2}
      />,
      ...positions.map((props, index) => {
        const prevProps = this.positions ? this.positions[index] : {};
        const { x, y, user, player } = props;
        const key = `${user}_${player.playerid}`;
        return (
          <g key={key}>
            <circle className={user === 1 ? 'awayteam' : 'hometeam'} cx={x} cy={y * AspectRatio} r="5">
              <animate attributeName="cx" from={prevProps.x} to={x} dur={`${SlideShowSeconds}s`} repeatCount="infinite" />
              <animate attributeName="cy" from={prevProps.y * AspectRatio} to={y * AspectRatio} dur={`${SlideShowSeconds}s`} repeatCount="infinite" />
            </circle>
            <text x={x} y={y * AspectRatio} textAnchor="middle">
              <animate attributeName="x" from={prevProps.x} to={x} dur={`${SlideShowSeconds}s`} repeatCount="infinite" />
              <animate attributeName="y" from={prevProps.y * AspectRatio} to={y * AspectRatio} dur={`${SlideShowSeconds}s`} repeatCount="infinite" />
              {player.number}
            </text>
          </g>
        );
      }),
      <g key="homeGK">
        <circle className="hometeam" cx={0} cy={BoundaryLength * 0.5 * AspectRatio - 5} r="5" />
        <text x={0} y={BoundaryLength * 0.5 * AspectRatio - 5} textAnchor="middle">GK</text>
      </g>,
      <g key="awayGK">
        <circle className="awayteam" cx={0} cy={-BoundaryLength * 0.5 * AspectRatio + 5} r="5" />
        <text x={0} y={-BoundaryLength * 0.5 * AspectRatio + 5} textAnchor="middle">GK</text>
      </g>
    ];

    const holder = _.find(positions, { slot: turn.slot, user: turn.user });
    const ball = holder
      ? { x: holder.x, y: holder.y + Math.sign(turn.user - 0.5) * 3 }
      : { x: 0, y: Math.sign(turn.user - 0.5) * (BoundaryLength * 0.5 + 3) };
    children = [
      ...children,
      <circle key="ball" className="ball" cx={ball.x} cy={ball.y * AspectRatio} r="3">
      </circle>
    ];

    this.positions = positions;
    return (
      <svg className="playground" viewBox="-100 -150 200 300">
        {children}
      </svg>
    );
  }
}