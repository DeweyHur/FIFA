const React = require('react');
const Loader = require('./loader.jsx');
const squadProxy = require('../proxies/squad');
const userProxy = require('../proxies/user');
const staticdata = require('../staticdata');

module.exports = class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentWillMount() {
    const { userid } = this.props;
    const user = await userProxy.who(userid);
    this.setState({ ...this.state, user });
  }

  render() {
    const { teamid } = this.props;
    const { user } = this.state || {};
    if (teamid && user) {
      const team = staticdata.teams[teamid];
      const teamimage = `https://cdn.sofifa.org/18/teams/${teamid}.png`;
      return (
        <div id="usersquad">
          <img key="emblem" className="emblem" src={teamimage} />
          <span key="name" className="name">{user.name}</span>
          <div key="attributes" className="teamattributes">
            <span className="att">{team.att}</span> |&nbsp;
          <span className="mid">{team.mid}</span> |&nbsp;
          <span className="def">{team.def}</span>
          </div>
        </div>
      );
    } else {
      return (
        <Loader />
      )
    }
  }
}