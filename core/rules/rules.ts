import { MoveResult } from "../game/gameModel.js";
import { unparseSquare } from "../game/conversions.js";
import { Move, Player } from "../models.js";
import { GameBoard } from "../game/GameBoard.js";
import { pieceAtLocation } from "../utils/chessUtils.js";
import { GamePiece } from "./piece.js";


// check whether a move entered on a player's turn is valid. Do not call this from Piece.legalMove
export function validMove(board: GameBoard, move: Move, player: Player): boolean {
    return !!validMoveWithReason(board, move, player).move;
}

// check whether a move entered on a player's turn is valid. Do not call this from Piece.legalMove
export function validMoveWithReason(board: GameBoard, move: Move, player: Player): MoveResult {
    const pieceToMove: GamePiece | undefined = pieceAtLocation(board, move.from);
    if (!pieceToMove)
        return { 'move': null, 'reason': 'No piece at location ' + unparseSquare(move.from) };
    if (pieceToMove.state.player !== player)
        return { 'move': null, 'reason': `Player ${player} does not own piece ${pieceToMove.state.piece}` };
    if (!pieceToMove.legalMove(move.to, board.rules.rules.kingCheck, board))
        return { 'move': null, 'reason': `Piece ${pieceToMove.state.piece} cannot move to ${unparseSquare(move.to)}` };
    return { 'move': move, 'reason': null };

}