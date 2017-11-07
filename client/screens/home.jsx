const Papa = require('papaparse');
const React = require('react');
const nav = require('../components/nav.jsx');
const UserSquad = require('../components/usersquad.jsx');
const Formation = require('../components/formation.jsx');
const squadProxy = require('../proxies/squad');
const userProxy = require('../proxies/user');

const DuelImage = "https://image.flaticon.com/icons/svg/53/53195.svg";
const TeamSelectionImage = "https://d30y9cdsu7xlg0.cloudfront.net/png/20290-200.png";

module.exports = class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { phase: 0 };
  }

  render() {
    const { phase } = this.state;
    const userid = userProxy.myid();
    const myFormation = squadProxy.myFormation(phase);
    const mySquad = squadProxy.mySquad();

    return (
      <section id="home">
        <UserSquad key="userSquad" userid={userid} teamid={mySquad.teamid} />
        <Formation key="formation" formation={myFormation} phase={0} user={0} />
        <div id="actions">
          <div id="buttons">
            <div key="duel" className="navButton" id="navDuel" onClick={() => {
              nav.go('match');
            }}>
              <img src={DuelImage} />
              <span>Random Match</span>
            </div>
            <div key="team" className="navButton" id="navTeam" onClick={() => {
              nav.go('team');
            }}>
              <img src={TeamSelectionImage} />
              <span>Select Team</span>
            </div>
          </div>
        </div>
      </section>
    );
  }
};

