import actionTypes from '../actionTypes';

export const makeNewMove = ({newPosition}) => {
    return {
        type: actionTypes.NEW_MOVE,
        payload: {newPosition},
    }
}

export const setPositionsFromLocalStorage = ({positions, nextTurn }) => {
    return {
        type: actionTypes.SET_POSITIONS,
        payload: {positions, nextTurn},
    }
}

export const clearCandidates = () => {
    return {
        type: actionTypes.CLEAR_CANDIDATE_MOVES,
    }
}

export const generateCandidates = ({candidateMoves}) => {
    return {
        type: actionTypes.GENERATE_CANDIDATE_MOVES,
        payload: {
            candidateMoves: candidateMoves
        }
    }
}
