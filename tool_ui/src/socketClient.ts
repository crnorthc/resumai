// SocketClient.ts
import type { WebsocketPayloadTypes, ServerCallback, ServerEventsType, WebsocketRequestEventType } from './types';

export type ServerEventListeners = Map<keyof ServerEventsType, Set<ServerEventsType[keyof ServerEventsType]>>;

class SocketClient {
  private static instance: SocketClient;
  private socket: WebSocket | null = null;
  private listeners: ServerEventListeners = new Map();
  public connected = false;
  public shouldReconnect = true;

  private constructor() {}

  public static getInstance(): SocketClient {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient();
    }
    return SocketClient.instance;
  }

  public connect(applicant_id: string) {
    console.log('WebSocket connecting');
    if (this.connected || this.socket) return;

    this.socket = new WebSocket(`${import.meta.env.VITE_WEBSOCKET_BASE_URL}/ws/${applicant_id}`);

    this.socket.onopen = () => {
      this.connected = true;
      console.log('WebSocket connected');
    };

    this.socket.onclose = () => {
      this.connected = false;
      console.log('WebSocket disconnected');
      this.disconnect();
      if (this.shouldReconnect) {
        setTimeout(() => this.connect(applicant_id), 2000);
      }
    };

    this.socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        const eventName = parsed.type as WebsocketRequestEventType;
        const data = parsed?.data;
        const handlers = this.listeners.get(eventName);
        handlers?.forEach((cb) => {
          if (cb.length === 0) {
            (cb as () => void)();
          } else {
            cb(data);
          }
        });
      } catch (e) {
        console.error('Invalid WS message:', e);
      }
    };
  }

  public disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.connected = false;
    }
  }

  public on<K extends WebsocketRequestEventType>(event: K, callback: ServerCallback<K>) {
    if (!(event in this.listeners)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  public off<K extends WebsocketRequestEventType>(event: K, callback?: ServerCallback<K>) {
    if (!(event in this.listeners)) return;
    if (callback) {
      this.listeners.get(event)!.delete(callback);
    } else {
      this.listeners.delete(event);
    }
  }

  public emit<K extends WebsocketRequestEventType>(event: K, data: WebsocketPayloadTypes[K]) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
    const payload = JSON.stringify({ type: event, data });
    this.socket.send(payload);
  }
}

export default SocketClient;
