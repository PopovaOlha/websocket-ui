import { RawData, WebSocket, WebSocketServer } from 'ws';
import { color } from '../utils/consoleStyling.js';
import { randomId } from '../utils/randomId.js';
import { WsContext, WsController, WsMessage } from '../interfaces.js';
import { Server } from 'http';

export interface Dependencies {
    server: Server;
    controller: WsController;
  }

const createWsServer = ({ server, controller }: Dependencies) => {
  const clients = new Map<number, WebSocket>();

  const broadcast = (
    msg: WsMessage | WsMessage[],
    ctxId?: WsContext['id'] | WsContext['id'][]
  ) => {
    try {
        const messages = Array.isArray(msg) ? msg : [msg];
        for (const message of messages) {
          const rawMessage = stringifyMessage(message);
          console.log(color.blue('⋙', rawMessage));
          const clientsToSend =
            ctxId === undefined
              ? [...clients.values()]
              : Array.isArray(ctxId)
              ? getConnectionsById(ctxId)
              : [getConnectionsById([ctxId])];
          clientsToSend.forEach((ws) => {
            if (ws instanceof WebSocket) {
              ws.send(rawMessage);
            } else if (Array.isArray(ws)) {
              ws.forEach((client) => client.send(rawMessage));
            }
          });
        }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.log(color.red('⊘ Error:', message));
    }
  };

  const onConnection = (ws: WebSocket) => {
    const ctx = createContext(ws);
    console.log(color.green('⊕', `Client connected ${ctx.id}`));
    ws.on('message', onConnectionMessage(ctx));
    ws.on('close', onConnectionClose(ctx));
  };

  const onClose = () => {
    console.log(color.magenta('⊗ Server closed'));
    [...clients.values()].forEach((ws) => ws.close());
  };

  const onConnectionMessage = (ctx: WsContext) => (rawMessage: RawData) => {
    try {
      console.log(color.yellow('⋘', rawMessage.toString()));
      const message = parseMessage(rawMessage);
      controller.handleMessage(message, ctx);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.log(color.red('⊘ Error:', message));
    }
  };

  const onConnectionClose = (ctx: WsContext) => () => {
    controller.handleClose(ctx);
    clients.delete(ctx.id);
    console.log(color.magenta('⊖', `Client disconnected ${ctx.id}`));
  };

  const parseMessage = (rawMessage: RawData) => {
    const { type, data: rawData } = JSON.parse(rawMessage.toString());
    const data = rawData ? JSON.parse(rawData) : undefined;
    return { type, data } as WsMessage;
  };

  const stringifyMessage = ({ type, data }: WsMessage) => {
    return JSON.stringify({ type, data: JSON.stringify(data), id: 0 });
  };

  const createContext = (ws: WebSocket): WsContext => {
    const id = randomId();
    clients.set(id, ws);
    return { id, send: (msg) => broadcast(msg, id), broadcast };
  };

  const getConnectionsById = (ids: number[] = []): WebSocket[] => {
    return ids.reduce((acc, id) => {
      const client = clients.get(id);
      if (client) acc.push(client);
      return acc;
    }, [] as WebSocket[]);
  };

  const wsServer = new WebSocketServer({ server });
  wsServer.on('connection', onConnection);
  wsServer.on('close', onClose);

  return wsServer;
};

export default createWsServer;