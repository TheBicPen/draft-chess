


import chessboard from "../lib/chessboard.js";
import { Game, MoveStatus } from "../core/game/game.js";
import { unparse } from "../core/game/conversions.js";
import starting_position from "../core/positions/1d_standard.js";
import { BoardState, Player } from "../core/models.js";
import { AIPlayer } from "../core/ai/interface.js";
import randomAI from "../core/ai/random.js";
import { RuleSet } from "../core/rules/piece.js";
import { SimpleRuleSet1D } from "../core/rules/simplePieces1D.js";
import { objToBoardObj } from "./core_adapter.js";

type action = "snapback" | "trash" | "drop";



// When a move is made via the UI, send that move and wait for a response move
function onMove(source: string, target: string, _piece: string,
    _newPos: string, _oldPos: string, _orientation: string): action {
    const move: string = source + "-" + target;
    if (game?.gameStatus.status !== "playing")
        return "snapback";
    const moveResult: MoveStatus = game.makeMove(Player.White, move);
    if (!moveResult.move) {
        console.log("Invalid move:", moveResult.reason);
        return 'snapback';
    }
    checkStatus();
    return 'drop';
}

// Callback for move: action is the action of the move that triggered the callback
// Get AI move.
function moveResponse(action: action): string | null {
    if (action !== "drop")
        return null;
    if (game?.gameStatus.status !== "playing")
        return null;
    const response: MoveStatus = game.makeMove(Player.Black, CPU.move(game.gameBoard, Player.Black));
    const AIMove = response.move && unparse(response.move);
    if (AIMove)
        checkStatus();
    else
        console.error("No move made. Not updating");
    return AIMove;
}

function checkStatus() {
    if (game?.gameStatus.status === "draw")
        window.alert(`Game is over! It's a draw!`);
    if (game?.gameStatus.status === "loss")
        window.alert(`Game is over! ${game.gameStatus.player} lost!`);

}


// global state
let game: Game;
const CPU: AIPlayer = new randomAI(0);


export default function startGame(element: string | Node) {
    const files = 1;
    const ranks = 8;
    const ruleSet: RuleSet = new SimpleRuleSet1D();
    const board: BoardState = starting_position;
    const config = {
        'columns': files,
        'rows': ranks,
        'onDrop': onMove,
        'moveCallback': moveResponse,
        'draggable': true,
        'showErrors': 'console'
    };

    game = new Game(ruleSet, board);
    const screenBoard = chessboard.constructor(element, config);
    screenBoard?.position(objToBoardObj(board), ranks, files);
}

