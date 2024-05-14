import './Pieces.css'
import Piece from './Piece'
import { useRef  } from 'react'
import { useAppContext }from '../../contexts/Context'
import { getCastlingDirections } from '../../arbiter/getMoves'
import { updateCastling, detectInsufficientMaterial, detectCheckmate} from '../../reducer/actions/game'
import { makeNewMove, clearCandidates } from '../../reducer/actions/move'
import arbiter from '../../arbiter/arbiter'

const Pieces = () => {

    const { appState , dispatch } = useAppContext();
    const currentPosition = appState.position[appState.position.length-1]

    const ref = useRef()

    const updateCastlingState = ({piece,col,row}) => {

        const direction = getCastlingDirections({
            castleDirection:appState.castleDirection,
            piece,
            col,
            row
        })

        if (direction){
            dispatch(updateCastling(direction))
        }
    }


    const calculateCoords = e => {
        const {top,left,width} = ref.current.getBoundingClientRect()
        const size = width / 8
        const y = Math.floor((e.clientX - left) / size) 
        const x = 7 - Math.floor((e.clientY - top) / size)

        return {x,y}
    }

    const move = e => {
        const {x,y} = calculateCoords(e)
        const [piece,row,col] = e.dataTransfer.getData("text").split(',')

        if(appState.candidateMoves.find(mutare => mutare[0] === x && mutare[1] === y)){


            const opponent = piece.startsWith('b') ? 'w' : 'b'
            const castleDirection = appState.castleDirection[`${piece.startsWith('b') ? 'white' : 'black'}`]

            if (piece.endsWith('r') || piece.endsWith('k')){
                updateCastlingState({piece,col,row})
            }

            const newPosition = arbiter.performMove({
                position:currentPosition,
                piece,row,col,
                x,y
            });

            dispatch(makeNewMove({newPosition}))
            
            if (arbiter.insufficientMaterial(newPosition))
                dispatch(detectInsufficientMaterial())

            else if (arbiter.isCheckMate(newPosition,opponent,castleDirection)){
                dispatch(detectCheckmate(piece[0]))
            }
        }
        dispatch(clearCandidates())
    }

    const onDrop = e => {
        e.preventDefault()
        
        move(e)
    }
    
    const onDragOver = e => {e.preventDefault()}

    return <div 
        className='pieces' 
        ref={ref} 
        onDrop={onDrop} 
        onDragOver={onDragOver} > 
        {currentPosition.map((r,row) => {
          
            return (
                r.map((f,col) => {
                  
                    return currentPosition[row][col] ? (
                      <Piece
                        key={row + "-" + col}
                        row={row}
                        col={col}
                        piece={currentPosition[row][col]}
                      />
                    ) : null;
                })   
            )
        })}
    </div>
}

export default Pieces