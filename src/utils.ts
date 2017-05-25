import { TTeam, TGame } from './types'

export const sameTeams = (leftGame: TGame, rightGame: TGame) => {
  if (samePlayers(leftGame.homeTeam, rightGame.homeTeam) && samePlayers(leftGame.guestTeam, rightGame.guestTeam)) {
    return true;
  }

  if (samePlayers(leftGame.homeTeam, rightGame.guestTeam) && samePlayers(leftGame.guestTeam, rightGame.homeTeam)) {
    return true;
  }

  return false;
}

export const samePlayers = (leftTeam: TTeam, rightTeam: TTeam) => {
  if (leftTeam.players.filter(p => rightTeam.players.indexOf(p) !== -1).length === leftTeam.players.length) {
    return true;
  }

  return false;
}

export const sameGames = (leftGames: TGame[], rightGames: TGame[]) => {
  if (leftGames.filter(g => rightGames.some(r => sameTeams(g, r))).length === leftGames.length) {
    return true;
  }

  return false;
}
