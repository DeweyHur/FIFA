const React = require('react');
const Papa = require('papaparse');
const Container = require('../components/container.jsx');

class Team extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { team } = this.props;
    const { selected } = this.state;
    const imgsrc = `https://cdn.sofifa.org/18/teams/${team.id}.png`;
    const className = selected ? "team selected" : "team";
    let children = [
      <img key="image" className="emblem" src={imgsrc} alt={team.name} />,
      <div key="name">{team.name}</div>
    ];
    if (selected) {
      children = [ ...children, 
        <div key="attributes" className="attributes">
          <span className="att">{team.att}</span> |&nbsp;
          <span className="mid">{team.mid}</span> |&nbsp;
          <span className="def">{team.def}</span>
        </div>,
        <img key="choose" className="getit" src="http://www.cormackcarr.com/wp-content/uploads/2013/07/Get-it-now-button.jpg" onClick={() => {
          confirm(`Do you want to own ${team.name}?`);
        }} />
      ];
    }

    return (
      <div className={className} onMouseOver={() => {
        this.props.onClick(this);
        this.setState({ ...this.state, selected: true });
      }}>
        {children}
      </div>
    );
  }
}

module.exports = class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleChildClick = this.handleChildClick.bind(this);
  }

  componentWillMount() {
    Papa.parse(`${window.location.origin}/team.csv`, {
      header: true,
      dynamicTyping: true,
      download: true,
      complete: results => {
        this.setState({ ...this.state, data: results.data });
      }
    });
  }

  handleChildClick(item) {
    if (this.currentFocus) {
      this.currentFocus.setState({ ...this.state, selected: undefined });
      delete this.currentFocus;
    }
    this.currentFocus = item;
  }

  render() {
    const children = this.state.data || [];
    return (
      <section id="team">
        {_.map(children, team => {
          return <Team key={team.id} team={team} onClick={this.handleChildClick} />;
        })}
      </section>
    );
  }
};