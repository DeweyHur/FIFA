const _ = require('lodash');
const Actions = require('../views/actions');
_.keys(Actions).forEach(name => Actions[name] = { ...Actions[name], name });

const KickoffOrder = [2, 1, 3, 7, 6, 8];
const SlotsPerPhase = 25;
const DistanceMax = 20;
const Columns = 5;
const Rows = 5;
const TotalPhase = 4;

const getSlotIfValid = (slot, mod) => {
  const src = {
    phase: Math.floor(slot / SlotsPerPhase),
    x: slot % Columns,
    y: Math.floor((slot % SlotsPerPhase) / Columns)
  };
  const x = src.x + mod[0];
  const y = src.y + mod[1];
  const newSlot = src.phase * SlotsPerPhase + x + y * Columns;
  if (0 <= x && x < Columns && 0 <= y && y < Rows) {
    return newSlot;
  } else {
    return null;
  }
}
const getOpponentSlot = (slot) => SlotsPerPhase - 1 - (slot % SlotsPerPhase) + Math.floor(slot / SlotsPerPhase) * SlotsPerPhase;

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
  const picked = _.random(0, totalWeight, false);
  let count = 0;
  for (const [slot, weight] of array) {
    totalWeight -= weight;
    if (totalWeight <= picked) return slot;
  }
}

const findMarkman = (slot, opponentFormation, exempt) => {
  const phase = Math.floor(slot / SlotsPerPhase);
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
    getRelatives([[-2, 0], [-1, -1], [0, -2], [1, -1], [2, 0], [1, 1], [0, 2]]);
}

class Formation {
  constructor(data) {
    this.data = data;
  }

  getPlayer(slot) {
    return this.data[slot];
  }

  kickoffPlayer() {
    return [27, 26, 28, 32, 31, 33].find(this.getPlayer.bind(this));
  }

  targets(slot, action) {
    const src = {
      phase: Math.floor(slot / SlotsPerPhase),
      x: slot % Columns,
      y: Math.floor(slot / Columns) % SlotsPerPhase
    };

    if (action.relatives) {
      return action.relatives
        .map(mod => [getSlotIfValid(slot, mod), mod[2]])
        .filter(([slot, w]) => slot && this.getPlayer(slot));
    }
    else if (action.absolutes) {
      return action.absolutes
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
    /**
     * kickoff|keep|aerial|shooting|keeper|throwing|corner(todo)|linebreaking(todo)
     */
    this.status = 'kickoff';
  }

  toObject() {
    return _.pick(this, ['user', 'phase', 'distance', 'slot', 'action', 'status']);
  }

  turnover() {
    this.phase = TotalPhase - this.phase - 1;
    this.user = (this.user + 1) % 2;
    this.distance = DistanceMax - this.distance;
  
  }

  do(action) {
    this.markman = findMarkman(this.slot, this.formations[(this.user + 1) % 2], this.markman);

    if (/keeper|turnover/.test(action.to)) {
      this.turnover();
      if (/keeper/.test(action.to)) {
        delete this.slot;
      } else {
        this.slot = this.markman;
      }
    }
    else {
      if (action.distance) {
        this.distance += action.distance;
        if (this.distance < 0) this.phase = Math.max(this.phase - 1, 0);
        else if (this.distance > 20) this.phase = Math.min(this.phase + 1, 3);
      }

      let targets;
      if (/aerial/.test(action.to)) {
        targets = [
          ...this.formations[this.user].targets(this.slot, action),
          ...this.formations[(this.user + 1) % 2].targets(-getOpponentSlot(this.slot) - 1, action)
        ];
      }
      else {
        targets = this.formations[this.user].targets(this.slot, action);
      }
      if (targets) this.slot = sampleWithWeight(targets);
      if (this.slot < 0) {
        this.slot = -this.slot - 1;
        this.turnover();
      }
    }
    this.action = action.name;
    this.status = action.to;
  }
}

module.exports = (homeFormation, awayFormation) => {
  const turn = new Turn(homeFormation, awayFormation);
  const scores = [0, 0];
  let record = { time: 0, ...turn.toObject(), scores: scores.slice() };
  console.log(record);
  const history = [record];

  for (let time = 1; time < 100 || turn.phase !== 3; ++time) {
    const actions = _.values(Actions).filter(action => {
      return action.status.some(item => item === turn.status) && (!action.phase || action.phase === turn.phase);
    });
    const nextAction = _.sample(actions);
    turn.do(nextAction);
    record = { time, ...turn.toObject(), scores: scores.slice() }
    console.log(record);
    history.push(record);
  }
  return history;
}