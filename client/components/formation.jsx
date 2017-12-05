const _ = require('lodash');
const React = require('react');
const Slot = require('./slot.jsx');
const staticdata = require('../staticdata');
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
        return <Slot key={index} user={user} ball={slot === ball} slot={slot} playerid={playerid} />;
      })
    ];

    let style = {
      transform: `
        translateX(${0.5 * (boundary.x - boundary.h + 100)}%) 
        translateY(${0.5 * (boundary.y - boundary.v + 100)}%)
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
  constructor(props) {
    super(props);
    this.handleChildClick = this.handleChildClick.bind(this);
  }

  handleChildClick(item) {
    if (this.currentFocus) {
      this.currentFocus.setState({ ...this.state, selected: undefined });
      Reflect.deleteProperty(this, 'currentFocus');
    }
    this.currentFocus = item;

    const { onChildClick } = this.props;
    if (onChildClick) {
      onChildClick(item);
    }
  }

  render() {
    let { formation, teamid } = this.props;

    const GKSlot = <Slot key={formation.GK} playerid={formation.GK} onClick={this.handleChildClick} />;
    let startingChildren = [
      formation.map(playerid => <Slot key={playerid} playerid={playerid} onClick={this.handleChildClick} />),
      <NonSlot />, <NonSlot />, GKSlot, <NonSlot />, <NonSlot />
    ];

    const startingEleven = _(formation).values().uniq().value();
    const reserves = _(staticdata.players).filter({ teamid }).map('playerid').difference(startingEleven).value();
    const reserveChildren = reserves.map(playerid => (<Slot key={playerid} playerid={playerid} onClick={this.handleChildClick} />));

    return (
      <div className="ground">
        <div className="formation">
          {startingChildren}
        </div>
        Reserves
        <div className="reserves">
          {reserveChildren}
        </div>
      </div>
    );
  }
}

module.exports = { ViewFormation, MatchFormation };
