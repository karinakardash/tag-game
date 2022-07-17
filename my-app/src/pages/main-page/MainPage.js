import { useState, useEffect } from 'react';

const NUM_COLS = 4;
const NUM_ROWS = 4;
const NUM_ITEMS = NUM_ROWS * NUM_COLS;
const EMPTY_INDEX = NUM_ITEMS - 1;
const SHUFFLE_MOVES_RANGE = [60, 80];
const MOVE_DIRECTIONS = ['up', 'down', 'left', 'right'];

function rand (min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

class GameState {
  static getNewBoard () {
    const arr = Array(NUM_ITEMS).fill(0).map((x, index) => [
      Math.floor(index / NUM_ROWS), 
      index % NUM_COLS
    ]);
    return arr;
  }
  
  static trueGameBoard = GameState.getNewBoard();
  static instance = null;

  static getInstance () {
    if (!GameState.instance) GameState.instance = new GameState();
    return GameState.instance;
  }

  constructor () {
    this.startNewGame();
  }

  isSolved () {
    for (let i=0; i<NUM_ITEMS; i++) {
      if (this.board[i][0] !== GameState.trueGameBoard[i][0] 
          || this.board[i][1] !== GameState.trueGameBoard[i][1]) 
        return false;
    }
    return true;
  }
  
  startNewGame () {
    this.moves = 0;
    this.board = GameState.getNewBoard();
    this.stack = [];
    this.shuffle();
  }

  shuffle () {
    this.shuffling = true;
    let shuffleMoves = rand(...SHUFFLE_MOVES_RANGE);
    while (shuffleMoves-- > 0) {
      this.moveInDirection (MOVE_DIRECTIONS[rand(0,3)]);
    }
    this.shuffling = false;
  }
  
  canMoveItem (index) {
    if (index < 0 || index >= NUM_ITEMS) return false;
    
    const itemPos = this.board[index];
    const emptyPos = this.board[EMPTY_INDEX];
    if (itemPos[0] === emptyPos[0])
      return Math.abs(itemPos[1] - emptyPos[1]) === 1;
    else if (itemPos[1] === emptyPos[1])
      return Math.abs(itemPos[0] - emptyPos[0]) === 1;
    else return false;
  }
  
  moveItem (index) {
    if (!this.shuffling && this.isSolved()) return false;
    if (!this.canMoveItem(index)) return false;
    
    const emptyPosition = [...this.board[EMPTY_INDEX]];
    const itemPosition = [...this.board[index]];
    
    let boardAfterMove = [...this.board];    
    boardAfterMove[EMPTY_INDEX] = itemPosition;
    boardAfterMove[index] = emptyPosition;
    
    if (!this.shuffling) this.stack.push(this.board);
    this.board = boardAfterMove;
    if (!this.shuffling) this.moves += 1;
    
    return true;
  }
  
  cancel () {
    if (this.stack.length === 0) return false;
    this.board = this.stack.pop();
    this.moves -= 1;
  }
  
  moveInDirection (dir) {
    const empty= this.board[EMPTY_INDEX];
    const posToMove = dir === 'up' ? [empty[0]+1, empty[1]]
      : dir === 'down' ? [empty[0]-1, empty[1]]
      : dir === 'left' ? [empty[0], empty[1]+1]
      : dir === 'right' ? [empty[0], empty[1]-1]
      : empty;
    let itemToMove = EMPTY_INDEX;
    for (let i=0; i<NUM_ITEMS; i++) {
      if (this.board[i][0] === posToMove[0] && this.board[i][1] === posToMove[1]) {
        itemToMove = i;
        break;
      }
    }
    this.moveItem(itemToMove);
  }

  getState () {
    const _this = this;
    return {
      board: _this.board,
      moves: _this.moves,
      solved: _this.isSolved(),
    };
  }
}

function useGameState () {
  const gameState = GameState.getInstance();
  const [state, setState] = useState(gameState.getState());
  
  function newGame () {
    gameState.startNewGame();
    setState(gameState.getState());
  }
  
  function cancel () {
    gameState.cancel();
    setState(gameState.getState());
  }
  
  function move (index) {
    return function () {
      gameState.moveItem(index);
      setState(gameState.getState());
    }
  }
  
  useEffect(() => {
    document.addEventListener('keyup', function keyBoardListeners (event) {
      
      if (event.keyCode === 37) gameState.moveInDirection('left');
      else if (event.keyCode === 38) gameState.moveInDirection('up');
      else if (event.keyCode === 39) gameState.moveInDirection('right');
      else if (event.keyCode === 40) gameState.moveInDirection('down');
      
      setState(gameState.getState());
    });
    
  }, [gameState]);
  
  return [state.board, state.moves, state.solved, newGame, cancel, move];
}

function Item ({index, pos, onClick}) {
 
  const top = pos[0]*100 + 5;
  const left = pos[1]*100 + 5;
  const bgLeft = (index%4)*100 + 5;
  const bgTop = Math.floor(index/4)*100 + 5;
  const imageUrl = localStorage.getItem("url")
  
  return <div 
    className='item'
    onClick={onClick}
    style={{backgroundImage: `url(${imageUrl})`, top, left, backgroundPosition: `-${bgLeft}px -${bgTop}px`}} 
  />;
}
  
  function MainPage () {
    const [board, moves, solved, newGame, cancel, move] = useGameState();
    
    return (
      <div className='game-container'>
        <div className='game-header'>
          <div className='moves'>
            {moves}
          </div>
          <button className='big-button' onClick={cancel}> Cancel </button>
        </div>
        <div className='board'>
        {
          board.slice(0,-1).map((pos, index) => ( 
            <Item index={index} pos={pos} onClick={move(index)} />
          ))
        }
        { solved &&
            <div className='overlay'>
              <button className='big-button' onClick={newGame}>
                PLAY AGAIN 
              </button>
            </div>
        }
        </div>
      </div>
    );
  }
  
export default MainPage;
