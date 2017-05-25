import { TTeam } from './types'

const createTeam = (teams: TTeam[], numberOfPlayers: number, base_teams: TTeam[], currentTeamIdx: number): TTeam[][] => {
  const groupedTeams: TTeam[][] = [];
  const currentPlayers = base_teams.reduce((prev, cur) => [...prev, ...cur.players], []);

  for (let teamIdx = currentTeamIdx + 1; teamIdx < teams.length; teamIdx++) {
    const currentTeam = teams[teamIdx];
    if (!currentTeam.players.some((player) => currentPlayers.indexOf(player) !== -1)) {
      const teamGroup = [
        ...base_teams,
        teams[teamIdx]
      ];

      if (currentPlayers.length + currentTeam.players.length < numberOfPlayers) {
        groupedTeams.push(...createTeam(teams, numberOfPlayers, teamGroup, teamIdx));
      } else {
        groupedTeams.push(teamGroup);
      }
    }
  }

  return groupedTeams;
};

export const groupTeams = (teams: TTeam[], numberOfPlayers: number): TTeam[][] => {
  const teamGroups: TTeam[][] = [];
  
  for (let teamIdx = 0; teamIdx < teams.length; teamIdx++) {
    teamGroups.push(...createTeam(teams, numberOfPlayers, [teams[teamIdx]], teamIdx));
  }

  return teamGroups;
};

