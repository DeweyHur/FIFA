const _ = require('lodash');
const React = require('react');
const UserSquad = require('../components/usersquad.jsx');
const Formation = require('../components/formation.jsx');
const nav = require('../components/nav.jsx');
const Phases = require('../components/phases.jsx');
const Player = require('../components/player.jsx');
const Playground = require('../components/playground.jsx');
const matchProxy = require('../proxies/match');
const squadProxy = require('../proxies/squad');
const userProxy = require('../proxies/user');
const staticdata = require('../staticdata');
const { MaxPhase, MaxTime, PhaseNames } = require('../../game');

const HomeImage = "https://image.freepik.com/free-icon/worker-in-front-of-a-computer-monitor_318-47857.jpg";
const SlideShowSeconds = 2;
const SecondsPerTime = 90 * 60 / MaxTime;

const Description = (props) => {
  const { matchend, turn, prevTurn, formations } = props;
  const description = [];

  if (matchend) {
    description.push(
      <p key="matchend">
        Match ends! Final score is &nbsp;
        <span className="hometeam">
          {prevTurn.scores[0]}
        </span>
        :
        <span className="awayteam">
          {prevTurn.scores[1]}
        </span>
        .
      </p>
    );
  }
  else if (_.isObjectLike(turn)) {
    const holder = /keeper/.test(turn.status) ? formations[turn.user].GK : formations[turn.user][turn.slot];

    if (_.isObjectLike(prevTurn)) {
      const prevHolder = /keeper/.test(prevTurn.status) ? formations[prevTurn.user].GK : formations[prevTurn.user][prevTurn.slot];
      const markman = formations[(prevTurn.user + 1) % 2][prevTurn.markman];

      if (/throwing/.test(turn.status)) {
        description.push(
          <p key="clear">
            <Player key="markman" user={(prevTurn.user + 1) % 2} player={markman} />
            &nbsp; cleared the ball.
          </p>
        );
      }

      if (/turnover/.test(turn.status)) {
        description.push(
          <p key="turnover">
            <Player key="holder" user={turn.user} player={holder} />
            &nbsp; does &nbsp;
            <b>{turn.action}</b>
            &nbsp; from &nbsp;
            <Player key="prevHolder" user={prevTurn.user} player={prevHolder} />
          </p>
        );

      } else {
        description.push(
          <p key="prevAction">
            <Player key="prevHolder" user={prevTurn.user} player={prevHolder} />
            &nbsp; does &nbsp;
            <b>{turn.action}</b>
            .
        </p>
        );

        if (prevHolder !== holder) {
          description.push(
            <p key="action">
              <Player key="holder" user={turn.user} player={holder} />
              &nbsp; is keeping the ball.
          </p>
          );
        }
      }
    }
    else {
      description.push(
        <p key="kickoff">
          KickOff! &nbsp;
          <Player key="holder" user={turn.user} player={holder} /> is keeping the ball.
        </p>
      );
    }
  }
  return (
    <div id="description">
      {description}
    </div>
  );
}

module.exports = class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentWillMount() {
    const match = await matchProxy.make();
    this.setState({ ...this.state, match });
    
    for (const turn of match.history) {
      await new Promise(resolve => this.timeout = setTimeout(() => resolve(), SlideShowSeconds * 1000));
      console.log('Setting turn', turn);
      this.setState({ ...this.state, turn });
    }
    await new Promise(resolve => this.timeout = setTimeout(() => resolve(), SlideShowSeconds * 1000));
    console.log('Finalize turn');
    this.setState({ ...this.state, matchend: true });
  }

  render() {
    const { match, matchend, turn, prevTurn } = this.state;
    if (match) {
      const { homeUserId, homeTeamId, homeFormation, awayUserId, awayTeamId, awayFormation } = match;
      let children = [
        <div key="summary" id="summary">
          <UserSquad userid={homeUserId} teamid={homeTeamId} />
          <span key="homescore" className="hometeam" >
            {turn ? turn.scores[0] : 0}
          </span>
          :
          <span key="awayscore" className="awayteam" >
            {turn ? turn.scores[1] : 0}
          </span>
          <UserSquad userid={awayUserId} teamid={awayTeamId} />
        </div>
      ];

      if (turn) {
        const description = [];
        const formation = squadProxy.convertFormationToArray(turn.user === 1 ? awayFormation : homeFormation, turn.phase);
        const keeper = turn.user === 1 ? awayFormation.GK : homeFormation.GK;

        children = [
          ...children,
          <div key="time" id="time">
            (
            {Math.floor(SecondsPerTime * turn.time / 60).toLocaleString('en', { minimumIntegerDigits: 2 })}
            :
            {((SecondsPerTime * turn.time) % 60).toLocaleString('en', { minimumIntegerDigits: 2 })}
            )
          </div>,
          <Phases key="phases" phase={turn.phase} />,
          <Playground key="playground" turn={turn} prevTurn={prevTurn} matchend={matchend} formations={[homeFormation, awayFormation]} />,
          <Description key="description" turn={turn} prevTurn={prevTurn} matchend={matchend} formations={[homeFormation, awayFormation]} />,
          <div key="main" className="navButton" id="navHome" onClick={() => {
            if (this.timeout)
              clearTimeout(this.timeout);
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