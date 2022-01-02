import { moveResult } from "../game/game.js";
import { GameBoard, Move, Player } from "../models.js";
import { pieceAtLocation } from "../utils.js";
import { GamePiece } from "./piece.js";


// check whether a move entered on a player's turn is valid. Do not call this from Piece.legalMove
export function validMove(board: GameBoard, move: Move, player: Player): boolean {
    return !!validMoveReason(board, move, player).move;
}

// check whether a move entered on a player's turn is valid. Do not call this from Piece.legalMove
export function validMoveReason(board: GameBoard, move: Move, player: Player): moveResult {
    let pieceToMove: GamePiece | undefined = pieceAtLocation(board, move.from);
    if (!pieceToMove)
        return { 'move': null, 'reason': 'No piece at location' + JSON.stringify(move.from) };
    if (pieceToMove.state.player !== player)
        return { 'move': null, 'reason': `Player ${player} does not own piece ${pieceToMove.state.piece}` };
    if (!pieceToMove.legalMove(move.to, board.rules.kingCheck, board))
        return { 'move': null, 'reason': `Piece ${pieceToMove.state.piece} cannot move to ${move.to}` };
    return { 'move': move, 'reason': null };

}