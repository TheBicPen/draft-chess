
import { Player, Square } from "../models";
import standard_board from "../positions/normal_chess";
import empty_board from '../positions/normal_empty';
import pawns_4x4 from '../positions/4x4_fullpawns';
import empty1x8 from '../positions/1x8_empty';
import { nextEmptySquare } from "../utils";


export default () => {
    console.log("Testing next empty square.");

    let val: Square | null;

    val = nextEmptySquare(standard_board, Player.White);
    console.assert(val && val.file === 0 && val.rank === 2);

    val = nextEmptySquare(standard_board, Player.Black);
    console.assert(val && val.file === 7 && val.rank === 5);

    val = nextEmptySquare(empty_board, Player.White);
    console.assert(val && val.file === 0 && val.rank === 0);

    val = nextEmptySquare(empty_board, Player.Black);
    console.assert(val && val.file === 7 && val.rank === 7);

    val = nextEmptySquare(pawns_4x4, Player.White);
    console.assert(val === null);

    val = nextEmptySquare(pawns_4x4, Player.Black);
    console.assert(val === null);

    val = nextEmptySquare(empty1x8, Player.White);
    console.assert(val && val.file === 0 && val.rank === 0);

    val = nextEmptySquare(empty1x8, Player.Black);
    console.assert(val && val.file === 0 && val.rank === 7);


}