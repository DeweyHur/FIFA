const React = require('react');
const { MaxPhase, PhaseNames } = require('../../game');

const Phase = (props) => {
  const { phase, selected } = props;
  return (
    <div className={selected ? "phase selected" : "phase"}>
      { PhaseNames[phase] }
    </div>
  ); 
}

module.exports = class extends React.Component {
  render() {
    let { phase } = this.props;
    return (
      <div className="phases">
        { [ ...Array(MaxPhase).keys() ].map(index => {
          return <Phase phase={index} selected={phase === index} />;
        }) }
      </div>
    )
  }
}