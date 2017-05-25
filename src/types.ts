export type TPlayer = string;

export type TRound = {
  games: TGame[];
};

export type TGame = {
  homeTeam: TTeam;
  guestTeam: TTeam;
};

export type TGroupedTeams = { [index: number]: TTeam[] };

export type TTeam = {
  players: TPlayer[];
};

export type TGamesByTeams = { teams: TTeam[], games: TGame[][] };

export type TSchedule = {
  rounds: TRound[];
};

export type TScore = {
  players: {
    [player: string]: {
      opponents: { [player: string]: number };
      teamMates: { [player: string]: number };
    };
  };
  sameOpponent: {[times: number]: number};
  sameTeamMate: {[number: number]: number};
};