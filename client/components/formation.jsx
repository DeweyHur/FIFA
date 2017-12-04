const _ = require('lodash');
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
    const { user, ball, playerid } = this.props;
    const image = `https://cdn.sofifa.org/18/players/${playerid}.png`;
    const classes = ['slot'];
    if (playerid) {
      const player = staticdata.players[playerid];
      classes.push('occupied');
      if (ball) classes.push('ball');
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
      classes.push('empty');
      return (
        <div className={classes.join(' ')}>
        </div>
      );
    }
  }
}

const NonSlot = () => {
  return (
    <div className="slot none">
    </div>
  );
}

class Formation extends React.Component {
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
  }

  render() {
    let { phase, user, ball, formation, boundary, keeper, homegk, awaygk } = this.props;
    if (user === 1) {
      formation = _.reverse(formation);
    }

    let children = [
      formation.map((playerid, index) => {
        const slot = (user === 1) ? (phase + 1) * MaxSlotPerPhase - 1 - index : phase * MaxSlotPerPhase + index;
        return <Slot key={index} user={user} ball={slot === ball} slot={slot} playerid={playerid} onClick={this.handleChildClick} />;
      })
    ];

    let style = {};
    if (boundary) {
      style = {
        transform: `
          translateX(${0.5 * (boundary.x - boundary.h + 100)}%) 
          translateY(${0.5 * (boundary.y - boundary.v + 100)}%)
          scaleX(${boundary.h / 100})
          scaleY(${boundary.v / 100})
        `,
      };

    } else {
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
    }

    if (homegk && awaygk) {
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
    return (
      <div className="ground">
        <div className="formation" style={style}>
          {children}
        </div>
      </div>
    );
  }
}

module.exports = Formation;
