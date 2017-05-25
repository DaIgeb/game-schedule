import * as fs from 'fs';

import { TRound, TTeam, TGame, TScore, TGamesByTeams } from './types';
import { sameGames, samePlayers, sameTeams } from './utils';
import { buildScore, compareScore } from './score'

const createRound = (teams: TTeam[], numberOfRounds: number, base_rounds: TRound[], currentTeamIdx: number): TRound[][] => {
  const rounds: TRound[][] = [];

  for (let teamIdx = currentTeamIdx + 1; teamIdx < teams.length; teamIdx++) {
    const currentTeam = teams[teamIdx];
    const teamGroup = [
      ...base_rounds,
      teams[teamIdx]
    ];

    if (teamGroup.length < numberOfRounds) {
      rounds.push(...createRound(teams, numberOfRounds, [], teamIdx));
    } else {
      // rounds.push(teamGroup);
    }
  }

  return rounds;
};

const teamCombinations = (teams: TTeam[], base_teams: TTeam[], currentIdx: number): TTeam[][] => {
  const combinations: TTeam[][] = []
  for (let teamIdx = 0; teamIdx < teams.length; teamIdx++) {
    if (base_teams.indexOf(teams[teamIdx]) === -1) {
      const currentTeams = [
        ...base_teams,
        teams[teamIdx]
      ];

      if (currentTeams.length < teams.length) {
        combinations.push(...teamCombinations(teams, currentTeams, teamIdx + 1))
      } else {
        combinations.push(currentTeams);
      }
    }
  }

  return combinations;
}

const createGames = (teams: TTeam[]): TGame[] => {
  const games = [];
  switch (teams.length) {
    case 0:
      break;
    case 1:
      games.push({
        homeTeam: teams[0],
        guestTeam: undefined,
      })
    default:
      games.push({
        homeTeam: teams[0],
        guestTeam: teams[1],
      });
      games.push(...createGames(teams.slice(2)));
  }

  return games;
}

const reduceGames = (previous: TGame[][], newGames: TGame[]): TGame[][] => {
  if (!previous.some(g => sameGames(g, newGames))) {
    return [
      ...previous,
      newGames
    ];
  }

  return previous;
}

export const createRounds = (teamGroups: TTeam[][]): TGamesByTeams[] => {
  const rounds: TGame[][][] = [];
  const rounds2: TGamesByTeams[] = [];

  for (let teamIdx = 0; teamIdx < teamGroups.length; teamIdx++) {
    const teams = teamGroups[teamIdx];
    const combinations = teamCombinations(teams, [], 0);
    const games = combinations.map(c => createGames(c)).reduce(reduceGames, []);
    rounds.push(games);
    rounds2.push({ teams, games });
  }

  return rounds2;
};

export const buildRounds = (games: TGamesByTeams[], base: { teams: TTeam[], round: TRound }[], groupIndex: number, numberOfRounds: number): { teams: TTeam[], round: TRound }[] => {
  const rounds: TRound[][] = [];
  let currentBest: { score: TScore; result: { teams: TTeam[], round: TRound }[] };
  const baseTeams = base.reduce((prev, cur) => [...prev, ...cur.teams], []);
  const baseRounds = base.reduce((prev, cur) => [...prev, cur.round], []);
  for (let i = groupIndex; i < games.length; i++) {
    const potentialGames = games[i];
    if (baseTeams.some((baseTeam) => potentialGames.teams.indexOf(baseTeam) >= 0)) {

    } else {

      const bestOption = potentialGames.games.reduce<{ score: TScore; round: TRound }>((prev, cur) => {
        const currentRounds: TRound[] = [...baseRounds, { games: cur }];
        const currentScore = buildScore(currentRounds);

        if (!prev.score || compareScore(prev.score, currentScore) < 0) {
          console.log('Better round')
          return {
            score: currentScore,
            round: { games: cur }
          };
        }

        return prev;
      }, { score: undefined, round: undefined });

      if (bestOption.round) {
        if (!currentBest) {
          currentBest = { score: bestOption.score, result: [...base, { teams: potentialGames.teams, round: bestOption.round }] };
        } else if (base.length + 1 === numberOfRounds) {
          if (compareScore(currentBest.score, bestOption.score) < 0) {
            currentBest = { score: bestOption.score, result: [...base, { teams: potentialGames.teams, round: bestOption.round }] };
          }
        } else {
          return buildRounds(games, [...base, { teams: potentialGames.teams, round: bestOption.round }], groupIndex + 1, numberOfRounds);
        }
      }
    }
  }

  return currentBest.result;
}

const gameToString = (game: TGame) => {
  return `${game.homeTeam.players.join()}:${game.guestTeam.players.join()}`
}

let rountIdx = 1;