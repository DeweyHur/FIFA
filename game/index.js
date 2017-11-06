const _ = require('lodash');
const Actions = _.keys(require('../views/actions'))
  .map(name => Actions[name] = { ...Actions[name], name });

const KickoffOrder = [2, 1, 3, 7, 6, 8];
const SlotsPerPhase = 25;
const DistanceMax = 20;
const Columns = 5;
const Rows = 5;
const TotalPhase = 4;
const Actions = _.flatMap(Skill, (type, skills) => _.map(_.keys(skills), skill => `${type}.${skill}`));

class Formation {
  constructor(data) {
    this.data = data;
  }

  kickoffPlayer() {
    const Phase = 1;
    return [2, 1, 3, 7, 6, 8].find(slot => Phase * SlotsPerPhase + slot);
  }

  targets(slot, action) {
    const src = {
      phase: Math.floor(slot / SlotsPerPhase),
      x: slot % Columns,
      y: Math.floor(slot / Columns) % SlotsPerPhase
    };

    if (action.relatives) {
      targets = _(action.relatives)
        .map(([x, y, w]) => [x + src.x, y + src.y, w])
        .filter(([x, y, w]) => (
          0 <= x && x <= Columns &&
          0 <= y && y <= Rows
        ))
        .map(([x, y, w]) => {
          const slot = src.phase * SlotsPerPhase + x * Columns + y;
          this.
          if (this.formations[this.side])
          return [slot, w];
        })
        .filter(([slot, w]) => slot)
        .value();

    } else if (action.absolutes) {
      targets = _(action.absolutes)
        .map(([slot, w]) => {
          const slot = src.phase * SlotsPerPhase + slot;
          return [slot, w];
        })
        .filter(([slot, w]) => slot)
        .value();
    }

    if (!_.isEmpty(targets)) {
      return _.sample(targets);
    } else {
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
    this.ball = this.formations[user].kickoffPlayer();
    /**
     * kickoff|keep|aerial|shooting|keeper|throwing|corner(todo)|linebreaking(todo)
     */
    this.status = 'kickoff';
  }

  toObject() {
    return _.pick(this, ['user', 'phase', 'distance', 'ball', 'action', 'status']);
  }



  relativeSlot(slot, mod) {
    const src = {
      phase: Math.floor(slot / SlotsPerPhase),
      x: slot % Columns,
      y: Math.floor(slot / Columns) % SlotsPerPhase
    };
    const x = x + mod[0];
    const y = y + mod[1];
    if (0 <= x && x <= Columns && 0 <= y && y <= Rows) {
      return src.phase + x + y * Columns;
    } else {
      return null;
    }
  }

  findMarkman(slot, exempt) {
    const opponentSlot = SlotsPerPhase - (slot % SlotsPerPhase) + Math.floor(slot / SlotsPerPhase);
    const opponentFormation = this.formations[(this.user + 1) % 2];
    let markman = opponentFormation[opponentSlot];
    if (markman && markman !== exempt) return markman;

    let samples = [[-1,0],[1,0],[0,-1],[0,1]]
      .map(mod => this.relativeSlot(opponentSlot, mod))
      .filter(slot => slot && slot !== exempt);
    if (!_.isEmpty(samples)) return _.sample(samples);
    
    samples = [[-2,0],[-1,-1],[0,-2],[1,-1],[2,0],[1,1],[0,2]]
      .map(mod => this.relativeSlot(opponentSlot, mod))
      .filter(slot => slot && slot !== exempt);
    if (!_.isEmpty(samples)) return _.sample(samples);

    return null;
}

  do(action) {
    this.markman = this.findMarkman(this.ball);

    if (/keeper|turnover/.test(action.to)) {
      this.phase = TotalPhase - this.phase;
      this.user = (this.user + 1) % 2;
      this.distance = DistanceMax - this.distance;
      if (/keeper/.test(action.to)) {
        delete this.ball;
      } else {
        this.ball = this.markman;
      }

    } else {
      this.distance += action.distance;
      if (distance < 0) this.phase = Math.max(this.phase - 1, 0);
      else if (distance > 20) this.phase = Math.min(this.phase + 1, 3);  

      
      
      if (/aerial/.test(action.to)) {
        
      }  
    }
    

    this.action = action.name;
    this.status = action.to;
    this.ball = this.formations[this.user].target(this.ball, action);

    



  }
}

module.exports = class {
  constructor(staticdata) {
  }

  availableActions(turn) {
    return _(this.Actions)
      .values()
      .filter(action => _.find(action, { status: turn.status }));
  }

  evaluate(match) {
    const { homeFormation, awayFormation } = match;
    const turn = new Turn(homeFormation, awayFormation);
    const scores = [0, 0];
    const history = [{ time: 0, ...turn.toObject(), scores: scores.slice() }];

    for (let time = 1; time < 100 && turn.phase !== 3; ++time) {
      const actions = this.availableActions(turn);
      const nextAction = _.sample(actions);
      turn.do(nextAction);
      history.push({ time, ...turn.toObject(), scores: scores.slice() });
    }

    console.log(history.join('\n'));
    return history;
  }
}