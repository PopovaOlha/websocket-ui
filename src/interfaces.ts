import { Server } from "http";

export interface WsMessage<T = unknown> {
    type: string;
    data: T;
    id: 0;
  }
  
  export interface WsContext {
    id: number;
    send: (msg: WsMessage | WsMessage[]) => void;
    broadcast: (msg: WsMessage | WsMessage[], conn?: number | number[]) => void;
  }
  
  export interface WsController {
    handleMessage: (msg: WsMessage, ctx: WsContext) => void;
    handleClose: (ctx: WsContext) => void;
  }

  export interface Data {
    id: number;
  }

  export interface Position {
    x: number;
    y: number;
  }
  
  export enum GameStatus {
    Created,
    Started,
    Finished,
  }
  
  export enum AttackStatus {
    Miss = 'miss',
    Shot = 'shot',
    Killed = 'killed',
  }
  
  export interface AttackResult {
    currentPlayer: number;
    status: AttackStatus;
    position: Position;
  }
  


  