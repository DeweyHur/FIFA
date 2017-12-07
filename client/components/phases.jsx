const _ = require('lodash');
const React = require('react');
const { MaxPhase, PhaseNames } = require('../../game');

const Phase = (props) => {
  const { phase, selected, onClick = _.noop } = props;
  return (
    <div className={selected ? 'phase selected' : 'phase'} onClick={() => onClick(phase)} >
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