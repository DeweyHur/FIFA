const React = require('react');
const Loader = require('../components/loader.jsx');
const UserSquad = require('../components/usersquad.jsx');
const matchProxy = require('../proxies/match');
const squadProxy = require('../proxies/squad');
const userProxy = require('../proxies/user');

module.exports = class extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentWillMount() {
    const match = await matchProxy.make();
    this.setState({ ...(this.state || {}), match });
  }

  render() {
    const { match } = this.state || {};
    if (match) {
      const { homeUserId, homeTeamId, awayUserId, awayTeamId } = match;
      return (
        <section id="matchmaking">
          <UserSquad key="home" userid={homeUserId} teamid={homeTeamId} />
          <div key="vs" className="vs">VS</div>
          <UserSquad key="away" userid={awayUserId} teamid={awayTeamId} />
        </section>
      );
    } else {
      return (
        <section id="matchmaking">
          <UserSquad key="home" userid={userProxy.myid()} teamid={squadProxy.mySquad().id} />
          <div key="vs" className="vs">VS</div>
          <Loader key="away" />
        </section>
      );
    }
  }
}