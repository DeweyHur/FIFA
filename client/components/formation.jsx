const _ = require('lodash');
const React = require('react');
const Slot = require('./slot.jsx');
const { MaxSlotPerPhase } = require('../../game');

const NonSlot = () => {
  return (
    <div className="slot none">
    </div>
  );
}

class MatchFormation extends React.Component {
  render() {
    let { phase, user, ball, formation, boundary, homegk, awaygk } = this.props;
    if (user === 1) {
      formation = _.reverse(formation);
    }

    let children = [
      formation.map((playerid, index) => {
        const slot = (user === 1) ? (phase + 1) * MaxSlotPerPhase - 1 - index : phase * MaxSlotPerPhase + index;
        return <Slot key={index} user={user} selected={slot === ball} slot={slot} playerid={playerid} />;
      })
    ];

    let style = {
      transform: `
        translateX(${0.5 * (boundary.x)}%) 
        translateY(${0.5 * (boundary.y)}%)
        scaleX(${boundary.h / 100})
        scaleY(${boundary.v / 100})
      `,
    };

    const gkStyle = {
      transform: `
        scaleX(${boundary.h / 100})
        scaleY(${boundary.v / 100})          
      `
    };
    return (
      <div className="ground">
        <div className="keeper" style={gkStyle}>
          <Slot key="awaygk" id="awaygk" user={1} ball={user === 1 && ball === undefined} playerid={awaygk} />
        </div>
        <div className="formation" style={style}>
          {children}
        </div>
        <div className="keeper" style={gkStyle}>
          <Slot key="homegk" id="homegk" user={0} ball={user === 0 && ball === undefined} playerid={homegk} />
        </div>
      </div>

    );
  }
}

class ViewFormation extends React.Component {
  render() {
    let { formation, phase, selected, gk, onChildClick } = this.props;

    const GKSlot = <Slot
      key={gk}
      slot="GK"
      playerid={gk}
      onClick={onChildClick}
      selected={selected === gk}
    />;
    let startingChildren = [
      formation.map((playerid, index) => <Slot
        key={playerid}
        slot={phase * MaxSlotPerPhase + index}
        playerid={playerid}
        onClick={onChildClick}
        selected={selected === playerid}
      />),
      <NonSlot key="1" />, <NonSlot key="2" />, GKSlot, <NonSlot key="4" />, <NonSlot key="5" />
    ];

    return (
      <div key="ground" className="ground">
        <div key="formation" className="formation">
          {startingChildren}
        </div>
      </div>
    );
  }
}

module.exports = { ViewFormation, MatchFormation };
