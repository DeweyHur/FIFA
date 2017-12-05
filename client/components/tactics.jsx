const _ = require('lodash');
const React = require('react');
const { ViewFormation } = require('../components/formation.jsx');
const Phases = require('../components/phases.jsx');

module.exports = class extends React.Component {
  constructor(props) {
    super(props);
    this.handlePhaseUpdate = this.handlePhaseUpdate.bind(this);
  }

  handlePhaseUpdate(phase) {
    if (this.props.editable === true) {
      this.setState({ ...this.state, phase });
    }
  }

  render() {
    const { teamid, formation } = this.props;
    const phase = _.get(this.state, 'phase') || _.get(this.props, 'phase');

    return (
      <div className="tactics">
        <Phases key="phases" phase={phase} onUpdate={this.handlePhaseUpdate} />
        <ViewFormation key="formation" formation={formation} phase={phase} teamid={teamid} />
      </div>
    );
  }
}