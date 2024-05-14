import { Status } from "../constants";
import actionTypes from "./actionTypes";
export const reducer = (state, action) => {

    switch (action.type) {
        case actionTypes.NEW_MOVE : {
            let {position,turn} = state 
            position = [
                ...position,
                action.payload.newPosition
            ]
            turn = turn === 'w' ? 'b' : 'w';

            localStorage.setItem("lastPosition", JSON.stringify(action.payload.newPosition));
            localStorage.setItem("nextTurn", turn === 'w' ? 'w' : 'b');
            return {
                ...state,
                position,
                turn,
            }
        }

        case actionTypes.SET_POSITIONS : {
            let {position} = state 
            position = [
                ...position,
                action.payload.positions
            ]

            return {
                ...state,
                position,
                turn: action.payload.nextTurn
            }
        }

        case actionTypes.GENERATE_CANDIDATE_MOVES : {
            return {
                ...state,
                candidateMoves: action.payload.candidateMoves
            }
        } 

        case actionTypes.CLEAR_CANDIDATE_MOVES : {
            return {
                ...state,
                candidateMoves : []
            }
        }

        case actionTypes.PROMOTION_CLOSE : {
            return {
                ...state,
                status : Status.ongoing,
                promotionSquare : null,
            }
        }

        case actionTypes.CAN_CASTLE : {
            let {turn,castleDirection} = state 
        
            castleDirection[turn] = action.payload
            
            return {
                ...state,
                castleDirection,
            }
        }

        case actionTypes.INSUFFICIENT_MATERIAL : {
            return {
                ...state,
                status : Status.insufficient
            }
        }

        case actionTypes.WIN : {
            return {
                ...state,
                status : action.payload === 'w' ? Status.white : Status.black
            }
        }

        case actionTypes.NEW_GAME : {
            return {
                ...action.payload,
            }
        }

        default:
            return state;
        }
    }
