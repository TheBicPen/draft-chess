import { fileToLetter, unparsePieceColour } from "../game/conversions.js";
import { GameBoard } from "../game/GameBoard.js";
import { BoardState, PiecePosition, Player, Square } from "../models.js";
import { GamePiece } from "../rules/piece.js";


// Return a list of possible positions within dimensions.
// Iterative implementation is much faster than functional implementation
export function enumeratePositions(dimensions: Square): Square[] {
    const out = [];
    for (let i = 0; i < dimensions.file; i++)
        for (let j = 0; j < dimensions.rank; j++)
            out.push({ 'file': i, 'rank': j });
    return out;
}


// Return array containing 0 to val-1, inclusive.
export function range(val: number): number[] {
    return [...new Array(val).keys()];
}


// Random int in range [0,val)
export function randRange(val: number): number {
    return Math.floor(Math.random() * val);
}

// Random element in range
export function randItem<T>(arr: T[]): T {
    return arr[randRange(arr.length)];
}


// get piece at location on game board. Result has correct truthiness.
export function pieceAtLocation(board: GameBoard, location: Square): GamePiece | undefined {
    return board.gamePieces.find(x => x.state.position.file === location.file && x.state.position.rank === location.rank);
}

// get piece at location on abstract board. Result has correct truthiness.
export function pieceAtLocation2(board: BoardState, location: Square): PiecePosition | undefined {
    return board.pieces.find(x => x.position.file === location.file && x.position.rank === location.rank);
}

// returns whether there are any pieces blocking the straight line from from to to
export function blocked(board: BoardState, from: Square, to: Square): boolean {
    const cur: Square = Object.assign({}, from);
    let file_diff = Math.abs(to.file - from.file);
    let rank_diff = Math.abs(to.rank - from.rank);
    const rank_up = to.rank > from.rank ? 1 : -1;
    const file_up = to.file > from.file ? 1 : -1;
    // exclude destination square
    while (file_diff > 1 || rank_diff > 1) {
        //move diagonally whenever possible
        if (file_diff > 1 && rank_diff > 1) {
            cur.rank += rank_up;
            cur.file += file_up;
            rank_diff -= 1;
            file_diff -= 1;
        }
        else if (rank_diff > file_diff) {
            cur.rank += rank_up;
            rank_diff -= 1;
        } else {
            cur.file += file_up;
            file_diff -= 1;
        }
        if (pieceAtLocation2(board, cur))
            return true;
    }
    return false;
}

// Returns whether any square in the list has a piece on it
export function blockedSquares(board: GameBoard, squares: Square[]): boolean {
    return squares.some(s => pieceAtLocation(board, s));
}

// get next empty square, in row-major order
export function nextEmptySquare(board: BoardState, player: Player): Square | null {
    const startingRank: number = player === Player.White ? 0 : board.boardDimensions.rank - 1;
    const endingRank: number = player === Player.White ? board.boardDimensions.rank : -1;
    const startingFile: number = player === Player.White ? 0 : board.boardDimensions.file - 1;
    const endingFile: number = player === Player.White ? board.boardDimensions.file : -1;
    const iter: number = player === Player.White ? 1 : -1;
    for (let rank = startingRank; rank !== endingRank; rank += iter)
        for (let file = startingFile; file !== endingFile; file += iter)
            if (!board.pieces.some(p => p.position.file === file && p.position.rank === rank))
                return { file, rank };
    return null;
}

// count pieces matching predicate
export function countPieces(board: BoardState, p: (pos: PiecePosition) => boolean): number {
    return board.pieces.filter(piece => p(piece)).length;
}

export function printBoard(board: BoardState) {
    console.log("  +-" + range(board.boardDimensions.file).map(_ => "-").join("-") + "-+");
    for (let rank = board.boardDimensions.rank - 1; rank >= 0; rank--) {
        const filePieces: string[] = range(board.boardDimensions.file).map(file => {
            const piece = board.pieces.find(p => p.position.file === file && p.position.rank === rank);
            return piece ? unparsePieceColour(piece.piece, piece.player) : " ";
        });
        filePieces.unshift((rank + 1).toString(), "|");
        filePieces.push("|");
        console.log(filePieces.join(" "));
    }
    console.log("  +-" + range(board.boardDimensions.file).map(_ => "-").join("-") + "-+");
    console.log("   ", range(board.boardDimensions.file).map(fileToLetter).map(f => f?.toUpperCase()).join(" "));
}

// temporary solution until structuredClone() makes it into node LTS
export function deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}
