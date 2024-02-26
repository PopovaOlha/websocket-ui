import { randomInt } from 'crypto';
import { Position } from '../interfaces.js';
import { Board, BoardValue } from '../types.js';

function createEmptyValue<T>(size: number, val: T | null): Board<T> {
  return Array(size).fill(null).map(() => Array(size).fill(val));
}

function cloneBoardWithNewValue<T>(board: Board<T>, pos: Position, value: BoardValue<T>): Board<T> {
  const clonedBoard: Board<T> = board.map(row => [...row]);
  clonedBoard[pos.y][pos.x] = value;
  return clonedBoard;
}

function isInside(size: number, { x, y }: Position): boolean {
  return x >= 0 && x < size && y >= 0 && y < size;
}

function isFree<T>(board: Board<T>, pos: Position): boolean {
  return board[pos.y][pos.x] === null;
}

function getFreePositions<T>(board: Board<T>): Position[] {
  const positions: Position[] = [];
  board.forEach((row, y) => {
    row.forEach((_, x) => {
      if (board[y][x] === null) {
        positions.push({ x, y });
      }
    });
  });
  return positions;
}

function getRandomFreePosition<T>(board: Board<T>): Position | null {
  const positions = getFreePositions(board);
  if (!positions.length) return null;
  const randomIndex = randomInt(positions.length);
  return positions[randomIndex];
}

function setValue<T>(board: Board<T>, pos: Position, value: BoardValue<T>): Board<T> {
  return isInside(board.length, pos) ? cloneBoardWithNewValue(board, pos, value) : board;
}

function setValues<T>(board: Board<T>, positions: Position[], value: BoardValue<T>): Board<T> {
  return positions.reduce((acc, pos) => setValue(acc, pos, value), board);
}

function setAllValues<T>(size: number, val: BoardValue<T>): Board<T> {
  return createEmptyValue(size, val);
}

export {
  setValue,
  setValues,
  setAllValues,
  isInside,
  isFree,
  getFreePositions,
  getRandomFreePosition
};