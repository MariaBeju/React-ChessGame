import "./Board.css";
import { useAppContext } from "../../contexts/Context";
import Rows from "./bits/Rows";
import Cols from "./bits/Cols";
import Pieces from "../Pieces/Pieces";
import Popup from "../Popup/Popup";
import GameEnds from "../Popup/GameEnds/GameEnds";
import arbiter from "../../arbiter/arbiter";
import { getKingPosition } from "../../arbiter/getMoves";
import { setupNewGame } from '../../reducer/actions/game';

const Board = (props) => {

  const rows = Array(8).fill().map((x, i) => 8 - i);
  const cols = Array(8).fill().map((x, i) => i + 1);
  const { appState, dispatch } = useAppContext();
  const position = appState.position[appState.position.length - 1];

  const checkSquare = (() => {
    const isInCheck = arbiter.isPlayerInCheck({
      positionAfterMove: position,
      player: appState.turn,
    });

    if (isInCheck) return getKingPosition(position, appState.turn);

    return null;
  })();

  const getClassName = (i, j) => {
    let squareClass = "square";
    squareClass += (i + j) % 2 === 0 ? " square--dark " : " square--light ";
    if (appState.candidateMoves.length) {
        squareClass += " disable-squares";
        if (appState.candidateMoves?.find((m) => m[0] === i && m[1] === j)) {
            if (position[i][j]) squareClass += " attacking";
            else squareClass += " highlight";
        }
    }

    if (checkSquare && checkSquare[0] === i && checkSquare[1] === j) {
        squareClass += " checked";
    }

    return squareClass;
  };

  const getCurrentGamer = () => {
    if (appState.turn === 'w') return 'Alb';
    return 'Negru';
  }
 
  const onResetGame = () => {
    localStorage.removeItem("lastPosition");
    localStorage.removeItem("nextTurn");
    dispatch(setupNewGame());
  };

  return (
    <div>
      <button className="newGameBtn" type="button" onClick={onResetGame}>
        Joc nou
      </button>
      <h2 className="currentGamer">Jucator curent: {getCurrentGamer()}</h2>
      <div className="board">
        <Rows rows={rows} />
        <div className="squares">
          {rows.map((row, i) =>
            cols.map((col, j) => (
              <div
                key={col + "" + row}
                className={`${getClassName(7 - i, j)}`}
              ></div>
            ))
          )}
        </div>

        <Pieces />
        <Popup>
          <GameEnds />
        </Popup>

        <Cols cols={cols} />
      </div>
    </div>
  );
};

export default Board;
