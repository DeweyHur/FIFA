const React = require('react');
const { MaxPhase, PhaseNames } = require('../../game');

const Phase = (props) => {
  const { phase, selected, onClick } = props;
  return (
    <div className={selected ? 'phase selected' : 'phase'} onMouseOver={() => onClick(phase)} >
      {PhaseNames[phase]}
    </div>
  );
}

module.exports = class extends React.Component {
  render() {
    const { phase, onUpdate } = this.props;
    return (
      <div className="phases">
        {[...Array(MaxPhase).keys()].map(index => {
          return <Phase phase={index} selected={phase === index} onClick={onUpdate} />;
        })}
      </div>
    )
  }
};