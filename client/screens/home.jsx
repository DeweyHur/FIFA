const Papa = require('papaparse');
const React = require('react');
const nav = require('../components/nav.jsx');
const UserSquad = require('../components/usersquad.jsx');
const squadProxy = require('../proxies/squad');
const userProxy = require('../proxies/user');
const staticdata = require('../staticdata');

class Slot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { index, slot, onClick } = this.props;
    const image = `https://cdn.sofifa.org/18/players/${slot}.png`;
    if (slot) {
      const player = staticdata.players[slot];
      return (
        <div className="slot occupied" onMouseOver={() => {
          // nav.go('playerlist', { slot, index });
        }}>
          <div className="ovr">{player.ovr}</div>
          <div><img src={image} /></div>
          <div>{player.lastname[0]} .{player.firstname}</div>
        </div>
      );

    } else {
      return (
        <div className="slot empty">
        </div>
      );
    }
  }
}

const DuelImage = "https://image.flaticon.com/icons/svg/53/53195.svg";
const TeamSelectionImage = "https://d30y9cdsu7xlg0.cloudfront.net/png/20290-200.png";

module.exports = class extends React.Component {
  constructor(props) {
    super(props);
    this.handleChildClick = this.handleChildClick.bind(this);
    this.state = { phase: 0 };
  }

  handleChildClick(item) {
    if (this.currentFocus) {
      this.currentFocus.setState({ ...this.state, selected: undefined });
      delete this.currentFocus;
    }
    this.currentFocus = item;
  }

  render() {
    const { phase } = this.state;
    const userid = userProxy.myid();
    const myFormation = squadProxy.myFormation(phase);
    const mySquad = squadProxy.mySquad();

    return (
      <section id="home">
        <UserSquad userid={userid} teamid={mySquad.id} />
        <div id="formation">
          {myFormation.map((slot, index) => {
            return <Slot key={index} index={index} slot={slot} onClick={this.handleChildClick} />;
          })}
        </div>
        <div id="actions">
          <div id="buttons">
            <div className="button" id="duel" onClick={() => {
              nav.go('matchmaking');
            }}>
              <img src={DuelImage} />
              <span>Random Match</span>
            </div>
            <div className="button" id="team" onClick={() => {
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

