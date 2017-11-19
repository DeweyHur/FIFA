const _ = require('lodash');
const React = require('react');
const Formation = require('../components/formation.jsx');
const Phases = require('../components/phases.jsx');

module.exports = class extends React.Component {
  constructor(props) {
    super(props);
    this.handlePhaseUpdate = this.handlePhaseUpdate.bind(this);
  }

  handlePhaseUpdate(phase) {
    this.setState({ ...this.state, phase });
  }
  
  render() {
    const { user, formation, keeper } = this.props;
    const phase = _.get(this.state, 'phase') || _.get(this.props, 'phase');
    return (
      <div className="tactics">
        <Phases key="phases" phase={phase} onUpdate={this.handlePhaseUpdate} />
        <Formation key="formation" formation={formation} phase={phase} user={user} keeper={keeper} />
      </div>
    );
  }
}; 