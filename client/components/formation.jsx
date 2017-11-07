const React = require('react');
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

module.exports = class extends React.Component {
  constructor(props) {
    super(props);
    this.handleChildClick = this.handleChildClick.bind(this);
  }

  handleChildClick(item) {
    if (this.currentFocus) {
      this.currentFocus.setState({ ...this.state, selected: undefined });
      delete this.currentFocus;
    }
    this.currentFocus = item;
  }

  render() {
    const { formation } = this.props;

    return (
      <div className="formation">
        {formation.map((slot, index) => {
          return <Slot key={index} index={index} slot={slot} onClick={this.handleChildClick} />;
        })}
      </div>
    );
  }  
};