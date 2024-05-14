import arbiter from '../../arbiter/arbiter';
import { useAppContext }from '../../contexts/Context'
import { generateCandidates } from '../../reducer/actions/move';

const Piece = ({
    row,
    col,
    piece,
}) => {

    const { appState, dispatch } = useAppContext();
    const { turn, castleDirection, position : currentPosition } = appState

    const onDragStart = e => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain",`${piece},${row},${col}`)
        
        setTimeout(() => {
            e.target.style.display = 'none';
        }, 0);

        if (turn === piece[0]){
            const candidateMoves = 
                arbiter.getValidMoves({
                    position : currentPosition[currentPosition.length - 1],
                    prevPosition : currentPosition[currentPosition.length - 2],
                    castleDirection : castleDirection[turn],
                    piece,
                    col,
                    row
                });

            dispatch(generateCandidates({candidateMoves}))
        }

    }

    const onDragEnd = e => {
       e.target.style.display = 'block'
    };
 
    return (
      <div
        className={`piece ${piece} p-${col}${row} ${
          appState.turn !== piece.charAt(0) ? "disable-turn" : ""
        }`}
        draggable={true}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />
    );
}

export default Piece