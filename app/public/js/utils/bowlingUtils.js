function randomIntFromInterval(min, max) {
    // Min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function toInt(param) {
    return parseInt(param, 10) || 0;
}

export function getWinnerMsg(playerObjs) {
    const topScore = Math.max(
        ...playerObjs.map(p => p.result[p.result.length - 1]),
    );
    const topPlayers = playerObjs.filter(
        p => p.result[p.result.length - 1] === topScore,
    ).map(p => p.name);

    if (topPlayers.length > 1) {
        return `The winners are ${topPlayers.join(' and ')}!`;
    }
    return `The winner is ${topPlayers[0]}!`;
}

function addShotResult(p, subRound, lastRound, lastShot) {
    const prevShotRes = p.shotResult[subRound - 1];
    let nextShotRes;
    // First in round, even (as first is 0), also true for odd lastShot
    if (!(subRound % 2)) {
        if (lastShot && prevShotRes !== 10) {
            // If you get a last shot and prev wasn't strike
            nextShotRes = randomIntFromInterval(0, 10 - prevShotRes);
        } else {
            nextShotRes = randomIntFromInterval(0, 10);
        }
    } else if (lastRound) {
        // Second shot in lastRound, continue even if first is strike
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
    p.shotResult.splice(subRound, 1, nextShotRes);
}

// Add results when following exist
function addWhenResultsFollow(p, sub, i, prevResult, shot) {
    const followingRes = p.shotResult
        // Strike can be sliced directly after as it's a round first shot
        // (Necessary to get things right in last round)
        .slice(sub.i + (shot === 'strike' ? 1 : 2))
        .filter(shotRes => shotRes !== '');

    // Add result for strike when 2 results follow; 1 for spare
    if (followingRes.length === (shot === 'strike' ? 2 : 1)) {
        p.result.splice(
            i,
            1,
            prevResult
                + sub.first
                + (shot === 'spare' ? sub.second : 0)
                + followingRes.reduce((a, b) => a + b, 0),
        );
    }
}

function addResult(p, subRound) {
    // Loop through all results that are subject to calculation
    // As some results are added later/unorderly if strike/spare
    // Offset with -1 as calculations start when two subRounds played
    const calcRounds = (subRound + 1) / 2 - 1;

    for (let i = 0; i <= calcRounds; i += 1) {
        // If not yet calculated
        if (p.result[i] === '') {
            // Previous result or 0 if first
            const prevResult = i !== 0 ? p.result[i - 1] : 0;

            // Info about round shotResults
            const sub = {
                i: (i + 1) * 2 - 2,
                first: p.shotResult[i * 2],
                // Parse empty string to 0 if strike first subRound
                second: toInt(p.shotResult[i * 2 + 1]),
            };

            if (sub.first === 10) {
                // STRIKE
                // Add with following shotresults when 2 exist
                addWhenResultsFollow(p, sub, i, prevResult, 'strike');
            } else if (sub.first + sub.second === 10) {
                // SPARE
                // Add with following shotresult when 1 exists
                addWhenResultsFollow(p, sub, i, prevResult, 'spare');
            } else {
                // Just add shotResults from this round
                p.result.splice(i, 1, prevResult + sub.first + sub.second);
            }
        }
    }
}

export function playRound(playerObjs, subRound, rounds) {
    const lastShot = subRound >= rounds * 2;
    const lastRound = subRound >= rounds * 2 - 2;
    playerObjs.forEach(p => {
        addShotResult(p, subRound, lastRound, lastShot);
        addResult(p, subRound, lastRound, lastShot);
    });
}
