import * as fromTypes from './types';

export const buildScore = (rounds: fromTypes.TRound[]): fromTypes.TScore => {
  const allGames = rounds.reduce<fromTypes.TGame[]>((prev, cur) => [...prev, ...cur.games], []);

  const score = allGames.reduce<fromTypes.TScore>((prev, cur) => {
    for (const player of cur.homeTeam.players) {
      const playerScore = prev.players[player] || { opponents: {}, teamMates: {} };
      cur.homeTeam.players.filter(p => p !== player).forEach(p => playerScore.teamMates[p] = (playerScore.teamMates[p] || 0) + 1)

      for (const opponent of cur.guestTeam.players) {
        playerScore.opponents[opponent] = (playerScore.opponents[opponent] || 0) + 1
      }

      prev.players[player] = playerScore;
    }

    return prev;
  }, { players: {}, sameOpponent: {}, sameTeamMate: {} });

  Object.keys(score.players).forEach((cur) => {
    const player = score.players[cur];
    Object.keys(player.opponents).forEach(o => {
      const opponent = player.opponents[o];
      score.sameOpponent[opponent] = (score.sameOpponent[opponent] || 0) + 1;
    });
    Object.keys(player.teamMates).forEach(o => {
      const teamMate = player.teamMates[o];
      score.sameTeamMate[teamMate] = (score.sameTeamMate[teamMate] || 0) + 1;
    });
  });

  return score;
}

export const compareScore = (left: fromTypes.TScore, right: fromTypes.TScore): number => {
  const sameOpponentsLeft = Object.keys(left.sameOpponent).map(k => parseInt(k)).sort((left: number, right: number) => left - right);
  const sameOpponentsRight = Object.keys(right.sameOpponent).map(k => parseInt(k)).sort((left: number, right: number) => left - right);
  for (let i = 0; i < Math.max(sameOpponentsLeft.length, sameOpponentsRight.length); i++) {
    if (sameOpponentsLeft.length < i) {
      return -1;
    }
    if (sameOpponentsRight.length < i) {
      return 1;
    }
    if (left.sameOpponent[sameOpponentsLeft[i]] < right.sameOpponent[sameOpponentsRight[i]]) {
      return -1;
    }
    if (left.sameOpponent[sameOpponentsLeft[i]] > right.sameOpponent[sameOpponentsRight[i]]) {
      return 1;
    }
  }

  const sameTeamMatesLeft = Object.keys(left.sameTeamMate).map(k => parseInt(k)).sort((left: number, right: number) => left - right);
  const sameTeamMatesRight = Object.keys(right.sameTeamMate).map(k => parseInt(k)).sort((left: number, right: number) => left - right);
  for (let i = 0; i < Math.max(sameTeamMatesLeft.length, sameTeamMatesRight.length); i++) {
    if (sameTeamMatesLeft.length < i) {
      return -1;
    }
    if (sameTeamMatesRight.length < i) {
      return 1;
    }
    if (left.sameTeamMate[sameTeamMatesLeft[i]] < right.sameTeamMate[sameTeamMatesRight[i]]) {
      return -1;
    }
    if (left.sameTeamMate[sameTeamMatesLeft[i]] > right.sameTeamMate[sameTeamMatesRight[i]]) {
      return 1;
    }
  }

  return 0;
}