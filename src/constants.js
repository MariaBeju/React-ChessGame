import { createPosition } from './helper'
export const Status = {
    'ongoing' : 'In desfasurare',
    'white' : 'Alb castiga',
    'black' : 'Negru castiga',
    'insufficient' : 'Remiza',
}

export const initGameState = {
  position: [createPosition()],
  turn: "w",
  candidateMoves: [],
  status: Status.ongoing,
  castleDirection: {
    w: "both",
    b: "both",
  },
};