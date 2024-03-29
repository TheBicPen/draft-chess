import deterministicAI from "../ai/deterministic.js";
import { minimaxAI } from "../ai/minimax.js";
import { minimaxAlphaBetaAI } from "../ai/minimaxAB.js";
import MyopicMiniMax from "../ai/myopic_minimax.js";
import { Game, GameStatus } from "../game/gameModel.js";
import { BoardState, Player } from "../models.js";
import { RuleSet } from "../rules/piece.js";
import { SimpleRuleSet } from "../rules/simplePieces.js";
import { moveEq } from "../tests/utils/moveEq.js";
import newBoard from "./generateBoard.js";


// both players make a ply -> 1 move
const MAX_MOVES = 100;

export function testMiniMaxes(board: BoardState, ruleSet: RuleSet, depth: number): [GameStatus, number] {

    const minimax = new minimaxAI(depth);
    const minimaxAB = new minimaxAlphaBetaAI(depth);
    const cpu3 = new MyopicMiniMax(new deterministicAI(1), 0.7);
    const game: Game = new Game(board, ruleSet);
    let move_count = 0;
    while (game.checkStatus().status === "playing" && move_count < MAX_MOVES) {
        const move1 = minimax.move(game.gameBoard, Player.White);
        const move2 = minimaxAB.move(game.gameBoard, Player.White);
        console.assert(moveEq, "", move1, move2);
        console.assert(minimax.val === minimaxAB.val, "", minimax.val, minimaxAB.val);
        console.log("passed", move_count);
        game.makeMove(Player.White, move1);
        if (game.checkStatus().status !== "playing")
            break;
        game.makeMove(Player.Black, cpu3.move(game.gameBoard, Player.Black));
        move_count++;
    }
    if (move_count === MAX_MOVES)
        game.checkStatus().status = "draw";
    return [game.checkStatus(), move_count];
}

testMiniMaxes(newBoard({ 'file': 3, 'rank': 9 }, 6, true), new SimpleRuleSet(), 3);