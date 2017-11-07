const React = require('react');
const UserSquad = require('../components/usersquad.jsx');
const Formation = require('../components/formation.jsx');
const nav = require('../components/nav.jsx');
const matchProxy = require('../proxies/match');
const squadProxy = require('../proxies/squad');
const userProxy = require('../proxies/user');

const HomeImage = "https://image.freepik.com/free-icon/worker-in-front-of-a-computer-monitor_318-47857.jpg";
const TurnSeconds = 2;

module.exports = class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentWillMount() {
    const match = await matchProxy.make();
    this.setState({ ...this.state, match });

    for (const turn of match.history) {
      await new Promise(resolve => setTimeout(() => resolve(), TurnSeconds * 1000));
      console.log('Setting turn', turn);
      this.setState({ ...this.state, turn });
    }
  }

  render() {
    const { match, turn } = this.state;
    if (match) {
      const { homeUserId, homeTeamId, homeFormation, awayUserId, awayTeamId, awayFormation } = match;
      let children = [
        <div key="summary" id="summary">
          <span key="home">
            <UserSquad userid={homeUserId} teamid={homeTeamId} />
          </span>
          VS
            <span key="away">
            <UserSquad userid={awayUserId} teamid={awayTeamId} />
          </span>
        </div>
      ];

      if (turn) {
        const formation = squadProxy.convertFormationToArray(turn.user === 1 ? awayFormation : homeFormation, turn.phase);
        children = [
          ...children,
          <Formation key="formation" formation={formation} flip={turn.user === 1} />,
          <div key="main" className="navButton" id="main" onClick={() => {
            nav.go('home');
          }}>
            <img src={HomeImage} />
            <span>Return to Main</span>
          </div>
        ]
      }

      return (
        <section id="match">
          {children}
        </section>
      );
    } else {
      return (
        <section id="match">
          <UserSquad key="home" userid={userProxy.myid()} teamid={squadProxy.mySquad().id} />
        </section>
      );
    }
  }
}