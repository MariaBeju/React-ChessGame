import { copyPosition } from "../helper"

export const movePiece = ({position,piece,row,col,x,y}) => {

    const newPosition = copyPosition(position)

    if(piece.endsWith('k') && Math.abs(y - col) > 1){ // Castles
        if (y === 2){ // Castles Long
            newPosition[row][0] = ''
            newPosition[row][3] = piece.startsWith('w') ? 'wr' : 'br'
        }
        if (y === 6){ // Castles Short
            newPosition[row][7] = ''
            newPosition[row][5] = piece.startsWith('w') ? 'wr' : 'br'
        }
    }
    
    newPosition[row][col] = ''
    newPosition[x][y] = piece
    return newPosition
}

export const movePawn = ({position,piece,row,col,x,y}) => {
  const newPosition = copyPosition(position);

  // EnPassant, looks like capturing an empty cell
  // Detect and delete the pawn to be removed
  if (!newPosition[x][y] && x !== row && y !== col) newPosition[row][y] = "";

  newPosition[row][col] = "";
  newPosition[x][y] = piece;
  return newPosition;
}