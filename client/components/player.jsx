const React = require('react');
const staticdata = require('../staticdata');

module.exports = (props) => {
  const { user, player } = props;
  const { lastname, firstname, number }= staticdata.players[player];
  return (
    <span className={user === 1 ? "awayteam" : "hometeam"}>
      {lastname[0]}. {firstname} ({number}) 
    </span>
  );
}

