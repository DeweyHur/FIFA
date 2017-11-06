module.exports = {
  "BackPass": {
    "status": ["turnover", "ground", "kickoff"],
    "to": "ground",
    "distance": 2,
    "weight": {
      "shortpassing": 1
    },
    "relatives": [
      [-1, 1, 5], [0, 1, 4], [1, 1, 4],
      [-2, 2, 2], [-1, 2, 3], [0, 2, 3], [1, 2, 3], [2, 2, 2]
    ],
  },
  "ShortPass": {
    "status": ["turnover", "ground"],
    "to": "ground",
    "weight": {
      "shortpassing": 1
    },
    "relatives": [
      [-1, -1, 2], [0, -1, 1], [1, -1, 2],
      [-1, 0, 4], [1, 0, 4],
      [-1, 1, 4], [1, 1, 4]
    ]
  },
  "HeadingPass": {
    "status": ["aerial"],
    "to": "aerial",
    "weight": {
      "heading": 1
    },
    "relatives": [
      [-1, -1, 1], [0, -1, 1], [1, -1, 1],
      [-1, 0, 1], [1, 0, 1],
      [-1, 1, 1], [0, 1, 1], [1, 1, 1]
    ]
  },
  "Keep": {
    "status": ["aerial"],
    "to": "ground",
    "weight": {
      "ballcontrol": 1
    },
  },
  "LeftSidePass": {
    "status": ["turnover", "ground"],
    "to": "ground",
    "weight": {
      "longpassing": 1
    },
    "constraint": [12, 13, 17, 18],
    "absolutes": [[10, 5], [15, 5], [20, 5]]
  },
  "RightSidePass": {
    "status": ["turnover", "ground"],
    "to": "ground",
    "weight": {
      "longpassing": 1
    },
    "constraint": [11, 12, 16, 17],
    "absolutes": [[14, 5], [19, 5], [24, 5]]
  },
  "GrabPass": {
    "status": ["keeper"],
    "to": "ground",
    "weight": {
      "handling": 1
    },
    "absolutes": [
      [16, 3], [17, 3], [18, 3],
      [20, 3], [21, 3], [22, 3], [23, 3], [24, 3]
    ]
  },
  "GoalKick": {
    "status": ["keeper"],
    "to": "aerial",
    "weight": {
      "longpassing": 1
    },
    "absolutes": [
      [0, 4], [1, 3], [2, 2], [3, 3], [4, 4],
      [5, 4], [6, 3], [7, 2], [8, 3], [9, 4]
    ]
  },
  "GrabKick": {
    "status": ["keeper"],
    "to": "aerial",
    "weight": {
      "longpassing": 1
    },
    "absolutes": [
      [0, 2], [1, 3], [2, 4], [3, 3], [4, 2],
      [5, 2], [6, 3], [7, 4], [8, 3], [9, 2]
    ]
  },
  "Punching": {
    "status": ["shooting"],
    "to": "aerial",
    "weight": {
      "reflexes": 1
    },
    "absolutes": [
      [16, 3], [17, 3], [18, 3],
      [21, 3], [22, 3], [23, 3]
    ]
  },
  "HighCross": {
    "status": ["ground"],
    "to": "aerial",
    "constraint": [0, 4, 5, 9],
    "phase": 3,
    "weight": {
      "crossing": 1
    },
    "absolutes": [
      [1, 3], [2, 3], [3, 3],
      [6, 3], [7, 3], [8, 3]
    ]
  },
  "LowCross": {
    "status": ["ground"],
    "to": "ground",
    "constraint": [0, 4, 5, 9],
    "phase": 3,
    "weight": {
      "crossing": 1
    },
    "absolutes": [
      [1, 3], [2, 3], [3, 3],
      [6, 3], [7, 3], [8, 3]
    ]
  },
  "Advance": {
    "status": ["ground"],
    "to": "ground",
    "weight": {
      "dribbling": 1
    },
    "cost": 2,
    "distance": 3
  },

  "Sprint": {
    "status": ["ground"],
    "to": "ground",
    "weight": {
      "accel": 1
    },
    "cost": 8,
    "distance": 5
  },
  "HeadingShot": {
    "status": ["aerial"],
    "to": "shooting",
    "weight": {
      "heading": 1
    },
    "cost": 2,
    "phase": 3,
    "constraint": [1, 2, 3]
  },
  "VolleyShot": {
    "status": ["ground"],
    "to": "shooting",
    "weight": {
      "finishing": 1
    },
    "cost": 2,
    "phase": 3,
    "constraint": [1, 2, 3]
  },
  "LongShot": {
    "status": ["turnover", "ground"],
    "to": "shooting",
    "cost": 2,
    "weight": {
      "shotpower": 1
    },
    "phase": 3,
    "constraint": [6, 7, 8]
  },
  "Grab": {
    "status": ["shooting"],
    "to": "keeper",
    "weight": {
      "diving": 1
    },
  },
  "ClearToLeft": {
    "status": ["ground", "aerial"],
    "to": "throwing",
    "weight": {
      "standingtackle": -1,
    },
    "constraint": [0, 1, 5, 6, 10, 11, 15, 16, 20, 21],
    "absolutes": [[20, 0], [15, 0], [10, 0], [5, 0], [0, 0]]
  },
  "ClearToRight": {
    "status": ["ground", "aerial"],
    "to": "ground",
    "weight": {
      "standingtackle": -1
    },
    "constraint": [3, 4, 8, 9, 13, 14, 18, 19, 23, 24],
    "absolutes": [[24, 0], [19, 0], [14, 0], [9, 0], [4, 0]]
  },
  "Steal": {
    "status": ["ground"],
    "to": "turnover",
    "weight": {
      "marking": -1
    },
  },
  "LeftShortThrow": {
    "status": ["throwing"],
    "to": "ground",
    "weight": {
      "handling": 1
    },
    "relatives": [
      [0, -2, 1],
      [0, -1, 2], [1, -1, 1],
      [1, 0, 2],
      [0, 1, 2], [1, 1, 1],
      [0, 2, 1]
    ]
  },
  "RightShortThrow": {
    "status": ["throwing"],
    "to": "ground",
    "weight": {
      "handling": 1
    },
    "relatives": [
      [0, -2, 1],
      [-1, -1, 1], [0, -1, 2],
      [-1, 0, 2],
      [-1, 1, 1], [0, 1, 2],
      [0, 2, 1]
    ]
  },
  "Score": {
    "status": ["shooting"],
    "to": "kickoff",
    "score": 1
  }
}