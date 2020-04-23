/**
 * Handle external requests
 */

const Actions = ['ACTIVE_ACCOUNT', 'SIGN', 'SIGN_TX', 'SEND_TX'] as const;
type Action = typeof Actions[number];
const ActionsToEventName: Record<Action, string> = {
  'ACTIVE_ACCOUNT': 'AERGO_ACTIVE_ACCOUNT',
  'SIGN': 'AERGO_SIGN_RESULT',
  'SIGN_TX': 'AERGO_SIGN_TX_RESULT',
  'SEND_TX': 'AERGO_SEND_TX_RESULT',
}

enum MsgType {
  Request = 'AERGO_REQUEST',
  Response = 'AERGO_RESPONSE',
  Cancel = 'AERGO_CANCEL',
}

interface Message {
  type: MsgType.Request;
  action: Action;
  data: any;
}

export class ExternalRequest {
  action: Action;
  port: any;
  origin: string;
  data: any;

  constructor(port: any, action: Action, data: any) {
    this.port = port;
    this.action = action;
    this.data = data;
    this.origin = port.sender.origin;
  }

  sendSuccess(result: any): void {
    this.port.postMessage({
      type: MsgType.Response,
      eventName: ActionsToEventName[this.action],
      result
    });
  }

  sendCancel(result: any): void {
    this.port.postMessage({
      type: MsgType.Cancel,
      eventName: ActionsToEventName[this.action],
      result,
    });
  }

  static fromPortMessage(port: any, msg: Message): ExternalRequest {
    if (msg.type !== MsgType.Request) {
      throw new Error(`invalid message type ${msg.type}`);
    }
    const action = msg.action || '';
    if (Actions.indexOf(action) === -1) {
      throw new Error(`invalid message action type ${action}`);
    }
    return new ExternalRequest(port, action, msg.data);
  }
}