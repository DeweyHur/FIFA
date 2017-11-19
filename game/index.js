const _ = require('lodash');
const Actions = require('../views/actions');
_.keys(Actions).forEach(name => Actions[name] = { ...Actions[name], name });

const KickoffOrder = [2, 1, 3, 7, 6, 8];
const MaxSlotPerPhase = 25;
const MaxPhase = 4;
const MaxDistance = 20;
const Columns = 5;
const Rows = 5;
const MaxTime = 180;
const PhaseNames = ['Buildup', 'Consolidation', 'Incision', 'Finishing'];

module.exports = { ...module.exports, MaxSlotPerPhase, MaxPhase, MaxDistance, MaxTime, Columns, Rows, PhaseNames };

const getSlotIfValid = (slot, mod) => {
  const src = {
    phase: Math.floor(slot / MaxSlotPerPhase),
    x: slot % Columns,
    y: Math.floor((slot % MaxSlotPerPhase) / Columns)
  };
  const x = src.x + mod[0];
  const y = src.y + mod[1];
  const newSlot = src.phase * MaxSlotPerPhase + x + y * Columns;
  if (0 <= x && x < Columns && 0 <= y && y < Rows) {
    return newSlot;
  } else {
    return null;
  }
}
const getOpponentSlot = (slot) => MaxSlotPerPhase * MaxPhase - 1 - slot;

/**
 * 
 * @param {*} array [ ...[value, weight] ]
 */
const sampleWithWeight = (array) => {
  let totalWeight = 0;
  for (const [slot, weight] of array) {
    totalWeight += weight;
    if (weight === 0) return slot;
  }
  const picked = _.random(0, totalWeight - 1, false);
  let count = 0;
  for (const [slot, weight] of array) {
    totalWeight -= weight;
    if (totalWeight <= picked) return slot;
  }
  console.error("WTF?!");
}

const findMarkman = (slot, opponentFormation, exempt) => {
  const phase = Math.floor(slot / MaxSlotPerPhase);
  const opponentSlot = getOpponentSlot(slot);
  let markman = opponentFormation.getPlayer(opponentSlot);
  if (markman && markman !== exempt) return opponentSlot;

  const getRelatives = (samples) => {
    let relatives = samples
      .map(mod => getSlotIfValid(opponentSlot, mod))
      .filter(slot => slot && slot !== exempt && opponentFormation.getPlayer(slot));
    if (!_.isEmpty(relatives)) return _.sample(relatives);
  }

  return getRelatives([[-1, 0], [1, 0], [0, -1], [0, 1]]) ||
    getRelatives([[-2, 0], [-1, -1], [0, -2], [1, -1], [2, 0], [1, 1], [0, 2]]) ||
    _(opponentFormation.data)
      .keys()
      .filter(slot => MaxSlotPerPhase * phase <= slot && slot < MaxSlotPerPhase * (phase + 1))
      .sample();
}

class Formation {
  constructor(data) {
    this.data = data;
  }

  getPlayer(slot) {
    return this.data[slot];
  }

  findSlot(prevSlot, phase) {
    const playerid = this.data[prevSlot];
    for (const slot in this.data) {
      const pid = this.data[slot];
      if (MaxSlotPerPhase * phase <= slot && slot < MaxSlotPerPhase * (phase + 1) && playerid === pid)
        return Number.parseInt(slot);
    }
    return null;
  }

  kickoffPlayer() {
    return [27, 26, 28, 32, 31, 33].find(this.getPlayer.bind(this));
  }

  targets(slot, phase, action) {
    if (action.relatives) {
      const src = {
        x: slot % Columns,
        y: Math.floor(slot / Columns) % MaxSlotPerPhase
      };
      return action.relatives
        .map(mod => [getSlotIfValid(slot, mod), mod[2]])
        .filter(([slot, w]) => slot && this.getPlayer(slot));
    }
    else if (action.absolutes) {
      return action.absolutes
        .map(([slot, w]) => [slot + phase * MaxSlotPerPhase, w])
        .filter(([slot, w]) => slot && this.getPlayer(slot));
    }
    else {
      return null;
    }
  }
}

