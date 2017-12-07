const _ = require('lodash');
const React = require('react');
const nav = require('../components/nav.jsx');
const { ViewFormation } = require('../components/formation.jsx');
const Phases = require('../components/phases.jsx');
const Slot = require('../components/slot.jsx');
const UserSquad = require('../components/usersquad.jsx');
const squadProxy = require('../proxies/squad');
const userProxy = require('../proxies/user');
const staticdata = require('../staticdata');

const DuelImage = 'https://image.flaticon.com/icons/svg/53/53195.svg';
const TeamSelectionImage = 'https://d30y9cdsu7xlg0.cloudfront.net/png/20290-200.png';

module.exports = class extends React.Component {
  constructor(props) {
    super(props);

    this.state = { phase: 0 };
    this.handleChildClick = this.handleChildClick.bind(this);
    this.handlePhaseUpdate = this.handlePhaseUpdate.bind(this);
    squadProxy.addListener('assign', () => this.setState({ ...this.state }));
  }

  handleChildClick(item) {
    const playerid = _.get(item, 'props.playerid');
    const selected = _.get(this, 'state.selected');

    if (selected) {
      if (!playerid) {
        const { phase } = this.state;
        const myFormation = squadProxy.myFormation(phase);
        const src = Number.parseInt(_.findKey(myFormation, x => x === selected), 10);
        const dest = _.get(item, 'props.slot');
        squadProxy.movePosition(src, dest);

      } else if (selected !== playerid) {
        squadProxy.swapPosition(selected, playerid);

      }
      this.setState({ ...this.setState, selected: undefined });

    } else if (playerid) {
      this.setState({ ...this.state, selected: playerid });
    }
  }

  handlePhaseUpdate(phase) {
    this.setState({ ...this.state, phase });
  }

  render() {
    const { phase, selected } = this.state;
    const userid = userProxy.myid();
    const myFormation = squadProxy.myFormation(phase);
    const mySquad = squadProxy.mySquad();

    const squadAndTactics = [
      <UserSquad key="userSquad" userid={userid} teamid={mySquad.teamid} />,
      <Phases key="phases" phase={phase} onUpdate={this.handlePhaseUpdate} />,
      <ViewFormation key="formation"
        formation={myFormation}
        phase={phase}
        teamid={mySquad.teamid}
        selected={selected}
        gk={myFormation.GK}
        onChildClick={this.handleChildClick}
      />
    ];
    if (selected) {
      const startingEleven = _(myFormation).values().uniq().value();
      const reserves = _(staticdata.players).filter({ teamid: mySquad.teamid }).map('playerid').difference(startingEleven).value();
      const reserveChildren = reserves.map(playerid => (<Slot key={playerid} playerid={playerid} onClick={this.handleChildClick} />));

      return (
        <section id="home">
          {squadAndTactics}
          Reserves
          <div className="reserves" >
            {reserveChildren}
          </div>
        </section>
      );

    } else {
      return (
        <section id="home">
          {squadAndTactics}
          <div key="actions" id="actions">
            <div id="buttons">
              <div key="duel" className="navButton" id="navDuel" onClick={() => {
                if (!selected) nav.go('match');
              }}>
                <img src={DuelImage} />
                <span>Random Match</span>
              </div>
              <div key="team" className="navButton" id="navTeam" onClick={() => {
                if (!selected) nav.go('team');
              }}>
                <img src={TeamSelectionImage} />
                <span>Select Team</span>
              </div>
            </div>
          </div>
        </section>
      );
    }
  }
};