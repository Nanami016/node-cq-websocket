export enum WebSocketType {
  API = '/api',
  EVENT = '/event'
}
export enum WebSocketState {
  DISABLED = -1,
  INIT = 0,
  CONNECTING = 1,
  CONNECTED = 2,
  CLOSING = 3,
  CLOSED = 4
}
export interface CQRequestOptions {
  timeout: number
}
type WebSocketProtocol = "http:" | "https:" | "ws:" | "wss:"
export interface CQWebSocketOption {
  accessToken: string
  enableAPI: boolean
  enableEvent: boolean
  protocol: WebSocketProtocol
  host: string
  port: number
  baseUrl: string
  qq: number | string
  reconnection: boolean
  reconnectionAttempts: number
  reconnectionDelay: number
  fragmentOutgoingMessages: boolean
  fragmentationThreshold: number
  tlsOptions: any
  requestOptions: CQRequestOptions
}

type BaseEvents = 'message'
                    | 'notice'
                    | 'request'
                    | 'error'
                    | 'ready'
type MessageEvents = 'message.private'
                    | 'message.discuss'
                    | 'message.discuss.@'
                    | 'message.discuss.@.me'
                    | 'message.group'
                    | 'message.group.@'
                    | 'message.group.@.me'

type NoticeEvents = 'notice.group_upload'
                    | 'notice.group_admin.set'
                    | 'notice.group_admin.unset'
                    | 'notice.group_decrease.leave'
                    | 'notice.group_decrease.kick'
                    | 'notice.group_decrease.kick_me'
                    | 'notice.group_increase.approve'
                    | 'notice.group_increase.invite'
                    | 'notice.friend_add'
                    // node
                    | 'notice.group_admin'
                    | 'notice.group_decrease'
                    | 'notice.group_increase'

type RequestEvents = 'request.friend'
                    | 'request.group.add'
                    | 'request.group.invite'
                    // node
                    | 'request.group'

type SocketEvents = 'socket.connecting'
                    | 'socket.connect'
                    | 'socket.failed'
                    | 'socket.reconnecting'
                    | 'socket.reconnect'
                    | 'socket.reconnect_failed'
                    | 'socket.max_reconnect'
                    | 'socket.closing'
                    | 'socket.close'
                    | 'socket.error'

type APIEvents = 'api.send.pre' | 'api.send.post' | 'api.response'

type Events = BaseEvents | MessageEvents | NoticeEvents | RequestEvents | SocketEvents | APIEvents

type ListenerReturn = void | Promise<void>
type ArrayMessage = (CQTag|CQHTTPMessage)[]
type MessageListenerReturn = ListenerReturn | string | Promise<string> | ArrayMessage | Promise<ArrayMessage>
type MessageEventListener = (event: CQEvent, context: Record<string, any>, tags: CQTag[]) => MessageListenerReturn
type ContextEventListener = (context: Record<string, any>) => ListenerReturn
type SocketEventListener = (type: WebSocketType, attempts: number) => ListenerReturn
type SocketExcludeType = 'socket.connect' | 'socket.closing' | 'socket.close' | 'socket.error'

export interface ApiTimeoutError extends Error {

}

declare class CQEvent {
  readonly messageFormat: "string" | "array"
  stopPropagation (): void
  getMessage (): string | ArrayMessage
  setMessage (msg: string | ArrayMessage): void
  appendMessage (msg: string | CQTag | CQHTTPMessage): void
  hasMessage (): boolean
  onResponse (handler: (res: object) => void, options: number | CQRequestOptions): void
  onError (handler: (err: ApiTimeoutError) => void): void
}

export interface APIRequest {
  action: string,
  params?: any
}
export interface APIResponse<T> {
  status: string,
  retcode: number,
  data: T
}

export class CQWebSocket {
  constructor (opt?: Partial<CQWebSocketOption>)

  connect (wsType?: WebSocketType): CQWebSocket
  disconnect (wsType?: WebSocketType): CQWebSocket
  reconnect (delay: number, wsType?: WebSocketType): CQWebSocket
  isSockConnected (wsType: WebSocketType): CQWebSocket
  isReady (): boolean

