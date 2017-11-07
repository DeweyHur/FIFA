const React = require('react');
const UserSquad = require('../components/usersquad.jsx');
const Formation = require('../components/formation.jsx');
const nav = require('../components/nav.jsx');
const Player = require('../components/player.jsx');
const matchProxy = require('../proxies/match');
const squadProxy = require('../proxies/squad');
const userProxy = require('../proxies/user');
const staticdata = require('../staticdata');

const HomeImage = "https://image.freepik.com/free-icon/worker-in-front-of-a-computer-monitor_318-47857.jpg";
const TurnSeconds = 2;
const PhaseNames = ['Buildup', 'Consolidation', 'Incision', 'Finishing'];

const Description = (props) => {
  const { turn, prevTurn, formations } = props;
  const description = [];
  const holder = formations[turn.user][turn.slot];

  if (prevTurn) {
    const prevHolder = props.formations[prevTurn.user][prevTurn.slot];
    if (holder === prevHolder) {
      description.push(
        <p key="description">
          <Player key="prevHolder" user={prevTurn.user} player={prevHolder} />
          does
          <b>{turn.action}</b>
        </p>
      )

    } else {
      description.push(
        <p key="description">
          <Player key="prevHolder" user={prevTurn.user} player={prevHolder} />
          does
          <b>{turn.action}</b>
          and 
          <Player key="holder" user={turn.user} player={holder} />
          is keeping the ball.
        </p>
      );
    }

  } else {
    description.push(
      <p key="description">
        KickOff!
        <Player key="holder" user={turn.user} player={holder} /> is keeping the ball.
      </p>
    );
  }
  return description;
}

module.exports = class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentWillMount() {
    const match = await matchProxy.make();
    this.setState({ ...this.state, match });

    let prevTurn;
    for (const turn of match.history) {
      await new Promise(resolve => setTimeout(() => resolve(), TurnSeconds * 1000));
      console.log('Setting turn', turn);
      this.setState({ ...this.state, turn, prevTurn });
      prevTurn = turn;
    }
  }

  render() {
    const { match, turn, prevTurn } = this.state;
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
        const description = [];
        const formation = squadProxy.convertFormationToArray(turn.user === 1 ? awayFormation : homeFormation, turn.phase);
        children = [
          ...children,
          <div id="phase">
            {PhaseNames[turn.phase]} Phase {turn.phase}
          </div>,
          <Formation key="formation" formation={formation} flip={turn.user === 1} />,
          <Description key="description" turn={turn} prevTurn={prevTurn} formations={[homeFormation, awayFormation]} />,
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