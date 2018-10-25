/**
 * @description Returns a random in from interval, min/max included
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */
function randomIntFromInterval(min, max) {
  // Min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * @description Takes/Converts Number/StringNr to Number - or return 0 if not possible,
 * (Used to perform calculations with empty strings)
 * @author Mikael Norlén
 * @param {Any} param
 * @returns {Number}
 */
export function toInt(param) {
  return parseInt(param, 10) || 0;
}

/**
 * @description Get winner/winners and return winner message
 * @author Mikael Norlén
 * @param {*} playerObjs
 * @returns {String}
 */
export function getWinnerMsg(playerObjs) {
  const topScore = Math.max(
    ...playerObjs.map(p => p.result[p.result.length - 1]),
  );

  if (playerObjs.length === 1) {
    return `You got ${topScore} points, well played!`;
  }

  const topPlayers = playerObjs
    .filter(p => p.result[p.result.length - 1] === topScore)
    .map(p => p.name);

  if (topPlayers.length > 1) {
    return `The winners are ${topPlayers.join(
      ' and ',
    )} with ${topScore} points!`;
  }
  return `The winner is ${topPlayers[0]} with ${topScore} points!`;
}

/**
 * @description Add shot result from correct interval to player obj
 * if prev not strike etc, also consider last round consecutive shots
 * @param {Obj} p
 * @param {Number} shotIndex
 * @param {Boolean} lastRound
 * @param {Boolean} lastShot
 */
function addShotResult(p, shotIndex, lastRound, lastShot) {
  const prevShotRes = p.shotResult[shotIndex - 1];
  let nextShotRes;
  // First in round, even (as first is 0), also true for odd lastShot
  if (!(shotIndex % 2)) {
    if (lastShot && prevShotRes !== 10) {
      // If you get a last shot and prev wasn't strike
      nextShotRes = randomIntFromInterval(0, 10 - prevShotRes);
    } else {
      nextShotRes = randomIntFromInterval(0, 10);
    }
  } else if (lastRound) {
    // Second shotIndex in lastRound, continue even if first is strike
    nextShotRes = randomIntFromInterval(
      0,
      10 - (prevShotRes === 10 ? 0 : prevShotRes),
    );
  } else {
    // Second in round, odd index
    nextShotRes = prevShotRes === 10
      ? ''
      : randomIntFromInterval(0, 10 - prevShotRes);
  }

  // Finally add shotresult
  p.shotResult.splice(shotIndex, 1, nextShotRes);
}

/**
 * @description Check if enough results follow and then add to result obj
 * @param {Obj} p
 * @param {Obj} shot
 * @param {Number} i
 * @param {Number} prevResult
 * @param {Number} shotIndex
 */
function addWhenResultsFollow(p, shot, i, prevResult, shotIndex) {
  const followingRes = p.shotResult
  // Strike can be sliced directly after as it's a round first shotIndex
  // (Necessary to get things right in last round)
    .slice(shot.i + (shotIndex === 'strike' ? 1 : 2))
    .filter(shotRes => shotRes !== '');

  // Add result for strike when 2 results follow; 1 for spare
  if (followingRes.length === (shotIndex === 'strike' ? 2 : 1)) {
    p.result.splice(
      i,
      1,
      prevResult
                + shot.first
                + (shotIndex === 'spare' ? shot.second : 0)
                + followingRes.reduce((a, b) => a + b, 0),
    );
  }
}

/**
 * @description Add result to player object if shots required exist to calculate
 * @author Mikael Norlén
 * @param {Obj} p
 * @param {Number} shotIndex
 */
function addResult(p, shotIndex) {
  // Loop through all results that are subject to calculation
  // As some results are added later/unorderly if strike/spare
  // Offset with -1 as calculations start when two shots played
  const calcRounds = (shotIndex + 1) / 2 - 1;

  for (let i = 0; i <= calcRounds; i += 1) {
    // If not yet calculated
    if (p.result[i] === '') {
      // Previous result or 0 if first
      const prevResult = i !== 0 ? p.result[i - 1] : 0;

      // Info about round shotResults
      const shot = {
        i: (i + 1) * 2 - 2,
        first: p.shotResult[i * 2],
        // Parse empty string to 0 if strike first shotIndex
        second: toInt(p.shotResult[i * 2 + 1]),
      };

      if (shot.first === 10) {
        // STRIKE
        // Add with following shotresults when 2 exist
        addWhenResultsFollow(p, shot, i, prevResult, 'strike');
      } else if (shot.first + shot.second === 10) {
        // SPARE
        // Add with following shotresult when 1 exists
        addWhenResultsFollow(p, shot, i, prevResult, 'spare');
      } else {
        // Just add shotResults from this round
        p.result.splice(i, 1, prevResult + shot.first + shot.second);
      }
    }
  }
}

/**
 * @description Make shot, add shot result and round result if calculable
 * @param {Obj} playerObjs
 * @param {Number} shotIndex
 * @param {Number} rounds
 */
export function makeShot(playerObjs, shotIndex, rounds) {
  const lastShot = shotIndex >= rounds * 2;
  const lastRound = shotIndex >= rounds * 2 - 2;
  playerObjs.forEach(p => {
    addShotResult(p, shotIndex, lastRound, lastShot);
    addResult(p, shotIndex, lastRound, lastShot);
  });
}

// Export test functions in test env
export const testObj = process.env.NODE_ENV === 'test'
  ? {
    toInt,
    getWinnerMsg,
    addShotResult,
    addResult,
  }
  : {};