  on (event_type: MessageEvents | 'message', listener: MessageEventListener): CQWebSocket
  on (event_type: NoticeEvents | RequestEvents | 'notice' | 'request', listener: ContextEventListener): CQWebSocket
  on (event_type: Exclude<SocketEvents, SocketExcludeType>, listener: SocketEventListener): CQWebSocket
  on (event_type: 'socket.connect', listener: (type: WebSocketType, socket: any, attempts: number) => void): CQWebSocket
  on (event_type: 'socket.closing', listener: (type: WebSocketType) => void): CQWebSocket
  on (event_type: 'socket.close', listener: (type: WebSocketType, code: number, desc: string) => void): CQWebSocket
  on (event_type: 'socket.error', listener: (type: WebSocketType, err: Error) => void): CQWebSocket
  on (event_type: 'api.send.pre', listener: (apiRequest: APIRequest) => void): CQWebSocket
  on (event_type: 'api.send.post', listener: () => void): CQWebSocket
  on (event_type: 'api.response', listener: (result: APIResponse<any>) => void): CQWebSocket
  on (event_type: 'error', listener: (err: Error) => void): CQWebSocket
  on (event_type: 'ready', listener: () => void): CQWebSocket

  once (event_type: MessageEvents | 'message', listener: MessageEventListener): CQWebSocket
  once (event_type: NoticeEvents | RequestEvents | 'notice' | 'request', listener: ContextEventListener): CQWebSocket
  once (event_type: Exclude<SocketEvents, SocketExcludeType>, listener: SocketEventListener): CQWebSocket
  once (event_type: 'socket.connect', listener: (type: WebSocketType, socket: any, attempts: number) => void): CQWebSocket
  once (event_type: 'socket.closing', listener: (type: WebSocketType) => void): CQWebSocket
  once (event_type: 'socket.close', listener: (type: WebSocketType, code: number, desc: string) => void): CQWebSocket
  once (event_type: 'socket.error', listener: (type: WebSocketType, err: Error) => void): CQWebSocket
  once (event_type: 'api.send.pre', listener: (apiRequest: APIRequest) => void): CQWebSocket
  once (event_type: 'api.send.post', listener: () => void): CQWebSocket
  once (event_type: 'api.response', listener: (result: APIResponse<any>) => void): CQWebSocket
  once (event_type: 'error', listener: (err: Error) => void): CQWebSocket
  once (event_type: 'ready', listener: () => void): CQWebSocket

  off (event_type: Events, listener: Function): CQWebSocket
}
export interface CQWebSocket {
  <T>(method: string, params?: Record<string, any>, options?: number | CQRequestOptions): Promise<APIResponse<T>>
}

export default CQWebSocket

/******************************************/

type Serializable = string | number | boolean

interface CQHTTPMessage {
  type: string
  data: Record<string, string> | null
}

declare class CQTag {
  readonly tagName: string
  readonly data: Readonly<Record<string, Serializable>>
  modifier: Record<string, Serializable>

  equals(another: CQTag): boolean
  coerce(): this
  toJSON(): CQHTTPMessage
  valueOf(): string
  toString(): string
}

export class CQAt extends CQTag {
  readonly qq: number
  constructor(qq: number)
}

export class CQAnonymous extends CQTag {
  constructor(shouldIgnoreIfFailed?: boolean)
  shouldIgnoreIfFailed(): boolean
}

export class CQBFace extends CQTag {
  readonly id: number

  /**
   * To send a bface, not only `id` but also `p`,
   * which is the name of child directory of `data/bface`,
   * is required.
   * @see https://github.com/richardchien/coolq-http-api/wiki/CQ-%E7%A0%81%E7%9A%84%E5%9D%91
   */
  constructor (id: number, p: string)
}

export class CQCustomMusic extends CQTag {
  readonly url: string
  readonly audio: string
  readonly title: string
  readonly content?: string
  readonly image?: string
  constructor(url: string, audio: string, title: string, content?: string, image?: string)
}

export class CQDice extends CQTag {
  readonly type: number
  constructor()
}

export class CQEmoji extends CQTag {
  readonly id: number
  constructor(id: number)
}

export class CQFace extends CQTag {
  readonly id: number
  constructor(id: number)
}

export class CQImage extends CQTag {
  readonly file: string
  readonly url?: string
  constructor(file: string, ignoreCache?: boolean)
}

export class CQMusic extends CQTag {
  readonly type: string
  readonly id: number
  constructor(type: string, id: number)
}

export class CQRecord extends CQTag {
  readonly file: string
  constructor(file: string, magic?: boolean)
  hasMagic(): boolean
}

export class CQRPS extends CQTag {
  readonly type: number
  constructor()
}

export class CQSFace extends CQTag {
  readonly id: number
  constructor(id: number)
}

export class CQShake extends CQTag {
  constructor()
}

export class CQShare extends CQTag {
  readonly url: string
  readonly title: string
  readonly content?: string
  readonly image?: string
  constructor(url: string, title: string, content?: string, image?: string)
}

export class CQText extends CQTag {
  readonly text: string
  constructor(text: string)
}
