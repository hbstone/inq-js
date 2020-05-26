// restricts the range between 0 and 100, inclusive
function cap(val) {
  return Math.max(0, Math.min(100, val));
}

// finds the mean of a set of numbers
function avg(...inputs) {
  return Math.round(
    inputs.reduce((x, y) => {
      return x + y;
    }) / inputs.length
  );
}

// ignores the base stat, returns the inverse of the required stat (scaled between 0-100)
function deriveInverseStat(ch, ignored, x) {
  return cap(100 - x);
}

// treats the base stat as a linear modifier, returns an average of the two required stats
function deriveHumorStat(ch, modifier, x, y) {
  return cap(avg(x, y) + modifier);
}

// treats the base stat as a modifier, measures "balance" (maxes when the other four humors are exactly at their midpoints)
function deriveBalanceStat(ch, modifier, bld, ybl, bbl, phl) {
 const mean = avg(bld, ybl, bbl, phl);
  const variance = (
    Math.pow(bld - mean, 2) +
    Math.pow(ybl - mean, 2) +
    Math.pow(bbl - mean, 2) +
    Math.pow(phl - mean, 2)
  ) / 4;
  const stdev = Math.round(Math.sqrt(variance));
  const maxStdev = 35; // stdev when variance is maxed out
  return cap(100 - Math.round(stdev * (100 / maxStdev)) + modifier);
}

// treats the base stat as a linear modifer, added to a weighted average of two required stats
function deriveCombatStat(ch, modifier, primary, secondary) {
  return cap(
    modifier + (
      Math.round(
        primary +
        (secondary / 2)
      ) / 1.5
    )
  );
}

const stats = {
  axis: [{
    name: 'hot',
    base: 100,
    metadata: {
      name: {
        short: 'Hot',
        long: 'Hot',
      },
      description: 'TODO',
    },
  }, {
    name: 'wet',
    base: 100,
    metadata: {
      name: {
        short: 'Wet',
        long: 'Wet',
      },
      description: 'TODO',
    },
  }, {
    name: 'cld',
    base: 100,
    metadata: {
      name: {
        short: 'Cold',
        long: 'Cold',
      },
      description: 'TODO',
    },
    formula: {
      requires: ['hot'],
      fn: deriveInverseStat,
    },
  }, {
    name: 'dry',
    base: 100,
    metadata: {
      name: {
        short: 'Dry',
        long: 'Dry',
      },
      description: 'TODO',
    },
    formula: {
      requires: ['wet'],
      fn: deriveInverseStat,
    },
  }],
  basic: [{
    name: 'str',
    base: 100,
    metadata: {
      name: {
        short: 'Str',
        long: 'Strength',
      },
      description: 'TODO (primarily impacts physical power)',
    },
  }, {
    name: 'con',
    base: 100,
    metadata: {
      name: {
        short: 'Con',
        long: 'Constitution',
      },
      description: 'TODO (primarily impacts physical resistance)',
    },
  }, {
    name: 'dex',
    base: 100,
    metadata: {
      name: {
        short: 'Dex',
        long: 'Dexterity',
      },
      description: 'TODO (primarily impacts physical finesse)',
    },
  }, {
    name: 'int',
    base: 100,
    metadata: {
      name: {
        short: 'Int',
        long: 'Intelligence',
      },
      description: 'TODO (primarily impacts mental power)',
    },
  }, {
    name: 'wis',
    base: 100,
    metadata: {
      name: {
        short: 'Wis',
        long: 'Wisdom',
      },
      description: 'TODO (primarily impacts mental resistance)',
    },
  }, {
    name: 'cha',
    base: 100,
    metadata: {
      name: {
        short: 'Cha',
        long: 'Charisma',
      },
      description: 'TODO (primarily impacts mental finesse)',
    },
  }],
  humor: [{
    name: 'bld',
    base: 100,
    metadata: {
      name: {
        short: 'Blood',
        long: 'Blood',
      },
      description: 'TODO (hot and wet; air)',
    },
    formula: {
      requires: ['hot', 'wet'],
      fn: deriveHumorStat,
    },
  }, {
    name: 'ybl',
    base: 100,
    metadata: {
      name: {
        short: 'Yellow Bile',
        long: 'Yellow Bile',
      },
      description: 'TODO (hot and dry; fire)',
    },
    formula: {
      requires: ['hot', 'dry'],
      fn: deriveHumorStat,
    },
  }, {
    name: 'bbl',
    base: 100,
    metadata: {
      name: {
        short: 'Black Bile',
        long: 'Black Bile',
      },
      description: 'TODO (cold and dry; earth)',
    },
    formula: {
      requires: ['cld', 'dry'],
      fn: deriveHumorStat,
    },
  }, {
    name: 'phl',
    base: 100,
    metadata: {
      name: {
        short: 'Phlegm',
        long: 'Phlegm',
      },
      description: 'TODO (cold and wet; water)',
    },
    formula: {
      requires: ['cld', 'wet'],
      fn: deriveHumorStat,
    },
  }, {
    name: 'sol',
    base: 100,
    metadata: {
      name: {
        short: 'Soul',
        long: 'Soul',
      },
      description: 'TODO (measures how balanced the other 4 humors are)',
    },
    formula: {
      requires: ['bld', 'ybl', 'bbl', 'phl'],
      fn: deriveBalanceStat,
    },
  }],
  combat: [{
    name: 'php',
    base: 100,
    metadata: {
      name: {
        short: 'PhyPow',
        long: 'Physical Power',
      },
      description: 'TODO',
    },
    formula: {
      requires: ['str', 'sol'],
      fn: deriveCombatStat,
    },
  }, {
    name: 'phr',
    base: 100,
    metadata: {
      name: {
        short: 'PhyRes',
        long: 'Physical Resistance',
      },
      description: 'TODO',
    },
    formula: {
      requires: ['con', 'sol'],
      fn: deriveCombatStat,
    },
  }, {
    name: 'phf',
    base: 100,
    metadata: {
      name: {
        short: 'PhyFin',
        long: 'Physical Finesse',
      },
      description: 'TODO',
    },
    formula: {
      requires: ['dex', 'sol'],
      fn: deriveCombatStat,
    },
  }, {
    name: 'mep',
    base: 100,
    metadata: {
      name: {
        short: 'MntPow',
        long: 'Mental Power',
      },
      description: 'TODO',
    },
    formula: {
      requires: ['int', 'sol'],
      fn: deriveCombatStat,
    },
  }, {
    name: 'mer',
    base: 100,
    metadata: {
      name: {
        short: 'MntRes',
        long: 'Mental Resistance',
      },
      description: 'TODO',
    },
    formula: {
      requires: ['wis', 'sol'],
      fn: deriveCombatStat,
    },
  }, {
    name: 'mef',
    base: 100,
    metadata: {
      name: {
        short: 'MntFin',
        long: 'Mental Finesse',
      },
      description: 'TODO',
    },
    formula: {
      requires: ['cha', 'sol'],
      fn: deriveCombatStat,
    },
  }],
};

module.exports = [
  ...stats.axis,
  ...stats.basic,
  ...stats.humor,
  ...stats.combat,
];
