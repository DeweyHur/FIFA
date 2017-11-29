const _ = require('lodash');
const Actions = require('../views/actions');
_.keys(Actions).forEach(name => Actions[name] = { ...Actions[name], name });

const MaxSlotPerPhase = 25;
const MaxPhase = 4;
const MaxHeight = 100;
const BoundaryLength = 200;
const Columns = 5;
const Rows = 5;
const MaxTime = 90;
const PhaseNames = ['Buildup', 'Consolidation', 'Incision', 'Finishing'];
const isWithinPhase = (phase, slot) => phase * MaxSlotPerPhase <= slot && slot < (phase + 1) * MaxSlotPerPhase;
const getSlotInfo = (slot, user) => {
  const ret = {
    phase: Math.floor(slot / MaxSlotPerPhase),
    x: slot % Columns,
    y: Math.floor(slot % MaxSlotPerPhase / Columns)
  };
  if (user === 1) {
    ret.x = Columns - ret.x - 1;
    ret.y = Rows - ret.y - 1;
  }
  return ret;
};

module.exports = {
  ...module.exports,
  MaxSlotPerPhase, MaxPhase, MaxTime, Columns, Rows, PhaseNames,
  isWithinPhase, getSlotInfo
};

const getSlotIfValid = (slot, mod) => {
  const src = getSlotInfo(slot);
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
  for (const [slot, weight] of array) {
    totalWeight -= weight;
    if (totalWeight <= picked) return slot;
  }
  console.error('WTF?!');
  throw 'WTF?!';
}

const findMarkman = (slot, opponentFormation, exempt) => {
  const phase = Math.floor(slot / MaxSlotPerPhase);
  const opponentSlot = getOpponentSlot(slot);
  let markman = opponentFormation.getPlayer(opponentSlot);
  if (markman && markman !== exempt) return opponentSlot;

  const getRelatives = (samples) => {
    let relatives = samples
      .map(mod => getSlotIfValid(opponentSlot, mod))
      .filter(x => x && x !== exempt && opponentFormation.getPlayer(x));
    if (!_.isEmpty(relatives)) return _.sample(relatives);
  }

  return getRelatives([[-1, 0], [1, 0], [0, -1], [0, 1]]) ||
    getRelatives([[-2, 0], [-1, -1], [0, -2], [1, -1], [2, 0], [1, 1], [0, 2]]) ||
    _(opponentFormation.data)
      .keys()
      .filter(x => MaxSlotPerPhase * phase <= x && x < MaxSlotPerPhase * (phase + 1))
      .sample();
}

class Formation {
  constructor(data) {
    this.data = data;
    this.players = _(data).values().uniq().value();
  }

  getPlayer(slot) {
    return this.data[slot];
  }

  findNewSlot(prevSlot, phase) {
    return this.findPlayerSlot(this.data[prevSlot], phase);
  }

  findPlayerSlot(playerid, phase) {
    const playerSlot = _.findKey(this.data, (pid, slot) => isWithinPhase(phase, slot) && playerid === pid);
    return Number.parseInt(playerSlot, 10);
  }

  kickoffPlayer() {
    return [27, 26, 28, 32, 31, 33].find(this.getPlayer.bind(this));
  }

  targets(slot, phase, action) {
    if (action.relatives) {
      const src = getSlotInfo(slot);
      return action.relatives
        .map(mod => [getSlotIfValid(slot, mod), mod[2]])
        .filter(([x, w]) => x && this.getPlayer(x));

    } else if (action.absolutes) {
      return action.absolutes
        .map(([x, w]) => [x + phase * MaxSlotPerPhase, w])
        .filter(([x, w]) => x && this.getPlayer(x));

    } else {
      return null;
    }
  }
}

class Turn {
  constructor(homeFormation, awayFormation) {
    this.formations = [new Formation(homeFormation), new Formation(awayFormation)];
    this.scores = [0, 0];
    this.setupKickoff(this, 0);

    /**
     * kickoff|keep|aerial|shooting|keeper|throwing|corner(todo)|linebreaking(todo)
     */
    this.status = 'kickoff';
  }

  toObject() {
    return _.pick(this, ['user', 'phase', 'slot', 'action', 'status', 'markman', 'scores', 'boundary']);
  }

  setupKickoff(turn, user) {
    turn.user = user;
    turn.phase = 1;
    turn.boundary = { x: 0, y: user === 1 ? -20 : 20, h: 80, v: 60 };
    turn.slot = this.formations[user].kickoffPlayer();
  }

  turnover() {
    return {
      phase: MaxPhase - this.phase - 1,
      user: (this.user + 1) % 2,
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
        case 'keeper': Reflect.delete(this.slot); break;
        case 'turnover': newTurn.slot = newTurn.markman; break;
        case 'kickoff':
          this.setupKickoff(newTurn, newTurn.user);
          newTurn.scores = [...this.scores];
          newTurn.scores[this.user] = newTurn.scores[this.user] + 1;
          break;
      }
    } else {
      const targets = (/aerial/).test(action.to) ? [
        ...this.formations[this.user].targets(this.slot, this.phase, action),
        ...this.formations[(this.user + 1) % 2].targets(-getOpponentSlot(this.slot) - 1, MaxPhase - 1 - this.phase, action)
      ] : this.formations[this.user].targets(this.slot, this.phase, action);

      if (targets) {
        if (targets.length === 0) return false;
        newTurn.slot = sampleWithWeight(targets);
      }
      if (newTurn.slot < 0) {
        newTurn.slot = -newTurn.slot - 1;
        newTurn = { ...newTurn, ...newTurn.turnover() };
      }

      newTurn.boundary = { ...this.boundary };
      if (action.distance) {
        const user = newTurn.user || this.user;
        newTurn.boundary.y += Math.sign(user - 0.5) * action.distance;
        newTurn.boundary.y = Math.min(Math.max(-BoundaryLength / 2, newTurn.boundary.y), BoundaryLength);
        newTurn.phase = _.findIndex([-50, 0, 50, 100], line => newTurn.boundary.y * Math.sign(this.user - 0.5) < line);
      }

      if (newTurn.user === undefined && newTurn.phase && newTurn.phase !== this.phase) {
        const phase = newTurn.phase || this.phase;
        const slot = newTurn.slot || this.slot;
        newTurn.slot = this.formations[this.user].findNewSlot(slot, phase);
      }
    }

    if (newTurn.slot !== undefined && newTurn.user === undefined) {
      const src = getSlotInfo(this.slot, this.user);
      const dest = getSlotInfo(newTurn.slot, this.user);
      const direction = -Math.sign(this.user - 1) * (dest.x - src.x);
      newTurn.boundary.x += direction * 5;
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
    const actions = _.values(Actions).filter(action => action.status.some(item => item === turn.status) &&
      (!action.phase || action.phase === turn.phase) &&
      (!action.constraint || action.constraint.some(available => available === turn.slot % MaxSlotPerPhase)));
    const nextAction = _.sample(actions);
    if (/shooting|keeper/.test(turn.status)) console.log('time', time, 'phase', turn.phase, 'slot', turn.slot, 'action', nextAction.name);
    if (!turn.validateAndDo(nextAction)) continue;
    record = { time: time++, ...turn.toObject() }
    history.push(record);
  }
  return history;
}