class Turn {
  constructor(homeFormation, awayFormation) {
    this.user = 0;
    this.phase = 1;
    this.distance = 0;
    this.formations = [new Formation(homeFormation), new Formation(awayFormation)];
    this.slot = this.formations[this.user].kickoffPlayer();
    this.scores = [0, 0];
    /**
     * kickoff|keep|aerial|shooting|keeper|throwing|corner(todo)|linebreaking(todo)
     */
    this.status = 'kickoff';
  }

  toObject() {
    return _.pick(this, ['user', 'phase', 'distance', 'slot', 'action', 'status', 'markman', 'scores']);
  }

  turnover() {
    return {
      phase: MaxPhase - this.phase - 1,
      user: (this.user + 1) % 2,
      distance: MaxDistance - this.distance
    };
  }

  validateAndDo(action) {
    let newTurn = { action: action.name, status: action.to };
    if (_.isNumber(this.slot)) {
      const prevMarkman = this.formations[(this.user + 1) % 2].getPlayer(this.markman);
      newTurn.markman = findMarkman(this.slot, this.formations[(this.user + 1) % 2], prevMarkman);
      if (!_.isNumber(newTurn.markman)) return false;
    }

    if (/kickoff|keeper|turnover/.test(action.to)) {
      newTurn = { ...newTurn, ...this.turnover() }
      switch (action.to) {
        case 'keeper': delete this.slot; break;
        case 'turnover': newTurn.slot = newTurn.markman; break;
        case 'kickoff':
          newTurn.slot = this.formations[newTurn.user].kickoffPlayer();
          newTurn.scores = [ ...this.scores ];
          newTurn.scores[this.user] = newTurn.scores[this.user] + 1;
          break;
      }
    }
    else {
      let targets;
      if (/aerial/.test(action.to)) {
        targets = [
          ...this.formations[this.user].targets(this.slot, this.phase, action),
          ...this.formations[(this.user + 1) % 2].targets(-getOpponentSlot(this.slot) - 1, MaxPhase - 1 - this.phase, action)
        ];
      }
      else {
        targets = this.formations[this.user].targets(this.slot, this.phase, action);
      }
      if (targets) {
        if (targets.length === 0) return false;
        newTurn.slot = sampleWithWeight(targets);
      }
      if (newTurn.slot < 0) {
        newTurn.slot = -newTurn.slot - 1;
        newTurn = { ...newTurn, ...newTurn.turnover() };
      }

      if (action.distance) {
        newTurn.distance = this.distance + action.distance;
        if (newTurn.distance < 0) {
          if (this.phase > 0) {
            newTurn.phase = this.phase - 1;
            newTurn.distance += MaxDistance;
          }
          else {
            newTurn.distance = 0;
          }
        }
        else if (newTurn.distance > MaxDistance) {
          if (this.phase < MaxPhase - 1) {
            newTurn.phase = this.phase + 1;
            newTurn.distance -= MaxDistance;
          }
          else {
            newTurn.distance = MaxDistance;
          }
        }
      }

      if (newTurn.user == null && newTurn.phase && newTurn.phase !== this.phase) {
        const phase = newTurn.phase || this.phase;
        const slot = newTurn.slot || this.slot;
        newTurn.slot = this.formations[this.user].findSlot(slot, phase);
      }
    }

    for (const param in newTurn) {
      this[param] = newTurn[param];
    }
    return true;
  }
}

module.exports.evaluate = (homeFormation, awayFormation) => {
  const turn = new Turn(homeFormation, awayFormation);
  let time = 0;
  let record = { time: time++, ...turn.toObject() };
  const history = [record];

  while (time < MaxTime || turn.phase === MaxPhase - 1) {
    const actions = _.values(Actions).filter(action => {
      return action.status.some(item => item === turn.status) &&
        (!action.phase || action.phase === turn.phase) &&
        (!action.constraint || action.constraint.some(available => {
          return available === turn.slot % MaxSlotPerPhase;
        }));
    });
    const nextAction = _.sample(actions);
    if (/shooting|keeper/.test(turn.status))
      console.log("time", time, "phase", turn.phase, "slot", turn.slot, "action", nextAction.name);
  if (!turn.validateAndDo(nextAction)) continue;
    record = { time: time++, ...turn.toObject() }
    history.push(record);
  }
  return history;
}