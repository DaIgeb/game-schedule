import { TTeam, TPlayer } from './types'

const createTeam = (players: TPlayer[], team_size: number, base_team: TTeam, currentPlayerIdx: number): TTeam[] => {
  const teams: TTeam[] = [];
  for (let playerIdx = currentPlayerIdx + 1; playerIdx < players.length; playerIdx++) {
    const team = {
      players: [
        ...base_team.players,
        players[playerIdx]
      ]
    };

    if (team.players.length < team_size) {
      teams.push(...createTeam(players, team_size, team, playerIdx));
    } else {
      teams.push(team);
    }
  }

  return teams;
};

export const buildTeams = (players: string[], team_size: number): TTeam[] => {
  const teams = [];
  for (let playerIdx = 0; playerIdx < players.length; playerIdx++) {
    teams.push(...createTeam(players, team_size, { players: [players[playerIdx]] }, playerIdx));
  }

  return teams;
};
