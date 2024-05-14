import arbiter from "./arbiter"

export const getRookMoves = ({position,piece,row,col}) => {
    const moves = []
    const us = piece[0]
    const enemy = us === 'w' ? 'b' : 'w'
    const direction = [
        [-1,0],
        [1,0],
        [0,-1],
        [0,1],
    ]

    direction.forEach((dir) => {
      for (let i = 1; i <= 8; i++) {
        const x = row + i * dir[0];
        const y = col + i * dir[1];
        if (position?.[x]?.[y] === undefined) break;
        if (position[x][y].startsWith(enemy)) {
          moves.push([x, y]);
          break;
        }
        if (position[x][y].startsWith(us)) {
          break;
        }
        moves.push([x, y]);
      }
    });

    return moves
}

export const getKnightMoves = ({position,row,col}) => {
    const moves = []
    const enemy = position[row][col].startsWith('w') ? 'b' : 'w'
    const candidates = [
        [-2,-1],
        [-2,1],
        [-1,-2],
        [-1,2],
        [1,-2],
        [1,2],
        [2,-1],
        [2,1],
    ]

    candidates.forEach(c => {
        const cell = position?.[row+c[0]]?.[col+c[1]]
        if(cell !== undefined && (cell.startsWith(enemy) || cell === '')){
            moves.push ([row+c[0],col+c[1]])
        }
    })
    return moves
}

export const getBishopMoves = ({position,piece,row,col}) => {
    const moves = []
    const us = piece[0]
    const enemy = us === 'w' ? 'b' : 'w'

    const direction = [
        [-1,-1],
        [-1,1],
        [1,-1],
        [1,1],
    ]

    direction.forEach(dir => {
        for (let i = 1; i <= 8; i++) {
            const x = row+(i*dir[0])
            const y = col+(i*dir[1])
            if(position?.[x]?.[y] === undefined)
                break
            if(position[x][y].startsWith(enemy)){
                moves.push ([x,y])
                break;
            }
            if(position[x][y].startsWith(us)){
                break
            }
            moves.push ([x,y])
        }
    })
    return moves
}

export const getQueenMoves = ({position,piece,row,col}) => {
    const moves = [
        ...getBishopMoves({position,piece,row,col}),
        ...getRookMoves({position,piece,row,col})
    ]
    
    return moves
}

export const getKingMoves = ({position,piece,row,col}) => {
    let moves = []
    const us = piece[0]
    const direction = [
        [1,-1], [1,0],  [1,1],
        [0,-1],         [0,1],
        [-1,-1],[-1,0], [-1,1],
    ]

    direction.forEach(dir => {
        const x = row+dir[0]
        const y = col+dir[1]
        if(position?.[x]?.[y] !== undefined && !position[x][y].startsWith(us))
        moves.push ([x,y])
    })
    return moves
}

export const getPawnMoves = ({position,piece,row,col}) => {

    const moves = []
    const dir = piece==='wp' ? 1 : -1

    // Move two squares on first move
    if (row % 5 === 1){
        if (position?.[row+dir]?.[col] === '' && position?.[row+dir+dir]?.[col] === ''){
            moves.push ([row+dir+dir,col])
        }
    }

    // Move one square
    if (!position?.[row+dir]?.[col]){
        moves.push ([row+dir,col])
    }

    return moves
}

export const getPawnCaptures =  ({position,prevPosition,piece,row,col}) => {

    const moves = []
    const dir = piece==='wp' ? 1 : -1
    const enemy = piece[0] === 'w' ? 'b' : 'w'

    // Capture enemy to left
    if (position?.[row+dir]?.[col-1] && position[row+dir][col-1].startsWith(enemy) ){
        moves.push ([row+dir,col-1])
    }

    // Capture enemy to right
    if (position?.[row+dir]?.[col+1] && position[row+dir][col+1].startsWith(enemy) ){
        moves.push ([row+dir,col+1])
    }

    // EnPassant
    // Check if enemy moved twice in last round
    const enemyPawn = dir === 1 ? 'bp' : 'wp'
    const adjacentCols = [col-1,col+1]
    if(prevPosition){
        if ((dir === 1 && row === 4) || (dir === -1 && row === 3)){
            adjacentCols.forEach(f => {
                if (position?.[row]?.[f] === enemyPawn && 
                    position?.[row+dir+dir]?.[f] === '' &&
                    prevPosition?.[row]?.[f] === '' && 
                    prevPosition?.[row+dir+dir]?.[f] === enemyPawn){
                        moves.push ([row+dir,f])
                    }
            })
        }
    }

    return moves
}


