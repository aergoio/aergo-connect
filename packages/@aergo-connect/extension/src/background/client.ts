import Dnode from 'dnode/browser.js';
import { EventEmitter } from 'events';
import { wrapClientApi, ApiMethods } from './api';

export default function connectToBackground(connectionStream: any): Promise<ApiMethods & EventEmitter> {
  return new Promise((resolve) => {
    console.log('connecting to background...');

    const eventEmitter = new EventEmitter();
    const dnode = Dnode({
      sendUpdate: function(state: any) {
        // Receive update from background
        eventEmitter.emit('update', state)
      },
    })
    connectionStream.pipe(dnode).pipe(connectionStream);
    dnode.once('remote', function(backgroundManager: any) {
      console.log('connected to remote');
      backgroundManager.on = eventEmitter.on.bind(eventEmitter);
      resolve(wrapClientApi(backgroundManager) as ApiMethods & EventEmitter);
    });
  });
}

