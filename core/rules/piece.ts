import { PiecePosition, Square, Move, Rules } from "../models.js";
import { GameBoard } from "../game/GameBoard.js";


// legalMove only checks the piece's movement rules. The target location must be on the board
export interface GamePiece {
    state: PiecePosition;
    moveTo(location: Square): void;
    legalMove(location: Square, considerCheck: boolean, position: GameBoard): boolean;
    getLegalMoves(considerCheck: boolean, position: GameBoard): Square[];
    locationToMove(to: Square): Move;
}


// Hold the information necessary to instantiate a concrete game from an abstract board state
export interface RuleSet {
    rules: Rules;
    pieceToGamePiece(piece: PiecePosition): GamePiece;
}