export const getCastlingMoves = ({position,castleDirection,piece,row,col}) => {
    const moves = []
    
    if (col !== 4 || row % 7 !== 0 || castleDirection === 'none'){
        return moves
    }

    if (piece.startsWith('w') ){

        if (arbiter.isPlayerInCheck({
            positionAfterMove : position,
            player : 'w'
        }))
            return moves

        if (['left','both'].includes(castleDirection) && 
            !position[0][3] && 
            !position[0][2] && 
            !position[0][1] &&
            position[0][0] === 'wr' &&
            !arbiter.isPlayerInCheck({
                positionAfterMove : arbiter.performMove({position,piece,row,col,x:0,y:3}),
                player : 'w'
            }) &&
            !arbiter.isPlayerInCheck({
                positionAfterMove : arbiter.performMove({position,piece,row,col,x:0,y:2}),
                player : 'w'
            })){
            moves.push ([0,2])
        }

        if (['right','both'].includes(castleDirection) && 
            !position[0][5] && 
            !position[0][6] &&
            position[0][7] === 'wr' &&
            !arbiter.isPlayerInCheck({
                positionAfterMove : arbiter.performMove({position,piece,row,col,x:0,y:5}),
                player : 'w'
            }) &&
            !arbiter.isPlayerInCheck({
                positionAfterMove : arbiter.performMove({position,piece,row,col,x:0,y:6}),
                player : 'w'
            }))
            {
            moves.push ([0,6])
        }
    }

    else {

        if (arbiter.isPlayerInCheck({
            positionAfterMove : position,
            player : 'b'
        }))
            return moves
            
        if (['left','both'].includes(castleDirection) && 
            !position[7][3] && 
            !position[7][2] && 
            !position[7][1] &&
            position[7][0] === 'br' &&
            !arbiter.isPlayerInCheck({
                positionAfterMove : arbiter.performMove({position,piece,row,col,x:7,y:3}),
                position : position,
                player : 'b'
            }) &&
            !arbiter.isPlayerInCheck({
                positionAfterMove : arbiter.performMove({position,piece,row,col,x:7,y:2}),
                position : position,
                player : 'b'
            })){
            moves.push ([7,2])
        }

        if (['right','both'].includes(castleDirection) && 
            !position[7][5] && 
            !position[7][6] &&
            position[7][7] === 'br' &&
            !arbiter.isPlayerInCheck({
                positionAfterMove : arbiter.performMove({position,piece,row,col,x:7,y:5}),
                position : position,
                player : 'b'
            }) &&
            !arbiter.isPlayerInCheck({
                positionAfterMove : arbiter.performMove({position,piece,row,col,x:7,y:6}),
                position : position,
                player : 'b'
            })){
            moves.push ([7,6])
        }
    }

    return moves

}

export const getCastlingDirections = ({castleDirection,piece,col,row}) => {
    col = Number(col)
    row = Number(row)
    const direction = castleDirection[piece[0]]

    if (piece.endsWith('k'))
        return 'none'

    if (col === 0 && row === 0 ){ 
        if (direction === 'both')
            return 'right'
        if (direction === 'left')
            return 'none'
    } 
    if (col === 7 && row === 0 ){ 
        if (direction === 'both')
            return 'left'
        if (direction === 'right')
            return 'none'
    } 
    if (col === 0 && row === 7 ){ 
        if (direction === 'both')
            return 'right'
        if (direction === 'left')
            return 'none'
    } 
    if (col === 7 && row === 7 ){ 
        if (direction === 'both')
            return 'left'
        if (direction === 'right')
            return 'none'
    } 
}

export const getPieces = (position, enemy) => {
    const enemyPieces = []
    position.forEach((row,x) => {
        row.forEach((col, y) => {
            if(position[x][y].startsWith(enemy))
                enemyPieces.push({
                    piece : position[x][y],
                    row : x,
                    col : y,
                })
        })
    })
    return enemyPieces
}

export const getKingPosition = (position, player) => {
    let kingPos 
    position.forEach((row,x) => {
        row.forEach((col, y) => {
            if(position[x][y].startsWith(player) && position[x][y].endsWith('k'))
                kingPos=[x,y]
        })
    })
    return kingPos
}