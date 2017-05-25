import * as fs from 'fs';

import { allPlayers, team_size, number_of_rounds } from './constant';
import { buildTeams } from './teams';
import { groupTeams } from './group';
import { createRounds, buildRounds } from './round';
import { buildScore, compareScore } from './score';
import * as fromTypes from './types';

const start = new Date();
const teams = buildTeams(allPlayers, team_size);
const groupedTeams = groupTeams(teams, allPlayers.length);
const rounds = createRounds(groupedTeams);
const allPlays = buildRounds(rounds, [{ teams: rounds[0].teams, round: { games: rounds[0].games[0] } }], 1, number_of_rounds);

let reference: fromTypes.TRound[];
let referenceScore: fromTypes.TScore;
if (allPlays.length > 0) {
  reference = allPlays.reduce((prev, cur) => [...prev, cur.round], []);
  referenceScore = buildScore(reference);
}

const end = new Date();

fs.writeFileSync('groupedTeams.txt', groupedTeams.map(g => g.map(s => s.players.join())).join('\n'))

const seconds = (end.getTime() - start.getTime()) / 1000;
if (seconds > 60)
  console.log(`${seconds / 60} minutes`);
else
  console.log(`${seconds} seconds`);

if (reference) {
  console.log(reference.map(f => f.games.map(g => `${g.homeTeam.players.join()}:${g.guestTeam.players.join()}`).join('//')));
}
if (referenceScore) {
  console.log(JSON.stringify(referenceScore.sameOpponent, null, 2))
  console.log(JSON.stringify(referenceScore.sameTeamMate, null, 2))
}