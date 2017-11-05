const React = require('react');
const squadProxy = require('../proxies/squad');
const userProxy = require('../proxies/user');
const staticdata = require('../staticdata');

module.exports = (props) => {
  const { userid, teamid } = props;
  const user = userProxy.who(userid);
  const squad = squadProxy.whoseSquad(userid);
  const team = staticdata.teams[squad.teamid];
  const teamimage = `https://cdn.sofifa.org/18/teams/${team.id}.png`;
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
}